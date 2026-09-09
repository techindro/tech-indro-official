/**
 * ISRO Virtual Space Lab Screen — Tech Indro
 * Futuristic dark space mission control with telemetry, rover simulation, and Rohini AI
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors, { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/Colors';

const MISSIONS = [
  {
    id: 'chandrayaan3',
    name: 'Chandrayaan-3',
    target: 'Moon South Pole',
    icon: 'moon',
    color: '#38BDF8',
    status: 'ACTIVE LANDER',
    telemetry: { velocity: '1.68 km/s', alt: '384,400 km', temp: '-130°C', power: '98%' },
    rover: 'Pragyan Rover',
    objective: 'Elemental composition analysis using APXS & LIBS payload.',
  },
  {
    id: 'aditya',
    name: 'Aditya-L1',
    target: 'Lagrange Point L1',
    icon: 'sunny',
    color: '#F59E0B',
    status: 'HALO ORBIT',
    telemetry: { velocity: '3.12 km/s', alt: '1.5 Million km', temp: '5,500°C (Corona)', power: '100%' },
    rover: 'VELC Sensor Suite',
    objective: 'Coronal mass ejection monitoring and solar wind magnetic field analysis.',
  },
  {
    id: 'gaganyaan',
    name: 'Gaganyaan Mission',
    target: 'Low Earth Orbit (400 km)',
    icon: 'planet',
    color: '#10B981',
    status: 'CREW MODULE TEST',
    telemetry: { velocity: '7.8 km/s', alt: '400 km LEO', temp: '22°C (Cabin)', power: '94%' },
    rover: 'Vyommitra Humanoid Robot',
    objective: 'Life support system testing and human spaceflight re-entry simulation.',
  },
];

export default function ISROLabScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeMissionIndex, setActiveMissionIndex] = useState(0);
  const [thrusterActive, setThrusterActive] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    'T-00:00:01 — Downlink telemetry established with ISRO ISTRAC ground station.',
    'Navigation guidance system: NOMINAL.',
    'Rohini Space AI: Autonomous trajectory locked.',
  ]);

  const currentMission = MISSIONS[activeMissionIndex];

  const handleFireThruster = () => {
    setThrusterActive(true);
    const newLog = `[THRUSTER] RCS Thruster Pulse fired at ${new Date().toLocaleTimeString()} — ΔV +0.15 m/s.`;
    setLogs((prev) => [newLog, ...prev.slice(0, 8)]);
    setTimeout(() => setThrusterActive(false), 1500);
  };

  const handleScanSurface = () => {
    const payloads = ['Spectrometer: Iron & Titanium Detected', 'Surface Temperature Gradient: Nominal', 'Radiation sensor: Safe levels'];
    const randomScan = payloads[Math.floor(Math.random() * payloads.length)];
    const newLog = `[PAYLOAD SCAN] ${randomScan} at ${new Date().toLocaleTimeString()}.`;
    setLogs((prev) => [newLog, ...prev.slice(0, 8)]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: Platform.OS === 'web' ? Spacing.md : Math.max(insets.top, 40) + 8,
          },
        ]}
      >
        {/* Lab Header */}
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.sm }}>
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
              onPress={() => router.push('/')}
              activeOpacity={0.7}
            >
              <Image
                source={require('@/assets/images/tech-indro-square-logo.png')}
                style={{ width: 34, height: 34, borderRadius: 8 }}
                resizeMode="contain"
              />
              <Text style={{ fontSize: 16, fontWeight: '700', color: Colors.text, letterSpacing: 0.5 }}>TECH INDRO</Text>
            </TouchableOpacity>
            <View style={styles.badgeBox}>
              <Ionicons name="radio-outline" size={14} color="#38BDF8" />
              <Text style={styles.badgeText}>ISRO VIRTUAL TELEMETRY</Text>
            </View>
          </View>
          <Text style={styles.title}>Space Lab & Mission Control</Text>
          <Text style={styles.subtitle}>
            Real-time orbital mechanics, sensor simulation & space robotics.
          </Text>
        </View>

        {/* Mission Switcher */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.missionTabs}
        >
          {MISSIONS.map((m, idx) => {
            const active = activeMissionIndex === idx;
            return (
              <TouchableOpacity
                key={m.id}
                style={[styles.missionTab, active && { borderColor: m.color, backgroundColor: m.color + '22' }]}
                onPress={() => setActiveMissionIndex(idx)}
              >
                <Ionicons name={m.icon as any} size={18} color={active ? m.color : Colors.textMuted} />
                <Text style={[styles.missionTabText, active && { color: m.color, fontWeight: 'bold' }]}>
                  {m.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Space Visualizer Card */}
        <View style={styles.visualizerCard}>
          <View style={styles.visualizerSky}>
            {/* Stars */}
            <View style={[styles.star, { top: 20, left: 30 }]} />
            <View style={[styles.star, { top: 50, right: 60 }]} />
            <View style={[styles.star, { top: 120, left: 100 }]} />
            <View style={[styles.star, { top: 90, right: 120 }]} />

            {/* Planet Body */}
            <View style={[styles.planetCircle, { borderColor: currentMission.color }]}>
              <Ionicons name={currentMission.icon as any} size={64} color={currentMission.color} />
            </View>

            <View style={styles.satelliteOrbiter}>
              <Ionicons
                name="airplane"
                size={22}
                color={thrusterActive ? '#EF4444' : '#fff'}
                style={{ transform: [{ rotate: '45deg' }] }}
              />
              {thrusterActive && (
                <Ionicons name="flame" size={18} color="#EF4444" style={{ marginTop: 2 }} />
              )}
            </View>
          </View>

          <View style={styles.missionStatusRow}>
            <View style={styles.statusPill}>
              <View style={[styles.liveDot, { backgroundColor: currentMission.color }]} />
              <Text style={[styles.statusPillText, { color: currentMission.color }]}>
                {currentMission.status}
              </Text>
            </View>
            <Text style={styles.missionTargetText}>Target: {currentMission.target}</Text>
          </View>
        </View>

        {/* Telemetry HUD Grid */}
        <Text style={styles.sectionHeader}>Orbital Telemetry HUD</Text>
        <View style={styles.telemetryGrid}>
          <View style={styles.telemetryCard}>
            <Text style={styles.telemetryLabel}>ORBITAL VELOCITY</Text>
            <Text style={styles.telemetryVal}>{currentMission.telemetry.velocity}</Text>
          </View>
          <View style={styles.telemetryCard}>
            <Text style={styles.telemetryLabel}>ALTITUDE</Text>
            <Text style={styles.telemetryVal}>{currentMission.telemetry.alt}</Text>
          </View>
          <View style={styles.telemetryCard}>
            <Text style={styles.telemetryLabel}>SYSTEM TEMP</Text>
            <Text style={styles.telemetryVal}>{currentMission.telemetry.temp}</Text>
          </View>
          <View style={styles.telemetryCard}>
            <Text style={styles.telemetryLabel}>SOLAR ARRAY PWR</Text>
            <Text style={[styles.telemetryVal, { color: Colors.success }]}>
              {currentMission.telemetry.power}
            </Text>
          </View>
        </View>

        {/* Rover & Objective */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Ionicons name="hardware-chip-outline" size={20} color={currentMission.color} />
            <Text style={styles.infoTitle}>Payload: {currentMission.rover}</Text>
          </View>
          <Text style={styles.infoDesc}>{currentMission.objective}</Text>
        </View>

        {/* Command Controls */}
        <Text style={styles.sectionHeader}>Mission Control Commands</Text>
        <View style={styles.controlsRow}>
          <TouchableOpacity
            style={[styles.cmdBtn, thrusterActive && styles.cmdBtnActive]}
            onPress={handleFireThruster}
          >
            <Ionicons name="flame" size={20} color="#fff" />
            <Text style={styles.cmdBtnText}>
              {thrusterActive ? 'Firing Thruster...' : 'Fire RCS Thruster'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.cmdBtn, styles.cmdBtnSecondary]} onPress={handleScanSurface}>
            <Ionicons name="scan" size={20} color="#38BDF8" />
            <Text style={[styles.cmdBtnText, { color: '#38BDF8' }]}>Scan Payload</Text>
          </TouchableOpacity>
        </View>

        {/* Terminal Log Console */}
        <Text style={styles.sectionHeader}>Rohini AI Telemetry Console</Text>
        <View style={styles.consoleBox}>
          <View style={styles.consoleHeader}>
            <View style={styles.consoleDots}>
              <View style={[styles.dot, { backgroundColor: '#EF4444' }]} />
              <View style={[styles.dot, { backgroundColor: '#F59E0B' }]} />
              <View style={[styles.dot, { backgroundColor: '#10B981' }]} />
            </View>
            <Text style={styles.consoleTitle}>istrac-stream.log</Text>
          </View>

          <View style={styles.consoleBody}>
            {logs.map((l, i) => (
              <Text key={i} style={styles.logText}>
                {'>'} {l}
              </Text>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617', // Deep space black
  },
  scroll: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  badgeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
    marginBottom: Spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.4)',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    color: '#38BDF8',
    letterSpacing: 1,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: FontSize.xs,
    color: '#94A3B8',
  },
  missionTabs: {
    gap: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  missionTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  missionTabText: {
    fontSize: FontSize.xs,
    color: '#94A3B8',
  },
  visualizerCard: {
    backgroundColor: '#090D1F',
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: Spacing.lg,
  },
  visualizerSky: {
    height: 180,
    backgroundColor: '#040714',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  star: {
    position: 'absolute',
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#fff',
    opacity: 0.8,
  },
  planetCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    shadowColor: '#38BDF8',
    shadowOpacity: 0.4,
    shadowRadius: 20,
  },
  satelliteOrbiter: {
    position: 'absolute',
    top: 30,
    right: 50,
    alignItems: 'center',
  },
  thrustFlame: {
    fontSize: 14,
    marginTop: -4,
  },
  missionStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: '#0F172A',
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusPillText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
  missionTargetText: {
    fontSize: FontSize.xs,
    color: '#94A3B8',
  },
  sectionHeader: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: '#fff',
    marginBottom: Spacing.sm,
  },
  telemetryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  telemetryCard: {
    width: '48%',
    backgroundColor: '#0F172A',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  telemetryLabel: {
    fontSize: 9,
    color: '#64748B',
    fontWeight: FontWeight.bold,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  telemetryVal: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: '#E2E8F0',
  },
  infoCard: {
    backgroundColor: '#0F172A',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: Spacing.lg,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: 6,
  },
  infoTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: '#E2E8F0',
  },
  infoDesc: {
    fontSize: FontSize.xs,
    color: '#94A3B8',
    lineHeight: 18,
  },
  controlsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  cmdBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    backgroundColor: '#EF4444',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  cmdBtnActive: {
    backgroundColor: '#DC2626',
  },
  cmdBtnSecondary: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#38BDF8',
  },
  cmdBtnText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: '#fff',
  },
  consoleBox: {
    backgroundColor: '#050814',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: '#1E293B',
    overflow: 'hidden',
  },
  consoleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    backgroundColor: '#090D1F',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  consoleDots: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  consoleTitle: {
    fontSize: 10,
    color: '#64748B',
    fontFamily: 'monospace',
  },
  consoleBody: {
    padding: Spacing.md,
    gap: 6,
  },
  logText: {
    fontSize: 11,
    color: '#10B981',
    fontFamily: 'monospace',
    lineHeight: 16,
  },
});
