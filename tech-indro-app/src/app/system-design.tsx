/**
 * System Design Labs — Tech Indro Mobile
 * Interactive Distributed Architecture Canvas, End-to-End Data Flow Walkthrough,
 * and High-Throughput Load/Stress Testing Simulator.
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Colors, { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/Colors';
import { useTheme } from '@/hooks/useTheme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Data Flow Step Interface
interface FlowStep {
  node: string;
  icon: keyof typeof Ionicons.glyphMap;
  desc: string;
  latency: string;
  protocol: string;
  type: string;
}

// Architecture Preset Definition
interface ArchitecturePreset {
  id: string;
  title: string;
  badge: string;
  subtitle: string;
  stats: { label: string; value: string }[];
  steps: FlowStep[];
  nodes: {
    name: string;
    type: string;
    role: string;
    replicas: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
  }[];
}

const PRESETS: Record<string, ArchitecturePreset> = {
  'url-shortener': {
    id: 'url-shortener',
    title: 'URL Shortener System',
    badge: '100M URLs/Day',
    subtitle: 'High-throughput write path with Redis caching & Base62 encoding',
    stats: [
      { label: 'Read/Write Ratio', value: '100:1' },
      { label: 'Target Latency', value: '< 15ms' },
      { label: 'Availability', value: '99.999%' },
    ],
    steps: [
      {
        node: 'Client App',
        icon: 'phone-portrait-outline',
        type: 'Client',
        desc: 'User requests long URL redirection (e.g. indro.io/x8K2m) or creates a shortened link via REST API.',
        latency: '~0.5ms',
        protocol: 'HTTP/3 + TLS 1.3',
      },
      {
        node: 'Cloudflare Edge CDN',
        icon: 'globe-outline',
        type: 'Edge / DNS',
        desc: 'Terminates SSL at closest edge POP, checks Edge KV cache for hot redirects, and blocks malicious DDoS bursts.',
        latency: '~2ms',
        protocol: 'Edge Anycast Routing',
      },
      {
        node: 'Envoy API Gateway',
        icon: 'git-network-outline',
        type: 'Gateway',
        desc: 'Validates JWT auth tokens, applies token-bucket rate limiting (100 req/sec), and distributes load across backend nodes.',
        latency: '~1.5ms',
        protocol: 'gRPC / Envoy Proxy',
      },
      {
        node: 'Redis Cluster (L1 Cache)',
        icon: 'flash-outline',
        type: 'Cache Tier',
        desc: 'Sub-millisecond memory lookup for hash-to-URL mappings. Achieves 97.8% read hit ratio, preventing database strain.',
        latency: '< 1ms',
        protocol: 'Redis RESP (Cluster)',
      },
      {
        node: 'URL Core Service',
        icon: 'server-outline',
        type: 'Compute',
        desc: 'Stateless Golang microservice. Generates 7-character Base62 keys from a Snowflake distributed counter ID generator.',
        latency: '~4ms',
        protocol: 'Internal gRPC',
      },
      {
        node: 'CockroachDB (Primary DB)',
        icon: 'server-outline',
        type: 'Database',
        desc: 'Geo-replicated distributed SQL database storing hash, original URL, user ID, and expiration timestamp with strong ACID consistency.',
        latency: '~12ms',
        protocol: 'Raft Consensus Protocol',
      },
    ],
    nodes: [
      { name: 'Cloudflare CDN', type: 'Edge Tier', role: 'DDoS mitigation & Anycast caching', replicas: '300+ POPs', icon: 'globe-outline', color: '#F97316' },
      { name: 'Envoy Gateway', type: 'API Gateway', role: 'Rate limiting & route discovery', replicas: '8 Pods', icon: 'git-network-outline', color: '#0EA5E9' },
      { name: 'Shortener API', type: 'Microservice', role: 'Base62 hash encoding engine', replicas: '16 Pods', icon: 'hardware-chip-outline', color: '#8B5CF6' },
      { name: 'Redis Cache', type: 'In-Memory', role: 'L1 hash lookups & Bloom filter', replicas: '6 Shards', icon: 'flash-outline', color: '#EF4444' },
      { name: 'CockroachDB', type: 'Distributed DB', role: 'ACID storage & Raft consensus', replicas: '3 Regions', icon: 'server-outline', color: '#10B981' },
    ],
  },
  'uber-matching': {
    id: 'uber-matching',
    title: 'Ride-Hailing Dispatch Fleet',
    badge: '500k Driver Telemetry/s',
    subtitle: 'Ultra-low latency geospatial matching using H3/Geohash & Kafka streams',
    stats: [
      { label: 'Ingestion Rate', value: '500k GPS/sec' },
      { label: 'Match SLA', value: '< 2.5s' },
      { label: 'Spatial Index', value: 'Uber H3 Res 8' },
    ],
    steps: [
      {
        node: 'Rider / Driver Phone',
        icon: 'navigate-outline',
        type: 'Client',
        desc: 'Driver app broadcasts GPS coordinates every 4 seconds. Rider phone initiates search with pickup location coordinates.',
        latency: '~40ms',
        protocol: 'WebSockets (TLS)',
      },
      {
        node: 'Geo-Ingestion Gateway',
        icon: 'radio-outline',
        type: 'Gateway',
        desc: 'Maintains 2M+ persistent bidirectional WebSocket connections. Normalizes and validates incoming GPS telemetry pings.',
        latency: '~3ms',
        protocol: 'Bidirectional WSS',
      },
      {
        node: 'Kafka Event Backbone',
        icon: 'trail-sign-outline',
        type: 'Message Queue',
        desc: 'Partitioned by geohash cell ID. Ensures high-throughput, ordered delivery of location events with zero data loss.',
        latency: '~2ms',
        protocol: 'Kafka Binary Protocol',
      },
      {
        node: 'Apache Flink (Stream Engine)',
        icon: 'hardware-chip-outline',
        type: 'Stream Processor',
        desc: 'Continuously updates driver state windows, computes speed trajectories, and detects proximity within H3 hexagonal cells.',
        latency: '~5ms',
        protocol: 'Distributed Memory State',
      },
      {
        node: 'Geospatial Redis (H3)',
        icon: 'flash-outline',
        type: 'Cache Tier',
        desc: 'Stores real-time driver spatial indices in memory using Uber H3 hexagonal binning for sub-5ms k-nearest neighbor queries.',
        latency: '< 1ms',
        protocol: 'Redis H3 Hex Queries',
      },
      {
        node: 'Dispatch Matching Engine',
        icon: 'car-sport-outline',
        type: 'Compute',
        desc: 'Executes Hungarian combinatorial optimization to batch-match riders and drivers, minimizing ETA and platform surge multiplier.',
        latency: '~350ms',
        protocol: 'C++ SIMD Batch Matcher',
      },
    ],
    nodes: [
      { name: 'WSS Gateway', type: 'Gateway', role: '2M persistent WebSocket connections', replicas: '24 Pods', icon: 'radio-outline', color: '#0EA5E9' },
      { name: 'Kafka Cluster', type: 'Event Log', role: 'Geohash-partitioned event streams', replicas: '12 Brokers', icon: 'trail-sign-outline', color: '#F59E0B' },
      { name: 'Apache Flink', type: 'Stream Engine', role: 'Sliding window spatial aggregations', replicas: '32 Workers', icon: 'hardware-chip-outline', color: '#8B5CF6' },
      { name: 'H3 Spatial Store', type: 'Spatial DB', role: 'Real-time Hexagonal driver indexing', replicas: '8 Shards', icon: 'flash-outline', color: '#10B981' },
      { name: 'Matching Engine', type: 'Optimization', role: 'Batch dispatch optimization', replicas: '10 Pods', icon: 'car-sport-outline', color: '#EC4899' },
    ],
  },
  'ecommerce-sale': {
    id: 'ecommerce-sale',
    title: 'Flash Sale & Inventory Checkout',
    badge: '1M Concurrent Users',
    subtitle: 'Zero overselling with Redis distributed locks, Kafka buffers & Saga checkout',
    stats: [
      { label: 'Stock Protection', value: 'Strict 0 Oversell' },
      { label: 'Payment SLA', value: '< 450ms' },
      { label: 'Queue Capacity', value: '10M Orders' },
    ],
    steps: [
      {
        node: 'Shopper App',
        icon: 'cart-outline',
        type: 'Client',
        desc: 'Shopper clicks "Buy Now" during flash sale opening. Sends encrypted checkout payload with idempotency key.',
        latency: '~20ms',
        protocol: 'HTTPS / JSON',
      },
      {
        node: 'Envoy Gatekeeper',
        icon: 'shield-checkmark-outline',
        type: 'Gateway',
        desc: 'Validates idempotency tokens, repels automated scalper bots using fingerprinting, and throttles requests exceeding queue limits.',
        latency: '~2ms',
        protocol: 'TLS 1.3 / mTLS',
      },
      {
        node: 'Redis Lock (Lua Script)',
        icon: 'lock-closed-outline',
        type: 'Distributed Lock',
        desc: 'Atomic Lua script decrements inventory stock in Redis memory. If stock <= 0, immediately halts and returns Out of Stock without touching DB.',
        latency: '< 1ms',
        protocol: 'Atomic Redlock Script',
      },
      {
        node: 'Kafka Order Log',
        icon: 'file-tray-full-outline',
        type: 'Durable Queue',
        desc: 'Confirmed order events are appended to a durable Kafka topic. Decouples fast user response from slower payment processing.',
        latency: '~3ms',
        protocol: 'Durable Append Stream',
      },
      {
        node: 'Saga Checkout Fleet',
        icon: 'card-outline',
        type: 'Orchestrator',
        desc: 'Saga orchestrator reserves inventory -> executes payment gateway charge -> dispatches invoice. Rolls back atomically on payment error.',
        latency: '~220ms',
        protocol: 'Saga Pattern + Compensate',
      },
      {
        node: 'Aurora PostgreSQL',
        icon: 'server-outline',
        type: 'Financial Ledger',
        desc: 'Persists final immutable financial invoice and ledger records across Multi-AZ database cluster with zero data loss.',
        latency: '~10ms',
        protocol: 'ACID Financial Ledger',
      },
    ],
    nodes: [
      { name: 'Bot Defender', type: 'WAF / Edge', role: 'Scalper & bot shield verification', replicas: 'Edge Fleet', icon: 'shield-checkmark-outline', color: '#EF4444' },
      { name: 'Redis DecrLock', type: 'In-Memory', role: 'Atomic stock decrement Lua scripts', replicas: '6 Nodes', icon: 'lock-closed-outline', color: '#F97316' },
      { name: 'Kafka Buffer', type: 'Message Log', role: 'Order decoupling and burst absorber', replicas: '8 Brokers', icon: 'file-tray-full-outline', color: '#8B5CF6' },
      { name: 'Saga Workers', type: 'Orchestrator', role: 'Distributed payment transaction flows', replicas: '20 Workers', icon: 'card-outline', color: '#0EA5E9' },
      { name: 'Aurora PG DB', type: 'ACID Ledger', role: 'Multi-AZ durable transactional ledger', replicas: 'Multi-AZ', icon: 'server-outline', color: '#10B981' },
    ],
  },
  'video-stream': {
    id: 'video-stream',
    title: 'Adaptive Video Transcoding & CDN',
    badge: '10M Concurrent Streams',
    subtitle: 'GPU-accelerated HLS/DASH chunking with adaptive bitrate streaming (ABR)',
    stats: [
      { label: 'Resolution', value: '4K HDR -> 360p' },
      { label: 'Edge Latency', value: '< 8ms' },
      { label: 'Protocols', value: 'HLS / MPEG-DASH' },
    ],
    steps: [
      {
        node: 'Creator Studio',
        icon: 'videocam-outline',
        type: 'Upload Client',
        desc: 'Creator uploads master 4K ProRes video via multipart resumable upload directly to closest S3 ingestion endpoint.',
        latency: '~250ms',
        protocol: 'S3 Multipart Presigned',
      },
      {
        node: 'S3 Storage Vault',
        icon: 'archive-outline',
        type: 'Object Storage',
        desc: 'Stores immutable master raw video files with multi-region replication. Generates S3 bucket notification event.',
        latency: '~50ms',
        protocol: 'S3 Event Notifications',
      },
      {
        node: 'SQS Task Sharding',
        icon: 'list-outline',
        type: 'Task Queue',
        desc: 'Enqueues video chunk transcoding jobs with profile parameters (4K, 1080p, 720p, 480p, 360p) for GPU worker pool.',
        latency: '~4ms',
        protocol: 'AWS SQS / Visibility Timeout',
      },
      {
        node: 'GPU Transcoder Fleet',
        icon: 'hardware-chip-outline',
        type: 'Compute Fleet',
        desc: 'Auto-scaled GPU instances (AWS g5 NVENC) segment video into 6-second .ts chunks and generate .m3u8 playlist manifests.',
        latency: '~15s',
        protocol: 'FFmpeg NVENC H.265/AV1',
      },
      {
        node: 'Multi-CDN Global Edge',
        icon: 'globe-outline',
        type: 'Edge Network',
        desc: 'CloudFront and Fastly edge points cache video segments. Viewers switch bitrates seamlessly using client-side ABR based on network speed.',
        latency: '~8ms',
        protocol: 'ABR Streaming (HLS/DASH)',
      },
    ],
    nodes: [
      { name: 'S3 Raw Ingest', type: 'Storage', role: 'Resumable multipart 4K uploads', replicas: '100% S3 SLA', icon: 'archive-outline', color: '#0EA5E9' },
      { name: 'SQS Sharder', type: 'Queue', role: 'Chunk-level task distribution', replicas: 'FIFO Queue', icon: 'list-outline', color: '#F59E0B' },
      { name: 'GPU Transcoders', type: 'GPU Fleet', role: 'Hardware H.265/AV1 multi-res transcoding', replicas: '32 GPUs', icon: 'hardware-chip-outline', color: '#8B5CF6' },
      { name: 'Multi-CDN Edge', type: 'Distribution', role: 'Global edge cache & ABR delivery', replicas: 'Edge Anycast', icon: 'globe-outline', color: '#10B981' },
    ],
  },
};

export default function SystemDesignScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();

  // Selected Preset
  const [selectedPresetKey, setSelectedPresetKey] = useState<string>('url-shortener');
  const activePreset = PRESETS[selectedPresetKey] || PRESETS['url-shortener'];

  // Flow State
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const playIntervalRef = useRef<any>(null);

  // Active Tab View: 'flow' | 'telemetry' | 'nodes'
  const [activeTab, setActiveTab] = useState<'flow' | 'telemetry' | 'nodes'>('flow');

  // Load Testing Simulator Controls
  const [rpsLoad, setRpsLoad] = useState<number>(25000);
  const [faultInjection, setFaultInjection] = useState<boolean>(false);

  // Auto-play interval handling
  useEffect(() => {
    if (isPlaying) {
      playIntervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < activePreset.steps.length - 1) {
            return prev + 1;
          } else {
            return 0; // Loop back
          }
        });
      }, 2400);
    } else {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
        playIntervalRef.current = null;
      }
    }
    return () => {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    };
  }, [isPlaying, activePreset]);

  // Reset step when changing presets
  const handleSelectPreset = (key: string) => {
    setSelectedPresetKey(key);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleNextStep = () => {
    if (currentStep < activePreset.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCurrentStep(0);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const activeStepData = activePreset.steps[currentStep] || activePreset.steps[0];

  // Calculated Telemetry based on RPS & Fault Injection
  const latencyP99 = faultInjection
    ? Math.round(180 + (rpsLoad / 1000) * 1.8)
    : Math.round(8 + (rpsLoad / 1000) * 0.18);
  const errorRate = faultInjection
    ? (3.4 + (rpsLoad / 50000)).toFixed(2)
    : (0.001 + (rpsLoad / 500000)).toFixed(3);
  const activeReplicas = Math.min(128, Math.max(4, Math.round(rpsLoad / 4000)));
  const systemHealth = faultInjection ? 'DEGRADED' : rpsLoad > 150000 ? 'STRESSED' : 'HEALTHY';
  const healthColor = faultInjection ? '#EF4444' : rpsLoad > 150000 ? '#F59E0B' : '#10B981';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['left', 'right']}>
      {/* Header Bar */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.card,
            borderBottomColor: colors.border,
            paddingTop: Platform.OS === 'web' ? Spacing.sm : Math.max(insets.top, 38) + 6,
          },
        ]}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 6 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>System Design Labs</Text>
            <View style={styles.proPill}>
              <Text style={styles.proPillText}>INTERACTIVE</Text>
            </View>
          </View>
          <Text style={[styles.headerSubtitle, { color: colors.textMuted }]} numberOfLines={1}>
            Distributed Topologies, E2E Flow & Load Simulator
          </Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Architecture Preset Selector Pills */}
        <View style={styles.presetsSection}>
          <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>SELECT ARCHITECTURE PRESET</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.presetScroll}>
            {Object.keys(PRESETS).map((key) => {
              const preset = PRESETS[key];
              const isSelected = selectedPresetKey === key;
              return (
                <TouchableOpacity
                  key={key}
                  onPress={() => handleSelectPreset(key)}
                  activeOpacity={0.8}
                  style={[
                    styles.presetCard,
                    {
                      backgroundColor: colors.card,
                      borderColor: isSelected ? Colors.primary : colors.border,
                    },
                    isSelected && styles.presetCardActive,
                  ]}
                >
                  <View style={styles.presetTopRow}>
                    <Text
                      style={[
                        styles.presetTitle,
                        { color: isSelected ? Colors.primary : colors.text },
                      ]}
                      numberOfLines={1}
                    >
                      {preset.title}
                    </Text>
                  </View>
                  <View style={styles.presetBadgeRow}>
                    <View
                      style={[
                        styles.presetBadge,
                        { backgroundColor: isSelected ? '#ffedd5' : isDark ? '#1e293b' : '#f1f5f9' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.presetBadgeText,
                          { color: isSelected ? '#ea580c' : colors.textMuted },
                        ]}
                      >
                        {preset.badge}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Selected Architecture Overview Banner */}
        <LinearGradient
          colors={isDark ? ['#1e293b', '#0f172a'] : ['#ffffff', '#f8fafc']}
          style={[styles.overviewBanner, { borderColor: colors.border }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.overviewHeader}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.overviewTitle, { color: colors.text }]}>{activePreset.title}</Text>
              <Text style={[styles.overviewDesc, { color: colors.textMuted }]}>{activePreset.subtitle}</Text>
            </View>
            <View style={styles.presetIconBox}>
              <Ionicons name="git-network-outline" size={24} color={Colors.primary} />
            </View>
          </View>

          {/* Preset Metric Highlights */}
          <View style={[styles.metricsRow, { borderTopColor: colors.border }]}>
            {activePreset.stats.map((stat, i) => (
              <View key={i} style={styles.metricCol}>
                <Text style={[styles.metricVal, { color: Colors.primary }]}>{stat.value}</Text>
                <Text style={[styles.metricLbl, { color: colors.textMuted }]}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* Mode Selector Tabs: Flow Walkthrough / Load Simulator / Topology */}
        <View style={[styles.modeTabs, { backgroundColor: isDark ? '#1e293b' : '#e2e8f0' }]}>
          <TouchableOpacity
            style={[
              styles.modeTabBtn,
              activeTab === 'flow' && { backgroundColor: colors.card, shadowOpacity: 0.1 },
            ]}
            onPress={() => setActiveTab('flow')}
          >
            <Ionicons
              name="swap-horizontal-outline"
              size={16}
              color={activeTab === 'flow' ? Colors.primary : colors.textMuted}
            />
            <Text
              style={[
                styles.modeTabText,
                { color: activeTab === 'flow' ? colors.text : colors.textMuted },
                activeTab === 'flow' && { fontWeight: '700' },
              ]}
            >
              Data Flow
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.modeTabBtn,
              activeTab === 'telemetry' && { backgroundColor: colors.card, shadowOpacity: 0.1 },
            ]}
            onPress={() => setActiveTab('telemetry')}
          >
            <Ionicons
              name="speedometer-outline"
              size={16}
              color={activeTab === 'telemetry' ? Colors.primary : colors.textMuted}
            />
            <Text
              style={[
                styles.modeTabText,
                { color: activeTab === 'telemetry' ? colors.text : colors.textMuted },
                activeTab === 'telemetry' && { fontWeight: '700' },
              ]}
            >
              Load Simulator
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.modeTabBtn,
              activeTab === 'nodes' && { backgroundColor: colors.card, shadowOpacity: 0.1 },
            ]}
            onPress={() => setActiveTab('nodes')}
          >
            <Ionicons
              name="layers-outline"
              size={16}
              color={activeTab === 'nodes' ? Colors.primary : colors.textMuted}
            />
            <Text
              style={[
                styles.modeTabText,
                { color: activeTab === 'nodes' ? colors.text : colors.textMuted },
                activeTab === 'nodes' && { fontWeight: '700' },
              ]}
            >
              Topology
            </Text>
          </TouchableOpacity>
        </View>

        {/* TAB 1: INTERACTIVE DATA FLOW WALKTHROUGH */}
        {activeTab === 'flow' && (
          <View style={styles.tabContent}>
            {/* Pipeline Stage Visualizer */}
            <View style={[styles.pipelineCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.pipelineHeader}>
                <Text style={[styles.pipelineTitle, { color: colors.text }]}>End-to-End Execution Flow</Text>
                <View style={styles.stepPill}>
                  <Text style={styles.stepPillText}>
                    Step {currentStep + 1} / {activePreset.steps.length}
                  </Text>
                </View>
              </View>

              {/* Horizontal Node Flow Progression */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.flowNodesScroll}
              >
                {activePreset.steps.map((step, idx) => {
                  const isActive = idx === currentStep;
                  const isPassed = idx < currentStep;
                  return (
                    <React.Fragment key={idx}>
                      <TouchableOpacity
                        onPress={() => {
                          setCurrentStep(idx);
                          setIsPlaying(false);
                        }}
                        activeOpacity={0.8}
                        style={[
                          styles.flowNodeItem,
                          isActive && styles.flowNodeItemActive,
                          isPassed && styles.flowNodeItemPassed,
                          {
                            backgroundColor: isActive
                              ? Colors.primary
                              : isPassed
                              ? isDark
                                ? '#1e293b'
                                : '#f1f5f9'
                              : isDark
                              ? '#0f172a'
                              : '#ffffff',
                            borderColor: isActive
                              ? Colors.primary
                              : isPassed
                              ? Colors.primary
                              : colors.border,
                          },
                        ]}
                      >
                        <Ionicons
                          name={step.icon}
                          size={18}
                          color={isActive ? '#ffffff' : isPassed ? Colors.primary : colors.textMuted}
                        />
                        <Text
                          style={[
                            styles.flowNodeLabel,
                            {
                              color: isActive
                                ? '#ffffff'
                                : isPassed
                                ? colors.text
                                : colors.textMuted,
                            },
                          ]}
                          numberOfLines={1}
                        >
                          {step.node}
                        </Text>
                      </TouchableOpacity>

                      {idx < activePreset.steps.length - 1 && (
                        <View style={styles.flowConnector}>
                          <Ionicons
                            name="chevron-forward"
                            size={16}
                            color={isPassed || isActive ? Colors.primary : colors.border}
                          />
                        </View>
                      )}
                    </React.Fragment>
                  );
                })}
              </ScrollView>

              {/* Step Deep-Dive Card */}
              <View style={[styles.stepDetailBox, { backgroundColor: isDark ? '#0f172a' : '#f8fafc', borderColor: colors.border }]}>
                <View style={styles.stepDetailTop}>
                  <View style={[styles.stepNodeIconBox, { backgroundColor: Colors.primary + '22' }]}>
                    <Ionicons name={activeStepData.icon} size={22} color={Colors.primary} />
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={[styles.stepNodeTitle, { color: colors.text }]}>{activeStepData.node}</Text>
                      <View style={styles.nodeTypePill}>
                        <Text style={styles.nodeTypePillText}>{activeStepData.type}</Text>
                      </View>
                    </View>
                    <Text style={[styles.stepNodeSubtitle, { color: colors.textMuted }]}>
                      Layer {currentStep + 1} execution point
                    </Text>
                  </View>
                </View>

                <Text style={[styles.stepDescText, { color: colors.textSecondary }]}>
                  {activeStepData.desc}
                </Text>

                {/* Latency & Protocol Pills */}
                <View style={styles.stepMetaRow}>
                  <View style={styles.metaPill}>
                    <Ionicons name="time-outline" size={13} color="#0EA5E9" />
                    <Text style={[styles.metaPillText, { color: '#0EA5E9' }]}>{activeStepData.latency}</Text>
                  </View>
                  <View style={styles.metaPill}>
                    <Ionicons name="shield-outline" size={13} color="#10B981" />
                    <Text style={[styles.metaPillText, { color: '#10B981' }]}>{activeStepData.protocol}</Text>
                  </View>
                </View>
              </View>

              {/* Flow Playback Controls */}
              <View style={[styles.flowControlsRow, { borderTopColor: colors.border }]}>
                <TouchableOpacity
                  style={[styles.ctrlBtn, { borderColor: colors.border, opacity: currentStep === 0 ? 0.4 : 1 }]}
                  onPress={handlePrevStep}
                  disabled={currentStep === 0}
                  activeOpacity={0.7}
                >
                  <Ionicons name="play-back" size={18} color={colors.text} />
                  <Text style={[styles.ctrlBtnText, { color: colors.text }]}>Previous</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.ctrlPlayBtn, { backgroundColor: isPlaying ? '#EF4444' : Colors.primary }]}
                  onPress={() => setIsPlaying(!isPlaying)}
                  activeOpacity={0.85}
                >
                  <Ionicons name={isPlaying ? 'pause' : 'play'} size={18} color="#ffffff" />
                  <Text style={styles.ctrlPlayBtnText}>
                    {isPlaying ? 'Pause' : 'Auto Play'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.ctrlBtn, { borderColor: colors.border }]}
                  onPress={handleNextStep}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.ctrlBtnText, { color: colors.text }]}>
                    {currentStep === activePreset.steps.length - 1 ? 'Restart' : 'Next'}
                  </Text>
                  <Ionicons name="play-forward" size={18} color={colors.text} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* TAB 2: LIVE LOAD & CHAOS SIMULATOR */}
        {activeTab === 'telemetry' && (
          <View style={styles.tabContent}>
            <View style={[styles.simCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.simCardHeader}>
                <View>
                  <Text style={[styles.simTitle, { color: colors.text }]}>Traffic Load Simulator</Text>
                  <Text style={[styles.simSubtitle, { color: colors.textMuted }]}>
                    Benchmark tail latency & fault tolerance under peak burst
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: healthColor + '20', borderColor: healthColor }]}>
                  <Text style={[styles.statusBadgeText, { color: healthColor }]}>{systemHealth}</Text>
                </View>
              </View>

              {/* Traffic RPS Selector */}
              <Text style={[styles.controlLabel, { color: colors.textMuted }]}>TRAFFIC THROUGHPUT (RPS)</Text>
              <View style={styles.rpsButtonsRow}>
                {[5000, 25000, 100000, 250000].map((rps) => {
                  const isSelected = rpsLoad === rps;
                  return (
                    <TouchableOpacity
                      key={rps}
                      onPress={() => setRpsLoad(rps)}
                      style={[
                        styles.rpsBtn,
                        {
                          backgroundColor: isSelected ? Colors.primary : isDark ? '#1e293b' : '#f1f5f9',
                          borderColor: isSelected ? Colors.primary : colors.border,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.rpsBtnText,
                          { color: isSelected ? '#ffffff' : colors.text },
                        ]}
                      >
                        {rps >= 1000 ? `${rps / 1000}k` : rps}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Chaos / Fault Injection Toggle */}
              <TouchableOpacity
                style={[
                  styles.chaosToggleRow,
                  {
                    backgroundColor: faultInjection ? '#EF444415' : isDark ? '#1e293b' : '#f8fafc',
                    borderColor: faultInjection ? '#EF4444' : colors.border,
                  },
                ]}
                onPress={() => setFaultInjection(!faultInjection)}
                activeOpacity={0.8}
              >
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Ionicons
                      name={faultInjection ? 'flame' : 'shield-outline'}
                      size={18}
                      color={faultInjection ? '#EF4444' : '#10B981'}
                    />
                    <Text style={[styles.chaosTitle, { color: faultInjection ? '#EF4444' : colors.text }]}>
                      Chaos Monkey Fault Injection
                    </Text>
                  </View>
                  <Text style={[styles.chaosDesc, { color: colors.textMuted }]}>
                    {faultInjection
                      ? 'Simulating partition & database replica failover'
                      : 'All primary & standby nodes operating nominally'}
                  </Text>
                </View>
                <View style={[styles.togglePill, { backgroundColor: faultInjection ? '#EF4444' : colors.border }]}>
                  <Text style={styles.togglePillText}>{faultInjection ? 'ACTIVE' : 'OFF'}</Text>
                </View>
              </TouchableOpacity>

              {/* Telemetry Gauge Cards */}
              <View style={styles.telemetryGrid}>
                <View style={[styles.gaugeBox, { backgroundColor: isDark ? '#0f172a' : '#f8fafc', borderColor: colors.border }]}>
                  <Text style={[styles.gaugeLabel, { color: colors.textMuted }]}>P99 Tail Latency</Text>
                  <Text style={[styles.gaugeValue, { color: faultInjection ? '#EF4444' : Colors.primary }]}>
                    {latencyP99}ms
                  </Text>
                  <Text style={[styles.gaugeSub, { color: colors.textMuted }]}>SLA: &lt; 250ms</Text>
                </View>

                <View style={[styles.gaugeBox, { backgroundColor: isDark ? '#0f172a' : '#f8fafc', borderColor: colors.border }]}>
                  <Text style={[styles.gaugeLabel, { color: colors.textMuted }]}>Error Rate</Text>
                  <Text style={[styles.gaugeValue, { color: faultInjection ? '#EF4444' : '#10B981' }]}>
                    {errorRate}%
                  </Text>
                  <Text style={[styles.gaugeSub, { color: colors.textMuted }]}>SLO: &lt; 0.1%</Text>
                </View>

                <View style={[styles.gaugeBox, { backgroundColor: isDark ? '#0f172a' : '#f8fafc', borderColor: colors.border }]}>
                  <Text style={[styles.gaugeLabel, { color: colors.textMuted }]}>Active Pods</Text>
                  <Text style={[styles.gaugeValue, { color: '#8B5CF6' }]}>{activeReplicas}</Text>
                  <Text style={[styles.gaugeSub, { color: colors.textMuted }]}>Autoscaled</Text>
                </View>

                <View style={[styles.gaugeBox, { backgroundColor: isDark ? '#0f172a' : '#f8fafc', borderColor: colors.border }]}>
                  <Text style={[styles.gaugeLabel, { color: colors.textMuted }]}>Cache Hit Ratio</Text>
                  <Text style={[styles.gaugeValue, { color: '#0EA5E9' }]}>
                    {faultInjection ? '68.2%' : '97.6%'}
                  </Text>
                  <Text style={[styles.gaugeSub, { color: colors.textMuted }]}>Redis L1 Tier</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* TAB 3: TOPOLOGY BREAKDOWN */}
        {activeTab === 'nodes' && (
          <View style={styles.tabContent}>
            <View style={styles.nodesSectionHeader}>
              <Text style={[styles.nodesSectionTitle, { color: colors.text }]}>Architectural Components</Text>
              <Text style={[styles.nodesSectionSubtitle, { color: colors.textMuted }]}>
                Production-grade building blocks configured in this preset
              </Text>
            </View>

            {activePreset.nodes.map((node, i) => (
              <View
                key={i}
                style={[
                  styles.nodeCard,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <View style={[styles.nodeCardIconCircle, { backgroundColor: node.color + '20' }]}>
                  <Ionicons name={node.icon} size={22} color={node.color} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={[styles.nodeCardName, { color: colors.text }]}>{node.name}</Text>
                    <View style={[styles.replicaPill, { backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }]}>
                      <Text style={[styles.replicaPillText, { color: colors.textMuted }]}>{node.replicas}</Text>
                    </View>
                  </View>
                  <Text style={[styles.nodeCardType, { color: Colors.primary }]}>{node.type}</Text>
                  <Text style={[styles.nodeCardRole, { color: colors.textSecondary }]}>{node.role}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Bottom Educational Callout */}
        <View style={[styles.eduBanner, { backgroundColor: isDark ? '#141c2e' : '#eff6ff', borderColor: '#bfdbfe' }]}>
          <Ionicons name="school-outline" size={24} color="#2563eb" />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={[styles.eduTitle, { color: '#1e40af' }]}>System Design Interview Ready</Text>
            <Text style={[styles.eduDesc, { color: isDark ? '#93c5fd' : '#1e3a8a' }]}>
              Master trade-offs like CAP Theorem, Eventual Consistency, Cache Invalidation, and Circuit Breakers with hands-on simulations.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
  proPill: {
    backgroundColor: '#ffedd5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  proPillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#ea580c',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: FontSize.xs,
    marginTop: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  presetsSection: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  presetScroll: {
    gap: 10,
  },
  presetCard: {
    width: 190,
    padding: 12,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
  },
  presetCardActive: {
    backgroundColor: '#fff7ed',
  },
  presetTopRow: {
    marginBottom: 6,
  },
  presetTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  presetBadgeRow: {
    flexDirection: 'row',
  },
  presetBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
  },
  presetBadgeText: {
    fontSize: 10.5,
    fontWeight: '600',
  },
  overviewBanner: {
    padding: 16,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: 16,
  },
  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  overviewTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  overviewDesc: {
    fontSize: FontSize.xs,
    marginTop: 2,
    lineHeight: 18,
  },
  presetIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffedd5',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
  },
  metricCol: {
    alignItems: 'center',
  },
  metricVal: {
    fontSize: 14,
    fontWeight: '800',
  },
  metricLbl: {
    fontSize: 10,
    marginTop: 2,
  },
  modeTabs: {
    flexDirection: 'row',
    borderRadius: BorderRadius.md,
    padding: 4,
    marginBottom: 16,
  },
  modeTabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: BorderRadius.sm,
    gap: 6,
  },
  modeTabText: {
    fontSize: 12,
    fontWeight: '600',
  },
  tabContent: {
    marginBottom: 16,
  },
  pipelineCard: {
    padding: 16,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  pipelineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  pipelineTitle: {
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
  stepPill: {
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  stepPillText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#0284c7',
  },
  flowNodesScroll: {
    alignItems: 'center',
    paddingVertical: 6,
    marginBottom: 16,
  },
  flowNodeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    gap: 6,
  },
  flowNodeItemActive: {
    transform: [{ scale: 1.05 }],
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  flowNodeItemPassed: {
    borderStyle: 'dashed',
  },
  flowNodeLabel: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  flowConnector: {
    paddingHorizontal: 4,
  },
  stepDetailBox: {
    padding: 14,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: 14,
  },
  stepDetailTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  stepNodeIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNodeTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  nodeTypePill: {
    backgroundColor: '#ede9fe',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  nodeTypePillText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#7c3aed',
  },
  stepNodeSubtitle: {
    fontSize: 11,
    marginTop: 1,
  },
  stepDescText: {
    fontSize: 12.5,
    lineHeight: 19,
    marginBottom: 12,
  },
  stepMetaRow: {
    flexDirection: 'row',
    gap: 8,
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  metaPillText: {
    fontSize: 11,
    fontWeight: '600',
  },
  flowControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 14,
    borderTopWidth: 1,
    gap: 8,
  },
  ctrlBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: 6,
  },
  ctrlBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  ctrlPlayBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: BorderRadius.md,
    gap: 6,
  },
  ctrlPlayBtnText: {
    color: '#ffffff',
    fontSize: 12.5,
    fontWeight: '700',
  },
  simCard: {
    padding: 16,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  simCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  simTitle: {
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
  simSubtitle: {
    fontSize: FontSize.xs,
    marginTop: 2,
    maxWidth: SCREEN_WIDTH * 0.55,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  controlLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  rpsButtonsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  rpsBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  rpsBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  chaosToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    marginBottom: 16,
  },
  chaosTitle: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  chaosDesc: {
    fontSize: 10.5,
    marginTop: 2,
  },
  togglePill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 8,
  },
  togglePillText: {
    color: '#ffffff',
    fontSize: 9.5,
    fontWeight: '800',
  },
  telemetryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gaugeBox: {
    width: (SCREEN_WIDTH - 32 - 32 - 10) / 2,
    padding: 12,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  gaugeLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  gaugeValue: {
    fontSize: 18,
    fontWeight: '800',
    marginVertical: 4,
  },
  gaugeSub: {
    fontSize: 10,
  },
  nodesSectionHeader: {
    marginBottom: 12,
  },
  nodesSectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
  nodesSectionSubtitle: {
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  nodeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: 10,
  },
  nodeCardIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nodeCardName: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  replicaPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  replicaPillText: {
    fontSize: 10,
    fontWeight: '600',
  },
  nodeCardType: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  nodeCardRole: {
    fontSize: 11.5,
    marginTop: 3,
    lineHeight: 16,
  },
  eduBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  eduTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  eduDesc: {
    fontSize: 11,
    lineHeight: 16,
    marginTop: 2,
  },
});
