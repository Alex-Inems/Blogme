'use client';

import { useEffect, useState } from 'react';

const LeaderboardPage = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading
        setTimeout(() => setLoading(false), 1000);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
                <div className="w-full px-1">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                            <p className="text-gray-600 dark:text-gray-400">Loading leaderboard...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
            <div className="w-full px-1">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Reader Leaderboard
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400">
                            Top readers based on points earned from reading posts
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg text-center">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Leaderboard Coming Soon!
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            The points and ranking system is being set up. Check back soon to see the top readers!
                        </p>
                        <a
                            href="/"
                            className="inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                        >
                            Back to Home
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeaderboardPage;