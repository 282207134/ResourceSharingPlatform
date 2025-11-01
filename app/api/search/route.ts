import { NextRequest, NextResponse } from 'next/server';
import { postDb, resourceDb } from '@/lib/database-supabase';

// 全局搜索
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');
        const type = searchParams.get('type') || 'all'; // 'all', 'posts', 'resources'
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const category_id = searchParams.get('category_id') ? parseInt(searchParams.get('category_id')!) : undefined;
        const sort = (searchParams.get('sort') as 'latest' | 'popular' | 'views') || 'latest';

        if (!query) {
            return NextResponse.json(
                { error: '搜索关键词不能为空' },
                { status: 400 }
            );
        }

        const results: any = {
            posts: [],
            resources: [],
            total: 0
        };

        // 搜索帖子
        if (type === 'all' || type === 'posts') {
            const posts = await postDb.getList({
                page: type === 'posts' ? page : 1,
                limit: type === 'posts' ? limit : 10,
                category_id,
                search: query,
                sort
            });
            results.posts = posts;
        }

        // 搜索资源
        if (type === 'all' || type === 'resources') {
            const resources = await resourceDb.getList({
                page: type === 'resources' ? page : 1,
                limit: type === 'resources' ? limit : 10,
                category_id,
                search: query,
                sort: sort === 'views' ? 'downloads' : sort
            });
            results.resources = resources;
        }

        results.total = results.posts.length + results.resources.length;

        return NextResponse.json({
            success: true,
            data: results,
            query,
            type,
            pagination: {
                page,
                limit,
                hasMore: type === 'all' ? false : (
                    type === 'posts' ? results.posts.length === limit : results.resources.length === limit
                )
            }
        });

    } catch (error: any) {
        console.error('搜索失败:', error);
        return NextResponse.json(
            { error: '搜索失败' },
            { status: 500 }
        );
    }
}

// 搜索建议
export async function POST(request: NextRequest) {
    try {
        const { query } = await request.json();

        if (!query || query.length < 2) {
            return NextResponse.json({
                success: true,
                data: []
            });
        }

        // 这里可以实现搜索建议逻辑
        // 例如：热门搜索词、历史搜索、标签建议等
        const suggestions = [
            `${query} 教程`,
            `${query} 资源`,
            `${query} 下载`,
            `${query} 学习`,
            `${query} 指南`
        ].filter(suggestion => suggestion.length <= 50);

        return NextResponse.json({
            success: true,
            data: suggestions
        });

    } catch (error: any) {
        console.error('获取搜索建议失败:', error);
        return NextResponse.json(
            { error: '获取搜索建议失败' },
            { status: 500 }
        );
    }
}