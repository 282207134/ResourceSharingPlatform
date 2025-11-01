# 快速开始指南

## 概述

本项目已完全迁移到 **Supabase** 后端。Supabase 是一个开源的 Firebase 替代品，提供完整的后端服务。

## 前提条件

- Node.js 18+ 或 Bun
- 一个 Supabase 账户（免费）

## 设置步骤

### 1. 创建 Supabase 项目

1. 访问 [https://supabase.com](https://supabase.com)
2. 注册/登录账户
3. 点击 "New Project"
4. 填写项目信息：
   - **Name**: 项目名称（例如：knowledge-marketplace）
   - **Database Password**: 设置一个强密码（保存好）
   - **Region**: 选择最近的区域
5. 点击 "Create new project" 并等待初始化（约 2 分钟）

### 2. 获取 API 密钥

项目创建完成后：

1. 在左侧菜单点击 **Settings** ⚙️
2. 选择 **API**
3. 找到并复制：
   - **Project URL** (例如：`https://xxxxx.supabase.co`)
   - **anon public** key (一长串字符)

### 3. 配置环境变量

在项目根目录创建 `.env.local` 文件：

```bash
NEXT_PUBLIC_SUPABASE_URL=你的_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的_anon_key
```

**示例：**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. 创建数据库表

1. 在 Supabase 仪表板，点击左侧菜单的 **SQL Editor** 📝
2. 点击 **New Query**
3. 打开项目中的 `supabase-schema.sql` 文件
4. 复制所有内容并粘贴到 SQL 编辑器
5. 点击右下角的 **Run** ▶️ 按钮
6. 等待执行完成，应该看到 "Success" 提示

### 5. 安装依赖并运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 验证安装

### 测试数据库连接

1. 打开应用
2. 尝试注册一个新账户
3. 如果注册成功，说明 Supabase 配置正确

### 检查数据

在 Supabase 仪表板：
1. 点击左侧菜单的 **Table Editor** 📊
2. 应该能看到所有创建的表（users, posts, categories 等）
3. 点击 **users** 表，应该能看到刚注册的用户

## 常见问题

### 1. 环境变量未生效

**问题**：应用无法连接到 Supabase

**解决方案**：
- 确保 `.env.local` 文件在项目根目录
- 重启开发服务器（Ctrl+C 然后 `npm run dev`）
- 检查变量名是否以 `NEXT_PUBLIC_` 开头

### 2. SQL 执行失败

**问题**：执行 `supabase-schema.sql` 时出错

**解决方案**：
- 确保项目已完全初始化
- 检查是否有语法错误
- 尝试分段执行（先创建表，再创建索引，最后创建 RLS 策略）

### 3. 注册/登录失败

**问题**：无法注册或登录

**可能原因**：
- Email 认证需要确认（默认开启）

**解决方案**：
1. 在 Supabase 仪表板，点击 **Authentication** 👤
2. 选择 **Providers**
3. 找到 **Email**
4. 关闭 "Confirm email" 选项（仅开发环境）

### 4. 图片上传失败

**问题**：上传图片时出错

**解决方案**：

需要创建存储桶：
1. 在 Supabase 仪表板，点击 **Storage** 📦
2. 点击 "Create a new bucket"
3. 创建以下桶：
   - `posts` (public)
   - `avatars` (public)
   - `resources` (根据需求设置)

## 下一步

### 配置存储（可选）

如果需要文件上传功能：

1. **创建存储桶**（如上）
2. **设置访问策略**：
   ```sql
   -- 允许所有人读取
   CREATE POLICY "Public Access"
   ON storage.objects FOR SELECT
   USING ( bucket_id = 'posts' );

   -- 允许认证用户上传
   CREATE POLICY "Authenticated Upload"
   ON storage.objects FOR INSERT
   WITH CHECK (
     bucket_id = 'posts' AND 
     auth.role() = 'authenticated'
   );
   ```

### 自定义分类

默认已创建 7 个分类，如需修改：

1. 打开 SQL Editor
2. 执行：
   ```sql
   INSERT INTO public.categories (name, description, icon, color, sort_order)
   VALUES ('新分类', '分类描述', '📚', 'bg-purple-500', 8);
   ```

### 启用实时功能（可选）

Supabase Realtime 可以监听数据变化：

```typescript
// 在组件中订阅新帖子
useEffect(() => {
  const supabase = createSupabaseClient();
  
  const channel = supabase
    .channel('posts')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'posts'
    }, (payload) => {
      console.log('新帖子:', payload.new);
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);
```

## 生产部署

### Vercel

1. 推送代码到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 添加环境变量：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. 部署

### 其他平台

确保设置以上环境变量即可。

## 更多资源

- [Supabase 文档](https://supabase.com/docs)
- [Next.js + Supabase 教程](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)
- [项目 README](./README.md)
- [详细迁移指南](./README-SUPABASE.md)
- [迁移总结](./MIGRATION-SUMMARY.md)

## 需要帮助？

如果遇到问题：

1. 检查 Supabase 项目状态
2. 查看浏览器控制台错误
3. 查看 Supabase 日志（Dashboard → Logs）
4. 参考 [Supabase Discord](https://discord.supabase.com/)

祝使用愉快！🎉
