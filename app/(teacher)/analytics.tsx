import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import { ArrowLeft, BarChart2 } from 'lucide-react-native';
import { db } from '@/config/firebase';
import { Card } from '@/shared/components/ui/Card';
import { colors } from '@/theme';

interface ClassProgress {
  id: string;
  nickname: string;
  level: number;
  totalXP: number;
  completedLessons: number;
  quizScoreSum: number;
  quizAttempts: number;
}

export default function ClassAnalytics() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState<ClassProgress[]>([]);
  const [lessonsCount, setLessonsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setLoading(true);
        // 1. Fetch total lessons catalog
        const lessonsSnap = await getDocs(collection(db, 'lessons'));
        setLessonsCount(lessonsSnap.size);

        // 2. Fetch profiles
        const profilesSnap = await getDocs(collection(db, 'profiles'));
        const studentsList: Record<string, ClassProgress> = {};
        
        profilesSnap.forEach((doc) => {
          studentsList[doc.id] = {
            id: doc.id,
            nickname: doc.data().nickname || 'Student',
            level: doc.data().level || 1,
            totalXP: doc.data().totalXP || 0,
            completedLessons: 0,
            quizScoreSum: 0,
            quizAttempts: 0,
          };
        });

        // 3. Fetch completed progress
        const progressSnap = await getDocs(collection(db, 'lessonProgress'));
        progressSnap.forEach((doc) => {
          const data = doc.data();
          if (data.completed && studentsList[data.userId]) {
            studentsList[data.userId].completedLessons += 1;
          }
        });

        // 4. Fetch quiz score attempts
        const attemptsSnap = await getDocs(collection(db, 'quizAttempts'));
        attemptsSnap.forEach((doc) => {
          const data = doc.data();
          if (studentsList[data.userId]) {
            studentsList[data.userId].quizAttempts += 1;
            studentsList[data.userId].quizScoreSum += data.score || 0;
          }
        });

        setAnalytics(Object.values(studentsList));
      } catch (err) {
        console.error('Error fetching analytics details:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

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
          <Text className="font-nunito-extrabold text-heading-lg text-text">📈 Class Analytics</Text>
          <Text className="font-nunito-bold text-xs text-text-secondary">Track learning progress & quiz performance</Text>
        </View>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
          <Text className="font-nunito-bold text-text-secondary mt-3">Loading Class Progress Analytics...</Text>
        </View>
      ) : analytics.length === 0 ? (
        <View className="flex-1 justify-center items-center p-6">
          <Text className="font-nunito-bold text-heading-sm text-text-secondary">No student analytics available.</Text>
        </View>
      ) : (
        <ScrollView className="flex-1 px-5 pt-5" showsVerticalScrollIndicator={false}>
          <View className="gap-4 pb-10">
            {analytics.map((st) => {
              const avgQuizScore = st.quizAttempts > 0 ? Math.round((st.quizScoreSum / (st.quizAttempts * 3)) * 100) : 0; // 3 questions per quiz
              const completionRate = lessonsCount > 0 ? Math.round((st.completedLessons / lessonsCount) * 100) : 0;

              return (
                <Card 
                  key={st.id}
                  variant="default"
                  className="bg-white border-2 border-text rounded-3xl p-5 shadow-sm"
                >
                  <View className="flex-row justify-between items-center mb-3">
                    <Text className="font-nunito-extrabold text-body-lg text-text">
                      {st.nickname}
                    </Text>
                    <View className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                      <Text className="font-nunito-bold text-[10px] text-text-secondary">
                        Level {st.level}
                      </Text>
                    </View>
                  </View>

                  {/* Progress bars layout */}
                  <View className="gap-2.5 mt-2 border-t border-slate-100 pt-3">
                    {/* Course completion */}
                    <View>
                      <View className="flex-row justify-between items-center mb-1">
                        <Text className="font-nunito-bold text-[10px] text-text-secondary">
                          Lessons Completed ({st.completedLessons} / {lessonsCount})
                        </Text>
                        <Text className="font-nunito-extrabold text-[10px] text-text">
                          {completionRate}%
                        </Text>
                      </View>
                      <View className="h-2.5 bg-slate-100 rounded-full border border-slate-200 overflow-hidden">
                        <View 
                          className="h-full bg-emerald-500 rounded-full" 
                          style={{ width: `${completionRate}%` }}
                        />
                      </View>
                    </View>

                    {/* Quiz accuracy */}
                    <View>
                      <View className="flex-row justify-between items-center mb-1">
                        <Text className="font-nunito-bold text-[10px] text-text-secondary">
                          Average Quiz Score ({st.quizAttempts} attempt{st.quizAttempts !== 1 ? 's' : ''})
                        </Text>
                        <Text className="font-nunito-extrabold text-[10px] text-text">
                          {st.quizAttempts > 0 ? `${avgQuizScore}%` : 'N/A'}
                        </Text>
                      </View>
                      <View className="h-2.5 bg-slate-100 rounded-full border border-slate-200 overflow-hidden">
                        <View 
                          className="h-full bg-purple-500 rounded-full" 
                          style={{ width: `${st.quizAttempts > 0 ? avgQuizScore : 0}%` }}
                        />
                      </View>
                    </View>
                  </View>
                </Card>
              );
            })}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
