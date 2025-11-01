'use client';

import { useState } from 'react';
import CategoryList from '../components/CategoryList';
import CategoryGrid from '../components/CategoryGrid';
import PostCreator from '../components/PostCreator';
import ResourceDetail from '../components/ResourceDetail';
import CustomerService from '../components/CustomerService';
import RechargeCenter from '../components/RechargeCenter';
import AutoRecharge from '../components/AutoRecharge';
import PointsHistory from '../components/PointsHistory';
import MessageCenter from '../components/MessageCenter';
import AuthModal from '../components/AuthModal';
import Header from '../components/Header';
import { useAuthState } from '@/hooks/useAuth';

export default function Page() {
    const [activeTab, setActiveTab] = useState('home');
    const [currentView, setCurrentView] = useState('categories'); // 'categories', 'category-detail', 'post-creator', 'resource-detail', 'points-history', 'message-center'
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const [selectedResource, setSelectedResource] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [purchasedResources, setPurchasedResources] = useState<Set<number>>(new Set());
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const { user } = useAuthState();

    // 获取用户积分，如果未登录则默认为0
    const userPoints = user?.points || 0;

    // 资源分类数据
    const [resourceCategories, setResourceCategories] = useState([
        {
            id: 1,
            name: 'TK短视频作品',
            description: '热门短视频内容，创意灵感分享',
            count: 1247,
            newCount: 12,
            icon: '🎬',
            color: 'bg-red-500',
        },
        {
            id: 2,
            name: '欧美TK作品',
            description: '欧美风格短视频作品集合',
            count: 856,
            newCount: 8,
            icon: '🌍',
            color: 'bg-blue-500',
        },
        {
            id: 3,
            name: '演示文档作品专区',
            description: '专业演示文档模板和案例',
            count: 642,
            newCount: 5,
            icon: '📊',
            color: 'bg-green-500',
        },
        {
            id: 4,
            name: '美足足控区',
            description: '足部护理和美容相关内容',
            count: 423,
            newCount: 15,
            icon: '👠',
            color: 'bg-pink-500',
        },
        {
            id: 5,
            name: '女优作品专区',
            description: '优质女性创作者作品展示',
            count: 789,
            newCount: 23,
            icon: '👩‍🎨',
            color: 'bg-purple-500',
        },
        {
            id: 6,
            name: '追足作品',
            description: '足部艺术和摄影作品',
            count: 234,
            newCount: 7,
            icon: '📸',
            color: 'bg-indigo-500',
        },
        {
            id: 7,
            name: '编辑艺术作品',
            description: '视频编辑和后期制作教程',
            count: 567,
            newCount: 11,
            icon: '🎨',
            color: 'bg-yellow-500',
        },
    ]);

    // 分类详情页面的资源数据
    const [categoryResources, setCategoryResources] = useState<any>({
        1: [
            {
                id: 1,
                title: '亚洲人TK作品',
                author: 'akbjmdj',
                views: 1247,
                likes: 89,
                thumbnail: '/images/placeholder.png',
                description: '最新亚洲风格短视频作品，创意十足',
                content:
                    '这是一个详细的亚洲风格短视频作品教程。包含了从策划到拍摄，从剪辑到发布的完整流程。\n\n主要内容包括：\n1. 创意构思和脚本编写\n2. 拍摄技巧和设备选择\n3. 后期剪辑和特效制作\n4. 平台发布和推广策略\n\n通过学习本教程，您将能够制作出高质量的短视频内容。',
                contentImages: [
                    '/images/placeholder.png',
                    '/images/placeholder.png',
                    '/images/placeholder.png',
                ],

                points: 50,
                isPremium: true,
                tags: ['短视频', '创意', '教程'],
                createdAt: '2024-01-15T10:30:00Z',
            },
            {
                id: 2,
                title: '创意短视频合集',
                author: 'creator123',
                views: 856,
                likes: 67,
                thumbnail: '/images/placeholder.png',
                description: '精选创意短视频内容合集',
                content:
                    '本合集包含了50个精选的创意短视频案例，涵盖各种风格和主题。每个案例都有详细的制作说明和技巧分享。',
                contentImages: ['/images/placeholder.png', '/images/placeholder.png'],
                points: 30,
                isPremium: true,
                tags: ['合集', '创意', '案例'],
                createdAt: '2024-01-14T15:20:00Z',
            },
            {
                id: 3,
                title: '热门舞蹈视频',
                author: 'dancer_pro',
                views: 2341,
                likes: 156,
                thumbnail: '/images/placeholder.png',
                description: '最新热门舞蹈视频教学',
                content:
                    '专业舞蹈老师亲自教学，从基础动作到完整舞蹈，循序渐进的教学方式让您快速掌握热门舞蹈。',
                contentImages: [
                    '/images/placeholder.png',
                    '/images/placeholder.png',
                    '/images/placeholder.png',
                    '/images/placeholder.png',
                ],

                points: 40,
                isPremium: true,
                tags: ['舞蹈', '教学', '热门'],
                createdAt: '2024-01-13T09:15:00Z',
            },
        ],

        2: [
            {
                id: 4,
                title: '欧美风格作品',
                author: 'euromaster',
                views: 1205,
                likes: 78,
                thumbnail: '/images/placeholder.png',
                description: '精选欧美风格短视频作品',
                content: '深入分析欧美短视频的制作特点和文化背景，提供实用的制作技巧和创意思路。',
                contentImages: ['/images/placeholder.png'],
                points: 60,
                isPremium: true,
                tags: ['欧美', '风格', '分析'],
                createdAt: '2024-01-12T14:45:00Z',
            },
        ],
    });

    const featuredContent = [
        {
            id: 1,
            title: '高级React开发技巧分享',
            author: 'akbjmdj',
            points: 50,
            views: 1205,
            replies: 23,
            category: '前端开发',
            preview: '深入解析React Hooks的高级用法，包括自定义Hook的设计模式...',
            isPremium: true,
        },
        {
            id: 2,
            title: 'Python数据分析实战教程',
            author: 'datamaster',
            points: 80,
            views: 856,
            replies: 15,
            category: '数据科学',
            preview: '从零开始学习pandas和numpy，掌握数据清洗和可视化技巧...',
            isPremium: true,
        },
        {
            id: 3,
            title: 'UI设计系统构建指南',
            author: 'designpro',
            points: 60,
            views: 642,
            replies: 31,
            category: '设计',
            preview: '如何构建一套完整的设计系统，提高团队协作效率...',
            isPremium: true,
        },
    ];

    const freeContent = [
        {
            id: 4,
            title: 'JavaScript基础入门',
            author: 'coder123',
            points: 0,
            views: 2341,
            replies: 67,
            category: '编程基础',
            preview: 'JavaScript语言基础知识点总结，适合初学者...',
            isPremium: false,
        },
    ];

    // 处理分类点击
    const handleCategoryClick = (category: any) => {
        setSelectedCategory(category);
        setCurrentView('category-detail');
    };

    // 返回分类列表
    const handleBackToCategories = () => {
        setCurrentView('categories');
        setSelectedCategory(null);
        setSelectedResource(null);
    };

    // 处理发帖按钮点击
    const handleCreatePost = () => {
        setCurrentView('post-creator');
    };

    // 处理资源点击
    const handleResourceClick = (resource: any) => {
        setSelectedResource(resource);
        setCurrentView('resource-detail');
    };

    // 处理发帖提交
    const handlePostSubmit = async (postData: any) => {
        try {
            // 调用API保存帖子到数据库
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: postData.title,
                    content: postData.content,
                    category_id: selectedCategory?.id,
                    points_required: postData.points,
                    is_premium: postData.isPremium,
                    tags: postData.tags,
                }),
            });

            if (!response.ok) {
                throw new Error('发帖失败');
            }

            const result = await response.json();
            const postId = result.data.id;

            // 如果有缩略图，上传缩略图
            if (postData.thumbnail) {
                const formData = new FormData();
                formData.append('file', postData.thumbnail);
                formData.append('post_id', postId.toString());

                await fetch('/api/posts/images', {
                    method: 'POST',
                    body: formData,
                });
            }

            // 如果有内容图片，上传内容图片
            if (postData.contentImages && postData.contentImages.length > 0) {
                for (const image of postData.contentImages) {
                    const formData = new FormData();
                    formData.append('file', image);
                    formData.append('post_id', postId.toString());

                    await fetch('/api/posts/images', {
                        method: 'POST',
                        body: formData,
                    });
                }
            }

            // 添加到对应分类的资源列表（用于前端显示）
            const newResource = {
                ...postData,
                id: postId,
                views: 0,
                likes: 0,
                thumbnail: postData.thumbnail
                    ? URL.createObjectURL(postData.thumbnail)
                    : '/images/placeholder.png',
                contentImages: postData.contentImages
                    ? postData.contentImages.map((file: any) => URL.createObjectURL(file))
                    : [],
                attachments: postData.attachments || [],
                createdAt: new Date().toISOString(),
                replies: [],
            };

            // 更新资源列表
            setCategoryResources((prev: any) => ({
                ...prev,
                [selectedCategory?.id]: [newResource, ...(prev[selectedCategory?.id] || [])],
            }));

            // 更新分类计数
            setResourceCategories((prev) =>
                prev.map((cat: any) =>
                    cat.id === selectedCategory?.id
                        ? { ...cat, count: cat.count + 1, newCount: cat.newCount + 1 }
                        : cat,
                ),
            );

            setCurrentView('category-detail');
            alert('发帖成功！');
        } catch (error) {
            console.error('发帖失败:', error);
            alert('发帖失败，请重试');
        }
    };

    // 处理搜索
    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            alert('请输入搜索关键词');
            return;
        }

        try {
            // 调用搜索API
            const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
            if (!response.ok) {
                throw new Error('搜索失败');
            }

            const result = await response.json();

            // 显示搜索结果
            alert(`找到 ${result.data.total} 个相关结果`);
            // 这里可以添加更多搜索结果显示逻辑
            console.log('搜索结果:', result);
        } catch (error) {
            console.error('搜索失败:', error);
            alert('搜索失败，请重试');
        }
    };

    // 处理资源购买
    const handleResourcePurchase = (resourceId: number, points: number) => {
        if (userPoints >= points) {
            // TODO: 实现积分扣除的API调用
            // setUserPoints((prev) => prev - points);
            // 添加到已购买资源集合中
            setPurchasedResources((prev) => new Set(prev).add(resourceId));
            // 这里应该调用API记录购买
            console.log(`Purchased resource ${resourceId} for ${points} points`);
        }
    };

    // 处理充值
    const handleRecharge = (amount: number, points: number) => {
        // TODO: 实现积分充值的API调用
        // setUserPoints((prev) => prev + points);
        console.log(`Recharged ¥${amount}, got ${points} points`);
    };

    // 关闭模态框
    const handleCloseModal = () => {
        if (currentView === 'post-creator') {
            setCurrentView('category-detail');
        } else if (currentView === 'resource-detail') {
            setCurrentView('category-detail');
        } else if (currentView === 'points-history' || currentView === 'message-center') {
            setCurrentView('categories');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 rounded-none">
            {/* Header */}
            <Header onLoginClick={() => setIsAuthModalOpen(true)} />

            {/* Navigation */}
            <nav className="bg-blue-600 text-white">
                <div className="container mx-auto px-4">
                    <div className="flex space-x-8 h-[40px]">
                        {[
                            { key: 'home', label: '主页首页' },
                            { key: 'customer-service', label: '客服中心' },
                            { key: 'recharge-center', label: '充值中心' },
                            { key: 'auto-recharge', label: '自助充值' },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => {
                                    setActiveTab(tab.key);
                                    if (tab.key === 'home') {
                                        handleBackToCategories();
                                    }
                                }}
                                className={`py-3 px-2 border-b-2 transition-colors ${
                                    activeTab === tab.key
                                        ? 'border-white bg-blue-700'
                                        : 'border-transparent hover:bg-blue-700'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Search Bar */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center space-x-4">
                        <input
                            type="text"
                            placeholder="搜索知识内容..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <button
                            onClick={handleSearch}
                            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                        >
                            搜索
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {activeTab === 'home' && currentView === 'categories' ? (
                            <>
                                {/* Points Notice */}

                                {/* Resource Categories */}
                                <CategoryList
                                    categories={resourceCategories}
                                    onCategoryClick={handleCategoryClick}
                                />
                            </>
                        ) : activeTab === 'home' && currentView === 'category-detail' ? (
                            <>
                                {/* Category Detail View */}
                                <div className="mb-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <button
                                            onClick={handleBackToCategories}
                                            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                                        >
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 19l-7-7 7-7"
                                                />
                                            </svg>
                                            <span>返回分类列表</span>
                                        </button>
                                        <button
                                            onClick={handleCreatePost}
                                            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 flex items-center space-x-2"
                                        >
                                            <span>✏️</span>
                                            <span>发布资源</span>
                                        </button>
                                    </div>
                                    <div className="bg-white rounded-lg shadow p-6">
                                        <div className="flex items-center space-x-4 mb-4">
                                            <div
                                                className={`w-16 h-16 ${selectedCategory?.color} rounded-lg flex items-center justify-center text-white text-2xl`}
                                            >
                                                {selectedCategory?.icon}
                                            </div>
                                            <div>
                                                <h1 className="text-2xl font-bold text-gray-800">
                                                    {selectedCategory?.name}
                                                </h1>
                                                <p className="text-gray-600">
                                                    {selectedCategory?.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Resource Grid */}
                                <CategoryGrid
                                    resources={categoryResources[selectedCategory?.id] || []}
                                    userPoints={userPoints}
                                    onResourceClick={handleResourceClick}
                                />

                                {/* Empty State */}
                                {(!categoryResources[selectedCategory?.id] ||
                                    categoryResources[selectedCategory?.id].length === 0) && (
                                    <div className="bg-white rounded-lg shadow p-12 text-center">
                                        <div className="text-gray-400 text-6xl mb-4">📁</div>
                                        <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                            暂无资源
                                        </h3>
                                        <p className="text-gray-500">
                                            该分类下暂时没有资源，请稍后再来查看
                                        </p>
                                    </div>
                                )}
                            </>
                        ) : activeTab === 'customer-service' ? (
                            <CustomerService />
                        ) : activeTab === 'recharge-center' ? (
                            <RechargeCenter userPoints={userPoints} onRecharge={handleRecharge} />
                        ) : activeTab === 'auto-recharge' ? (
                            <AutoRecharge userPoints={userPoints} onRecharge={handleRecharge} />
                        ) : null}

                        {/* Modals */}
                        {currentView === 'post-creator' && selectedCategory && (
                            <PostCreator
                                categoryId={selectedCategory.id}
                                categoryName={selectedCategory.name}
                                onClose={handleCloseModal}
                                onSubmit={handlePostSubmit}
                            />
                        )}
                        {currentView === 'resource-detail' && selectedResource && (
                            <ResourceDetail
                                resource={selectedResource}
                                userPoints={userPoints}
                                onClose={handleCloseModal}
                                onPurchase={handleResourcePurchase}
                            />
                        )}
                    </div>

                    {/* Sidebar */}
                </div>
            </div>

            {/* Auth Modal */}
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </div>
    );
}
