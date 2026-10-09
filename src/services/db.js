const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const isVercel = process.env.VERCEL === '1' || process.env.VERCEL;
const JSON_DB_FILE = isVercel ? path.join('/tmp', 'database.json') : path.join(__dirname, '../../database.json');

// Check for Postgres connection string (Supabase / Neon / AWS / Railway)
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.SUPABASE_DB_URL;

let pool = null;
let isPostgresAvailable = false;

if (connectionString) {
    try {
        pool = new Pool({
            connectionString,
            ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false },
            max: 10,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 5000,
        });

        // Test connection
        pool.query('SELECT NOW()')
            .then(async () => {
                isPostgresAvailable = true;
                console.log('[PostgreSQL] Connected successfully to Cloud Database.');
                await initializeTables();
            })
            .catch(err => {
                console.warn('[PostgreSQL] Connection failed, falling back to local storage:', err.message);
                isPostgresAvailable = false;
            });
    } catch (e) {
        console.warn('[PostgreSQL] Initialization error:', e.message);
    }
} else {
    console.log('[Database] DATABASE_URL not set in .env. Operating in JSON compatibility mode.');
}

/**
 * Initializes SQL schema for Tech Indro platform
 */
async function initializeTables() {
    if (!pool) return;
    const client = await pool.connect();
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id VARCHAR(100) PRIMARY KEY,
                name VARCHAR(255),
                email VARCHAR(255) UNIQUE,
                phone VARCHAR(50),
                password VARCHAR(255),
                role VARCHAR(50) DEFAULT 'student',
                goal VARCHAR(255),
                academic_level VARCHAR(255),
                state VARCHAR(100),
                referral_code VARCHAR(100),
                provider VARCHAR(50),
                enrolled_courses JSONB DEFAULT '[]'::jsonb,
                two_factor_enabled BOOLEAN DEFAULT FALSE,
                two_factor_secret VARCHAR(255),
                created_at TIMESTAMPTZ DEFAULT NOW(),
                updated_at TIMESTAMPTZ DEFAULT NOW()
            );

            -- Ensure columns exist in case table was created earlier
            ALTER TABLE users ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT FALSE;
            ALTER TABLE users ADD COLUMN IF NOT EXISTS two_factor_secret VARCHAR(255);

            CREATE TABLE IF NOT EXISTS certificates (
                id VARCHAR(100) PRIMARY KEY,
                cert_id VARCHAR(100) UNIQUE NOT NULL,
                student_name VARCHAR(255) NOT NULL,
                course_name VARCHAR(255) NOT NULL,
                issue_date VARCHAR(100),
                score VARCHAR(50),
                qr_data TEXT,
                metadata JSONB DEFAULT '{}'::jsonb,
                created_at TIMESTAMPTZ DEFAULT NOW()
            );

            CREATE TABLE IF NOT EXISTS jobs (
                id VARCHAR(100) PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                company VARCHAR(255) NOT NULL,
                location VARCHAR(255),
                url TEXT,
                salary VARCHAR(100),
                tags JSONB DEFAULT '[]'::jsonb,
                created_at TIMESTAMPTZ DEFAULT NOW()
            );

            CREATE TABLE IF NOT EXISTS contacts (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255),
                email VARCHAR(255),
                phone VARCHAR(50),
                subject VARCHAR(255),
                message TEXT,
                created_at TIMESTAMPTZ DEFAULT NOW()
            );

            CREATE TABLE IF NOT EXISTS mock_interviews (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(100),
                user_name VARCHAR(255),
                role VARCHAR(100),
                topic VARCHAR(100),
                overall_score NUMERIC(5,2),
                transcript JSONB DEFAULT '[]'::jsonb,
                feedback TEXT,
                created_at TIMESTAMPTZ DEFAULT NOW()
            );

            CREATE TABLE IF NOT EXISTS site_analytics (
                key VARCHAR(100) PRIMARY KEY,
                value BIGINT DEFAULT 0,
                updated_at TIMESTAMPTZ DEFAULT NOW()
            );

            -- Indexes for fast queries
            CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
            CREATE INDEX IF NOT EXISTS idx_certificates_cert_id ON certificates(cert_id);
            CREATE INDEX IF NOT EXISTS idx_mock_interviews_user ON mock_interviews(user_id);
        `);
        console.log('[PostgreSQL] Database tables & indexes verified/initialized.');
    } catch (err) {
        console.error('[PostgreSQL] Schema initialization error:', err.message);
    } finally {
        client.release();
    }
}

// Fallback JSON Helpers
function readJsonDB() {
    try {
        if (!fs.existsSync(JSON_DB_FILE)) {
            return { users: [], contacts: [], analytics: { totalVisits: 0 }, jobs: [], certificates: [] };
        }
        return JSON.parse(fs.readFileSync(JSON_DB_FILE, 'utf8'));
    } catch (e) {
        return { users: [], contacts: [], analytics: { totalVisits: 0 }, jobs: [], certificates: [] };
    }
}

function writeJsonDB(data) {
    try {
        fs.writeFileSync(JSON_DB_FILE, JSON.stringify(data, null, 2));
    } catch (e) {
        console.error('[JSON DB] Write error:', e.message);
    }
}

// --- Data Access Methods (Async & Universal) ---

const dbService = {
    isPostgres: () => isPostgresAvailable,
    pool: () => pool,

    // USER OPERATIONS
    async findUserByEmail(email) {
        if (!email) return null;
        if (isPostgresAvailable && pool) {
            try {
                const res = await pool.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1', [email]);
                if (res.rows.length > 0) {
                    const row = res.rows[0];
                    return {
                        id: row.id,
                        name: row.name,
                        email: row.email,
                        phone: row.phone,
                        password: row.password,
                        role: row.role,
                        goal: row.goal,
                        academicLevel: row.academic_level,
                        state: row.state,
                        referralCode: row.referral_code,
                        provider: row.provider,
                        enrolledCourses: row.enrolled_courses || [],
                        twoFactorEnabled: !!row.two_factor_enabled,
                        twoFactorSecret: row.two_factor_secret || null,
                        createdAt: row.created_at
                    };
                }
                return null;
            } catch (err) {
                console.error('[PostgreSQL] findUserByEmail error:', err.message);
            }
        }
        // Fallback to JSON
        const db = readJsonDB();
        return (db.users || []).find(u => u.email && u.email.toLowerCase() === email.toLowerCase()) || null;
    },

    async findUserById(id) {
        if (!id) return null;
        if (isPostgresAvailable && pool) {
            try {
                const res = await pool.query('SELECT * FROM users WHERE id = $1 LIMIT 1', [id]);
                if (res.rows.length > 0) {
                    const row = res.rows[0];
                    return {
                        id: row.id,
                        name: row.name,
                        email: row.email,
                        phone: row.phone,
                        password: row.password,
                        role: row.role,
                        goal: row.goal,
                        academicLevel: row.academic_level,
                        state: row.state,
                        referralCode: row.referral_code,
                        provider: row.provider,
                        enrolledCourses: row.enrolled_courses || [],
                        twoFactorEnabled: !!row.two_factor_enabled,
                        twoFactorSecret: row.two_factor_secret || null,
                        createdAt: row.created_at
                    };
                }
                return null;
            } catch (err) {
                console.error('[PostgreSQL] findUserById error:', err.message);
            }
        }
        const db = readJsonDB();
        return (db.users || []).find(u => String(u.id) === String(id)) || null;
    },

    async updateUser2FA(userId, enabled, secret) {
        if (!userId) return false;
        if (isPostgresAvailable && pool) {
            try {
                await pool.query(
                    'UPDATE users SET two_factor_enabled = $1, two_factor_secret = $2, updated_at = NOW() WHERE id = $3',
                    [enabled, secret, userId]
                );
                return true;
            } catch (err) {
                console.error('[PostgreSQL] updateUser2FA error:', err.message);
            }
        }
        const db = readJsonDB();
        const user = (db.users || []).find(u => String(u.id) === String(userId));
        if (user) {
            user.twoFactorEnabled = enabled;
            user.twoFactorSecret = secret;
            writeJsonDB(db);
            return true;
        }
        return false;
    },

    async createUser(user) {
        const id = user.id || Date.now().toString();
        const userObj = { ...user, id, enrolledCourses: user.enrolledCourses || [] };

        if (isPostgresAvailable && pool) {
            try {
                await pool.query(
                    `INSERT INTO users (id, name, email, phone, password, role, goal, academic_level, state, referral_code, provider, enrolled_courses)
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
                     ON CONFLICT (id) DO UPDATE SET
                        name = EXCLUDED.name,
                        phone = EXCLUDED.phone,
                        role = EXCLUDED.role,
                        enrolled_courses = EXCLUDED.enrolled_courses,
                        updated_at = NOW()`,
                    [
                        userObj.id,
                        userObj.name || '',
                        userObj.email || '',
                        userObj.phone || '',
                        userObj.password || '',
                        userObj.role || 'student',
                        userObj.goal || '',
                        userObj.academicLevel || '',
                        userObj.state || '',
                        userObj.referralCode || '',
                        userObj.provider || 'local',
                        JSON.stringify(userObj.enrolledCourses)
                    ]
                );
                return userObj;
            } catch (err) {
                console.error('[PostgreSQL] createUser error:', err.message);
            }
        }

        // Fallback to JSON
        const db = readJsonDB();
        if (!db.users) db.users = [];
        const existingIdx = db.users.findIndex(u => (userObj.email && u.email === userObj.email) || u.id === userObj.id);
        if (existingIdx !== -1) {
            db.users[existingIdx] = { ...db.users[existingIdx], ...userObj };
        } else {
            db.users.push(userObj);
        }
        writeJsonDB(db);
        return userObj;
    },

    async updateUserCourses(userId, courseData) {
        if (isPostgresAvailable && pool) {
            try {
                const userRes = await pool.query('SELECT enrolled_courses FROM users WHERE id = $1', [userId]);
                if (userRes.rows.length > 0) {
                    let courses = userRes.rows[0].enrolled_courses || [];
                    if (!courses.some(c => c.courseId === courseData.courseId)) {
                        courses.push(courseData);
                        await pool.query('UPDATE users SET enrolled_courses = $1, updated_at = NOW() WHERE id = $2', [JSON.stringify(courses), userId]);
                    }
                    return true;
                }
            } catch (err) {
                console.error('[PostgreSQL] updateUserCourses error:', err.message);
            }
        }

        const db = readJsonDB();
        const user = (db.users || []).find(u => String(u.id) === String(userId));
        if (user) {
            if (!user.enrolledCourses) user.enrolledCourses = [];
            if (!user.enrolledCourses.some(c => c.courseId === courseData.courseId)) {
                user.enrolledCourses.push(courseData);
                writeJsonDB(db);
            }
            return true;
        }
        return false;
    },

    // CERTIFICATES
    async findCertificate(certId) {
        if (!certId) return null;
        if (isPostgresAvailable && pool) {
            try {
                const res = await pool.query('SELECT * FROM certificates WHERE LOWER(cert_id) = LOWER($1) LIMIT 1', [certId]);
                if (res.rows.length > 0) {
                    const row = res.rows[0];
                    return {
                        id: row.id,
                        certId: row.cert_id,
                        studentName: row.student_name,
                        courseName: row.course_name,
                        issueDate: row.issue_date,
                        score: row.score,
                        qrData: row.qr_data,
                        metadata: row.metadata,
                        createdAt: row.created_at
                    };
                }
                return null;
            } catch (err) {
                console.error('[PostgreSQL] findCertificate error:', err.message);
            }
        }

        const db = readJsonDB();
        return (db.certificates || []).find(c => (c.certId && c.certId.toLowerCase() === certId.toLowerCase()) || (c.id && c.id.toLowerCase() === certId.toLowerCase())) || null;
    },

    async saveCertificate(cert) {
        const id = cert.id || `cert_${Date.now()}`;
        const certObj = { ...cert, id };

        if (isPostgresAvailable && pool) {
            try {
                await pool.query(
                    `INSERT INTO certificates (id, cert_id, student_name, course_name, issue_date, score, qr_data, metadata)
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                     ON CONFLICT (cert_id) DO UPDATE SET
                        student_name = EXCLUDED.student_name,
                        score = EXCLUDED.score,
                        metadata = EXCLUDED.metadata`,
                    [
                        certObj.id,
                        certObj.certId,
                        certObj.studentName,
                        certObj.courseName,
                        certObj.issueDate || new Date().toISOString().split('T')[0],
                        certObj.score || '100%',
                        certObj.qrData || '',
                        JSON.stringify(certObj.metadata || {})
                    ]
                );
                return certObj;
            } catch (err) {
                console.error('[PostgreSQL] saveCertificate error:', err.message);
            }
        }

        const db = readJsonDB();
        if (!db.certificates) db.certificates = [];
        db.certificates.push(certObj);
        writeJsonDB(db);
        return certObj;
    },

    // ANALYTICS & VISITS
    async incrementVisits(count = 1) {
        if (isPostgresAvailable && pool) {
            try {
                const res = await pool.query(`
                    INSERT INTO site_analytics (key, value, updated_at)
                    VALUES ('totalVisits', $1, NOW())
                    ON CONFLICT (key) DO UPDATE SET
                        value = site_analytics.value + $1,
                        updated_at = NOW()
                    RETURNING value;
                `, [count]);
                return Number(res.rows[0]?.value || 0);
            } catch (err) {
                console.error('[PostgreSQL] incrementVisits error:', err.message);
            }
        }

        const db = readJsonDB();
        if (!db.analytics) db.analytics = { totalVisits: 0 };
        db.analytics.totalVisits = (db.analytics.totalVisits || 0) + count;
        writeJsonDB(db);
        return db.analytics.totalVisits;
    },

    async getTotalVisits() {
        if (isPostgresAvailable && pool) {
            try {
                const res = await pool.query("SELECT value FROM site_analytics WHERE key = 'totalVisits'");
                if (res.rows.length > 0) {
                    return Number(res.rows[0].value);
                }
            } catch (err) {
                console.error('[PostgreSQL] getTotalVisits error:', err.message);
            }
        }
        const db = readJsonDB();
        return db.analytics?.totalVisits || 0;
    },

    // RAW PASSTHROUGH / COMPATIBILITY
    readDB: readJsonDB,
    writeDB: writeJsonDB
};

module.exports = dbService;
