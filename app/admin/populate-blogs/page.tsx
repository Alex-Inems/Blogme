'use client';

import { useState } from 'react';

const PopulateBlogsPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isClearing, setIsClearing] = useState(false);
    const [result, setResult] = useState<string>('');

    const handleClearBlogs = async () => {
        setIsClearing(true);
        setResult('');

        try {
            const response = await fetch('/api/clear-blogs', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (data.success) {
                setResult(`🗑️ ${data.message}`);
            } else {
                setResult(`❌ Error: ${data.error}`);
            }
        } catch (error) {
            setResult(`❌ Error: ${error}`);
        } finally {
            setIsClearing(false);
        }
    };

    const handlePopulateBlogs = async () => {
        setIsLoading(true);
        setResult('');

        try {
            const response = await fetch('/api/populate-blogs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (data.success) {
                setResult(`✅ ${data.message}`);
            } else {
                setResult(`❌ Error: ${data.error}`);
            }
        } catch (error) {
            setResult(`❌ Error: ${error}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-16">
            <div className="max-w-2xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Populate Blog Database</h1>

                    <div className="mb-6">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                            <h3 className="text-lg font-semibold text-yellow-800 mb-2">⚠️ Important Instructions</h3>
                            <p className="text-yellow-700 text-sm">
                                <strong>Step 1:</strong> Click &quot;Clear All Existing Blogs&quot; first to remove old posts without author images<br />
                                <strong>Step 2:</strong> Click &quot;Add 100 Blogs with Author Images&quot; to populate with new posts that have proper author profile pictures
                            </p>
                        </div>

                        <p className="text-gray-600 mb-4">
                            This will add 100 diverse blog posts to your database with:
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
                            <li>7 different categories (Tech, Health, Politics, Business, Lifestyle, Science, Education)</li>
                            <li>2000+ words per blog post</li>
                            <li>2+ images per blog post</li>
                            <li>High-quality images from Unsplash</li>
                            <li>Realistic author profiles and metadata</li>
                            <li>Random publication dates over the past year</li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={handleClearBlogs}
                            disabled={isClearing || isLoading}
                            className="w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isClearing ? 'Clearing Database...' : '🗑️ Clear All Existing Blogs'}
                        </button>

                        <button
                            onClick={handlePopulateBlogs}
                            disabled={isLoading || isClearing}
                            className="w-full bg-orange-600 text-white py-3 px-6 rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Adding Blogs...' : '✅ Add 100 Blogs with Author Images'}
                        </button>
                    </div>

                    {result && (
                        <div className={`mt-6 p-4 rounded-lg ${result.includes('✅')
                            ? 'bg-green-50 border border-green-200 text-green-800'
                            : 'bg-red-50 border border-red-200 text-red-800'
                            }`}>
                            {result}
                        </div>
                    )}

                    <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h3 className="text-lg font-semibold text-blue-900 mb-2">What This Will Create:</h3>
                        <div className="text-sm text-blue-800 space-y-1">
                            <p>• <strong>Tech:</strong> AI, Machine Learning, Web Development, Cybersecurity, etc.</p>
                            <p>• <strong>Health:</strong> Mental Health, Nutrition, Fitness, Medical Research, etc.</p>
                            <p>• <strong>Politics:</strong> Policy Analysis, International Relations, Social Justice, etc.</p>
                            <p>• <strong>Business:</strong> Entrepreneurship, Marketing, Leadership, Innovation, etc.</p>
                            <p>• <strong>Lifestyle:</strong> Travel, Fashion, Cooking, Personal Development, etc.</p>
                            <p>• <strong>Science:</strong> Space Exploration, Climate Change, Biology, Physics, etc.</p>
                            <p>• <strong>Education:</strong> Learning Methods, Career Development, Skill Building, etc.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PopulateBlogsPage;
