import { NextRequest, NextResponse } from 'next/server';
import { categoryDb } from '@/lib/database-pg';

// 获取所有分类
export async function GET(request: NextRequest) {
    try {
        const categories = await categoryDb.getAll();

        return NextResponse.json({
            success: true,
            data: categories
        });

    } catch (error: any) {
        console.error('获取分类列表失败:', error);
        return NextResponse.json(
            { error: '获取分类列表失败' },
            { status: 500 }
        );
    }
}