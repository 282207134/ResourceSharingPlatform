# 用户角色快速指南

系统有两种角色：

| 角色 | 权限 |
|------|------|
| user | 普通用户，发帖/购买/评论 |
| admin | 管理员，额外拥有内容与用户管理功能 |

## 如何设置管理员

1. 进入 Supabase 控制台 → **SQL Editor**
2. 执行以下 SQL（替换邮箱或用户 ID）：

```sql
-- 通过邮箱设置管理员
UPDATE users SET role = 'admin' WHERE email = 'user@example.com';

-- 取消管理员
UPDATE users SET role = 'user' WHERE email = 'user@example.com';
```

💡 新注册用户默认 role = `user`

## 管理员专用 API

```http
GET  /api/admin/users            // 列出用户，支持 ?page=&limit=&role=
PATCH /api/admin/users/{id}/role // 修改角色，Body: {"role":"admin"}
```

返回示例：

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "username": "alice",
      "email": "alice@example.com",
      "role": "admin",
      "points": 120
    }
  ]
}
```

## 前后端如何判断权限

前端（React）：

```tsx
const { user } = useAuth();
if (user?.role === 'admin') {
  // 显示管理员工具
}
```

后端（API Route）：

```ts
import { requireAdmin } from '@/lib/auth-supabase';

export async function POST() {
  await requireAdmin();
  // ...管理员逻辑
}
```

## 常见问题

- **看到 403 权限不足？**
  - 确认当前登录账号的 role 为 `admin`
  - 重新登录以刷新会话

- **Role 字段没有？**
  - 重新执行 `supabase-schema.sql`

更多安装/配置说明请查看 [README-SUPABASE.md](./README-SUPABASE.md)。
