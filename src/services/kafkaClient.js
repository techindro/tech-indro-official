/**
 * Tech Indro Platform - Apache Kafka Client Service
 * High-throughput distributed event streaming, messaging queues, and async worker processing
 */

const { Kafka, logLevel } = require('kafkajs');

class KafkaService {
    constructor() {
        this.kafka = null;
        this.producer = null;
        this.consumer = null;
        this.isConnected = false;
        this.isConsumerRunning = false;
        this.eventBuffer = []; // Local queue when Kafka is temporarily unreachable
        this.handlers = new Map();

        this.init();
    }

    init() {
        const brokersStr = process.env.KAFKA_BROKERS || 'localhost:9092';
        const brokers = brokersStr.split(',').map(b => b.trim()).filter(Boolean);
        const clientId = process.env.KAFKA_CLIENT_ID || 'tech-indro-api';

        const kafkaConfig = {
            clientId,
            brokers,
            logLevel: logLevel.NOTHING,
            connectionTimeout: 4000,
            retry: {
                initialRetryTime: 300,
                retries: 2
            }
        };

        // SASL / SSL support for Cloud Kafka (Upstash, Confluent, Aiven, Redpanda)
        if (process.env.KAFKA_SASL_USERNAME && process.env.KAFKA_SASL_PASSWORD) {
            kafkaConfig.ssl = true;
            kafkaConfig.sasl = {
                mechanism: process.env.KAFKA_SASL_MECHANISM || 'plain',
                username: process.env.KAFKA_SASL_USERNAME,
                password: process.env.KAFKA_SASL_PASSWORD
            };
        }

        try {
            this.kafka = new Kafka(kafkaConfig);
            this.producer = this.kafka.producer({
                allowAutoTopicCreation: true,
                transactionTimeout: 30000
            });

            // Connect producer asynchronously with graceful fallback
            this.producer.connect()
                .then(() => {
                    this.isConnected = true;
                    console.log(`✅ [Kafka] Producer connected to brokers: [${brokers.join(', ')}]`);
                    this.flushBuffer();
                })
                .catch((err) => {
                    this.isConnected = false;
                    console.warn(`⚠️ [Kafka] Broker unavailable at [${brokers.join(', ')}]. Operating in resilient local event-buffer mode.`);
                });
        } catch (err) {
            this.isConnected = false;
            console.warn('⚠️ [Kafka] Initialization failed (running fallback):', err.message);
        }
    }

    /**
     * Publish an event to Kafka topic
     */
    async publishEvent(topic, key, payload) {
        const event = {
            eventId: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
            timestamp: new Date().toISOString(),
            topic,
            key: String(key || 'global'),
            data: payload
        };

        if (this.isConnected && this.producer) {
            try {
                await this.producer.send({
                    topic,
                    messages: [
                        {
                            key: event.key,
                            value: JSON.stringify(event),
                            headers: {
                                'source-app': 'tech-indro-web',
                                'event-type': topic
                            }
                        }
                    ]
                });
                return { success: true, mode: 'kafka-cluster', eventId: event.eventId };
            } catch (err) {
                console.warn(`[Kafka] Produce to ${topic} failed, buffering:`, err.message);
            }
        }

        // Resilient in-memory event bus fallback
        this.eventBuffer.push(event);
        if (this.eventBuffer.length > 500) {
            this.eventBuffer.shift(); // Keep latest 500
        }

        // Trigger any locally registered handlers
        this.triggerLocalHandlers(topic, event);

        return { success: true, mode: 'in-memory-buffer', eventId: event.eventId };
    }

    /**
     * Flush buffered events when Kafka connects
     */
    async flushBuffer() {
        if (!this.isConnected || this.eventBuffer.length === 0) return;
        const count = this.eventBuffer.length;
        console.log(`⚡ [Kafka] Flushing ${count} queued events to Kafka...`);
        
        while (this.eventBuffer.length > 0) {
            const evt = this.eventBuffer.shift();
            try {
                await this.producer.send({
                    topic: evt.topic,
                    messages: [{ key: evt.key, value: JSON.stringify(evt) }]
                });
            } catch (err) {
                this.eventBuffer.unshift(evt);
                break;
            }
        }
    }

    /**
     * Register a consumer handler for a topic
     */
    on(topic, handler) {
        if (!this.handlers.has(topic)) {
            this.handlers.set(topic, []);
        }
        this.handlers.get(topic).push(handler);
    }

    triggerLocalHandlers(topic, event) {
        const topicHandlers = this.handlers.get(topic) || [];
        for (const handler of topicHandlers) {
            try {
                handler(event);
            } catch (e) {
                console.error(`[Kafka] Handler error for ${topic}:`, e);
            }
        }
    }

    /**
     * Start background consumer worker group
     */
    async startConsumer(topics = ['techindro.users.activity', 'techindro.courses.events', 'techindro.ai.mentor.events', 'techindro.leads.counseling']) {
        if (!this.kafka || this.isConsumerRunning) return;

        const groupId = process.env.KAFKA_GROUP_ID || 'tech-indro-consumers';
        try {
            this.consumer = this.kafka.consumer({ groupId });
            await this.consumer.connect();
            for (const t of topics) {
                await this.consumer.subscribe({ topic: t, fromBeginning: false });
            }

            this.isConsumerRunning = true;
            console.log(`✅ [Kafka] Consumer group [${groupId}] subscribed to [${topics.join(', ')}]`);

            await this.consumer.run({
                eachMessage: async ({ topic, message }) => {
                    try {
                        const parsed = JSON.parse(message.value.toString());
                        this.triggerLocalHandlers(topic, parsed);
                    } catch (e) {
                        console.error('[Kafka] Consumer message parse error:', e);
                    }
                }
            });
        } catch (err) {
            this.isConsumerRunning = false;
            console.warn(`⚠️ [Kafka] Consumer group inactive (broker offline). Events handled via resilient local bus.`);
        }
    }

    /**
     * Health check diagnostic
     */
    async healthCheck() {
        const brokers = (process.env.KAFKA_BROKERS || 'localhost:9092').split(',').map(b => b.trim());
        return {
            status: this.isConnected ? 'healthy' : 'standby-fallback',
            connected: this.isConnected,
            configuredBrokers: brokers,
            bufferedEventsCount: this.eventBuffer.length,
            consumerRunning: this.isConsumerRunning,
            mode: this.isConnected ? 'kafka-cluster' : 'resilient-in-memory-bus'
        };
    }
}

module.exports = new KafkaService();
