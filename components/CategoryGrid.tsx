'use client';

import { useState } from 'react';

interface Resource {
    id: number;
    title: string;
    author: string;
    views: number;
    likes: number;
    thumbnail: string;
    description: string;
    points: number;
    isPremium: boolean;
}

interface CategoryGridProps {
    resources: Resource[];
    userPoints: number;
    onResourceClick: (resource: Resource) => void;
}

export default function CategoryGrid({
    resources,
    userPoints,
    onResourceClick,
}: CategoryGridProps) {
    // 创建一个映射来跟踪每个资源的图片加载状态
    const [imageLoadStates, setImageLoadStates] = useState<Record<number, boolean>>({});

    const handleImageError = (resourceId: number) => {
        setImageLoadStates(prev => ({
            ...prev,
            [resourceId]: false
        }));
    };

    const handleImageLoad = (resourceId: number) => {
        setImageLoadStates(prev => ({
            ...prev,
            [resourceId]: true
        }));
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full">
            {resources.map((resource) => (
                <div
                    key={resource.id}
                    className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden cursor-pointer flex flex-col"
                    onClick={() => onResourceClick(resource)}
                >
                    <div className="relative">
                        {imageLoadStates[resource.id] === false ? (
                            <div className="w-full h-40 md:h-48 bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500 text-sm md:text-base">图片加载失败</span>
                            </div>
                        ) : (
                            <img
                                src={resource.thumbnail}
                                alt={resource.title}
                                className="w-full h-40 md:h-48 object-cover"
                                onError={() => handleImageError(resource.id)}
                                onLoad={() => handleImageLoad(resource.id)}
                            />
                        )}

                        {resource.isPremium && (
                            <div className="absolute top-2 left-2">
                                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                                    付费
                                </span>
                            </div>
                        )}
                        <div className="absolute top-2 right-2">
                            <span className="bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                                {resource.points} 积分
                            </span>
                        </div>
                    </div>

                    <div className="p-3 md:p-4 flex flex-col flex-1">
                        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 text-sm md:text-base">
                            {resource.title}
                        </h3>
                        <p className="text-gray-600 text-xs md:text-sm mb-3 line-clamp-2 flex-1">
                            {resource.description}
                        </p>

                        <div className="flex items-center justify-between text-xs md:text-sm text-gray-500 mb-3">
                            <span className="truncate">作者: {resource.author}</span>
                            <div className="flex items-center space-x-2 md:space-x-3 flex-shrink-0">
                                <span>👁 {resource.views}</span>
                                <span>❤️ {resource.likes}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <span
                                className={`text-xs md:text-sm font-medium ${
                                    userPoints >= resource.points
                                        ? 'text-green-600'
                                        : 'text-red-600'
                                }`}
                            >
                                {userPoints >= resource.points ? '可解锁' : '积分不足'}
                            </span>
                            <div className="text-blue-600 text-xs md:text-sm hover:text-blue-800 font-medium">
                                点击查看 →
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}