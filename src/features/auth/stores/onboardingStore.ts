import { create } from 'zustand';
import { AvatarConfig } from '@/shared/types/database';

interface OnboardingState {
  avatar: AvatarConfig;
  nickname: string;
  grade: string;
  interests: string[];
  dailyGoalXP: number;

  setAvatar: (avatar: AvatarConfig) => void;
  setNickname: (nickname: string) => void;
  setGrade: (grade: string) => void;
  setInterests: (interests: string[]) => void;
  setDailyGoalXP: (xp: number) => void;
  reset: () => void;
}

const defaultAvatar: AvatarConfig = {
  skinColor: 'peach',
  hairStyle: 'short',
  hairColor: 'black',
  expression: 'smile',
  clothing: 'blue',
  accessory: 'none',
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  avatar: defaultAvatar,
  nickname: '',
  grade: '',
  interests: [],
  dailyGoalXP: 20,

  setAvatar: (avatar) => set({ avatar }),
  setNickname: (nickname) => set({ nickname }),
  setGrade: (grade) => set({ grade }),
  setInterests: (interests) => set({ interests }),
  setDailyGoalXP: (dailyGoalXP) => set({ dailyGoalXP }),
  reset: () => set({
    avatar: defaultAvatar,
    nickname: '',
    grade: '',
    interests: [],
    dailyGoalXP: 20,
  }),
}));
