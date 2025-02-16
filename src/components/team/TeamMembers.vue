<template>
  <div class="team-members">
    <h2 class="section-title">Участники команды</h2>
    <div class="members-list">
      <div v-for="member in members" :key="member.id" class="member-card">
        <div class="member-info">
          <div class="member-name">{{ member.user.full_name }}</div>
          <div class="member-role">{{ getRoleName(member.role) }}</div>
        </div>
        <div class="member-actions" v-if="isTeamLeader && member.user.id !== currentUserId">
          <button class="remove-btn" @click="confirmRemoveMember(member)">
            Удалить
          </button>
        </div>
      </div>
    </div>

    <el-dialog
        v-model="showConfirmDialog"
        title="Подтверждение удаления"
        width="400px"
    >
      <div class="confirm-content">
        <p>Вы действительно хотите удалить участника {{ selectedMember?.user.full_name }} из команды?</p>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <button class="cancel-btn" @click="showConfirmDialog = false">Отмена</button>
          <button
              class="confirm-btn"
              @click="removeMember"
              :disabled="removing"
          >
            {{ removing ? 'Удаление...' : 'Удалить' }}
          </button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import {teamsApi} from '@/api/teams'
import {useAuthStore} from '@/stores/auth'
import {ElMessage} from 'element-plus'

const authStore = useAuthStore()
const currentUserId = authStore.user?.id
const members = ref([])
const isTeamLeader = ref(false)
const showConfirmDialog = ref(false)
const selectedMember = ref(null)
const removing = ref(false)

const getRoleName = (role) => {
  const roles = {
    'TEAMLEAD': 'Лидер команды',
    'MEMBER': 'Участник'
  }
  return roles[role] || role
}

const confirmRemoveMember = (member) => {
  selectedMember.value = member
  showConfirmDialog.value = true
}

const removeMember = async () => {
  if (!selectedMember.value) return

  removing.value = true
  try {
    await teamsApi.removeTeamMember(selectedMember.value.team_id, selectedMember.value.id)
    members.value = members.value.filter(m => m.id !== selectedMember.value.id)
    showConfirmDialog.value = false
    ElMessage({
      message: 'Участник успешно удален из команды',
      type: 'success'
    })
  } catch (error) {
    console.error('Error removing team member:', error)
    ElMessage({
      message: 'Ошибка при удалении участника',
      type: 'error'
    })
  } finally {
    removing.value = false
  }
}

onMounted(async () => {
  try {
    const teamData = await teamsApi.getMyTeam()
    if (teamData) {
      const teamMembers = await teamsApi.getMyTeamMembers(teamData.id)
      members.value = teamMembers.members
      isTeamLeader.value = teamData.team_leader_id === currentUserId
    }
  } catch (error) {
    console.error('Error loading team members:', error)
  }
})
</script>

<style scoped>
.team-members {
  max-width: 800px;
}

.section-title {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1.5rem;
  font-weight: 500;
}

.members-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.member-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: white;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.member-card:hover {
  border-color: #5B51D8;
  box-shadow: 0 2px 8px rgba(91, 81, 216, 0.1);
}

.member-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.member-name {
  font-size: 1.1rem;
  color: #333;
  font-weight: 500;
}

.member-role {
  font-size: 0.9rem;
  color: #666;
}

.member-actions {
  display: flex;
  gap: 0.5rem;
}

.remove-btn {
  padding: 6px 16px;
  background: white;
  color: #f56c6c;
  border: 1px solid #f56c6c;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.remove-btn:hover {
  background: #fef0f0;
}

.confirm-content {
  padding: 1rem 0;
  color: #333;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1rem;
}

.cancel-btn {
  padding: 8px 20px;
  background: white;
  color: #606266;
  border: 1px solid #dcdfe6;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}
</style>