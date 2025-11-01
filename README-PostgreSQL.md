# PostgreSQL 数据库迁移指南

## 概述

本项目已从 SQLite 迁移到 PostgreSQL，以支持更复杂的功能和更好的性能。

## 环境配置

### 1. 安装 PostgreSQL

请确保您的系统已安装 PostgreSQL 数据库。

**Windows:**
- 下载并安装 PostgreSQL: https://www.postgresql.org/download/windows/

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2. 创建数据库

```bash
# 登录 PostgreSQL
sudo -u postgres psql

# 创建数据库
CREATE DATABASE knowledge_platform;

# 创建用户（可选）
CREATE USER your_username WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE knowledge_platform TO your_username;

# 退出
\q
```

### 3. 配置环境变量

更新 `.env.local` 文件中的数据库连接字符串：

```env
DATABASE_URL=postgresql://username:password@localhost:5432/knowledge_platform
```

将 `username` 和 `password` 替换为您的实际数据库凭据。

### 4. 初始化数据库表

执行 `database-schema.sql` 文件来创建所有必要的表：

```bash
psql -U username -d knowledge_platform -f database-schema.sql
```

## 新功能

### 数据库表结构

1. **用户表 (users)** - 扩展了用户信息
2. **帖子表 (posts)** - 支持内容发布
3. **资源表 (resources)** - 支持文件上传和管理
4. **分类表 (categories)** - 内容分类管理
5. **评论表 (comments)** - 支持评论和回复
6. **点赞表 (likes)** - 点赞功能
7. **收藏表 (favorites)** - 收藏功能
8. **购买记录表 (purchases)** - 积分购买记录
9. **积分历史表 (points_history)** - 积分变动记录
10. **消息表 (messages)** - 站内消息
11. **关注表 (follows)** - 用户关注功能

### API 端点

#### 帖子管理
- `GET /api/posts` - 获取帖子列表
- `POST /api/posts` - 创建新帖子
- `GET /api/posts/[id]` - 获取帖子详情
- `PUT /api/posts/[id]` - 更新帖子
- `DELETE /api/posts/[id]` - 删除帖子

#### 点赞功能
- `POST /api/likes` - 切换点赞状态

#### 搜索功能
- `GET /api/search` - 全局搜索
- `POST /api/search` - 获取搜索建议

#### 分类管理
- `GET /api/categories` - 获取所有分类

### 搜索功能增强

- 支持全文搜索（使用 PostgreSQL 的 tsvector）
- 支持中文分词
- 支持按分类、作者、标签筛选
- 支持多种排序方式（最新、热门、浏览量）

### 性能优化

- 使用数据库连接池
- 创建了适当的索引
- 支持分页查询
- 优化了查询语句

## 开发注意事项

1. **数据库连接**: 使用 `lib/database-pg.ts` 中的连接池
2. **错误处理**: 所有数据库操作都包含适当的错误处理
3. **数据验证**: API 端点包含输入验证
4. **安全性**: 密码使用 bcrypt 加密，支持 JWT 会话管理

## 测试

在开始使用之前，请确保：

1. PostgreSQL 服务正在运行
2. 数据库连接配置正确
3. 所有表已成功创建
4. 环境变量已正确设置

## 故障排除

### 常见问题

1. **连接错误**: 检查 DATABASE_URL 是否正确
2. **权限错误**: 确保数据库用户有足够的权限
3. **表不存在**: 确保已执行 database-schema.sql
4. **端口冲突**: 确保 PostgreSQL 运行在正确的端口（默认 5432）

### 日志查看

应用程序会在控制台输出详细的错误信息，请查看终端日志以获取更多调试信息。