import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { ArrowLeft, Search } from 'lucide-react-native';
import { db } from '@/config/firebase';
import { Avatar } from '@/shared/components/ui/Avatar';
import { Card } from '@/shared/components/ui/Card';
import { colors } from '@/theme';

interface StudentProfile {
  id: string;
  nickname: string;
  avatar: any;
  grade: string;
  level: number;
  totalXP: number;
  streakCount: number;
}

export default function ManageStudents() {
  const router = useRouter();
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStudents() {
      try {
        setLoading(true);
        const q = query(collection(db, 'profiles'), orderBy('nickname', 'asc'));
        const querySnap = await getDocs(q);
        const list: StudentProfile[] = [];
        querySnap.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as StudentProfile);
        });
        setStudents(list);
      } catch (err) {
        console.error('Error fetching students list:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchStudents();
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
          <Text className="font-nunito-extrabold text-heading-lg text-text">👧 Manage Students</Text>
          <Text className="font-nunito-bold text-xs text-text-secondary">Class Roster ({students.length})</Text>
        </View>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
          <Text className="font-nunito-bold text-text-secondary mt-3">Loading Class Roster...</Text>
        </View>
      ) : students.length === 0 ? (
        <View className="flex-1 justify-center items-center p-6">
          <Text className="font-nunito-bold text-heading-sm text-text-secondary">No students found.</Text>
        </View>
      ) : (
        <ScrollView className="flex-1 px-5 pt-5" showsVerticalScrollIndicator={false}>
          <View className="gap-3 pb-10">
            {students.map((student) => (
              <Card 
                key={student.id}
                variant="default"
                className="bg-white border-2 border-text rounded-3xl p-4 flex-row items-center justify-between shadow-sm"
              >
                <View className="flex-row items-center flex-1 mr-2">
                  {/* Avatar */}
                  <Card variant="default" className="p-0.5 bg-slate-50 border-2 border-text rounded-full mr-3.5">
                    <Avatar config={student.avatar} size={48} />
                  </Card>
                  
                  <View className="flex-1">
                    <Text className="font-nunito-extrabold text-body-lg text-text" numberOfLines={1}>
                      {student.nickname}
                    </Text>
                    <Text className="font-nunito-bold text-[10px] text-text-secondary mt-0.5">
                      Grade: {student.grade || 'Not set'} • Level {student.level || 1}
                    </Text>
                  </View>
                </View>

                {/* Gaming Stats badges */}
                <View className="flex-row gap-2">
                  <View className="bg-purple/10 border border-purple/20 px-2.5 py-1 rounded-full">
                    <Text className="font-nunito-extrabold text-[10px] text-purple">
                      {student.totalXP || 0} XP
                    </Text>
                  </View>
                  <View className="bg-orange-50 border border-orange-200 px-2 py-1 rounded-full flex-row items-center">
                    <Text className="text-[10px] mr-0.5">🔥</Text>
                    <Text className="font-nunito-extrabold text-[10px] text-text">
                      {student.streakCount || 0}
                    </Text>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
