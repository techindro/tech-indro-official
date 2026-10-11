const mongoose = require('mongoose');

// MongoDB Connection String from environment or fallback
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/techindro';

let isConnected = false;
let connectionAttempts = 0;
const MAX_RETRY_ATTEMPTS = 3;

// --- Mongoose Schemas & Models ---

// 1. User Schema
const UserSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, sparse: true, index: true },
    phone: { type: String },
    password: { type: String },
    role: { type: String, default: 'student' },
    goal: { type: String },
    academicLevel: { type: String },
    state: { type: String },
    referralCode: { type: String },
    provider: { type: String },
    enrolledCourses: { type: Array, default: [] },
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// 2. Inspiro Feed Post Schema
const InspiroPostSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true, index: true },
    authorId: { type: String, index: true },
    author: {
        name: { type: String, required: true },
        avatar: { type: String },
        role: { type: String },
        college: { type: String },
        peerId: { type: String },
        isMe: { type: Boolean, default: false }
    },
    title: { type: String, required: true },
    content: { type: String, required: true },
    codeSnippet: { type: String, default: '' },
    tags: [{ type: String }],
    likes: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    comments: [{
        id: String,
        author: String,
        avatar: String,
        text: String,
        timestamp: String,
        createdAt: { type: Date, default: Date.now }
    }],
    timestamp: { type: String, default: 'Just now' },
    createdAt: { type: Date, default: Date.now, index: true }
}, { timestamps: true });

// 3. Inspiro Direct / Peer Message Schema
const InspiroMessageSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true, index: true },
    senderId: { type: String, required: true, index: true },
    receiverId: { type: String, required: true, index: true },
    text: { type: String, required: true },
    isVoice: { type: Boolean, default: false },
    duration: { type: Number, default: 0 },
    timestamp: { type: String },
    statusTick: { type: String, default: 'delivered' },
    createdAt: { type: Date, default: Date.now, index: true }
}, { timestamps: true });

// 4. Inspiro Student Profile Schema
const InspiroProfileSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    role: { type: String, default: 'Student Developer' },
    college: { type: String, default: 'Tech Indro Academy' },
    program: { type: String, default: 'Forward Deployed Engineer (FDE)' },
    avatar: { type: String },
    bio: { type: String },
    skills: [{ type: String }],
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    statusBadge: { type: String, default: 'Available for Collaboration' },
    contributions: { type: Number, default: 380 },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// 5. Contact Inquiries Schema
const ContactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    subject: { type: String },
    message: { type: String },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// 6. Certificate Schema
const CertificateSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    certId: { type: String, required: true, unique: true, index: true },
    studentName: { type: String, required: true },
    courseName: { type: String, required: true },
    issueDate: { type: String },
    score: { type: String },
    qrData: { type: String },
    metadata: { type: Object, default: {} },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Models
const User = mongoose.models.User || mongoose.model('User', UserSchema);
const InspiroPost = mongoose.models.InspiroPost || mongoose.model('InspiroPost', InspiroPostSchema);
const InspiroMessage = mongoose.models.InspiroMessage || mongoose.model('InspiroMessage', InspiroMessageSchema);
const InspiroProfile = mongoose.models.InspiroProfile || mongoose.model('InspiroProfile', InspiroProfileSchema);
const Contact = mongoose.models.Contact || mongoose.model('Contact', ContactSchema);
const Certificate = mongoose.models.Certificate || mongoose.model('Certificate', CertificateSchema);

// Connection Manager
async function connectMongo() {
    if (isConnected) return mongoose.connection;

    try {
        mongoose.set('strictQuery', false);
        
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 4000,
            connectTimeoutMS: 5000,
        });

        isConnected = true;
        console.log(`[MongoDB] Connected successfully to Database (${MONGODB_URI.replace(/:\/\/.*@/, '://<credentials>@')})`);
        
        return mongoose.connection;
    } catch (err) {
        isConnected = false;
        connectionAttempts++;
        if (connectionAttempts <= MAX_RETRY_ATTEMPTS) {
            console.warn(`[MongoDB] Connection attempt ${connectionAttempts} failed (${err.message}). Fallback layer active.`);
        }
        return null;
    }
}

// Event listeners
mongoose.connection.on('connected', () => {
    isConnected = true;
});

mongoose.connection.on('error', (err) => {
    console.warn('[MongoDB] Runtime error:', err.message);
    isConnected = false;
});

mongoose.connection.on('disconnected', () => {
    isConnected = false;
});

// Helper CRUD Services
const mongoService = {
    connect: connectMongo,
    isConnected: () => isConnected && mongoose.connection.readyState === 1,
    connectionState: () => mongoose.connection.readyState, // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    models: {
        User,
        InspiroPost,
        InspiroMessage,
        InspiroProfile,
        Contact,
        Certificate
    },

    // --- Inspiro Operations ---
    async getInspiroPosts(limit = 50) {
        if (!this.isConnected()) return null;
        try {
            return await InspiroPost.find().sort({ createdAt: -1 }).limit(limit).lean();
        } catch (e) {
            console.warn('[MongoDB] getInspiroPosts error:', e.message);
            return null;
        }
    },

    async saveInspiroPost(postData) {
        if (!this.isConnected()) return null;
        try {
            const post = new InspiroPost(postData);
            return await post.save();
        } catch (e) {
            console.warn('[MongoDB] saveInspiroPost error:', e.message);
            return null;
        }
    },

    async deleteInspiroPost(postId) {
        if (!this.isConnected()) return false;
        try {
            const res = await InspiroPost.deleteOne({ id: postId });
            return res.deletedCount > 0;
        } catch (e) {
            console.warn('[MongoDB] deleteInspiroPost error:', e.message);
            return false;
        }
    },

    async likeInspiroPost(postId) {
        if (!this.isConnected()) return null;
        try {
            return await InspiroPost.findOneAndUpdate(
                { id: postId },
                { $inc: { likes: 1 } },
                { new: true }
            ).lean();
        } catch (e) {
            console.warn('[MongoDB] likeInspiroPost error:', e.message);
            return null;
        }
    },

    async addInspiroComment(postId, commentData) {
        if (!this.isConnected()) return null;
        try {
            return await InspiroPost.findOneAndUpdate(
                { id: postId },
                { 
                    $push: { comments: commentData },
                    $inc: { commentsCount: 1 }
                },
                { new: true }
            ).lean();
        } catch (e) {
            console.warn('[MongoDB] addInspiroComment error:', e.message);
            return null;
        }
    },

    async getInspiroMessages(peerId, myId = 'me', limit = 100) {
        if (!this.isConnected()) return null;
        try {
            return await InspiroMessage.find({
                $or: [
                    { senderId: myId, receiverId: peerId },
                    { senderId: peerId, receiverId: myId }
                ]
            }).sort({ createdAt: 1 }).limit(limit).lean();
        } catch (e) {
            console.warn('[MongoDB] getInspiroMessages error:', e.message);
            return null;
        }
    },

    async saveInspiroMessage(messageData) {
        if (!this.isConnected()) return null;
        try {
            const msg = new InspiroMessage(messageData);
            return await msg.save();
        } catch (e) {
            console.warn('[MongoDB] saveInspiroMessage error:', e.message);
            return null;
        }
    },

    async getInspiroProfile(userId = 'me') {
        if (!this.isConnected()) return null;
        try {
            return await InspiroProfile.findOne({ userId }).lean();
        } catch (e) {
            console.warn('[MongoDB] getInspiroProfile error:', e.message);
            return null;
        }
    },

    async saveInspiroProfile(profileData) {
        if (!this.isConnected()) return null;
        try {
            const userId = profileData.userId || 'me';
            return await InspiroProfile.findOneAndUpdate(
                { userId },
                { ...profileData, updatedAt: new Date() },
                { upsert: true, new: true }
            ).lean();
        } catch (e) {
            console.warn('[MongoDB] saveInspiroProfile error:', e.message);
            return null;
        }
    },

    // --- User Operations ---
    async findUserByEmail(email) {
        if (!this.isConnected() || !email) return null;
        try {
            return await User.findOne({ email: new RegExp(`^${email}$`, 'i') }).lean();
        } catch (e) {
            console.warn('[MongoDB] findUserByEmail error:', e.message);
            return null;
        }
    },

    async findUserById(id) {
        if (!this.isConnected() || !id) return null;
        try {
            return await User.findOne({ id: String(id) }).lean();
        } catch (e) {
            console.warn('[MongoDB] findUserById error:', e.message);
            return null;
        }
    },

    async saveUser(userData) {
        if (!this.isConnected()) return null;
        try {
            return await User.findOneAndUpdate(
                { id: String(userData.id) },
                { ...userData, updatedAt: new Date() },
                { upsert: true, new: true }
            ).lean();
        } catch (e) {
            console.warn('[MongoDB] saveUser error:', e.message);
            return null;
        }
    },

    // --- Seeding & Syncing Helpers ---
    async seedDefaultInspiroPosts(initialPosts = []) {
        if (!this.isConnected() || !initialPosts.length) return;
        try {
            const count = await InspiroPost.countDocuments();
            if (count === 0) {
                await InspiroPost.insertMany(initialPosts);
                console.log(`[MongoDB] Initialized Inspiro feed with ${initialPosts.length} default community posts.`);
            }
        } catch (e) {
            console.warn('[MongoDB] seedDefaultInspiroPosts error:', e.message);
        }
    },

    async syncUsersFromJson(usersList = []) {
        if (!this.isConnected() || !usersList.length) return;
        try {
            const count = await User.countDocuments();
            if (count === 0) {
                const cleanUsers = usersList.map(u => ({
                    id: String(u.id),
                    name: u.name,
                    email: u.email,
                    phone: u.phone,
                    password: u.password,
                    role: u.role || 'student',
                    goal: u.goal,
                    academicLevel: u.academicLevel,
                    state: u.state,
                    referralCode: u.referralCode,
                    provider: u.provider || 'local',
                    enrolledCourses: u.enrolledCourses || [],
                    twoFactorEnabled: !!u.twoFactorEnabled,
                    twoFactorSecret: u.twoFactorSecret || null,
                    createdAt: u.createdAt ? new Date(u.createdAt) : new Date()
                }));
                await User.insertMany(cleanUsers, { ordered: false });
                console.log(`[MongoDB] Synchronized ${cleanUsers.length} users into MongoDB.`);
            }
        } catch (e) {
            console.warn('[MongoDB] syncUsersFromJson notice:', e.message);
        }
    }
};

module.exports = mongoService;
