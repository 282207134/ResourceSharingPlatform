import { NextRequest, NextResponse } from 'next/server';
import { logout } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        await logout();
        
        return NextResponse.json({
            message: '登出成功'
        });

    } catch (error: any) {
        console.error('登出失败:', error);
        return NextResponse.json(
            { error: '登出失败，请稍后重试' },
            { status: 500 }
        );
    }
}