'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Image from 'next/image';

interface Post {
    id: string;
    title: string;
    slug?: string;
    content: string;
    author: string;
    authorProfileImage: string;
    createdAt: any;
    imageUrl: string;
    readingTime?: number;
    category?: string;
    topic?: string;
}

const TestBlogsPage = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const postsCollection = collection(db, 'posts');
                const postsQuery = query(postsCollection, orderBy('createdAt', 'desc'));
                const postSnapshot = await getDocs(postsQuery);
                const postList = postSnapshot.docs.map(doc => ({
                    ...(doc.data() as Omit<Post, 'id'>),
                    id: doc.id,
                }));

                console.log('Total posts found:', postList.length);
                console.log('First few posts:', postList.slice(0, 3));

                setPosts(postList);
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading posts...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-16">
            <div className="max-w-6xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Test Blogs - Debug Info</h1>

                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h2 className="text-lg font-semibold text-blue-900 mb-2">Debug Information</h2>
                    <p className="text-blue-800">Total posts in database: <strong>{posts.length}</strong></p>
                    <p className="text-blue-800">Posts with authorProfileImage: <strong>{posts.filter(p => p.authorProfileImage).length}</strong></p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.slice(0, 9).map((post) => (
                        <Link href={`/blog/${post.slug || post.id}`} key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
                            {post.imageUrl ? (
                                <Image
                                    src={post.imageUrl}
                                    alt={post.title}
                                    width={400}
                                    height={200}
                                    className="w-full h-48 object-cover"
                                />
                            ) : (
                                <div className="w-full h-48 bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                                    <div className="text-center text-white">
                                        <h3 className="text-3xl font-bold mb-1">Blogme</h3>
                                        <p className="text-orange-100 text-xs">Your Story Awaits</p>
                                    </div>
                                </div>
                            )}
                            <div className="p-4">
                                <h3 className="text-lg font-semibold mb-2 line-clamp-2">{post.title}</h3>
                                <p className="text-sm text-gray-600 mb-3">{post.content.slice(0, 100)}...</p>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        {post.authorProfileImage ? (
                                            <Image
                                                src={post.authorProfileImage}
                                                alt={`${post.author}'s profile`}
                                                width={32}
                                                height={32}
                                                className="w-8 h-8 rounded-full"
                                                onError={(e) => {
                                                    console.log('Image failed to load:', post.authorProfileImage);
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                            />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                                                <span className="text-white font-bold text-xs">B</span>
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{post.author}</p>
                                            <p className="text-xs text-gray-500">
                                                {post.createdAt?.toDate?.()?.toLocaleDateString() || 'Unknown date'}
                                            </p>
                                        </div>
                                    </div>

                                    {post.readingTime && (
                                        <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                                            {post.readingTime} min read
                                        </span>
                                    )}
                                </div>

                                <div className="mt-3 text-xs text-gray-500">
                                    <p>Category: {post.category || 'N/A'}</p>
                                    <p>Topic: {post.topic || 'N/A'}</p>
                                    <p>Author Image: {post.authorProfileImage ? '✅ Present' : '❌ Missing'}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {posts.length === 0 && (
                    <div className="text-center py-12">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">No Posts Found</h2>
                        <p className="text-gray-600 mb-6">It looks like there are no blog posts in your database yet.</p>
                        <a
                            href="/admin/populate-blogs"
                            className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors duration-200"
                        >
                            Populate Database with 100 Blogs
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TestBlogsPage;
