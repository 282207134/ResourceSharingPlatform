import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { userDb } from '@/lib/database';
import { createSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const { username, password } = await request.json();

        // 验证输入
        if (!username || !password) {
            return NextResponse.json(
                { error: '用户名和密码都是必填的' },
                { status: 400 }
            );
        }

        // 查找用户（支持用户名或邮箱登录）
        let user = await userDb.findByUsername(username);
        if (!user) {
            user = await userDb.findByEmail(username);
        }

        if (!user) {
            return NextResponse.json(
                { error: '用户名或密码错误' },
                { status: 401 }
            );
        }

        // 验证密码
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json(
                { error: '用户名或密码错误' },
                { status: 401 }
            );
        }

        // 创建会话
        const userInfo = {
            id: user.id,
            username: user.username,
            email: user.email,
            points: user.points
        };
        
        await createSession(userInfo);

        return NextResponse.json({
            message: '登录成功',
            userInfo
        });

    } catch (error: any) {
        console.error('登录失败:', error);
        return NextResponse.json(
            { error: '登录失败，请稍后重试' },
            { status: 500 }
        );
    }
}