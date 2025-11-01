import { NextRequest, NextResponse } from 'next/server';
import { userDb } from '@/lib/database-supabase';
import { requireAdmin } from '@/lib/auth-supabase';

function extractUserIdFromPath(pathname: string): string | null {
  const segments = pathname.split('/').filter(Boolean);
  const roleIndex = segments.lastIndexOf('role');
  if (roleIndex > 0) {
    return segments[roleIndex - 1] ?? null;
  }
  return null;
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin();

    const userId = extractUserIdFromPath(request.nextUrl.pathname);

    if (!userId) {
      return NextResponse.json({ error: '缺少用户ID' }, { status: 400 });
    }

    const body = await request.json();
    const role = body.role as 'user' | 'admin' | undefined;

    if (!role || !['user', 'admin'].includes(role)) {
      return NextResponse.json({ error: '角色必须是 user 或 admin' }, { status: 400 });
    }

    const updatedUser = await userDb.updateRole(userId, role);

    if (!updatedUser) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        points: updatedUser.points,
        is_verified: updatedUser.is_verified,
        is_premium: updatedUser.is_premium,
      },
    });
  } catch (error: any) {
    if (error.message === '未登录') {
      return NextResponse.json({ error: '请先登录' }, { status: 401 });
    }
    if (error.message === '需要管理员权限') {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 });
    }
    console.error('更新用户角色失败:', error);
    return NextResponse.json({ error: '更新用户角色失败' }, { status: 500 });
  }
}
