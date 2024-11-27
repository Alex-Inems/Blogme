'use client';
import { SignedIn, SignedOut, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import MobileNav from './Mobilenav';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Image from 'next/image';

interface CreatePostNavbarProps {
  onSubmit: () => void; // Define a prop for the submit function
}

const CreatePostNavbar = ({ onSubmit }: CreatePostNavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const { user } = useUser(); // Clerk's user object

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0); // Set shadow based on scroll position
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (user) {
        try {
          const userRef = doc(db, 'users', user.id);
          const docSnapshot = await getDoc(userRef);
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            console.log('Profile data:', data); // Debugging: log the fetched data
            setProfileImageUrl(data.profileImageUrl || null);
          } else {
            console.log('No document found for user:', user.id); // Debugging
          }
        } catch (error) {
          console.error('Error fetching profile image:', error); // Debugging
        } finally {
          setIsLoading(false); // End loading state
        }
      }
    };

    fetchProfileImage();
  }, [user]);

  return (
    <nav
      className={`dark:bg-gray-950 fixed top-0 left-0 right-0 flex justify-between items-center w-full px-6 lg:px-10 lg:py-4 bg-white transition-shadow duration-300 ${isScrolled ? 'shadow-lg' : ''} z-50`}
    >
      <Link href="/" className="flex items-center gap-1">
        <p className="text-[26px] font-extrabold text-orange-950 dark:text-white">
          Me<span className="text-orange-950 dark:text-orange-700">Blog</span>
        </p>
      </Link>

      <div className="flex items-center gap-5">
        <SignedIn>
          {isLoading ? (
            <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse"></div> // Loading placeholder
          ) : profileImageUrl ? (
            <Image
              src={profileImageUrl}
              alt="Profile Image"
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300"></div> // Placeholder if no image
          )}
        </SignedIn>

        <SignedOut>
          <Link href="/sign-in">
            <button className="bg-orange-950 hover:bg-orange-800 text-white font-bold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out">
              Sign In
            </button>
          </Link>
        </SignedOut>

        <button
          onClick={onSubmit} // Call the submit function when clicked
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out max-sm:hidden"
        >
          Submit Post
        </button>
        <MobileNav />
      </div>
    </nav>
  );
};

export default CreatePostNavbar;
