/**
 * Custom Hook: useGamifiedQuest
 * Encapsulates game state, audio voice triggers, answer verification,
 * and persistent storage synchronization for the Duolingo quest engine.
 */
import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MascotId, LevelTierId, Lesson, LevelTier } from '@/types/gamification';
import { MASCOTS, LEVEL_TIERS } from '@/data/gamifiedLessons';
import { playIndicVoice, stopAnyVoice } from '@/services/api';

const STORAGE_KEYS = {
  MASCOT: 'tech_indro_mascot',
  XP: 'tech_indro_samosa_xp',
  PROGRESS: 'tech_indro_tier_progress',
  CHESTS: 'tech_indro_claimed_chests',
} as const;

export function useGamifiedQuest() {
  const [activeTierId, setActiveTierId] = useState<LevelTierId>('basic');
  const [activeMascotKey, setActiveMascotKey] = useState<MascotId>('motu');
  const [streakDays, setStreakDays] = useState<number>(5);
  const [samosaXp, setSamosaXp] = useState<number>(320);
  const [samosas, setSamosas] = useState<number>(5); // Lives/Hearts

  const [unlockedByTier, setUnlockedByTier] = useState<Record<LevelTierId, number>>({
    basic: 0,
    medium: 0,
    datascience: 0,
    aiml: 0,
  });

  const [claimedChests, setClaimedChests] = useState<Record<string, boolean>>({});

  // Active Lesson State
  const [activeLessonIndex, setActiveLessonIndex] = useState<number>(0);
  const [lessonModalVisible, setLessonModalVisible] = useState<boolean>(false);
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Additional Modals
  const [guidebookVisible, setGuidebookVisible] = useState<boolean>(false);
  const [chestModalVisible, setChestModalVisible] = useState<boolean>(false);
  const [celebrationVisible, setCelebrationVisible] = useState<boolean>(false);
  const [chestRewardAmount, setChestRewardAmount] = useState<number>(50);

  // Computed Values
  const currentTier: LevelTier = useMemo(
    () => LEVEL_TIERS.find((t) => t.id === activeTierId) || LEVEL_TIERS[0],
    [activeTierId]
  );
  const activeMascot = useMemo(() => MASCOTS[activeMascotKey] || MASCOTS.motu, [activeMascotKey]);
  const lessons: Lesson[] = currentTier.lessons;
  const unlockedIndex = unlockedByTier[activeTierId] ?? 0;
  const playingLesson: Lesson = lessons[activeLessonIndex] || lessons[0];

  // Stop voice on component unmount
  useEffect(() => {
    return () => {
      stopAnyVoice();
    };
  }, []);

  // Hydrate state from AsyncStorage on initial load
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const [savedMascot, savedXp, savedProgress, savedChests] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.MASCOT),
          AsyncStorage.getItem(STORAGE_KEYS.XP),
          AsyncStorage.getItem(STORAGE_KEYS.PROGRESS),
          AsyncStorage.getItem(STORAGE_KEYS.CHESTS),
        ]);

        if (!isMounted) return;

        if (savedMascot && MASCOTS[savedMascot as MascotId]) {
          setActiveMascotKey(savedMascot as MascotId);
        }
        if (savedXp) {
          const parsed = parseInt(savedXp, 10);
          if (!isNaN(parsed)) setSamosaXp(parsed);
        }
        if (savedProgress) {
          setUnlockedByTier((prev) => ({ ...prev, ...JSON.parse(savedProgress) }));
        }
        if (savedChests) {
          setClaimedChests(JSON.parse(savedChests));
        }
      } catch (err) {
        console.warn('Failed to load gamification progress from storage', err);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  // Select companion mascot
  const handleSelectMascot = useCallback((id: MascotId) => {
    setActiveMascotKey(id);
    AsyncStorage.setItem(STORAGE_KEYS.MASCOT, id).catch(() => {});
    const m = MASCOTS[id];
    if (m) {
      playIndicVoice({
        text: m.quote,
        language: 'hi',
        speaker: m.voiceSpeaker,
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    }
  }, []);

  // Play voice dialogue
  const handleVoiceDialogue = useCallback(
    (customText?: string, speaker?: string) => {
      if (isSpeaking) {
        stopAnyVoice();
        setIsSpeaking(false);
        return;
      }
      const textToSpeak = customText || `${activeMascot.name} says: ${playingLesson.dialogue}`;
      playIndicVoice({
        text: textToSpeak,
        language: 'hi',
        speaker: speaker || activeMascot.voiceSpeaker,
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    },
    [isSpeaking, activeMascot, playingLesson]
  );

  // Open Lesson Modal
  const openLesson = useCallback(
    (index: number) => {
      setActiveLessonIndex(index);
      setSelectedBlocks([]);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(false);
      setLessonModalVisible(true);
      stopAnyVoice();
      setIsSpeaking(false);
    },
    []
  );

  // Toggle code block selection (for arrange questions)
  const toggleBlock = useCallback((block: string) => {
    setSelectedBlocks((prev) =>
      prev.includes(block) ? prev.filter((b) => b !== block) : [...prev, block]
    );
  }, []);

  // Check user's answer
  const checkAnswer = useCallback(() => {
    if (isAnswered) return;

    let correct = false;
    if (playingLesson.type === 'arrange') {
      const target = playingLesson.correctOrder || [];
      correct =
        selectedBlocks.length === target.length &&
        selectedBlocks.every((val, idx) => val === target[idx]);
    } else {
      correct = selectedOption === playingLesson.correctAnswer;
    }

    setIsCorrect(correct);
    setIsAnswered(true);

    if (correct) {
      const newXp = samosaXp + 25;
      setSamosaXp(newXp);
      AsyncStorage.setItem(STORAGE_KEYS.XP, newXp.toString()).catch(() => {});

      // Unlock next node if active
      if (activeLessonIndex === unlockedIndex && unlockedIndex < lessons.length - 1) {
        const nextUnlocked = unlockedIndex + 1;
        setUnlockedByTier((prev) => {
          const updated = { ...prev, [activeTierId]: nextUnlocked };
          AsyncStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(updated)).catch(() => {});
          return updated;
        });
      }

      playIndicVoice({
        text: `${activeMascot.name} says: Wah kya baat hai! Bilkul sahi jawaab!`,
        language: 'hi',
        speaker: activeMascot.voiceSpeaker,
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
      });

      if (activeLessonIndex === lessons.length - 1) {
        setTimeout(() => {
          setLessonModalVisible(false);
          setCelebrationVisible(true);
        }, 1200);
      }
    } else {
      setSamosas((prev) => Math.max(0, prev - 1));
      playIndicVoice({
        text: `${activeMascot.name} says: Arrey dhyan se socho! Fir se try karo!`,
        language: 'hi',
        speaker: activeMascot.voiceSpeaker,
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
      });
    }
  }, [
    isAnswered,
    playingLesson,
    selectedBlocks,
    selectedOption,
    samosaXp,
    activeLessonIndex,
    unlockedIndex,
    lessons.length,
    activeTierId,
    activeMascot,
  ]);

  // Advance to next lesson in modal
  const nextLesson = useCallback(() => {
    if (activeLessonIndex < lessons.length - 1) {
      setActiveLessonIndex((prev) => prev + 1);
      setSelectedBlocks([]);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(false);
      stopAnyVoice();
      setIsSpeaking(false);
    } else {
      setLessonModalVisible(false);
      setCelebrationVisible(true);
    }
  }, [activeLessonIndex, lessons.length]);

  // Reset challenge for retry
  const resetChallenge = useCallback(() => {
    setSelectedBlocks([]);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
  }, []);

  // Claim chest reward
  const claimChest = useCallback(
    (index: number) => {
      const chestKey = `${activeTierId}_chest_${index}`;
      if (claimedChests[chestKey]) return;

      const bonusXp = 50;
      setChestRewardAmount(bonusXp);
      setChestModalVisible(true);

      setClaimedChests((prev) => {
        const next = { ...prev, [chestKey]: true };
        AsyncStorage.setItem(STORAGE_KEYS.CHESTS, JSON.stringify(next)).catch(() => {});
        return next;
      });

      setSamosaXp((prev) => {
        const next = prev + bonusXp;
        AsyncStorage.setItem(STORAGE_KEYS.XP, next.toString()).catch(() => {});
        return next;
      });
    },
    [activeTierId, claimedChests]
  );

  return {
    // State
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

    // Modal Visibilities
    lessonModalVisible,
    setLessonModalVisible,
    guidebookVisible,
    setGuidebookVisible,
    chestModalVisible,
    setChestModalVisible,
    celebrationVisible,
    setCelebrationVisible,
    chestRewardAmount,

    // Lesson interactive state
    selectedBlocks,
    selectedOption,
    setSelectedOption,
    isAnswered,
    isCorrect,
    isSpeaking,

    // Handlers
    handleSelectMascot,
    handleVoiceDialogue,
    openLesson,
    toggleBlock,
    checkAnswer,
    nextLesson,
    resetChallenge,
    claimChest,
  };
}
