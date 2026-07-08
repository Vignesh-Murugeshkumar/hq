/**
 * HealthQuest — App Entry Point
 *
 * Redirects to the appropriate route based on auth state.
 * The actual routing logic is in _layout.tsx.
 */
import { Redirect } from 'expo-router';
import { useAuthStore } from '@/features/auth/stores/authStore';

export default function Index() {
  const { user } = useAuthStore();

  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/login" />;
}
