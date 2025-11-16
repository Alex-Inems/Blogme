'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { toast } from 'sonner';

interface Comment {
    id: string;
    author: string;
    content: string;
    authorImage?: string;
    createdAt: { toDate: () => Date };
}

interface LikeCommentSectionProps {
    postId: string;
    initialLikes: number;
    authorImage?: string;
}

const LikeCommentSection = ({ postId, initialLikes, authorImage }: LikeCommentSectionProps) => {
    const { user } = useUser();
    const [likes, setLikes] = useState(initialLikes);
    const [isLiked, setIsLiked] = useState(false);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState<Comment[]>([]);
    const [showComments, setShowComments] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleLike = async () => {
        if (!user) {
            toast.info('Sign in required', {
                description: 'Please sign in to like posts.',
            });
            return;
        }

        try {
            const response = await fetch('/api/like-post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ postId }),
            });

            if (response.ok) {
                setLikes(prev => isLiked ? prev - 1 : prev + 1);
                setIsLiked(!isLiked);
            }
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !comment.trim()) return;

        setIsSubmitting(true);
        try {
            const response = await fetch('/api/add-comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    postId,
                    author: user.fullName || user.username || 'Anonymous',
                    content: comment.trim(),
                    authorImage: user.imageUrl || authorImage
                }),
            });

            if (response.ok) {
                setComment('');
                // Add the new comment to the list
                const newComment = {
                    id: Date.now().toString(),
                    author: user.fullName || user.username || 'Anonymous',
                    content: comment.trim(),
                    authorImage: user.imageUrl || authorImage,
                    createdAt: { toDate: () => new Date() }
                };
                setComments(prev => [newComment, ...prev]);
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
            {/* Like Button */}
            <div className="flex items-center space-x-4 mb-6">
                <button
                    onClick={handleLike}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${isLiked
                        ? 'bg-orange-100 text-orange-600 border border-orange-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    <svg className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>{likes} {likes === 1 ? 'Like' : 'Likes'}</span>
                </button>

                <button
                    onClick={() => setShowComments(!showComments)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-200"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>Comments ({comments.length})</span>
                </button>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="space-y-4">
                    {/* Add Comment Form */}
                    {user && (
                        <form onSubmit={handleCommentSubmit} className="flex space-x-3">
                            <div className="flex-shrink-0">
                                {user.imageUrl ? (
                                    <Image
                                        src={user.imageUrl}
                                        alt="Your profile"
                                        width={32}
                                        height={32}
                                        className="w-8 h-8 rounded-full"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                                        <span className="text-white font-bold text-sm">
                                            {user.fullName?.charAt(0) || user.username?.charAt(0) || 'U'}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Write a comment..."
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                                    rows={3}
                                />
                                <div className="flex justify-end mt-2">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !comment.trim()}
                                        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                    >
                                        {isSubmitting ? 'Posting...' : 'Post Comment'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}

                    {/* Comments List */}
                    <div className="space-y-4">
                        {comments.map((comment) => (
                            <div key={comment.id} className="flex space-x-3">
                                <div className="flex-shrink-0">
                                    {comment.authorImage ? (
                                        <Image
                                            src={comment.authorImage}
                                            alt={`${comment.author}'s profile`}
                                            width={32}
                                            height={32}
                                            className="w-8 h-8 rounded-full"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                                            <span className="text-white font-bold text-sm">
                                                {comment.author.charAt(0)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {comment.author}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {comment.createdAt.toDate().toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            {comment.content}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LikeCommentSection;
