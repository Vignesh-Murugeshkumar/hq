import { View, Text } from 'react-native';

export default function ParentReports() {
  return (
    <View className="flex-1 bg-background justify-center items-center p-5">
      <Text className="font-nunito-bold text-heading-lg text-text">Weekly Reports</Text>
      <Text className="font-nunito text-body-lg text-text-secondary mt-2 text-center">Receive summary reports on study time, accuracy, and topic completion.</Text>
    </View>
  );
}
