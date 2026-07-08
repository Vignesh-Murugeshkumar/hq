import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import { ArrowLeft, Users, BookOpen, GraduationCap, ChevronRight } from 'lucide-react-native';
import { db } from '@/config/firebase';
import { Card } from '@/shared/components/ui/Card';
import { colors } from '@/theme';

export default function TeacherDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [studentCount, setStudentCount] = useState(0);
  const [avgXP, setAvgXP] = useState(0);
  const [assignedCount, setAssignedCount] = useState(0);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        // 1. Fetch total profiles
        const profilesSnap = await getDocs(collection(db, 'profiles'));
        setStudentCount(profilesSnap.size);

        let totalXP = 0;
        profilesSnap.forEach((doc) => {
          totalXP += doc.data().totalXP || 0;
        });
        setAvgXP(profilesSnap.size > 0 ? Math.round(totalXP / profilesSnap.size) : 0);

        // 2. Fetch assigned count
        const assignmentsSnap = await getDocs(collection(db, 'assignments'));
        setAssignedCount(assignmentsSnap.size);
      } catch (err) {
        console.error('Failed to load teacher stats:', err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

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
          <Text className="font-nunito-extrabold text-heading-lg text-text">🎒 Teacher Portal</Text>
          <Text className="font-nunito-bold text-xs text-text-secondary">Class Management & Analytics</Text>
        </View>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
          <Text className="font-nunito-bold text-text-secondary mt-3">Loading Class Metrics...</Text>
        </View>
      ) : (
        <ScrollView className="flex-1 px-5 pt-5" showsVerticalScrollIndicator={false}>
          
          {/* Summary Dashboard Grid */}
          <View className="flex-row gap-4 mb-6">
            <Card variant="default" className="flex-1 bg-white border-2 border-text rounded-3xl p-4 items-center shadow-sm">
              <Users size={28} color={colors.primary.DEFAULT} strokeWidth={2.5} />
              <Text className="font-nunito-extrabold text-heading-md text-text mt-2">{studentCount}</Text>
              <Text className="font-nunito-bold text-[10px] text-text-secondary mt-0.5">Students</Text>
            </Card>

            <Card variant="default" className="flex-1 bg-white border-2 border-text rounded-3xl p-4 items-center shadow-sm">
              <GraduationCap size={28} color={colors.purple.DEFAULT} strokeWidth={2.5} />
              <Text className="font-nunito-extrabold text-heading-md text-text mt-2">{avgXP} XP</Text>
              <Text className="font-nunito-bold text-[10px] text-text-secondary mt-0.5">Average XP</Text>
            </Card>

            <Card variant="default" className="flex-1 bg-white border-2 border-text rounded-3xl p-4 items-center shadow-sm">
              <BookOpen size={28} color={colors.secondary.DEFAULT} strokeWidth={2.5} />
              <Text className="font-nunito-extrabold text-heading-md text-text mt-2">{assignedCount}</Text>
              <Text className="font-nunito-bold text-[10px] text-text-secondary mt-0.5">Assigned</Text>
            </Card>
          </View>

          {/* Quick Actions List */}
          <Text className="font-nunito-extrabold text-heading-sm text-text mb-3">📋 Classroom Tools</Text>
          
          <View className="gap-3 pb-10">
            {/* Tool 1 */}
            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={() => router.push('/(teacher)/students')}
              className="bg-white border-2 border-text rounded-3xl p-4 flex-row items-center justify-between shadow-sm"
            >
              <View className="flex-row items-center gap-3">
                <View className="w-12 h-12 rounded-2xl bg-emerald-50 border-2 border-text items-center justify-center">
                  <Text className="text-2xl">👦</Text>
                </View>
                <View>
                  <Text className="font-nunito-extrabold text-body-lg text-text">Manage Students</Text>
                  <Text className="font-nunito-bold text-xs text-text-secondary mt-0.5">View levels, grades, and active streaks</Text>
                </View>
              </View>
              <ChevronRight size={20} color={colors.text.secondary} strokeWidth={2.5} />
            </TouchableOpacity>

            {/* Tool 2 */}
            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={() => router.push('/(teacher)/assign')}
              className="bg-white border-2 border-text rounded-3xl p-4 flex-row items-center justify-between shadow-sm"
            >
              <View className="flex-row items-center gap-3">
                <View className="w-12 h-12 rounded-2xl bg-amber-50 border-2 border-text items-center justify-center">
                  <Text className="text-2xl">📝</Text>
                </View>
                <View>
                  <Text className="font-nunito-extrabold text-body-lg text-text">Assign Lessons</Text>
                  <Text className="font-nunito-bold text-xs text-text-secondary mt-0.5">Set required lessons for the class</Text>
                </View>
              </View>
              <ChevronRight size={20} color={colors.text.secondary} strokeWidth={2.5} />
            </TouchableOpacity>

            {/* Tool 3 */}
            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={() => router.push('/(teacher)/analytics')}
              className="bg-white border-2 border-text rounded-3xl p-4 flex-row items-center justify-between shadow-sm"
            >
              <View className="flex-row items-center gap-3">
                <View className="w-12 h-12 rounded-2xl bg-purple-50 border-2 border-text items-center justify-center">
                  <Text className="text-2xl">📈</Text>
                </View>
                <View>
                  <Text className="font-nunito-extrabold text-body-lg text-text">Class Analytics</Text>
                  <Text className="font-nunito-bold text-xs text-text-secondary mt-0.5">See lesson completions and quiz scores</Text>
                </View>
              </View>
              <ChevronRight size={20} color={colors.text.secondary} strokeWidth={2.5} />
            </TouchableOpacity>

            {/* Tool 4 */}
            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={() => router.push('/(teacher)/reports')}
              className="bg-white border-2 border-text rounded-3xl p-4 flex-row items-center justify-between shadow-sm"
            >
              <View className="flex-row items-center gap-3">
                <View className="w-12 h-12 rounded-2xl bg-red-50 border-2 border-text items-center justify-center">
                  <Text className="text-2xl">📊</Text>
                </View>
                <View>
                  <Text className="font-nunito-extrabold text-body-lg text-text">Class Report Card</Text>
                  <Text className="font-nunito-bold text-xs text-text-secondary mt-0.5">Summary of class accomplishments</Text>
                </View>
              </View>
              <ChevronRight size={20} color={colors.text.secondary} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
