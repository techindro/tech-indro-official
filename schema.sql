-- =========================================================
-- Tech Indro Enterprise PostgreSQL Schema (YC Standard)
-- Target: Supabase / Neon / AWS RDS / Local Postgres
-- =========================================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    password VARCHAR(255),
    role VARCHAR(50) DEFAULT 'student',
    goal VARCHAR(255),
    academic_level VARCHAR(255),
    state VARCHAR(100),
    referral_code VARCHAR(100),
    provider VARCHAR(50) DEFAULT 'local',
    enrolled_courses JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. VERIFIED CERTIFICATES TABLE
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

-- 3. JOBS / INTERNSHIPS AGGREGATOR
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

-- 4. CONTACTS / LEADS
CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    subject VARCHAR(255),
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. MOCK INTERVIEWS & EVALUATIONS (AI SHIKSHAK)
CREATE TABLE IF NOT EXISTS mock_interviews (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(100) REFERENCES users(id) ON DELETE SET NULL,
    user_name VARCHAR(255),
    role VARCHAR(100),
    topic VARCHAR(100),
    overall_score NUMERIC(5,2),
    transcript JSONB DEFAULT '[]'::jsonb,
    feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SITE ANALYTICS & METRICS
CREATE TABLE IF NOT EXISTS site_analytics (
    key VARCHAR(100) PRIMARY KEY,
    value BIGINT DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR ULTRA-FAST QUERIES
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_certificates_cert_id ON certificates(cert_id);
CREATE INDEX IF NOT EXISTS idx_mock_interviews_user ON mock_interviews(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_created ON jobs(created_at DESC);
