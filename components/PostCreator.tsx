'use client';

import { useState } from 'react';

interface PostCreatorProps {
    categoryId: number;
    categoryName: string;
    onClose: () => void;
    onSubmit: (postData: any) => void;
}

export default function PostCreator({
    categoryId,
    categoryName,
    onClose,
    onSubmit,
}: PostCreatorProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const [points, setPoints] = useState(30);
    const [isPremium, setIsPremium] = useState(true);
    const [tags, setTags] = useState('');
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [contentImages, setContentImages] = useState<File[]>([]);
    const [attachments, setAttachments] = useState<File[]>([]); // 新增：附件状态

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !description.trim() || !content.trim()) {
            alert('请填写所有必填字段');
            return;
        }

        const postData = {
            title: title.trim(),
            description: description.trim(),
            content: content.trim(),
            points,
            isPremium,
            tags: tags
                .split(',')
                .map((tag) => tag.trim())
                .filter((tag) => tag),
            thumbnail,
            contentImages,
            attachments: attachments.map((file) => ({
                name: file.name,
                size: file.size,
                type: file.type,
                url: URL.createObjectURL(file), // 创建临时URL用于显示
                file: file, // 保存文件对象
            })),
            author: '当前用户', // 这里应该从用户状态获取
            categoryId,
        };

        onSubmit(postData);
    };

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setThumbnail(e.target.files[0]);
        }
    };

    const handleContentImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setContentImages(Array.from(e.target.files));
        }
    };

    const handleAttachmentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setAttachments(Array.from(e.target.files));
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header with gradient */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold mb-1">发布资源到 "{categoryName}"</h2>
                            <p className="text-blue-100 text-sm">分享您的知识，获得积分奖励</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:text-blue-200 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                        >
                            ×
                        </button>
                    </div>
                </div>

                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* 基本信息区域 */}
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm mr-2">
                                    1
                                </span>
                                基本信息
                            </h3>

                            {/* 标题 */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    资源标题 *
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="请输入吸引人的资源标题"
                                    required
                                />
                            </div>

                            {/* 描述 */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    资源描述 *
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                    placeholder="简要描述您的资源内容，让用户快速了解价值"
                                    required
                                />
                            </div>
                        </div>

                        {/* 内容区域 */}
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm mr-2">
                                    2
                                </span>
                                详细内容
                            </h3>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    详细内容（用户付费后可见） *
                                </label>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    rows={10}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                    placeholder="请输入详细内容，支持换行。这里是用户付费后能看到的核心内容..."
                                    required
                                />

                                <div className="mt-2 text-sm text-gray-500">
                                    💡 提示：内容越详细，用户越愿意付费解锁
                                </div>
                            </div>
                        </div>

                        {/* 媒体文件区域 */}
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <span className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm mr-2">
                                    3
                                </span>
                                媒体文件
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* 缩略图 */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        缩略图
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleThumbnailChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        />

                                        {thumbnail && (
                                            <div className="mt-2 text-sm text-green-600">
                                                ✓ 已选择: {thumbnail.name}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* 内容图片 */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        内容图片（可多选）
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleContentImagesChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                                        />

                                        {contentImages.length > 0 && (
                                            <div className="mt-2 text-sm text-green-600">
                                                ✓ 已选择 {contentImages.length} 张图片
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* 附件上传 */}
                            <div className="mt-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    付费附件（可多选）
                                </label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        multiple
                                        onChange={handleAttachmentsChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                                    />

                                    {attachments.length > 0 && (
                                        <div className="mt-2">
                                            <div className="text-sm text-green-600 mb-2">
                                                ✓ 已选择 {attachments.length} 个附件
                                            </div>
                                            <div className="space-y-1">
                                                {attachments.map((file, index) => (
                                                    <div
                                                        key={index}
                                                        className="text-xs text-gray-600 bg-white px-2 py-1 rounded"
                                                    >
                                                        📎 {file.name} (
                                                        {(file.size / 1024 / 1024).toFixed(2)} MB)
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-2 text-sm text-gray-500">
                                    💡 支持各种文件格式，用户解锁后可下载
                                </div>
                            </div>
                        </div>

                        {/* 设置区域 */}
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <span className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm mr-2">
                                    4
                                </span>
                                发布设置
                            </h3>

                            {/* 标签 */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    标签（用逗号分隔）
                                </label>
                                <input
                                    type="text"
                                    value={tags}
                                    onChange={(e) => setTags(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="例如：教程,实用,热门"
                                />

                                <div className="mt-2 text-sm text-gray-500">
                                    💡 好的标签有助于用户发现您的内容
                                </div>
                            </div>

                            {/* 积分设置 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        所需积分
                                    </label>
                                    <input
                                        type="number"
                                        value={points}
                                        onChange={(e) => setPoints(parseInt(e.target.value) || 0)}
                                        min="0"
                                        max="1000"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />

                                    <div className="mt-2 text-sm text-gray-500">
                                        建议：30-100积分
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        资源类型
                                    </label>
                                    <select
                                        value={isPremium ? 'premium' : 'free'}
                                        onChange={(e) => setIsPremium(e.target.value === 'premium')}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    >
                                        <option value="free">免费资源</option>
                                        <option value="premium">付费资源</option>
                                    </select>
                                    <div className="mt-2 text-sm text-gray-500">
                                        {isPremium
                                            ? '💰 用户需要积分解锁'
                                            : '🆓 所有用户可免费查看'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 提交按钮 */}
                        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-8 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                            >
                                取消
                            </button>
                            <button
                                type="submit"
                                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 font-medium transition-all transform hover:scale-105 shadow-lg"
                            >
                                🚀 发布资源
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
