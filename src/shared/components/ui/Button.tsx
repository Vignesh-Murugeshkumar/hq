import React from 'react';
import { Pressable, Text, ActivityIndicator, ViewStyle, PressableProps } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { colors, BUTTON_PRESS_SCALE, springSnappy } from '@/theme';

interface ButtonProps extends PressableProps {
  children: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'purple' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  style?: ViewStyle;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  ...props
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!disabled && !loading) {
      scale.value = withSpring(BUTTON_PRESS_SCALE, springSnappy);
    }
  };

  const handlePressOut = () => {
    if (!disabled && !loading) {
      scale.value = withSpring(1, springSnappy);
    }
  };

  // Base styling mapped to NativeWind classes
  let bgClass = 'bg-primary border-primary-dark';
  let textClass = 'text-text-oncolor';

  if (variant === 'secondary') {
    bgClass = 'bg-secondary border-secondary-dark';
  } else if (variant === 'accent') {
    bgClass = 'bg-accent border-accent-dark';
    textClass = 'text-text';
  } else if (variant === 'purple') {
    bgClass = 'bg-purple border-purple-dark';
  } else if (variant === 'outline') {
    bgClass = 'bg-transparent border-border';
    textClass = 'text-text-secondary';
  }

  let sizeClass = 'py-3.5 px-6 rounded-button border-b-4';
  let textSizeClass = 'text-label';

  if (size === 'sm') {
    sizeClass = 'py-2 px-4 rounded-xl border-b-2';
    textSizeClass = 'text-label-sm';
  } else if (size === 'lg') {
    sizeClass = 'py-4 px-8 rounded-card border-b-[6px]';
    textSizeClass = 'text-heading-md';
  }

  const isDisabled = disabled || loading;

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      style={[animatedStyle, style]}
      className={`${sizeClass} ${bgClass} items-center justify-center flex-row ${isDisabled ? 'opacity-60' : 'active:translate-y-[2px]'}`}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'accent' || variant === 'outline' ? colors.text.DEFAULT : colors.text.onColor} size="small" />
      ) : (
        <Text className={`font-nunito-bold text-center ${textSizeClass} ${textClass}`}>
          {children}
        </Text>
      )}
    </AnimatedPressable>
  );
};
