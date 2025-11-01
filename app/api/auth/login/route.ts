import { NextRequest, NextResponse } from 'next/server';
import { userDb } from '@/lib/database-supabase';
import { signIn } from '@/lib/auth-supabase';

export async function POST(request: NextRequest) {
    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json(
                { error: '用户名和密码都是必填的' },
                { status: 400 }
            );
        }

        const userRecord = await userDb.findByEmail(username) || await userDb.findByUsername(username);

        if (!userRecord) {
            return NextResponse.json(
                { error: '用户名或密码错误' },
                { status: 401 }
            );
        }

        const user = await signIn(userRecord.email, password);

        return NextResponse.json({
            message: '登录成功',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                points: user.points
            }
        });

    } catch (error: any) {
        console.error('登录失败:', error);
        return NextResponse.json(
            { error: error.message || '登录失败，请稍后重试' },
            { status: 500 }
        );
    }
}