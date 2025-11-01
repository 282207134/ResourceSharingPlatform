import { NextRequest, NextResponse } from 'next/server';
import { postDb } from '@/lib/database-supabase';
import { getCurrentUser } from '@/lib/auth-supabase';

// 获取帖子列表
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const category_id = searchParams.get('category_id') ? parseInt(searchParams.get('category_id')!) : undefined;
        const author_id = searchParams.get('author_id') || undefined;
        const search = searchParams.get('search') || undefined;
        const sort = (searchParams.get('sort') as 'latest' | 'popular' | 'views') || 'latest';

        const posts = (await postDb.getList({
            page,
            limit,
            category_id,
            author_id,
            search,
            sort
        })) || [];

        return NextResponse.json({
            success: true,
            data: posts,
            pagination: {
                page,
                limit,
                hasMore: posts.length === limit
            }
        });

    } catch (error: any) {
        console.error('获取帖子列表失败:', error);
        return NextResponse.json(
            { error: '获取帖子列表失败' },
            { status: 500 }
        );
    }
}

// 创建新帖子
export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json(
                { error: '请先登录' },
                { status: 401 }
            );
        }

        const { title, content, category_id, points_required, is_premium, tags } = await request.json();

        // 验证输入
        if (!title || !content) {
            return NextResponse.json(
                { error: '标题和内容都是必填的' },
                { status: 400 }
            );
        }

        if (title.length > 255) {
            return NextResponse.json(
                { error: '标题长度不能超过255个字符' },
                { status: 400 }
            );
        }

        // 创建帖子
        const newPost = await postDb.create({
            title,
            content,
            author_id: user.id,
            category_id: category_id || undefined,
            points_required: points_required || 0,
            is_premium: is_premium || false,
            tags: tags || []
        });

        return NextResponse.json({
            success: true,
            message: '帖子发布成功',
            data: newPost
        });

    } catch (error: any) {
        console.error('创建帖子失败:', error);
        return NextResponse.json(
            { error: '创建帖子失败' },
            { status: 500 }
        );
    }
}