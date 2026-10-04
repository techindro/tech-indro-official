/**
 * Motu & Patlu: Bite-Sized Gamified Coding Quest
 * Clean Architecture Screen Orchestrator
 *
 * Designed with a Duolingo-style winding S-curve learning path, 3D tactile buttons,
 * Sarvam AI Indic voice dialogues, and modular interactive puzzle challenges.
 */
import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { useGamifiedQuest } from '@/hooks/useGamifiedQuest';
import { DUOLINGO_PATH_OFFSETS } from '@/data/gamifiedLessons';
import { LevelTierId } from '@/types/gamification';
import {
  DuoTopStatsBar,
  DuoStageNav,
  DuoUnitHeaderCard,
  DuoPathNode,
  DuoMascotBalloon,
  DuoMascotSelector,
  LessonModal,
  GuidebookModal,
  ChestRewardModal,
  StageCelebrationModal,
} from '@/components/gamification';

export default function MotuPatluGameScreen() {
  const router = useRouter();
  const { isDark } = useTheme();

  // Encapsulated Quest State & Logic Engine
  const {
    activeTierId,
    setActiveTierId,
    activeMascotKey,
    streakDays,
    samosaXp,
    samosas,
    unlockedIndex,
    currentTier,
    activeMascot,
    lessons,
    playingLesson,
    activeLessonIndex,
    claimedChests,

    // Modals
    lessonModalVisible,
    setLessonModalVisible,
    guidebookVisible,
    setGuidebookVisible,
    chestModalVisible,
    setChestModalVisible,
    celebrationVisible,
    setCelebrationVisible,
    chestRewardAmount,

    // Interactive State
    selectedBlocks,
    selectedOption,
    setSelectedOption,
    isAnswered,
    isCorrect,
    isSpeaking,

    // Actions
    handleSelectMascot,
    handleVoiceDialogue,
    openLesson,
    toggleBlock,
    checkAnswer,
    nextLesson,
    resetChallenge,
    claimChest,
  } = useGamifiedQuest();

  // Navigation callbacks
  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  // Node press with validation
  const handleNodePress = useCallback(
    (index: number, isChest: boolean) => {
      if (index > unlockedIndex) {
        Alert.alert(
          'Lesson Locked',
          'Pichle puzzles complete karo ya active challenge khelo to unlock this step!',
          [{ text: 'Theek Hai' }]
        );
        return;
      }

      if (isChest) {
        claimChest(index);
      } else {
        openLesson(index);
      }
    },
    [unlockedIndex, claimChest, openLesson]
  );

  // Advance to next tier from celebration modal
  const handleAdvanceToNextTier = useCallback(
    (nextTierId: LevelTierId) => {
      setCelebrationVisible(false);
      setActiveTierId(nextTierId);
    },
    [setActiveTierId, setCelebrationVisible]
  );

  const completedCount = useMemo(
    () => Math.min(lessons.length, unlockedIndex),
    [lessons.length, unlockedIndex]
  );

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: isDark ? '#0B0F19' : '#F7F9FA' },
      ]}
      edges={['top']}
    >
      {/* 1. DUOLINGO TOP STATS BAR */}
      <DuoTopStatsBar
        streakDays={streakDays}
        samosaXp={samosaXp}
        samosas={samosas}
        isDark={isDark}
        onBack={handleBack}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. STAGE NAVIGATION PILLS */}
        <DuoStageNav
          activeTierId={activeTierId}
          isDark={isDark}
          onSelectTier={setActiveTierId}
        />

        {/* 3. DUOLINGO 3D UNIT CARD HEADER */}
        <DuoUnitHeaderCard
          currentTier={currentTier}
          completedCount={completedCount}
          totalLessons={lessons.length}
          onOpenGuidebook={() => setGuidebookVisible(true)}
        />

        {/* 4. DUOLINGO S-CURVE WINDING LEARNING PATH */}
        <View style={styles.pathContainer}>
          {lessons.map((lesson, idx) => {
            const isCompleted = idx < unlockedIndex;
            const isActive = idx === unlockedIndex;
            const isLocked = idx > unlockedIndex;
            const isChest = idx === 4 || idx === 9;
            const chestKey = `${activeTierId}_chest_${idx}`;
            const isChestClaimed = Boolean(claimedChests[chestKey]);
            const offset = DUOLINGO_PATH_OFFSETS[idx % DUOLINGO_PATH_OFFSETS.length];

            return (
              <React.Fragment key={lesson.id}>
                <DuoPathNode
                  index={idx}
                  offset={offset}
                  isCompleted={isCompleted}
                  isActive={isActive}
                  isLocked={isLocked}
                  isChest={isChest}
                  isChestClaimed={isChestClaimed}
                  currentTier={currentTier}
                  isDark={isDark}
                  onPress={() => handleNodePress(idx, isChest)}
                />

                {/* Inline Character Dialogue Balloons */}
                {idx === 2 && (
                  <DuoMascotBalloon
                    avatar={require('../../assets/images/characters/motu-character.png')}
                    name="Motu (Coding Hero)"
                    speech="Khaali pet dimaag nahi chalta! Jaldi se variables aur math logic puzzles solve karo!"
                    accentColor="#EA580C"
                    voiceText="Khaali pet mere dimaag ki batti nahi jalti! Samosa khao aur mast code banao!"
                    voiceSpeaker="arvind"
                    isDark={isDark}
                    onPlayVoice={handleVoiceDialogue}
                  />
                )}

                {idx === 5 && (
                  <DuoMascotBalloon
                    avatar={require('../../assets/images/characters/patlu-character.jpg')}
                    name="Patlu (Logic Master)"
                    speech="Smart algorithm se har problem solve hoti hai! Loops aur conditions par focus rakho!"
                    accentColor="#0284C7"
                    voiceText="Idea! Coding problem ka smart algorithm mil gaya! Code logic se chalta hai!"
                    voiceSpeaker="meera"
                    isDark={isDark}
                    onPlayVoice={handleVoiceDialogue}
                  />
                )}

                {idx === 8 && (
                  <DuoMascotBalloon
                    avatar={require('../../assets/images/characters/chingam-character.jpg')}
                    name="Inspector Chingam"
                    speech="Syntax police on duty! Closing parenthesis aur quotes ka dhyan rakhein!"
                    accentColor="#16A34A"
                    voiceText="Chingam ke ilaqe me koi syntax error bach nahi sakta!"
                    voiceSpeaker="arvind"
                    isDark={isDark}
                    onPlayVoice={handleVoiceDialogue}
                  />
                )}
              </React.Fragment>
            );
          })}
        </View>

        {/* 5. COMPANION PICKER STATION */}
        <DuoMascotSelector
          activeMascotKey={activeMascotKey}
          isDark={isDark}
          onSelectMascot={handleSelectMascot}
        />

        {/* 6. JUMP-IN CALLOUT BANNER */}
        <View
          style={[
            styles.jumpInCard,
            {
              backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
              borderColor: isDark ? '#374151' : '#E5E7EB',
            },
          ]}
        >
          <Image
            source={require('../../assets/images/characters/motu-patlu-3d.png')}
            style={styles.jumpInAvatar}
            resizeMode="contain"
          />
          <View style={styles.jumpInDetails}>
            <Text style={[styles.jumpInHeading, { color: isDark ? '#F9FAFB' : '#111827' }]}>
              Ready for Lesson {unlockedIndex + 1}?
            </Text>
            <Text style={styles.jumpInSub}>
              {lessons[unlockedIndex]?.title || 'Continue your coding streak!'}
            </Text>
            <TouchableOpacity
              onPress={() => openLesson(unlockedIndex)}
              style={[styles.jumpInButton, { backgroundColor: currentTier.color }]}
              activeOpacity={0.85}
            >
              <Text style={styles.jumpInButtonText}>START LESSON</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* 7. LESSON INTERACTIVE CHALLENGE MODAL */}
      <LessonModal
        visible={lessonModalVisible}
        lesson={playingLesson}
        activeLessonIndex={activeLessonIndex}
        totalLessons={lessons.length}
        samosas={samosas}
        activeMascot={activeMascot}
        selectedBlocks={selectedBlocks}
        selectedOption={selectedOption}
        isAnswered={isAnswered}
        isCorrect={isCorrect}
        isSpeaking={isSpeaking}
        isDark={isDark}
        onClose={() => setLessonModalVisible(false)}
        onVoiceDialogue={() => handleVoiceDialogue()}
        onToggleBlock={toggleBlock}
        onSelectOption={setSelectedOption}
        onCheckAnswer={checkAnswer}
        onNextLesson={nextLesson}
        onResetChallenge={resetChallenge}
      />

      {/* 8. TREASURE CHEST MODAL */}
      <ChestRewardModal
        visible={chestModalVisible}
        rewardAmount={chestRewardAmount}
        isDark={isDark}
        onClose={() => setChestModalVisible(false)}
      />

      {/* 9. STAGE GUIDEBOOK MODAL */}
      <GuidebookModal
        visible={guidebookVisible}
        currentTier={currentTier}
        isDark={isDark}
        onClose={() => setGuidebookVisible(false)}
      />

      {/* 10. STAGE CELEBRATION MODAL */}
      <StageCelebrationModal
        visible={celebrationVisible}
        currentTier={currentTier}
        isDark={isDark}
        onAdvanceToNextTier={handleAdvanceToNextTier}
        onClose={() => setCelebrationVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 60,
  },
  pathContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  jumpInCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1.5,
    borderBottomWidth: 4,
  },
  jumpInAvatar: {
    width: 80,
    height: 70,
  },
  jumpInDetails: {
    flex: 1,
  },
  jumpInHeading: {
    fontSize: 14.5,
    fontWeight: '900',
    marginBottom: 2,
  },
  jumpInSub: {
    fontSize: 11.5,
    color: '#64748B',
    marginBottom: 8,
  },
  jumpInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 10,
  },
  jumpInButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
