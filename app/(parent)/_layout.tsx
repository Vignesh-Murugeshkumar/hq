/**
 * Parent Portal Route Group Layout
 */
import { Stack } from 'expo-router';
import { colors } from '@/theme';

export default function ParentLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: colors.surface.DEFAULT },
        headerTitleStyle: { fontFamily: 'Nunito_700Bold', color: colors.text.DEFAULT },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Parent Dashboard' }} />
      <Stack.Screen name="progress" options={{ title: 'Child Progress' }} />
      <Stack.Screen name="reports" options={{ title: 'Weekly Reports' }} />
      <Stack.Screen name="suggestions" options={{ title: 'Health Suggestions' }} />
    </Stack>
  );
}
