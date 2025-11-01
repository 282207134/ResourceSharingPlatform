import { NextRequest, NextResponse } from 'next/server';
import { userDb } from '@/lib/database-supabase';
import { requireAdmin } from '@/lib/auth-supabase';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const role = searchParams.get('role') as 'user' | 'admin' | undefined;

    const users = await userDb.listUsers({ page, limit, role });

    return NextResponse.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        hasMore: users.length === limit,
      },
    });
  } catch (error: any) {
    if (error.message === '未登录') {
      return NextResponse.json({ error: '请先登录' }, { status: 401 });
    }
    if (error.message === '需要管理员权限') {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 });
    }
    console.error('获取用户列表失败:', error);
    return NextResponse.json({ error: '获取用户列表失败' }, { status: 500 });
  }
}
