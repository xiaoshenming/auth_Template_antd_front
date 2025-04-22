<template>
  <div class="home-container">
    <header class="header">
      <h1>权限测试系统</h1>
      <div class="nav-links" v-if="isLoggedIn">
        <router-link to="/home">首页</router-link>
        <router-link to="/level2" v-if="hasPermission('2')">普通用户</router-link>
        <router-link to="/level3" v-if="hasPermission('3')">VIP用户</router-link>
        <router-link to="/level4" v-if="hasPermission('4')">管理员</router-link>
        <router-link to="/level5" v-if="hasPermission('5')">系统超管</router-link>
      </div>
      <div class="user-actions">
        <template v-if="isLoggedIn">
          <span>{{ userInfo?.name }} ({{ getRoleName(userInfo?.role) }})</span>
          <button @click="handleLogout">退出登录</button>
        </template>
        <template v-else>
          <button @click="goToLogin">登录</button>
          <button @click="goToRegister">注册</button>
        </template>
      </div>
    </header>

    <main class="content">
      <div v-if="isLoggedIn" class="permission-test">
        <h2>权限测试区域</h2>

        <div class="permission-card level1">
          <h3>Level 1: 初始账户权限</h3>
          <p>所有登录用户都可以看到这部分内容</p>
        </div>

        <div v-if="hasPermission('2')" class="permission-card level2">
          <h3>Level 2: 普通用户权限</h3>
          <p>普通用户及以上权限可以看到这部分内容</p>
        </div>

        <div v-if="hasPermission('3')" class="permission-card level3">
          <h3>Level 3: VIP用户权限</h3>
          <p>VIP用户及以上权限可以看到这部分内容</p>
        </div>

        <div v-if="hasPermission('4')" class="permission-card level4">
          <h3>Level 4: 管理员权限</h3>
          <p>管理员及以上权限可以看到这部分内容</p>
        </div>

        <div v-if="hasPermission('5')" class="permission-card level5">
          <h3>Level 5: 系统超管权限</h3>
          <p>只有系统超管可以看到这部分内容</p>
        </div>
      </div>

      <div v-else class="login-reminder">
        <h2>请登录系统</h2>
        <p>登录后可以测试不同权限级别的功能</p>
        <div class="login-buttons">
          <button @click="goToLogin">登录</button>
          <button @click="goToRegister">注册</button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { isAuthenticated, getUserInfo, logout, hasPermission as checkPermission } from '../utils/auth';

const router = useRouter();
const userInfo = ref(getUserInfo());
const isLoggedIn = computed(() => isAuthenticated());

// 获取角色名称
const getRoleName = (role: string | undefined) => {
  if (!role) return '未知';
  const roleMap: Record<string, string> = {
    '1': '初始账户',
    '2': '普通用户',
    '3': 'VIP用户',
    '4': '管理员',
    '5': '系统超管'
  };
  return roleMap[role] || '未知';
};

// 检查用户权限
const hasPermission = (requiredRole: string) => {
  return checkPermission(requiredRole);
};

// 处理登出
const handleLogout = async () => {
  await logout();
  userInfo.value = null;
  router.push('/login');
};

// 跳转到登录页
const goToLogin = () => {
  router.push('/login');
};

// 跳转到注册页
const goToRegister = () => {
  router.push('/register');
};
</script>

<style scoped>
.home-container {
  font-family: Arial, sans-serif;
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.nav-links {
  display: flex;
  gap: 15px;
}

.nav-links a {
  text-decoration: none;
  color: #333;
  font-weight: bold;
}

.nav-links a:hover {
  color: #1890ff;
}

.user-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

button {
  padding: 6px 15px;
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #40a9ff;
}

.permission-test {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.permission-card {
  padding: 15px;
  border-radius: 4px;
  border: 1px solid #eee;
}

.level1 { background-color: #e6f7ff; }
.level2 { background-color: #e6fffb; }
.level3 { background-color: #fcffe6; }
.level4 { background-color: #fff7e6; }
.level5 { background-color: #fff1f0; }

.login-reminder {
  text-align: center;
  padding: 40px 0;
}

.login-buttons {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 10px;
}
</style>
