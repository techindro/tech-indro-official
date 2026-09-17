/**
 * Tech Indro Platform - Redis Client Service
 * High-performance distributed caching, atomic rate limiting, and Pub/Sub
 */

const Redis = require('ioredis');

class RedisService {
    constructor() {
        this.client = null;
        this.isConnected = false;
        this.inMemoryCache = new Map();

        this.init();
    }

    init() {
        const redisUrl = process.env.REDIS_URL || `redis://${process.env.REDIS_HOST || '127.0.0.1'}:${process.env.REDIS_PORT || 6379}`;
        const options = {
            maxRetriesPerRequest: 1,
            enableReadyCheck: true,
            lazyConnect: true,
            connectTimeout: 5000,
            retryStrategy: (times) => {
                const delay = Math.min(times * 1000, 10000);
                return delay;
            }
        };

        if (process.env.REDIS_PASSWORD) {
            options.password = process.env.REDIS_PASSWORD;
        }

        try {
            this.client = new Redis(redisUrl, options);

            this.client.on('connect', () => {
                console.log('⚡ [Redis] Connecting to Redis...');
            });

            this.client.on('ready', () => {
                this.isConnected = true;
                console.log('✅ [Redis] Connection ready & active on ' + redisUrl);
            });

            this.client.on('error', (err) => {
                this.isConnected = false;
                console.warn('⚠️ [Redis] Client error (using in-memory fallback):', err.message);
            });

            this.client.on('close', () => {
                this.isConnected = false;
            });

            // Attempt initial connection asynchronously
            this.client.connect().catch((err) => {
                this.isConnected = false;
                console.warn('⚠️ [Redis] Initial connection deferred (will retry):', err.message);
            });
        } catch (err) {
            this.isConnected = false;
            console.warn('⚠️ [Redis] Initialization failed, operating in fallback mode:', err.message);
        }
    }

    isReady() {
        return this.isConnected && this.client && this.client.status === 'ready';
    }

    /**
     * Get cached value by key
     */
    async get(key) {
        if (this.isReady()) {
            try {
                const val = await this.client.get(key);
                if (val !== null) {
                    try {
                        return JSON.parse(val);
                    } catch {
                        return val;
                    }
                }
                return null;
            } catch (err) {
                console.warn(`[Redis] Get failed for ${key}:`, err.message);
            }
        }

        // Fallback to in-memory cache
        const item = this.inMemoryCache.get(key);
        if (item) {
            if (Date.now() < item.expiresAt) {
                return item.value;
            }
            this.inMemoryCache.delete(key);
        }
        return null;
    }

    /**
     * Set cache key with optional TTL (seconds)
     */
    async set(key, value, ttlSeconds = 300) {
        const serialized = typeof value === 'object' ? JSON.stringify(value) : String(value);

        if (this.isReady()) {
            try {
                if (ttlSeconds > 0) {
                    await this.client.set(key, serialized, 'EX', ttlSeconds);
                } else {
                    await this.client.set(key, serialized);
                }
                return true;
            } catch (err) {
                console.warn(`[Redis] Set failed for ${key}:`, err.message);
            }
        }

        // Fallback in-memory
        this.inMemoryCache.set(key, {
            value,
            expiresAt: ttlSeconds > 0 ? Date.now() + (ttlSeconds * 1000) : Infinity
        });
        return true;
    }

    /**
     * Delete key from cache
     */
    async del(key) {
        this.inMemoryCache.delete(key);
        if (this.isReady()) {
            try {
                await this.client.del(key);
                return true;
            } catch (err) {
                console.warn(`[Redis] Del failed for ${key}:`, err.message);
            }
        }
        return true;
    }

    /**
     * Distributed Atomic Sliding-Window Rate Limiter
     * Returns: { allowed: boolean, remaining: number, resetTimeSec: number }
     */
    async checkRateLimit(ip, category, limit, windowSeconds) {
        const key = `ratelimit:${category}:${ip}`;
        const now = Date.now();
        const clearBefore = now - (windowSeconds * 1000);

        if (this.isReady()) {
            try {
                const multi = this.client.multi();
                multi.zremrangebyscore(key, 0, clearBefore);
                multi.zadd(key, now, `${now}-${Math.random()}`);
                multi.zcard(key);
                multi.expire(key, windowSeconds);

                const results = await multi.exec();
                const count = results[2][1];

                const allowed = count <= limit;
                const remaining = Math.max(0, limit - count);
                const resetTimeSec = windowSeconds;

                return { allowed, remaining, resetTimeSec };
            } catch (err) {
                console.warn('[Redis] RateLimit check fallback:', err.message);
            }
        }

        // Local In-Memory Fallback
        const memKey = `${category}:${ip}`;
        let record = this.inMemoryCache.get(memKey);
        if (!record || now > record.resetTime) {
            record = { count: 1, resetTime: now + (windowSeconds * 1000) };
            this.inMemoryCache.set(memKey, record);
            return { allowed: true, remaining: limit - 1, resetTimeSec: windowSeconds };
        }

        record.count += 1;
        const allowed = record.count <= limit;
        const remaining = Math.max(0, limit - record.count);
        const resetTimeSec = Math.max(1, Math.ceil((record.resetTime - now) / 1000));

        return { allowed, remaining, resetTimeSec };
    }

    /**
     * Publish a message to a Redis Pub/Sub channel
     */
    async publish(channel, message) {
        const payload = typeof message === 'object' ? JSON.stringify(message) : String(message);
        if (this.isReady()) {
            try {
                return await this.client.publish(channel, payload);
            } catch (err) {
                console.warn(`[Redis] Publish failed on ${channel}:`, err.message);
            }
        }
        return 0;
    }

    /**
     * Health check diagnostic
     */
    async healthCheck() {
        if (!this.isReady()) {
            return {
                status: 'degraded',
                connected: false,
                mode: 'in-memory-fallback',
                cachedKeysInMemory: this.inMemoryCache.size
            };
        }

        const start = Date.now();
        try {
            const pong = await this.client.ping();
            const latencyMs = Date.now() - start;
            const info = await this.client.info('memory');
            const usedMemoryMatch = info.match(/used_memory_human:([^\r\n]+)/);

            return {
                status: 'healthy',
                connected: true,
                ping: pong,
                latencyMs,
                usedMemory: usedMemoryMatch ? usedMemoryMatch[1].trim() : 'unknown',
                mode: 'redis-native'
            };
        } catch (err) {
            return {
                status: 'error',
                connected: false,
                error: err.message,
                mode: 'in-memory-fallback'
            };
        }
    }
}

module.exports = new RedisService();
