'use client';

import { useState } from 'react';

interface AutoRechargeProps {
    userPoints: number;
    onRecharge: (amount: number, points: number) => void;
}

export default function AutoRecharge({ userPoints, onRecharge }: AutoRechargeProps) {
    const [rechargeMethod, setRechargeMethod] = useState('manual');
    const [customAmount, setCustomAmount] = useState('');
    const [autoSettings, setAutoSettings] = useState({
        enabled: false,
        threshold: 100,
        rechargeAmount: 50,
    });

    const quickAmounts = [10, 20, 50, 100, 200, 500];

    const handleQuickRecharge = (amount: number) => {
        const points = amount * 10; // 1元 = 10积分
        onRecharge(amount, points);
        alert(`充值成功！获得 ${points} 积分`);
    };

    const handleCustomRecharge = () => {
        const amount = parseFloat(customAmount);
        if (amount > 0) {
            const points = Math.floor(amount * 10);
            onRecharge(amount, points);
            alert(`充值成功！获得 ${points} 积分`);
            setCustomAmount('');
        }
    };

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">自助充值</h2>
                <p className="text-gray-600">快速便捷的充值方式，支持自定义金额</p>
                <div className="mt-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <span className="text-green-800 font-semibold">当前积分余额</span>
                        <span className="text-2xl font-bold text-green-600">{userPoints}</span>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {/* Recharge Method Selection */}
                <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">充值方式</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div
                            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                                rechargeMethod === 'manual'
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => setRechargeMethod('manual')}
                        >
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xl">
                                    💳
                                </div>
                                <div>
                                    <h4 className="font-semibold">手动充值</h4>
                                    <p className="text-sm text-gray-600">自由选择充值金额</p>
                                </div>
                            </div>
                        </div>

                        <div
                            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                                rechargeMethod === 'auto'
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => setRechargeMethod('auto')}
                        >
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white text-xl">
                                    🔄
                                </div>
                                <div>
                                    <h4 className="font-semibold">自动充值</h4>
                                    <p className="text-sm text-gray-600">积分不足时自动充值</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {rechargeMethod === 'manual' && (
                    <div>
                        {/* Quick Recharge */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-4">快速充值</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                {quickAmounts.map((amount) => (
                                    <button
                                        key={amount}
                                        onClick={() => handleQuickRecharge(amount)}
                                        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg p-4 hover:from-blue-600 hover:to-purple-600 transition-all"
                                    >
                                        <div className="text-lg font-bold">¥{amount}</div>
                                        <div className="text-sm opacity-90">{amount * 10} 积分</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Custom Amount */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-4">自定义金额</h3>
                            <div className="flex items-center space-x-4">
                                <div className="flex-1">
                                    <input
                                        type="number"
                                        value={customAmount}
                                        onChange={(e) => setCustomAmount(e.target.value)}
                                        placeholder="请输入充值金额"
                                        min="1"
                                        step="0.01"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <button
                                    onClick={handleCustomRecharge}
                                    disabled={!customAmount || parseFloat(customAmount) <= 0}
                                    className={`px-6 py-3 rounded-lg font-semibold ${
                                        customAmount && parseFloat(customAmount) > 0
                                            ? 'bg-blue-500 text-white hover:bg-blue-600'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                                >
                                    立即充值
                                </button>
                            </div>
                            {customAmount && parseFloat(customAmount) > 0 && (
                                <p className="text-sm text-gray-600 mt-2">
                                    将获得 {Math.floor(parseFloat(customAmount) * 10)} 积分
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {rechargeMethod === 'auto' && (
                    <div>
                        <h3 className="text-lg font-semibold mb-4">自动充值设置</h3>

                        <div className="bg-gray-50 rounded-lg p-6 mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <span className="font-medium">启用自动充值</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={autoSettings.enabled}
                                        onChange={(e) =>
                                            setAutoSettings({
                                                ...autoSettings,
                                                enabled: e.target.checked,
                                            })
                                        }
                                        className="sr-only peer"
                                    />

                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            {autoSettings.enabled && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            触发阈值（积分低于此值时自动充值）
                                        </label>
                                        <input
                                            type="number"
                                            value={autoSettings.threshold}
                                            onChange={(e) =>
                                                setAutoSettings({
                                                    ...autoSettings,
                                                    threshold: parseInt(e.target.value),
                                                })
                                            }
                                            min="10"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            自动充值金额（元）
                                        </label>
                                        <select
                                            value={autoSettings.rechargeAmount}
                                            onChange={(e) =>
                                                setAutoSettings({
                                                    ...autoSettings,
                                                    rechargeAmount: parseInt(e.target.value),
                                                })
                                            }
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value={10}>¥10 (100积分)</option>
                                            <option value={20}>¥20 (200积分)</option>
                                            <option value={50}>¥50 (500积分)</option>
                                            <option value={100}>¥100 (1000积分)</option>
                                        </select>
                                    </div>
                                </div>
                            )}
                        </div>

                        {autoSettings.enabled && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h4 className="font-semibold text-blue-800 mb-2">自动充值规则</h4>
                                <p className="text-blue-700 text-sm">
                                    当您的积分余额低于 {autoSettings.threshold}{' '}
                                    时，系统将自动为您充值 ¥{autoSettings.rechargeAmount}， 获得{' '}
                                    {autoSettings.rechargeAmount * 10} 积分。
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Recharge History */}
                <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">充值记录</h3>
                    <div className="bg-gray-50 rounded-lg p-6">
                        <div className="text-center text-gray-500">
                            <div className="text-4xl mb-2">📋</div>
                            <p>暂无充值记录</p>
                        </div>
                    </div>
                </div>

                {/* Notice */}
                <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">充值说明</h4>
                    <ul className="text-yellow-700 text-sm space-y-1">
                        <li>• 充值比例：1元 = 10积分</li>
                        <li>• 充值后积分立即到账</li>
                        <li>• 自动充值需要绑定支付方式</li>
                        <li>• 可随时关闭自动充值功能</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
