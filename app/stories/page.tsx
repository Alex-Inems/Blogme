'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import { Timestamp } from 'firebase/firestore';
import Image from 'next/image'; // Import the Image component from Next.js
import PageNav from '@/components/PageNav';

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: Timestamp;
  author: string; // Ensure to include the author field
  imageUrl?: string; // Optional field for the post image
}

const StoriesPage: React.FC = () => {
  const { user } = useUser(); // Clerk's user hook to get the current user
  const [posts, setPosts] = useState<Post[]>([]); // State for storing posts
  const [loading, setLoading] = useState(true); // State for loading status

  useEffect(() => {
    if (!user) return; // Ensure the user is logged in

    const fetchPosts = async () => {
      try {
        // Query Firestore for posts where the author matches the user's full name or username
        const q = query(
          collection(db, 'posts'),
          where('author', '==', user.fullName || user.username) // Adjust this based on your user object
        );
        const querySnapshot = await getDocs(q);

        const userPosts: Post[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Post[];

        setPosts(userPosts); // Set fetched posts in state
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchPosts(); // Fetch posts for the logged-in user
  }, [user]);

  if (loading) return <div>Loading your stories...</div>; // Display loading state

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <PageNav/>
      <h1 className="text-2xl font-bold mb-4 mt-24">Your Stories</h1>

      {posts.length === 0 ? (
        <p className="text-gray-500">You haven&apos;t written any stories yet.</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold">{post.title}</h2>

              {post.imageUrl && (
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  width={400} // Adjust width as needed
                  height={100} // Adjust height as needed
                  className="rounded mb-2 object-cover" // Use object-cover to maintain aspect ratio
                />
              )}

              <p className="text-gray-700 mt-2">{post.content.slice(0, 100)}...</p>
              <p className="text-sm text-gray-500 mt-2">
                Created on {post.createdAt.toDate().toLocaleDateString()}
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
