require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!connectionString) {
    console.error('❌ Error: DATABASE_URL is missing in .env!');
    console.log('👉 Please set DATABASE_URL=postgresql://user:pass@host:5432/dbname in .env and run again.');
    process.exit(1);
}

const pool = new Pool({
    connectionString,
    ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false }
});

const DB_FILE = path.join(__dirname, '../database.json');

async function runMigration() {
    console.log('🚀 Starting Migration: database.json -> PostgreSQL...');

    if (!fs.existsSync(DB_FILE)) {
        console.error('❌ Error: database.json file not found at:', DB_FILE);
        process.exit(1);
    }

    const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Create Tables
        const schemaSql = fs.readFileSync(path.join(__dirname, '../schema.sql'), 'utf8');
        await client.query(schemaSql);
        console.log('✅ Schema tables verified/created successfully.');

        // 2. Migrate Users
        const users = data.users || [];
        console.log(`⏳ Migrating ${users.length} users...`);
        for (const u of users) {
            await client.query(`
                INSERT INTO users (id, name, email, phone, password, role, goal, academic_level, state, referral_code, provider, enrolled_courses)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
                ON CONFLICT (id) DO UPDATE SET
                    name = EXCLUDED.name,
                    phone = EXCLUDED.phone,
                    role = EXCLUDED.role,
                    enrolled_courses = EXCLUDED.enrolled_courses,
                    updated_at = NOW();
            `, [
                String(u.id),
                u.name || '',
                u.email || `${u.id}@placeholder.com`,
                u.phone || '',
                u.password || '',
                u.role || 'student',
                u.goal || '',
                u.academicLevel || '',
                u.state || '',
                u.referralCode || '',
                u.provider || 'local',
                JSON.stringify(u.enrolledCourses || [])
            ]);
        }
        console.log(`✅ Successfully migrated ${users.length} users.`);

        // 3. Migrate Certificates
        const certificates = data.certificates || [];
        console.log(`⏳ Migrating ${certificates.length} certificates...`);
        for (const c of certificates) {
            await client.query(`
                INSERT INTO certificates (id, cert_id, student_name, course_name, issue_date, score, qr_data, metadata)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                ON CONFLICT (cert_id) DO UPDATE SET
                    student_name = EXCLUDED.student_name,
                    score = EXCLUDED.score,
                    metadata = EXCLUDED.metadata;
            `, [
                String(c.id || c.certId),
                c.certId || String(c.id),
                c.studentName || 'Student',
                c.courseName || 'Course',
                c.issueDate || '',
                c.score || '100%',
                c.qrData || '',
                JSON.stringify(c.metadata || {})
            ]);
        }
        console.log(`✅ Successfully migrated ${certificates.length} certificates.`);

        // 4. Migrate Jobs
        const jobs = data.jobs || [];
        console.log(`⏳ Migrating ${jobs.length} jobs...`);
        for (const j of jobs) {
            await client.query(`
                INSERT INTO jobs (id, title, company, location, url, salary, tags)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                ON CONFLICT (id) DO NOTHING;
            `, [
                String(j.id || Date.now() + Math.random()),
                j.title || 'Tech Role',
                j.company || 'Tech Company',
                j.location || 'Remote',
                j.url || '',
                j.salary || '',
                JSON.stringify(j.tags || [])
            ]);
        }
        console.log(`✅ Successfully migrated ${jobs.length} jobs.`);

        // 5. Migrate Analytics
        const totalVisits = data.analytics?.totalVisits || 0;
        await client.query(`
            INSERT INTO site_analytics (key, value, updated_at)
            VALUES ('totalVisits', $1, NOW())
            ON CONFLICT (key) DO UPDATE SET value = $1;
        `, [totalVisits]);
        console.log(`✅ Site analytics migrated: ${totalVisits} total visits.`);

        await client.query('COMMIT');
        console.log('🎉 Full Migration to PostgreSQL completed with 100% success!');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('❌ Migration failed, rolled back changes:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

runMigration();
