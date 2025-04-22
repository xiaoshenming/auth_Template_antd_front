import axios from 'axios';
import router from '../router';

// 定义用户信息接口
export interface UserInfo {
    userId: string;
    name: string;
    role: string;
    token: string;
}

// 角色数值映射
const roleValues: Record<string, number> = {
    '1': 1, // 初始账户
    '2': 2, // 普通用户
    '3': 3, // VIP用户
    '4': 4, // 管理员
    '5': 5  // 系统超管
};

// 创建axios实例
export const api = axios.create({
    baseURL: '/api', // 修改为相对路径，将通过Vite代理转发
    timeout: 5000,
});

// JWT本地存储的key
const TOKEN_KEY = 'auth_token';
const USER_INFO_KEY = 'user_info';
const DEVICE_TYPE = 'web'; // 设备类型标识

// 登录方法
export const login = async (email: string, password: string): Promise<UserInfo> => {
    try {
        const response = await api.post('/login', {
            email,
            password,
            deviceType: DEVICE_TYPE
        });

        if (response.data.code === 200) {
            const { token, userId, name, role } = response.data.data;
            const userInfo: UserInfo = {
                userId,
                name,
                role,
                token
            };

            // 存储令牌和用户信息
            localStorage.setItem(TOKEN_KEY, token);
            localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));

            // 设置axios请求头
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            api.defaults.headers.common['deviceType'] = DEVICE_TYPE;

            return userInfo;
        } else {
            throw new Error(response.data.message || '登录失败');
        }
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || '登录失败');
    }
};

// 注册方法
export const register = async (name: string, email: string, password: string): Promise<any> => {
    try {
        const response = await api.post('/register', {
            name,
            email,
            password
        });

        if (response.data.code === 200) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || '注册失败');
        }
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || '注册失败');
    }
};

// 登出方法
export const logout = async (): Promise<void> => {
    try {
        if (isAuthenticated()) {
            await api.post('/logout');
        }
    } catch (error) {
        console.error('登出时出错:', error);
    } finally {
        // 无论如何都清除本地存储
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_INFO_KEY);
        // 清除请求头
        delete api.defaults.headers.common['Authorization'];
        delete api.defaults.headers.common['deviceType'];
        // 跳转到登录页
        router.push('/login');
    }
};

// 获取存储的令牌
export const getToken = (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
};

// 获取用户信息
export const getUserInfo = (): UserInfo | null => {
    const userInfoStr = localStorage.getItem(USER_INFO_KEY);
    if (userInfoStr) {
        try {
            return JSON.parse(userInfoStr);
        } catch (e) {
            return null;
        }
    }
    return null;
};

// 检查用户是否已认证
export const isAuthenticated = (): boolean => {
    return !!getToken();
};

// 检查用户是否有权限访问
export const hasPermission = (requiredRole: string): boolean => {
    const userInfo = getUserInfo();
    if (!userInfo) return false;

    const userRoleValue = roleValues[userInfo.role] || 0;
    const requiredRoleValue = roleValues[requiredRole] || 0;

    return userRoleValue >= requiredRoleValue;
};

// 初始化API拦截器
export const setupInterceptors = () => {
    // 请求拦截器
    api.interceptors.request.use(
        (config) => {
            const token = getToken();
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
                config.headers['deviceType'] = DEVICE_TYPE;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // 响应拦截器
    api.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            if (error.response) {
                const { status } = error.response;
                // 处理401未授权错误
                if (status === 401) {
                    // 清除认证信息并重定向到登录页
                    localStorage.removeItem(TOKEN_KEY);
                    localStorage.removeItem(USER_INFO_KEY);
                    router.push('/login');
                }

                // 处理403权限不足错误
                if (status === 403) {
                    router.push('/error/forbidden');
                }
            }
            return Promise.reject(error);
        }
    );
};
