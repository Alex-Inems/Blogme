// app/post/edit/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

const EditPost = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const { user } = useUser();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [postAuthor, setPostAuthor] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const router = useRouter();

  useEffect(() => {
    // Fetch the post data
    const fetchPost = async () => {
      try {
        const postDoc = await getDoc(doc(db, 'posts', id)); // Fetch post document
        if (postDoc.exists()) {
          const postData = postDoc.data();
          setTitle(postData.title);
          setContent(postData.content);
          setPostAuthor(postData.author); // Set the post author (username)
        } else {
          console.error('Post not found');
          router.push('/');
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        router.push('/');
      }
      setLoading(false);
    };

    fetchPost();
  }, [id, router]);

  // Check if the user is the author
  useEffect(() => {
    if (loading) return; // Wait until loading is finished
    if (postAuthor !== user?.username) {
      setShowPopup(true); // Show popup if not the author
      setTimeout(() => {
        router.push(`/post/${id}`); // Redirect to the post page after showing the popup
      }, 3000);
    }
  }, [loading, postAuthor, user, id, router]);

  const handleUpdatePost = async () => {
    try {
      const postRef = doc(db, 'posts', id); // Reference to the post document
      await updateDoc(postRef, { title, content }); // Update the post in Firestore
      router.push(`/post/${id}`); // Redirect back to the post page after update
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center p-4 bg-gray-50 min-h-screen mt-24">
      <h1 className="text-3xl font-bold text-orange-900 mb-4">Edit Post</h1>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post Title"
        className="w-full max-w-md p-4 mb-4 shadow-lg bg-inherit"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Post Content"
        className="w-full max-w-md p-4 mb-4 shadow-lg bg-inherit"
      />
      <button onClick={handleUpdatePost} className="bg-blue-500 text-white p-2 rounded">
        Update Post
      </button>

      {/* Popup Alert */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded shadow-lg">
            <p className="text-lg font-semibold">You are not authorized to edit this post.</p>
            <button
              onClick={() => setShowPopup(false)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditPost;
