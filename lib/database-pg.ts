import { Pool, PoolClient } from 'pg';

// 数据库连接池
let pool: Pool | null = null;

// 初始化数据库连接池
function initializePool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    // 设置连接时的搜索路径
    pool.on('connect', (client) => {
      client.query('SET search_path TO public');
    });

    // 错误处理
    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
    });
  }
  return pool;
}

// 获取数据库连接
export async function getConnection(): Promise<PoolClient> {
  const currentPool = initializePool();
  const client = await currentPool.connect();
  
  // 确保设置搜索路径
  await client.query('SET search_path TO public');
  
  return client;
}

// 执行查询
export async function query(text: string, params?: any[]): Promise<QueryResult> {
  const client = await getConnection();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
}

// 用户相关数据库操作
export const userDb = {
  // 创建用户
  async create(userData: {
    username: string;
    email: string;
    password: string;
    points?: number;
  }) {
    const { username, email, password, points = 0 } = userData;
    const result = await query(
      'INSERT INTO users (username, email, password, points) VALUES ($1, $2, $3, $4) RETURNING *',
      [username, email, password, points]
    );
    return result.rows[0];
  },

  // 创建用户（带密码加密）
  async createUser(username: string, email: string, password: string) {
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await query(
      'INSERT INTO users (username, email, password, points) VALUES ($1, $2, $3, $4) RETURNING *',
      [username, email, hashedPassword, 0]
    );
    return result.rows[0];
  },

  // 根据用户名查找用户
  async findByUsername(username: string) {
    const result = await query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows[0];
  },

  // 根据邮箱查找用户
  async findByEmail(email: string) {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  },

  // 根据ID查找用户
  async findById(id: number) {
    const result = await query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  },

  // 更新用户积分
  async updatePoints(userId: number, points: number) {
    const result = await query(
      'UPDATE users SET points = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [points, userId]
    );
    return result.rows[0];
  },

  // 获取用户统计信息
  async getStats(userId: number) {
    const result = await query(`
      SELECT 
        u.id,
        u.username,
        u.email,
        u.points,
        u.is_verified,
        u.is_premium,
        u.created_at,
        COUNT(DISTINCT p.id) as posts_count,
        COUNT(DISTINCT r.id) as resources_count,
        COUNT(DISTINCT l.id) as likes_received,
        COUNT(DISTINCT f.id) as followers_count
      FROM users u
      LEFT JOIN posts p ON u.id = p.author_id
      LEFT JOIN resources r ON u.id = r.author_id
      LEFT JOIN likes l ON (l.post_id IN (SELECT id FROM posts WHERE author_id = u.id) OR 
                           l.resource_id IN (SELECT id FROM resources WHERE author_id = u.id))
      LEFT JOIN follows f ON u.id = f.following_id
      WHERE u.id = $1
      GROUP BY u.id, u.username, u.email, u.points, u.is_verified, u.is_premium, u.created_at
    `, [userId]);
    return result.rows[0];
  }
};

// 会话相关数据库操作
export const sessionDb = {
  // 创建会话
  async create(sessionData: {
    id: string;
    user_id: number;
    expires_at: Date;
  }) {
    const { id, user_id, expires_at } = sessionData;
    const result = await query(
      'INSERT INTO sessions (id, user_id, expires_at) VALUES ($1, $2, $3) RETURNING *',
      [id, user_id, expires_at]
    );
    return result.rows[0];
  },

  // 查找会话并获取用户信息
  async findSession(sessionId: string) {
    const result = await query(`
      SELECT 
        s.id as session_id,
        s.expires_at,
        u.id,
        u.username,
        u.email,
        u.points,
        u.avatar_url,
        u.is_verified,
        u.is_premium
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.id = $1 AND s.expires_at > CURRENT_TIMESTAMP
    `, [sessionId]);
    return result.rows[0];
  },

  // 删除会话
  async delete(sessionId: string) {
    await query('DELETE FROM sessions WHERE id = $1', [sessionId]);
  },

  // 清理过期会话
  async cleanupExpired() {
    const result = await query('DELETE FROM sessions WHERE expires_at <= CURRENT_TIMESTAMP');
    return result.rowCount;
  }
};

// 帖子相关数据库操作
export const postDb = {
  // 创建帖子
  async create(postData: {
    title: string;
    content: string;
    author_id: number;
    category_id?: number;
    points_required?: number;
    is_premium?: boolean;
    tags?: string[];
  }) {
    const {
      title,
      content,
      author_id,
      category_id,
      points_required = 0,
      is_premium = false,
      tags = []
    } = postData;
    
    const result = await query(`
      INSERT INTO posts (title, content, author_id, category_id, points_required, is_premium, tags)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [title, content, author_id, category_id, points_required, is_premium, tags]);
    
    return result.rows[0];
  },

  // 获取帖子列表
  async getList(options: {
    page?: number;
    limit?: number;
    category_id?: number;
    author_id?: number;
    search?: string;
    sort?: 'latest' | 'popular' | 'views';
  } = {}) {
    const {
      page = 1,
      limit = 20,
      category_id,
      author_id,
      search,
      sort = 'latest'
    } = options;

    const offset = (page - 1) * limit;
    let whereClause = 'WHERE p.is_published = true';
    const params: any[] = [];
    let paramIndex = 1;

    if (category_id) {
      whereClause += ` AND p.category_id = $${paramIndex}`;
      params.push(category_id);
      paramIndex++;
    }

    if (author_id) {
      whereClause += ` AND p.author_id = $${paramIndex}`;
      params.push(author_id);
      paramIndex++;
    }

    if (search) {
      whereClause += ` AND (to_tsvector('chinese', p.title || ' ' || p.content) @@ plainto_tsquery('chinese', $${paramIndex}))`;
      params.push(search);
      paramIndex++;
    }

    let orderClause = 'ORDER BY p.created_at DESC';
    if (sort === 'popular') {
      orderClause = 'ORDER BY p.likes_count DESC, p.created_at DESC';
    } else if (sort === 'views') {
      orderClause = 'ORDER BY p.views_count DESC, p.created_at DESC';
    }

    params.push(limit, offset);

    const result = await query(`
      SELECT 
        p.*,
        u.username as author_name,
        u.avatar_url as author_avatar,
        c.name as category_name,
        c.color as category_color
      FROM posts p
      JOIN users u ON p.author_id = u.id
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
      ${orderClause}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `, params);

    return result.rows;
  },

  // 根据ID获取帖子详情
  async getById(id: number, userId?: number) {
    const result = await query(`
      SELECT 
        p.*,
        u.username as author_name,
        u.avatar_url as author_avatar,
        u.is_verified as author_verified,
        c.name as category_name,
        c.color as category_color,
        ${userId ? `EXISTS(SELECT 1 FROM likes WHERE user_id = $2 AND post_id = p.id) as is_liked,` : ''}
        ${userId ? `EXISTS(SELECT 1 FROM favorites WHERE user_id = $2 AND post_id = p.id) as is_favorited,` : ''}
        ${userId ? `EXISTS(SELECT 1 FROM purchases WHERE user_id = $2 AND post_id = p.id) as is_purchased` : 'false as is_purchased'}
      FROM posts p
      JOIN users u ON p.author_id = u.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = $1 AND p.is_published = true
    `, userId ? [id, userId] : [id]);

    if (result.rows.length > 0) {
      // 增加浏览量
      await query('UPDATE posts SET views_count = views_count + 1 WHERE id = $1', [id]);
    }

    return result.rows[0];
  },

  // 更新帖子
  async update(id: number, updateData: Partial<{
    title: string;
    content: string;
    category_id: number;
    points_required: number;
    is_premium: boolean;
    tags: string[];
  }>) {
    const fields = Object.keys(updateData);
    const values = Object.values(updateData);
    
    if (fields.length === 0) return null;

    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    
    const result = await query(`
      UPDATE posts 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $1 
      RETURNING *
    `, [id, ...values]);

    return result.rows[0];
  },

  // 删除帖子
  async delete(id: number) {
    await query('DELETE FROM posts WHERE id = $1', [id]);
  }
};

// 资源相关数据库操作
export const resourceDb = {
  // 创建资源
  async create(resourceData: {
    title: string;
    description?: string;
    file_url: string;
    file_type: string;
    file_size?: number;
    thumbnail_url?: string;
    author_id: number;
    category_id?: number;
    points_required?: number;
    is_premium?: boolean;
    tags?: string[];
  }) {
    const {
      title,
      description,
      file_url,
      file_type,
      file_size,
      thumbnail_url,
      author_id,
      category_id,
      points_required = 0,
      is_premium = false,
      tags = []
    } = resourceData;
    
    const result = await query(`
      INSERT INTO resources (
        title, description, file_url, file_type, file_size, thumbnail_url,
        author_id, category_id, points_required, is_premium, tags
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `, [
      title, description, file_url, file_type, file_size, thumbnail_url,
      author_id, category_id, points_required, is_premium, tags
    ]);
    
    return result.rows[0];
  },

  // 获取资源列表
  async getList(options: {
    page?: number;
    limit?: number;
    category_id?: number;
    author_id?: number;
    file_type?: string;
    search?: string;
    sort?: 'latest' | 'popular' | 'downloads';
  } = {}) {
    const {
      page = 1,
      limit = 20,
      category_id,
      author_id,
      file_type,
      search,
      sort = 'latest'
    } = options;

    const offset = (page - 1) * limit;
    let whereClause = 'WHERE r.is_published = true';
    const params: any[] = [];
    let paramIndex = 1;

    if (category_id) {
      whereClause += ` AND r.category_id = $${paramIndex}`;
      params.push(category_id);
      paramIndex++;
    }

    if (author_id) {
      whereClause += ` AND r.author_id = $${paramIndex}`;
      params.push(author_id);
      paramIndex++;
    }

    if (file_type) {
      whereClause += ` AND r.file_type = $${paramIndex}`;
      params.push(file_type);
      paramIndex++;
    }

    if (search) {
      whereClause += ` AND (to_tsvector('chinese', r.title || ' ' || COALESCE(r.description, '')) @@ plainto_tsquery('chinese', $${paramIndex}))`;
      params.push(search);
      paramIndex++;
    }

    let orderClause = 'ORDER BY r.created_at DESC';
    if (sort === 'popular') {
      orderClause = 'ORDER BY r.likes_count DESC, r.created_at DESC';
    } else if (sort === 'downloads') {
      orderClause = 'ORDER BY r.downloads_count DESC, r.created_at DESC';
    }

    params.push(limit, offset);

    const result = await query(`
      SELECT 
        r.*,
        u.username as author_name,
        u.avatar_url as author_avatar,
        c.name as category_name,
        c.color as category_color
      FROM resources r
      JOIN users u ON r.author_id = u.id
      LEFT JOIN categories c ON r.category_id = c.id
      ${whereClause}
      ${orderClause}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `, params);

    return result.rows;
  },

  // 根据ID获取资源详情
  async getById(id: number, userId?: number) {
    const result = await query(`
      SELECT 
        r.*,
        u.username as author_name,
        u.avatar_url as author_avatar,
        u.is_verified as author_verified,
        c.name as category_name,
        c.color as category_color,
        ${userId ? `EXISTS(SELECT 1 FROM likes WHERE user_id = $2 AND resource_id = r.id) as is_liked,` : ''}
        ${userId ? `EXISTS(SELECT 1 FROM favorites WHERE user_id = $2 AND resource_id = r.id) as is_favorited,` : ''}
        ${userId ? `EXISTS(SELECT 1 FROM purchases WHERE user_id = $2 AND resource_id = r.id) as is_purchased` : 'false as is_purchased'}
      FROM resources r
      JOIN users u ON r.author_id = u.id
      LEFT JOIN categories c ON r.category_id = c.id
      WHERE r.id = $1 AND r.is_published = true
    `, userId ? [id, userId] : [id]);

    if (result.rows.length > 0) {
      // 增加浏览量
      await query('UPDATE resources SET views_count = views_count + 1 WHERE id = $1', [id]);
    }

    return result.rows[0];
  }
};

// 点赞相关数据库操作
export const likeDb = {
  // 切换点赞状态
  async toggle(userId: number, targetType: 'post' | 'resource' | 'comment', targetId: number) {
    const client = await getConnection();
    
    try {
      await client.query('BEGIN');
      
      // 检查是否已点赞
      const checkQuery = `SELECT id FROM likes WHERE user_id = $1 AND ${targetType}_id = $2`;
      const existingLike = await client.query(checkQuery, [userId, targetId]);
      
      if (existingLike.rows.length > 0) {
        // 取消点赞
        await client.query(`DELETE FROM likes WHERE user_id = $1 AND ${targetType}_id = $2`, [userId, targetId]);
        await client.query(`UPDATE ${targetType}s SET likes_count = likes_count - 1 WHERE id = $1`, [targetId]);
        
        await client.query('COMMIT');
        return { liked: false };
      } else {
        // 添加点赞
        const insertQuery = `INSERT INTO likes (user_id, ${targetType}_id) VALUES ($1, $2)`;
        await client.query(insertQuery, [userId, targetId]);
        await client.query(`UPDATE ${targetType}s SET likes_count = likes_count + 1 WHERE id = $1`, [targetId]);
        
        await client.query('COMMIT');
        return { liked: true };
      }
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
};

// 积分历史相关数据库操作
export const pointsHistoryDb = {
  // 添加积分记录
  async add(data: {
    user_id: number;
    points_change: number;
    balance_after: number;
    description: string;
    transaction_type: string;
    reference_id?: number;
  }) {
    const result = await query(`
      INSERT INTO points_history (user_id, points_change, balance_after, description, transaction_type, reference_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [
      data.user_id,
      data.points_change,
      data.balance_after,
      data.description,
      data.transaction_type,
      data.reference_id
    ]);
    
    return result.rows[0];
  },

  // 获取用户积分历史
  async getUserHistory(userId: number, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const result = await query(`
      SELECT * FROM points_history 
      WHERE user_id = $1 
      ORDER BY created_at DESC 
      LIMIT $2 OFFSET $3
    `, [userId, limit, offset]);
    
    return result.rows;
  }
};

// 分类相关数据库操作
export const categoryDb = {
  // 获取所有分类
  async getAll() {
    const result = await query(`
      SELECT * FROM categories 
      WHERE is_active = true 
      ORDER BY sort_order ASC, name ASC
    `);
    return result.rows;
  },

  // 根据ID获取分类
  async getById(id: number) {
    const result = await query('SELECT * FROM categories WHERE id = $1 AND is_active = true', [id]);
    return result.rows[0];
  }
};

// 初始化数据库（创建表结构）
export async function initializeTables() {
  // 这里可以读取 database-schema.sql 文件并执行
  // 或者在生产环境中使用数据库迁移工具
  console.log('Database tables should be created manually using database-schema.sql');
}

// 关闭数据库连接
export async function closeDatabase() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}