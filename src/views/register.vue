<template>
  <div class="register-container">
    <a-card title="用户注册" :bordered="false" style="width: 450px">
      <a-form
          :model="formState"
          name="register-form"
          @finish="onFinish"
          @finishFailed="onFinishFailed"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 18 }"
      >
        <a-form-item
            label="用户名"
            name="name"
            :rules="[{ required: true, message: '请输入用户名!' }]"
        >
          <a-input v-model:value="formState.name" />
        </a-form-item>

        <a-form-item
            label="邮箱"
            name="email"
            :rules="[
            { required: true, message: '请输入邮箱!' },
            { type: 'email', message: '请输入有效的邮箱!' }
          ]"
        >
          <a-input v-model:value="formState.email" />
        </a-form-item>

        <a-form-item
            label="密码"
            name="password"
            :rules="[
            { required: true, message: '请输入密码!' },
            { min: 6, message: '密码长度不能少于6个字符!' }
          ]"
        >
          <a-input-password v-model:value="formState.password" />
        </a-form-item>

        <a-form-item
            label="确认密码"
            name="confirmPassword"
            :rules="[
            { required: true, message: '请确认密码!' },
            { validator: validateConfirmPassword }
          ]"
        >
          <a-input-password v-model:value="formState.confirmPassword" />
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 6, span: 18 }">
          <a-button type="primary" html-type="submit" :loading="loading" style="width: 100%">
            注册
          </a-button>
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 6, span: 18 }">
          <div class="extra-links">
            <a @click="goToLogin">已有账号？立即登录</a>
          </div>
        </a-form-item>
      </a-form>

      <a-alert v-if="errorMsg" type="error" :message="errorMsg" banner closable />
      <a-alert v-if="successMsg" type="success" :message="successMsg" banner closable />
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
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

// 验证确认密码
const validateConfirmPassword = async (_rule: any, value: string) => {
  if (value === '') {
    return Promise.reject('请确认您的密码');
  } else if (value !== formState.password) {
    return Promise.reject('两次输入的密码不一致');
  } else {
    return Promise.resolve();
  }
};

const onFinish = async (values: FormState) => {
  loading.value = true;
  errorMsg.value = '';
  successMsg.value = '';

  try {
    await register(values.name, values.email, values.password);
    successMsg.value = '注册成功！请登录您的账号';

    // 3秒后自动跳转到登录页
    setTimeout(() => {
      router.push('/login');
    }, 3000);
  } catch (error: any) {
    errorMsg.value = error.message;
  } finally {
    loading.value = false;
  }
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
  message.error('请正确填写所有必填项');
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
  padding: 20px 0;
}

.extra-links {
  text-align: center;
  margin-top: 8px;
}
</style>
