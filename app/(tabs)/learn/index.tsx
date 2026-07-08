/**
 * Learning Categories Screen — Placeholder for Phase 6
 *
 * Displays learning categories: Nutrition, Exercise, Hydration, Sleep, Mental Health, Hygiene.
 */
import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookOpen, Apple, Dumbbell, Droplet, Moon, Brain, Sparkles } from 'lucide-react-native';
import { LEARNING_CATEGORIES } from '@/config/constants';
import { colors } from '@/theme';

const iconMap: Record<string, React.ComponentType<any>> = {
  apple: Apple,
  dumbbell: Dumbbell,
  droplets: Droplet,
  moon: Moon,
  brain: Brain,
  sparkles: Sparkles,
};

export default function LearnScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="px-5 py-4 border-b border-border bg-surface">
        <Text className="font-nunito-bold text-heading-lg text-text">Learn</Text>
        <Text className="font-nunito text-body-md text-text-secondary">
          Choose a topic and earn XP & Coins!
        </Text>
      </View>

      <ScrollView className="flex-1 px-5 pt-4" showsVerticalScrollIndicator={false}>
        <View className="flex-row flex-wrap gap-4 pb-8">
          {LEARNING_CATEGORIES.map((category) => {
            const IconComponent = iconMap[category.icon] || BookOpen;
            return (
              <Pressable
                key={category.id}
                style={{ borderColor: category.color + '30' }}
                className="w-[47%] bg-surface border-2 rounded-card p-5 items-center shadow-card"
              >
                <View
                  style={{ backgroundColor: category.color + '15' }}
                  className="w-14 h-14 rounded-full items-center justify-center mb-3"
                >
                  <IconComponent size={28} color={category.color} strokeWidth={2.5} />
                </View>
                <Text className="font-nunito-bold text-heading-sm text-text text-center">
                  {category.name}
                </Text>
                <Text className="font-nunito text-body-sm text-text-secondary text-center mt-1">
                  0% Completed
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
