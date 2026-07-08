import { View, Text } from 'react-native';

export default function AdminUploadVideo() {
  return (
    <View className="flex-1 bg-background justify-center items-center p-5">
      <Text className="font-nunito-bold text-heading-lg text-text">Upload Video</Text>
      <Text className="font-nunito text-body-lg text-text-secondary mt-2 text-center">Pick a video file from your device, compress it, and link it to a lesson.</Text>
    </View>
  );
}
