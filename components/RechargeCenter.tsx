'use client';

import { useState } from 'react';

interface RechargeCenterProps {
    userPoints: number;
    onRecharge: (amount: number, points: number) => void;
}

type RechargePackage = {
    id: number;
    amount: number;
    points: number;
    bonus: number;
    isPopular: boolean;
};

export default function RechargeCenter({ userPoints, onRecharge }: RechargeCenterProps) {
    const [selectedPackage, setSelectedPackage] = useState<RechargePackage | null>(null);

    const rechargePackages: RechargePackage[] = [
        { id: 1, amount: 10, points: 100, bonus: 0, isPopular: false },
        { id: 2, amount: 20, points: 240, bonus: 40, isPopular: false },
        { id: 3, amount: 50, points: 700, bonus: 200, isPopular: true },
        { id: 4, amount: 100, points: 1600, bonus: 600, isPopular: false },
        { id: 5, amount: 200, points: 4150, bonus: 1550, isPopular: false },
        { id: 6, amount: 500, points: 12000, bonus: 6500, isPopular: false },
    ];

    const paymentMethods = [
        { id: 'alipay', name: '支付宝', icon: '💰', color: 'bg-blue-500' },
        { id: 'wechat', name: '微信支付', icon: '💚', color: 'bg-green-500' },
        { id: 'qq', name: 'QQ钱包', icon: '🐧', color: 'bg-blue-600' },
    ];

    const [selectedPayment, setSelectedPayment] = useState('alipay');

    const handleRecharge = () => {
        if (selectedPackage) {
            onRecharge(selectedPackage.amount, selectedPackage.points);
            alert(`充值成功！获得 ${selectedPackage.points} 积分`);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">充值中心</h2>
                <p className="text-gray-600">选择充值套餐，获得更多积分</p>
                <div className="mt-4 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <span className="text-orange-800 font-semibold">当前积分余额</span>
                        <span className="text-2xl font-bold text-orange-600">{userPoints}</span>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {/* Recharge Packages */}
                <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">充值套餐</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {rechargePackages.map((pkg) => (
                            <div
                                key={pkg.id}
                                className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all ${
                                    selectedPackage?.id === pkg.id
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                } ${pkg.isPopular ? 'ring-2 ring-orange-400' : ''}`}
                                onClick={() => setSelectedPackage(pkg)}
                            >
                                {pkg.isPopular && (
                                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                        <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm">
                                            热门推荐
                                        </span>
                                    </div>
                                )}

                                <div className="text-center">
                                    <div className="text-3xl font-bold text-gray-800 mb-2">
                                        ¥{pkg.amount}
                                    </div>
                                    <div className="text-lg text-blue-600 mb-2">
                                        {pkg.points} 积分
                                    </div>
                                    {pkg.bonus > 0 && (
                                        <div className="text-sm text-green-600">
                                            额外赠送 {pkg.bonus} 积分
                                        </div>
                                    )}
                                    <div className="text-xs text-gray-500 mt-2">
                                        比例: 1元 = {pkg.points / pkg.amount} 积分
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">支付方式</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {paymentMethods.map((method) => (
                            <div
                                key={method.id}
                                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                                    selectedPayment === method.id
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                                onClick={() => setSelectedPayment(method.id)}
                            >
                                <div className="flex items-center space-x-3">
                                    <div
                                        className={`w-12 h-12 ${method.color} rounded-lg flex items-center justify-center text-white text-xl`}
                                    >
                                        {method.icon}
                                    </div>
                                    <span className="font-medium">{method.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Order Summary */}
                {selectedPackage && (
                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                        <h3 className="text-lg font-semibold mb-4">订单详情</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>充值金额:</span>
                                <span className="font-semibold">¥{selectedPackage.amount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>获得积分:</span>
                                <span className="font-semibold text-blue-600">
                                    {selectedPackage.points}
                                </span>
                            </div>
                            {selectedPackage.bonus > 0 && (
                                <div className="flex justify-between">
                                    <span>赠送积分:</span>
                                    <span className="font-semibold text-green-600">
                                        +{selectedPackage.bonus}
                                    </span>
                                </div>
                            )}
                            <div className="border-t pt-2 flex justify-between text-lg font-bold">
                                <span>总计积分:</span>
                                <span className="text-orange-600">{selectedPackage.points}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Button */}
                <div className="text-center">
                    <button
                        onClick={handleRecharge}
                        disabled={!selectedPackage}
                        className={`px-8 py-3 rounded-lg font-semibold text-lg ${
                            selectedPackage
                                ? 'bg-blue-500 text-white hover:bg-blue-600'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        {selectedPackage ? `立即充值 ¥${selectedPackage.amount}` : '请选择充值套餐'}
                    </button>
                </div>

                {/* Notice */}
                <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">充值说明</h4>
                    <ul className="text-yellow-700 text-sm space-y-1">
                        <li>• 充值后积分立即到账，可用于解锁付费内容</li>
                        <li>• 积分永久有效，不会过期</li>
                        <li>• 如有充值问题，请联系客服处理</li>
                        <li>• 充值前请确认账户信息正确</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
