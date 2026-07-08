import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { ArrowLeft } from 'lucide-react-native';
import { db } from '@/config/firebase';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { Card } from '@/shared/components/ui/Card';
import { colors } from '@/theme';

export default function WeeklyReports() {
  const router = useRouter();
  const { user, studentProfile } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [unlockedBadgesCount, setUnlockedBadgesCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    async function loadAchievements() {
      try {
        setLoading(true);
        const unlockedQuery = query(
          collection(db, 'studentAchievements'),
          where('userId', '==', user.uid)
        );
        const snapshot = await getDocs(unlockedQuery);
        setUnlockedBadgesCount(snapshot.size);
      } catch (err) {
        console.error('Failed to load achievements in reports:', err);
      } finally {
        setLoading(false);
      }
    }

    loadAchievements();
  }, [user]);

  if (!studentProfile) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
      </SafeAreaView>
    );
  }

  // Count habits completed today
  const dailyChallenges = studentProfile.dailyChallenges || {};
  const completedHabitsToday = Object.keys(dailyChallenges).filter((key) => {
    // Basic target mapping for display
    let target = 1;
    if (key === 'eat_fruits') target = 3;
    else if (key === 'brush_teeth') target = 2;
    return dailyChallenges[key] >= target;
  });

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Header */}
      <View className="px-5 py-4 border-b border-text bg-white flex-row items-center">
        <TouchableOpacity 
          onPress={() => router.back()}
          activeOpacity={0.7}
          className="mr-3 p-2 bg-slate-100 rounded-full border border-slate-200"
        >
          <ArrowLeft size={22} color={colors.text.DEFAULT} strokeWidth={2.5} />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="font-nunito-extrabold text-heading-lg text-text">📋 Habit Report Card</Text>
          <Text className="font-nunito-bold text-xs text-text-secondary">Summary of child accomplishments</Text>
        </View>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
          <Text className="font-nunito-bold text-text-secondary mt-3">Loading Accomplishments...</Text>
        </View>
      ) : (
        <ScrollView className="flex-1 px-5 pt-5" showsVerticalScrollIndicator={false}>
          <View className="gap-4 pb-10">
            {/* Child Report Overview */}
            <Card variant="default" className="p-5 bg-white border-2 border-text rounded-3xl shadow-sm">
              <Text className="font-nunito-extrabold text-heading-sm text-text mb-4">🌟 Child Stats Summary</Text>
              
              <View className="gap-2.5">
                <View className="flex-row justify-between border-b border-slate-50 pb-2">
                  <Text className="font-nunito-bold text-xs text-text-secondary">Current Level</Text>
                  <Text className="font-nunito-extrabold text-xs text-text">Level {studentProfile.level}</Text>
                </View>
                <View className="flex-row justify-between border-b border-slate-50 pb-2">
                  <Text className="font-nunito-bold text-xs text-text-secondary">Coins Earned</Text>
                  <Text className="font-nunito-extrabold text-xs text-text">{studentProfile.coins} Coins 🪙</Text>
                </View>
                <View className="flex-row justify-between border-b border-slate-50 pb-2">
                  <Text className="font-nunito-bold text-xs text-text-secondary">Total XP</Text>
                  <Text className="font-nunito-extrabold text-xs text-text">{studentProfile.totalXP} XP</Text>
                </View>
                <View className="flex-row justify-between pb-1">
                  <Text className="font-nunito-bold text-xs text-text-secondary">Achievements Unlocked</Text>
                  <Text className="font-nunito-extrabold text-xs text-text">{unlockedBadgesCount} Badges 🏆</Text>
                </View>
              </View>
            </Card>

            {/* Daily Habits Tracked Report Card */}
            <Card variant="default" className="p-5 bg-white border-2 border-text rounded-3xl shadow-sm">
              <Text className="font-nunito-extrabold text-heading-sm text-text mb-3">🥗 Habits Met Today</Text>
              <Text className="font-nunito-medium text-xs text-text-secondary mb-4">
                Here are the healthy habit challenges your child successfully logged and completed today:
              </Text>

              {completedHabitsToday.length === 0 ? (
                <View className="bg-slate-50 border border-slate-200 p-4 rounded-2xl items-center">
                  <Text className="font-nunito-bold text-xs text-text-secondary">No habits completed yet today.</Text>
                </View>
              ) : (
                <View className="gap-2">
                  {completedHabitsToday.map((habit) => {
                    let title = habit;
                    if (habit === 'walk') title = 'Take a Walk 🏃';
                    else if (habit === 'exercise') title = 'Exercise 🏋️';
                    else if (habit === 'sleep_early') title = 'Sleep Early 🌙';
                    else if (habit === 'eat_fruits') title = 'Eat Fruits 🍎';
                    else if (habit === 'meditate') title = 'Meditate 🧘';
                    else if (habit === 'stretch') title = 'Stretch 🙆';
                    else if (habit === 'brush_teeth') title = 'Brush Teeth 🪥';

                    return (
                      <View key={habit} className="bg-emerald-50 border border-emerald-200 px-3.5 py-2.5 rounded-2xl flex-row justify-between items-center">
                        <Text className="font-nunito-extrabold text-xs text-emerald-800 capitalize">{title}</Text>
                        <Text className="font-nunito-extrabold text-[10px] text-emerald-700">Goal Met ✓</Text>
                      </View>
                    );
                  })}
                </View>
              )}
            </Card>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
