'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';

const PostForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const router = useRouter();
  const { user } = useUser();  // Get authenticated user

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.info('Sign in required', {
        description: 'You need to be logged in to create a post.',
      });
      return;
    }

    const newPost = {
      title,
      content,
      author: user?.id,  // Use Clerk user ID as author
      createdAt: new Date(),
    };

    try {
      const docRef = await addDoc(collection(db, 'posts'), newPost);
      console.log("Document written with ID: ", docRef.id);
      router.push('/');
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post Title"
        className="border p-2 rounded"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Post Content"
        className="border p-2 rounded"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Submit Post
      </button>
    </form>
  );
};

export default PostForm;
