/**
 * Quiz Hub Screen — Placeholder for Phase 7
 */
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HelpCircle, Star, Trophy } from 'lucide-react-native';
import { colors } from '@/theme';

export default function QuizScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="px-5 py-4 border-b border-border bg-surface">
        <Text className="font-nunito-bold text-heading-lg text-text">Quiz Hub</Text>
        <Text className="font-nunito text-body-md text-text-secondary">
          Test your knowledge and prove your skills!
        </Text>
      </View>

      <ScrollView className="flex-1 px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* Playable Quiz Option */}
        <View className="bg-surface rounded-card p-5 border-2 border-border mb-4 shadow-card">
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center gap-2">
              <HelpCircle size={22} color={colors.purple.DEFAULT} strokeWidth={2.5} />
              <Text className="font-nunito-bold text-heading-sm text-text">Daily Quiz Challenge</Text>
            </View>
            <View className="bg-accent/20 px-3 py-1 rounded-badge">
              <Text className="font-nunito-bold text-label-sm text-accent-dark">Bonus Coins</Text>
            </View>
          </View>
          <Text className="font-nunito text-body-md text-text-secondary mb-4">
            Answer 5 quick questions about health and safety to earn extra XP!
          </Text>
          <Pressable className="bg-purple rounded-button py-3.5 items-center">
            <Text className="font-nunito-bold text-label text-text-oncolor">Play Now</Text>
          </Pressable>
        </View>

        {/* Quiz Difficulty Sections */}
        <Text className="font-nunito-bold text-heading-sm text-text mb-3 mt-2">Practice Quizzes</Text>
        
        <View className="flex-row gap-3 mb-4">
          <Pressable className="flex-1 bg-surface border-2 border-success/30 rounded-card p-4 items-center">
            <Trophy size={28} color={colors.success} strokeWidth={2.5} />
            <Text className="font-nunito-bold text-body-lg text-text mt-2">Easy</Text>
            <Text className="font-nunito text-body-sm text-text-secondary">Grade 3-4</Text>
          </Pressable>

          <Pressable className="flex-1 bg-surface border-2 border-warning/30 rounded-card p-4 items-center">
            <Star size={28} color={colors.warning} strokeWidth={2.5} />
            <Text className="font-nunito-bold text-body-lg text-text mt-2">Medium</Text>
            <Text className="font-nunito text-body-sm text-text-secondary">Grade 4-5</Text>
          </Pressable>

          <Pressable className="flex-1 bg-surface border-2 border-secondary/30 rounded-card p-4 items-center">
            <Trophy size={28} color={colors.secondary.DEFAULT} strokeWidth={2.5} />
            <Text className="font-nunito-bold text-body-lg text-text mt-2">Hard</Text>
            <Text className="font-nunito text-body-sm text-text-secondary">Grade 5-6</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
