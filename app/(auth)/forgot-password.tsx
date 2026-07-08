import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react-native';

import { useAuthStore } from '@/features/auth/stores/authStore';
import { forgotPasswordSchema, ForgotPasswordFormData } from '@/features/auth/types/validation';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { colors } from '@/theme';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { resetPassword, error: authError, clearError } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setLoading(true);
      clearError();
      await resetPassword(data.email);
      setSuccess(true);
    } catch (e) {
      // Handled by store state (authError)
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Back Button */}
        <Pressable
          onPress={() => {
            clearError();
            router.back();
          }}
          className="absolute top-12 left-6 p-2 bg-surface border-2 border-border rounded-full flex-row items-center justify-center shadow-card active:translate-y-[2px]"
          hitSlop={12}
        >
          <ArrowLeft size={20} color={colors.text.DEFAULT} strokeWidth={2.5} />
        </Pressable>

        {success ? (
          /* Success Screen */
          <View className="items-center">
            <View className="w-24 h-24 rounded-full bg-success/10 border-4 border-success items-center justify-center mb-6 shadow-card">
              <CheckCircle2 size={48} color={colors.success} strokeWidth={2.5} />
            </View>
            <Text className="font-nunito-extrabold text-display-md text-text text-center mb-3">
              Reset Link Sent!
            </Text>
            <Text className="font-nunito text-body-lg text-text-secondary text-center mb-8 px-4">
              We've sent an email with instructions on how to reset your password. Please check your inbox.
            </Text>
            <Button
              variant="outline"
              size="lg"
              onPress={() => {
                setSuccess(false);
                clearError();
                router.replace('/(auth)/login');
              }}
              className="w-full bg-surface"
            >
              Back to Login
            </Button>
          </View>
        ) : (
          /* Input Form */
          <>
            <View className="items-center mb-8">
              <View className="w-24 h-24 rounded-full bg-primary/10 border-4 border-primary items-center justify-center mb-4 shadow-card">
                <Text className="text-5xl">🔑</Text>
              </View>
              <Text className="font-nunito-extrabold text-display-md text-text text-center">
                Reset Password
              </Text>
              <Text className="font-nunito text-body-lg text-text-secondary text-center mt-1">
                Enter your email address to recover your account
              </Text>
            </View>

            <Card className="p-6 border-2 border-border mb-6 shadow-card">
              {/* Error Banner */}
              {(authError || Object.keys(errors).length > 0) && (
                <View className="bg-secondary/10 border-2 border-secondary/20 rounded-button p-4 mb-4 flex-row items-center gap-3">
                  <AlertCircle size={20} color={colors.secondary.DEFAULT} strokeWidth={2.5} />
                  <View className="flex-1">
                    <Text className="font-nunito-bold text-body-sm text-secondary-dark">
                      {authError || 'Please check your email address.'}
                    </Text>
                  </View>
                </View>
              )}

              {/* Email Input */}
              <Text className="font-nunito-bold text-label text-text mb-2">Email Address</Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className={`flex-row items-center border-2 rounded-input bg-surface-alt px-4 py-3 mb-4 ${errors.email ? 'border-secondary' : 'border-border focus:border-primary'}`}>
                    <Mail size={20} color={colors.text.secondary} className="mr-3" />
                    <TextInput
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="Enter your email"
                      placeholderTextColor={colors.text.secondary}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      className="flex-1 font-nunito text-body-lg text-text"
                    />
                  </View>
                )}
              />
              {errors.email && (
                <Text className="font-nunito-semibold text-body-sm text-secondary mb-4 -mt-2">
                  {errors.email.message}
                </Text>
              )}

              {/* Reset Button */}
              <Button
                variant="primary"
                size="lg"
                loading={loading}
                onPress={handleSubmit(onSubmit)}
                className="w-full mt-2"
              >
                Send Reset Link
              </Button>
            </Card>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
