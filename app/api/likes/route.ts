import { NextRequest, NextResponse } from 'next/server';
import { likeDb } from '@/lib/database-supabase';
import { getCurrentUser } from '@/lib/auth-supabase';

// 切换点赞状态
export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json(
                { error: '请先登录' },
                { status: 401 }
            );
        }

        const { targetType, targetId } = await request.json();

        // 验证输入
        if (!targetType || !targetId) {
            return NextResponse.json(
                { error: '缺少必要参数' },
                { status: 400 }
            );
        }

        if (!['post', 'resource', 'comment'].includes(targetType)) {
            return NextResponse.json(
                { error: '无效的目标类型' },
                { status: 400 }
            );
        }

        const result = await likeDb.toggle(user.id, targetType, parseInt(targetId));

        return NextResponse.json({
            success: true,
            data: result,
            message: result.liked ? '点赞成功' : '取消点赞成功'
        });

    } catch (error: any) {
        console.error('点赞操作失败:', error);
        return NextResponse.json(
            { error: '点赞操作失败' },
            { status: 500 }
        );
    }
}