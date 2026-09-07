<template>
  <el-dialog
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      title="Изменить капитана команды"
      width="480px"
  >
    <div class="change-captain-content">
      <p class="hint">Выберите нового капитана из состава команды.</p>

      <div v-if="candidateMembers.length === 0 && !allowSearch" class="empty-state">
        В команде пока нет других участников, которым можно передать капитанство.
      </div>

      <div v-else class="candidates-list">
        <button
            v-for="member in candidateMembers"
            :key="member.id"
            type="button"
            class="candidate-item"
            :class="{ selected: selectedUserId === member.user.id }"
            @click="selectMember(member)"
        >
          <span class="candidate-name">{{ member.user.full_name }}</span>
          <span class="candidate-role">{{ getRoleName(member.role) }}</span>
        </button>
        <div v-if="selectedExternalUser" class="candidate-item selected">
          <span class="candidate-name">{{ selectedExternalUser.full_name }}</span>
          <span class="candidate-role">Новый участник</span>
        </div>
      </div>

      <button
          v-if="allowSearch"
          type="button"
          class="search-btn"
          @click="showSearch = true"
      >
        Найти другого участника
      </button>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <button class="cancel-btn" @click="$emit('update:modelValue', false)">Отмена</button>
        <button
            class="confirm-btn"
            :disabled="!selectedUserId || loading"
            @click="$emit('confirm', selectedUserId)"
        >
          {{ loading ? 'Сохранение...' : 'Назначить капитаном' }}
        </button>
      </div>
    </template>
  </el-dialog>

  <UserSearchModal
      v-if="showSearch"
      v-model="showSearch"
      :existing-members="excludedFromSearch"
      confirm-text="Назначить капитаном"
      title="Новый капитан команды"
      @select="handleSearchSelect"
  />
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import UserSearchModal from '../UserSearchModal.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  members: {
    type: Array,
    default: () => []
  },
  allowSearch: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:modelValue', 'confirm'])

const selectedUserId = ref(null)
const selectedExternalUser = ref(null)
const showSearch = ref(false)

const candidateMembers = computed(() => {
  return props.members.filter(member => {
    const role = member.role?.toUpperCase()
    return role === 'MEMBER'
  })
})

const excludedFromSearch = computed(() => {
  return props.members
    .filter(member => {
      const role = member.role?.toUpperCase()
      return role === 'TEAMLEAD' || role === 'MENTOR'
    })
    .map(member => member.user)
})

const getRoleName = (role) => {
  const upperRole = role?.toUpperCase()
  if (upperRole === 'TEAMLEAD') return 'Капитан'
  if (upperRole === 'MEMBER') return 'Участник'
  return role
}

watch(() => props.modelValue, (visible) => {
  if (visible) {
    selectedExternalUser.value = null
    selectedUserId.value = candidateMembers.value[0]?.user.id || null
  }
})

const selectMember = (member) => {
  selectedExternalUser.value = null
  selectedUserId.value = member.user.id
}

const handleSearchSelect = (user) => {
  selectedUserId.value = user.id
  const alreadyInTeam = candidateMembers.value.some(member => member.user.id === user.id)
  selectedExternalUser.value = alreadyInTeam ? null : user
}
</script>

<style scoped>
.change-captain-content {
  padding: 0.5rem 0;
}

.hint {
  margin: 0 0 16px;
  color: #64748b;
  font-size: 0.875rem;
}

.empty-state {
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  color: #64748b;
  font-size: 0.875rem;
}

.candidates-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.candidate-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 14px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
}

.candidate-item:hover {
  border-color: #93c5fd;
}

.candidate-item.selected {
  border-color: #2563eb;
  background: #eff6ff;
}

.candidate-name {
  font-weight: 600;
  color: #1e293b;
}

.candidate-role {
  font-size: 0.75rem;
  color: #64748b;
}

.search-btn {
  margin-top: 16px;
  padding: 8px 16px;
  background: white;
  color: #2563eb;
  border: 1px solid #2563eb;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.875rem;
}

.search-btn:hover {
  background: #eff6ff;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.cancel-btn {
  background: white;
  color: #606266;
  border: 1px solid #dcdfe6;
  padding: 8px 20px;
  border-radius: 8px;
  cursor: pointer;
}

.confirm-btn {
  padding: 8px 20px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.confirm-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
