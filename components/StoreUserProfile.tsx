'use client'
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import Image from 'next/image';
import { followUser } from '../lib/userFollowUtils';

const StoreUserProfile = () => {
  const { user } = useUser();
  const router = useRouter();
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [introduction, setIntroduction] = useState<string>('');
  const [topics, setTopics] = useState<string[]>([]);
  const [following, setFollowing] = useState<string[]>([]);

  useEffect(() => {
    const checkAndFetchUserProfile = async () => {
      if (!user) return;

      const userRef = doc(db, 'users', user.id);
      const docSnapshot = await getDoc(userRef);
      
      if (!docSnapshot.exists()) {
        const defaultProfile = {
          username: user.username || '',
          email: user.emailAddresses[0]?.emailAddress || '',
          introduction: '',
          topics: [],
          profileImageUrl: null,
          following: [],
        };
        await setDoc(userRef, defaultProfile);
      } else {
        const data = docSnapshot.data();
        setIntroduction(data.introduction || '');
        setTopics(data.topics || []);
        setProfileImageUrl(data.profileImageUrl || null);
        setFollowing(data.following || []);
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
        return;
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
      setFollowing((prevFollowing) => [...prevFollowing, targetUserId]);
    } catch (error) {
      console.error('Error following user:', (error as Error).message);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-transparent rounded-lg shadow-md h-full md:max-w-3xl lg:max-w-5xl">
      <h2 className="text-2xl lg:text-4xl font-bold text-center mb-6 text-purple-900">Update Your Profile</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Form elements here */}
      </form>
      <button
        onClick={() => handleFollowUser('targetUserId')}
        className="mt-6 w-full bg-blue-500 text-white font-bold py-3 rounded shadow hover:bg-blue-400 transition duration-200"
      >
        Follow User
      </button>
    </div>
  );
};

export default StoreUserProfile;
