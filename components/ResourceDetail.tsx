'use client';

import { useState } from 'react';

interface Reply {
    id: number;
    author: string;
    content: string;
    createdAt: string;
    likes: number;
}

interface ResourceDetailProps {
    resource: {
        id: number;
        title: string;
        author: string;
        views: number;
        likes: number;
        thumbnail: string;
        description: string;
        content: string;
        contentImages?: string[];
        attachments?: { name: string; url: string }[]; // 新增：附件字段
        points: number;
        isPremium: boolean;
        createdAt?: string;
        tags?: string[];
        replies?: Reply[];
    };
    userPoints: number;
    onClose: () => void;
    onPurchase: (resourceId: number, points: number) => void;
}

export default function ResourceDetail({
    resource,
    userPoints,
    onClose,
    onPurchase,
}: ResourceDetailProps) {
    // 检查是否已购买 - 从localStorage获取购买状态
    const [isPurchased, setIsPurchased] = useState(() => {
        if (typeof window !== 'undefined') {
            const purchased = localStorage.getItem(`purchased_${resource.id}`);
            return purchased === 'true';
        }
        return false;
    });
    const [newReply, setNewReply] = useState('');
    const [replies, setReplies] = useState<Reply[]>(resource.replies || []);
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(resource.likes);

    const handlePurchase = () => {
        if (userPoints >= resource.points) {
            onPurchase(resource.id, resource.points);
            setIsPurchased(true);
            // 保存购买状态到localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem(`purchased_${resource.id}`, 'true');
            }
        }
    };

    const handleLike = async () => {
        try {
            // 调用API保存点赞状态到数据库
            const response = await fetch('/api/likes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    targetType: 'post', // 假设是帖子类型
                    targetId: resource.id,
                }),
            });

            if (!response.ok) {
                throw new Error('点赞操作失败');
            }

            const result = await response.json();

            // 更新本地状态
            setIsLiked(result.data.liked);
            setLikesCount((prev) => (result.data.liked ? prev + 1 : prev - 1));
        } catch (error) {
            console.error('点赞失败:', error);
            alert('点赞失败，请重试');
        }
    };

    const handleReplySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newReply.trim()) {
            const reply: Reply = {
                id: Date.now(),
                author: 'current_user', // 应该从用户状态获取
                content: newReply,
                createdAt: new Date().toISOString(),
                likes: 0,
            };
            setReplies([...replies, reply]);
            setNewReply('');
        }
    };

    const canViewContent = !resource.isPremium || isPurchased;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 md:p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="relative">
                    <img
                        src={resource.thumbnail}
                        alt={resource.title}
                        className="w-full h-48 md:h-64 object-cover"
                    />

                    <div className="absolute top-2 right-2 md:top-4 md:right-4">
                        <button
                            onClick={onClose}
                            className="bg-black bg-opacity-50 text-white rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center hover:bg-opacity-70 text-xl md:text-2xl"
                        >
                            ×
                        </button>
                    </div>
                    {resource.isPremium && (
                        <div className="absolute top-2 left-2 md:top-4 md:left-4">
                            <span className="bg-red-500 text-white px-2 md:px-3 py-1 rounded-full text-xs md:text-sm">
                                付费内容 - {resource.points} 积分
                            </span>
                        </div>
                    )}
                </div>

                <div className="p-4 md:p-6">
                    {/* Title and Meta */}
                    <div className="mb-4 md:mb-6">
                        <h1 className="text-xl md:text-3xl font-bold text-gray-800 mb-3 md:mb-4">{resource.title}</h1>

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0 mb-4">
                            <div className="flex flex-wrap items-center gap-3 md:gap-6 text-xs md:text-sm text-gray-600">
                                <span>作者: {resource.author}</span>
                                <span>浏览: {resource.views}</span>
                                <span>
                                    发布时间:{' '}
                                    {resource.createdAt
                                        ? new Date(resource.createdAt).toLocaleDateString('zh-CN')
                                        : '刚刚'}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 md:gap-4">
                                <button
                                    onClick={handleLike}
                                    className={`flex items-center space-x-1 md:space-x-2 px-3 md:px-4 py-2 rounded-lg transition-colors text-xs md:text-sm ${
                                        isLiked
                                            ? 'bg-red-100 text-red-600'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    <span>{isLiked ? '❤️' : '🤍'}</span>
                                    <span>{likesCount}</span>
                                </button>

                                <button className="flex items-center space-x-1 md:space-x-2 px-3 md:px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 text-xs md:text-sm">
                                    <span>📤</span>
                                    <span className="hidden sm:inline">分享</span>
                                </button>
                            </div>
                        </div>

                        <p className="text-gray-600 text-sm md:text-lg">{resource.description}</p>
                    </div>

                    {/* Purchase Section */}
                    {resource.isPremium && !isPurchased && (
                        <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4 md:p-6 mb-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-base md:text-lg font-semibold text-orange-800 mb-2">
                                        解锁完整内容
                                    </h3>
                                    <p className="text-orange-700 text-sm md:text-base">
                                        此内容需要 {resource.points} 积分解锁，您当前有 {userPoints}{' '}
                                        积分
                                    </p>
                                </div>
                                <button
                                    onClick={handlePurchase}
                                    disabled={userPoints < resource.points}
                                    className={`px-4 md:px-6 py-2.5 md:py-3 rounded-lg font-medium text-sm md:text-base ${
                                        userPoints >= resource.points
                                            ? 'bg-orange-500 text-white hover:bg-orange-600'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                                >
                                    {userPoints >= resource.points ? '立即解锁' : '积分不足'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Content */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">内容详情</h2>

                        {/* 显示内容图片 - 移到付费墙外面 */}
                        {resource.contentImages && resource.contentImages.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                    内容图片
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {resource.contentImages.map((img, index) => (
                                        <img
                                            key={index}
                                            src={img}
                                            alt={`内容图片 ${index + 1}`}
                                            className="rounded-lg shadow"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {canViewContent ? (
                            <div className="prose max-w-none">
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <pre className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                                        {resource.content}
                                    </pre>

                                    {/* 显示附件 */}
                                    {resource.attachments && resource.attachments.length > 0 && (
                                        <div className="mt-6">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                                附件
                                            </h3>
                                            <div className="space-y-3">
                                                {resource.attachments.map((attachment, index) => {
                                                    // 获取文件扩展名
                                                    const fileExtension =
                                                        attachment.name
                                                            .split('.')
                                                            .pop()
                                                            ?.toLowerCase() || '';
                                                    // 根据文件类型设置图标
                                                    let icon = '📄';
                                                    if (
                                                        [
                                                            'jpg',
                                                            'jpeg',
                                                            'png',
                                                            'gif',
                                                            'webp',
                                                        ].includes(fileExtension)
                                                    ) {
                                                        icon = '🖼️';
                                                    } else if (['pdf'].includes(fileExtension)) {
                                                        icon = '📑';
                                                    } else if (
                                                        ['doc', 'docx'].includes(fileExtension)
                                                    ) {
                                                        icon = '📝';
                                                    } else if (
                                                        ['xls', 'xlsx'].includes(fileExtension)
                                                    ) {
                                                        icon = '📊';
                                                    } else if (
                                                        ['ppt', 'pptx'].includes(fileExtension)
                                                    ) {
                                                        icon = '📊';
                                                    } else if (
                                                        ['zip', 'rar', '7z'].includes(fileExtension)
                                                    ) {
                                                        icon = '📦';
                                                    } else if (
                                                        ['mp4', 'avi', 'mov', 'mkv'].includes(
                                                            fileExtension,
                                                        )
                                                    ) {
                                                        icon = '🎬';
                                                    } else if (
                                                        ['mp3', 'wav', 'ogg'].includes(
                                                            fileExtension,
                                                        )
                                                    ) {
                                                        icon = '🎵';
                                                    }

                                                    return (
                                                        <div
                                                            key={index}
                                                            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                                        >
                                                            <div className="flex items-center space-x-3">
                                                                <span className="text-2xl">
                                                                    {icon}
                                                                </span>
                                                                <div>
                                                                    <div className="font-medium text-gray-800">
                                                                        {attachment.name}
                                                                    </div>
                                                                    <div className="text-sm text-gray-500">
                                                                        {fileExtension.toUpperCase()}{' '}
                                                                        文件
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <a
                                                                href={attachment.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center space-x-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                                                            >
                                                                <span>⬇️</span>
                                                                <span>下载</span>
                                                            </a>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gray-100 rounded-lg p-12 text-center">
                                <div className="text-gray-400 text-6xl mb-4">🔒</div>
                                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                    内容已锁定
                                </h3>
                                <p className="text-gray-500">请先解锁此内容以查看完整详情</p>
                            </div>
                        )}
                    </div>

                    {/* Tags */}
                    {resource.tags && resource.tags.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">标签</h3>
                            <div className="flex flex-wrap gap-2">
                                {resource.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Comments Section */}
                    <div className="border-t pt-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">
                            评论回复 ({replies.length})
                        </h2>

                        {/* Reply Form */}
                        <form onSubmit={handleReplySubmit} className="mb-8">
                            <div className="mb-4">
                                <textarea
                                    value={newReply}
                                    onChange={(e) => setNewReply(e.target.value)}
                                    placeholder="写下您的评论..."
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={!newReply.trim()}
                                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                >
                                    发表评论
                                </button>
                            </div>
                        </form>

                        {/* Replies List */}
                        <div className="space-y-6">
                            {replies.map((reply) => (
                                <div key={reply.id} className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                                                {reply.author[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-800">
                                                    {reply.author}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {new Date(reply.createdAt).toLocaleString(
                                                        'zh-CN',
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <button className="text-gray-400 hover:text-red-500 text-sm">
                                            ❤️ {reply.likes}
                                        </button>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed">{reply.content}</p>
                                </div>
                            ))}

                            {replies.length === 0 && (
                                <div className="text-center py-12">
                                    <div className="text-gray-400 text-4xl mb-4">💬</div>
                                    <p className="text-gray-500">
                                        暂无评论，快来发表第一条评论吧！
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
