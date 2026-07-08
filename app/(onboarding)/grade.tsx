import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function OnboardingGrade() {
  const router = useRouter();
  return (
    <View className="flex-1 bg-background justify-center items-center px-5">
      <Text className="font-nunito-bold text-heading-lg text-text mb-4 text-center">🎓 Select Your Grade</Text>
      <Text className="font-nunito text-body-lg text-text-secondary mb-10 text-center">We will tailor the lessons to your grade level!</Text>
      <Pressable className="bg-primary rounded-button py-4 w-full items-center" onPress={() => router.push('/(onboarding)/interests')}>
        <Text className="font-nunito-bold text-label text-text-oncolor">Next</Text>
      </Pressable>
    </View>
  );
}
