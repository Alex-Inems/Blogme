'use client';

import { useState, useEffect } from 'react';
import { collection, addDoc, doc, getDoc, Timestamp } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { HiOutlinePhotograph, HiOutlineVideoCamera, HiPlus } from 'react-icons/hi';
import CreatePostNavbar from '@/components/CreatePostNavbar';
import Image from 'next/image';
import DOMPurify from 'dompurify';

interface PostData {
  title: string;
  content: string;
  author: string;
  createdAt: Timestamp;
  imageUrl: string | null;
  videoUrl: string | null;
  authorProfileImage: string | null;
  readingTime?: number;
}

const CreatePost: React.FC = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfileImage = async () => {
      if (user?.id) {
        try {
          const userDocRef = doc(db, 'users', user.id);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setProfileImageUrl(userData?.profileImageUrl || '/default-profile.png');
          }
        } catch (error) {
          console.error('Error fetching user profile image:', error);
        }
      }
    };

    if (isLoaded && isSignedIn) {
      fetchUserProfileImage();
    }
  }, [isLoaded, isSignedIn, user?.id]);

  const handleFileUpload = async (file: File, folder: string): Promise<string | null> => {
    if (!file) return null;
    return new Promise<string | null>((resolve, reject) => {
      const storageRef = ref(storage, `${folder}/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progressPercent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progressPercent);
        },
        (error) => {
          console.error(`Error uploading ${folder} file:`, error);
          reject(null);
        },
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadUrl);
        }
      );
    });
  };

  const calculateReadingTime = (text: string): number => {
    const wordCount = text.trim().split(/\s+/).length;
    return Math.ceil(wordCount / 250); // Average reading speed of 250 words/min
  };

  const handleSubmit = async (): Promise<void> => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setProgress(0);

    try {
      let imageUrl: string | null = null;
      let videoUrl: string | null = null;

      if (imageFile) {
        imageUrl = await handleFileUpload(imageFile, 'images');
      }

      if (videoFile) {
        videoUrl = await handleFileUpload(videoFile, 'videos');
      }

      const sanitizedContent = DOMPurify.sanitize(content);
      const readingTime = calculateReadingTime(sanitizedContent);

      const postData: PostData = {
        title,
        content: sanitizedContent,
        author: user?.fullName || user?.username || 'Anonymous',
        createdAt: Timestamp.fromDate(new Date()),
        imageUrl,
        videoUrl,
        authorProfileImage: profileImageUrl,
        readingTime,
      };

      await addDoc(collection(db, 'posts'), postData);

      alert('Post created successfully!');
      router.push('/');
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) setImageFile(file);
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      const videoElement = document.createElement('video');
      videoElement.src = URL.createObjectURL(file);

      videoElement.onloadedmetadata = () => {
        const durationInSeconds = videoElement.duration;

        if (durationInSeconds > 1200) {
          alert('Video duration must be less than 20 minutes.');
          return;
        }

        setVideoFile(file);
      };

      videoElement.onerror = () => {
        alert('Error loading video file. Please try another file.');
      };
    }
  };

  if (!isLoaded || !isSignedIn) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dark:bg-gray-950 dark:text-white flex flex-col min-h-screen p-4 bg-gray-50 mt-20">
      <CreatePostNavbar onSubmit={handleSubmit} />
      <h1 className="mt-20 text-4xl font-bold mb-4">Create a New Post</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="w-full max-w-4xl mx-auto p-6"
      >
        <div className="mb-4">
          <input
            placeholder="Title"
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full py-2 px-3 text-gray-700 text-2xl bg-inherit focus:outline-none"
          />
        </div>

        <div className="flex items-start mb-4">
          <label
            htmlFor="image"
            className="mr-2 cursor-pointer text-gray-500 flex items-center justify-center w-10 h-10 rounded-full border border-gray-300"
          >
            <HiOutlinePhotograph size={24} />
          </label>
          <input
            type="file"
            accept="image/*"
            id="image"
            onChange={handleImageChange}
            className="hidden"
          />

          <label
            htmlFor="video"
            className="mr-2 cursor-pointer text-gray-500 flex items-center justify-center w-10 h-10 rounded-full border border-gray-300"
          >
            <HiOutlineVideoCamera size={24} />
          </label>
          <input
            type="file"
            accept="video/*"
            id="video"
            onChange={handleVideoChange}
            className="hidden"
          />

          <textarea
            placeholder="Write Blog"
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="w-full py-2 px-3 text-gray-700 focus:outline-none bg-inherit"
          />
        </div>

        <div className="text-sm text-gray-500 mb-4">
          <p>📸 Supported image formats: JPEG, PNG, etc.</p>
          <p>🎥 Video must be less than 20 minutes in duration.</p>
        </div>

        {progress > 0 && (
          <div className="mt-4 w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-blue-500 h-4 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        {imageFile && (
          <div className="mt-4">
            <Image
              src={URL.createObjectURL(imageFile)}
              alt="Selected Image Preview"
              className="max-w-full h-auto border rounded-md my-2"
              width={100}
              height={100}
            />
          </div>
        )}

        {videoFile && (
          <div className="mt-4">
            <video controls className="w-full max-w-md rounded-md">
              <source src={URL.createObjectURL(videoFile)} type={videoFile.type} />
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`${
              isSubmitting ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-700'
            } text-white font-bold py-2 px-4 rounded focus:outline-none`}
          >
            {isSubmitting ? 'Submitting...' : 'Create Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
