import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function AdminDashboard() {
  const router = useRouter();
  return (
    <ScrollView className="flex-1 bg-background p-5">
      <Text className="font-nunito-bold text-heading-lg text-text mb-2">Admin Dashboard</Text>
      <Text className="font-nunito text-body-md text-text-secondary mb-6">Manage users, content, challenges, and audit logs.</Text>
      
      <View className="gap-3">
        <Pressable className="bg-surface p-4 rounded-card border-2 border-border" onPress={() => router.push('/(admin)/users')}>
          <Text className="font-nunito-bold text-body-lg text-text">Manage Users</Text>
        </Pressable>
        <Pressable className="bg-surface p-4 rounded-card border-2 border-border" onPress={() => router.push('/(admin)/content/')}>
          <Text className="font-nunito-bold text-body-lg text-text">Content Management</Text>
        </Pressable>
        <Pressable className="bg-surface p-4 rounded-card border-2 border-border" onPress={() => router.push('/(admin)/challenges')}>
          <Text className="font-nunito-bold text-body-lg text-text">Manage Challenges</Text>
        </Pressable>
        <Pressable className="bg-surface p-4 rounded-card border-2 border-border" onPress={() => router.push('/(admin)/analytics')}>
          <Text className="font-nunito-bold text-body-lg text-text">System Analytics</Text>
        </Pressable>
        <Pressable className="bg-surface p-4 rounded-card border-2 border-border" onPress={() => router.push('/(admin)/audit')}>
          <Text className="font-nunito-bold text-body-lg text-text">Audit Logs</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
