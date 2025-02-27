<template>
  <div class="team-info" v-if="!loading">
    <TeamHeader
        :team-data="teamData"
        :team-logo="teamLogo"
        :is-team-leader="isTeamLeader"
        :statusText="statusText"
        :status-class="statusClass"
        @edit="showEditModal = true"
        @edit-logo="handleLogoSelect"
        @update:team-info="handleTeamInfoUpdate"
    />

    <TeamMembers
        :members="teamMembers"
        :is-team-leader="isTeamLeader"
        :current-user-id="currentUserId"
        @add-member="showUserSearch"
        @remove-member="confirmRemoveMember"
    />

    <TeamMentor
        :members="teamMembers"
        :is-team-leader="isTeamLeader"
        @add-mentor="showMentorSearch"
        @remove-mentor="confirmRemoveMentor"
    />

    <TeamDangerZone
        v-if="!authStore.isAdmin && stageStore.isRegistration"
        :is-team-leader="isTeamLeader"
        :is-team-member="isTeamMember"
        :is-team-mentor="isTeamMentor"
        @delete="showDeleteConfirm = true"
        @leave="showLeaveConfirm = true"
    />

    <TeamEditDialog
        v-if="showEditModal"
        v-model="showEditModal"
        :form-data="editFormData"
        :loading="loading"
        @save="saveTeamInfo"
    />

    <TeamPhotoEditorDialog
        v-if="showPhotoEditor"
        v-model="showPhotoEditor"
        :image-url="selectedImageUrl"
        :is-mobile="isMobile"
        @save="handleLogoChange"
    />

    <TeamMemberRemoveDialog
        v-if="showConfirmDialog && selectedMember"
        v-model="showConfirmDialog"
        :member="selectedMember"
        :removing="removing"
        @confirm="removeMember"
    />

    <TeamMentorRemoveDialog
        v-if="showMentorConfirmDialog && selectedMentor"
        v-model="showMentorConfirmDialog"
        :mentor="selectedMentor"
        :loading="loading"
        @confirm="removeMentor"
    />

    <TeamDeleteDialog
        v-if="showDeleteConfirm && teamData.team_name"
        v-model="showDeleteConfirm"
        :team-name="teamData.team_name"
        :deleting="deleting"
        @confirm="deleteTeam"
    />

    <TeamLeaveDialog
        v-if="showLeaveConfirm && teamData.team_name"
        v-model="showLeaveConfirm"
        :team-name="teamData.team_name"
        :leaving="leaving"
        @confirm="leaveTeam"
    />

    <UserSearchModal
        v-if="showAddMemberModal"
        v-model="showAddMemberModal"
        :existing-members="teamMembers.map(member => member.user)"
        @select="handleMemberSelect"
    />

    <UserSearchModal
        v-if="showMentorSearchModal"
        v-model="showMentorSearchModal"
        :existing-members="[...(teamMentor ? [teamMentor.user] : []), ...teamMembers.map(member => member.user)]"
        :role="'mentor'"
        @select="handleMentorSelect"
    />
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue'
import {teamsApi} from '@/api/teams'
import {useAuthStore} from '@/stores/auth'
import {useStageStore} from '@/stores/stage'
import {ElMessage} from 'element-plus'
import {useRouter} from 'vue-router'

import TeamHeader from './TeamHeader.vue'
import TeamMembers from './TeamMembers.vue'
import TeamMentor from './TeamMentor.vue'
import TeamDangerZone from './TeamDangerZone.vue'
import TeamEditDialog from './dialogs/TeamEditDialog.vue'
import TeamPhotoEditorDialog from './dialogs/PhotoEditorDialog.vue'
import TeamMemberRemoveDialog from './dialogs/TeamMemberRemoveDialog.vue'
import TeamMentorRemoveDialog from './dialogs/TeamMentorRemoveDialog.vue'
import TeamDeleteDialog from './dialogs/TeamDeleteDialog.vue'
import TeamLeaveDialog from './dialogs/TeamLeaveDialog.vue'
import UserSearchModal from './UserSearchModal.vue'

const router = useRouter()
const authStore = useAuthStore()
const stageStore = useStageStore()
const emit = defineEmits(['update:teamInfo'])

const props = defineProps({
  viewMode: {
    type: String,
    default: 'default'
  },
  teamId: {
    type: [String, Number],
    default: null
  }
})

// State
const teamData = ref({})
const teamMembers = ref([])
const teamMentor = ref(null)
const teamLogo = ref(null)
const selectedImageUrl = ref(null)

// UI state
const loading = ref(false)
const removing = ref(false)
const deleting = ref(false)
const leaving = ref(false)

// Dialog visibility state
const showEditModal = ref(false)
const showPhotoEditor = ref(false)
const showConfirmDialog = ref(false)
const showMentorConfirmDialog = ref(false)
const showDeleteConfirm = ref(false)
const showLeaveConfirm = ref(false)
const showAddMemberModal = ref(false)
const showMentorSearchModal = ref(false)

// Form data
const editFormData = ref({
  team_name: '',
  team_motto: ''
})

// Selected items
const selectedImage = ref(null)
const selectedMember = ref(null)
const selectedMentor = ref(null)

// Computed
const currentUserId = computed(() => authStore.user?.id)
const isTeamLeader = computed(() => {
  if (props.viewMode === 'mentor') {
    return false
  }
  return teamData.value?.team_leader_id === currentUserId.value
})
const isTeamMember = computed(() => {
  return teamMembers.value.some(
      member => member.user.id === currentUserId.value && member.role.toUpperCase() === 'MEMBER'
  )
})
const isTeamMentor = computed(() => {
  return teamMembers.value.some(
      member => member.user.id === currentUserId.value && member.role.toUpperCase() === 'MENTOR'
  )
})
const isMobile = computed(() => window.innerWidth <= 768)
const isMentorView = computed(() => props.viewMode === 'mentor')

const statusText = computed(() => {
  const status = teamData.value?.status_details?.status
  if (!stageStore.isRegistration && status !== 'active') {
    return 'Регистрация закрыта, все команды зарегистрированы'
  }
  switch (status) {
    case 'incomplete':
      return 'Неполный состав команды'
    case 'pending':
      return 'Некоторые участники ожидают подтверждения документов'
    case 'needs_update':
      return 'Некоторым участникам необходимо обновить личные данные'
    case 'active':
      return 'Вы участвуете в хакатоне'
    default:
      return 'Статус неизвестен'
  }
})

const statusClass = computed(() => {
  const status = teamData.value?.status_details?.status
  if (!stageStore.isRegistration && status !== 'active') {
    return 'status-needs-update'
  }
  switch (status) {
    case 'incomplete':
      return 'status-incomplete'
    case 'pending':
      return 'status-pending'
    case 'needs_update':
      return 'status-needs-update'
    case 'active':
      return 'status-active'
    default:
      return ''
  }
})

// Methods
const loadTeamData = async () => {
  try {
    loading.value = true
    const team = await teamsApi.getTeam(props.teamId)

    if (team) {
      teamData.value = team
      if (team.logo_file_id) {
        teamLogo.value = `${import.meta.env.VITE_API_URL}/teams/${team.id}/logo`
      }
      emit('update:teamInfo', team)

      const membersData = await teamsApi.getTeamMembers(team.id)
      teamMembers.value = membersData.members
      teamMentor.value = membersData.members.find(member => member.role === 'MENTOR')
    }
  } catch (error) {
    console.error('Error loading team data:', error)
    ElMessage({
      message: 'Ошибка при загрузке данных команды',
      type: 'error'
    })
  } finally {
    loading.value = false
  }
}

const handleTeamInfoUpdate = (updatedTeam) => {
  teamData.value = updatedTeam
  emit('update:teamInfo', updatedTeam)
}

const saveTeamInfo = async (formData) => {
  try {
    loading.value = true

    if (!formData.team_name || !formData.team_motto) {
      ElMessage({
        message: 'Название и девиз команды обязательны для заполнения',
        type: 'warning'
      })
      return
    }

    const updateData = {
      team_name: String(formData.team_name).trim(),
      team_motto: String(formData.team_motto).trim()
    }

    await teamsApi.updateTeamInfo(teamData.value.id, updateData)

    teamData.value = {
      ...teamData.value,
      ...updateData
    }

    emit('update:teamInfo', {
      ...teamData.value,
      updated_at: Date.now()
    })

    showEditModal.value = false
    ElMessage({
      message: 'Информация о команде успешно обновлена',
      type: 'success'
    })
  } catch (error) {
    console.error('Error updating team info:', error)
    ElMessage({
      message: 'Ошибка при обновлении информации о команде',
      type: 'error'
    })
  } finally {
    loading.value = false
  }
}

const handleLogoSelect = (file) => {
  if (file) {
    selectedImageUrl.value = URL.createObjectURL(file)
    showPhotoEditor.value = true
  }
}

const handleLogoChange = async (file) => {
  try {
    loading.value = true
    const teamId = teamData.value.id
    if (!teamId) {
      throw new Error('Team ID not found')
    }

    await teamsApi.updateTeamLogo(teamId, file)
    teamLogo.value = `${import.meta.env.VITE_API_URL}/teams/${teamId}/logo?t=${Date.now()}`

    emit('update:teamInfo', {
      ...teamData.value,
      logo_updated_at: Date.now()
    })

    showPhotoEditor.value = false
    ElMessage({
      message: 'Логотип команды успешно обновлен',
      type: 'success'
    })
  } catch (error) {
    console.error('Error uploading logo:', error)
    ElMessage({
      message: 'Ошибка при обновлении логотипа команды',
      type: 'error'
    })
  } finally {
    loading.value = false
  }
}

const confirmRemoveMember = (member) => {
  selectedMember.value = member
  showConfirmDialog.value = true
}

const removeMember = async () => {
  if (!selectedMember.value) return

  removing.value = true
  try {
    await teamsApi.removeTeamMember(teamData.value.id, selectedMember.value.id)
    teamMembers.value = teamMembers.value.filter(m => m.id !== selectedMember.value.id)
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

const confirmRemoveMentor = (mentor) => {
  selectedMentor.value = mentor
  showMentorConfirmDialog.value = true
}

const removeMentor = async () => {
  if (!selectedMentor.value) return

  try {
    loading.value = true
    await teamsApi.removeTeamMentor(teamData.value.id, selectedMentor.value.id)
    teamMembers.value = teamMembers.value.filter(member => member.role !== 'mentor')
    teamMentor.value = null
    showMentorConfirmDialog.value = false
    ElMessage({
      message: 'Наставник успешно удален из команды',
      type: 'success'
    })
  } catch (error) {
    console.error('Error removing team mentor:', error)
    ElMessage({
      message: 'Ошибка при удалении наставника',
      type: 'error'
    })
  } finally {
    loading.value = false
  }
}

const handleMentorSelect = async (user) => {
  try {
    loading.value = true

    if (!user?.id || !teamData.value?.id) {
      throw new Error('Необходимые данные отсутствуют')
    }

    await teamsApi.addTeamMentor(teamData.value.id, user.id)

    const membersData = await teamsApi.getTeamMembers(teamData.value.id)
    teamMembers.value = membersData.members

    const mentor = membersData.members.find(member => member.role === 'MENTOR')
    if (mentor) {
      teamMentor.value = mentor
    }

    showMentorSearchModal.value = false
    ElMessage({
      message: 'Приглашение наставнику успешно отправлено',
      type: 'success'
    })
  } catch (error) {
    console.error('Error adding team mentor:', error)
    ElMessage({
      message: error.message || 'Ошибка при добавлении наставника',
      type: 'error',
      duration: 5000
    })
  } finally {
    loading.value = false
  }
}

const deleteTeam = async () => {
  try {
    deleting.value = true
    await teamsApi.deleteTeam(teamData.value.id)

    ElMessage({
      message: 'Команда успешно удалена',
      type: 'success'
    })

    await authStore.updateUserInfo()
    router.push('/')
  } catch (error) {
    console.error('Error deleting team:', error)
    ElMessage({
      message: 'Ошибка при удалении команды',
      type: 'error'
    })
  } finally {
    deleting.value = false
    showDeleteConfirm.value = false
  }
}

const leaveTeam = async () => {
  try {
    leaving.value = true
    await teamsApi.leaveTeam()

    ElMessage({
      message: 'Вы успешно покинули команду',
      type: 'success'
    })

    await authStore.updateUserInfo()
    router.push('/')
  } catch (error) {
    console.error('Error leaving team:', error)
    ElMessage({
      message: error.message || 'Ошибка при выходе из команды',
      type: 'error'
    })
  } finally {
    leaving.value = false
    showLeaveConfirm.value = false
  }
}

const handleMemberSelect = async (user) => {
  try {
    loading.value = true
    await teamsApi.addTeamMember(teamData.value.id, {
      user_id: user.id,
      role: 'member'
    })

    const membersData = await teamsApi.getTeamMembers(teamData.value.id)
    teamMembers.value = membersData.members

    showAddMemberModal.value = false
    ElMessage({
      message: 'Приглашение в команду успешно отправлено',
      type: 'success'
    })
  } catch (error) {
    console.error('Error adding team member:', error)
    ElMessage({
      message: error.message || 'Ошибка при добавлении участника',
      type: 'error'
    })
  } finally {
    loading.value = false
  }
}

const showUserSearch = () => {
  const filteredMembers = teamMembers.value.filter(member =>
      member.role.toUpperCase() !== 'MENTOR'
  );

  if (filteredMembers.length >= 5) {
    ElMessage({
      message: 'Достигнуто максимальное количество участников (5)',
      type: 'warning'
    })
    return
  }
  showAddMemberModal.value = true
}

const showMentorSearch = () => {
  showMentorSearchModal.value = true
}

onMounted(() => {
  loadTeamData()
})
</script>

<style scoped>
.team-info {
  max-width: 800px;
}
</style>