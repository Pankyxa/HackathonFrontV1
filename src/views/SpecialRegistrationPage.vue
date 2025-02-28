<template>
  <div class="special-registration">
    <div class="registration-container">
      <h1>Специальная регистрация</h1>
      <form @submit.prevent="handleSubmit" class="registration-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input
              type="email"
              id="email"
              v-model="formData.email"
              required
              class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="password">Пароль</label>
          <input
              type="password"
              id="password"
              v-model="formData.password"
              required
              class="form-input"
              @input="validatePasswords"
          />
        </div>

        <div class="form-group">
          <label for="confirmPassword">Подтвердите пароль</label>
          <input
              type="password"
              id="confirmPassword"
              v-model="confirmPassword"
              required
              class="form-input"
              @input="validatePasswords"
          />
          <span v-if="passwordError" class="password-error">
            {{ passwordError }}
          </span>
        </div>

        <div class="form-group">
          <label for="full_name">ФИО</label>
          <input
              type="text"
              id="full_name"
              v-model="formData.full_name"
              required
              class="form-input"
          />
        </div>

        <button
            type="submit"
            class="submit-button"
            :disabled="loading || passwordError || !confirmPassword"
        >
          {{ loading ? 'Регистрация...' : 'Зарегистрироваться' }}
        </button>
      </form>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>
    </div>

    <EmailVerificationModal
        v-model="showVerificationModal"
        :email="registeredEmail"
        @update:modelValue="handleVerificationModalClose"
    />
  </div>
</template>

<script>
import {ref} from 'vue'
import {useRouter} from 'vue-router'
import {authApi} from '@/api/auth'
import EmailVerificationModal from "@/components/auth/EmailVerificationModal.vue"

export default {
  name: 'SpecialRegistrationPage',
  components: {
    EmailVerificationModal
  },
  setup() {
    const router = useRouter()
    const loading = ref(false)
    const error = ref(null)
    const confirmPassword = ref('')
    const passwordError = ref('')
    const showVerificationModal = ref(false)
    const registeredEmail = ref('')

    const formData = ref({
      email: '',
      password: '',
      full_name: ''
    })

    const validatePasswords = () => {
      if (confirmPassword.value && formData.value.password !== confirmPassword.value) {
        passwordError.value = 'Пароли не совпадают'
      } else {
        passwordError.value = ''
      }
    }

    const handleVerificationModalClose = () => {
      showVerificationModal.value = false;
      router.push('/login');
    };

    const handleSubmit = async () => {
      if (formData.value.password !== confirmPassword.value) {
        error.value = 'Пароли не совпадают'
        return
      }

      try {
        loading.value = true
        error.value = null

        await authApi.registerSpecial(formData.value)
        registeredEmail.value = formData.value.email;
        showVerificationModal.value = true;
      } catch (err) {
        error.value = err.detail || 'Произошла ошибка при регистрации'
      } finally {
        loading.value = false
      }
    }

    return {
      formData,
      loading,
      error,
      confirmPassword,
      passwordError,
      validatePasswords,
      handleSubmit,
      showVerificationModal,
      registeredEmail,
      handleVerificationModalClose
    }
  }
}
</script>

<style scoped>
.special-registration {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
}

.registration-container {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
}

.registration-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-weight: 500;
  color: #666;
}

.form-input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-input:focus {
  outline: none;
  border-color: #4a90e2;
}

.submit-button {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-button:hover {
  background-color: #357abd;
}

.submit-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.error-message {
  margin-top: 1rem;
  color: #dc3545;
  text-align: center;
}

.password-error {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

@media (max-width: 768px) {
  .registration-container {
    width: 90%;
    margin: 10px;
    padding: 20px;
  }

  :deep(.el-dialog) {
    width: 90% !important;
    margin: 10px auto !important;
  }

  :deep(.el-dialog__body) {
    padding: 15px !important;
  }

  :deep(.el-dialog__header) {
    padding: 15px !important;
  }

  :deep(.el-dialog__footer) {
    padding: 15px !important;
  }

  :deep(.el-dialog__footer .el-button) {
    width: 100%;
    margin: 5px 0 !important;
  }

  :deep(.el-dialog__footer) {
    display: flex;
    flex-direction: column;
  }
}
</style>