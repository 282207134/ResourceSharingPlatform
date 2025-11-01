import { NextRequest, NextResponse } from 'next/server';
import { postDb } from '@/lib/database-pg';
import { getCurrentUser } from '@/lib/auth';

// 获取帖子详情
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const postId = parseInt(params.id);
        if (isNaN(postId)) {
            return NextResponse.json(
                { error: '无效的帖子ID' },
                { status: 400 }
            );
        }

        const user = await getCurrentUser();
        const post = await postDb.getById(postId, user?.id);

        if (!post) {
            return NextResponse.json(
                { error: '帖子不存在' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: post
        });

    } catch (error: any) {
        console.error('获取帖子详情失败:', error);
        return NextResponse.json(
            { error: '获取帖子详情失败' },
            { status: 500 }
        );
    }
}

// 更新帖子
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json(
                { error: '请先登录' },
                { status: 401 }
            );
        }

        const postId = parseInt(params.id);
        if (isNaN(postId)) {
            return NextResponse.json(
                { error: '无效的帖子ID' },
                { status: 400 }
            );
        }

        // 检查帖子是否存在且用户是否有权限编辑
        const existingPost = await postDb.getById(postId);
        if (!existingPost) {
            return NextResponse.json(
                { error: '帖子不存在' },
                { status: 404 }
            );
        }

        if (existingPost.author_id !== user.id) {
            return NextResponse.json(
                { error: '您没有权限编辑此帖子' },
                { status: 403 }
            );
        }

        const { title, content, category_id, points_required, is_premium, tags } = await request.json();

        // 验证输入
        if (title && title.length > 255) {
            return NextResponse.json(
                { error: '标题长度不能超过255个字符' },
                { status: 400 }
            );
        }

        // 更新帖子
        const updateData: any = {};
        if (title !== undefined) updateData.title = title;
        if (content !== undefined) updateData.content = content;
        if (category_id !== undefined) updateData.category_id = category_id;
        if (points_required !== undefined) updateData.points_required = points_required;
        if (is_premium !== undefined) updateData.is_premium = is_premium;
        if (tags !== undefined) updateData.tags = tags;

        const updatedPost = await postDb.update(postId, updateData);

        return NextResponse.json({
            success: true,
            message: '帖子更新成功',
            data: updatedPost
        });

    } catch (error: any) {
        console.error('更新帖子失败:', error);
        return NextResponse.json(
            { error: '更新帖子失败' },
            { status: 500 }
        );
    }
}

// 删除帖子
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json(
                { error: '请先登录' },
                { status: 401 }
            );
        }

        const postId = parseInt(params.id);
        if (isNaN(postId)) {
            return NextResponse.json(
                { error: '无效的帖子ID' },
                { status: 400 }
            );
        }

        // 检查帖子是否存在且用户是否有权限删除
        const existingPost = await postDb.getById(postId);
        if (!existingPost) {
            return NextResponse.json(
                { error: '帖子不存在' },
                { status: 404 }
            );
        }

        if (existingPost.author_id !== user.id) {
            return NextResponse.json(
                { error: '您没有权限删除此帖子' },
                { status: 403 }
            );
        }

        await postDb.delete(postId);

        return NextResponse.json({
            success: true,
            message: '帖子删除成功'
        });

    } catch (error: any) {
        console.error('删除帖子失败:', error);
        return NextResponse.json(
            { error: '删除帖子失败' },
            { status: 500 }
        );
    }
}