<template>
  <el-dialog
      v-model="visible"
      :title="role === 'mentor' ? 'Поиск наставника' : 'Поиск участника'"
      width="500px"
      :close-on-click-modal="false"
      class="user-search-dialog"
      :fullscreen="isMobile"
  >
    <div class="search-container">
      <el-input
          v-model="searchQuery"
          :placeholder="role === 'mentor' ? 'Введите ФИО наставника' : 'Введите ФИО участника'"
          :suffix-icon="Search"
          @input="handleSearch"
          class="search-input"
      />

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
                {{ role === 'mentor' ? user.mentor_info.job : user.participant_info.vuz }} |
                {{ role === 'mentor' ? user.mentor_info.job_title : user.participant_info.course }}
              </div>
            </div>
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
        <el-button @click="closeModal" class="footer-button">Отмена</el-button>
        <el-button
            type="primary"
            @click="addSelectedUser"
            :disabled="!selectedUser"
            class="footer-button"
        >
          Добавить участника
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import {ref, watch, onMounted} from 'vue';
import {Search} from '@element-plus/icons-vue';
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
  }
});

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
.user-search-dialog :deep(.el-dialog) {
  margin: 0 auto;
}

.user-search-dialog :deep(.el-dialog__body) {
  padding: 20px;
}

.search-container {
  margin-bottom: 20px;
  min-height: 40vh;
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 60vh;
}

.search-input {
  position: sticky;
  top: 0;
  z-index: 1;
  background: white;
}

.search-results {
  flex: 1;
  margin-top: 20px;
  border: 1px solid #EBEEF5;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.results-scrollbar {
  flex: 1;
  height: 100%;
}

.results-scrollbar :deep(.el-scrollbar__wrap) {
  height: 100%;
}

.results-scrollbar :deep(.el-scrollbar__view) {
  height: 100%;
}

.user-item {
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s;
  border-bottom: 1px solid #EBEEF5;
  position: relative;
}

.user-item.selected {
  background-color: #ECF5FF;
}

.user-item:last-child {
  border-bottom: none;
}

.user-item:hover {
  background-color: #F5F7FA;
}

.user-item:active {
  background-color: #E4E7ED;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.user-name {
  font-weight: 500;
  color: #303133;
  font-size: 16px;
}

.user-details {
  font-size: 14px;
  color: #909399;
}

.no-results, .search-hint {
  text-align: center;
  padding: 20px;
  color: #909399;
  font-size: 14px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 10px 0;
}

@media (max-width: 768px) {
  .user-search-dialog :deep(.el-dialog) {
    width: 60% !important;
    max-width: 100%;
    margin: 0;
    border-radius: 0;
  }

  .user-search-dialog :deep(.el-dialog__header) {
    padding: 16px;
    margin-right: 0;
    border-bottom: 1px solid #EBEEF5;
  }

  .user-search-dialog :deep(.el-dialog__body) {
    padding: 16px;
  }

  .user-search-dialog :deep(.el-dialog__footer) {
    padding: 16px;
    border-top: 1px solid #EBEEF5;
  }

  .search-container {
    height: calc(100vh - 180px);
  }

  .results-scrollbar :deep(.el-scrollbar__wrap) {
    height: 100%;
    -webkit-overflow-scrolling: touch;
  }

  .user-item {
    padding: 14px;
  }

  .dialog-footer {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    width: 100%;
  }

  .footer-button {
    width: 100%;
    margin-left: 0 !important;
  }

  .user-name {
    font-size: 15px;
  }

  .user-details {
    font-size: 13px;
  }

  .user-item {
    -webkit-tap-highlight-color: transparent;
  }

  .search-results :deep(.el-scrollbar__wrap) {
    -webkit-overflow-scrolling: touch;
  }
}

@media (max-width: 320px) {
  .user-search-dialog :deep(.el-dialog__title) {
    font-size: 16px;
  }

  .user-name {
    font-size: 14px;
  }

  .user-details {
    font-size: 12px;
  }
}
</style>