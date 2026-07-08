import { View, Text } from 'react-native';

export default function AdminAudit() {
  return (
    <View className="flex-1 bg-background justify-center items-center p-5">
      <Text className="font-nunito-bold text-heading-lg text-text">Audit Logs</Text>
      <Text className="font-nunito text-body-lg text-text-secondary mt-2 text-center">Security audits, admin activities, content modifications, and logins.</Text>
    </View>
  );
}
