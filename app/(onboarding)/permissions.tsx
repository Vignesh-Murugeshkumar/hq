import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function OnboardingPermissions() {
  const router = useRouter();
  return (
    <View className="flex-1 bg-background justify-center items-center px-5">
      <Text className="font-nunito-bold text-heading-lg text-text mb-4 text-center">🔔 Enable Notifications</Text>
      <Text className="font-nunito text-body-lg text-text-secondary mb-10 text-center">Get reminders about streaks and achievements!</Text>
      <Pressable className="bg-primary rounded-button py-4 w-full items-center" onPress={() => router.replace('/(tabs)')}>
        <Text className="font-nunito-bold text-label text-text-oncolor">Finish</Text>
      </Pressable>
    </View>
  );
}
