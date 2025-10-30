'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { getLeaderboard, getLevelInfo, type UserPoints } from '@/lib/pointsSystem';
import Image from 'next/image';
import { FiCrown, FiAward, FiMedal, FiTrophy, FiStar } from 'react-icons/fi';

const Leaderboard = () => {
    const { user } = useUser();
    const [leaderboard, setLeaderboard] = useState<UserPoints[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            setLoading(true);
            const data = await getLeaderboard(20);
            setLeaderboard(data);
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const getRankIcon = (index: number) => {
        switch (index) {
            case 0:
                return <FiCrown className="w-6 h-6 text-yellow-500" />;
            case 1:
                return <FiAward className="w-6 h-6 text-gray-400" />;
            case 2:
                return <FiMedal className="w-6 h-6 text-orange-500" />;
            default:
                return <span className="text-lg font-bold text-gray-500">#{index + 1}</span>;
        }
    };

    const getRankColor = (index: number) => {
        switch (index) {
            case 0:
                return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
            case 1:
                return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
            case 2:
                return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white';
            default:
                return 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white';
        }
    };

    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <FiTrophy className="w-5 h-5 mr-2 text-orange-500" />
                    Top Readers
                </h3>
                <div className="animate-pulse space-y-3">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                            <div className="flex-1">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mt-1"></div>
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
                <FiTrophy className="w-5 h-5 mr-2 text-orange-500" />
                Top Readers
            </h3>

            <div className="space-y-3">
                {leaderboard.map((user, index) => {
                    const levelInfo = getLevelInfo(user.level);
                    const isCurrentUser = user.userId === user?.id;

                    return (
                        <div
                            key={user.userId}
                            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${isCurrentUser
                                    ? 'bg-orange-100 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800'
                                    : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getRankColor(index)}`}>
                                {getRankIcon(index)}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2">
                                    {user.profileImageUrl ? (
                                        <Image
                                            src={user.profileImageUrl}
                                            alt={user.username}
                                            width={24}
                                            height={24}
                                            className="w-6 h-6 rounded-full"
                                        />
                                    ) : (
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                                            <span className="text-white text-xs font-bold">
                                                {user.username.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                    <span className={`font-medium truncate ${isCurrentUser ? 'text-orange-600 dark:text-orange-400' : 'text-gray-900 dark:text-white'}`}>
                                        {user.username}
                                        {isCurrentUser && ' (You)'}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${levelInfo.bgColor} ${levelInfo.color}`}>
                                        Level {user.level} - {levelInfo.name}
                                    </span>
                                    <span className="flex items-center">
                                        <FiStar className="w-3 h-3 mr-1" />
                                        {user.totalPoints.toLocaleString()} pts
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {leaderboard.length === 0 && (
                <div className="text-center py-8">
                    <FiTrophy className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">No readers yet. Be the first!</p>
                </div>
            )}
        </div>
    );
};

export default Leaderboard;
