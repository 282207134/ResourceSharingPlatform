# 现有数据库升级指南

如果您已经使用了旧版 schema 创建了 Supabase 数据库，需要执行以下步骤来添加用户角色功能。

## 检查是否需要升级

在 Supabase SQL Editor 中执行：

```sql
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'users'
  AND column_name = 'role';
```

如果返回空结果，说明需要升级。

## 升级步骤

### 1. 添加 role 字段

```sql
-- 添加 role 列，默认值为 'user'
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user';

-- 添加约束，只允许 'user' 或 'admin'
ALTER TABLE public.users
ADD CONSTRAINT users_role_check CHECK (role IN ('user', 'admin'));

-- 更新现有用户为 'user' 角色
UPDATE public.users SET role = 'user' WHERE role IS NULL;
```

### 2. 添加管理员 RLS 策略

```sql
-- 允许管理员查看所有用户
CREATE POLICY "Admins can view all users" ON public.users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- 允许管理员更新任何用户
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
```

### 3. 设置第一个管理员

```sql
-- 查找要设为管理员的用户
SELECT id, username, email, role FROM public.users;

-- 设置为管理员（替换为实际的用户 ID）
UPDATE public.users
SET role = 'admin'
WHERE id = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

-- 验证
SELECT id, username, email, role FROM public.users WHERE role = 'admin';
```

### 4. 验证升级

执行以下查询确认升级成功：

```sql
-- 检查 role 字段
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'users'
  AND column_name = 'role';

-- 检查约束
SELECT constraint_name, check_clause
FROM information_schema.check_constraints
WHERE constraint_schema = 'public'
  AND constraint_name = 'users_role_check';

-- 检查 RLS 策略
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'users'
  AND policyname LIKE '%Admin%';

-- 查看所有用户及其角色
SELECT id, username, email, role, created_at
FROM public.users
ORDER BY created_at;
```

## 测试升级结果

### 1. 在前端测试

重新部署应用并测试：

```bash
# 重启开发服务器
npm run dev
```

1. 以管理员身份登录
2. 访问 `/api/admin/users` 应该能看到所有用户
3. 尝试修改其他用户的角色

### 2. API 测试

```bash
# 获取用户列表（需要管理员权限）
curl http://localhost:3000/api/admin/users

# 修改用户角色
curl -X PATCH http://localhost:3000/api/admin/users/{userId}/role \
  -H "Content-Type: application/json" \
  -d '{"role": "admin"}'
```

## 回滚

如果需要回滚更改：

```sql
-- 删除 RLS 策略
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update any user" ON public.users;

-- 删除约束
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;

-- 删除 role 列
ALTER TABLE public.users DROP COLUMN IF EXISTS role;
```

## 常见问题

### Q: 升级后无法登录？

A: 检查现有用户的 role 字段是否正确设置为 'user'：

```sql
SELECT id, username, email, role FROM public.users;

-- 如果 role 为 NULL，执行：
UPDATE public.users SET role = 'user' WHERE role IS NULL;
```

### Q: 管理员权限不生效？

A: 确认：
1. 用户的 role 确实是 'admin'
2. RLS 策略已正确创建
3. 浏览器缓存已清除，重新登录

```sql
-- 检查用户角色
SELECT id, username, email, role FROM public.users WHERE id = auth.uid();

-- 检查 RLS 策略
SELECT * FROM pg_policies WHERE tablename = 'users';
```

### Q: 出现 "violates check constraint" 错误？

A: role 字段只允许 'user' 或 'admin' 值。检查：

```sql
-- 查看约束
SELECT conname, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'public.users'::regclass
  AND contype = 'c';

-- 确保所有用户的 role 值正确
SELECT DISTINCT role FROM public.users;
```

## TypeScript 类型更新

升级数据库后，确保前端代码已更新：

1. 检查 `lib/supabase.ts` 中的类型定义包含 `role` 字段
2. 检查 `lib/auth-supabase.ts` 中的 User 接口包含 `role` 字段
3. 检查 `hooks/useAuth.tsx` 中的 User 接口包含 `role` 字段

如果缺失，请参考最新的代码更新这些文件。

## 完整的一步到位升级脚本

如果想一次性完成所有升级，可以执行：

```sql
-- ===== 开始升级 =====
BEGIN;

-- 1. 添加 role 字段
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user';

-- 2. 添加约束
ALTER TABLE public.users
ADD CONSTRAINT users_role_check CHECK (role IN ('user', 'admin'));

-- 3. 更新现有用户
UPDATE public.users SET role = 'user' WHERE role IS NULL;

-- 4. 创建管理员 RLS 策略
CREATE POLICY "Admins can view all users" ON public.users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

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

-- 5. 设置第一个管理员（请替换为您的用户 ID）
-- UPDATE public.users SET role = 'admin' WHERE email = 'your@email.com';

COMMIT;
-- ===== 升级完成 =====

-- 验证结果
SELECT 'Role column added:' as check, EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'role'
) as result;

SELECT 'RLS policies created:' as check, COUNT(*) as result
FROM pg_policies
WHERE tablename = 'users' AND policyname LIKE '%Admin%';

SELECT 'Users with roles:' as check, COUNT(*) as result
FROM public.users WHERE role IS NOT NULL;
```

## 更多帮助

如有问题，请参考：
- [USER-ROLES-GUIDE.md](./USER-ROLES-GUIDE.md) - 用户角色完整指南
- [README-SUPABASE.md](./README-SUPABASE.md) - Supabase 配置指南
- [Supabase 官方文档](https://supabase.com/docs)
