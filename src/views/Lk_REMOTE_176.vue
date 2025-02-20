<template>

    <div class="common-layout">
      <el-container>
        <el-aside width="20%">

        </el-aside>

        <el-main>
  <div class="stages-bg">

    <el-divider class="custom-divider" />

    <h1>ФИО</h1>
    <el-divider class="custom-divider" />

    <h1>Учебное заведение</h1>
    <el-divider class="custom-divider" />

    <h1>Номер телефона</h1>
    <el-divider class="custom-divider" />

    <h1>Почта</h1>
    <el-divider class="custom-divider" />

    <div class="button-container">
      <el-button type="primary" plain round @click="Move_To_Userdata_Edit">Редактировать профиль</el-button>
      <el-button type="primary" plain round @click="Move_To_ChangeParticipantEntry()">Редактировать заявку</el-button>
      <!-- v-if="isLogin() && isClient()" -->
    </div>
  </div>
</el-main>
        <el-aside width="20%">

        </el-aside>

      </el-container>
    </div>

</template>


<script lang="ts" setup>
  import PrimaryLayout from '../layouts/Header-Footer/PrimaryLayout.vue';
  import { useRouter } from 'vue-router';

  // const user = ref<UserDTO | null>(null);
  
  const router = useRouter();

//   // function isClient(): boolean { 
//   // const roles = user.value?.roles.map(({ name }) => name); 
//   // return roles?.includes(UserRoleEnum.CLIENT) ?? false; 
// }

// function isLogin(): boolean { 
// const roles = user.value?.roles.map(({ name }) => name); 
//   return roles?.includes(UserRoleEnum.TEAM_MEMBER) ?? false; 
// }

  function Move_To_Userdata_Edit() {
    router.push({
      path: '/lk_userdata_edit'
    });
  }

  function Move_To_ChangeParticipantEntry() {
    router.push({
      path: `/changeParticipantEntry`
    });
  }


</script>
   
   
<style scoped>

.stages-bg {
  padding: 20px;
  text-align: center;
  background-color: #00f;
  border-radius: 10px;
}

.avatar {
  margin: 20px 0;
}

.custom-divider {
  margin: 0 auto;
  border-color: #fff;
}

h1 {
  margin: 5px 0; /* Уменьшенные отступы для заголовков */
  color: #fff; /* Цвет текста */
}

.button-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
}

.el-button{
  margin-bottom: 5px;
}

.el-aside{
  color: black;
}

.white-text-fix {
  color: #303133;
}

.wrapper-for-correct-viewport { /* Чтобы пофиксить ту хуйню с отрыванием футера */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
  gap: 10px;
}

.stages-bg {
  border: 5px solid #3980FF;
  background: #5b97ff;  
  border-radius: 20px;
  text-align: center;
}

.button_use{
  padding-top: 20px;
  text-align: center;
}

h1 {
  font-size: 30px;
  margin: 10px;
}
</style>