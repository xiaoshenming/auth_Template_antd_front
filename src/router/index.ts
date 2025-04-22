import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { isAuthenticated, hasPermission } from '../utils/auth'

// 路由元信息类型定义
declare module 'vue-router' {
    interface RouteMeta {
        requiresAuth?: boolean;
        requiredRole?: string;
        title?: string;
    }
}

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/login.vue'),
        meta: {
            title: '登录',
            requiresAuth: false
        }
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('../views/register.vue'),
        meta: {
            title: '注册',
            requiresAuth: false
        }
    },
    {
        path: '/home',
        name: 'home',
        component: () => import('../views/home.vue'),
        meta: {
            title: '首页',
            requiresAuth: true,
            requiredRole: '1' // 所有登录用户都能访问
        }
    },
    {
        path: '/error/forbidden',
        name: 'forbidden',
        component: () => import('../views/error/forbidden.vue'),
        meta: {
            title: '权限不足',
            requiresAuth: false
        }
    },
    {
        path: '/error/not-found',
        name: 'notFound',
        component: () => import('../views/error/not-found.vue'),
        meta: {
            title: '页面不存在',
            requiresAuth: false
        }
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/error/not-found'
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
    // 设置页面标题
    if (to.meta.title) {
        document.title = `${to.meta.title} - 我的应用`;
    }

    // 检查路由是否需要鉴权
    if (to.matched.some(record => record.meta.requiresAuth)) {
        // 检查用户是否已登录
        if (!isAuthenticated()) {
            // 未登录，重定向到登录页
            next({
                path: '/login',
                query: { redirect: to.fullPath } // 保存目标路由，登录后可以重定向回来
            });
        } else {
            // 已登录，检查权限
            const requiredRole = to.meta.requiredRole as string;
            if (requiredRole && !hasPermission(requiredRole)) {
                // 权限不足，跳转到禁止访问页面
                next({ path: '/error/forbidden' });
            } else {
                // 有权限，放行
                next();
            }
        }
    } else {
        // 不需要鉴权的路由直接放行
        // 额外检查：已登录用户访问登录/注册页面时重定向到首页
        if (isAuthenticated() && (to.path === '/login' || to.path === '/register')) {
            next({ path: '/home' });
        } else {
            next();
        }
    }
});

export default router
