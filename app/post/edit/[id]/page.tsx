'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { getDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Image from 'next/image'; // Import Image from next/image

const EditPost = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const { user } = useUser();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [postAuthor, setPostAuthor] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    // Fetch the post data
    const fetchPost = async () => {
      try {
        const postDoc = await getDoc(doc(db, 'posts', id));
        if (postDoc.exists()) {
          const postData = postDoc.data();
          setTitle(postData.title);
          setContent(postData.content);
          setPostAuthor(postData.author);
          setImageUrl(postData.imageUrl); // Set the post's current image URL
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
    if (loading) return;
    if (postAuthor !== user?.username) {
      setShowPopup(true);
      setTimeout(() => {
        router.push(`/post/${id}`);
      }, 3000);
    }
  }, [loading, postAuthor, user, id, router]);

  const handleUpdatePost = async () => {
    try {
      const postRef = doc(db, 'posts', id);
      let newImageUrl: string | null = imageUrl;

      // If a new image is uploaded, handle the upload
      if (imageFile) {
        const storageRef = ref(storage, `images/${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        newImageUrl = await getDownloadURL(storageRef);
      }

      await updateDoc(postRef, {
        title,
        content,
        imageUrl: newImageUrl, // Update the image URL if a new one is uploaded
      });
      router.push(`/post/${id}`);
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleDeletePost = async () => {
    const postRef = doc(db, 'posts', id);
    try {
      await deleteDoc(postRef);
      router.push('/'); // Redirect to homepage after deletion
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setImageFile(files[0]);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center p-6 bg-gray-50 min-h-screen mt-20">
      <h1 className="text-3xl font-bold text-orange-900 mb-6">Edit Post</h1>
      <div className="w-full max-w-lg">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post Title"
          className="w-full p-4 mb-4 text-lg border rounded shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Post Content"
          className="w-full p-4 mb-4 text-lg border rounded shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={8}
        />
        {imageUrl && (
          <div className="mb-4">
            <Image
              src={imageUrl}
              alt="Current Post Image"
              className="w-full h-auto mb-2 rounded-lg shadow-lg"
              width={500} // Adjust width as needed
              height={300} // Adjust height as needed
              priority // Optional: Add this prop if this image is important for the initial load
            />
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mb-4 border border-gray-300 p-2 rounded shadow-sm cursor-pointer"
        />
        <div className="flex justify-between">
          <button
            onClick={handleUpdatePost}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
          >
            Update Post
          </button>
          <button
            onClick={handleDeletePost}
            className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-200 ml-4"
          >
            Delete Post
          </button>
        </div>
      </div>

      {/* Popup Alert */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded shadow-lg">
            <p className="text-lg font-semibold">You are not authorized to edit this post.</p>
            <button
              onClick={() => setShowPopup(false)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
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
