import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { collection, doc, getDocs, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { ArrowLeft, BookOpen } from 'lucide-react-native';
import { db } from '@/config/firebase';
import { Card } from '@/shared/components/ui/Card';
import { colors } from '@/theme';

interface Lesson {
  id: string;
  title: string;
  category: string;
  xpReward: number;
}

export default function AssignLessons() {
  const router = useRouter();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [assignedMap, setAssignedMap] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        // 1. Load lessons
        const lessonsSnap = await getDocs(collection(db, 'lessons'));
        const lessonsList: Lesson[] = [];
        lessonsSnap.forEach((doc) => {
          lessonsList.push({ id: doc.id, ...doc.data() } as Lesson);
        });
        setLessons(lessonsList);

        // 2. Load assignments
        const assignmentsSnap = await getDocs(collection(db, 'assignments'));
        const activeAssignments: Record<string, boolean> = {};
        assignmentsSnap.forEach((doc) => {
          activeAssignments[doc.id] = true;
        });
        setAssignedMap(activeAssignments);
      } catch (err) {
        console.error('Failed to load assignments:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleToggleAssignment = async (lessonId: string) => {
    const isAssigned = assignedMap[lessonId] || false;
    setUpdatingId(lessonId);
    try {
      const assignmentRef = doc(db, 'assignments', lessonId);
      if (isAssigned) {
        // Remove assignment
        await deleteDoc(assignmentRef);
        setAssignedMap((prev) => ({ ...prev, [lessonId]: false }));
      } else {
        // Create assignment
        await setDoc(assignmentRef, {
          lessonId,
          assignedAt: serverTimestamp(),
        });
        setAssignedMap((prev) => ({ ...prev, [lessonId]: true }));
      }
    } catch (err) {
      console.error('Failed to toggle assignment:', err);
    } finally {
      setUpdatingId(null);
    }
  };

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
          <Text className="font-nunito-extrabold text-heading-lg text-text">📝 Assign Lessons</Text>
          <Text className="font-nunito-bold text-xs text-text-secondary">Mark lessons as required assignments</Text>
        </View>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
          <Text className="font-nunito-bold text-text-secondary mt-3">Loading Lessons...</Text>
        </View>
      ) : lessons.length === 0 ? (
        <View className="flex-1 justify-center items-center p-6">
          <Text className="font-nunito-bold text-heading-sm text-text-secondary">No lessons in the catalog yet.</Text>
        </View>
      ) : (
        <ScrollView className="flex-1 px-5 pt-5" showsVerticalScrollIndicator={false}>
          <View className="gap-3 pb-10">
            {lessons.map((lesson) => {
              const isAssigned = assignedMap[lesson.id] || false;
              const isUpdating = updatingId === lesson.id;
              
              // Emojis for categories
              let catEmoji = '📚';
              if (lesson.category === 'nutrition') catEmoji = '🍎';
              else if (lesson.category === 'fitness') catEmoji = '🏃';
              else if (lesson.category === 'sleep') catEmoji = '🌙';
              else if (lesson.category === 'hygiene') catEmoji = '🧼';

              return (
                <Card 
                  key={lesson.id}
                  variant="default"
                  className="bg-white border-2 border-text rounded-3xl p-4 flex-row items-center justify-between shadow-sm"
                  style={{
                    borderColor: isAssigned ? colors.primary.DEFAULT : colors.text.DEFAULT,
                    backgroundColor: isAssigned ? '#F0FDF4' : '#FFF',
                  }}
                >
                  <View className="flex-row items-center flex-1 mr-3">
                    <View className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 items-center justify-center mr-3">
                      <Text className="text-xl">{catEmoji}</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="font-nunito-extrabold text-body-md text-text" numberOfLines={1}>
                        {lesson.title}
                      </Text>
                      <Text className="font-nunito-bold text-xs text-text-secondary capitalize">
                        {lesson.category} • {lesson.xpReward} XP
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row items-center gap-2">
                    {isUpdating ? (
                      <ActivityIndicator size="small" color={colors.primary.DEFAULT} />
                    ) : (
                      <Switch
                        value={isAssigned}
                        onValueChange={() => handleToggleAssignment(lesson.id)}
                        trackColor={{ false: '#CBD5E1', true: colors.primary.light }}
                        thumbColor={isAssigned ? colors.primary.DEFAULT : '#94A3B8'}
                      />
                    )}
                    <Text className={`font-nunito-bold text-xs ${isAssigned ? 'text-emerald-700' : 'text-slate-500'}`}>
                      {isAssigned ? 'Assigned' : 'Optional'}
                    </Text>
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
