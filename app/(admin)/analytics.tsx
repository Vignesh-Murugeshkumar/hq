import { View, Text } from 'react-native';

export default function AdminAnalytics() {
  return (
    <View className="flex-1 bg-background justify-center items-center p-5">
      <Text className="font-nunito-bold text-heading-lg text-text">System Analytics</Text>
      <Text className="font-nunito text-body-lg text-text-secondary mt-2 text-center">Track global usage stats, registration numbers, active users, and system health.</Text>
    </View>
  );
}
