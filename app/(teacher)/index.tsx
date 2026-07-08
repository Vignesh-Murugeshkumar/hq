import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function TeacherDashboard() {
  const router = useRouter();
  return (
    <ScrollView className="flex-1 bg-background p-5">
      <Text className="font-nunito-bold text-heading-lg text-text mb-2">Class Dashboard</Text>
      <Text className="font-nunito text-body-md text-text-secondary mb-6">Manage assignments and track student progress.</Text>
      
      <View className="gap-3">
        <Pressable className="bg-surface p-4 rounded-card border-2 border-border" onPress={() => router.push('/(teacher)/students')}>
          <Text className="font-nunito-bold text-body-lg text-text">Manage Students</Text>
        </Pressable>
        <Pressable className="bg-surface p-4 rounded-card border-2 border-border" onPress={() => router.push('/(teacher)/assign')}>
          <Text className="font-nunito-bold text-body-lg text-text">Assign Lessons</Text>
        </Pressable>
        <Pressable className="bg-surface p-4 rounded-card border-2 border-border" onPress={() => router.push('/(teacher)/analytics')}>
          <Text className="font-nunito-bold text-body-lg text-text">View Analytics</Text>
        </Pressable>
        <Pressable className="bg-surface p-4 rounded-card border-2 border-border" onPress={() => router.push('/(teacher)/reports')}>
          <Text className="font-nunito-bold text-body-lg text-text">Export Reports</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
