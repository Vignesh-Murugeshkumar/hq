import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function OnboardingAvatar() {
  const router = useRouter();
  return (
    <View className="flex-1 bg-background justify-center items-center px-5">
      <Text className="font-nunito-bold text-heading-lg text-text mb-4 text-center">🎨 Create Your Avatar</Text>
      <Text className="font-nunito text-body-lg text-text-secondary mb-10 text-center">Design a character that looks like you or who you want to be!</Text>
      <Pressable className="bg-primary rounded-button py-4 w-full items-center" onPress={() => router.push('/(onboarding)/username')}>
        <Text className="font-nunito-bold text-label text-text-oncolor">Next</Text>
      </Pressable>
    </View>
  );
}
