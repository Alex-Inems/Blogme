'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Image from 'next/image';
import Link from 'next/link';
// import Leaderboard from './Leaderboard';
// import Achievements from './Achievements';

interface BlogPost {
    id: string;
    title: string;
    slug?: string;
    author: string;
    authorProfileImage?: string;
    createdAt: { toDate: () => Date };
    views?: number;
    likes?: number;
    category?: string;
    topic?: string;
}

interface AuthorStats {
    author: string;
    authorProfileImage?: string;
    postCount: number;
    totalViews: number;
    totalLikes: number;
}

const BlogSidebar = () => {
    const [topAuthors, setTopAuthors] = useState<AuthorStats[]>([]);
    const [topBlogs, setTopBlogs] = useState<BlogPost[]>([]);
    const [recommendedBlogs, setRecommendedBlogs] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSidebarData = async () => {
            try {
                // Fetch all posts for analysis
                const postsRef = collection(db, 'posts');
                const postsQuery = query(postsRef, orderBy('createdAt', 'desc'));
                const postsSnapshot = await getDocs(postsQuery);

                const allPosts: BlogPost[] = postsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as BlogPost));

                // Calculate top authors
                const authorStats: { [key: string]: AuthorStats } = {};
                allPosts.forEach(post => {
                    if (!authorStats[post.author]) {
                        authorStats[post.author] = {
                            author: post.author,
                            authorProfileImage: post.authorProfileImage,
                            postCount: 0,
                            totalViews: 0,
                            totalLikes: 0
                        };
                    }
                    authorStats[post.author].postCount++;
                    authorStats[post.author].totalViews += post.views || 0;
                    authorStats[post.author].totalLikes += post.likes || 0;
                });

                const sortedAuthors = Object.values(authorStats)
                    .sort((a, b) => (b.totalViews + b.totalLikes) - (a.totalViews + a.totalLikes))
                    .slice(0, 5);

                setTopAuthors(sortedAuthors);

                // Get top blogs by views and likes
                const topBlogsByEngagement = allPosts
                    .sort((a, b) => ((b.views || 0) + (b.likes || 0)) - ((a.views || 0) + (a.likes || 0)))
                    .slice(0, 5);

                setTopBlogs(topBlogsByEngagement);

                // Get recommended blogs (recent posts with good engagement)
                const recommended = allPosts
                    .filter(post => (post.views || 0) > 50 || (post.likes || 0) > 5)
                    .slice(0, 5);

                setRecommendedBlogs(recommended);

            } catch (error) {
                console.error('Error fetching sidebar data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSidebarData();
    }, []);

    if (loading) {
        return (
            <div className="w-full space-y-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-4 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full space-y-3">
            {/* Leaderboard */}
            {/* <Leaderboard /> */}

            {/* Achievements */}
            {/* <Achievements /> */}

            {/* Top Authors */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-2 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Top Authors
                </h3>
                <div className="space-y-4">
                    {topAuthors.map((author, index) => (
                        <div key={author.author} className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                                {author.authorProfileImage ? (
                                    <Image
                                        src={author.authorProfileImage}
                                        alt={`${author.author}'s profile`}
                                        width={40}
                                        height={40}
                                        className="w-10 h-10 rounded-full"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                                        <span className="text-white font-bold text-sm">
                                            {author.author.charAt(0)}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                    {author.author}
                                </p>
                                <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                                    <span>{author.postCount} posts</span>
                                    <span>•</span>
                                    <span>{author.totalViews} views</span>
                                </div>
                            </div>
                            <div className="flex-shrink-0">
                                <span className="text-xs font-bold text-orange-500">#{index + 1}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Top Blogs */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-2 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Top Blogs
                </h3>
                <div className="space-y-4">
                    {topBlogs.map((blog, index) => (
                        <Link key={blog.id} href={`/blog/${blog.slug || blog.id}`} className="block group">
                            <div className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                                <div className="flex-shrink-0">
                                    <span className="text-xs font-bold text-orange-500 bg-orange-100 dark:bg-orange-900 px-2 py-1 rounded">
                                        #{index + 1}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-200 line-clamp-2">
                                        {blog.title}
                                    </h4>
                                    <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        <span>{blog.views || 0} views</span>
                                        <span>•</span>
                                        <span>{blog.likes || 0} likes</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Recommended Blogs */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-2 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Recommended
                </h3>
                <div className="space-y-4">
                    {recommendedBlogs.map((blog) => (
                        <Link key={blog.id} href={`/blog/${blog.slug || blog.id}`} className="block group">
                            <div className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                                <div className="flex-shrink-0">
                                    {blog.authorProfileImage ? (
                                        <Image
                                            src={blog.authorProfileImage}
                                            alt={`${blog.author}'s profile`}
                                            width={32}
                                            height={32}
                                            className="w-8 h-8 rounded-full"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                                            <span className="text-white font-bold text-xs">
                                                {blog.author.charAt(0)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-200 line-clamp-2">
                                        {blog.title}
                                    </h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        By {blog.author} • {blog.createdAt.toDate().toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogSidebar;
