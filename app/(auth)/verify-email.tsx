import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, CheckCircle2, RotateCw } from 'lucide-react-native';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

import { useAuthStore } from '@/features/auth/stores/authStore';
import { db, auth } from '@/config/firebase';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { colors } from '@/theme';

export default function VerifyEmailScreen() {
  const router = useRouter();
  const { user, sendVerification, signOut } = useAuthStore();
  const [checking, setChecking] = useState(false);
  const [resending, setResending] = useState(false);

  // Auto-reload auth state on mount/interval to detect verification automatically
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(async () => {
      try {
        await auth.currentUser?.reload();
        if (auth.currentUser?.emailVerified) {
          clearInterval(interval);
          handleVerificationSuccess();
        }
      } catch (e) {
        // Silent catch during background check
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [user]);

  const handleVerificationSuccess = async () => {
    if (!auth.currentUser) return;
    const { uid, email } = auth.currentUser;

    try {
      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);

      let isOnboarded = false;

      if (!userDoc.exists()) {
        // Initialize Firestore User Document
        const initialUserData = {
          email: email || '',
          role: 'student',
          createdAt: serverTimestamp(),
          isOnboarded: false,
          settings: {
            notificationsEnabled: true,
            voiceEnabled: true,
            soundEnabled: true,
            hapticEnabled: true,
          },
        };
        await setDoc(userDocRef, initialUserData);
      } else {
        isOnboarded = userDoc.data()?.isOnboarded || false;
      }

      // Route based on onboarding status
      if (isOnboarded) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(onboarding)/avatar');
      }
    } catch (error: any) {
      Alert.alert('Verification Error', 'Failed to create user record. Please try again.');
    }
  };

  const checkStatus = async () => {
    if (!auth.currentUser) return;
    try {
      setChecking(true);
      await auth.currentUser.reload();
      if (auth.currentUser.emailVerified) {
        await handleVerificationSuccess();
      } else {
        Alert.alert('Not Verified Yet', 'Please click the link in your verification email before checking status.');
      }
    } catch (e: any) {
      Alert.alert('Error', 'Failed to refresh verification status. Please check your internet connection.');
    } finally {
      setChecking(false);
    }
  };

  const handleResend = async () => {
    try {
      setResending(true);
      await sendVerification();
      Alert.alert('Verification Sent', 'A new verification link has been sent to your email address.');
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to send verification link.');
    } finally {
      setResending(false);
    }
  };

  return (
    <View className="flex-1 bg-background justify-center px-6 py-10">
      <View className="items-center mb-8">
        <View className="w-24 h-24 rounded-full bg-primary/10 border-4 border-primary items-center justify-center mb-4 shadow-card">
          <Mail size={44} color={colors.primary.DEFAULT} strokeWidth={2.5} />
        </View>
        <Text className="font-nunito-extrabold text-display-md text-text text-center">
          Verify Your Email
        </Text>
        <Text className="font-nunito text-body-lg text-text-secondary text-center mt-2 px-4">
          We sent a verification link to:{"\n"}
          <Text className="font-nunito-bold text-text">{user?.email}</Text>
        </Text>
      </View>

      <Card className="p-6 border-2 border-border mb-6 shadow-card">
        <Text className="font-nunito text-body-md text-text-secondary text-center mb-6">
          Once you have clicked the link in the email, press the button below to start playing!
        </Text>

        <Button
          variant="primary"
          size="lg"
          loading={checking}
          onPress={checkStatus}
          className="w-full mb-3"
        >
          I've Verified My Email
        </Button>

        <Button
          variant="outline"
          size="md"
          loading={resending}
          onPress={handleResend}
          className="w-full bg-surface"
        >
          Resend Email
        </Button>
      </Card>

      <View className="items-center">
        <Pressable
          onPress={() => signOut()}
          className="flex-row items-center gap-2 px-4 py-2"
          hitSlop={12}
        >
          <RotateCw size={16} color={colors.text.secondary} />
          <Text className="font-nunito-bold text-body-md text-text-secondary">
            Use a different account
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
