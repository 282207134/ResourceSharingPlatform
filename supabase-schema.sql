-- Supabase 数据库表结构设计
-- 知识付费平台完整数据库架构

-- 注意：Supabase Auth 已经提供了 users 表，我们在 public schema 创建扩展用户信息表
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    points INTEGER DEFAULT 0,
    avatar_url VARCHAR(500),
    bio TEXT,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    is_verified BOOLEAN DEFAULT FALSE,
    is_premium BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 分类表
CREATE TABLE IF NOT EXISTS public.categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    color VARCHAR(20),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 帖子表
CREATE TABLE IF NOT EXISTS public.posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES public.categories(id) ON DELETE SET NULL,
    points_required INTEGER DEFAULT 0,
    is_premium BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,
    views_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 帖子内容图片表
CREATE TABLE IF NOT EXISTS public.post_images (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 资源表
CREATE TABLE IF NOT EXISTS public.resources (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_url VARCHAR(500) NOT NULL,
    file_type VARCHAR(50),
    file_size BIGINT,
    thumbnail_url VARCHAR(500),
    author_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES public.categories(id) ON DELETE SET NULL,
    points_required INTEGER DEFAULT 0,
    is_premium BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,
    views_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    downloads_count INTEGER DEFAULT 0,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 评论表
CREATE TABLE IF NOT EXISTS public.comments (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    author_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    post_id INTEGER REFERENCES public.posts(id) ON DELETE CASCADE,
    resource_id INTEGER REFERENCES public.resources(id) ON DELETE CASCADE,
    parent_id INTEGER REFERENCES public.comments(id) ON DELETE CASCADE,
    is_published BOOLEAN DEFAULT TRUE,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT comment_target_check CHECK (
        (post_id IS NOT NULL AND resource_id IS NULL) OR 
        (post_id IS NULL AND resource_id IS NOT NULL)
    )
);

-- 点赞表
CREATE TABLE IF NOT EXISTS public.likes (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    post_id INTEGER REFERENCES public.posts(id) ON DELETE CASCADE,
    resource_id INTEGER REFERENCES public.resources(id) ON DELETE CASCADE,
    comment_id INTEGER REFERENCES public.comments(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT like_target_check CHECK (
        (post_id IS NOT NULL AND resource_id IS NULL AND comment_id IS NULL) OR
        (post_id IS NULL AND resource_id IS NOT NULL AND comment_id IS NULL) OR
        (post_id IS NULL AND resource_id IS NULL AND comment_id IS NOT NULL)
    ),
    UNIQUE(user_id, post_id),
    UNIQUE(user_id, resource_id),
    UNIQUE(user_id, comment_id)
);

-- 购买记录表
CREATE TABLE IF NOT EXISTS public.purchases (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    post_id INTEGER REFERENCES public.posts(id) ON DELETE CASCADE,
    resource_id INTEGER REFERENCES public.resources(id) ON DELETE CASCADE,
    points_spent INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT purchase_target_check CHECK (
        (post_id IS NOT NULL AND resource_id IS NULL) OR 
        (post_id IS NULL AND resource_id IS NOT NULL)
    ),
    UNIQUE(user_id, post_id),
    UNIQUE(user_id, resource_id)
);

-- 积分历史表
CREATE TABLE IF NOT EXISTS public.points_history (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    points_change INTEGER NOT NULL,
    balance_after INTEGER NOT NULL,
    description VARCHAR(255) NOT NULL,
    transaction_type VARCHAR(50) NOT NULL,
    reference_id INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 充值记录表
CREATE TABLE IF NOT EXISTS public.recharge_records (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    points_received INTEGER NOT NULL,
    payment_method VARCHAR(50),
    payment_status VARCHAR(20) DEFAULT 'pending',
    transaction_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 消息表
CREATE TABLE IF NOT EXISTS public.messages (
    id SERIAL PRIMARY KEY,
    sender_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    recipient_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title VARCHAR(255),
    content TEXT NOT NULL,
    message_type VARCHAR(50) DEFAULT 'user',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 关注表
CREATE TABLE IF NOT EXISTS public.follows (
    id SERIAL PRIMARY KEY,
    follower_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(follower_id, following_id),
    CONSTRAINT no_self_follow CHECK (follower_id != following_id)
);

-- 收藏表
CREATE TABLE IF NOT EXISTS public.favorites (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    post_id INTEGER REFERENCES public.posts(id) ON DELETE CASCADE,
    resource_id INTEGER REFERENCES public.resources(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT favorite_target_check CHECK (
        (post_id IS NOT NULL AND resource_id IS NULL) OR 
        (post_id IS NULL AND resource_id IS NOT NULL)
    ),
    UNIQUE(user_id, post_id),
    UNIQUE(user_id, resource_id)
);

-- 标签表
CREATE TABLE IF NOT EXISTS public.tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    color VARCHAR(20),
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON public.posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_category_id ON public.posts(category_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_views_count ON public.posts(views_count DESC);
CREATE INDEX IF NOT EXISTS idx_posts_likes_count ON public.posts(likes_count DESC);
CREATE INDEX IF NOT EXISTS idx_posts_tags ON public.posts USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_resources_author_id ON public.resources(author_id);
CREATE INDEX IF NOT EXISTS idx_resources_category_id ON public.resources(category_id);
CREATE INDEX IF NOT EXISTS idx_resources_created_at ON public.resources(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_resources_tags ON public.resources USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_comments_post_id ON public.comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_resource_id ON public.comments(resource_id);
CREATE INDEX IF NOT EXISTS idx_comments_author_id ON public.comments(author_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON public.comments(parent_id);

CREATE INDEX IF NOT EXISTS idx_likes_user_id ON public.likes(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_post_id ON public.likes(post_id);
CREATE INDEX IF NOT EXISTS idx_likes_resource_id ON public.likes(resource_id);

CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON public.purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_points_history_user_id ON public.points_history(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON public.messages(recipient_id);

-- 创建全文搜索索引
CREATE INDEX IF NOT EXISTS idx_posts_search ON public.posts USING GIN(to_tsvector('english', title || ' ' || content));
CREATE INDEX IF NOT EXISTS idx_resources_search ON public.resources USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- 创建触发器函数来更新 updated_at 字段
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为需要的表创建触发器
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_posts_updated_at ON public.posts;
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_resources_updated_at ON public.resources;
CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON public.resources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_comments_updated_at ON public.comments;
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON public.comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_recharge_records_updated_at ON public.recharge_records;
CREATE TRIGGER update_recharge_records_updated_at BEFORE UPDATE ON public.recharge_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 创建 RPC 函数用于增加计数
CREATE OR REPLACE FUNCTION increment_post_views(post_id INTEGER)
RETURNS void AS $$
BEGIN
    UPDATE public.posts SET views_count = views_count + 1 WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_resource_views(resource_id INTEGER)
RETURNS void AS $$
BEGIN
    UPDATE public.resources SET views_count = views_count + 1 WHERE id = resource_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_post_likes(post_id INTEGER)
RETURNS void AS $$
BEGIN
    UPDATE public.posts SET likes_count = likes_count + 1 WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrement_post_likes(post_id INTEGER)
RETURNS void AS $$
BEGIN
    UPDATE public.posts SET likes_count = GREATEST(0, likes_count - 1) WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_resource_likes(resource_id INTEGER)
RETURNS void AS $$
BEGIN
    UPDATE public.resources SET likes_count = likes_count + 1 WHERE id = resource_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrement_resource_likes(resource_id INTEGER)
RETURNS void AS $$
BEGIN
    UPDATE public.resources SET likes_count = GREATEST(0, likes_count - 1) WHERE id = resource_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_comment_likes(comment_id INTEGER)
RETURNS void AS $$
BEGIN
    UPDATE public.comments SET likes_count = likes_count + 1 WHERE id = comment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrement_comment_likes(comment_id INTEGER)
RETURNS void AS $$
BEGIN
    UPDATE public.comments SET likes_count = GREATEST(0, likes_count - 1) WHERE id = comment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 启用 Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.points_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- RLS 策略：用户可以读取所有已发布的内容
CREATE POLICY "Public posts are viewable by everyone" ON public.posts
    FOR SELECT USING (is_published = true);

CREATE POLICY "Public resources are viewable by everyone" ON public.resources
    FOR SELECT USING (is_published = true);

CREATE POLICY "Public comments are viewable by everyone" ON public.comments
    FOR SELECT USING (is_published = true);

CREATE POLICY "Users can view their own data" ON public.users
    FOR SELECT USING (auth.uid() = id);

-- RLS 策略：管理员可以查看所有用户数据
CREATE POLICY "Admins can view all users" ON public.users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- RLS 策略：管理员可以更新任何用户的角色
CREATE POLICY "Admins can update any user" ON public.users
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    ) WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- RLS 策略：用户可以创建自己的内容
CREATE POLICY "Users can insert their own posts" ON public.posts
    FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can insert their own resources" ON public.resources
    FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can insert their own comments" ON public.comments
    FOR INSERT WITH CHECK (auth.uid() = author_id);

-- RLS 策略：用户可以更新自己的内容
CREATE POLICY "Users can update their own posts" ON public.posts
    FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can update their own resources" ON public.resources
    FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- RLS 策略：用户可以删除自己的内容
CREATE POLICY "Users can delete their own posts" ON public.posts
    FOR DELETE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own resources" ON public.resources
    FOR DELETE USING (auth.uid() = author_id);

-- RLS 策略：用户可以管理自己的点赞
CREATE POLICY "Users can manage their own likes" ON public.likes
    FOR ALL USING (auth.uid() = user_id);

-- RLS 策略：用户可以查看自己的购买记录和积分历史
CREATE POLICY "Users can view their own purchases" ON public.purchases
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own points history" ON public.points_history
    FOR SELECT USING (auth.uid() = user_id);

-- RLS 策略：用户可以查看和管理自己的消息
CREATE POLICY "Users can view their own messages" ON public.messages
    FOR SELECT USING (auth.uid() = recipient_id OR auth.uid() = sender_id);

-- RLS 策略：用户可以管理自己的收藏
CREATE POLICY "Users can manage their own favorites" ON public.favorites
    FOR ALL USING (auth.uid() = user_id);

-- 插入默认分类
INSERT INTO public.categories (id, name, description, icon, color, sort_order) 
VALUES 
    (1, 'TK短视频作品', '热门短视频内容，创意灵感分享', '🎬', 'bg-red-500', 1),
    (2, '欧美TK作品', '欧美风格短视频作品集合', '🌍', 'bg-blue-500', 2),
    (3, '演示文档作品专区', '专业演示文档模板和案例', '📊', 'bg-green-500', 3),
    (4, '美足足控区', '足部护理和美容相关内容', '👠', 'bg-pink-500', 4),
    (5, '女优作品专区', '优质女性创作者作品展示', '👩‍🎨', 'bg-purple-500', 5),
    (6, '追足作品', '足部艺术和摄影作品', '📸', 'bg-indigo-500', 6),
    (7, '编辑艺术作品', '视频编辑和后期制作教程', '🎨', 'bg-yellow-500', 7)
ON CONFLICT (id) DO NOTHING;
