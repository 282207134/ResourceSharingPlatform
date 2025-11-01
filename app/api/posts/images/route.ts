
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json(
                { error: '请先登录' },
                { status: 401 }
            );
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;
        const postId = formData.get('post_id') as string;

        if (!file || !postId) {
            return NextResponse.json(
                { error: '缺少必要参数' },
                { status: 400 }
            );
        }

        // 在实际应用中，这里应该将文件上传到云存储（如AWS S3）
        // 这里我们只是创建一个记录在数据库中
        const db = getDb();

        // 创建图片记录
        db.run(
            'INSERT INTO post_images (post_id, image_url, alt_text, sort_order) VALUES (?, ?, ?, ?)',
            [postId, `/uploads/${Date.now()}-${file.name}`, file.name, 0],
            function(err) {
                if (err) {
                    console.error('保存图片失败:', err);
                }
            }
        );

        return NextResponse.json({
            success: true,
            message: '图片上传成功',
            data: {
                id: this.lastID,
                filename: file.name,
                size: file.size,
                type: file.type,
                url: `/uploads/${Date.now()}-${file.name}`
            }
        });

    } catch (error: any) {
        console.error('图片上传失败:', error);
        return NextResponse.json(
            { error: '图片上传失败' },
            { status: 500 }
        );
    }
}
