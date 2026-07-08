import { View, Text } from 'react-native';

export default function AdminLessons() {
  return (
    <View className="flex-1 bg-background justify-center items-center p-5">
      <Text className="font-nunito-bold text-heading-lg text-text">Manage Lessons</Text>
      <Text className="font-nunito text-body-lg text-text-secondary mt-2 text-center">Add, update, or remove learning lessons, modules, and mini-quizzes.</Text>
    </View>
  );
}
