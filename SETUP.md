# 快速开始（5分钟）

## 第一步：创建 Supabase 项目

1. 访问 https://supabase.com 注册并登录
2. 点击 "New Project"
3. 填写项目名称和数据库密码
4. 等待项目初始化完成（约2分钟）

## 第二步：配置环境变量

1. 在项目根目录创建 `.env.local` 文件
2. 在 Supabase 控制台点击 **Settings** → **API**
3. 复制以下内容到 `.env.local`：

```env
NEXT_PUBLIC_SUPABASE_URL=你的Project_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的anon_public_key
```

## 第三步：创建数据库（重要！）

1. 在 Supabase 控制台，点击左侧 **SQL Editor**
2. 点击 **+ New query**
3. 打开项目中的 `supabase-schema.sql` 文件
4. 复制全部内容（420行）
5. 粘贴到 SQL Editor
6. 点击右下角 **Run** 按钮

✅ 看到 "Success. No rows returned" 就是成功了

## 第四步：配置存储桶

1. 点击左侧 **Storage**
2. 点击 **Create a new bucket**
3. 创建3个 bucket（名称和设置如下）：

| Bucket名称 | Public | 用途 |
|-----------|--------|------|
| avatars   | ✅ Yes | 用户头像 |
| posts     | ✅ Yes | 帖子图片 |
| resources | ✅ Yes | 资源文件 |

## 第五步：启动项目

```bash
npm install
npm run dev
```

访问 http://localhost:3000

## 第六步：设置管理员（首次注册后）

1. 在前端注册一个账号
2. 回到 Supabase **SQL Editor**
3. 执行以下SQL（替换你的邮箱）：

```sql
UPDATE public.users 
SET role = 'admin' 
WHERE email = '你注册的邮箱@example.com';
```

4. 重新登录，现在你是管理员了

---

## 验证是否设置成功

在 **SQL Editor** 执行：

```sql
-- 查看用户表结构
SELECT * FROM public.users LIMIT 1;

-- 查看所有用户及角色
SELECT username, email, role, points FROM public.users;
```

---

## 常见错误

### ❌ "column does not exist"

**原因**：没有执行 `supabase-schema.sql`  
**解决**：回到第三步，完整执行一次

### ❌ "relation does not exist"

**原因**：表还没创建  
**解决**：回到第三步，完整执行一次

### ❌ 环境变量不生效

**原因**：文件名错误或需要重启  
**解决**：
1. 确认文件名是 `.env.local`（不是 `.env`）
2. 重启开发服务器 `npm run dev`

---

有问题？检查：
- [ ] Supabase 项目已创建并初始化完成
- [ ] `.env.local` 文件存在且变量正确
- [ ] 已执行完整的 `supabase-schema.sql`
- [ ] 已创建 3 个存储桶
- [ ] 已重启开发服务器
