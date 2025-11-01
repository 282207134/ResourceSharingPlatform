'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

export interface User {
    id: number;
    username: string;
    email: string;
    points: number;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<void>;
    register: (
        username: string,
        email: string,
        password: string,
        confirmPassword: string,
    ) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export function useAuthState() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // 检查用户登录状态
    const checkAuthStatus = async () => {
        try {
            const response = await fetch('/api/auth/me');
            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error('检查登录状态失败:', error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    // 登录
    const login = async (username: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || '登录失败');
            }

            setUser(data.user);
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // 注册
    const register = async (
        username: string,
        email: string,
        password: string,
        confirmPassword: string,
    ) => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password, confirmPassword }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || '注册失败');
            }

            setUser(data.user);
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // 登出
    const logout = async () => {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
            });
        } catch (error) {
            console.error('登出失败:', error);
        } finally {
            setUser(null);
        }
    };

    // 刷新用户信息
    const refreshUser = async () => {
        await checkAuthStatus();
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    return {
        user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
    };
}

// AuthProvider 组件
export function AuthProvider({ children }: { children: ReactNode }) {
    const authState = useAuthState();

    return <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>;
}
