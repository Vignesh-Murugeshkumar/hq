import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function ParentDashboard() {
  const router = useRouter();
  return (
    <ScrollView className="flex-1 bg-background p-5">
      <Text className="font-nunito-bold text-heading-lg text-text mb-2">Parent Portal</Text>
      <Text className="font-nunito text-body-md text-text-secondary mb-6">See how your child is doing on HealthQuest.</Text>
      
      <View className="gap-3">
        <Pressable className="bg-surface p-4 rounded-card border-2 border-border" onPress={() => router.push('/(parent)/progress')}>
          <Text className="font-nunito-bold text-body-lg text-text">Child Progress</Text>
        </Pressable>
        <Pressable className="bg-surface p-4 rounded-card border-2 border-border" onPress={() => router.push('/(parent)/reports')}>
          <Text className="font-nunito-bold text-body-lg text-text">Weekly Reports</Text>
        </Pressable>
        <Pressable className="bg-surface p-4 rounded-card border-2 border-border" onPress={() => router.push('/(parent)/suggestions')}>
          <Text className="font-nunito-bold text-body-lg text-text">Health Suggestions</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
