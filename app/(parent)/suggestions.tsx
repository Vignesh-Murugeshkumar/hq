import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { Card } from '@/shared/components/ui/Card';
import { colors } from '@/theme';

export default function HealthSuggestions() {
  const router = useRouter();
  const { studentProfile } = useAuthStore();

  if (!studentProfile) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center">
        <Text className="font-nunito-bold text-text-secondary">Loading...</Text>
      </SafeAreaView>
    );
  }

  const glasses = (studentProfile as any).waterIntake || 0;
  const walkGoal = ((studentProfile.dailyChallenges || {})['walk'] || 0) >= 1;

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
          <Text className="font-nunito-extrabold text-heading-lg text-text">💡 Health Suggestions</Text>
          <Text className="font-nunito-bold text-xs text-text-secondary">Actionable advice tailored to your child</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-5 pt-5" showsVerticalScrollIndicator={false}>
        <View className="gap-4 pb-10">
          
          {/* Suggestion 1: Dynamic Hydration */}
          {glasses < 8 ? (
            <Card variant="default" className="p-5 bg-blue-50 border-2 border-blue-200 rounded-3xl shadow-sm">
              <Text className="font-nunito-extrabold text-heading-sm text-blue-900 mb-2">💧 Pack a Hydration Companion</Text>
              <Text className="font-nunito-medium text-body-md text-blue-800 leading-6">
                Your child's logged hydration count is low today ({glasses} of 8 glasses). Try packing a fun, insulated water bottle in their backpack or play a "hydration race" game at dinner to encourage drinking more water!
              </Text>
            </Card>
          ) : (
            <Card variant="default" className="p-5 bg-emerald-50 border-2 border-emerald-200 rounded-3xl shadow-sm">
              <Text className="font-nunito-extrabold text-heading-sm text-emerald-900 mb-2">🎉 Exceptional Hydration!</Text>
              <Text className="font-nunito-medium text-body-md text-emerald-800 leading-6">
                Excellent work! Your child completed their hydration quest today! Keep encouraging them to drink fresh water instead of sugary drinks.
              </Text>
            </Card>
          )}

          {/* Suggestion 2: Activity habits */}
          {!walkGoal ? (
            <Card variant="default" className="p-5 bg-orange-50 border-2 border-orange-200 rounded-3xl shadow-sm">
              <Text className="font-nunito-extrabold text-heading-sm text-orange-950 mb-2">🚶 Encourage Outdoor Playtime</Text>
              <Text className="font-nunito-medium text-body-md text-orange-900 leading-6">
                It looks like your child hasn't logged their daily walk/pedometer goal yet. Try scheduling 15 minutes of outdoor family playtime, tag, or a quick neighborhood stroll after homework to keep active!
              </Text>
            </Card>
          ) : (
            <Card variant="default" className="p-5 bg-emerald-50 border-2 border-emerald-200 rounded-3xl shadow-sm">
              <Text className="font-nunito-extrabold text-heading-sm text-emerald-900 mb-2">🏃 Active Day Verified!</Text>
              <Text className="font-nunito-medium text-body-md text-emerald-800 leading-6">
                Great job! Your child successfully logged their walk challenge today, helping them build strong muscles and cards!
              </Text>
            </Card>
          )}

          {/* Suggestion 3: General Nutrition */}
          <Card variant="default" className="p-5 bg-white border-2 border-text rounded-3xl shadow-sm">
            <Text className="font-nunito-extrabold text-heading-sm text-text mb-2">🍏 Colorful Fruit Challenge</Text>
            <Text className="font-nunito-medium text-body-md text-text-secondary leading-6">
              When serving meals, encourage your child to "eat the colors of the rainbow". Different colored fruits and vegetables provide a variety of essential vitamins, helping them grow big, strong, and think clearly!
            </Text>
          </Card>

          {/* Suggestion 4: Sleep Habits */}
          <Card variant="default" className="p-5 bg-white border-2 border-text rounded-3xl shadow-sm">
            <Text className="font-nunito-extrabold text-heading-sm text-text mb-2">🌙 Cartoon Bedtime Routine</Text>
            <Text className="font-nunito-medium text-body-md text-text-secondary leading-6">
              Establish a consistent bedtime routine by powering down screens 1 hour before bed. Encourage reading a book together in bed to calm their active minds and achieve restful, restorative sleep.
            </Text>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
