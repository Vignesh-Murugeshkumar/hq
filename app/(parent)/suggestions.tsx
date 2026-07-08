import { View, Text } from 'react-native';

export default function ParentSuggestions() {
  return (
    <View className="flex-1 bg-background justify-center items-center p-5">
      <Text className="font-nunito-bold text-heading-lg text-text">Health Suggestions</Text>
      <Text className="font-nunito text-body-lg text-text-secondary mt-2 text-center">Receive dynamic health recommendations based on child habits.</Text>
    </View>
  );
}
