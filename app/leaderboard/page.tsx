'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { getLeaderboard, getLevelInfo, type UserPoints } from '@/lib/pointsSystem';
import Image from 'next/image';
import { FiAward, FiStar, FiTrendingUp } from 'react-icons/fi';

const LeaderboardPage = () => {
    const { user } = useUser();
    const [leaderboard, setLeaderboard] = useState<UserPoints[]>([]);
    const [loading, setLoading] = useState(true);
    const [userRank, setUserRank] = useState<number | null>(null);
    const [userPoints, setUserPoints] = useState<UserPoints | null>(null);

    const fetchLeaderboard = async () => {
        try {
            setLoading(true);
            // Fetch top 50 users
            const data = await getLeaderboard(50);
            setLeaderboard(data);

            // Find current user's rank if signed in
            if (user) {
                const userIndex = data.findIndex(u => u.userId === user.id);
                if (userIndex !== -1) {
                    setUserRank(userIndex + 1);
                    setUserPoints(data[userIndex]);
                } else {
                    // User not in top 50, fetch their points separately
                    const { getUserPoints } = await import('@/lib/pointsSystem');
                    const userData = await getUserPoints(user.id);
                    if (userData) {
                        setUserPoints(userData);
                        // Calculate approximate rank (would need full query for exact rank)
                        const rank = data.filter(u => u.totalPoints > userData.totalPoints).length + 1;
                        setUserRank(rank);
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaderboard();

        // Auto-refresh leaderboard every 30 seconds
        const interval = setInterval(() => {
            fetchLeaderboard();
        }, 30000);

        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const getRankIcon = (index: number) => {
        switch (index) {
            case 0:
                return <span className="text-3xl">👑</span>;
            case 1:
                return <span className="text-2xl">🥈</span>;
            case 2:
                return <span className="text-2xl">🥉</span>;
            default:
                return <span className="text-lg font-bold text-gray-500 dark:text-zinc-400">#{index + 1}</span>;
        }
    };

    const getRankColor = (index: number) => {
        switch (index) {
            case 0:
                return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-lg';
            case 1:
                return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white shadow-lg';
            case 2:
                return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white shadow-lg';
            default:
                return 'bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-zinc-50';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-12">
                <div className="w-full px-1">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-8">
                            <div className="h-10 bg-gray-200 dark:bg-zinc-800 rounded-lg w-1/3 mx-auto mb-4 animate-pulse"></div>
                            <div className="h-6 bg-gray-200 dark:bg-zinc-800 rounded-lg w-1/2 mx-auto animate-pulse"></div>
                        </div>
                        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-lg">
                            <div className="animate-pulse space-y-4">
                                {[...Array(10)].map((_, i) => (
                                    <div key={i} className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-gray-200 dark:bg-zinc-800 rounded-full"></div>
                                        <div className="flex-1">
                                            <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-1/3 mb-2"></div>
                                            <div className="h-3 bg-gray-200 dark:bg-zinc-800 rounded w-1/4"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-12">
            <div className="w-full px-1">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center mb-4">
                            <FiAward className="w-12 h-12 text-orange-500 mr-3" />
                            <h1 className="text-4xl font-bold text-gray-900 dark:text-zinc-50">
                                Reader Leaderboard
                            </h1>
                        </div>
                        <p className="text-xl text-gray-600 dark:text-zinc-400">
                            Top readers based on points earned from reading posts
                        </p>
                    </div>

                    {/* Current User Stats */}
                    {user && userPoints && (
                        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 mb-8 shadow-lg text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-orange-100 mb-2">Your Ranking</p>
                                    <div className="flex items-center space-x-3">
                                        <span className="text-3xl font-bold">#{userRank || '?'}</span>
                                        <div>
                                            <p className="text-lg font-semibold">{userPoints.username}</p>
                                            <div className="flex items-center space-x-2 text-orange-100">
                                                <FiStar className="w-4 h-4" />
                                                <span>{userPoints.totalPoints.toLocaleString()} points</span>
                                                <span className="mx-2">•</span>
                                                <span>Level {userPoints.level}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-orange-100 mb-2">Read Count</p>
                                    <p className="text-2xl font-bold">{userPoints.readCount}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Leaderboard */}
                    <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 md:p-8 shadow-lg">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-50 flex items-center">
                                <FiAward className="w-6 h-6 mr-2 text-orange-500" />
                                Top Readers
                            </h2>
                            <span className="text-sm text-gray-500 dark:text-zinc-400">
                                {leaderboard.length} users
                            </span>
                        </div>

                        {leaderboard.length === 0 ? (
                            <div className="text-center py-12">
                                <FiAward className="w-16 h-16 text-gray-300 dark:text-zinc-600 mx-auto mb-4" />
                                <p className="text-gray-500 dark:text-zinc-400 text-lg mb-2">No readers yet</p>
                                <p className="text-gray-400 dark:text-zinc-500 text-sm">
                                    Start reading posts to earn points and appear on the leaderboard!
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {leaderboard.map((userData, index) => {
                                    // Ensure level is valid before calling getLevelInfo
                                    const validLevel = (userData.level && userData.level >= 1 && userData.level <= 5) ? userData.level : 1;
                                    // Default level info in case getLevelInfo fails
                                    const defaultLevelInfo = { name: 'Novice', color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900/30' };
                                    let levelInfo;
                                    try {
                                        levelInfo = getLevelInfo(validLevel) || defaultLevelInfo;
                                    } catch (error) {
                                        console.error('Error getting level info:', error);
                                        levelInfo = defaultLevelInfo;
                                    }
                                    // Ensure levelInfo has all required properties
                                    if (!levelInfo || !levelInfo.name || !levelInfo.color || !levelInfo.bgColor) {
                                        levelInfo = defaultLevelInfo;
                                    }
                                    const isCurrentUser = user && userData.userId === user.id;

                                    return (
                                        <div
                                            key={userData.userId}
                                            className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-200 ${isCurrentUser
                                                ? 'bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-500 dark:border-orange-500 shadow-md'
                                                : index < 3
                                                    ? 'bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700'
                                                    : 'hover:bg-gray-50 dark:hover:bg-zinc-800 border border-transparent hover:border-gray-200 dark:hover:border-zinc-700'
                                                }`}
                                        >
                                            {/* Rank */}
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${getRankColor(index)}`}>
                                                {getRankIcon(index)}
                                            </div>

                                            {/* Profile Image */}
                                            <div className="flex-shrink-0">
                                                {userData.profileImageUrl ? (
                                                    <Image
                                                        src={userData.profileImageUrl}
                                                        alt={userData.username}
                                                        width={48}
                                                        height={48}
                                                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-zinc-700"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center border-2 border-gray-200 dark:border-zinc-700">
                                                        <span className="text-white text-lg font-bold">
                                                            {userData.username.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* User Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <span className={`font-semibold text-lg truncate ${isCurrentUser
                                                        ? 'text-orange-600 dark:text-orange-400'
                                                        : 'text-gray-900 dark:text-zinc-50'
                                                        }`}>
                                                        {userData.username}
                                                    </span>
                                                    {isCurrentUser && (
                                                        <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full font-medium">
                                                            You
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center flex-wrap gap-2 text-sm">
                                                    {levelInfo && levelInfo.name && levelInfo.bgColor && levelInfo.color && (
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${levelInfo.bgColor} ${levelInfo.color}`}>
                                                            Level {userData.level} - {levelInfo.name}
                                                        </span>
                                                    )}
                                                    <span className="flex items-center text-gray-600 dark:text-zinc-400">
                                                        <FiStar className="w-4 h-4 mr-1 text-orange-500" />
                                                        <span className="font-semibold">{userData.totalPoints.toLocaleString()}</span>
                                                        <span className="ml-1">points</span>
                                                    </span>
                                                    <span className="text-gray-500 dark:text-zinc-500">
                                                        • {userData.readCount} reads
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Trend Indicator for top 3 */}
                                            {index < 3 && (
                                                <div className="flex-shrink-0">
                                                    <FiTrendingUp className="w-6 h-6 text-orange-500" />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Info Box */}
                        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                                <strong>How to earn points:</strong> Read posts to earn 1 point per post.
                                Level up by reaching milestones: 100 points (Level 2), 1,000 points (Level 3),
                                5,000 points (Level 4), and 10,000 points (Level 5).
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeaderboardPage;