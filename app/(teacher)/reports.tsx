import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import { ArrowLeft } from 'lucide-react-native';
import { db } from '@/config/firebase';
import { Card } from '@/shared/components/ui/Card';
import { colors } from '@/theme';

interface StudentReport {
  id: string;
  nickname: string;
  level: number;
  totalXP: number;
  coinsCount: number;
  badgesCount: number;
  waterGoalCount: number;
}

export default function ClassReports() {
  const router = useRouter();
  const [reports, setReports] = useState<StudentReport[]>([]);
  const [classXP, setClassXP] = useState(0);
  const [classCoins, setClassCoins] = useState(0);
  const [classBadges, setClassBadges] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReports() {
      try {
        setLoading(true);
        // 1. Fetch profiles
        const profilesSnap = await getDocs(collection(db, 'profiles'));
        const reportsList: Record<string, StudentReport> = {};

        let sumXP = 0;
        let sumCoins = 0;

        profilesSnap.forEach((doc) => {
          const data = doc.data();
          sumXP += data.totalXP || 0;
          sumCoins += data.coins || 0;

          reportsList[doc.id] = {
            id: doc.id,
            nickname: data.nickname || 'Student',
            level: data.level || 1,
            totalXP: data.totalXP || 0,
            coinsCount: data.coins || 0,
            badgesCount: 0,
            waterGoalCount: data.waterIntake >= 8 ? 1 : 0,
          };
        });

        // 2. Fetch badges count
        const badgesSnap = await getDocs(collection(db, 'studentAchievements'));
        let sumBadges = 0;
        badgesSnap.forEach((doc) => {
          const data = doc.data();
          if (reportsList[data.userId]) {
            reportsList[data.userId].badgesCount += 1;
            sumBadges += 1;
          }
        });

        setReports(Object.values(reportsList));
        setClassXP(sumXP);
        setClassCoins(sumCoins);
        setClassBadges(sumBadges);
      } catch (err) {
        console.error('Failed to load reports:', err);
      } finally {
        setLoading(false);
      }
    }

    loadReports();
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
          <Text className="font-nunito-extrabold text-heading-lg text-text">📊 Class Report Card</Text>
          <Text className="font-nunito-bold text-xs text-text-secondary">Summary of class awards & accomplishments</Text>
        </View>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
          <Text className="font-nunito-bold text-text-secondary mt-3">Loading Class Reports...</Text>
        </View>
      ) : reports.length === 0 ? (
        <View className="flex-1 justify-center items-center p-6">
          <Text className="font-nunito-bold text-heading-sm text-text-secondary">No class data available.</Text>
        </View>
      ) : (
        <ScrollView className="flex-1 px-5 pt-5" showsVerticalScrollIndicator={false}>
          
          {/* Class Accomplishment Metrics Summary */}
          <Card variant="default" className="p-5 bg-white border-2 border-text rounded-3xl mb-5 shadow-sm">
            <Text className="font-nunito-extrabold text-heading-sm text-text mb-3">🌟 Classroom Totals</Text>
            <View className="flex-row justify-between border-t border-slate-100 pt-3">
              <View className="items-center flex-1">
                <Text className="text-2xl">✨</Text>
                <Text className="font-nunito-extrabold text-body-lg text-purple-600 mt-1">{classXP}</Text>
                <Text className="font-nunito-bold text-[9px] text-text-secondary">XP Earned</Text>
              </View>
              <View className="items-center flex-1 border-x border-slate-100">
                <Text className="text-2xl">🪙</Text>
                <Text className="font-nunito-extrabold text-body-lg text-yellow-500 mt-1">{classCoins}</Text>
                <Text className="font-nunito-bold text-[9px] text-text-secondary">Coins Earned</Text>
              </View>
              <View className="items-center flex-1">
                <Text className="text-2xl">🏆</Text>
                <Text className="font-nunito-extrabold text-body-lg text-emerald-600 mt-1">{classBadges}</Text>
                <Text className="font-nunito-bold text-[9px] text-text-secondary">Badges Unlocked</Text>
              </View>
            </View>
          </Card>

          {/* List of Student Report Cards */}
          <Text className="font-nunito-extrabold text-heading-sm text-text mb-3">👦 Student Standing Reports</Text>
          <View className="gap-3 pb-10">
            {reports.map((st) => (
              <Card 
                key={st.id}
                variant="default"
                className="bg-white border-2 border-text rounded-3xl p-4 shadow-sm"
              >
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="font-nunito-extrabold text-body-lg text-text">
                    {st.nickname}
                  </Text>
                  <Text className="font-nunito-bold text-xs text-text-secondary">
                    Level {st.level}
                  </Text>
                </View>
                
                <View className="flex-row justify-between border-t border-slate-100 pt-2 w-full">
                  <Text className="font-nunito-bold text-xs text-text-secondary">
                    🪙 Coins: <Text className="font-nunito-extrabold text-text">{st.coinsCount}</Text>
                  </Text>
                  <Text className="font-nunito-bold text-xs text-text-secondary">
                    🏆 Badges: <Text className="font-nunito-extrabold text-text">{st.badgesCount}</Text>
                  </Text>
                  <Text className="font-nunito-bold text-xs text-text-secondary">
                    💧 Water Goal: <Text className="font-nunito-extrabold text-text">{st.waterGoalCount > 0 ? 'Hit ✓' : 'Pending'}</Text>
                  </Text>
                </View>
              </Card>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
