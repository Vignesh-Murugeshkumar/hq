import { View, Text } from 'react-native';

export default function ParentProgress() {
  return (
    <View className="flex-1 bg-background justify-center items-center p-5">
      <Text className="font-nunito-bold text-heading-lg text-text">Child Progress</Text>
      <Text className="font-nunito text-body-lg text-text-secondary mt-2 text-center">View lessons, quizzes, and streak counts for your child.</Text>
    </View>
  );
}
