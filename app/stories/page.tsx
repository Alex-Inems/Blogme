'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import Image from 'next/image';

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: Timestamp;
  author: string;
  imageUrl?: string;
  readingTime?: number; // Add readingTime property
}

const StoriesPage: React.FC = () => {
  const { user } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchPosts = async () => {
      try {
        const q = query(
          collection(db, 'posts'),
          where('author', '==', user.fullName || user.username)
        );
        const querySnapshot = await getDocs(q);

        const userPosts: Post[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Post, 'id'>),
        })) as Post[];

        // Calculate reading time for each post
        const postsWithReadingTime = userPosts.map(post => ({
          ...post,
          readingTime: Math.ceil(post.content.split(' ').length / 200), // Approximate reading time (200 words/minute)
        }));

        setPosts(postsWithReadingTime);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [user]);

  if (loading) return <div>Loading your stories...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-4 mt-8">Your Stories</h1>

      {posts.length === 0 ? (
        <p className="text-gray-500">You haven&apos;t written any stories yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> {/* Grid layout */}
          {posts.map((post) => (
            <div key={post.id} className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold">{post.title}</h2>

              {post.imageUrl && (
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  width={400}
                  height={200}
                  className="rounded mb-2 object-cover"
                />
              )}

              <p className="text-gray-700 mt-2">{post.content.slice(0, 100)}...</p>
              <p className="text-sm text-gray-500 mt-2">
                Created on {post.createdAt.toDate().toLocaleDateString()} - Estimated reading time: {post.readingTime} minute{post.readingTime !== 1 ? 's' : ''}
              </p>
              <Link href={`/post/${post.id}`} className="text-blue-500 mt-2 inline-block">
                Read more
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StoriesPage;
