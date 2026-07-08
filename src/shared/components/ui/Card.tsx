import React from 'react';
import { View, ViewProps, ViewStyle } from 'react-native';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'purple' | 'success' | 'danger';
  active?: boolean;
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  active = false,
  style,
  ...props
}) => {
  let borderClass = 'border-border';
  if (active) {
    borderClass = 'border-primary shadow-card-active';
  } else if (variant === 'accent') {
    borderClass = 'border-accent';
  } else if (variant === 'purple') {
    borderClass = 'border-purple/30';
  } else if (variant === 'success') {
    borderClass = 'border-success/30';
  } else if (variant === 'danger') {
    borderClass = 'border-secondary/30';
  }

  return (
    <View
      style={style}
      className={`bg-surface border-2 rounded-card p-5 shadow-card ${borderClass}`}
      {...props}
    >
      {children}
    </View>
  );
};
