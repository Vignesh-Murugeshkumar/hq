import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/shared/components/layout/Screen';
import { Button } from '@/shared/components/ui/Button';
import { useOnboardingStore } from '@/features/auth/stores/onboardingStore';
import { colors } from '@/theme';

interface InterestOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  lightColor: string;
}

export default function OnboardingInterests() {
  const router = useRouter();
  const { interests, setInterests } = useOnboardingStore();

  const options: InterestOption[] = [
    {
      id: 'nutrition',
      title: 'Healthy Eating',
      description: 'Discover yummy food that makes you strong!',
      icon: '🍎',
      color: '#E53E3E',
      lightColor: '#FFF5F5',
    },
    {
      id: 'fitness',
      title: 'Staying Active',
      description: 'Fun games and exercises to keep you moving!',
      icon: '🏃',
      color: '#3182CE',
      lightColor: '#EBF8FF',
    },
    {
      id: 'sleep',
      title: 'Sweet Dreams',
      description: 'Learn why sleeping gives you superpowers!',
      icon: '💤',
      color: '#805AD5',
      lightColor: '#F3E8FF',
    },
    {
      id: 'hygiene',
      title: 'Sparkling Clean',
      description: 'Fend off germs by washing and brushing!',
      icon: '🧼',
      color: '#319795',
      lightColor: '#E6FFFA',
    },
  ];

  const handleToggle = (id: string) => {
    if (interests.includes(id)) {
      setInterests(interests.filter((i) => i !== id));
    } else {
      setInterests([...interests, id]);
    }
  };

  const handleNext = () => {
    // Navigate even if none selected (optional, but let's default to all if none selected)
    if (interests.length === 0) {
      setInterests(['nutrition', 'fitness', 'sleep', 'hygiene']);
    }
    router.push('/(onboarding)/goals');
  };

  return (
    <Screen scrollable={false}>
      <View className="flex-1 px-5 py-6 justify-between">
        
        {/* Header */}
        <View className="items-center">
          <Text className="font-nunito-extrabold text-heading-lg text-text text-center">
            🌟 What Interests You?
          </Text>
          <Text className="font-nunito-medium text-body-md text-text-secondary text-center mt-2">
            Select your favorite topics to explore first!
          </Text>
        </View>

        {/* Interests Grid */}
        <View className="flex-1 my-6 justify-center">
          <ScrollView showsVerticalScrollIndicator={false}>
            {options.map((item) => {
              const isSelected = interests.includes(item.id);
              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => handleToggle(item.id)}
                  activeOpacity={0.8}
                  style={{
                    borderColor: isSelected ? item.color : colors.text.DEFAULT,
                    borderWidth: 2,
                    borderBottomWidth: isSelected ? 2 : 5,
                    backgroundColor: isSelected ? item.lightColor : '#FFF',
                  }}
                  className="p-4 mb-4 rounded-3xl flex-row items-center shadow-sm"
                >
                  <Text className="text-4xl mr-4">{item.icon}</Text>
                  <View className="flex-1">
                    <Text className="font-nunito-extrabold text-body-lg text-text">
                      {item.title}
                    </Text>
                    <Text className="font-nunito-bold text-xs text-text-secondary mt-1">
                      {item.description}
                    </Text>
                  </View>
                  
                  {/* Visual Checkbox Indicator */}
                  <View 
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      borderWidth: 2,
                      borderColor: colors.text.DEFAULT,
                      backgroundColor: isSelected ? colors.primary.DEFAULT : '#FFF',
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
          Next: Set Daily Goal
        </Button>
        
      </View>
    </Screen>
  );
}
