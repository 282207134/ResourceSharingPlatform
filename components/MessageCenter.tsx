import { useState } from 'react';

interface Message {
    id: number;
    from: string;
    fromType: 'user' | 'admin' | 'system';
    title: string;
    content: string;
    date: string;
    isRead: boolean;
    type: 'system' | 'personal' | 'announcement';
}

interface MessageCenterProps {
    onClose: () => void;
}

export default function MessageCenter({ onClose }: MessageCenterProps) {
    const [activeTab, setActiveTab] = useState('all');
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

    // 模拟消息数据
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            from: '系统管理员',
            fromType: 'admin',
            title: '欢迎加入知足常乐平台',
            content:
                '欢迎您加入我们的知识付费平台！在这里您可以发现优质的学习资源，也可以分享您的知识和经验。如有任何问题，请随时联系客服。',
            date: '2024-01-15 10:30:00',
            isRead: false,
            type: 'system',
        },
        {
            id: 2,
            from: 'akbjmdj',
            fromType: 'user',
            title: '感谢您的支持',
            content:
                '感谢您解锁了我的"亚洲人TK作品"教程，希望对您有所帮助。如果有任何问题或建议，欢迎随时交流！',
            date: '2024-01-15 09:20:00',
            isRead: true,
            type: 'personal',
        },
        {
            id: 3,
            from: '平台公告',
            fromType: 'system',
            title: '平台功能更新通知',
            content:
                '我们新增了积分记录查询功能，您现在可以查看详细的积分使用记录。同时优化了资源浏览体验，图片现在可以免费预览。',
            date: '2024-01-14 16:45:00',
            isRead: false,
            type: 'announcement',
        },
        {
            id: 4,
            from: 'creator123',
            fromType: 'user',
            title: '新作品发布通知',
            content: '我刚刚发布了新的创意短视频合集，包含50个精选案例。欢迎查看和交流！',
            date: '2024-01-14 14:20:00',
            isRead: true,
            type: 'personal',
        },
        {
            id: 5,
            from: '客服中心',
            fromType: 'admin',
            title: '充值成功通知',
            content: '您的充值已成功到账，获得500积分。感谢您对平台的支持！',
            date: '2024-01-13 20:30:00',
            isRead: true,
            type: 'system',
        },
    ]);

    const filteredMessages = messages.filter((message) => {
        if (activeTab === 'all') return true;
        if (activeTab === 'unread') return !message.isRead;
        return message.type === activeTab;
    });

    const unreadCount = messages.filter((m) => !m.isRead).length;

    const handleMessageClick = (message: Message) => {
        setSelectedMessage(message);
        if (!message.isRead) {
            setMessages((prev) =>
                prev.map((m) => (m.id === message.id ? { ...m, isRead: true } : m)),
            );
        }
    };

    const markAllAsRead = () => {
        setMessages((prev) => prev.map((m) => ({ ...m, isRead: true })));
    };

    const deleteMessage = (messageId: number) => {
        setMessages((prev) => prev.filter((m) => m.id !== messageId));
        if (selectedMessage?.id === messageId) {
            setSelectedMessage(null);
        }
    };

    const getFromIcon = (fromType: string) => {
        switch (fromType) {
            case 'admin':
                return '👨‍💼';
            case 'system':
                return '🤖';
            case 'user':
                return '👤';
            default:
                return '📧';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'system':
                return 'bg-blue-100 text-blue-800';
            case 'personal':
                return 'bg-green-100 text-green-800';
            case 'announcement':
                return 'bg-orange-100 text-orange-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex">
                {/* Left Sidebar */}
                <div className="w-1/3 border-r flex flex-col">
                    {/* Header */}
                    <div className="p-4 border-b">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-800">消息中心</h2>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 text-xl"
                            >
                                ×
                            </button>
                        </div>

                        {unreadCount > 0 && (
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">
                                    {unreadCount} 条未读消息
                                </span>
                                <button
                                    onClick={markAllAsRead}
                                    className="text-sm text-blue-600 hover:text-blue-800"
                                >
                                    全部标记已读
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Tabs */}
                    <div className="border-b">
                        <div className="flex flex-wrap px-4">
                            {[
                                { key: 'all', label: '全部' },
                                { key: 'unread', label: '未读' },
                                { key: 'system', label: '系统' },
                                { key: 'personal', label: '私信' },
                                { key: 'announcement', label: '公告' },
                            ].map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`py-2 px-3 text-sm border-b-2 transition-colors ${
                                        activeTab === tab.key
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    {tab.label}
                                    {tab.key === 'unread' && unreadCount > 0 && (
                                        <span className="ml-1 bg-red-500 text-white text-xs px-1 rounded-full">
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Messages List */}
                    <div className="flex-1 overflow-y-auto">
                        {filteredMessages.length > 0 ? (
                            <div className="divide-y">
                                {filteredMessages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                                            selectedMessage?.id === message.id ? 'bg-blue-50' : ''
                                        } ${!message.isRead ? 'bg-yellow-50' : ''}`}
                                        onClick={() => handleMessageClick(message)}
                                    >
                                        <div className="flex items-start space-x-3">
                                            <div className="text-lg">
                                                {getFromIcon(message.fromType)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <span className="font-medium text-gray-800 truncate">
                                                        {message.from}
                                                    </span>
                                                    <span
                                                        className={`text-xs px-2 py-1 rounded ${getTypeColor(message.type)}`}
                                                    >
                                                        {message.type === 'system'
                                                            ? '系统'
                                                            : message.type === 'personal'
                                                              ? '私信'
                                                              : '公告'}
                                                    </span>
                                                    {!message.isRead && (
                                                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                                    )}
                                                </div>
                                                <h3 className="font-medium text-gray-800 truncate mb-1">
                                                    {message.title}
                                                </h3>
                                                <p className="text-sm text-gray-600 truncate">
                                                    {message.content}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {message.date}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center">
                                    <div className="text-gray-400 text-4xl mb-2">📭</div>
                                    <p className="text-gray-500">暂无消息</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Content */}
                <div className="flex-1 flex flex-col">
                    {selectedMessage ? (
                        <>
                            {/* Message Header */}
                            <div className="p-6 border-b">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="text-2xl">
                                            {getFromIcon(selectedMessage.fromType)}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-800">
                                                {selectedMessage.title}
                                            </h3>
                                            <p className="text-gray-600">
                                                来自: {selectedMessage.from} •{' '}
                                                {selectedMessage.date}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => deleteMessage(selectedMessage.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        🗑️ 删除
                                    </button>
                                </div>
                                <span
                                    className={`inline-block px-3 py-1 rounded-full text-sm ${getTypeColor(selectedMessage.type)}`}
                                >
                                    {selectedMessage.type === 'system'
                                        ? '系统消息'
                                        : selectedMessage.type === 'personal'
                                          ? '私人消息'
                                          : '平台公告'}
                                </span>
                            </div>

                            {/* Message Content */}
                            <div className="flex-1 p-6 overflow-y-auto">
                                <div className="prose max-w-none">
                                    <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                                        {selectedMessage.content}
                                    </p>
                                </div>
                            </div>

                            {/* Reply Section */}
                            {selectedMessage.fromType === 'user' && (
                                <div className="border-t p-6">
                                    <h4 className="font-semibold text-gray-800 mb-3">回复消息</h4>
                                    <div className="space-y-3">
                                        <textarea
                                            rows={3}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="输入回复内容..."
                                        />

                                        <div className="flex justify-end">
                                            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                                                发送回复
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <div className="text-gray-400 text-6xl mb-4">💬</div>
                                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                    选择一条消息查看
                                </h3>
                                <p className="text-gray-500">
                                    点击左侧消息列表中的任意消息来查看详细内容
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
