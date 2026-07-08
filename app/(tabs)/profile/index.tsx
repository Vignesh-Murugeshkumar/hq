/**
 * User Profile Screen — Placeholder for Phase 8/Profile
 */
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, LogOut, Settings, ShieldAlert, Award } from 'lucide-react-native';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { colors } from '@/theme';

export default function ProfileScreen() {
  const { signOut, user } = useAuthStore();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="px-5 py-4 border-b border-border bg-surface flex-row items-center justify-between">
        <Text className="font-nunito-bold text-heading-lg text-text">My Profile</Text>
        <Pressable className="p-2 bg-surface-alt rounded-full">
          <Settings size={22} color={colors.text.DEFAULT} strokeWidth={2.5} />
        </Pressable>
      </View>

      <ScrollView className="flex-1 px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* User Card */}
        <View className="bg-surface border-2 border-border rounded-card p-6 items-center shadow-card mb-6">
          <View className="w-24 h-24 rounded-full bg-purple/10 border-4 border-purple items-center justify-center mb-4">
            <Text className="text-5xl">🦸</Text>
          </View>
          <Text className="font-nunito-bold text-heading-lg text-text">Health Hero</Text>
          <Text className="font-nunito text-body-md text-text-secondary mb-4">{user?.email}</Text>
          
          <View className="flex-row gap-6 mt-2 border-t border-border pt-4 w-full justify-around">
            <View className="items-center">
              <Text className="font-nunito-extrabold text-heading-sm text-primary">Level 1</Text>
              <Text className="font-nunito text-body-sm text-text-secondary">Rank</Text>
            </View>
            <View className="items-center">
              <Text className="font-nunito-extrabold text-heading-sm text-accent-dark">0</Text>
              <Text className="font-nunito text-body-sm text-text-secondary">Coins</Text>
            </View>
            <View className="items-center">
              <Text className="font-nunito-extrabold text-heading-sm text-purple">0</Text>
              <Text className="font-nunito text-body-sm text-text-secondary">XP</Text>
            </View>
          </View>
        </View>

        {/* Portals Access (Quick Actions) */}
        <Text className="font-nunito-bold text-heading-sm text-text mb-3">Portals</Text>
        <View className="bg-surface border-2 border-border rounded-card p-4 gap-3 mb-6 shadow-card">
          <Pressable className="flex-row items-center justify-between p-3 bg-surface-alt rounded-button">
            <View className="flex-row items-center gap-3">
              <Award size={20} color={colors.primary.DEFAULT} strokeWidth={2.5} />
              <Text className="font-nunito-bold text-body-lg text-text">Teacher Portal</Text>
            </View>
          </Pressable>
          <Pressable className="flex-row items-center justify-between p-3 bg-surface-alt rounded-button">
            <View className="flex-row items-center gap-3">
              <User size={20} color={colors.purple.DEFAULT} strokeWidth={2.5} />
              <Text className="font-nunito-bold text-body-lg text-text">Parent Portal</Text>
            </View>
          </Pressable>
          <Pressable className="flex-row items-center justify-between p-3 bg-surface-alt rounded-button">
            <View className="flex-row items-center gap-3">
              <ShieldAlert size={20} color={colors.secondary.DEFAULT} strokeWidth={2.5} />
              <Text className="font-nunito-bold text-body-lg text-text">Admin Panel</Text>
            </View>
          </Pressable>
        </View>

        {/* Logout Button */}
        <Pressable
          onPress={() => signOut()}
          className="bg-secondary rounded-button py-4 items-center mb-8 flex-row justify-center gap-2 border-2 border-secondary-dark"
        >
          <LogOut size={20} color={colors.text.onColor} strokeWidth={2.5} />
          <Text className="font-nunito-bold text-label text-text-oncolor">Log Out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
