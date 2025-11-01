'use client';

import { useState } from 'react';

export default function CustomerService() {
    const [selectedService, setSelectedService] = useState('contact');

    const serviceOptions = [
        { key: 'contact', label: '联系客服', icon: '💬' },
        { key: 'faq', label: '常见问题', icon: '❓' },
        { key: 'feedback', label: '意见反馈', icon: '📝' },
        { key: 'report', label: '举报投诉', icon: '🚨' },
    ];

    const faqData = [
        {
            question: '如何获得积分？',
            answer: '您可以通过每日签到、发布优质内容、评论互动、邀请好友等方式获得积分。',
        },
        {
            question: '如何解锁付费内容？',
            answer: '使用积分即可解锁付费内容，解锁后可永久查看。',
        },
        {
            question: '如何发布资源？',
            answer: '进入相应分类页面，点击"发布资源"按钮即可创建新的资源内容。',
        },
        {
            question: '忘记密码怎么办？',
            answer: '请联系客服或使用找回密码功能重置您的账户密码。',
        },
    ];

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">客服中心</h2>
                <p className="text-gray-600">我们随时为您提供帮助和支持</p>
            </div>

            <div className="flex">
                {/* Sidebar */}
                <div className="w-1/4 border-r">
                    <div className="p-4">
                        {serviceOptions.map((option) => (
                            <button
                                key={option.key}
                                onClick={() => setSelectedService(option.key)}
                                className={`w-full flex items-center space-x-3 p-3 rounded-lg mb-2 transition-colors ${
                                    selectedService === option.key
                                        ? 'bg-blue-100 text-blue-600'
                                        : 'hover:bg-gray-100'
                                }`}
                            >
                                <span className="text-xl">{option.icon}</span>
                                <span>{option.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-6">
                    {selectedService === 'contact' && (
                        <div>
                            <h3 className="text-xl font-semibold mb-4">联系客服</h3>
                            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-6 mb-6">
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl">
                                        👨‍💼
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-800">
                                            在线客服
                                        </h4>
                                        <p className="text-gray-600">
                                            客服在线时间：早8:00--凌晨2:00
                                        </p>
                                        <p className="text-red-600 text-sm">(18小时在线)</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="bg-white rounded-lg p-4">
                                        <h5 className="font-semibold text-gray-800 mb-2">
                                            联系方式
                                        </h5>
                                        <p className="text-gray-700">QQ: 2672282072</p>
                                        <p className="text-gray-700">备用QQ: 3358338607</p>
                                        <p className="text-gray-700">微信: thykm88</p>
                                    </div>

                                    <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4">
                                        <h5 className="font-semibold text-yellow-800 mb-2">
                                            温馨提示
                                        </h5>
                                        <p className="text-yellow-700 text-sm">
                                            请加客服时注明来意，客服会尽快为您处理问题。工作时间外留言，客服会在上班时间及时回复。
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {selectedService === 'faq' && (
                        <div>
                            <h3 className="text-xl font-semibold mb-4">常见问题</h3>
                            <div className="space-y-4">
                                {faqData.map((faq, index) => (
                                    <div
                                        key={index}
                                        className="border border-gray-200 rounded-lg p-4"
                                    >
                                        <h4 className="font-semibold text-gray-800 mb-2">
                                            Q: {faq.question}
                                        </h4>
                                        <p className="text-gray-600">A: {faq.answer}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {selectedService === 'feedback' && (
                        <div>
                            <h3 className="text-xl font-semibold mb-4">意见反馈</h3>
                            <form className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        反馈类型
                                    </label>
                                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option>功能建议</option>
                                        <option>Bug反馈</option>
                                        <option>内容问题</option>
                                        <option>其他</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        详细描述
                                    </label>
                                    <textarea
                                        rows={6}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="请详细描述您的问题或建议..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        联系方式（可选）
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="QQ/微信/邮箱"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                                >
                                    提交反馈
                                </button>
                            </form>
                        </div>
                    )}

                    {selectedService === 'report' && (
                        <div>
                            <h3 className="text-xl font-semibold mb-4">举报投诉</h3>
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                                <h4 className="font-semibold text-red-800 mb-2">举报须知</h4>
                                <ul className="text-red-700 text-sm space-y-1">
                                    <li>• 请如实填写举报信息，恶意举报将被处理</li>
                                    <li>• 我们会在24小时内处理您的举报</li>
                                    <li>• 举报结果将通过站内信通知您</li>
                                </ul>
                            </div>

                            <form className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        举报类型
                                    </label>
                                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option>违规内容</option>
                                        <option>虚假信息</option>
                                        <option>侵权内容</option>
                                        <option>恶意行为</option>
                                        <option>其他</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        被举报内容链接或ID
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="请提供具体的内容链接或ID"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        举报详情
                                    </label>
                                    <textarea
                                        rows={6}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="请详细说明举报原因和具体情况..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
                                >
                                    提交举报
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
