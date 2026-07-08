import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/shared/components/layout/Screen';
import { Button } from '@/shared/components/ui/Button';
import { useOnboardingStore } from '@/features/auth/stores/onboardingStore';
import { colors } from '@/theme';

interface GoalOption {
  xp: number;
  label: string;
  description: string;
  icon: string;
  color: string;
  lightColor: string;
}

export default function OnboardingGoals() {
  const router = useRouter();
  const { dailyGoalXP, setDailyGoalXP } = useOnboardingStore();

  const options: GoalOption[] = [
    {
      xp: 10,
      label: 'Easy PEasy',
      description: '10 XP • A great start to building habits!',
      icon: '🌱',
      color: '#48BB78',
      lightColor: '#F0FFF4',
    },
    {
      xp: 20,
      label: 'Regular Route',
      description: '20 XP • Standard daily learning & fitness.',
      icon: '⚡',
      color: '#D69E2E',
      lightColor: '#FEFCBF',
    },
    {
      xp: 50,
      label: 'Serious Stretches',
      description: '50 XP • Dedicated training for health heroes!',
      icon: '🔥',
      color: '#DD6B20',
      lightColor: '#FFFAF0',
    },
  ];

  const handleNext = () => {
    router.push('/(onboarding)/permissions');
  };

  return (
    <Screen scrollable={false}>
      <View className="flex-1 px-5 py-6 justify-between">
        
        {/* Header */}
        <View className="items-center">
          <Text className="font-nunito-extrabold text-heading-lg text-text text-center">
            ⚡ Set Your Daily Goal
          </Text>
          <Text className="font-nunito-medium text-body-md text-text-secondary text-center mt-2">
            How much XP do you want to earn each day?
          </Text>
        </View>

        {/* Goals List */}
        <View className="flex-1 my-6 justify-center">
          <ScrollView showsVerticalScrollIndicator={false}>
            {options.map((item) => {
              const isSelected = dailyGoalXP === item.xp;
              return (
                <TouchableOpacity
                  key={item.xp}
                  onPress={() => setDailyGoalXP(item.xp)}
                  activeOpacity={0.8}
                  style={{
                    borderColor: isSelected ? item.color : colors.text.DEFAULT,
                    borderWidth: 2,
                    borderBottomWidth: isSelected ? 2 : 5,
                    backgroundColor: isSelected ? item.lightColor : '#FFF',
                  }}
                  className="p-5 mb-4 rounded-3xl flex-row items-center justify-between shadow-sm"
                >
                  <View className="flex-row items-center flex-1">
                    <Text className="text-4xl mr-4">{item.icon}</Text>
                    <View className="flex-1">
                      <Text className="font-nunito-extrabold text-body-lg text-text">
                        {item.label}
                      </Text>
                      <Text className="font-nunito-bold text-xs text-text-secondary mt-1">
                        {item.description}
                      </Text>
                    </View>
                  </View>
                  
                  {/* Select Indicator */}
                  <View 
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      borderWidth: 2,
                      borderColor: colors.text.DEFAULT,
                      backgroundColor: isSelected ? item.color : '#FFF',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {isSelected && (
                      <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#FFF' }} />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Action Button */}
        <Button
          variant="primary"
          size="lg"
          onPress={handleNext}
        >
          Next: Finalize
        </Button>
        
      </View>
    </Screen>
  );
}
