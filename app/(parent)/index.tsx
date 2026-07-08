import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, UserCheck, BarChart2, HeartHandshake, ChevronRight } from 'lucide-react-native';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { Card } from '@/shared/components/ui/Card';
import { colors } from '@/theme';

export default function ParentDashboard() {
  const router = useRouter();
  const { studentProfile } = useAuthStore();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Header */}
      <View className="px-5 py-4 border-b border-text bg-white flex-row items-center">
        <TouchableOpacity 
          onPress={() => router.push('/(tabs)/profile')}
          activeOpacity={0.7}
          className="mr-3 p-2 bg-slate-100 rounded-full border border-slate-200"
        >
          <ArrowLeft size={22} color={colors.text.DEFAULT} strokeWidth={2.5} />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="font-nunito-extrabold text-heading-lg text-text">👨‍👩‍👧 Parent Portal</Text>
          <Text className="font-nunito-bold text-xs text-text-secondary">Track & support your child's habits</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-5 pt-5" showsVerticalScrollIndicator={false}>
        {studentProfile ? (
          <Card variant="default" className="p-5 bg-white border-2 border-text rounded-3xl mb-6 shadow-sm flex-row items-center justify-between">
            <View>
              <Text className="font-nunito-bold text-xs text-text-secondary">Tracking Profile</Text>
              <Text className="font-nunito-extrabold text-heading-sm text-text mt-0.5">{studentProfile.nickname}</Text>
              <Text className="font-nunito-bold text-xs text-text-secondary mt-1">Level {studentProfile.level} • {studentProfile.totalXP} XP</Text>
            </View>
            <View className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-full">
              <UserCheck size={28} color={colors.primary.DEFAULT} strokeWidth={2.5} />
            </View>
          </Card>
        ) : (
          <Card variant="default" className="p-5 bg-white border-2 border-text rounded-3xl mb-6 shadow-sm">
            <Text className="font-nunito-bold text-xs text-text-secondary">No child profile connected.</Text>
          </Card>
        )}

        {/* Quick Tools */}
        <Text className="font-nunito-extrabold text-heading-sm text-text mb-3">🏡 Parent Resources</Text>
        
        <View className="gap-3 pb-10">
          {/* Tool 1 */}
          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={() => router.push('/(parent)/progress')}
            className="bg-white border-2 border-text rounded-3xl p-4 flex-row items-center justify-between shadow-sm"
          >
            <View className="flex-row items-center gap-3">
              <View className="w-12 h-12 rounded-2xl bg-emerald-50 border-2 border-text items-center justify-center">
                <Text className="text-2xl">📈</Text>
              </View>
              <View>
                <Text className="font-nunito-extrabold text-body-lg text-text">Child Progress</Text>
                <Text className="font-nunito-bold text-xs text-text-secondary mt-0.5">Water logged, lessons & quiz accuracy</Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.text.secondary} strokeWidth={2.5} />
          </TouchableOpacity>

          {/* Tool 2 */}
          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={() => router.push('/(parent)/reports')}
            className="bg-white border-2 border-text rounded-3xl p-4 flex-row items-center justify-between shadow-sm"
          >
            <View className="flex-row items-center gap-3">
              <View className="w-12 h-12 rounded-2xl bg-amber-50 border-2 border-text items-center justify-center">
                <Text className="text-2xl">📋</Text>
              </View>
              <View>
                <Text className="font-nunito-extrabold text-body-lg text-text">Weekly Reports</Text>
                <Text className="font-nunito-bold text-xs text-text-secondary mt-0.5">Accomplishments & goals completed</Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.text.secondary} strokeWidth={2.5} />
          </TouchableOpacity>

          {/* Tool 3 */}
          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={() => router.push('/(parent)/suggestions')}
            className="bg-white border-2 border-text rounded-3xl p-4 flex-row items-center justify-between shadow-sm"
          >
            <View className="flex-row items-center gap-3">
              <View className="w-12 h-12 rounded-2xl bg-purple-50 border-2 border-text items-center justify-center">
                <Text className="text-2xl">💡</Text>
              </View>
              <View>
                <Text className="font-nunito-extrabold text-body-lg text-text">Health Suggestions</Text>
                <Text className="font-nunito-bold text-xs text-text-secondary mt-0.5">Actionable tips matching child activity</Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.text.secondary} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
