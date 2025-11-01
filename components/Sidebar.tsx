'use client';

interface SidebarProps {
    userPoints: number;
    categories: Array<any>;
    onCategoryClick: (category: any) => void;
    onPointsHistoryClick: () => void;
    onMessageCenterClick: () => void;
    onCustomerServiceClick: () => void;
    onRechargeCenterClick: () => void;
}

export default function Sidebar({
    userPoints,
    categories,
    onCategoryClick,
    onPointsHistoryClick,
    onMessageCenterClick,
    onCustomerServiceClick,
    onRechargeCenterClick,
}: SidebarProps) {
    return (
        <div className="space-y-4 lg:space-y-6 w-full">
            {/* User Stats */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5 lg:p-6">
                <h3 className="font-semibold text-gray-800 mb-3">我的统计</h3>
                <div className="space-y-2 text-xs sm:text-sm text-gray-600">
                    <div className="flex items-center justify-between">
                        <span>当前积分</span>
                        <span className="font-semibold text-orange-500 text-sm sm:text-base">
                            {userPoints}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span>已解锁内容</span>
                        <span>12 篇</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span>发布内容</span>
                        <span>3 篇</span>
                    </div>
                </div>
            </div>

            {/* User Center */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5 lg:p-6">
                <h3 className="font-semibold text-gray-800 mb-3">用户中心</h3>
                <div className="space-y-2.5">
                    <button
                        onClick={onPointsHistoryClick}
                        className="w-full flex items-center justify-between px-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                    >
                        <div className="flex items-center gap-2 text-gray-700">
                            <span>📊</span>
                            <span>积分记录</span>
                        </div>
                        <span className="text-gray-400">→</span>
                    </button>
                    <button
                        onClick={onMessageCenterClick}
                        className="w-full flex items-center justify-between px-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                    >
                        <div className="flex items-center gap-2 text-gray-700">
                            <span>💬</span>
                            <span>消息中心</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="bg-red-500 text-white text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full">
                                2
                            </span>
                            <span className="text-gray-400">→</span>
                        </div>
                    </button>
                    <button className="w-full flex items-center justify-between px-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                        <div className="flex items-center gap-2 text-gray-700">
                            <span>👤</span>
                            <span>个人设置</span>
                        </div>
                        <span className="text-gray-400">→</span>
                    </button>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5 lg:p-6">
                <h3 className="font-semibold text-gray-800 mb-3">快捷操作</h3>
                <div className="space-y-2">
                    <button
                        onClick={onCustomerServiceClick}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs sm:text-sm text-gray-700 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                        <span>💬</span>
                        <span>联系客服</span>
                    </button>
                    <button
                        onClick={onRechargeCenterClick}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs sm:text-sm text-gray-700 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                        <span>💰</span>
                        <span>充值积分</span>
                    </button>
                    <button
                        onClick={onPointsHistoryClick}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs sm:text-sm text-gray-700 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                        <span>📊</span>
                        <span>积分记录</span>
                    </button>
                </div>
            </div>

            {/* Hot Categories */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5 lg:p-6">
                <h3 className="font-semibold text-gray-800 mb-3">热门分类</h3>
                <div className="space-y-1.5">
                    {categories.slice(0, 6).map((category) => (
                        <button
                            key={category.id}
                            onClick={() => onCategoryClick(category)}
                            className="flex items-center justify-between w-full text-left px-3 py-2 text-xs sm:text-sm text-gray-700 hover:bg-slate-100 rounded-xl transition-colors"
                        >
                            <div className="flex items-center gap-2 truncate">
                                <span>{category.icon}</span>
                                <span className="truncate">{category.name}</span>
                            </div>
                            {category.newCount > 0 && (
                                <span className="bg-red-500 text-white text-[10px] sm:text-xs px-1.5 rounded-full">
                                    {category.newCount}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5 lg:p-6">
                <h3 className="font-semibold text-gray-800 mb-3">最近活动</h3>
                <div className="space-y-3 text-xs sm:text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500" />
                        <span>充值获得 +500 积分</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        <span>解锁了「TK短视频作品」</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-500" />
                        <span>发表了评论</span>
                    </div>
                </div>
            </div>

            {/* System Notice */}
            <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 border border-amber-200 rounded-2xl p-4 sm:p-5 lg:p-6">
                <h3 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
                    <span>📢</span>
                    <span>系统公告</span>
                </h3>
                <ul className="space-y-1.5 text-xs sm:text-sm text-amber-700">
                    <li>• 新用户注册送 100 积分</li>
                    <li>• 充值积分享受优质内容</li>
                    <li>• 发布优质内容可获得额外积分</li>
                </ul>
            </div>
        </div>
    );
}
