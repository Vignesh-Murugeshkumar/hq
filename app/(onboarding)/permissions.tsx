import React, { useState } from 'react';
import { View, Text, Switch, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/shared/components/layout/Screen';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { Avatar } from '@/shared/components/ui/Avatar';
import { useOnboardingStore } from '@/features/auth/stores/onboardingStore';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { colors } from '@/theme';

export default function OnboardingPermissions() {
  const router = useRouter();
  const { avatar, nickname, grade, interests, dailyGoalXP, reset } = useOnboardingStore();
  const { completeOnboarding } = useAuthStore();
  
  const [notifications, setNotifications] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFinish = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Trigger the Firebase write to create profiles/{userId} & update users/{userId}
      await completeOnboarding(
        nickname || 'HealthHero',
        avatar,
        grade || 'Grade 3',
        interests.length > 0 ? interests : ['nutrition', 'fitness'],
        dailyGoalXP
      );
      
      // Onboarding complete! Reset onboarding store state
      reset();

      // Enforce navigation to main dashboard
      router.replace('/(tabs)');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scrollable={false}>
      <View className="flex-1 px-5 py-6 justify-between">
        
        {/* Header */}
        <View className="items-center">
          <Text className="font-nunito-extrabold text-heading-lg text-text text-center">
            🚀 Ready for Lift Off?
          </Text>
          <Text className="font-nunito-medium text-body-md text-text-secondary text-center mt-2">
            Just one final step before your adventure begins!
          </Text>
        </View>

        {/* Mascot Banner */}
        <View className="items-center my-4">
          <Card variant="pressable" className="flex-row items-center p-4 bg-white rounded-3xl w-full border-2 border-text shadow-sm">
            <Avatar config={avatar} size={85} />
            <View className="flex-1 ml-4 bg-slate-50 border border-slate-200 p-3 rounded-2xl">
              <Text className="font-nunito-bold text-sm text-text">
                "Welcome to HealthQuest, <Text className="font-nunito-extrabold text-primary">{nickname}</Text>! I will help you unlock achievements and complete healthy daily quests."
              </Text>
            </View>
          </Card>
        </View>

        {/* Permissions Configuration Card */}
        <View className="flex-1 justify-center max-h-[180px] mb-6">
          <Card variant="default" className="p-5 bg-white border-2 border-text rounded-3xl shadow-sm">
            <View className="flex-row justify-between items-center">
              <View className="flex-1 mr-4">
                <Text className="font-nunito-extrabold text-body-lg text-text">
                  🔔 Daily Reminders
                </Text>
                <Text className="font-nunito-bold text-xs text-text-secondary mt-1">
                  Keep your daily streak alive by enabling reminders.
                </Text>
              </View>
              <Switch
                trackColor={{ false: '#CBD5E1', true: colors.primary.light }}
                thumbColor={notifications ? colors.primary.DEFAULT : '#94A3B8'}
                ios_backgroundColor="#CBD5E1"
                onValueChange={setNotifications}
                value={notifications}
              />
            </View>
          </Card>

          {error && (
            <Text className="font-nunito-bold text-xs text-error mt-4 text-center">
              ⚠️ {error}
            </Text>
          )}
        </View>

        {/* Action Button */}
        <Button
          variant="primary"
          size="lg"
          onPress={handleFinish}
          isLoading={loading}
        >
          Start Your Quest!
        </Button>
        
      </View>
    </Screen>
  );
}
