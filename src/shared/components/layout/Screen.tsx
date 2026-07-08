import React from 'react';
import { View, ViewStyle, ScrollView } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';

interface ScreenProps {
  children: React.ReactNode;
  scrollable?: boolean;
  edges?: Edge[];
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
}

export const Screen: React.FC<ScreenProps> = ({
  children,
  scrollable = false,
  edges = ['top', 'left', 'right'],
  style,
  contentContainerStyle,
}) => {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={edges} style={style}>
      {scrollable ? (
        <ScrollView
          className="flex-1"
          contentContainerStyle={[{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32 }, contentContainerStyle]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View className="flex-1 px-5 pt-4 pb-8" style={contentContainerStyle}>
          {children}
        </View>
      )}
    </SafeAreaView>
  );
};
