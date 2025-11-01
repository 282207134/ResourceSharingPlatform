
import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth-supabase';

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

        const supabase = await createSupabaseServerClient();
        const fileName = `${Date.now()}-${file.name}`;
        const filePath = `posts/${postId}/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('posts')
            .upload(filePath, file);

        if (uploadError) {
            throw uploadError;
        }

        const { data: urlData } = supabase.storage
            .from('posts')
            .getPublicUrl(filePath);

        const { data: imageRecord, error: dbError } = await supabase
            .from('post_images')
            .insert({
                post_id: parseInt(postId),
                image_url: urlData.publicUrl,
                alt_text: file.name,
                sort_order: 0
            })
            .select()
            .single();

        if (dbError) {
            throw dbError;
        }

        return NextResponse.json({
            success: true,
            message: '图片上传成功',
            data: {
                id: imageRecord.id,
                filename: file.name,
                size: file.size,
                type: file.type,
                url: urlData.publicUrl
            }
        });

    } catch (error: any) {
        console.error('图片上传失败:', error);
        return NextResponse.json(
            { error: error.message || '图片上传失败' },
            { status: 500 }
        );
    }
}
