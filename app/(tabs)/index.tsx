import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { Avatar } from '@/shared/components/ui/Avatar';
import { Card } from '@/shared/components/ui/Card';
import { useNotification } from '@/shared/components/ui/NotificationContext';
import { checkAndAwardAchievement } from '@/shared/utils/achievements';
import { colors } from '@/theme';

export default function HomeScreen() {
  const { user, profile, studentProfile, updateStudentProfile } = useAuthStore();
  const { showNotification } = useNotification();

  // If loading or profile does not exist yet
  if (!profile || !studentProfile) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
        <Text className="font-nunito-bold text-text-secondary mt-3">Loading Dashboard...</Text>
      </SafeAreaView>
    );
  }

  // Calculate XP progress towards the daily goal
  const dailyGoal = studentProfile.dailyGoalXP || 20;
  const currentXP = studentProfile.totalXP || 0;
  const xpPercentage = Math.min(Math.round((currentXP / dailyGoal) * 100), 100);

  // Read hydration glasses (stored in studentProfile, default to 0)
  const glasses = (studentProfile as any).waterIntake || 0;
  const goalGlasses = 8;
  const isHydrated = glasses >= goalGlasses;

  const handleUpdateWater = async (increment: number) => {
    const newGlasses = Math.max(0, glasses + increment);
    const updates: any = { waterIntake: newGlasses };

    // Award bonus if reaching 8 glasses for the first time
    if (newGlasses === goalGlasses && glasses < goalGlasses) {
      updates.coins = (studentProfile.coins || 0) + 10;
      updates.totalXP = (studentProfile.totalXP || 0) + 15;

      if (user) {
        checkAndAwardAchievement(user.uid, 'ach_water_goal', (title, icon) => {
          showNotification({
            title: `🏆 Achievement Unlocked: ${title}!`,
            message: `You unlocked the ${icon} badge for drinking 8 glasses of water today!`,
            type: 'achievement',
          });
        });
      }
    } 
    // Deduct bonus if downgrading below 8 glasses
    else if (newGlasses < goalGlasses && glasses >= goalGlasses) {
      updates.coins = Math.max(0, (studentProfile.coins || 0) - 10);
      updates.totalXP = Math.max(0, (studentProfile.totalXP || 0) - 15);
    }

    await updateStudentProfile(updates);
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView className="flex-1 px-5 pt-4" showsVerticalScrollIndicator={false}>
        
        {/* Top Header Section */}
        <View className="flex-row items-center justify-between mb-5">
          <View>
            <Text className="font-nunito text-body-md text-text-secondary">
              Welcome back! 👋
            </Text>
            <Text className="font-nunito-extrabold text-heading-lg text-text">
              {studentProfile.nickname}
            </Text>
          </View>
          <TouchableOpacity activeOpacity={0.8}>
            <Card variant="pressable" className="p-1 bg-white rounded-full border-2 border-text shadow-sm">
              <Avatar config={studentProfile.avatar} size={48} />
            </Card>
          </TouchableOpacity>
        </View>

        {/* Daily XP Progress Bar Card */}
        <Card variant="default" className="p-5 bg-white border-2 border-text rounded-3xl mb-4 shadow-sm">
          <View className="flex-row items-center justify-between mb-3">
            <View>
              <Text className="font-nunito-extrabold text-heading-sm text-text">
                Level {studentProfile.level}
              </Text>
              <Text className="font-nunito-bold text-xs text-text-secondary">
                Daily Goal: {dailyGoal} XP
              </Text>
            </View>
            <Text className="font-nunito-extrabold text-body-lg text-primary">
              {currentXP} / {dailyGoal} XP
            </Text>
          </View>

          {/* Duolingo-style Progress Bar */}
          <View className="h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <View 
              className="h-full bg-primary rounded-full" 
              style={{ width: `${xpPercentage}%`, backgroundColor: colors.primary.DEFAULT }} 
            />
          </View>
          
          <Text className="font-nunito-semibold text-xs text-text-secondary mt-2">
            {xpPercentage >= 100 
              ? '🎉 Daily goal completed! Keep it up!' 
              : `Earn ${dailyGoal - currentXP} more XP to reach your daily goal!`}
          </Text>
        </Card>

        {/* Stats Summary Row */}
        <View className="flex-row gap-3 mb-5">
          {/* Streak Flame */}
          <View className="flex-1 bg-white rounded-2xl p-4 border-2 border-text items-center shadow-sm">
            <Text className="text-3xl mb-1">🔥</Text>
            <Text className="font-nunito-extrabold text-heading-md text-orange">
              {studentProfile.streakCount || 0}
            </Text>
            <Text className="font-nunito-bold text-xs text-text-secondary">Streak</Text>
          </View>
          
          {/* Coins Balance */}
          <View className="flex-1 bg-white rounded-2xl p-4 border-2 border-text items-center shadow-sm">
            <Text className="text-3xl mb-1">🪙</Text>
            <Text className="font-nunito-extrabold text-heading-md text-yellow-500">
              {studentProfile.coins || 0}
            </Text>
            <Text className="font-nunito-bold text-xs text-text-secondary">Coins</Text>
          </View>
          
          {/* Energy Hearts */}
          <View className="flex-1 bg-white rounded-2xl p-4 border-2 border-text items-center shadow-sm">
            <Text className="text-3xl mb-1">⚡</Text>
            <Text className="font-nunito-extrabold text-heading-md text-purple-600">
              {studentProfile.energy || 100}
            </Text>
            <Text className="font-nunito-bold text-xs text-text-secondary">Energy</Text>
          </View>
        </View>

        {/* Interactive Dynamic Daily Challenge Card (Hydration Tracker) */}
        <Card 
          variant="default" 
          className="p-5 bg-white mb-5 rounded-3xl border-2 shadow-sm"
          style={{ borderColor: isHydrated ? colors.primary.DEFAULT : '#3182CE' }}
        >
          <View className="flex-row justify-between items-center mb-3">
            <Text className="font-nunito-extrabold text-heading-sm text-text">
              💧 Daily Hydration Quest
            </Text>
            <Text className="font-nunito-extrabold text-sm text-blue-600">
              {glasses} / {goalGlasses} Cups
            </Text>
          </View>

          <Text className="font-nunito-medium text-body-md text-text-secondary mb-4">
            Drink 8 glasses of water today to stay hydrated and energized!
          </Text>

          {/* Visual Glass Tracker Indicators */}
          <View className="flex-row justify-between mb-4 px-1">
            {Array.from({ length: goalGlasses }).map((_, idx) => {
              const filled = idx < glasses;
              return (
                <Text 
                  key={idx} 
                  className={`text-2xl ${filled ? 'opacity-100' : 'opacity-20 grayscale'}`}
                  style={{ transform: [{ scale: filled ? 1.15 : 1 }] }}
                >
                  🥛
                </Text>
              );
            })}
          </View>

          {/* Log Buttons */}
          <View className="flex-row justify-between gap-3">
            <TouchableOpacity
              onPress={() => handleUpdateWater(-1)}
              activeOpacity={0.8}
              disabled={glasses === 0}
              className="flex-1 py-3 border-2 border-text rounded-2xl bg-slate-50 border-b-4 items-center justify-center"
              style={{ opacity: glasses === 0 ? 0.5 : 1 }}
            >
              <Text className="font-nunito-extrabold text-base text-text">Remove Cup</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleUpdateWater(1)}
              activeOpacity={0.8}
              className="flex-1 py-3 border-2 border-text rounded-2xl bg-blue-500 border-b-4 items-center justify-center"
              style={{ backgroundColor: '#3182CE' }}
            >
              <Text className="font-nunito-extrabold text-base text-white">Log Cup 🥛</Text>
            </TouchableOpacity>
          </View>

          {/* Celebration Success Overlay Banner */}
          {isHydrated && (
            <View className="mt-4 bg-emerald-50 border border-emerald-200 p-3 rounded-2xl items-center">
              <Text className="font-nunito-bold text-xs text-emerald-800 text-center">
                🎉 Awesome job! You completed the challenge! (+10 🪙, +15 ⚡)
              </Text>
            </View>
          )}
        </Card>

        {/* Leaderboards Showcase Card */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push('/leaderboard')}
        >
          <Card 
            className="p-5 bg-white mb-5 rounded-3xl border-2 border-text shadow-sm"
          >
            <View className="flex-row justify-between items-center mb-3">
              <Text className="font-nunito-extrabold text-heading-sm text-text">
                🏆 Hero Leaderboard
              </Text>
              <View className="flex-row items-center">
                <Text className="font-nunito-extrabold text-xs text-primary mr-1">View All</Text>
                <ChevronRight size={16} color={colors.primary.DEFAULT} strokeWidth={3} />
              </View>
            </View>
            <Text className="font-nunito-medium text-body-md text-text-secondary mb-4">
              See how your XP compares with other players in the game!
            </Text>
            <View className="flex-row items-center bg-slate-50 border border-slate-200 p-3.5 rounded-2xl justify-between">
              <View className="flex-row items-center">
                <Text className="text-2xl mr-2.5">👑</Text>
                <Text className="font-nunito-extrabold text-body-md text-text">
                  Rankings Board Active
                </Text>
              </View>
              <View className="bg-purple/10 px-3 py-1 rounded-full border border-purple/20">
                <Text className="font-nunito-extrabold text-[10px] text-purple">
                  TOP 50
                </Text>
              </View>
            </View>
          </Card>
        </TouchableOpacity>

        {/* Continue Learning Course Section */}
        <Text className="font-nunito-extrabold text-heading-sm text-text mb-3">
          📚 Continue Learning
        </Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push('/learn/lesson_nutrition_1')}
        >
          <Card className="p-5 bg-white border-2 border-text rounded-3xl mb-5 shadow-sm">
            <View className="flex-row items-center">
              <Text className="text-4xl mr-4">🍎</Text>
              <View className="flex-1">
                <Text className="font-nunito-extrabold text-body-lg text-text">
                  Intro to Nutrition
                </Text>
                <Text className="font-nunito-bold text-xs text-text-secondary mt-1">
                  Learn why colorful fruits are like superpowers!
                </Text>
              </View>
            </View>
          </Card>
        </TouchableOpacity>

        {/* Daily Health Tip Panel */}
        <Card variant="default" className="p-5 bg-teal-50 border-2 border-teal-200 rounded-3xl mb-8 shadow-sm">
          <Text className="font-nunito-extrabold text-heading-sm text-teal-800 mb-2">
            💡 Health Tip of the Day
          </Text>
          <Text className="font-nunito-medium text-body-md text-teal-900 leading-6">
            Eating colorful fruits and vegetables gives your body different vitamins it needs to grow big, strong, and think clearly!
          </Text>
        </Card>

      </ScrollView>
    </SafeAreaView>
  );
}
