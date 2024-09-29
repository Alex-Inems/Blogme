// components/CreatePostNavbar.tsx
'use client';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import MobileNav from './Mobilenav';

interface CreatePostNavbarProps {
    onSubmit: () => void; // Define a prop for the submit function
}

const CreatePostNavbar = ({ onSubmit }: CreatePostNavbarProps) => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0); // Set shadow based on scroll position
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 flex justify-between items-center w-full px-6 lg:px-10 lg:py-4 bg-white transition-shadow duration-300 ${isScrolled ? 'shadow-lg' : ''} z-50`}>
            <Link href="/" className="flex items-center gap-1">
                <p className="text-[26px] font-extrabold text-orange-950 ">
                    Blog<span className='text-orange-950'>Me</span>
                </p>
            </Link>

            <div className="flex items-center gap-5">
                <SignedIn>
                    <UserButton />
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
                <MobileNav/>
            </div>
        </nav>
    );
};

export default CreatePostNavbar;
