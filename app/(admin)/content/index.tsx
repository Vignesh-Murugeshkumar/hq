import { View, Text, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function AdminContentIndex() {
  const router = useRouter();
  return (
    <ScrollView className="flex-1 bg-background p-5">
      <Text className="font-nunito-bold text-heading-lg text-text mb-2">Content Manager</Text>
      <Text className="font-nunito text-body-md text-text-secondary mb-6">Create lessons, upload videos, and publish quizzes.</Text>
      
      <View className="gap-3">
        <Pressable className="bg-surface p-4 rounded-card border-2 border-border" onPress={() => router.push('/(admin)/content/lessons')}>
          <Text className="font-nunito-bold text-body-lg text-text">Manage Lessons</Text>
        </Pressable>
        <Pressable className="bg-surface p-4 rounded-card border-2 border-border" onPress={() => router.push('/(admin)/content/upload-video')}>
          <Text className="font-nunito-bold text-body-lg text-text">Upload Video</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
