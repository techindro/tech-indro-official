/**
 * Gamification Domain Models & Type Definitions
 * Tech Indro Mobile Architecture
 */
import { ImageSourcePropType } from 'react-native';

export type MascotId = 'motu' | 'patlu' | 'chingam' | 'john';

export interface Mascot {
  id: MascotId;
  name: string;
  role: string;
  avatar: ImageSourcePropType;
  voiceSpeaker: string;
  accentColor: string;
  quote: string;
}

export type LessonType = 'arrange' | 'fill_blank' | 'choice';

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  prompt: string;
  dialogue: string;
  codeSnippet?: string;
  blocks?: string[];
  correctOrder?: string[];
  options?: string[];
  correctAnswer?: string;
  explanation: string;
}

export type LevelTierId = 'basic' | 'medium' | 'datascience' | 'aiml';

export interface LevelTier {
  id: LevelTierId;
  title: string;
  badge: string;
  color: string;
  shadowColor: string;
  iconName: any;
  description: string;
  lessons: Lesson[];
}

export interface GamificationProgress {
  streakDays: number;
  samosaXp: number;
  samosas: number;
  unlockedByTier: Record<LevelTierId, number>;
  claimedChests: Record<string, boolean>;
  activeMascotKey: MascotId;
}
