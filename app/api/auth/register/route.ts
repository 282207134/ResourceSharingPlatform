import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { userDb } from '@/lib/database';
import { createSession } from '@/lib/auth';

// 验证函数
function validateUsername(username: string): boolean {
    return /^[a-zA-Z0-9_]{3,20}$/.test(username);
}

function validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password: string): boolean {
    return password.length >= 6;
}

export async function POST(request: NextRequest) {
    try {
        const { username, email, password, confirmPassword } = await request.json();

        // 验证输入
        if (!username || !email || !password || !confirmPassword) {
            return NextResponse.json(
                { error: '所有字段都是必填的' },
                { status: 400 }
            );
        }

        if (!validateUsername(username)) {
            return NextResponse.json(
                { error: '用户名格式不正确（3-20字符，只允许字母、数字、下划线）' },
                { status: 400 }
            );
        }

        if (!validateEmail(email)) {
            return NextResponse.json(
                { error: '邮箱格式不正确' },
                { status: 400 }
            );
        }

        if (!validatePassword(password)) {
            return NextResponse.json(
                { error: '密码至少需要6位字符' },
                { status: 400 }
            );
        }

        if (password !== confirmPassword) {
            return NextResponse.json(
                { error: '两次输入的密码不一致' },
                { status: 400 }
            );
        }

        // 检查用户名和邮箱是否已存在
        const existingUserByUsername = await userDb.findByUsername(username);
        if (existingUserByUsername) {
            return NextResponse.json(
                { error: '用户名已存在' },
                { status: 409 }
            );
        }

        const existingUserByEmail = await userDb.findByEmail(email);
        if (existingUserByEmail) {
            return NextResponse.json(
                { error: '邮箱已被注册' },
                { status: 409 }
            );
        }

        // 加密密码 - 已在createUser中处理

        // 创建用户
        const newUser = await userDb.createUser(username, email, password);
        
        // 创建会话
        await createSession(newUser);

        return NextResponse.json({
            message: '注册成功',
            userInfo: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                points: newUser.points
            }
        });

    } catch (error: any) {
        console.error('注册失败:', error);
        return NextResponse.json(
            { error: error.message || '注册失败，请稍后重试' },
            { status: 500 }
        );
    }
}