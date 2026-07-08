/**
 * Teacher Portal Route Group Layout
 */
import { Stack } from 'expo-router';
import { colors } from '@/theme';

export default function TeacherLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: colors.surface.DEFAULT },
        headerTitleStyle: { fontFamily: 'Nunito_700Bold', color: colors.text.DEFAULT },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Teacher Dashboard' }} />
      <Stack.Screen name="students" options={{ title: 'Manage Students' }} />
      <Stack.Screen name="assign" options={{ title: 'Assign Lessons' }} />
      <Stack.Screen name="analytics" options={{ title: 'Class Analytics' }} />
      <Stack.Screen name="reports" options={{ title: 'Export Reports' }} />
    </Stack>
  );
}
