import { View, Text } from 'react-native';

export default function TeacherStudents() {
  return (
    <View className="flex-1 bg-background justify-center items-center p-5">
      <Text className="font-nunito-bold text-heading-lg text-text">Manage Students</Text>
      <Text className="font-nunito text-body-lg text-text-secondary mt-2 text-center">Add, edit, or view details of students in your classes.</Text>
    </View>
  );
}
