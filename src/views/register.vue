<template>
  <div class="register-container">
    <div class="register-card">
      <h2>用户注册</h2>

      <form @submit.prevent="onSubmit">
        <div class="form-item">
          <label for="name">用户名</label>
          <input
              id="name"
              v-model="formState.name"
              type="text"
              required
              placeholder="请输入用户名"
          />
        </div>

        <div class="form-item">
          <label for="email">邮箱</label>
          <input
              id="email"
              v-model="formState.email"
              type="email"
              required
              placeholder="请输入邮箱"
          />
        </div>

        <div class="form-item">
          <label for="password">密码</label>
          <input
              id="password"
              v-model="formState.password"
              type="password"
              required
              placeholder="请输入密码"
              minlength="6"
          />
        </div>

        <div class="form-item">
          <label for="confirmPassword">确认密码</label>
          <input
              id="confirmPassword"
              v-model="formState.confirmPassword"
              type="password"
              required
              placeholder="请确认密码"
          />
          <div v-if="passwordMismatch" class="input-error">两次输入的密码不一致</div>
        </div>

        <div class="form-actions">
          <button type="submit" :disabled="loading || passwordMismatch">
            {{ loading ? '注册中...' : '注册' }}
          </button>
        </div>

        <div class="extra-links">
          <a @click="goToLogin">已有账号？立即登录</a>
        </div>
      </form>

      <div v-if="errorMsg" class="error-message">{{ errorMsg }}</div>
      <div v-if="successMsg" class="success-message">{{ successMsg }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { register } from '../utils/auth';

const router = useRouter();

interface FormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const formState = reactive<FormState>({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const loading = ref<boolean>(false);
const errorMsg = ref<string>('');
const successMsg = ref<string>('');

const passwordMismatch = computed(() => {
  return formState.confirmPassword && formState.password !== formState.confirmPassword;
});

const onSubmit = async () => {
  if (passwordMismatch.value) return;

  loading.value = true;
  errorMsg.value = '';
  successMsg.value = '';

  try {
    await register(formState.name, formState.email, formState.password);
    successMsg.value = '注册成功！请登录您的账号';

    // 3秒后自动跳转到登录页
    setTimeout(() => {
      router.push('/login');
    }, 3000);
  } catch (error: any) {
    errorMsg.value = error.message || '注册失败，请稍后再试';
  } finally {
    loading.value = false;
  }
};

const goToLogin = () => {
  router.push('/login');
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
}

.register-card {
  background: white;
  border-radius: 4px;
  padding: 30px;
  width: 340px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 24px;
}

.form-item {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
}

.input-error {
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 5px;
}

.form-actions {
  margin-top: 24px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #40a9ff;
}

button:disabled {
  background-color: #bae7ff;
  cursor: not-allowed;
}

.extra-links {
  margin-top: 16px;
  text-align: center;
}

a {
  color: #1890ff;
  text-decoration: none;
  cursor: pointer;
}

.error-message {
  margin-top: 16px;
  color: #ff4d4f;
  text-align: center;
}

.success-message {
  margin-top: 16px;
  color: #52c41a;
  text-align: center;
}
</style>
