'use client';

import { useState } from 'react';

interface PointsRecord {
    id: number;
    type: 'recharge' | 'consume' | 'earn';
    amount: number;
    description: string;
    date: string;
    balance: number;
    details?: string;
}

interface PointsHistoryProps {
    onClose: () => void;
    userPoints: number;
}

export default function PointsHistory({ onClose, userPoints }: PointsHistoryProps) {
    const [activeFilter, setActiveFilter] = useState('all');

    // 模拟积分记录数据
    const [pointsRecords] = useState<PointsRecord[]>([
        {
            id: 1,
            type: 'recharge',
            amount: 500,
            description: '充值获得积分',
            date: '2024-01-15 14:30:00',
            balance: 1650,
            details: '支付宝充值 ¥50.00',
        },
        {
            id: 2,
            type: 'consume',
            amount: -50,
            description: '解锁内容',
            date: '2024-01-15 10:20:00',
            balance: 1150,
            details: '解锁《亚洲人TK作品》',
        },
        {
            id: 3,
            type: 'consume',
            amount: -30,
            description: '解锁内容',
            date: '2024-01-14 16:45:00',
            balance: 1200,
            details: '解锁《创意短视频合集》',
        },
        {
            id: 4,
            type: 'recharge',
            amount: 300,
            description: '充值获得积分',
            date: '2024-01-14 09:15:00',
            balance: 1230,
            details: '微信充值 ¥30.00',
        },
        {
            id: 5,
            type: 'consume',
            amount: -40,
            description: '解锁内容',
            date: '2024-01-13 20:30:00',
            balance: 930,
            details: '解锁《热门舞蹈视频》',
        },
        {
            id: 6,
            type: 'recharge',
            amount: 1000,
            description: '充值获得积分',
            date: '2024-01-13 15:20:00',
            balance: 970,
            details: '银行卡充值 ¥100.00',
        },
        {
            id: 7,
            type: 'consume',
            amount: -60,
            description: '解锁内容',
            date: '2024-01-12 11:10:00',
            balance: -30,
            details: '解锁《欧美风格作品》',
        },
    ]);

    const filteredRecords = pointsRecords.filter((record) => {
        if (activeFilter === 'all') return true;
        return record.type === activeFilter;
    });

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'recharge':
                return '💰';
            case 'consume':
                return '📖';
            case 'earn':
                return '🎁';
            default:
                return '📝';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'recharge':
                return 'text-green-600';
            case 'consume':
                return 'text-red-600';
            case 'earn':
                return 'text-blue-600';
            default:
                return 'text-gray-600';
        }
    };

    const getTypeName = (type: string) => {
        switch (type) {
            case 'recharge':
                return '充值';
            case 'consume':
                return '消费';
            case 'earn':
                return '获得';
            default:
                return '其他';
        }
    };

    const totalRecharge = pointsRecords
        .filter((r) => r.type === 'recharge')
        .reduce((sum, r) => sum + r.amount, 0);

    const totalConsume = pointsRecords
        .filter((r) => r.type === 'consume')
        .reduce((sum, r) => sum + Math.abs(r.amount), 0);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-gray-800">积分记录</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 text-2xl"
                        >
                            ×
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-blue-50 rounded-lg p-4">
                            <div className="text-blue-600 text-sm font-medium">当前余额</div>
                            <div className="text-2xl font-bold text-blue-800">{userPoints}</div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4">
                            <div className="text-green-600 text-sm font-medium">累计充值</div>
                            <div className="text-2xl font-bold text-green-800">{totalRecharge}</div>
                        </div>
                        <div className="bg-red-50 rounded-lg p-4">
                            <div className="text-red-600 text-sm font-medium">累计消费</div>
                            <div className="text-2xl font-bold text-red-800">{totalConsume}</div>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-4">
                            <div className="text-purple-600 text-sm font-medium">记录总数</div>
                            <div className="text-2xl font-bold text-purple-800">
                                {pointsRecords.length}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="px-6 py-4 border-b">
                    <div className="flex space-x-4">
                        {[
                            { key: 'all', label: '全部记录' },
                            { key: 'recharge', label: '充值记录' },
                            { key: 'consume', label: '消费记录' },
                            { key: 'earn', label: '获得记录' },
                        ].map((filter) => (
                            <button
                                key={filter.key}
                                onClick={() => setActiveFilter(filter.key)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    activeFilter === filter.key
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Records List */}
                <div className="flex-1 overflow-y-auto">
                    {filteredRecords.length > 0 ? (
                        <div className="divide-y">
                            {filteredRecords.map((record) => (
                                <div
                                    key={record.id}
                                    className="p-6 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="text-2xl">
                                                {getTypeIcon(record.type)}
                                            </div>
                                            <div>
                                                <div className="flex items-center space-x-2">
                                                    <h3 className="font-medium text-gray-800">
                                                        {record.description}
                                                    </h3>
                                                    <span
                                                        className={`text-xs px-2 py-1 rounded-full ${
                                                            record.type === 'recharge'
                                                                ? 'bg-green-100 text-green-800'
                                                                : record.type === 'consume'
                                                                  ? 'bg-red-100 text-red-800'
                                                                  : 'bg-blue-100 text-blue-800'
                                                        }`}
                                                    >
                                                        {getTypeName(record.type)}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600">
                                                    {record.details}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {record.date}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div
                                                className={`text-lg font-bold ${getTypeColor(record.type)}`}
                                            >
                                                {record.amount > 0 ? '+' : ''}
                                                {record.amount}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                余额: {record.balance}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <div className="text-gray-400 text-6xl mb-4">📊</div>
                                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                    暂无记录
                                </h3>
                                <p className="text-gray-500">该类型下暂时没有积分记录</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
