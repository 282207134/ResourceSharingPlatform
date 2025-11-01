import Database from 'better-sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';

// 数据库文件路径
const dbPath = path.join(process.cwd(), 'data', 'app.db');

// 创建数据库连接
let db: Database.Database;

export function getDatabase() {
    if (!db) {
        db = new Database(dbPath);
        db.pragma('journal_mode = WAL');
        initializeTables();
    }
    return db;
}

// 初始化数据库表
function initializeTables() {
    const db = getDatabase();
    
    // 创建用户表
    db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            points INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // 创建会话表
    db.exec(`
        CREATE TABLE IF NOT EXISTS sessions (
            id TEXT PRIMARY KEY,
            user_id INTEGER NOT NULL,
            expires_at DATETIME NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
    `);

    // 创建积分历史表
    db.exec(`
        CREATE TABLE IF NOT EXISTS points_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            points_change INTEGER NOT NULL,
            description TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
    `);

    console.log('数据库表初始化完成');
}

// 用户相关数据库操作
export const userDb = {
    // 创建用户
    async createUser(username: string, email: string, password: string) {
        const db = getDatabase();
        const hashedPassword = await bcrypt.hash(password, 10);
        
        try {
            const stmt = db.prepare(`
                INSERT INTO users (username, email, password, points)
                VALUES (?, ?, ?, ?)
            `);
            const result = stmt.run(username, email, hashedPassword, 100); // 新用户赠送100积分
            
            // 记录积分历史
            const pointsStmt = db.prepare(`
                INSERT INTO points_history (user_id, points_change, description)
                VALUES (?, ?, ?)
            `);
            pointsStmt.run(result.lastInsertRowid, 100, '新用户注册奖励');
            
            return { id: result.lastInsertRowid, username, email, points: 100 };
        } catch (error: any) {
            if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
                throw new Error('用户名或邮箱已存在');
            }
            throw error;
        }
    },

    // 通过用户名查找用户
    findByUsername(username: string) {
        const db = getDatabase();
        const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
        return stmt.get(username) as any;
    },

    // 通过邮箱查找用户
    findByEmail(email: string) {
        const db = getDatabase();
        const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
        return stmt.get(email) as any;
    },

    // 通过ID查找用户
    findById(id: number) {
        const db = getDatabase();
        const stmt = db.prepare('SELECT id, username, email, points, created_at FROM users WHERE id = ?');
        return stmt.get(id) as any;
    },

    // 验证密码
    async verifyPassword(password: string, hashedPassword: string) {
        return await bcrypt.compare(password, hashedPassword);
    },

    // 更新用户积分
    updatePoints(userId: number, newPoints: number, description: string) {
        const db = getDatabase();
        const user = this.findById(userId);
        if (!user) throw new Error('用户不存在');
        
        const pointsChange = newPoints - user.points;
        
        db.transaction(() => {
            // 更新用户积分
            const updateStmt = db.prepare('UPDATE users SET points = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
            updateStmt.run(newPoints, userId);
            
            // 记录积分历史
            const historyStmt = db.prepare(`
                INSERT INTO points_history (user_id, points_change, description)
                VALUES (?, ?, ?)
            `);
            historyStmt.run(userId, pointsChange, description);
        })();
    }
};

// 会话相关数据库操作
export const sessionDb = {
    // 创建会话
    createSession(sessionId: string, userId: number, expiresAt: Date) {
        const db = getDatabase();
        const stmt = db.prepare(`
            INSERT INTO sessions (id, user_id, expires_at)
            VALUES (?, ?, ?)
        `);
        stmt.run(sessionId, userId, expiresAt.toISOString());
    },

    // 查找会话
    findSession(sessionId: string) {
        const db = getDatabase();
        const stmt = db.prepare(`
            SELECT s.*, u.id as user_id, u.username, u.email, u.points
            FROM sessions s
            JOIN users u ON s.user_id = u.id
            WHERE s.id = ? AND s.expires_at > datetime('now')
        `);
        return stmt.get(sessionId) as any;
    },

    // 删除会话
    deleteSession(sessionId: string) {
        const db = getDatabase();
        const stmt = db.prepare('DELETE FROM sessions WHERE id = ?');
        stmt.run(sessionId);
    },

    // 清理过期会话
    cleanupExpiredSessions() {
        const db = getDatabase();
        const stmt = db.prepare('DELETE FROM sessions WHERE expires_at <= datetime("now")');
        stmt.run();
    }
};

// 积分历史相关操作
export const pointsHistoryDb = {
    // 获取用户积分历史
    getUserPointsHistory(userId: number, limit: number = 50) {
        const db = getDatabase();
        const stmt = db.prepare(`
            SELECT * FROM points_history
            WHERE user_id = ?
            ORDER BY created_at DESC
            LIMIT ?
        `);
        return stmt.all(userId, limit) as any[];
    }
};