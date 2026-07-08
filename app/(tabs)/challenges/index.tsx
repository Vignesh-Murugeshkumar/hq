/**
 * Daily Challenges Screen — Placeholder for Phase 9
 */
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Target, CheckCircle2 } from 'lucide-react-native';
import { CHALLENGE_TYPES } from '@/config/constants';
import { colors } from '@/theme';

export default function ChallengesScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="px-5 py-4 border-b border-border bg-surface">
        <Text className="font-nunito-bold text-heading-lg text-text">Daily Challenges</Text>
        <Text className="font-nunito text-body-md text-text-secondary">
          Complete daily habits and unlock special achievements!
        </Text>
      </View>

      <ScrollView className="flex-1 px-5 pt-4" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center justify-between mb-4 bg-orange/10 border-2 border-orange/20 rounded-card p-4">
          <View>
            <Text className="font-nunito-bold text-heading-sm text-orange">Daily Completion</Text>
            <Text className="font-nunito text-body-sm text-text-secondary">0 of {CHALLENGE_TYPES.length} completed</Text>
          </View>
          <Target size={32} color={colors.orange.DEFAULT} strokeWidth={2.5} />
        </View>

        <View className="gap-3 pb-8">
          {CHALLENGE_TYPES.map((challenge) => (
            <View key={challenge.id} className="bg-surface border-2 border-border rounded-card p-4 flex-row items-center justify-between shadow-card">
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-full bg-surface-alt items-center justify-center">
                  <Text className="text-xl">🎯</Text>
                </View>
                <View>
                  <Text className="font-nunito-bold text-body-lg text-text">{challenge.title}</Text>
                  <Text className="font-nunito text-body-sm text-text-secondary">Goal: {challenge.target} times</Text>
                </View>
              </View>
              <Pressable className="w-8 h-8 rounded-full border-2 border-border items-center justify-center">
                <CheckCircle2 size={20} color={colors.text.secondary} strokeWidth={2.5} />
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
