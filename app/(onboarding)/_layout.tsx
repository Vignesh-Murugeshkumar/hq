/**
 * Onboarding Route Group Layout
 *
 * Stack navigation for onboarding screens.
 */
import { Stack } from 'expo-router';
import { colors } from '@/theme';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_bottom',
      }}
    >
      <Stack.Screen name="avatar" />
      <Stack.Screen name="username" />
      <Stack.Screen name="grade" />
      <Stack.Screen name="interests" />
      <Stack.Screen name="goals" />
      <Stack.Screen name="permissions" />
    </Stack>
  );
}
