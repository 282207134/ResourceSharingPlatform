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
        <div className="space-y-6">
            {/* User Stats */}
            <div className="bg-white rounded-lg shadow p-4">
                <h3 className="font-bold text-gray-800 mb-3">我的统计</h3>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span>当前积分:</span>
                        <span className="font-bold text-orange-600">{userPoints}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>已解锁内容:</span>
                        <span>12篇</span>
                    </div>
                    <div className="flex justify-between">
                        <span>发布内容:</span>
                        <span>3篇</span>
                    </div>
                </div>
            </div>

            {/* User Actions */}
            <div className="bg-white rounded-lg shadow p-4">
                <h3 className="font-bold text-gray-800 mb-3">用户中心</h3>
                <div className="space-y-3">
                    <button
                        onClick={onPointsHistoryClick}
                        className="w-full flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                    >
                        <div className="flex items-center space-x-2">
                            <span>📊</span>
                            <span className="text-sm">积分记录</span>
                        </div>
                        <span className="text-gray-400">→</span>
                    </button>
                    <button
                        onClick={onMessageCenterClick}
                        className="w-full flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                    >
                        <div className="flex items-center space-x-2">
                            <span>💬</span>
                            <span className="text-sm">消息中心</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="bg-red-500 text-white text-xs px-1 rounded-full">
                                2
                            </span>
                            <span className="text-gray-400">→</span>
                        </div>
                    </button>
                    <button className="w-full flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-2">
                            <span>👤</span>
                            <span className="text-sm">个人设置</span>
                        </div>
                        <span className="text-gray-400">→</span>
                    </button>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-4">
                <h3 className="font-bold text-gray-800 mb-3">快捷操作</h3>
                <div className="space-y-2">
                    <button
                        onClick={onCustomerServiceClick}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                    >
                        <span>💬</span>
                        <span>联系客服</span>
                    </button>
                    <button
                        onClick={onRechargeCenterClick}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                    >
                        <span>💰</span>
                        <span>充值积分</span>
                    </button>
                    <button
                        onClick={onPointsHistoryClick}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                    >
                        <span>📊</span>
                        <span>积分记录</span>
                    </button>
                </div>
            </div>

            {/* Hot Categories */}
            <div className="bg-white rounded-lg shadow p-4">
                <h3 className="font-bold text-gray-800 mb-3">热门分类</h3>
                <div className="space-y-2">
                    {categories.slice(0, 6).map((category) => (
                        <button
                            key={category.id}
                            onClick={() => onCategoryClick(category)}
                            className="flex items-center justify-between w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                        >
                            <div className="flex items-center space-x-2">
                                <span>{category.icon}</span>
                                <span>{category.name}</span>
                            </div>
                            {category.newCount > 0 && (
                                <span className="bg-red-500 text-white text-xs px-1 rounded">
                                    {category.newCount}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow p-4">
                <h3 className="font-bold text-gray-800 mb-3">最近活动</h3>
                <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span className="text-gray-600">充值获得 +500积分</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span className="text-gray-600">解锁了"TK短视频作品"</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        <span className="text-gray-600">发表了评论</span>
                    </div>
                </div>
            </div>

            {/* System Notice */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-bold text-yellow-800 mb-2">📢 系统公告</h3>
                <div className="text-sm text-yellow-700 space-y-1">
                    <p>• 新用户注册送100积分</p>
                    <p>• 充值积分享受优质内容</p>
                    <p>• 发布优质内容可获得额外积分</p>
                </div>
            </div>
        </div>
    );
}
('use client');

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
        <div className="space-y-6" data-oid="oipxpqo">
            {/* User Stats */}
            <div className="bg-white rounded-lg shadow p-4" data-oid="s80eny:">
                <h3 className="font-bold text-gray-800 mb-3" data-oid="quie-1x">
                    我的统计
                </h3>
                <div className="space-y-2 text-sm" data-oid="k955tw7">
                    <div className="flex justify-between" data-oid="s3q6x-4">
                        <span data-oid="3dc.-h-">当前积分:</span>
                        <span className="font-bold text-orange-600" data-oid="bl.ch0d">
                            {userPoints}
                        </span>
                    </div>
                    <div className="flex justify-between" data-oid="9nrltkl">
                        <span data-oid="8lk:9v2">已解锁内容:</span>
                        <span data-oid="v6-jvsb">12篇</span>
                    </div>
                    <div className="flex justify-between" data-oid="1c-f6at">
                        <span data-oid="t9thd5p">发布内容:</span>
                        <span data-oid="m_zlutv">3篇</span>
                    </div>
                </div>
            </div>

            {/* User Actions */}
            <div className="bg-white rounded-lg shadow p-4" data-oid="q3dakj0">
                <h3 className="font-bold text-gray-800 mb-3" data-oid="z3q9dg.">
                    用户中心
                </h3>
                <div className="space-y-3" data-oid="b-zqtls">
                    <button
                        onClick={onPointsHistoryClick}
                        className="w-full flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                        data-oid="03w_ezr"
                    >
                        <div className="flex items-center space-x-2" data-oid="5h-x5q8">
                            <span data-oid="p25b7sq">📊</span>
                            <span className="text-sm" data-oid="6dyk8dl">
                                积分记录
                            </span>
                        </div>
                        <span className="text-gray-400" data-oid="-mxl3iq">
                            →
                        </span>
                    </button>
                    <button
                        onClick={onMessageCenterClick}
                        className="w-full flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                        data-oid="0rl1n-_"
                    >
                        <div className="flex items-center space-x-2" data-oid="zrgwxpo">
                            <span data-oid="8-e_7.k">💬</span>
                            <span className="text-sm" data-oid="yir4qwg">
                                消息中心
                            </span>
                        </div>
                        <div className="flex items-center space-x-2" data-oid="e4gr8zz">
                            <span
                                className="bg-red-500 text-white text-xs px-1 rounded-full"
                                data-oid="jrkioer"
                            >
                                2
                            </span>
                            <span className="text-gray-400" data-oid="3w26:wx">
                                →
                            </span>
                        </div>
                    </button>
                    <button
                        className="w-full flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                        data-oid="vgsxm:h"
                    >
                        <div className="flex items-center space-x-2" data-oid="7om5afv">
                            <span data-oid="jxnw-pc">👤</span>
                            <span className="text-sm" data-oid="l4w5cqc">
                                个人设置
                            </span>
                        </div>
                        <span className="text-gray-400" data-oid="23slkb5">
                            →
                        </span>
                    </button>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-4" data-oid="hny9glg">
                <h3 className="font-bold text-gray-800 mb-3" data-oid="e_e3anx">
                    快捷操作
                </h3>
                <div className="space-y-2" data-oid="vso8hva">
                    <button
                        onClick={onCustomerServiceClick}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                        data-oid="oa20l86"
                    >
                        <span data-oid=".nbly7k">💬</span>
                        <span data-oid="s-xwhbb">联系客服</span>
                    </button>
                    <button
                        onClick={onRechargeCenterClick}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                        data-oid="qjrayvo"
                    >
                        <span data-oid="x-wk2b7">💰</span>
                        <span data-oid=":cpvaf_">充值积分</span>
                    </button>
                    <button
                        onClick={onPointsHistoryClick}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                        data-oid="2lpepf6"
                    >
                        <span data-oid="3ej4jip">📊</span>
                        <span data-oid=":sk6r3o">积分记录</span>
                    </button>
                </div>
            </div>

            {/* Hot Categories */}
            <div className="bg-white rounded-lg shadow p-4" data-oid="o6z18r5">
                <h3 className="font-bold text-gray-800 mb-3" data-oid="f1fmd78">
                    热门分类
                </h3>
                <div className="space-y-2" data-oid="8j:nglp">
                    {categories.slice(0, 6).map((category) => (
                        <button
                            key={category.id}
                            onClick={() => onCategoryClick(category)}
                            className="flex items-center justify-between w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                            data-oid="gc_:oe8"
                        >
                            <div className="flex items-center space-x-2" data-oid="w:254kv">
                                <span data-oid="r3sn-th">{category.icon}</span>
                                <span data-oid="b5043ew">{category.name}</span>
                            </div>
                            {category.newCount > 0 && (
                                <span
                                    className="bg-red-500 text-white text-xs px-1 rounded"
                                    data-oid="0g25oxj"
                                >
                                    {category.newCount}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow p-4" data-oid="it3l9ek">
                <h3 className="font-bold text-gray-800 mb-3" data-oid="n-s128:">
                    最近活动
                </h3>
                <div className="space-y-3 text-sm" data-oid="s0yn_xc">
                    <div className="flex items-center space-x-2" data-oid="it3-bia">
                        <span
                            className="w-2 h-2 bg-green-500 rounded-full"
                            data-oid="i00azac"
                        ></span>
                        <span className="text-gray-600" data-oid="a2r12fp">
                            充值获得 +500积分
                        </span>
                    </div>
                    <div className="flex items-center space-x-2" data-oid="thp:6g1">
                        <span
                            className="w-2 h-2 bg-blue-500 rounded-full"
                            data-oid="3:_wvz4"
                        ></span>
                        <span className="text-gray-600" data-oid="ad4kzbj">
                            解锁了"TK短视频作品"
                        </span>
                    </div>
                    <div className="flex items-center space-x-2" data-oid="cpiihqh">
                        <span
                            className="w-2 h-2 bg-purple-500 rounded-full"
                            data-oid="fdn8jzr"
                        ></span>
                        <span className="text-gray-600" data-oid="zxnepck">
                            发表了评论
                        </span>
                    </div>
                </div>
            </div>

            {/* System Notice */}
            <div
                className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4"
                data-oid="qbcbbqc"
            >
                <h3 className="font-bold text-yellow-800 mb-2" data-oid="rel65k7">
                    📢 系统公告
                </h3>
                <div className="text-sm text-yellow-700 space-y-1" data-oid="8pf..yk">
                    <p data-oid=".7gxo4q">• 新用户注册送100积分</p>
                    <p data-oid="3tl.zsl">• 充值积分享受优质内容</p>
                    <p data-oid="bjd2_8-">• 发布优质内容可获得额外积分</p>
                </div>
            </div>
        </div>
    );
}
