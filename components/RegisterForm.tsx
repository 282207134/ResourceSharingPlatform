'use client';

import { useState } from 'react';

interface RegisterFormProps {
    onRegister: (
        username: string,
        email: string,
        password: string,
        confirmPassword: string,
    ) => Promise<void>;
    onSwitchToLogin: () => void;
    isLoading?: boolean;
    error?: string;
}

export default function RegisterForm({
    onRegister,
    onSwitchToLogin,
    isLoading,
    error,
}: RegisterFormProps) {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false,
    });

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (
            formData.username.trim() &&
            formData.email.trim() &&
            formData.password &&
            formData.confirmPassword &&
            formData.agreeToTerms
        ) {
            await onRegister(
                formData.username.trim(),
                formData.email.trim(),
                formData.password,
                formData.confirmPassword,
            );
        }
    };

    const isFormValid =
        formData.username.trim() &&
        formData.email.trim() &&
        formData.password &&
        formData.confirmPassword &&
        formData.agreeToTerms;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
                {/* 网站标题 */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-blue-600 mb-2">知足常乐</h1>
                    <p className="text-gray-600 text-sm">知识付费平台</p>
                </div>

                {/* 注册表单 */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-800 text-center mb-6">注册</h2>

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
                            用户名 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={formData.username}
                            onChange={(e) => handleInputChange('username', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="用户名不少于3个字符"
                            required
                            disabled={isLoading}
                        />

                        <p className="text-xs text-gray-500 mt-1">
                            3-20字符，只允许字母、数字、下划线
                        </p>
                    </div>

                    {/* 邮箱输入 */}
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            *Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="请输入有效的邮箱地址"
                            required
                            disabled={isLoading}
                        />

                        <p className="text-xs text-gray-500 mt-1">Email 地址不正确</p>
                    </div>

                    {/* 密码输入 */}
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            密码 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="密码不少于6位"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    {/* 确认密码输入 */}
                    <div>
                        <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            *确认密码 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="请再次输入密码"
                            required
                            disabled={isLoading}
                        />

                        {formData.password &&
                            formData.confirmPassword &&
                            formData.password !== formData.confirmPassword && (
                                <p className="text-xs text-red-500 mt-1">两次输入的密码不一致</p>
                            )}
                    </div>

                    {/* 服务条款同意 */}
                    <div className="space-y-4">
                        <label className="flex items-start space-x-2">
                            <input
                                type="checkbox"
                                checked={formData.agreeToTerms}
                                onChange={(e) =>
                                    handleInputChange('agreeToTerms', e.target.checked)
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
                                disabled={isLoading}
                            />

                            <span className="text-sm text-gray-600">
                                我已阅读并同意《服务条款》和《隐私政策》，并同意接收相关信息。
                            </span>
                        </label>

                        <div className="text-xs text-gray-500 space-y-1">
                            <p>• 注册即表示您同意我们的服务条款和隐私政策</p>
                            <p>• 我们会保护您的个人信息安全</p>
                            <p>• 新用户注册即可获得100积分奖励</p>
                        </div>
                    </div>

                    {/* 注册按钮 */}
                    <button
                        type="submit"
                        disabled={isLoading || !isFormValid}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading ? '注册中...' : '注册'}
                    </button>

                    {/* 登录链接 */}
                    <div className="text-center">
                        <span className="text-sm text-gray-600">已有账号？</span>
                        <button
                            type="button"
                            onClick={onSwitchToLogin}
                            className="ml-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                            disabled={isLoading}
                        >
                            立即登录
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
