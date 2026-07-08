/**
 * Home Dashboard — Placeholder for Phase 5
 *
 * Will contain: Avatar, Level, XP Bar, Coins, Badge, Streak,
 * Today's Challenge, Continue Learning, Weekly Progress,
 * Leaderboard Rank, Daily Health Tip, Recent Activity, Quick Actions.
 */
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView className="flex-1 px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="font-nunito text-body-md text-text-secondary">
              Welcome back! 👋
            </Text>
            <Text className="font-nunito-bold text-heading-lg text-text">
              HealthQuest
            </Text>
          </View>
          <View className="w-12 h-12 rounded-full bg-purple items-center justify-center">
            <Text className="text-2xl">🦸</Text>
          </View>
        </View>

        {/* XP Progress Card */}
        <View className="bg-surface rounded-card p-5 mb-4 border-2 border-border">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="font-nunito-bold text-heading-sm text-text">
              Level 1 — Health Rookie
            </Text>
            <Text className="font-nunito-bold text-label text-primary">
              0 XP
            </Text>
          </View>
          <View className="h-3 bg-surface-alt rounded-full overflow-hidden">
            <View className="h-full bg-primary rounded-full" style={{ width: '0%' }} />
          </View>
          <Text className="font-nunito text-body-sm text-text-secondary mt-1">
            0 / 100 XP to Level 2
          </Text>
        </View>

        {/* Stats Row */}
        <View className="flex-row gap-3 mb-4">
          <View className="flex-1 bg-surface rounded-card p-4 border-2 border-border items-center">
            <Text className="text-2xl mb-1">🔥</Text>
            <Text className="font-nunito-extrabold text-heading-md text-orange">0</Text>
            <Text className="font-nunito text-body-sm text-text-secondary">Streak</Text>
          </View>
          <View className="flex-1 bg-surface rounded-card p-4 border-2 border-border items-center">
            <Text className="text-2xl mb-1">🪙</Text>
            <Text className="font-nunito-extrabold text-heading-md text-accent">0</Text>
            <Text className="font-nunito text-body-sm text-text-secondary">Coins</Text>
          </View>
          <View className="flex-1 bg-surface rounded-card p-4 border-2 border-border items-center">
            <Text className="text-2xl mb-1">❤️</Text>
            <Text className="font-nunito-extrabold text-heading-md text-secondary">5</Text>
            <Text className="font-nunito text-body-sm text-text-secondary">Lives</Text>
          </View>
        </View>

        {/* Daily Challenge Card */}
        <View className="bg-surface rounded-card p-5 mb-4 border-2 border-accent">
          <Text className="font-nunito-bold text-heading-sm text-text mb-2">
            🎯 Today's Challenge
          </Text>
          <Text className="font-nunito text-body-lg text-text-secondary">
            Drink 8 glasses of water today!
          </Text>
          <View className="mt-3 bg-primary rounded-button py-3 items-center">
            <Text className="font-nunito-bold text-label text-text-oncolor">
              Start Challenge
            </Text>
          </View>
        </View>

        {/* Continue Learning */}
        <Text className="font-nunito-bold text-heading-sm text-text mb-3">
          📚 Continue Learning
        </Text>
        <View className="bg-surface rounded-card p-5 mb-4 border-2 border-border">
          <Text className="font-nunito text-body-lg text-text-secondary text-center py-6">
            Start your first lesson to see progress here!
          </Text>
        </View>

        {/* Daily Health Tip */}
        <View className="bg-teal/10 rounded-card p-5 mb-8 border-2 border-teal/30">
          <Text className="font-nunito-bold text-heading-sm text-teal mb-2">
            💡 Health Tip
          </Text>
          <Text className="font-nunito text-body-lg text-text">
            Eating colorful fruits and vegetables gives your body different vitamins it needs to stay strong and healthy!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
