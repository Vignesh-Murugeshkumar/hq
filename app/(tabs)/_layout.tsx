/**
 * HealthQuest — Main Tab Navigation
 *
 * Five-tab bottom navigation: Home, Learn, Quiz, Challenges, Profile
 * Uses custom tab bar styling matching the Bright Cartoon theme.
 */
import { Tabs } from 'expo-router';
import { View, Platform } from 'react-native';
import {
  Home,
  BookOpen,
  HelpCircle,
  Target,
  User,
} from 'lucide-react-native';
import { colors } from '@/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary.DEFAULT,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarStyle: {
          backgroundColor: colors.surface.DEFAULT,
          borderTopWidth: 1,
          borderTopColor: colors.border.DEFAULT,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 8,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontFamily: 'Nunito_700Bold',
          fontSize: 11,
          marginTop: 2,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Home size={size} color={color} strokeWidth={2.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="learn/index"
        options={{
          title: 'Learn',
          tabBarIcon: ({ color, size }) => (
            <BookOpen size={size} color={color} strokeWidth={2.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="quiz/index"
        options={{
          title: 'Quiz',
          tabBarIcon: ({ color, size }) => (
            <View
              style={{
                backgroundColor: colors.accent.DEFAULT,
                borderRadius: 16,
                padding: 8,
                marginTop: -20,
                borderWidth: 3,
                borderColor: colors.surface.DEFAULT,
              }}
            >
              <HelpCircle size={size + 4} color={colors.text.DEFAULT} strokeWidth={2.5} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="challenges/index"
        options={{
          title: 'Challenges',
          tabBarIcon: ({ color, size }) => (
            <Target size={size} color={color} strokeWidth={2.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <User size={size} color={color} strokeWidth={2.5} />
          ),
        }}
      />
    </Tabs>
  );
}
