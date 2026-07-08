import { View, Text } from 'react-native';

export default function TeacherAssign() {
  return (
    <View className="flex-1 bg-background justify-center items-center p-5">
      <Text className="font-nunito-bold text-heading-lg text-text">Assign Lessons</Text>
      <Text className="font-nunito text-body-lg text-text-secondary mt-2 text-center">Set homework assignments and lesson tracks for your classes.</Text>
    </View>
  );
}
