'use client';

import { useState } from 'react';

interface LoginFormProps {
    onLogin: (username: string, password: string) => Promise<void>;
    onSwitchToRegister: () => void;
    isLoading?: boolean;
    error?: string;
}

export default function LoginForm({
    onLogin,
    onSwitchToRegister,
    isLoading,
    error,
}: LoginFormProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (username.trim() && password.trim()) {
            await onLogin(username.trim(), password);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-4 w-[365px] rounded-[117px] h-[701px]">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
                {/* 网站标题 */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-blue-600 mb-2">知足常乐</h1>
                    <p className="text-gray-600 text-sm">知识付费平台</p>
                </div>

                {/* 登录表单 */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-800 text-center mb-6">登录</h2>

                    {/* 错误提示 */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    {/* 用户名输入 */}
                    <div>
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            用户名
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="请输入用户名或邮箱"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    {/* 密码输入 */}
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            密码
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="请输入密码"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    {/* 记住我选项 */}
                    <div className="flex items-center justify-between">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                disabled={isLoading}
                            />

                            <span className="ml-2 text-sm text-gray-600">记住我</span>
                        </label>
                        <button
                            type="button"
                            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                        >
                            忘记密码？
                        </button>
                    </div>

                    {/* 登录按钮 */}
                    <button
                        type="submit"
                        disabled={isLoading || !username.trim() || !password.trim()}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading ? '登录中...' : '登录'}
                    </button>

                    {/* 注册链接 */}
                    <div className="text-center">
                        <span className="text-sm text-gray-600">还没有账号？</span>
                        <button
                            type="button"
                            onClick={onSwitchToRegister}
                            className="ml-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                            disabled={isLoading}
                        >
                            立即注册
                        </button>
                    </div>
                </form>

                {/* 底部信息 */}
                <div className="mt-8 text-center text-xs text-gray-500">
                    <p>登录即表示您同意我们的服务条款和隐私政策</p>
                </div>
            </div>
        </div>
    );
}
