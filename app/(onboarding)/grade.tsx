import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/shared/components/layout/Screen';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { useOnboardingStore } from '@/features/auth/stores/onboardingStore';
import { colors } from '@/theme';

interface GradeOption {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
}

export default function OnboardingGrade() {
  const router = useRouter();
  const { grade, setGrade } = useOnboardingStore();

  const gradesList: GradeOption[] = [
    { id: 'Preschool', title: 'Preschool', subtitle: 'Ages 3-4', icon: '🎨' },
    { id: 'Kindergarten', title: 'Kindergarten', subtitle: 'Ages 5-6', icon: '🎒' },
    { id: 'Grade 1', title: 'Grade 1', subtitle: 'Ages 6-7', icon: '📝' },
    { id: 'Grade 2', title: 'Grade 2', subtitle: 'Ages 7-8', icon: '📐' },
    { id: 'Grade 3', title: 'Grade 3', subtitle: 'Ages 8-9', icon: '🧪' },
    { id: 'Grade 4', title: 'Grade 4', subtitle: 'Ages 9-10', icon: '📚' },
    { id: 'Grade 5', title: 'Grade 5', subtitle: 'Ages 10-11', icon: '🏆' },
  ];

  const handleNext = () => {
    if (!grade) return;
    router.push('/(onboarding)/interests');
  };

  return (
    <Screen scrollable={false}>
      <View className="flex-1 px-5 py-6 justify-between">
        
        {/* Header */}
        <View className="items-center">
          <Text className="font-nunito-extrabold text-heading-lg text-text text-center">
            🎒 What's Your Grade?
          </Text>
          <Text className="font-nunito-medium text-body-md text-text-secondary text-center mt-2">
            This helps us choose the best lessons for you!
          </Text>
        </View>

        {/* Grade Grid */}
        <View className="flex-1 my-6">
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 16 }}>
            <View className="flex-row flex-wrap justify-between">
              {gradesList.map((item) => {
                const isSelected = grade === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => setGrade(item.id)}
                    activeOpacity={0.8}
                    style={{
                      width: '48%',
                      borderColor: isSelected ? colors.primary.DEFAULT : colors.text.DEFAULT,
                      borderWidth: 2,
                      borderBottomWidth: isSelected ? 2 : 4,
                      backgroundColor: isSelected ? colors.primary.light : '#FFF',
                    }}
                    className="p-4 mb-4 rounded-3xl items-center justify-center shadow-sm"
                  >
                    <Text className="text-3xl mb-2">{item.icon}</Text>
                    <Text className="font-nunito-extrabold text-sm text-text text-center">
                      {item.title}
                    </Text>
                    <Text className="font-nunito-bold text-xs text-text-secondary mt-1 text-center">
                      {item.subtitle}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>

        {/* Next Action */}
        <Button
          variant="primary"
          size="lg"
          onPress={handleNext}
          disabled={!grade}
        >
          Next: Pick Interests
        </Button>
        
      </View>
    </Screen>
  );
}
