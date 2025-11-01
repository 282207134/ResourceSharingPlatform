'use client';

import { useAuthState } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';

interface HeaderProps {
    onLoginClick: () => void;
}

export default function Header({ onLoginClick }: HeaderProps) {
    const { user, logout, isLoading } = useAuthState();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogout = async () => {
        await logout();
    };

    const handleTitleClick = () => {
        // 回到首页的逻辑
        window.location.reload();
    };

    const handlePointsClick = () => {
        // 积分相关的逻辑
        console.log('Points clicked');
    };

    const handleMessageClick = () => {
        // 消息相关的逻辑
        console.log('Message clicked');
    };

    // 防止hydration错误，在客户端挂载前不渲染动态内容
    if (!mounted) {
        return (
            <header className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <h1
                                className="text-2xl font-bold cursor-pointer hover:text-blue-100 transition-colors"
                            >
                                知足常乐
                            </h1>
                            <span className="text-sm opacity-90">知识付费平台</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-sm">
                                用户名: 加载中...
                            </div>
                            <button
                                className="bg-white text-blue-500 px-4 py-1 rounded text-sm font-medium opacity-50 cursor-not-allowed"
                            >
                                登录
                            </button>
                        </div>
                    </div>
                </div>
            </header>
        );
    }

    return (
        <header className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center space-x-2 md:space-x-4">
                        <h1
                            className="text-lg md:text-2xl font-bold cursor-pointer hover:text-blue-100 transition-colors"
                            onClick={handleTitleClick}
                        >
                            知足常乐
                        </h1>
                        <span className="text-xs md:text-sm opacity-90 hidden sm:inline">知识付费平台</span>
                    </div>
                    <div className="flex items-center gap-2 md:gap-4 flex-wrap justify-end">
                        {user && (
                            <button
                                onClick={handlePointsClick}
                                className="bg-white/20 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm hover:bg-white/30 transition-colors whitespace-nowrap"
                            >
                                积分: {user.points}
                            </button>
                        )}
                        {user && (
                            <button
                                onClick={handleMessageClick}
                                className="bg-white/20 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm hover:bg-white/30 transition-colors flex items-center space-x-1"
                            >
                                <span>💬</span>
                                <span className="hidden sm:inline">消息</span>
                                <span className="bg-red-500 text-white text-xs px-1 rounded-full">
                                    2
                                </span>
                            </button>
                        )}
                        <div className="text-xs md:text-sm hidden md:block">
                            用户名: {isLoading ? '加载中...' : user ? user.username : '未登录用户'}
                        </div>
                        {user ? (
                            <button
                                onClick={handleLogout}
                                className="bg-white text-blue-500 px-3 md:px-4 py-1 rounded text-xs md:text-sm font-medium hover:bg-gray-100 transition-colors whitespace-nowrap"
                            >
                                登出
                            </button>
                        ) : (
                            <button
                                onClick={onLoginClick}
                                className="bg-white text-blue-500 px-3 md:px-4 py-1 rounded text-xs md:text-sm font-medium hover:bg-gray-100 transition-colors whitespace-nowrap"
                                disabled={isLoading}
                            >
                                {isLoading ? '加载中...' : '登录'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}