import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        
        if (!user) {
            return NextResponse.json(
                { error: '未登录' },
                { status: 401 }
            );
        }

        return NextResponse.json({
            user: user
        });

    } catch (error: any) {
        console.error('获取用户信息失败:', error);
        return NextResponse.json(
            { error: '获取用户信息失败' },
            { status: 500 }
        );
    }
}