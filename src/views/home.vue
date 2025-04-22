<template>
  <div class="home-container">
    <a-layout>
      <a-layout-header class="header">
        <div class="logo">我的应用</div>
        <a-menu
            v-if="isLoggedIn"
            v-model:selectedKeys="selectedKeys"
            theme="dark"
            mode="horizontal"
            :style="{ lineHeight: '64px' }"
        >
          <a-menu-item key="home">
            <router-link to="/home">首页</router-link>
          </a-menu-item>
          <a-menu-item key="dashboard" v-if="hasPermission('2')">
            <router-link to="/dashboard">仪表盘</router-link>
          </a-menu-item>
          <a-menu-item key="vip" v-if="hasPermission('3')">
            <router-link to="/vip">VIP专区</router-link>
          </a-menu-item>
          <a-menu-item key="admin" v-if="hasPermission('4')">
            <router-link to="/admin">管理面板</router-link>
          </a-menu-item>
          <a-menu-item key="system" v-if="hasPermission('5')">
            <router-link to="/system">系统设置</router-link>
          </a-menu-item>
        </a-menu>
        <div class="user-actions">
          <template v-if="isLoggedIn">
            <a-dropdown>
              <a class="user-dropdown" @click.prevent>
                <span>{{ userInfo?.name }}</span>
                <down-outlined />
              </a>
              <template #overlay>
                <a-menu>
                  <a-menu-item key="profile">
                    <user-outlined />
                    个人资料
                  </a-menu-item>
                  <a-menu-divider />
                  <a-menu-item key="logout" @click="handleLogout">
                    <logout-outlined />
                    退出登录
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </template>
          <template v-else>
            <a-button type="link" @click="goToLogin">登录</a-button>
            <a-button type="primary" @click="goToRegister">注册</a-button>
          </template>
        </div>
      </a-layout-header>

      <a-layout-content class="content">
        <div class="site-layout-content">
          <template v-if="isLoggedIn">
            <a-card title="个人信息" :bordered="false">
              <a-descriptions bordered>
                <a-descriptions-item label="用户ID">{{ userInfo?.userId }}</a-descriptions-item>
                <a-descriptions-item label="用户名">{{ userInfo?.name }}</a-descriptions-item>
                <a-descriptions-item label="角色">{{ getRoleName(userInfo?.role) }}</a-descriptions-item>
              </a-descriptions>

              <a-divider />

              <a-card title="权限测试" :bordered="false">
                <a-space direction="vertical" style="width: 100%">
                  <a-alert
                      message="Level 1: 初始账户功能"
                      description="所有登录用户都可以看到这部分内容。"
                      type="info"
                      show-icon
                  />

                  <a-alert
                      v-if="hasPermission('2')"
                      message="Level 2: 普通用户功能"
                      description="普通用户及以上权限可以看到这部分内容。"
                      type="success"
                      show-icon
                  />

                  <a-alert
                      v-if="hasPermission('3')"
                      message="Level 3: VIP用户功能"
                      description="VIP用户及以上权限可以看到这部分内容。"
                      type="warning"
                      show-icon
                  />

                  <a-alert
                      v-if="hasPermission('4')"
                      message="Level 4: 管理员功能"
                      description="管理员及以上权限可以看到这部分内容。"
                      type="error"
                      show-icon
                  />

                  <a-alert
                      v-if="hasPermission('5')"
                      message="Level 5: 系统超管功能"
                      description="只有系统超管可以看到这部分内容。"
                      type="error"
                      show-icon
                  />
                </a-space>
              </a-card>
            </a-card>
          </template>

          <template v-else>
            <a-result
                status="warning"
                title="需要登录"
                sub-title="请登录后查看您的个人信息和功能"
            >
              <template #extra>
                <a-space>
                  <a-button type="primary" @click="goToLogin">立即登录</a-button>
                  <a-button @click="goToRegister">注册账号</a-button>
                </a-space>
              </template>
            </a-result>
          </template>
        </div>
      </a-layout-content>

      <a-layout-footer style="text-align: center">
        我的应用 ©2023 Created by Me
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { DownOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons-vue';
import { isAuthenticated, getUserInfo, logout, hasPermission as checkPermission } from '../utils/auth';

const router = useRouter();
const selectedKeys = ref<string[]>(['home']);
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

// 组件挂载时刷新用户信息
onMounted(() => {
  userInfo.value = getUserInfo();
});
</script>

<style scoped>
.home-container {
  min-height: 100vh;
}

.header {
  display: flex;
  align-items: center;
}

.logo {
  color: white;
  font-size: 20px;
  font-weight: bold;
  margin-right: 30px;
}

.user-actions {
  margin-left: auto;
  color: white;
}

.user-dropdown {
  color: white;
  padding: 0 12px;
  cursor: pointer;
}

.content {
  padding: 0 50px;
  margin-top: 16px;
}

.site-layout-content {
  padding: 24px;
  background: #fff;
  min-height: calc(100vh - 64px - 70px - 32px);
}

:deep(.ant-menu-item a) {
  color: rgba(255, 255, 255, 0.65);
}

:deep(.ant-menu-item-selected a),
:deep(.ant-menu-item a:hover) {
  color: #fff;
}
</style>
