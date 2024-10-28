'use client'
// StoreUserProfile.tsx

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import Image from 'next/image';
import { followUser } from '../lib/userFollowUtils'; // Adjust the import path

const StoreUserProfile = () => {
  const { user } = useUser();
  const router = useRouter();
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [introduction, setIntroduction] = useState<string>('');
  const [topics, setTopics] = useState<string[]>([]);
  const [following, setFollowing] = useState<string[]>([]); // State to store following users

  useEffect(() => {
    const checkAndFetchUserProfile = async () => {
      if (!user) return;

      const userRef = doc(db, 'users', user.id);
      const docSnapshot = await getDoc(userRef);
      
      if (!docSnapshot.exists()) {
        // Create user document with default values if it doesn't exist
        const defaultProfile = {
          username: user.username || '',
          email: user.emailAddresses[0]?.emailAddress || '',
          introduction: '',
          topics: [],
          profileImageUrl: null,
          following: [], // Initialize following array
        };
        await setDoc(userRef, defaultProfile);
        console.log('User document created with default values');
      } else {
        // Fetch existing profile details
        const data = docSnapshot.data();
        setIntroduction(data.introduction || '');
        setTopics(data.topics || []);
        setProfileImageUrl(data.profileImageUrl || null);
        setFollowing(data.following || []); // Get the following list
      }
    };

    if (user) {
      setUsername(user.username || '');
      setEmail(user.emailAddresses[0]?.emailAddress || '');
      checkAndFetchUserProfile();
    }
  }, [user]);

  const handleImageUpload = async (file: File): Promise<string> => {
    if (!user) throw new Error('User is not defined');

    const storageRef = ref(storage, `profileImages/${user.id}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    const updates: {
      username?: string;
      email?: string;
      introduction?: string;
      topics?: string[];
      profileImageUrl?: string;
    } = {};

    if (username !== user.username) updates.username = username;
    if (email !== user.emailAddresses[0]?.emailAddress) updates.email = email;
    if (introduction) updates.introduction = introduction;
    if (topics.length) updates.topics = topics;

    if (profileImage) {
      try {
        updates.profileImageUrl = await handleImageUpload(profileImage);
      } catch (error) {
        console.error('Error uploading image:', (error as Error).message);
        return;
      }
    }

    const userRef = doc(db, 'users', user.id);
    
    try {
      const docSnapshot = await getDoc(userRef);
      if (!docSnapshot.exists()) {
        console.error('No document found for user ID:', user.id);
        return; // Exit if the document does not exist
      }

      await updateDoc(userRef, updates);
      console.log('Profile updated successfully');
      router.push('/');
    } catch (error) {
      console.error('Error updating profile:', (error as Error).message);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      setProfileImageUrl(URL.createObjectURL(file));
    }
  };

  const handleFollowUser = async (targetUserId: string) => {
    if (!user) return;

    try {
      await followUser(user.id, targetUserId);
      // Optionally update local state to reflect the new following
      setFollowing((prevFollowing) => [...prevFollowing, targetUserId]);
    } catch (error) {
      console.error('Error following user:', (error as Error).message);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-transparent rounded-lg shadow-md h-full md:max-w-3xl lg:max-w-5xl">
      <h2 className="text-2xl lg:text-4xl font-bold text-center mb-6 text-purple-900">Update Your Profile</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Username Input */}
        <div>
          <label htmlFor="username" className="text-white font-semibold mb-1 block">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="p-3 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-900 transition duration-200 w-full"
          />
        </div>

        {/* Email Input */}
        <div>
          <label htmlFor="email" className="text-white font-semibold mb-1 block">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="p-3 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-900 transition duration-200 w-full"
          />
        </div>

        {/* Profile Image Input */}
        <div className="col-span-1 md:col-span-2">
          <label htmlFor="profileImage" className="text-white font-semibold mb-1 block">Profile Image</label>
          <input
            id="profileImage"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="p-3 text-purple-900 rounded shadow-sm focus:outline-none transition duration-200 w-full"
          />
        </div>

        {/* Profile Image Preview */}
        {profileImageUrl && (
          <div className="flex flex-col items-center col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold mb-2 text-white">Profile Image Preview</h3>
            <Image
              src={profileImageUrl}
              alt="Profile Image Preview"
              width={150}
              height={150}
              className="rounded-full border-2 border-purple-950 mb-4"
            />
          </div>
        )}

        {/* Introduction Textarea */}
        <div className="col-span-1 md:col-span-2">
          <label htmlFor="introduction" className="text-white font-semibold mb-1 block">Introduction</label>
          <textarea
            id="introduction"
            value={introduction}
            onChange={(e) => setIntroduction(e.target.value)}
            placeholder="Tell us about yourself..."
            className="p-3 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-900 transition duration-200 resize-none h-32 w-full"
          />
        </div>

        {/* Topics Input */}
        <div className="col-span-1 md:col-span-2">
          <label htmlFor="topics" className="text-white font-semibold mb-1 block">Topics of Interest</label>
          <input
            id="topics"
            type="text"
            value={topics.join(', ')}
            onChange={(e) => setTopics(e.target.value.split(',').map(topic => topic.trim()))}
            placeholder="Comma-separated list of topics"
            className="p-3 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-900 transition duration-200 w-full"
          />
        </div>

        {/* Update Button */}
        <div className="col-span-1 md:col-span-2">
          <button type="submit" className="w-full bg-purple-900 text-white font-bold py-3 rounded shadow hover:bg-purple-700 transition duration-200">Update Profile</button>
        </div>
      </form>

    </div>
  );
};

export default StoreUserProfile;
