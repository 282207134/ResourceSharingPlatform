# Supabase 配置指南

本项目使用 [Supabase](https://supabase.com) 作为后端（PostgreSQL + 认证 + 存储）。

## 快速开始

### 1. 创建 Supabase 项目

1. 访问 [supabase.com](https://supabase.com) 并注册
2. 创建新项目，等待初始化（~2分钟）

### 2. 配置环境变量

创建 `.env.local`：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

在 Supabase 控制台获取：**Settings** → **API**

### 3. 创建数据库

在 Supabase 控制台：**SQL Editor** → 粘贴 `supabase-schema.sql` 全部内容 → **Run**

### 4. 配置存储桶

**Storage** → 创建 3 个 bucket：`avatars`, `posts`, `resources`

### 5. 设置管理员

注册第一个用户后，在 **SQL Editor** 执行：

```sql
-- 查找用户ID
SELECT id, username, email FROM users ORDER BY created_at LIMIT 1;

-- 设为管理员
UPDATE users SET role = 'admin' WHERE id = '刚才查到的ID';
```

### 6. 启动项目

```bash
npm install
npm run dev
```

## 用户角色

系统支持 `user`（普通用户）和 `admin`（管理员）两种角色：

### 设置管理员

通过 SQL Editor：

```sql
UPDATE users SET role = 'admin' WHERE email = 'user@example.com';
```

### 管理员 API

```bash
# 获取用户列表
GET /api/admin/users?page=1&limit=50&role=admin

# 修改用户角色
PATCH /api/admin/users/{userId}/role
Body: {"role": "admin"}
```

### 权限检查

后端：

```typescript
import { requireAdmin, requireAuth, isAdmin } from '@/lib/auth-supabase';

// 需要登录
const user = await requireAuth();

// 需要管理员
const admin = await requireAdmin();

// 判断是否管理员
if (await isAdmin()) {
  // ...
}
```

前端：

```tsx
const { user } = useAuth();

if (user?.role === 'admin') {
  // 显示管理功能
}
```

## 数据库结构

主要表：
- `users` - 用户（含 role 字段）
- `posts` - 帖子
- `categories` - 分类
- `comments` - 评论
- `likes` - 点赞
- `purchases` - 购买记录
- `points_history` - 积分历史

完整 schema 见 `supabase-schema.sql`

## 常见问题

**环境变量不生效？**
- 重启开发服务器
- 确认文件名是 `.env.local` 不是 `.env`

**RLS 错误？**
- 确认已执行完整的 `supabase-schema.sql`
- 确认用户已登录

**管理员权限不生效？**
- 确认 role 为 'admin'
- 清除浏览器缓存后重新登录

## 更多信息

- [Supabase 文档](https://supabase.com/docs)
- [Next.js 集成](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)
