import { View, Text } from 'react-native';

export default function TeacherReports() {
  return (
    <View className="flex-1 bg-background justify-center items-center p-5">
      <Text className="font-nunito-bold text-heading-lg text-text">Export Reports</Text>
      <Text className="font-nunito text-body-lg text-text-secondary mt-2 text-center">Export student grades, completion records, and activity logs.</Text>
    </View>
  );
}
