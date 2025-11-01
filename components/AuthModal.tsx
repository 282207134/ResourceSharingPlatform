'use client';

import { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { useAuthState } from '@/hooks/useAuth';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialMode?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
    const [mode, setMode] = useState<'login' | 'register'>(initialMode);
    const [error, setError] = useState('');
    const { login, register, isLoading } = useAuthState();

    if (!isOpen) return null;

    const handleLogin = async (username: string, password: string) => {
        try {
            setError('');
            await login(username, password);
            onClose();
        } catch (error: any) {
            setError(error.message);
        }
    };

    const handleRegister = async (
        username: string,
        email: string,
        password: string,
        confirmPassword: string,
    ) => {
        try {
            setError('');
            await register(username, email, password, confirmPassword);
            onClose();
        } catch (error: any) {
            setError(error.message);
        }
    };

    const handleSwitchMode = () => {
        setMode(mode === 'login' ? 'register' : 'login');
        setError('');
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-start sm:items-center justify-center p-1 sm:p-4 z-50 overflow-y-auto"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-none sm:rounded-lg shadow-xl w-full sm:w-auto sm:max-w-md min-h-screen sm:min-h-0 sm:max-h-[95vh] overflow-y-auto my-0 sm:my-4">
                <div className="relative">
                    {/* 关闭按钮 */}
                    <button
                        onClick={onClose}
                        className="absolute top-2 right-2 sm:top-3 sm:right-3 text-gray-400 hover:text-gray-600 text-lg z-10 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                        disabled={isLoading}
                    >
                        ×
                    </button>

                    {/* 表单内容 */}
                    <div className="p-4 sm:p-6 pt-12 sm:pt-6">
                        {mode === 'login' ? (
                            <div>
                                {/* 网站标题 */}
                                <div className="text-center mb-6 sm:mb-6">
                                    <h1 className="text-xl sm:text-xl font-bold text-blue-600 mb-2">
                                        知足常乐
                                    </h1>
                                    <p className="text-gray-600 text-sm">知识付费平台</p>
                                </div>

                                <h2 className="text-lg sm:text-lg font-semibold text-center mb-4 sm:mb-4">
                                    登录
                                </h2>

                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-md text-sm mb-3">
                                        {error}
                                    </div>
                                )}

                                {/* 简化的登录表单 */}
                                <form className="space-y-4 sm:space-y-4">
                                    <div>
                                        <label className="block text-sm sm:text-sm font-medium text-gray-700 mb-2">
                                            用户名
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base sm:text-sm transition-colors"
                                            placeholder="请输入用户名或邮箱"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm sm:text-sm font-medium text-gray-700 mb-2">
                                            密码
                                        </label>
                                        <input
                                            type="password"
                                            className="w-full px-4 py-3 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base sm:text-sm transition-colors"
                                            placeholder="请输入密码"
                                        />
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 py-1">
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />

                                            <span className="ml-2 text-xs sm:text-sm text-gray-600">
                                                记住我
                                            </span>
                                        </label>
                                        <button
                                            type="button"
                                            className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 transition-colors text-left sm:text-right"
                                        >
                                            忘记密码？
                                        </button>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-blue-600 text-white py-2.5 sm:py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium text-sm transition-all duration-200"
                                    >
                                        登录
                                    </button>
                                    <div className="text-center pt-1 sm:pt-2">
                                        <span className="text-xs sm:text-sm text-gray-600">
                                            还没有账号？
                                        </span>
                                        <button
                                            type="button"
                                            onClick={handleSwitchMode}
                                            className="ml-1 text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                                        >
                                            立即注册
                                        </button>
                                    </div>
                                </form>

                                {/* 底部信息 */}
                                <div className="mt-6 sm:mt-4 text-center text-xs text-gray-500 pb-4 sm:pb-0">
                                    <p className="leading-relaxed px-2">
                                        登录即表示您同意我们的服务条款和隐私政策
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div>
                                {/* 网站标题 */}
                                <div className="text-center mb-6 sm:mb-6">
                                    <h1 className="text-xl sm:text-xl font-bold text-blue-600 mb-2">
                                        知足常乐
                                    </h1>
                                    <p className="text-gray-600 text-sm">知识付费平台</p>
                                </div>

                                <h2 className="text-lg sm:text-lg font-semibold text-center mb-4 sm:mb-4">
                                    注册
                                </h2>

                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-md text-sm mb-4">
                                        {error}
                                    </div>
                                )}

                                {/* 简化的注册表单 */}
                                <form className="space-y-3 sm:space-y-3">
                                    <div>
                                        <label className="block text-sm sm:text-sm font-medium text-gray-700 mb-2">
                                            用户名 <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base sm:text-sm transition-colors"
                                            placeholder="请输入用户名"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm sm:text-sm font-medium text-gray-700 mb-2">
                                            邮箱 <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            className="w-full px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base sm:text-sm transition-colors"
                                            placeholder="请输入邮箱地址"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm sm:text-sm font-medium text-gray-700 mb-2">
                                            密码 <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            className="w-full px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base sm:text-sm transition-colors"
                                            placeholder="请输入密码（至少6位）"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm sm:text-sm font-medium text-gray-700 mb-2">
                                            确认密码 <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            className="w-full px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base sm:text-sm transition-colors"
                                            placeholder="请再次输入密码"
                                        />
                                    </div>
                                    <div>
                                        <label className="flex items-start">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5 sm:mt-1 flex-shrink-0"
                                            />

                                            <span className="ml-2 text-xs sm:text-sm text-gray-600 leading-relaxed">
                                                我已阅读并同意用户协议和隐私政策
                                            </span>
                                        </label>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-blue-600 text-white py-2.5 sm:py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium text-sm transition-all duration-200"
                                    >
                                        立即注册
                                    </button>
                                    <div className="text-center pt-1 sm:pt-2">
                                        <span className="text-xs sm:text-sm text-gray-600">
                                            已有账户？
                                        </span>
                                        <button
                                            type="button"
                                            onClick={handleSwitchMode}
                                            className="ml-1 text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                                        >
                                            立即登录
                                        </button>
                                    </div>
                                </form>

                                {/* 底部信息 */}
                                <div className="mt-6 sm:mt-4 text-center text-xs text-gray-500 pb-6 sm:pb-0">
                                    <p className="leading-relaxed px-2">
                                        注册即表示您同意我们的服务条款和隐私政策
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
