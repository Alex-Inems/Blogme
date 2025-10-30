'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { getUserPoints, ACHIEVEMENTS, getUnlockedAchievements, type UserPoints, type Achievement } from '@/lib/pointsSystem';
import { FiAward, FiLock, FiCheck } from 'react-icons/fi';

const Achievements = () => {
    const { user } = useUser();
    const [userPoints, setUserPoints] = useState<UserPoints | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchUserPoints();
        }
    }, [user]);

    const fetchUserPoints = async () => {
        if (!user) return;

        try {
            setLoading(true);
            const points = await getUserPoints(user.id);
            setUserPoints(points);
        } catch (error) {
            console.error('Error fetching user points:', error);
        } finally {
            setLoading(false);
        }
    };

    const isAchievementUnlocked = (achievementId: string): boolean => {
        return userPoints?.achievements?.includes(achievementId) || false;
    };

    const getAchievementProgress = (achievement: Achievement): number => {
        if (!userPoints) return 0;
        return Math.min((userPoints.totalPoints / achievement.pointsRequired) * 100, 100);
    };

    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <FiAward className="w-5 h-5 mr-2 text-orange-500" />
                    Achievements
                </h3>
                <div className="animate-pulse space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                            <div className="flex-1">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <FiAward className="w-5 h-5 mr-2 text-orange-500" />
                Achievements
            </h3>

            <div className="space-y-4">
                {ACHIEVEMENTS.map((achievement) => {
                    const isUnlocked = isAchievementUnlocked(achievement.id);
                    const progress = getAchievementProgress(achievement);

                    return (
                        <div
                            key={achievement.id}
                            className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${isUnlocked
                                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                                    : 'bg-gray-50 dark:bg-gray-700'
                                }`}
                        >
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${isUnlocked
                                    ? 'bg-green-100 dark:bg-green-900/30'
                                    : 'bg-gray-200 dark:bg-gray-600'
                                }`}>
                                {isUnlocked ? achievement.icon : <FiLock className="w-6 h-6 text-gray-400" />}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2">
                                    <h4 className={`font-medium ${isUnlocked
                                            ? 'text-green-800 dark:text-green-200'
                                            : 'text-gray-700 dark:text-gray-300'
                                        }`}>
                                        {achievement.name}
                                    </h4>
                                    {isUnlocked && (
                                        <FiCheck className="w-4 h-4 text-green-500" />
                                    )}
                                </div>
                                <p className={`text-sm ${isUnlocked
                                        ? 'text-green-600 dark:text-green-400'
                                        : 'text-gray-500 dark:text-gray-400'
                                    }`}>
                                    {achievement.description}
                                </p>

                                {/* Progress Bar */}
                                {!isUnlocked && (
                                    <div className="mt-2">
                                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                                            <span>Progress</span>
                                            <span>{Math.round(progress)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                            <div
                                                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${progress}%` }}
                                            ></div>
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            {userPoints?.totalPoints || 0} / {achievement.pointsRequired} points
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Summary Stats */}
            {userPoints && (
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                            <div className="text-2xl font-bold text-orange-600">
                                {userPoints.achievements?.length || 0}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Unlocked</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-orange-600">
                                {ACHIEVEMENTS.length - (userPoints.achievements?.length || 0)}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Remaining</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Achievements;
