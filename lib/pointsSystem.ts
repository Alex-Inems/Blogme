import { db } from './firebase';
import { doc, updateDoc, getDoc, setDoc, increment, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

export interface UserPoints {
    userId: string;
    username: string;
    totalPoints: number;
    level: number;
    achievements: string[];
    lastReadPost?: string;
    readCount: number;
    joinDate: string;
    profileImageUrl?: string;
}

export interface Achievement {
    id: string;
    name: string;
    description: string;
    pointsRequired: number;
    icon: string;
    color: string;
}

export const ACHIEVEMENTS: Achievement[] = [
    {
        id: 'first-read',
        name: 'First Steps',
        description: 'Read your first post',
        pointsRequired: 1,
        icon: '👶',
        color: 'bg-blue-100 text-blue-800'
    },
    {
        id: 'century-reader',
        name: 'Century Reader',
        description: 'Reached 100 points',
        pointsRequired: 100,
        icon: '🥉',
        color: 'bg-orange-100 text-orange-800'
    },
    {
        id: 'thousand-reader',
        name: 'Knowledge Seeker',
        description: 'Reached 1,000 points',
        pointsRequired: 1000,
        icon: '🥈',
        color: 'bg-gray-100 text-gray-800'
    },
    {
        id: 'five-thousand-reader',
        name: 'Content Master',
        description: 'Reached 5,000 points',
        pointsRequired: 5000,
        icon: '🥇',
        color: 'bg-yellow-100 text-yellow-800'
    },
    {
        id: 'ten-thousand-reader',
        name: 'Legendary Reader',
        description: 'Reached 10,000 points',
        pointsRequired: 10000,
        icon: '💎',
        color: 'bg-purple-100 text-purple-800'
    }
];

export const POINTS_PER_READ = 1;

export const calculateLevel = (points: number): number => {
    if (points < 100) return 1;
    if (points < 1000) return 2;
    if (points < 5000) return 3;
    if (points < 10000) return 4;
    return 5;
};

export const getLevelInfo = (level: number) => {
    const levels = [
        { name: 'Novice', color: 'text-blue-600', bgColor: 'bg-blue-100' },
        { name: 'Explorer', color: 'text-green-600', bgColor: 'bg-green-100' },
        { name: 'Scholar', color: 'text-orange-600', bgColor: 'bg-orange-100' },
        { name: 'Expert', color: 'text-purple-600', bgColor: 'bg-purple-100' },
        { name: 'Legend', color: 'text-yellow-600', bgColor: 'bg-yellow-100' }
    ];
    return levels[level - 1] || levels[0];
};

export const getNextMilestone = (points: number): Achievement | null => {
    return ACHIEVEMENTS.find(achievement => achievement.pointsRequired > points) || null;
};

export const getUnlockedAchievements = (points: number): Achievement[] => {
    return ACHIEVEMENTS.filter(achievement => achievement.pointsRequired <= points);
};

export const addPointsForReading = async (userId: string, postId: string, username: string, profileImageUrl?: string): Promise<{
    newPoints: number;
    newLevel: number;
    newAchievements: Achievement[];
    isLevelUp: boolean;
}> => {
    try {
        const userRef = doc(db, 'userPoints', userId);
        const userDoc = await getDoc(userRef);

        let currentPoints = 0;
        let currentAchievements: string[] = [];
        let readCount = 0;

        if (userDoc.exists()) {
            const data = userDoc.data();
            currentPoints = data.totalPoints || 0;
            currentAchievements = data.achievements || [];
            readCount = data.readCount || 0;
        } else {
            // Create new user points document
            await setDoc(userRef, {
                userId,
                username,
                totalPoints: 0,
                level: 1,
                achievements: [],
                readCount: 0,
                joinDate: new Date().toISOString(),
                profileImageUrl
            });
        }

        const newPoints = currentPoints + POINTS_PER_READ;
        const newLevel = calculateLevel(newPoints);
        const oldLevel = calculateLevel(currentPoints);
        const isLevelUp = newLevel > oldLevel;

        // Check for new achievements
        const unlockedAchievements = getUnlockedAchievements(newPoints);
        const newAchievements = unlockedAchievements.filter(
            achievement => !currentAchievements.includes(achievement.id)
        );

        // Update user points
        await updateDoc(userRef, {
            totalPoints: newPoints,
            level: newLevel,
            achievements: [...currentAchievements, ...newAchievements.map(a => a.id)],
            readCount: readCount + 1,
            lastReadPost: postId,
            username,
            profileImageUrl
        });

        return {
            newPoints,
            newLevel,
            newAchievements,
            isLevelUp
        };
    } catch (error) {
        console.error('Error adding points:', error);
        throw error;
    }
};

export const getUserPoints = async (userId: string): Promise<UserPoints | null> => {
    try {
        const userRef = doc(db, 'userPoints', userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            return userDoc.data() as UserPoints;
        }
        return null;
    } catch (error) {
        console.error('Error getting user points:', error);
        return null;
    }
};

export const getLeaderboard = async (limitCount: number = 10): Promise<UserPoints[]> => {
    try {
        const pointsRef = collection(db, 'userPoints');
        const q = query(pointsRef, orderBy('totalPoints', 'desc'), limit(limitCount));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => doc.data() as UserPoints);
    } catch (error) {
        console.error('Error getting leaderboard:', error);
        return [];
    }
};

export const getAchievementById = (id: string): Achievement | undefined => {
    return ACHIEVEMENTS.find(achievement => achievement.id === id);
};


