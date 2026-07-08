/**
 * Admin Panel Route Group Layout
 */
import { Stack } from 'expo-router';
import { colors } from '@/theme';

export default function AdminLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: colors.surface.DEFAULT },
        headerTitleStyle: { fontFamily: 'Nunito_700Bold', color: colors.text.DEFAULT },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Admin Dashboard' }} />
      <Stack.Screen name="users" options={{ title: 'Manage Users' }} />
      <Stack.Screen name="content/index" options={{ title: 'Content Management' }} />
      <Stack.Screen name="challenges" options={{ title: 'Manage Challenges' }} />
      <Stack.Screen name="analytics" options={{ title: 'System Analytics' }} />
      <Stack.Screen name="audit" options={{ title: 'Audit Logs' }} />
    </Stack>
  );
}
