# Supabase 迁移指南

本项目已完全迁移至 Supabase 作为后端服务。Supabase 提供了 PostgreSQL 数据库、认证、存储和实时订阅等功能。

## 什么是 Supabase？

Supabase 是一个开源的 Firebase 替代品，提供：
- **PostgreSQL 数据库**：功能强大的关系型数据库
- **认证服务**：内置用户认证和授权
- **实时订阅**：数据库变更的实时监听
- **存储服务**：文件上传和管理
- **Row Level Security (RLS)**：行级安全策略

## 设置步骤

### 1. 创建 Supabase 项目

1. 访问 [https://supabase.com](https://supabase.com)
2. 注册并创建新项目
3. 等待项目初始化完成（约2分钟）

### 2. 获取项目凭证

在 Supabase 项目仪表板中：
1. 点击左侧菜单的 **Settings** → **API**
2. 复制以下信息：
   - **Project URL** (类似: `https://xxxxx.supabase.co`)
   - **anon public** key

### 3. 配置环境变量

在项目根目录创建 `.env.local` 文件：

```env
NEXT_PUBLIC_SUPABASE_URL=你的_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的_supabase_anon_key
```

### 4. 执行数据库迁移

1. 在 Supabase 仪表板中，点击左侧菜单的 **SQL Editor**
2. 点击 **New Query**
3. 复制 `supabase-schema.sql` 文件的全部内容
4. 粘贴到 SQL 编辑器中
5. 点击 **Run** 执行 SQL

这将创建所有必要的表、索引、触发器和 RLS 策略。

### 5. 配置认证

在 Supabase 仪表板中：
1. 点击左侧菜单的 **Authentication** → **Providers**
2. 确保 **Email** 提供商已启用
3. （可选）配置其他登录方式（Google, GitHub 等）

### 6. 配置存储桶（用于文件上传）

1. 点击左侧菜单的 **Storage**
2. 创建以下存储桶：
   - `avatars` - 用户头像
   - `posts` - 帖子图片
   - `resources` - 资源文件
3. 为每个存储桶配置访问策略

### 7. 设置第一个管理员用户（重要）

注册第一个用户后，需要将其设为管理员：

1. 在 Supabase 仪表板，点击 **SQL Editor**
2. 查找刚注册的用户 ID：
   ```sql
   SELECT id, username, email, role FROM public.users ORDER BY created_at LIMIT 1;
   ```
3. 设置为管理员：
   ```sql
   UPDATE public.users SET role = 'admin' WHERE id = '你的用户ID';
   ```

详细说明请参考 [USER-ROLES-GUIDE.md](./USER-ROLES-GUIDE.md)

### 8. 启动应用

```bash
npm install
npm run dev
```

访问 `http://localhost:3000` 查看应用。

## 数据库结构

### 主要表

- **users** - 用户信息（扩展 Supabase Auth）
- **posts** - 帖子/文章
- **resources** - 资源文件
- **categories** - 分类
- **comments** - 评论
- **likes** - 点赞
- **purchases** - 购买记录
- **points_history** - 积分历史
- **messages** - 消息
- **follows** - 关注关系
- **favorites** - 收藏

### Row Level Security (RLS)

项目使用 Supabase 的 RLS 功能来保护数据：
- 用户只能修改自己创建的内容
- 所有已发布的内容对所有人可见
- 私密数据（购买记录、积分历史）只对所属用户可见

## API 变更

所有 API 路由已更新为使用 Supabase 客户端：

### 认证 API
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/logout` - 用户登出
- `GET /api/auth/me` - 获取当前用户信息

### 内容 API
- `GET /api/posts` - 获取帖子列表
- `POST /api/posts` - 创建新帖子
- `GET /api/posts/[id]` - 获取帖子详情
- `PUT /api/posts/[id]` - 更新帖子
- `DELETE /api/posts/[id]` - 删除帖子

### 其他 API
- `GET /api/categories` - 获取分类列表
- `POST /api/likes` - 切换点赞状态
- `GET /api/search` - 全局搜索

## 关键文件

### Supabase 客户端配置
- `lib/supabase.ts` - Supabase 客户端初始化和类型定义

### 数据库操作
- `lib/database-supabase.ts` - 数据库操作封装（用户、帖子、资源等）

### 认证
- `lib/auth-supabase.ts` - 认证相关函数（登录、注册、登出等）

### Hooks
- `hooks/useAuth.tsx` - React 认证 Hook

## 从旧版本迁移

如果您从 SQLite/PostgreSQL 版本迁移：

1. **数据迁移**：使用 `pg_dump` 导出旧数据，然后导入到 Supabase
2. **用户密码**：Supabase Auth 使用不同的密码哈希，用户需要重置密码
3. **ID 类型**：用户 ID 从 `INTEGER` 改为 `UUID`

## 优势

### 使用 Supabase 的优势：
1. **无需管理服务器** - Supabase 托管所有后端服务
2. **自动扩展** - 根据流量自动扩展
3. **实时功能** - 内置实时数据订阅
4. **安全性** - Row Level Security 保护数据
5. **备份** - 自动备份和恢复
6. **开发体验** - 优秀的管理界面和工具

### 免费额度：
- 500MB 数据库空间
- 1GB 文件存储
- 50,000 月活用户
- 2GB 数据传输

## 故障排除

### 连接错误
- 检查 `.env.local` 中的环境变量是否正确
- 确保 Supabase 项目已完全初始化
- 检查网络连接

### 认证错误
- 确认 Email 认证已在 Supabase 中启用
- 检查邮箱验证设置（开发环境可以禁用）

### RLS 错误
如果遇到 "row-level security policy" 错误：
- 检查是否正确执行了 `supabase-schema.sql`
- 确认用户已登录（某些操作需要认证）
- 如果是管理员功能，请确认当前登录用户的 `role` 为 `admin`

## 更多资源

- [Supabase 官方文档](https://supabase.com/docs)
- [Supabase JavaScript 客户端](https://supabase.com/docs/reference/javascript)
- [Next.js + Supabase 教程](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)
- [USER-ROLES-GUIDE.md](./USER-ROLES-GUIDE.md) - 用户角色管理指南
- [UPGRADE-EXISTING-DATABASE.md](./UPGRADE-EXISTING-DATABASE.md) - 老项目升级步骤

## 支持

如有问题，请访问：
- [Supabase Discord](https://discord.supabase.com/)
- [GitHub Issues](https://github.com/supabase/supabase/issues)
