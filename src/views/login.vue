<template>
  <div class="login-container">
    <a-card title="用户登录" :bordered="false" style="width: 400px">
      <a-form
          :model="formState"
          name="login-form"
          @finish="onFinish"
          @finishFailed="onFinishFailed"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 18 }"
      >
        <a-form-item
            label="邮箱"
            name="email"
            :rules="[{ required: true, message: '请输入邮箱!' }, { type: 'email', message: '请输入有效的邮箱!' }]"
        >
          <a-input v-model:value="formState.email" />
        </a-form-item>

        <a-form-item
            label="密码"
            name="password"
            :rules="[{ required: true, message: '请输入密码!' }]"
        >
          <a-input-password v-model:value="formState.password" />
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 6, span: 18 }">
          <a-button type="primary" html-type="submit" :loading="loading" style="width: 100%">
            登录
          </a-button>
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 6, span: 18 }">
          <div class="extra-links">
            <a @click="goToRegister">没有账号？立即注册</a>
          </div>
        </a-form-item>
      </a-form>

      <a-alert v-if="errorMsg" type="error" :message="errorMsg" banner closable />
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { message } from 'ant-design-vue';
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

const onFinish = async (values: FormState) => {
  loading.value = true;
  errorMsg.value = '';

  try {
    await login(values.email, values.password);
    message.success('登录成功');

    // 获取重定向地址，如果没有则默认到首页
    const redirectPath = route.query.redirect as string || '/home';
    router.replace(redirectPath);
  } catch (error: any) {
    errorMsg.value = error.message;
  } finally {
    loading.value = false;
  }
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};

const goToRegister = () => {
  router.push('/register');
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
}

.extra-links {
  text-align: center;
  margin-top: 8px;
}
</style>
