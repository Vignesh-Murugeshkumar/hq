import React, { createContext, useContext, useState, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions, Platform, Pressable } from 'react-native';

export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'achievement';

export interface NotificationOptions {
  title: string;
  message: string;
  type?: NotificationType;
  duration?: number;
}

interface NotificationContextProps {
  showNotification: (options: NotificationOptions) => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [activeNotification, setActiveNotification] = useState<NotificationOptions | null>(null);
  const slideAnim = useRef(new Animated.Value(-150)).current; // Start offscreen
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const showNotification = ({ title, message, type = 'info', duration = 4000 }: NotificationOptions) => {
    // Clear any active timers
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setActiveNotification({ title, message, type, duration });

    // Slide down animation
    Animated.spring(slideAnim, {
      toValue: Platform.OS === 'ios' ? 50 : 20, // Final position below status bar
      useNativeDriver: true,
      bounciness: 8,
    }).start();

    // Set auto-hide timer
    timerRef.current = setTimeout(() => {
      hideNotification();
    }, duration);
  };

  const hideNotification = () => {
    Animated.timing(slideAnim, {
      toValue: -150, // Back offscreen
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setActiveNotification(null);
    });
  };

  // Emojis for types
  let emoji = 'ℹ️';
  let badgeBg = '#EBF8FF';
  let cardBorderColor = '#2D3436';

  if (activeNotification) {
    if (activeNotification.type === 'achievement') {
      emoji = '🏆';
      badgeBg = '#FEF3C7';
      cardBorderColor = '#F59E0B'; // Gold border
    } else if (activeNotification.type === 'success') {
      emoji = '✅';
      badgeBg = '#D1FAE5';
      cardBorderColor = '#10B981';
    } else if (activeNotification.type === 'warning') {
      emoji = '⚠️';
      badgeBg = '#FEF3C7';
      cardBorderColor = '#F59E0B';
    } else if (activeNotification.type === 'error') {
      emoji = '❌';
      badgeBg = '#FEE2E2';
      cardBorderColor = '#EF4444';
    }
  }

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}

      {activeNotification && (
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ translateY: slideAnim }],
              borderColor: cardBorderColor,
              backgroundColor: '#FFFFFF',
            },
          ]}
        >
          <Pressable onPress={hideNotification} style={styles.pressableContent}>
            {/* Left Emoji Badge */}
            <View style={[styles.badge, { backgroundColor: badgeBg }]}>
              <Text style={styles.badgeText}>{emoji}</Text>
            </View>

            {/* Content text */}
            <View style={styles.textContainer}>
              <Text style={styles.title} numberOfLines={1}>
                {activeNotification.title}
              </Text>
              <Text style={styles.message} numberOfLines={2}>
                {activeNotification.message}
              </Text>
            </View>
          </Pressable>
        </Animated.View>
      )}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 999999, // Ensure it floats on top of modals & tabs
    borderWidth: 3,
    borderRadius: 24,
    padding: 14,
    // Thick cartoon border drop shadow
    shadowColor: '#2D3436',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 0,
    elevation: 6,
  },
  pressableContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#2D3436',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 22,
  },
  textContainer: {
    flex: 1,
    marginLeft: 14,
  },
  title: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 14,
    color: '#2D3436',
  },
  message: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 12,
    color: '#636E72',
    marginTop: 2,
  },
});
