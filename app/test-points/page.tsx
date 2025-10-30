'use client';

import { useEffect, useState } from 'react';
import { getLeaderboard, getLevelInfo } from '@/lib/pointsSystem';

const TestPointsPage = () => {
    const [testResult, setTestResult] = useState<string>('Testing...');

    useEffect(() => {
        const testPointsSystem = async () => {
            try {
                // Test getLevelInfo
                const level1 = getLevelInfo(1);
                console.log('Level 1:', level1);

                // Test getLeaderboard
                const leaderboard = await getLeaderboard(5);
                console.log('Leaderboard:', leaderboard);

                setTestResult('Points system is working correctly!');
            } catch (error) {
                console.error('Error testing points system:', error);
                setTestResult(`Error: ${error}`);
            }
        };

        testPointsSystem();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
            <div className="w-full px-1">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Points System Test
                    </h1>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                        <p className="text-gray-700 dark:text-gray-300">{testResult}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestPointsPage;
