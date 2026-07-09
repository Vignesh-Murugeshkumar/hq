import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { Avatar } from '@/shared/components/ui/Avatar';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { AchievementDocument } from '@/shared/types/database';
import { colors } from '@/theme';

export default function ProfileScreen() {
  const { signOut, user, studentProfile } = useAuthStore();
  const [achievements, setAchievements] = useState<AchievementDocument[]>([]);
  const [unlockedIds, setUnlockedIds] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  // 1. Subscribe to all achievements
  useEffect(() => {
    const achQuery = query(collection(db, 'achievements'));
    const unsubscribe = onSnapshot(achQuery, (snapshot) => {
      const list: AchievementDocument[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as AchievementDocument);
      });
      setAchievements(list);
      setLoading(false);
    }, (error) => {
      console.error('Error loading achievements templates:', error);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // 2. Subscribe to user's unlocked achievements
  useEffect(() => {
    if (!user) return;

    const unlockedQuery = query(
      collection(db, 'studentAchievements'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(unlockedQuery, (snapshot) => {
      const unlockedMap: Record<string, boolean> = {};
      snapshot.forEach((doc) => {
        const data = doc.data();
        unlockedMap[data.achievementId] = true;
      });
      setUnlockedIds(unlockedMap);
    }, (error) => {
      console.error('Error loading student achievements:', error);
    });

    return unsubscribe;
  }, [user]);

  if (!studentProfile) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
        <Text className="font-nunito-bold text-text-secondary mt-3">Loading Profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="px-5 py-4 border-b border-text bg-white">
        <Text className="font-nunito-extrabold text-heading-lg text-text">🛡️ My Hero Profile</Text>
      </View>

      <ScrollView className="flex-1 px-5 pt-5" showsVerticalScrollIndicator={false}>
        
        {/* Student Avatar Card */}
        <Card variant="default" className="bg-white border-2 border-text rounded-3xl p-6 items-center shadow-sm mb-6">
          <View className="mb-4">
            <Card variant="default" className="p-1 bg-slate-50 rounded-full border-2 border-text shadow-sm">
              <Avatar config={studentProfile.avatar} size={90} />
            </Card>
          </View>
          
          <Text className="font-nunito-extrabold text-heading-lg text-text">
            {studentProfile.nickname}
          </Text>
          <Text className="font-nunito-bold text-xs text-text-secondary mt-1 mb-4">
            {user?.email}
          </Text>
          
          {/* Gaming Stats Box */}
          <View className="flex-row mt-2 border-t border-slate-100 pt-4 w-full justify-around">
            <View className="items-center">
              <Text className="font-nunito-extrabold text-heading-sm text-primary">
                Level {studentProfile.level || 1}
              </Text>
              <Text className="font-nunito-bold text-xs text-text-secondary mt-0.5">Rank</Text>
            </View>
            <View className="items-center">
              <Text className="font-nunito-extrabold text-heading-sm text-yellow-500">
                {studentProfile.coins || 0}
              </Text>
              <Text className="font-nunito-bold text-xs text-text-secondary mt-0.5">Coins</Text>
            </View>
            <View className="items-center">
              <Text className="font-nunito-extrabold text-heading-sm text-purple-600">
                {studentProfile.totalXP || 0}
              </Text>
              <Text className="font-nunito-bold text-xs text-text-secondary mt-0.5">XP Total</Text>
            </View>
          </View>
        </Card>

        {/* Badges / Achievements Grid Section */}
        <Text className="font-nunito-extrabold text-heading-sm text-text mb-3">
          🏆 Unlocked Badges
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary.DEFAULT} className="my-6" />
        ) : achievements.length === 0 ? (
          <Card variant="default" className="p-5 bg-white border-2 border-text rounded-3xl mb-6 items-center">
            <Text className="font-nunito-bold text-xs text-text-secondary">No badges found.</Text>
          </Card>
        ) : (
          <View className="mb-6">
            {achievements.map((ach) => {
              const isUnlocked = unlockedIds[ach.id!] || false;
              return (
                <Card 
                  key={ach.id}
                  variant="default"
                  className="p-4 mb-3 bg-white border-2 border-text rounded-3xl flex-row items-center shadow-sm"
                  style={{
                    opacity: isUnlocked ? 1 : 0.6,
                    backgroundColor: isUnlocked ? '#FFF' : '#F1F5F9',
                    borderColor: isUnlocked ? colors.text.DEFAULT : '#94A3B8',
                  }}
                >
                  <View 
                    style={{
                      width: 54,
                      height: 54,
                      borderRadius: 27,
                      backgroundColor: isUnlocked ? colors.primary.light : '#CBD5E1',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: 2,
                      borderColor: isUnlocked ? colors.text.DEFAULT : '#94A3B8',
                    }}
                  >
                    <Text className="text-3xl">{isUnlocked ? ach.icon : '🔒'}</Text>
                  </View>

                  <View className="flex-1 ml-4 mr-2">
                    <Text 
                      className={`font-nunito-extrabold text-body-lg ${isUnlocked ? 'text-text' : 'text-slate-500'}`}
                    >
                      {ach.title}
                    </Text>
                    <Text 
                      className={`font-nunito-bold text-xs ${isUnlocked ? 'text-text-secondary' : 'text-slate-400'} mt-0.5`}
                      numberOfLines={2}
                    >
                      {ach.description}
                    </Text>
                  </View>

                  {isUnlocked && (
                    <View className="bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                      <Text className="font-nunito-extrabold text-[9px] text-emerald-800">UNLOCKED</Text>
                    </View>
                  )}
                </Card>
              );
            })}
          </View>
        )}



        {/* Bulletproof Log Out Button */}
        <Button
          variant="secondary"
          size="lg"
          onPress={() => signOut()}
          className="mb-10 w-full"
        >
          Log Out
        </Button>
        
      </ScrollView>
    </SafeAreaView>
  );
}
