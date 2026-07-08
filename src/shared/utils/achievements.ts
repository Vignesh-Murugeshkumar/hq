import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';

/**
 * Checks if a student has already unlocked a specific achievement.
 * If not, writes an unlock record to `studentAchievements` and awards the reward coins/XP.
 *
 * @param userId - The student's user ID
 * @param achievementId - The unique ID of the achievement to award
 * @param onUnlocked - Optional callback triggered on successful unlock (e.g. to display a toast)
 */
export async function checkAndAwardAchievement(
  userId: string,
  achievementId: string,
  onUnlocked?: (achievementTitle: string, icon: string) => void
) {
  try {
    const studentAchId = `${userId}_${achievementId}`;
    const studentAchRef = doc(db, 'studentAchievements', studentAchId);
    const studentAchSnap = await getDoc(studentAchRef);

    // If already unlocked, do nothing
    if (studentAchSnap.exists()) {
      return;
    }

    // 1. Fetch achievement template details
    const achRef = doc(db, 'achievements', achievementId);
    const achSnap = await getDoc(achRef);
    if (!achSnap.exists()) {
      console.warn(`Achievement ${achievementId} template not found in database.`);
      return;
    }
    const achData = achSnap.data();

    // 2. Write student achievements unlock record
    await setDoc(studentAchRef, {
      userId,
      achievementId,
      unlockedAt: serverTimestamp(),
    });

    // 3. Update student profile with reward Coins & XP
    const profileRef = doc(db, 'profiles', userId);
    const profileSnap = await getDoc(profileRef);
    
    if (profileSnap.exists()) {
      const profile = profileSnap.data();
      const currentXP = profile.totalXP || 0;
      const currentCoins = profile.coins || 0;

      const rewardXP = achData.xpReward || 0;
      const rewardCoins = achData.coinsReward || 0;

      const newXP = currentXP + rewardXP;
      const nextLevel = Math.floor(newXP / 100) + 1;
      const currentLevel = profile.level || 1;
      const didLevelUp = nextLevel > currentLevel;

      const updates: any = {
        totalXP: newXP,
        coins: currentCoins + rewardCoins,
        updatedAt: serverTimestamp(),
      };

      if (didLevelUp) {
        updates.level = nextLevel;
        updates.coins += 25; // Award Level Up coin bonus
      }

      await updateDoc(profileRef, updates);
      
      // Trigger UI callback
      if (onUnlocked) {
        onUnlocked(achData.title, achData.icon);
      }
    }
  } catch (error) {
    console.error(`Failed to award achievement ${achievementId}:`, error);
  }
}
