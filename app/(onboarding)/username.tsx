import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Screen } from '@/shared/components/layout/Screen';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { Avatar } from '@/shared/components/ui/Avatar';
import { useOnboardingStore } from '@/features/auth/stores/onboardingStore';
import { colors } from '@/theme';

// Validation schema matching our database constraints
const nameSchema = z.object({
  nickname: z
    .string()
    .min(3, 'Name must be at least 3 letters long')
    .max(15, 'Name must be 15 letters or less')
    .regex(/^[a-zA-Z0-9_\s]+$/, 'Only letters, numbers, and spaces are allowed'),
});

type FormValues = {
  nickname: string;
};

export default function OnboardingUsername() {
  const router = useRouter();
  const { avatar, nickname, setNickname } = useOnboardingStore();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(nameSchema),
    defaultValues: {
      nickname: nickname || '',
    },
  });

  const onSubmit = (data: FormValues) => {
    setNickname(data.nickname.trim());
    router.push('/(onboarding)/grade');
  };

  return (
    <Screen scrollable={false}>
      <View className="flex-1 px-5 py-6 justify-between">
        
        {/* Header */}
        <View className="items-center">
          <Text className="font-nunito-extrabold text-heading-lg text-text text-center">
            👋 What's Your Name?
          </Text>
          <Text className="font-nunito-medium text-body-md text-text-secondary text-center mt-2">
            Choose a nickname for your profile card!
          </Text>
        </View>

        {/* Mascot Banner */}
        <View className="items-center my-4">
          <Card variant="pressable" className="flex-row items-center p-4 bg-white rounded-3xl w-full border-2 border-text shadow-sm">
            <Avatar config={avatar} size={70} />
            <View className="flex-1 ml-4 bg-slate-50 border border-slate-200 p-3 rounded-2xl">
              <Text className="font-nunito-bold text-sm text-text-secondary">
                "Hi! I'm your health buddy. What should I call you?"
              </Text>
            </View>
          </Card>
        </View>

        {/* Name Input Field */}
        <View className="flex-1 justify-center max-h-[160px] mb-6">
          <Text className="font-nunito-bold text-label text-text mb-2 ml-1">
            Nickname
          </Text>
          
          <Controller
            control={control}
            name="nickname"
            render={({ field: { onChange, onBlur, value } }) => (
              <View className="relative">
                <TextInput
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Enter your hero name"
                  placeholderTextColor={colors.text.secondary}
                  className="font-nunito-bold text-body-lg text-text px-5 py-4 bg-slate-50 border-2 rounded-2xl w-full"
                  style={{
                    borderColor: errors.nickname ? colors.error : colors.text.DEFAULT,
                    backgroundColor: '#F8FAFC',
                  }}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>
            )}
          />

          {/* Form Validation Errors */}
          {errors.nickname && (
            <Text className="font-nunito-bold text-xs text-error mt-2 ml-1">
              ⚠️ {errors.nickname.message}
            </Text>
          )}
        </View>

        {/* Action Button */}
        <Button
          variant="primary"
          size="lg"
          onPress={handleSubmit(onSubmit)}
          isLoading={isSubmitting}
        >
          Next: Choose Grade
        </Button>
        
      </View>
    </Screen>
  );
}
