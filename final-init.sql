-- Final PostgreSQL Database Initialization
-- Set search path and create tables

SET search_path TO public;

-- Users table
CREATE TABLE public.users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    points INTEGER DEFAULT 0,
    avatar_url VARCHAR(500),
    bio TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_premium BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Sessions table
CREATE TABLE public.sessions (
    id VARCHAR(255) PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE public.categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    color VARCHAR(20),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Posts table
CREATE TABLE public.posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_id INTEGER NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
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

-- Points history table
CREATE TABLE public.points_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    points_change INTEGER NOT NULL,
    balance_after INTEGER NOT NULL,
    description VARCHAR(255) NOT NULL,
    transaction_type VARCHAR(50) NOT NULL,
    reference_id INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default categories
INSERT INTO public.categories (name, description, icon, color, sort_order) VALUES
('技术文档', '技术相关的文档和教程', 'code', '#3B82F6', 1),
('视频教程', '视频学习资源', 'video', '#EF4444', 2),
('工具软件', '实用工具和软件', 'tool', '#10B981', 3),
('设计资源', '设计相关的资源', 'palette', '#F59E0B', 4),
('其他资源', '其他类型的资源', 'folder', '#6B7280', 5);

SELECT 'Database tables created successfully!' as status;