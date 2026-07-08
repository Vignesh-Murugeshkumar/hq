import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/shared/components/layout/Screen';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { Avatar, SKIN_COLORS, HAIR_COLORS, CLOTHING_COLORS } from '@/shared/components/ui/Avatar';
import { useOnboardingStore } from '@/features/auth/stores/onboardingStore';
import { colors } from '@/theme';

type Category = 'skin' | 'hairStyle' | 'hairColor' | 'expression' | 'clothing' | 'accessory';

interface OptionItem {
  id: string;
  label: string;
  value: string;
}

export default function OnboardingAvatar() {
  const router = useRouter();
  const { avatar, setAvatar } = useOnboardingStore();
  const [activeCategory, setActiveCategory] = useState<Category>('skin');

  // Define customization categories
  const categories: { key: Category; label: string; icon: string }[] = [
    { key: 'skin', label: 'Skin', icon: '🎨' },
    { key: 'hairStyle', label: 'Hair Style', icon: '💇' },
    { key: 'hairColor', label: 'Hair Color', icon: '🌈' },
    { key: 'expression', label: 'Face', icon: '😊' },
    { key: 'clothing', label: 'Outfit', icon: '👕' },
    { key: 'accessory', label: 'Accessory', icon: '🕶️' },
  ];

  // Options lists
  const optionsMap: Record<Category, OptionItem[]> = {
    skin: Object.keys(SKIN_COLORS).map((c) => ({ id: c, label: c.charAt(0).toUpperCase() + c.slice(1), value: c })),
    hairStyle: [
      { id: 'short', label: 'Short', value: 'short' },
      { id: 'spiky', label: 'Spiky', value: 'spiky' },
      { id: 'curly', label: 'Curly', value: 'curly' },
      { id: 'long', label: 'Long', value: 'long' },
    ],
    hairColor: Object.keys(HAIR_COLORS).map((c) => ({ id: c, label: c.charAt(0).toUpperCase() + c.slice(1), value: c })),
    expression: [
      { id: 'smile', label: 'Friendly', value: 'smile' },
      { id: 'happy', label: 'Cheerful', value: 'happy' },
      { id: 'determined', label: 'Heroic', value: 'determined' },
      { id: 'surprised', label: 'Excited', value: 'surprised' },
    ],
    clothing: Object.keys(CLOTHING_COLORS).map((c) => ({ id: c, label: c.charAt(0).toUpperCase() + c.slice(1), value: c })),
    accessory: [
      { id: 'none', label: 'None', value: 'none' },
      { id: 'glasses', label: 'Glasses', value: 'glasses' },
      { id: 'headphones', label: 'Headphones', value: 'headphones' },
      { id: 'crown', label: 'Crown', value: 'crown' },
    ],
  };

  const handleSelectOption = (value: string) => {
    setAvatar({
      ...avatar,
      [activeCategory]: value,
    });
  };

  return (
    <Screen scrollable={false}>
      <View className="flex-1 px-5 py-6 justify-between">
        
        {/* Header */}
        <View className="items-center">
          <Text className="font-nunito-extrabold text-heading-lg text-text text-center">
            🎨 Create Your Avatar
          </Text>
          <Text className="font-nunito-medium text-body-md text-text-secondary text-center mt-2">
            Design a mascot to accompany you on your quests!
          </Text>
        </View>

        {/* Live Preview Display */}
        <View className="items-center justify-center my-6">
          <Card 
            variant="default" 
            className="p-6 bg-white justify-center items-center rounded-3xl"
            style={{ width: 170, height: 170 }}
          >
            <Avatar config={avatar} size={130} />
          </Card>
        </View>

        {/* Category Tabs Selector */}
        <View className="mb-4">
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 4, paddingVertical: 8 }}
          >
            {categories.map((cat) => {
              const isActive = activeCategory === cat.key;
              return (
                <TouchableOpacity
                  key={cat.key}
                  onPress={() => setActiveCategory(cat.key)}
                  activeOpacity={0.8}
                  style={{
                    backgroundColor: isActive ? colors.primary.DEFAULT : '#FFF',
                    borderWidth: 2,
                    borderColor: colors.text.DEFAULT,
                    borderBottomWidth: isActive ? 2 : 4,
                  }}
                  className="px-4 py-2 mr-3 rounded-full flex-row items-center justify-center shadow-sm"
                >
                  <Text className="mr-1 text-base">{cat.icon}</Text>
                  <Text 
                    className={`font-nunito-bold text-sm ${isActive ? 'text-white' : 'text-text'}`}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Option Selection Grid */}
        <View className="flex-1 bg-white border-2 border-text rounded-3xl p-4 mb-6">
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="flex-row flex-wrap justify-between">
              {optionsMap[activeCategory].map((opt) => {
                const isSelected = avatar[activeCategory] === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    onPress={() => handleSelectOption(opt.value)}
                    activeOpacity={0.8}
                    style={{
                      width: '47%',
                      backgroundColor: isSelected ? colors.primary.light : '#F8FAFC',
                      borderColor: isSelected ? colors.primary.DEFAULT : colors.text.DEFAULT,
                      borderWidth: 2,
                      borderBottomWidth: 4,
                    }}
                    className="p-4 mb-4 rounded-2xl items-center justify-center"
                  >
                    {/* Render visual color circles for color tabs */}
                    {activeCategory === 'skin' && (
                      <View 
                        style={{ backgroundColor: SKIN_COLORS[opt.value], width: 30, height: 30 }} 
                        className="rounded-full border border-text mb-2"
                      />
                    )}
                    {activeCategory === 'hairColor' && (
                      <View 
                        style={{ backgroundColor: HAIR_COLORS[opt.value], width: 30, height: 30 }} 
                        className="rounded-full border border-text mb-2"
                      />
                    )}
                    {activeCategory === 'clothing' && (
                      <View 
                        style={{ backgroundColor: CLOTHING_COLORS[opt.value], width: 30, height: 30 }} 
                        className="rounded-full border border-text mb-2"
                      />
                    )}
                    
                    <Text className="font-nunito-bold text-sm text-text text-center">
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>

        {/* Navigation Action */}
        <Button 
          variant="primary" 
          size="lg"
          onPress={() => router.push('/(onboarding)/username')}
        >
          Next: Choose Name
        </Button>
        
      </View>
    </Screen>
  );
}
