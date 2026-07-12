import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react-native';

import { useAuthStore } from '@/features/auth/stores/authStore';
import { signUpSchema, SignUpFormData } from '@/features/auth/types/validation';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { colors } from '@/theme';

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp, error: authError, clearError } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, watch, formState: { errors } } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const passwordValue = watch('password', '');

  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: '#CBD5E1' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[a-zA-Z]/.test(pass) && /[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score, label: 'Weak Password', color: '#EF4444' };
    if (score <= 3) return { score, label: 'Medium Password', color: '#F59E0B' };
    return { score, label: 'Strong Password ✓', color: '#10B981' };
  };

  const strength = getPasswordStrength(passwordValue);

  const onSubmit = async (data: SignUpFormData) => {
    try {
      setLoading(true);
      clearError();
      await signUp(data.email, data.password);
      // Wait for success, then push to verify-email
      router.push('/(auth)/verify-email');
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
        {/* Cartoon Header */}
        <View className="items-center mb-8">
          <View className="w-24 h-24 rounded-full bg-primary/10 border-4 border-primary items-center justify-center mb-4 shadow-card">
            <Text className="text-5xl">🏃</Text>
          </View>
          <Text className="font-nunito-extrabold text-display-md text-text text-center">
            Create Account
          </Text>
          <Text className="font-nunito text-body-lg text-text-secondary text-center mt-1">
            Join HealthQuest to start playing!
          </Text>
        </View>

        <Card className="p-6 border-2 border-border mb-6 shadow-card">
          {/* Error Banner */}
          {(authError || Object.keys(errors).length > 0) && (
            <View className="bg-secondary/10 border-2 border-secondary/20 rounded-button p-4 mb-4 flex-row items-center gap-3">
              <AlertCircle size={20} color={colors.secondary.DEFAULT} strokeWidth={2.5} />
              <View className="flex-1">
                <Text className="font-nunito-bold text-body-sm text-secondary-dark">
                  {authError || 'Please fix the errors below to continue.'}
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
            <Text className="font-nunito-semibold text-body-sm text-secondary mb-3 -mt-2">
              {errors.email.message}
            </Text>
          )}

          {/* Password Input */}
          <Text className="font-nunito-bold text-label text-text mb-2">Password</Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <View className={`flex-row items-center border-2 rounded-input bg-surface-alt px-4 py-3 mb-4 ${errors.password ? 'border-secondary' : 'border-border focus:border-primary'}`}>
                <Lock size={20} color={colors.text.secondary} className="mr-3" />
                <TextInput
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Create a password"
                  placeholderTextColor={colors.text.secondary}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  className="flex-1 font-nunito text-body-lg text-text"
                />
                <Pressable onPress={() => setShowPassword(!showPassword)} hitSlop={8}>
                  {showPassword ? (
                    <EyeOff size={20} color={colors.text.secondary} />
                  ) : (
                    <Eye size={20} color={colors.text.secondary} />
                  )}
                </Pressable>
              </View>
            )}
          />
          {errors.password && (
            <Text className="font-nunito-semibold text-body-sm text-secondary mb-3 -mt-2">
              {errors.password.message}
            </Text>
          )}

          {/* Password Strength Indicator */}
          {passwordValue.length > 0 && (
            <View className="mb-4">
              <View className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200 mb-1.5">
                <View 
                  className="h-full rounded-full" 
                  style={{ 
                    width: `${(strength.score / 4) * 100}%`, 
                    backgroundColor: strength.color 
                  }} 
                />
              </View>
              <Text className="font-nunito-bold text-xs" style={{ color: strength.color }}>
                {strength.label}
              </Text>
            </View>
          )}

          {/* Confirm Password Input */}
          <Text className="font-nunito-bold text-label text-text mb-2">Confirm Password</Text>
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <View className={`flex-row items-center border-2 rounded-input bg-surface-alt px-4 py-3 mb-4 ${errors.confirmPassword ? 'border-secondary' : 'border-border focus:border-primary'}`}>
                <Lock size={20} color={colors.text.secondary} className="mr-3" />
                <TextInput
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Repeat your password"
                  placeholderTextColor={colors.text.secondary}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  className="flex-1 font-nunito text-body-lg text-text"
                />
              </View>
            )}
          />
          {errors.confirmPassword && (
            <Text className="font-nunito-semibold text-body-sm text-secondary mb-4 -mt-2">
              {errors.confirmPassword.message}
            </Text>
          )}

          {/* Sign Up Button */}
          <Button
            variant="primary"
            size="lg"
            loading={loading}
            onPress={handleSubmit(onSubmit)}
            className="w-full mt-2"
          >Create Account</Button>
        </Card>

        {/* Navigation Footer */}
        <View className="items-center">
          <Pressable onPress={() => {
            clearError();
            router.replace('/(auth)/login');
          }} hitSlop={8}>
            <Text className="font-nunito-bold text-body-md text-primary text-center">
              Already have an account? Log In
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
