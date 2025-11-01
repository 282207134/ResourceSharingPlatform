import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { userDb, sessionDb } from './database-pg';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const SESSION_COOKIE_NAME = 'session';

export interface User {
    id: number;
    username: string;
    email: string;
    points: number;
    avatar_url?: string;
    is_verified?: boolean;
    is_premium?: boolean;
}

// 生成JWT token
export function generateToken(user: User): string {
    return jwt.sign(
        { 
            userId: user.id, 
            username: user.username,
            email: user.email 
        },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
}

// 验证JWT token
export function verifyToken(token: string): any {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
}

// 生成会话ID
export function generateSessionId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// 创建会话
export async function createSession(user: User): Promise<string> {
    const sessionId = generateSessionId();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7天后过期
    
    sessionDb.createSession(sessionId, user.id, expiresAt);
    
    // 设置cookie
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: expiresAt,
        path: '/'
    });
    
    return sessionId;
}

// 获取当前用户
export async function getCurrentUser(): Promise<User | null> {
    try {
        const cookieStore = await cookies();
        const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;
        
        if (!sessionId) {
            return null;
        }
        
        const session = await sessionDb.findSession(sessionId);
        if (!session) {
            return null;
        }
        
        return {
            id: session.user_id,
            username: session.username,
            email: session.email,
            points: session.points
        };
    } catch (error) {
        console.error('获取当前用户失败:', error);
        return null;
    }
}

// 登出
export async function logout(): Promise<void> {
    try {
        const cookieStore = await cookies();
        const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;
        
        if (sessionId) {
            sessionDb.deleteSession(sessionId);
        }
        
        // 清除cookie
        cookieStore.delete(SESSION_COOKIE_NAME);
    } catch (error) {
        console.error('登出失败:', error);
    }
}

// 验证用户输入
export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function validateUsername(username: string): boolean {
    // 用户名长度3-20字符，只允许字母、数字、下划线
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
}

export function validatePassword(password: string): boolean {
    // 密码至少6位
    return password.length >= 6;
}

// 中间件：检查用户是否已登录
export async function requireAuth(): Promise<User> {
    const user = await getCurrentUser();
    if (!user) {
        throw new Error('未登录');
    }
    return user;
}