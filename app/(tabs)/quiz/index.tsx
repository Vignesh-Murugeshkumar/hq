import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { collection, doc, getDoc, getDocs, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { QuizDocument, QuizQuestion } from '@/shared/types/database';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Avatar } from '@/shared/components/ui/Avatar';
import { checkAndAwardAchievement } from '@/shared/utils/achievements';
import { useNotification } from '@/shared/components/ui/NotificationContext';
import { colors } from '@/theme';

export default function QuizScreen() {
  const { quizId } = useLocalSearchParams();
  const router = useRouter();
  const { user, studentProfile, updateStudentProfile } = useAuthStore();
  const { showNotification } = useNotification();

  const [quizzesList, setQuizzesList] = useState<QuizDocument[]>([]);
  const [activeQuiz, setActiveQuiz] = useState<QuizDocument | null>(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);

  // Gameplay State
  const [gameState, setGameState] = useState<'hub' | 'start' | 'playing' | 'results'>('hub');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [savingAttempt, setSavingAttempt] = useState(false);

  // 1. Fetch all quizzes for the Hub list
  useEffect(() => {
    async function fetchQuizzes() {
      try {
        setListLoading(true);
        const quizzesCol = collection(db, 'quizzes');
        const querySnap = await getDocs(quizzesCol);
        const list: QuizDocument[] = [];
        querySnap.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as QuizDocument);
        });
        setQuizzesList(list);
      } catch (err) {
        console.error('Error fetching quizzes list:', err);
      } finally {
        setListLoading(false);
      }
    }
    fetchQuizzes();
  }, [quizId]);

  // 2. Fetch specific quiz if quizId parameter changes
  useEffect(() => {
    if (!quizId) {
      setGameState('hub');
      setActiveQuiz(null);
      return;
    }

    async function fetchSpecificQuiz() {
      try {
        setQuizLoading(true);
        const quizRef = doc(db, 'quizzes', quizId as string);
        const quizSnap = await getDoc(quizRef);
        if (quizSnap.exists()) {
          setActiveQuiz({ id: quizSnap.id, ...quizSnap.data() } as QuizDocument);
          setGameState('start');
        } else {
          setActiveQuiz(null);
          setGameState('hub');
        }
      } catch (err) {
        console.error('Error loading quiz:', err);
      } finally {
        setQuizLoading(false);
      }
    }

    fetchSpecificQuiz();
  }, [quizId]);

  const handleStartQuiz = async () => {
    if (!activeQuiz || !studentProfile) return;

    // Energy check
    const cost = activeQuiz.energyCost || 10;
    const currentEnergy = studentProfile.energy || 100;

    if (currentEnergy < cost) {
      alert(`⚠️ Not enough energy! You need at least ${cost} energy to start this quiz. Complete daily challenges to recharge!`);
      return;
    }

    setQuizLoading(true);
    try {
      // Deduct energy
      await updateStudentProfile({
        energy: Math.max(0, currentEnergy - cost),
      });

      // Start gameplay loop
      setCurrentQuestionIdx(0);
      setSelectedOption(null);
      setIsAnswerChecked(false);
      setCorrectAnswersCount(0);
      setGameState('playing');
    } catch (err) {
      console.error('Failed to deduct energy:', err);
    } finally {
      setQuizLoading(false);
    }
  };

  const handleCheckAnswer = () => {
    if (!activeQuiz || selectedOption === null) return;

    const currentQuestion = activeQuiz.questions[currentQuestionIdx];
    const isAnsCorrect = selectedOption === currentQuestion.correctAnswer;

    setIsCorrect(isAnsCorrect);
    setIsAnswerChecked(true);

    if (isAnsCorrect) {
      setCorrectAnswersCount((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (!activeQuiz) return;

    if (currentQuestionIdx + 1 < activeQuiz.questions.length) {
      setCurrentQuestionIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerChecked(false);
    } else {
      // Finished all questions → Transition to results
      handleFinishQuiz();
    }
  };

  const handleFinishQuiz = async () => {
    if (!activeQuiz || !user || !studentProfile) return;

    setSavingAttempt(true);
    try {
      const totalQuestions = activeQuiz.questions.length;
      const scorePercentage = Math.round((correctAnswersCount / totalQuestions) * 100);
      const isPassed = scorePercentage >= 60;

      const attemptId = `${user.uid}_${activeQuiz.id}`;
      const attemptRef = doc(db, 'quizAttempts', attemptId);

      // Save attempt log
      await setDoc(attemptRef, {
        userId: user.uid,
        quizId: activeQuiz.id,
        score: correctAnswersCount,
        totalQuestions,
        passed: isPassed,
        attemptedAt: serverTimestamp(),
      });

      // Award prizes if passed
      if (isPassed) {
        const currentXP = studentProfile.totalXP || 0;
        const currentCoins = studentProfile.coins || 0;
        
        const rewardXP = activeQuiz.rewardsXP || 25;
        const rewardCoins = activeQuiz.rewardsCoins || 15;

        // Calculate Level Up
        const nextLevel = Math.floor((currentXP + rewardXP) / 100) + 1;
        const currentLevel = studentProfile.level || 1;
        const didLevelUp = nextLevel > currentLevel;

        const profileUpdates: any = {
          totalXP: currentXP + rewardXP,
          coins: currentCoins + rewardCoins,
        };

        if (didLevelUp) {
          profileUpdates.level = nextLevel;
          profileUpdates.coins += 25; // Bonus level up coins
        }

        await updateStudentProfile(profileUpdates);

        // Award Energy Builder achievement (first quiz completed)
        checkAndAwardAchievement(user.uid, 'ach_first_quiz', (title, icon) => {
          showNotification({
            title: `🏆 Achievement Unlocked: ${title}!`,
            message: `You earned the ${icon} badge for passing your first quiz!`,
            type: 'achievement',
          });
        });

        // Award Brainiac achievement if score is 100%
        if (correctAnswersCount === totalQuestions) {
          checkAndAwardAchievement(user.uid, 'ach_perfect_quizzes', (title, icon) => {
            showNotification({
              title: `🏆 Achievement Unlocked: ${title}!`,
              message: `You earned the ${icon} badge for scoring 100% on a quiz!`,
              type: 'achievement',
            });
          });
        }
      }

      setGameState('results');
    } catch (err) {
      console.error('Error logging quiz attempt:', err);
    } finally {
      setSavingAttempt(false);
    }
  };

  const handleResetQuiz = () => {
    setSelectedOption(null);
    setIsAnswerChecked(false);
    setCorrectAnswersCount(0);
    setCurrentQuestionIdx(0);
    setGameState('start');
  };

  // --- RENDER VIEWS ---

  // Loading Screen
  if (quizLoading) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
        <Text className="font-nunito-bold text-text-secondary mt-3">Loading Quiz...</Text>
      </View>
    );
  }

  // View: Hub List (when no specific quizId is loaded)
  if (gameState === 'hub') {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={['top']}>
        <View className="px-5 py-4 border-b border-text bg-white">
          <Text className="font-nunito-extrabold text-heading-lg text-text">🧠 Quiz Hub</Text>
          <Text className="font-nunito-medium text-body-md text-text-secondary mt-1">
            Complete lessons first to unlock these trivia quests!
          </Text>
        </View>

        <ScrollView className="flex-1 px-5 pt-4" showsVerticalScrollIndicator={false}>
          {listLoading ? (
            <ActivityIndicator size="large" color={colors.primary.DEFAULT} className="mt-8" />
          ) : quizzesList.length === 0 ? (
            <Card variant="default" className="p-6 bg-white border-2 border-text rounded-3xl mt-4 items-center">
              <Text className="text-4xl mb-2">🎓</Text>
              <Text className="font-nunito-bold text-text-secondary text-center">
                No Quizzes Available yet. Complete your first lesson!
              </Text>
            </Card>
          ) : (
            quizzesList.map((quiz) => (
              <TouchableOpacity
                key={quiz.id}
                onPress={() => router.push({ pathname: '/(tabs)/quiz', params: { quizId: quiz.id } })}
                activeOpacity={0.8}
              >
                <Card variant="pressable" className="mb-4 bg-white border-2 border-text rounded-3xl p-5 shadow-sm">
                  <View className="flex-row justify-between items-start mb-2">
                    <Text className="font-nunito-extrabold text-body-lg text-text flex-1 mr-2">
                      {quiz.title}
                    </Text>
                    <View className="bg-blue-100 border border-blue-300 px-2 py-0.5 rounded-full">
                      <Text className="font-nunito-extrabold text-[10px] text-blue-800">-{quiz.energyCost} ⚡</Text>
                    </View>
                  </View>

                  <Text className="font-nunito-semibold text-xs text-text-secondary">
                    XP Reward: +{quiz.rewardsXP} XP • Coins: +{quiz.rewardsCoins} 🪙
                  </Text>
                  
                  <Text className="font-nunito-extrabold text-xs text-primary mt-4 self-end">
                    Start Quiz ➔
                  </Text>
                </Card>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // View: Quiz Start Screen
  if (gameState === 'start' && activeQuiz) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={['top']}>
        <View className="flex-1 px-5 py-6 justify-between">
          <View>
            <TouchableOpacity onPress={() => router.replace('/(tabs)/quiz')} className="self-start px-3 py-1.5 bg-slate-100 rounded-full mb-4">
              <Text className="font-nunito-bold text-xs text-text">◀ Hub</Text>
            </TouchableOpacity>

            <Text className="font-nunito-extrabold text-heading-lg text-text mb-2">
              {activeQuiz.title}
            </Text>
            <Text className="font-nunito-semibold text-body-md text-text-secondary mb-6">
              Prove your knowledge of this topic and win treasure!
            </Text>

            <Card variant="default" className="p-5 bg-white border-2 border-text rounded-3xl mb-6 shadow-sm">
              <Text className="font-nunito-extrabold text-body-lg text-text mb-4">Quest Details</Text>
              
              <View className="flex-row justify-between border-b border-slate-100 pb-3 mb-3">
                <Text className="font-nunito-bold text-sm text-text-secondary">⚡ Energy Cost</Text>
                <Text className="font-nunito-extrabold text-sm text-blue-600">-{activeQuiz.energyCost} Energy</Text>
              </View>
              
              <View className="flex-row justify-between border-b border-slate-100 pb-3 mb-3">
                <Text className="font-nunito-bold text-sm text-text-secondary">🏆 XP Reward</Text>
                <Text className="font-nunito-extrabold text-sm text-emerald-600">+{activeQuiz.rewardsXP} XP</Text>
              </View>

              <View className="flex-row justify-between">
                <Text className="font-nunito-bold text-sm text-text-secondary">🪙 Coin Reward</Text>
                <Text className="font-nunito-extrabold text-sm text-yellow-500">+{activeQuiz.rewardsCoins} Coins</Text>
              </View>
            </Card>

            <Card variant="pressable" className="flex-row items-center p-4 bg-purple-50 border-2 border-text rounded-3xl mb-4 shadow-sm">
              <Avatar config={studentProfile?.avatar || {} as any} size={65} />
              <View className="flex-1 ml-4 bg-white border border-slate-200 p-3 rounded-2xl">
                <Text className="font-nunito-bold text-xs text-text-secondary">
                  "Ready to put your brain to work? Let's start the quest!"
                </Text>
              </View>
            </Card>
          </View>

          <Button variant="primary" size="lg" onPress={handleStartQuiz}>
            Start Quiz!
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  // View: Playing / Answering Questions
  if (gameState === 'playing' && activeQuiz) {
    const questions = activeQuiz.questions;
    const currentQuestion = questions[currentQuestionIdx];
    const totalQuestions = questions.length;
    const progressPercent = ((currentQuestionIdx + 1) / totalQuestions) * 100;

    return (
      <SafeAreaView className="flex-1 bg-background" edges={['top']}>
        <View className="flex-1 px-5 py-4 justify-between">
          
          {/* Header Progress Indicators */}
          <View className="mb-4">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="font-nunito-extrabold text-xs text-text-secondary">
                Question {currentQuestionIdx + 1} of {totalQuestions}
              </Text>
              <Text className="font-nunito-extrabold text-xs text-emerald-600">
                Score: {correctAnswersCount} correct
              </Text>
            </View>
            <View className="h-2 bg-slate-100 border border-slate-200 rounded-full overflow-hidden">
              <View 
                className="h-full bg-emerald-500 rounded-full" 
                style={{ width: `${progressPercent}%`, backgroundColor: '#10B981' }} 
              />
            </View>
          </View>

          {/* Question Text */}
          <ScrollView className="flex-1 mb-4" showsVerticalScrollIndicator={false}>
            <Card variant="default" className="p-5 bg-white border-2 border-text rounded-3xl mb-6 shadow-sm">
              {currentQuestion.type === 'scenario' && (
                <Text className="font-nunito-bold text-xs text-primary mb-2 uppercase tracking-wider">
                  📖 Story Scenario
                </Text>
              )}
              <Text className="font-nunito-extrabold text-body-lg text-text">
                {currentQuestion.question}
              </Text>
            </Card>

            {/* Selection Grid / Options */}
            <View className="gap-3">
              {currentQuestion.options.map((opt) => {
                const isSelected = selectedOption === opt;
                
                // Styling when answer is checked
                let optionBg = '#FFF';
                let optionBorder = colors.text.DEFAULT;
                let optionBorderWidth = isSelected ? 4 : 2;

                if (isAnswerChecked) {
                  if (opt === currentQuestion.correctAnswer) {
                    optionBg = '#ECFDF5'; // Light green
                    optionBorder = '#10B981'; // Green border
                    optionBorderWidth = 4;
                  } else if (isSelected) {
                    optionBg = '#FEF2F2'; // Light red
                    optionBorder = '#EF4444'; // Red border
                    optionBorderWidth = 4;
                  }
                } else if (isSelected) {
                  optionBg = colors.primary.light;
                  optionBorder = colors.primary.DEFAULT;
                }

                return (
                  <TouchableOpacity
                    key={opt}
                    onPress={() => {
                      if (!isAnswerChecked) {
                        setSelectedOption(opt);
                      }
                    }}
                    activeOpacity={0.8}
                    disabled={isAnswerChecked}
                    style={{
                      backgroundColor: optionBg,
                      borderColor: optionBorder,
                      borderWidth: 2,
                      borderBottomWidth: optionBorderWidth,
                    }}
                    className="p-5 rounded-2xl shadow-sm"
                  >
                    <Text className={`font-nunito-extrabold text-sm text-text`}>
                      {opt}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Explanation card after checked */}
            {isAnswerChecked && (
              <Card 
                variant="default" 
                className="p-4 mt-6 rounded-3xl border-2 shadow-sm"
                style={{ 
                  backgroundColor: isCorrect ? '#ECFDF5' : '#FEF2F2',
                  borderColor: isCorrect ? '#10B981' : '#EF4444' 
                }}
              >
                <Text className={`font-nunito-extrabold text-sm mb-1 ${isCorrect ? 'text-emerald-800' : 'text-red-800'}`}>
                  {isCorrect ? '🎉 Correct!' : '❌ Incorrect'}
                </Text>
                <Text className="font-nunito-bold text-xs text-text-secondary leading-5">
                  {currentQuestion.explanation}
                </Text>
              </Card>
            )}
          </ScrollView>

          {/* Action Footer */}
          <View className="py-2">
            {!isAnswerChecked ? (
              <Button
                variant="primary"
                size="lg"
                onPress={handleCheckAnswer}
                disabled={selectedOption === null}
              >
                Check Answer
              </Button>
            ) : (
              <Button
                variant="primary"
                size="lg"
                onPress={handleNextQuestion}
              >
                {currentQuestionIdx + 1 === totalQuestions ? 'Finish Quiz' : 'Next Question ➔'}
              </Button>
            )}
          </View>

        </View>
      </SafeAreaView>
    );
  }

  // View: Quiz Results (Pass / Fail)
  if (gameState === 'results' && activeQuiz) {
    const totalQuestions = activeQuiz.questions.length;
    const scorePercentage = Math.round((correctAnswersCount / totalQuestions) * 100);
    const passed = scorePercentage >= 60;

    return (
      <SafeAreaView className="flex-1 bg-background" edges={['top']}>
        <View className="flex-1 px-5 py-6 justify-between">
          <View className="items-center justify-center flex-1">
            
            {passed ? (
              <>
                <Text className="text-7xl mb-4">🏆</Text>
                <Text className="font-nunito-extrabold text-heading-lg text-emerald-800 text-center">
                  Quest Passed!
                </Text>
                <Text className="font-nunito-bold text-body-lg text-emerald-600 text-center mt-2">
                  You got {correctAnswersCount} / {totalQuestions} correct ({scorePercentage}%)!
                </Text>

                <Card variant="default" className="p-5 mt-6 bg-yellow-50 border-2 border-yellow-400 items-center rounded-3xl w-full">
                  <Text className="font-nunito-extrabold text-body-md text-yellow-800 mb-2">🪙 Rewards Claimed 🪙</Text>
                  <Text className="font-nunito-bold text-sm text-yellow-700">
                    +{activeQuiz.rewardsXP} XP & +{activeQuiz.rewardsCoins} Coins
                  </Text>
                </Card>
              </>
            ) : (
              <>
                <Text className="text-7xl mb-4">💪</Text>
                <Text className="font-nunito-extrabold text-heading-lg text-red-800 text-center">
                  Keep Practicing!
                </Text>
                <Text className="font-nunito-bold text-body-lg text-red-600 text-center mt-2">
                  You got {correctAnswersCount} / {totalQuestions} correct ({scorePercentage}%).
                </Text>
                <Text className="font-nunito-semibold text-xs text-text-secondary text-center mt-4 px-4">
                  Pass with 60% or higher to earn coins, XP, and unlock prizes. Re-read the lesson material and try again!
                </Text>
              </>
            )}

            {/* Level check indicator */}
            {passed && (
              <Text className="font-nunito-semibold text-xs text-text-secondary mt-6">
                Check your new balance on the dashboard!
              </Text>
            )}
          </View>

          <View className="gap-3 w-full">
            {!passed ? (
              <Button variant="primary" size="lg" onPress={handleResetQuiz}>
                Try Again
              </Button>
            ) : null}

            <Button 
              variant={passed ? "primary" : "outline"} 
              size="lg" 
              onPress={() => router.replace('/(tabs)/learn')}
            >
              Back to Learn
            </Button>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return null;
}
