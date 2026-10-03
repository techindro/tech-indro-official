/**
 * Tech Indro Official MCP Server
 * Exposes core platform tools to AI assistants via Model Context Protocol (MCP)
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const server = new McpServer({
    name: 'tech-indro-platform',
    version: '1.0.0'
});

// Helper: Read database.json
function getDatabase() {
    const dbPath = path.join(ROOT_DIR, 'database.json');
    if (fs.existsSync(dbPath)) {
        try {
            return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
        } catch (e) {
            return { users: [], submissions: [] };
        }
    }
    return { users: [], submissions: [] };
}

// Helper: Read courses.json
function getCourses() {
    const coursesPath = path.join(ROOT_DIR, 'courses.json');
    if (fs.existsSync(coursesPath)) {
        try {
            return JSON.parse(fs.readFileSync(coursesPath, 'utf8'));
        } catch (e) {
            return [];
        }
    }
    return [];
}

// Tool 1: list_students
server.tool(
    'list_students',
    'List all registered students and their enrolled courses and payments in Tech Indro',
    {
        limit: z.number().optional().describe('Maximum number of students to return (default 20)')
    },
    async ({ limit = 20 }) => {
        const db = getDatabase();
        const users = (db.users || []).slice(0, limit).map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            phone: u.phone,
            enrolledCount: (u.enrolledCourses || []).length,
            enrolledCourses: (u.enrolledCourses || []).map(c => ({
                courseId: c.courseId,
                courseTitle: c.courseTitle,
                paymentId: c.paymentId,
                paymentMethod: c.paymentMethod,
                enrolledAt: c.enrolledAt
            }))
        }));

        return {
            content: [{
                type: 'text',
                text: JSON.stringify({
                    totalStudentsInDb: (db.users || []).length,
                    returnedCount: users.length,
                    students: users
                }, null, 2)
            }]
        };
    }
);

// Tool 2: get_course_catalog
server.tool(
    'get_course_catalog',
    'Retrieve the full Tech Indro courses catalog including IDs, modules, and pricing',
    {
        category: z.string().optional().describe('Optional filter by course topic or keyword')
    },
    async ({ category }) => {
        let courses = getCourses();
        if (category) {
            const cat = category.toLowerCase();
            courses = courses.filter(c => 
                (c.title && c.title.toLowerCase().includes(cat)) ||
                (c.description && c.description.toLowerCase().includes(cat))
            );
        }

        const summary = courses.map(c => ({
            id: c.id,
            title: c.title,
            instructor: c.instructor,
            duration: c.duration,
            modulesCount: (c.modules || []).length,
            perks: c.perks
        }));

        return {
            content: [{
                type: 'text',
                text: JSON.stringify({
                    totalCourses: summary.length,
                    courses: summary
                }, null, 2)
            }]
        };
    }
);

// Tool 3: verify_student_enrollment
server.tool(
    'verify_student_enrollment',
    'Verify if a specific student is enrolled in a course by email or phone',
    {
        emailOrPhone: z.string().describe('Student email or phone number to check'),
        courseId: z.string().optional().describe('Specific course ID to verify (optional)')
    },
    async ({ emailOrPhone, courseId }) => {
        const db = getDatabase();
        const query = emailOrPhone.trim().toLowerCase();
        const user = (db.users || []).find(u => 
            (u.email && u.email.toLowerCase() === query) ||
            (u.phone && u.phone === query)
        );

        if (!user) {
            return {
                content: [{
                    type: 'text',
                    text: JSON.stringify({ found: false, message: `No student found for: ${emailOrPhone}` })
                }]
            };
        }

        const enrolled = user.enrolledCourses || [];
        const isEnrolledInTarget = courseId ? enrolled.some(c => c.courseId === courseId) : enrolled.length > 0;

        return {
            content: [{
                type: 'text',
                text: JSON.stringify({
                    found: true,
                    studentName: user.name,
                    email: user.email,
                    isEnrolled: isEnrolledInTarget,
                    enrolledCourses: enrolled
                }, null, 2)
            }]
        };
    }
);

// Tool 4: check_razorpay_status
server.tool(
    'check_razorpay_status',
    'Check Razorpay payment gateway configuration and key validity',
    {},
    async () => {
        const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_TjBdLNapXFt0Rw';
        const hasSecret = Boolean(process.env.RAZORPAY_KEY_SECRET);

        return {
            content: [{
                type: 'text',
                text: JSON.stringify({
                    gateway: 'Razorpay',
                    keyId: keyId,
                    keyType: keyId.startsWith('rzp_live_') ? 'Production (Live)' : 'Test Mode (Sandbox)',
                    hasSecretConfigured: hasSecret,
                    supportedPaymentMethods: ['UPI (GPay/PhonePe/Paytm)', 'Cards (Visa/Mastercard/RuPay)', 'NetBanking', 'Wallets'],
                    activeCheckoutPages: ['checkout.html', 'course-details.html', 'programs.html', 'dashboard.html']
                }, null, 2)
            }]
        };
    }
);

// Start server on stdio transport
const transport = new StdioServerTransport();
await server.connect(transport);
