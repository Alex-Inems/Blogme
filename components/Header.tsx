'use client'

import {useState, useEffect} from 'react';
import Image from 'next/image';

import Link from 'next/link';
import { SignedIn, SignInButton, SignedOut, UserButton } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';

import { navibarLinks} from '@/Commons/constants';
import { cn } from '@/lib/utils';
import MobileNav from './Mobilenav';

const Navbar = () => {
    const pathname = usePathname();
     // State variable to track if the navbar should have a shadow
  const [isScrolled, setIsScrolled] = useState(false);

  // Effect to handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      // Check if the page has been scrolled down
      if (window.scrollY > 0) {
        setIsScrolled(true); // Set shadow if scrolled
      } else {
        setIsScrolled(false); // Remove shadow if at the top
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 flex flexBetween py-2  w-full px-2 lg:px-10 lg:py-4   bg-white transition-shadow duration-300 ${isScrolled ? 'shadow-lg' : ''} z-50`}>
            <Link href="/home" className="flex items-center gap-1">
                {/* <Image
                    src="/images/ilogoo.png"
                    width={82}
                    height={32}
                    alt="yoom logo"
                    className="max-sm:size-10"
                /> */}
                <p className="text-[26px] font-extrabold text-orange-950 ">
                    Blog<span className='text-orange-950'>Me</span>
                </p>
                
            </Link>
            <div className="flex flexCenter gap-6 max-sm:hidden max-lg:flex">
        {navibarLinks.map((item) => {
          const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);
          
          return (
            <Link
              href={item.route}
              key={item.label}
              className={cn(
                'flex gap-4 items-center p-4 rounded-lg ',
                {
                  'bg-blue-1': isActive,
                }
              )}
            >
              <Image
                src={item.imgURL}
                alt={item.label}
                width={24}
                height={24}
              />
              <p className="text-lg font-semibold max-lg:hidden">
                {item.label}
              </p>
            </Link>
          );
        })}
      </div>
            <div className=" sihh flex flexBetween gap-5">
            <SignedOut>
    <SignInButton mode="modal">
        <button className="bg-orange-950 hover:bg-orange-800 text-white font-bold py-2 px-8 rounded-full shadow-md transition duration-300 ease-in-out whitespace-nowrap">
            Sign In
        </button>
    </SignInButton>
</SignedOut>



                <SignedIn>
                    <UserButton />
                </SignedIn>

                <MobileNav />
            </div>
        </nav>
    );
};

export default Navbar;
