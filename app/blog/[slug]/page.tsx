'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import CommentsSection from '@/components/Comments';
import LikeCommentSection from '@/components/LikeCommentSection';
import BlogSidebar from '@/components/BlogSidebar';
// import PointsTracker from '@/components/PointsTracker';
import Image from 'next/image';
import Link from 'next/link';

interface Post {
    id: string;
    title: string;
    slug: string;
    content: string;
    author: string;
    authorProfileImage: string;
    createdAt: { toDate: () => Date };
    imageUrl: string;
    category: string;
    topic: string;
    readingTime: number;
    views: number;
    likes: number;
}

interface PostPageProps {
    params: { slug: string };
}

const PostPage = ({ params }: PostPageProps) => {
    const { slug } = params;
    const { user } = useUser();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const postsCollection = collection(db, 'posts');
                const q = query(postsCollection, where('slug', '==', slug));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const doc = querySnapshot.docs[0];
                    const postData = { id: doc.id, ...doc.data() } as Post;
                    setPost(postData);
                }
            } catch (error) {
                console.error('Error fetching post:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [slug]);

    const isAuthor = user && post && user.id === post.author;

    const handleShare = () => {
        const shareUrl = `${window.location.origin}/blog/${slug}`;
        navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!post) return <div className="min-h-screen flex items-center justify-center">Post not found</div>;

    return (
        <div className="w-full px-1 dark:bg-slate-950 bg-gray-50 min-h-screen">
            <div className="w-full mt-1">
                <div className="flex flex-col lg:flex-row gap-2 lg:gap-3">
                    {/* Main Content - Left Side */}
                    <div className="lg:w-2/3">
                        <div className="shadow-md p-2 dark:bg-slate-950 dark:text-white bg-white rounded-md">
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-4 leading-tight">{post.title}</h1>

                            <div className="border-t border-b border-gray-300 py-4">
                                <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
                                    {/* Author Info */}
                                    <div className="flex items-center space-x-3">
                                        <div className="relative">
                                            {post.authorProfileImage ? (
                                                <Image
                                                    src={post.authorProfileImage}
                                                    alt={`${post.author}'s profile image`}
                                                    width={40}
                                                    height={40}
                                                    className="w-10 h-10 rounded-full"
                                                    onMouseEnter={() => setShowModal(true)}
                                                    onMouseLeave={() => setShowModal(false)}
                                                />
                                            ) : (
                                                <div
                                                    className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center cursor-pointer"
                                                    onMouseEnter={() => setShowModal(true)}
                                                    onMouseLeave={() => setShowModal(false)}
                                                >
                                                    <span className="text-white font-bold text-sm">B</span>
                                                </div>
                                            )}

                                            {showModal && post && (
                                                <div
                                                    className="absolute z-10 bg-white shadow-md w-64 h-auto flex flex-col items-center justify-center rounded-md mt-2 p-2"
                                                    onMouseEnter={() => setShowModal(true)}
                                                    onMouseLeave={() => setShowModal(false)}
                                                >
                                                    <div className="flex flex-col items-center">
                                                        {post.authorProfileImage ? (
                                                            <Image
                                                                src={post.authorProfileImage}
                                                                alt={`${post.author}'s profile image`}
                                                                width={60}
                                                                height={60}
                                                                className="w-15 h-15 rounded-full mb-2"
                                                            />
                                                        ) : (
                                                            <div className="w-15 h-15 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-2">
                                                                <span className="text-white font-bold text-lg">B</span>
                                                            </div>
                                                        )}
                                                        <p className="text-black font-semibold">{post.author}</p>
                                                        <p className="text-gray-600 text-sm">Author</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-left">
                                            <p className="text-gray-600 dark:text-gray-300 font-medium">By {post.author}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {post.createdAt.toDate().toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-wrap items-center gap-2">
                                        <button
                                            onClick={handleShare}
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md transition-colors duration-200 text-sm"
                                        >
                                            Share
                                        </button>
                                        {isAuthor && (
                                            <Link
                                                href={`/post/edit/${post.id}`}
                                                className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-md transition-colors duration-200 text-sm"
                                            >
                                                Edit
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-2 mb-2">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4 space-y-2 sm:space-y-0">
                                    <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                                        <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs">Category: {post.category}</span>
                                        <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs">Topic: {post.topic}</span>
                                        <span className="text-xs sm:text-sm">{post.readingTime} min read</span>
                                    </div>
                                    <div className="flex items-center space-x-4 text-xs sm:text-sm">
                                        <span>{post.views} views</span>
                                        <span>{post.likes} likes</span>
                                    </div>
                                </div>
                            </div>

                            {/* Points Tracker */}
                            {/* <PointsTracker postId={post.id} /> */}

                            <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none dark:prose-invert">
                                <div dangerouslySetInnerHTML={{ __html: post.content }} />
                            </div>

                            {/* Likes and Comments Section */}
                            <LikeCommentSection
                                postId={post.id}
                                initialLikes={post.likes || 0}
                                authorImage={post.authorProfileImage}
                            />

                            <div className="mt-4">
                                <CommentsSection postId={post.id} />
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="lg:w-1/3">
                        <div className="sticky top-8">
                            <BlogSidebar />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostPage;
