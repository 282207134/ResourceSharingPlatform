# 用户角色管理指南

## 概述

本系统支持两种用户角色：
- **user（普通用户）**：默认角色，可以发帖、评论、购买内容
- **admin（管理员）**：拥有所有权限，可以管理用户、内容等

## 角色实现方式

### 数据库设计

在 `public.users` 表中添加了 `role` 字段：

```sql
role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin'))
```

- 默认值：`'user'`
- 约束：只能是 `'user'` 或 `'admin'`
- 所有新注册用户默认为普通用户

## 如何设置管理员

### 方法 1：直接在 Supabase 控制台修改

1. 登录 [Supabase 控制台](https://supabase.com)
2. 进入你的项目
3. 点击左侧菜单 **Database** → **Table Editor**
4. 选择 **users** 表
5. 找到要设置为管理员的用户行
6. 点击 `role` 列的值，修改为 `admin`
7. 保存

### 方法 2：使用 SQL Editor

1. 在 Supabase 控制台，点击 **SQL Editor**
2. 执行以下 SQL（替换为实际的用户 ID）：

```sql
UPDATE public.users
SET role = 'admin'
WHERE id = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
```

查询用户 ID：

```sql
SELECT id, username, email, role
FROM public.users
WHERE email = 'user@example.com';
```

### 方法 3：使用 API（需要已有管理员权限）

```bash
# 需要先以管理员身份登录
curl -X PATCH https://your-domain.com/api/admin/users/{userId}/role \
  -H "Content-Type: application/json" \
  -d '{"role": "admin"}'
```

## 权限控制

### 后端权限检查

在 API 路由中使用权限检查函数：

```typescript
import { requireAdmin, requireAuth, isAdmin } from '@/lib/auth-supabase';

// 要求用户登录
export async function POST(request: NextRequest) {
  const user = await requireAuth();
  // ... 继续处理
}

// 要求管理员权限
export async function DELETE(request: NextRequest) {
  const admin = await requireAdmin();
  // ... 只有管理员可以执行
}

// 检查是否为管理员
export async function GET(request: NextRequest) {
  const admin = await isAdmin();
  if (admin) {
    // 显示管理员功能
  }
}
```

### 前端权限判断

在 React 组件中判断用户角色：

```tsx
import { useAuth } from '@/hooks/useAuth';

function AdminPanel() {
  const { user } = useAuth();

  if (user?.role !== 'admin') {
    return <div>您没有权限访问此页面</div>;
  }

  return (
    <div>
      {/* 管理员功能 */}
    </div>
  );
}
```

## API 路由

### 获取用户列表（管理员）

```bash
GET /api/admin/users
```

查询参数：
- `page`：页码（默认：1）
- `limit`：每页数量（默认：50）
- `role`：过滤角色（可选：`user` 或 `admin`）

示例：
```bash
GET /api/admin/users?page=1&limit=20&role=admin
```

响应：
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "username": "admin_user",
      "email": "admin@example.com",
      "role": "admin",
      "points": 1000,
      "is_verified": true,
      "is_premium": false,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "hasMore": false
  }
}
```

### 修改用户角色（管理员）

```bash
PATCH /api/admin/users/{userId}/role
```

请求体：
```json
{
  "role": "admin"  // 或 "user"
}
```

示例：
```bash
curl -X PATCH http://localhost:3000/api/admin/users/xxx-xxx-xxx/role \
  -H "Content-Type: application/json" \
  -d '{"role": "admin"}'
```

响应：
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "username": "username",
    "email": "email@example.com",
    "role": "admin",
    "points": 100,
    "is_verified": false,
    "is_premium": false
  }
}
```

## Row Level Security (RLS) 策略

数据库已配置 RLS 策略确保安全：

### 用户只能查看自己的数据

```sql
CREATE POLICY "Users can view their own data" ON public.users
  FOR SELECT USING (auth.uid() = id);
```

### 只有管理员可以修改用户角色

在应用层通过 `requireAdmin()` 函数实现。

## 最佳实践

### 1. 首个管理员设置

建议在系统初始化时，立即通过 SQL 设置第一个管理员：

```sql
-- 找到第一个注册的用户
SELECT id, username, email FROM public.users ORDER BY created_at LIMIT 1;

-- 设置为管理员
UPDATE public.users SET role = 'admin' WHERE id = 'xxx';
```

### 2. 管理员权限最小化

- 不要给所有人管理员权限
- 定期审查管理员列表
- 使用审计日志追踪管理员操作

### 3. 前后端双重验证

```typescript
// ✅ 正确：前后端都验证
// 前端：隐藏管理员功能按钮
{user?.role === 'admin' && <AdminButton />}

// 后端：验证权限
export async function POST(request: NextRequest) {
  await requireAdmin();
  // ... 处理请求
}
```

### 4. 错误处理

```typescript
try {
  await requireAdmin();
} catch (error) {
  if (error.message === '未登录') {
    return NextResponse.json({ error: '请先登录' }, { status: 401 });
  }
  if (error.message === '需要管理员权限') {
    return NextResponse.json({ error: '权限不足' }, { status: 403 });
  }
}
```

## 常见使用场景

### 场景 1：内容审核

管理员可以审核用户发布的内容：

```typescript
import { isAdmin } from '@/lib/auth-supabase';

export async function GET(request: NextRequest) {
  const admin = await isAdmin();
  
  // 管理员可以看到所有内容（包括未发布）
  // 普通用户只能看到已发布内容
  const posts = await postDb.getList({
    is_published: admin ? undefined : true
  });
  
  return NextResponse.json({ data: posts });
}
```

### 场景 2：用户管理

```typescript
function UserManagement() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetch('/api/admin/users')
        .then(res => res.json())
        .then(data => setUsers(data.data));
    }
  }, [user]);

  const changeRole = async (userId: string, role: 'user' | 'admin') => {
    await fetch(`/api/admin/users/${userId}/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role })
    });
  };

  if (user?.role !== 'admin') {
    return <div>权限不足</div>;
  }

  return (
    <div>
      <h1>用户管理</h1>
      {users.map(u => (
        <div key={u.id}>
          {u.username} - {u.role}
          <button onClick={() => changeRole(u.id, 'admin')}>
            设为管理员
          </button>
          <button onClick={() => changeRole(u.id, 'user')}>
            设为普通用户
          </button>
        </div>
      ))}
    </div>
  );
}
```

### 场景 3：积分调整

管理员可以调整用户积分：

```typescript
export async function PATCH(request: NextRequest) {
  await requireAdmin();
  
  const { userId, points } = await request.json();
  await userDb.updatePoints(userId, points);
  
  return NextResponse.json({ success: true });
}
```

## 安全注意事项

### ⚠️ 重要安全提示

1. **不要在客户端暴露敏感信息**
   ```typescript
   // ❌ 错误
   const users = await userDb.listUsers(); // 包含所有用户信息
   return users;
   
   // ✅ 正确
   const users = await userDb.listUsers();
   return users.map(u => ({
     id: u.id,
     username: u.username,
     role: u.role
   }));
   ```

2. **始终在服务端验证权限**
   ```typescript
   // ❌ 错误：只在前端检查
   if (user.role === 'admin') {
     deleteUser();
   }
   
   // ✅ 正确：在 API 路由中验证
   export async function DELETE(request: NextRequest) {
     await requireAdmin(); // 服务端验证
     // ... 删除操作
   }
   ```

3. **使用 RLS 作为最后防线**
   即使应用层有 bug，RLS 策略也能保护数据。

4. **记录管理员操作**
   建议在 `points_history` 或专门的审计表中记录管理员操作。

## 故障排除

### 无法设置管理员

**问题**：执行 SQL 更新 role 字段时出错

**解决方案**：
1. 确保 SQL 中的 UUID 正确
2. 检查 role 字段是否存在：
   ```sql
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'users' AND column_name = 'role';
   ```
3. 如果字段不存在，重新执行 `supabase-schema.sql`

### 管理员权限未生效

**问题**：已设置 role = 'admin'，但 API 仍返回权限不足

**解决方案**：
1. 清除浏览器缓存和 cookies
2. 重新登录
3. 检查前端是否正确获取用户信息：
   ```typescript
   console.log(user?.role); // 应该是 'admin'
   ```

### API 路由未找到

**问题**：访问 `/api/admin/users` 返回 404

**解决方案**：
1. 确认文件路径正确：`app/api/admin/users/route.ts`
2. 重启开发服务器：`npm run dev`
3. 检查 Next.js 版本是否支持 App Router

## 总结

✅ **已实现功能**：
- 用户角色字段（user/admin）
- 权限检查函数（requireAuth, requireAdmin, isAdmin）
- 用户列表 API（管理员）
- 角色修改 API（管理员）
- TypeScript 类型支持

📋 **使用流程**：
1. 注册用户（默认为 user）
2. 通过 SQL 设置第一个管理员
3. 使用管理员账户登录
4. 通过 API 管理其他用户角色

🔐 **安全措施**：
- 服务端权限验证
- RLS 数据保护
- 前后端双重检查
- 审计日志记录（建议实现）

如需更多帮助，请参考 [README-SUPABASE.md](./README-SUPABASE.md)。
