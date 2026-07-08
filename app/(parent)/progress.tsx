import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { ArrowLeft } from 'lucide-react-native';
import { db } from '@/config/firebase';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { Card } from '@/shared/components/ui/Card';
import { colors } from '@/theme';

export default function ChildProgress() {
  const router = useRouter();
  const { user, studentProfile } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [completedLessonsCount, setCompletedLessonsCount] = useState(0);
  const [totalLessonsCount, setTotalLessonsCount] = useState(0);
  const [passedQuizzesCount, setPassedQuizzesCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    async function loadProgressData() {
      try {
        setLoading(true);
        // 1. Fetch total lessons count
        const lessonsSnap = await getDocs(collection(db, 'lessons'));
        setTotalLessonsCount(lessonsSnap.size);

        // 2. Fetch student completed progress
        const progressQuery = query(
          collection(db, 'lessonProgress'),
          where('userId', '==', user.uid),
          where('completed', '==', true)
        );
        const progressSnap = await getDocs(progressQuery);
        setCompletedLessonsCount(progressSnap.size);

        // 3. Fetch student quiz attempts passed
        const attemptsQuery = query(
          collection(db, 'quizAttempts'),
          where('userId', '==', user.uid),
          where('passed', '==', true)
        );
        const attemptsSnap = await getDocs(attemptsQuery);
        setPassedQuizzesCount(attemptsSnap.size);
      } catch (err) {
        console.error('Failed to load parent progress stats:', err);
      } finally {
        setLoading(false);
      }
    }

    loadProgressData();
  }, [user]);

  if (!studentProfile) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
      </SafeAreaView>
    );
  }

  const lessonsPercent = totalLessonsCount > 0 ? Math.round((completedLessonsCount / totalLessonsCount) * 100) : 0;
  const glasses = (studentProfile as any).waterIntake || 0;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Header */}
      <View className="px-5 py-4 border-b border-text bg-white flex-row items-center">
        <TouchableOpacity 
          onPress={() => router.back()}
          activeOpacity={0.7}
          className="mr-3 p-2 bg-slate-100 rounded-full border border-slate-200"
        >
          <ArrowLeft size={22} color={colors.text.DEFAULT} strokeWidth={2.5} />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="font-nunito-extrabold text-heading-lg text-text">📈 Child Progress</Text>
          <Text className="font-nunito-bold text-xs text-text-secondary">Tracking nickname: {studentProfile.nickname}</Text>
        </View>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
          <Text className="font-nunito-bold text-text-secondary mt-3">Loading progress metrics...</Text>
        </View>
      ) : (
        <ScrollView className="flex-1 px-5 pt-5" showsVerticalScrollIndicator={false}>
          <View className="gap-4 pb-10">
            {/* Stat 1: Water Intake */}
            <Card variant="default" className="p-5 bg-white border-2 border-text rounded-3xl shadow-sm">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="font-nunito-extrabold text-body-lg text-text">💧 Hydration Today</Text>
                <Text className="font-nunito-extrabold text-body-md text-blue-600">{glasses} / 8 Cups</Text>
              </View>
              <Text className="font-nunito-medium text-xs text-text-secondary mb-4">
                Your child has logged {glasses} glasses of water today out of their daily goal of 8.
              </Text>
              <View className="h-3.5 bg-slate-100 rounded-full border border-slate-200 overflow-hidden">
                <View 
                  className="h-full bg-blue-500 rounded-full" 
                  style={{ width: `${Math.min((glasses / 8) * 100, 100)}%` }}
                />
              </View>
            </Card>

            {/* Stat 2: Lessons Progress */}
            <Card variant="default" className="p-5 bg-white border-2 border-text rounded-3xl shadow-sm">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="font-nunito-extrabold text-body-lg text-text">📚 Lessons Completed</Text>
                <Text className="font-nunito-extrabold text-body-md text-emerald-600">{completedLessonsCount} / {totalLessonsCount}</Text>
              </View>
              <Text className="font-nunito-medium text-xs text-text-secondary mb-4">
                Your child has completed {completedLessonsCount} out of {totalLessonsCount} educational lessons in the app.
              </Text>
              <View className="h-3.5 bg-slate-100 rounded-full border border-slate-200 overflow-hidden">
                <View 
                  className="h-full bg-emerald-500 rounded-full" 
                  style={{ width: `${lessonsPercent}%` }}
                />
              </View>
            </Card>

            {/* Stat 3: Quizzes Passed */}
            <Card variant="default" className="p-5 bg-white border-2 border-text rounded-3xl shadow-sm">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="font-nunito-extrabold text-body-lg text-text">🎓 Quizzes Passed</Text>
                <Text className="font-nunito-extrabold text-body-md text-purple-600">{passedQuizzesCount} passed</Text>
              </View>
              <Text className="font-nunito-medium text-xs text-text-secondary">
                Your child has passed {passedQuizzesCount} quizzes linked to their lessons to test their health knowledge!
              </Text>
            </Card>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
