<template>
  <div class="mentor-team-page">
    <div class="page-header">
      <el-button @click="router.push('/mentor/teams')" link>
        <el-icon><ArrowLeft /></el-icon>
        Назад к списку команд
      </el-button>
    </div>

    <TeamInfo
      :view-mode="'mentor'"
      :team-id="teamId"
      @update:team-info="handleTeamInfoUpdate"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import TeamInfo from '@/components/team/TeamInfo.vue'

const route = useRoute()
const router = useRouter()
const teamId = ref(route.params.id)

const handleTeamInfoUpdate = (team) => {
  console.log('Team info updated:', team)
}
</script>

<style scoped>
.mentor-team-page {
  padding: 2rem;
}

.page-header {
  margin-bottom: 2rem;
}
</style>