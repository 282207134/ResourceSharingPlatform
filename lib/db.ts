
import { Database } from 'sqlite3';
import sqlite3 from 'sqlite3';
import path from 'path';

// 初始化数据库连接
const dbPath = path.join(process.cwd(), 'data', 'app.db');
const db = new sqlite3.Database(dbPath);

// 数据库初始化函数
export function initializeDatabase() {
  return new Promise<void>((resolve, reject) => {
    // 打开数据库连接
    db.serialize(() => {
      // 创建用户表
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          points INTEGER DEFAULT 0,
          avatar_url TEXT,
          bio TEXT,
          is_verified BOOLEAN DEFAULT 0,
          is_premium BOOLEAN DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // 创建帖子表
      db.run(`
        CREATE TABLE IF NOT EXISTS posts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          author_id INTEGER NOT NULL,
          category_id INTEGER,
          points_required INTEGER DEFAULT 0,
          is_premium BOOLEAN DEFAULT 0,
          is_published BOOLEAN DEFAULT 1,
          views_count INTEGER DEFAULT 0,
          likes_count INTEGER DEFAULT 0,
          comments_count INTEGER DEFAULT 0,
          tags TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `);

      // 创建点赞表
      db.run(`
        CREATE TABLE IF NOT EXISTS likes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          post_id INTEGER NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
          UNIQUE(user_id, post_id)
        )
      `);

      // 创建评论表
      db.run(`
        CREATE TABLE IF NOT EXISTS comments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          content TEXT NOT NULL,
          author_id INTEGER NOT NULL,
          post_id INTEGER NOT NULL,
          parent_id INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
          FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
        )
      `);

      // 创建分类表
      db.run(`
        CREATE TABLE IF NOT EXISTS categories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT,
          icon TEXT,
          color TEXT,
          sort_order INTEGER DEFAULT 0,
          is_active BOOLEAN DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // 创建搜索索引
      db.run(`
        CREATE VIRTUAL TABLE IF NOT EXISTS posts_search 
        USING fts5(title, content, tags, content='posts', content_rowid='id')
      `);

      // 创建触发器，在帖子更新时同步搜索索引
      db.run(`
        CREATE TRIGGER IF NOT EXISTS posts_ai 
        AFTER INSERT ON posts BEGIN
          INSERT INTO posts_search (rowid, title, content, tags) 
          VALUES (new.id, new.title, new.content, new.tags);
        END;
      `);

      db.run(`
        CREATE TRIGGER IF NOT EXISTS posts_ad 
        AFTER DELETE ON posts BEGIN
          DELETE FROM posts_search WHERE rowid = old.id;
        END;
      `);

      db.run(`
        CREATE TRIGGER IF NOT EXISTS posts_au 
        AFTER UPDATE ON posts BEGIN
          DELETE FROM posts_search WHERE rowid = old.id;
          INSERT INTO posts_search (rowid, title, content, tags) 
          VALUES (new.id, new.title, new.content, new.tags);
        END;
      `);

      // 创建索引
      db.run(`CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_posts_category_id ON posts(category_id)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_posts_likes_count ON posts(likes_count DESC)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_posts_views_count ON posts(views_count DESC)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_likes_post_id ON likes(post_id)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_comments_author_id ON comments(author_id)`);

      // 插入默认分类
      db.run(`
        INSERT OR IGNORE INTO categories (id, name, description, icon, color, sort_order) 
        VALUES 
          (1, 'TK短视频作品', '热门短视频内容，创意灵感分享', '🎬', 'bg-red-500', 1),
          (2, '欧美TK作品', '欧美风格短视频作品集合', '🌍', 'bg-blue-500', 2),
          (3, '演示文档作品专区', '专业演示文档模板和案例', '📊', 'bg-green-500', 3),
          (4, '美足足控区', '足部护理和美容相关内容', '👠', 'bg-pink-500', 4),
          (5, '女优作品专区', '优质女性创作者作品展示', '👩‍🎨', 'bg-purple-500', 5),
          (6, '追足作品', '足部艺术和摄影作品', '📸', 'bg-indigo-500', 6),
          (7, '编辑艺术作品', '视频编辑和后期制作教程', '🎨', 'bg-yellow-500', 7)
      `);

      resolve();
    });
  });
}

// 获取数据库连接实例
export function getDb(): Database {
  return db;
}

// 关闭数据库连接
export function closeDatabase() {
  return new Promise<void>((resolve, reject) => {
    db.close((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
