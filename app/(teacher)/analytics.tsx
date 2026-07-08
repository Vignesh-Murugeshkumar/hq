import { View, Text } from 'react-native';

export default function TeacherAnalytics() {
  return (
    <View className="flex-1 bg-background justify-center items-center p-5">
      <Text className="font-nunito-bold text-heading-lg text-text">Class Analytics</Text>
      <Text className="font-nunito text-body-lg text-text-secondary mt-2 text-center">Track your class completion rates, XP gains, and high scores.</Text>
    </View>
  );
}
