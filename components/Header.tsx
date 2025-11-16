'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SignedIn, SignInButton, SignedOut, useUser } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import { navibarLinks } from '@/Commons/constants';
import { cn } from '@/lib/utils';
import MobileNav from './Mobilenav';  // Imported MobileNav component
import { FiHome, FiEdit3, FiBookOpen } from 'react-icons/fi';  // Removed FiMenu import
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Image from 'next/image';
import DarkModeToggle from './DarkModeToggle';

const Navbar = () => {
    const pathname = usePathname();
    const { user } = useUser();
    const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        const fetchProfileImage = async () => {
            if (user) {
                const userRef = doc(db, 'users', user.id);
                const docSnapshot = await getDoc(userRef);
                if (docSnapshot.exists()) {
                    const data = docSnapshot.data();
                    setProfileImageUrl(data.profileImageUrl || null);
                }
            }
        };

        fetchProfileImage();
    }, [user]);

    return (
        <nav className={`fixed top-0 left-0 right-0 dark:bg-zinc-900 dark:text-zinc-50 flex flexBetween py-2 w-full px-2 lg:px-10 lg:py-4 bg-white transition-shadow duration-300 ${isScrolled ? 'shadow-lg' : ''} z-50`}>
            <Link href="/home" className="flex items-center gap-1">
                <p className="text-[26px] font-extrabold dark:text-zinc-50 text-orange-950">
                    Blog<span className='dark:text-orange-400 text-orange-950'>Me</span>
                </p>
            </Link>
            <div className="flex flexCenter gap-6 max-sm:hidden max-lg:flex">
                {navibarLinks.map((item, index) => {
                    const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);
                    const icons = [
                        <FiHome key="home" size={24} />,
                        <FiEdit3 key="blog" size={24} />,
                        <FiBookOpen key="stories" size={24} />,
                    ];

                    if ((item.label === 'Blog' || item.label === 'Stories') && !user) {
                        return null;
                    }

                    return (
                        <Link
                            href={item.route}
                            key={item.label}
                            className={cn('flex gap-4 items-center p-4 rounded-lg', { 'bg-blue-1': isActive })}
                        >
                            {icons[index]}
                            <p className="text-lg font-semibold max-lg:hidden">{item.label}</p>
                        </Link>
                    );
                })}
            </div>
            <DarkModeToggle />
            <div className="flex flexBetween gap-5">
                <SignedOut>

                    <SignInButton mode="modal">
                        <button className="hidden lg:block bg-orange-950 hover:bg-orange-800 text-white font-bold py-2 px-8 rounded-full shadow-md transition duration-300 ease-in-out whitespace-nowrap">
                            Sign In
                        </button>
                    </SignInButton>

                </SignedOut>

                <SignedIn>
                    {profileImageUrl ? (
                        <Image
                            src={profileImageUrl}
                            alt="Profile Image"
                            width={40}
                            height={40}
                            className="rounded-full"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                                {user?.fullName?.charAt(0) || user?.username?.charAt(0) || 'U'}
                            </span>
                        </div>
                    )}
                    <Link
                        href="/profile"
                        className="hidden md:block lg:block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out"
                    >
                        Profile
                    </Link>
                </SignedIn>

                {/* Use MobileNav here */}
                <div className="lg:hidden">
                    <MobileNav />  {/* Replaced hamburger icon with MobileNav component */}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
