<template>
  <div class="login-container">
    <div class="login-card">
      <h2>用户登录</h2>

      <form @submit.prevent="onSubmit">
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
          />
        </div>

        <div class="form-actions">
          <button type="submit" :disabled="loading">
            {{ loading ? '登录中...' : '登录' }}
          </button>
        </div>

        <div class="extra-links">
          <a @click="goToRegister">没有账号？立即注册</a>
        </div>
      </form>

      <div v-if="errorMsg" class="error-message">{{ errorMsg }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { login } from '../utils/auth';

const router = useRouter();
const route = useRoute();

interface FormState {
  email: string;
  password: string;
}

const formState = reactive<FormState>({
  email: '',
  password: ''
});

const loading = ref<boolean>(false);
const errorMsg = ref<string>('');

const onSubmit = async () => {
  loading.value = true;
  errorMsg.value = '';

  try {
    await login(formState.email, formState.password);
    // 获取重定向地址，如果没有则默认到首页
    const redirectPath = route.query.redirect as string || '/home';
    router.replace(redirectPath);
  } catch (error: any) {
    errorMsg.value = error.message || '登录失败，请检查邮箱和密码';
  } finally {
    loading.value = false;
  }
};

const goToRegister = () => {
  router.push('/register');
};
</script>

<style scoped>
.login-card {
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
</style>
