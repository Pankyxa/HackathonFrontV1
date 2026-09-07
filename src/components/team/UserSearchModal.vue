<template>
  <el-dialog
      v-model="visible"
      :title="dialogTitle"
      width="500px"
      :close-on-click-modal="false"
      class="user-search-dialog clean-corporate-modal"
      :fullscreen="isMobile"
  >
    <div class="search-container">
      <div class="search-input-wrapper">
        <el-icon class="search-icon"><Search /></el-icon>
        <el-input
            v-model="searchQuery"
            :placeholder="role === 'mentor' ? 'Введите ФИО наставника' : 'Введите ФИО участника'"
            @input="handleSearch"
            class="search-input"
            clearable
        />
      </div>

      <div class="search-results" v-if="searchResults.length > 0">
        <el-scrollbar class="results-scrollbar">
          <div
              v-for="user in searchResults"
              :key="user.id"
              class="user-item"
              :class="{ 'selected': selectedUser?.id === user.id }"
              @click="selectUser(user)"
          >
            <div class="user-info">
              <div class="user-name">{{ user.full_name }}</div>
              <div class="user-details">
                {{ role === 'mentor' ? (user.mentor_info?.job || '') : (user.participant_info?.vuz || '') }} |
                {{ role === 'mentor' ? (user.mentor_info?.job_title || '') : (user.participant_info?.course || '') }}
              </div>
            </div>
            <el-icon v-if="selectedUser?.id === user.id" class="check-icon"><Check /></el-icon>
            <el-icon v-else class="plus-icon"><Plus /></el-icon>
          </div>
        </el-scrollbar>
      </div>

      <div v-else-if="searchQuery.length >= 2 && !isLoading" class="no-results">
        Пользователи не найдены
      </div>

      <div v-if="searchQuery.length > 0 && searchQuery.length < 2" class="search-hint">
        Введите минимум 2 символа для поиска
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeModal" class="dialog-secondary-btn">Отмена</el-button>
        <el-button
            type="primary"
            @click="addSelectedUser"
            :disabled="!selectedUser"
            class="dialog-primary-btn"
        >
          {{ confirmText }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import {ref, watch, onMounted, computed} from 'vue';
import {Search, Check, Plus} from '@element-plus/icons-vue';
import {usersApi} from '@/api/users.js';
import {ElMessage} from 'element-plus';

const props = defineProps({
  modelValue: Boolean,
  existingMembers: {
    type: Array,
    default: () => []
  },
  role: {
    type: String,
    default: 'member'
  },
  title: {
    type: String,
    default: ''
  },
  confirmText: {
    type: String,
    default: 'Добавить участника'
  }
});

const dialogTitle = computed(() => {
  if (props.title) return props.title
  return props.role === 'mentor' ? 'Поиск наставника' : 'Поиск участника'
})

const emit = defineEmits(['update:modelValue', 'select']);

const visible = ref(props.modelValue);
const searchQuery = ref('');
const searchResults = ref([]);
const selectedUser = ref(null);
const isLoading = ref(false);
const isMobile = ref(false);

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
};

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});
watch(() => props.modelValue, (newValue) => {
  visible.value = newValue;
});

watch(visible, (newValue) => {
  emit('update:modelValue', newValue);
  if (!newValue) {
    searchQuery.value = '';
    searchResults.value = [];
    selectedUser.value = null;
  }
});

const debounce = (fn, delay) => {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
};

const performSearch = async () => {
  if (searchQuery.value.length < 2) {
    searchResults.value = [];
    return;
  }

  try {
    isLoading.value = true;
    const results = await usersApi.searchUsers(searchQuery.value, props.role);

    searchResults.value = props.role === 'mentor'
        ? results
        : results.filter(user => !props.existingMembers.some(member => member.id === user.id));
  } catch (error) {
    ElMessage.error('Ошибка при поиске пользователей');
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const handleSearch = debounce(performSearch, 300);

const selectUser = (user) => {
  selectedUser.value = user;
};

const addSelectedUser = () => {
  if (selectedUser.value) {
    emit('select', selectedUser.value);
    closeModal();
  }
};

const closeModal = () => {
  visible.value = false;
};
</script>

<style scoped>
.user-search-dialog :deep(.el-dialog__body) {
  padding: 24px;
}

.search-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 300px;
  max-height: 60vh;
}

/* Modern Search Input */
.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 16px; /* mb-4 - gap between title and input */
}

.search-icon {
  position: absolute;
  left: 12px;
  z-index: 1;
  color: #94a3b8; /* text-slate-400 */
  font-size: 18px;
  pointer-events: none;
}

.search-input {
  width: 100%;
}

.search-input :deep(.el-input__wrapper) {
  padding-left: 40px !important; /* pl-10 - Space for icon, ensure it doesn't overlap */
  padding-right: 12px;
  padding-top: 10px;
  padding-bottom: 10px;
  border: 1px solid #cbd5e1; /* border-slate-300 */
  border-radius: 8px; /* rounded-lg */
  box-shadow: none;
  transition: all 0.2s ease;
}

.search-input :deep(.el-input__wrapper.is-focus) {
  border-color: #2563eb; /* focus:border-blue-500 */
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); /* focus:ring-2 focus:ring-blue-500 */
}

.search-input :deep(.el-input__inner) {
  color: #1e293b; /* text-slate-800 */
  font-size: 16px;
}

/* Search Results */
.search-results {
  flex: 1;
  border: 1px solid #e2e8f0; /* border border-slate-200 */
  border-radius: 8px; /* rounded-lg */
  overflow: hidden;
  background: white;
  min-height: 200px;
  max-height: 50vh;
}

.results-scrollbar {
  height: 100%;
}

.results-scrollbar :deep(.el-scrollbar__wrap) {
  height: 100%;
}

.results-scrollbar :deep(.el-scrollbar__view) {
  padding: 0;
}

/* User Item - Clean Card Style */
.user-item {
  padding: 12px 16px; /* p-3 */
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid #f1f5f9; /* border-b border-slate-100 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
}

.user-item:last-child {
  border-bottom: none;
}

.user-item:hover {
  background: #f8fafc; /* hover:bg-slate-50 */
}

.user-item.selected {
  background: #eff6ff; /* bg-blue-50 */
  border-left: 3px solid #2563eb; /* border-l-3 border-blue-600 */
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.user-name {
  font-weight: 600; /* font-bold */
  color: #1e293b; /* text-slate-800 */
  font-size: 16px;
}

.user-details {
  font-size: 14px;
  color: #64748b; /* text-slate-500 */
}

.check-icon {
  color: #2563eb; /* text-blue-600 */
  font-size: 20px;
  flex-shrink: 0;
}

.plus-icon {
  color: #94a3b8; /* text-slate-400 */
  font-size: 18px;
  flex-shrink: 0;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.user-item:hover .plus-icon {
  opacity: 1;
}

.no-results, .search-hint {
  text-align: center;
  padding: 40px 20px;
  color: #64748b; /* text-slate-500 */
  font-size: 14px;
}

/* Dialog Footer */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

.dialog-primary-btn {
  background: #2563eb; /* bg-blue-600 */
  color: white;
  padding: 10px 16px;
  border-radius: 8px;
  border: none;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.dialog-primary-btn:hover:not(:disabled) {
  background: #1d4ed8; /* hover:bg-blue-700 */
}

.dialog-primary-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.dialog-secondary-btn {
  background: transparent;
  color: #475569; /* text-slate-600 */
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  font-weight: 500;
  transition: all 0.2s ease;
}

.dialog-secondary-btn:hover {
  background: #f1f5f9; /* hover:bg-slate-100 */
  border-color: #cbd5e1;
}

@media (max-width: 768px) {
  .user-search-dialog :deep(.el-dialog) {
    width: 95% !important;
    max-width: 100%;
    margin: 16px auto;
    border-radius: 12px;
  }

  .user-search-dialog :deep(.el-dialog__body) {
    padding: 16px;
  }

  .search-container {
    max-height: calc(100vh - 200px);
  }

  .search-results {
    max-height: calc(100vh - 300px);
  }

  .user-item {
    padding: 12px;
  }

  .user-name {
    font-size: 15px;
  }

  .user-details {
    font-size: 13px;
  }

  .dialog-footer {
    flex-direction: column;
    gap: 8px;
  }

  .dialog-footer .el-button {
    width: 100%;
  }

  .plus-icon {
    opacity: 1; /* Always visible on mobile */
  }
}
</style>
