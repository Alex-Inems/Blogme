'use client';

import { useEffect, useState, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { addPointsForReading, getLevelInfo, getNextMilestone, type UserPoints, type Achievement } from '@/lib/pointsSystem';
import { FiStar, FiTrendingUp, FiAward } from 'react-icons/fi';

interface PointsTrackerProps {
    postId: string;
    onPointsUpdate?: (points: number, level: number) => void;
}

const PointsTracker = ({ postId, onPointsUpdate }: PointsTrackerProps) => {
    const { user } = useUser();
    const [userPoints, setUserPoints] = useState<UserPoints | null>(null);
    const [showAchievement, setShowAchievement] = useState(false);
    const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
    const [isLevelUp, setIsLevelUp] = useState(false);
    const [hasRead, setHasRead] = useState(false);

    const trackReading = useCallback(async () => {
        if (!user || hasRead) return;

        try {
            const result = await addPointsForReading(
                user.id,
                postId,
                user.fullName || user.username || 'Anonymous',
                user.imageUrl || undefined
            );

            setUserPoints(prev => ({
                ...prev,
                totalPoints: result.newPoints,
                level: result.newLevel,
                achievements: [...(prev?.achievements || []), ...result.newAchievements.map(a => a.id)]
            } as UserPoints));

            if (result.newAchievements.length > 0) {
                setNewAchievements(result.newAchievements);
                setShowAchievement(true);
                setTimeout(() => setShowAchievement(false), 5000);
            }

            if (result.isLevelUp) {
                setIsLevelUp(true);
                setTimeout(() => setIsLevelUp(false), 3000);
            }

            setHasRead(true);
            onPointsUpdate?.(result.newPoints, result.newLevel);
        } catch (error) {
            console.error('Error tracking reading:', error);
        }
    }, [user, postId, hasRead, onPointsUpdate]);

    useEffect(() => {
        if (user && !hasRead) {
            trackReading();
        }
    }, [user, postId, hasRead, trackReading]);

    const nextMilestone = userPoints ? getNextMilestone(userPoints.totalPoints) : null;
    const levelInfo = userPoints ? getLevelInfo(userPoints.level) : null;

    if (!user || !userPoints) return null;

    return (
        <>
            {/* Points Display */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-4 text-white mb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <FiStar className="w-5 h-5" />
                            <span className="font-semibold">{userPoints.totalPoints} Points</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <FiTrendingUp className="w-5 h-5" />
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${levelInfo?.bgColor} ${levelInfo?.color}`}>
                                Level {userPoints.level} - {levelInfo?.name}
                            </span>
                        </div>
                    </div>
                    {nextMilestone && (
                        <div className="text-right">
                            <div className="text-sm text-orange-100">Next: {nextMilestone.name}</div>
                            <div className="text-xs text-orange-200">
                                {nextMilestone.pointsRequired - userPoints.totalPoints} points to go
                            </div>
                        </div>
                    )}
                </div>

                {/* Progress Bar */}
                {nextMilestone && (
                    <div className="mt-3">
                        <div className="w-full bg-orange-200 rounded-full h-2">
                            <div
                                className="bg-white h-2 rounded-full transition-all duration-500"
                                style={{
                                    width: `${Math.min(
                                        ((userPoints.totalPoints % nextMilestone.pointsRequired) / nextMilestone.pointsRequired) * 100,
                                        100
                                    )}%`
                                }}
                            ></div>
                        </div>
                    </div>
                )}
            </div>

            {/* Achievement Notification */}
            {showAchievement && newAchievements.length > 0 && (
                <div className="fixed top-4 right-4 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-orange-200 p-4 max-w-sm">
                    <div className="flex items-start space-x-3">
                        <div className="text-2xl">{newAchievements[0].icon}</div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white">Achievement Unlocked!</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{newAchievements[0].name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">{newAchievements[0].description}</p>
                        </div>
                        <button
                            onClick={() => setShowAchievement(false)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}

            {/* Level Up Notification */}
            {isLevelUp && (
                <div className="fixed top-4 left-4 z-50 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg shadow-lg p-4 max-w-sm">
                    <div className="flex items-center space-x-3">
                        <FiAward className="w-6 h-6 text-white" />
                        <div>
                            <h4 className="font-bold text-white">Level Up!</h4>
                            <p className="text-sm text-orange-100">You&apos;ve reached Level {userPoints.level}!</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PointsTracker;



