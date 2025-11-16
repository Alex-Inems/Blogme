'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SignedIn, SignInButton, SignedOut, useUser } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import { NAV_LINKS, COMPANY_INFO } from '@/Commons/constants';
import { cn } from '@/lib/utils';
import { FiUser, FiMenu, FiX } from 'react-icons/fi';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Image from 'next/image';
import DarkModeToggle from './DarkModeToggle';
import NotificationsDropdown from './NotificationsDropdown';

const Navbar = () => {
    const pathname = usePathname();
    const { user } = useUser();
    const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
                try {
                    const userRef = doc(db, 'users', user.id);
                    const docSnapshot = await getDoc(userRef);
                    if (docSnapshot.exists()) {
                        const data = docSnapshot.data();
                        setProfileImageUrl(data.profileImageUrl || null);
                    }
                } catch (error) {
                    console.error('Error fetching profile image:', error);
                }
            }
        };

        fetchProfileImage();
    }, [user]);

    const isActive = (path: string) => {
        if (path === '/') {
            return pathname === '/';
        }
        return pathname.startsWith(path);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md shadow-lg'
                : 'bg-white dark:bg-zinc-900'
                }`}>
                <div className="w-full px-1">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">B</span>
                            </div>
                            <span className="text-2xl font-bold text-gray-900 dark:text-zinc-50">
                                {COMPANY_INFO.name}
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            {/* Context-aware navigation links */}
                            {pathname === '/create' ? (
                                // Create page: Show simplified navigation
                                <>
                                    <Link
                                        href="/"
                                        className={cn(
                                            'px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200',
                                            'text-gray-700 dark:text-zinc-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-gray-50 dark:hover:bg-zinc-800'
                                        )}
                                    >
                                        Home
                                    </Link>
                                    <Link
                                        href="/stories"
                                        className={cn(
                                            'px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200',
                                            'text-gray-700 dark:text-zinc-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-gray-50 dark:hover:bg-zinc-800'
                                        )}
                                    >
                                        My Stories
                                    </Link>
                                </>
                            ) : (
                                // All other pages: Show full navigation
                                <>
                                    {NAV_LINKS.map((link) => (
                                        <Link
                                            key={link.path}
                                            href={link.path}
                                            className={cn(
                                                'px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200',
                                                isActive(link.path)
                                                    ? 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30'
                                                    : 'text-gray-700 dark:text-zinc-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-gray-50 dark:hover:bg-zinc-800'
                                            )}
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                    <Link
                                        href="/leaderboard"
                                        className={cn(
                                            'px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200',
                                            isActive('/leaderboard')
                                                ? 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30'
                                                : 'text-gray-700 dark:text-zinc-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-gray-50 dark:hover:bg-zinc-800'
                                        )}
                                    >
                                        Leaderboard
                                    </Link>
                                    {user && (
                                        <Link
                                            href="/create"
                                            className={cn(
                                                'px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200',
                                                isActive('/create')
                                                    ? 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30'
                                                    : 'text-gray-700 dark:text-zinc-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-gray-50 dark:hover:bg-zinc-800'
                                            )}
                                        >
                                            Create Post
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Right side actions */}
                        <div className="flex items-center space-x-4">
                            {/* Dark Mode Toggle */}
                            <DarkModeToggle />

                            {/* User Actions */}
                            <div className="flex items-center space-x-3">
                                <SignedOut>
                                    <SignInButton mode="modal">
                                        <button className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium text-orange-600 hover:text-orange-700 focus:outline-none transition-colors duration-200">
                                            Sign In
                                        </button>
                                    </SignInButton>
                                </SignedOut>

                                <SignedIn>
                                    <div className="flex items-center space-x-3">
                                        {/* Notifications */}
                                        <NotificationsDropdown />

                                        {/* Profile Image */}
                                        {profileImageUrl ? (
                                            <Link href="/profile" className="flex-shrink-0">
                                                <Image
                                                    src={profileImageUrl}
                                                    alt="Profile"
                                                    width={32}
                                                    height={32}
                                                    className="w-8 h-8 rounded-full object-cover border-2 border-orange-200 hover:border-orange-300 transition-colors duration-200"
                                                />
                                            </Link>
                                        ) : (
                                            <Link href="/profile" className="flex-shrink-0">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center border-2 border-orange-200 hover:border-orange-300 transition-colors duration-200">
                                                    <span className="text-white font-bold text-xs">
                                                        {user?.fullName?.charAt(0) || user?.username?.charAt(0) || 'U'}
                                                    </span>
                                                </div>
                                            </Link>
                                        )}

                                        {/* Desktop Profile Link */}
                                        <Link
                                            href="/profile"
                                            className="hidden sm:inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-zinc-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors duration-200"
                                        >
                                            Profile
                                        </Link>
                                    </div>
                                </SignedIn>

                                {/* Mobile Menu Button */}
                                <button
                                    onClick={toggleMobileMenu}
                                    className="md:hidden p-2 rounded-md text-gray-700 dark:text-zinc-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors duration-200"
                                    aria-label="Toggle mobile menu"
                                >
                                    {isMobileMenuOpen ? (
                                        <FiX className="w-6 h-6" />
                                    ) : (
                                        <FiMenu className="w-6 h-6" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            {pathname === '/create' ? (
                                <>
                                    <Link
                                        href="/"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-zinc-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors duration-200"
                                    >
                                        Home
                                    </Link>
                                    <Link
                                        href="/stories"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-zinc-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors duration-200"
                                    >
                                        My Stories
                                    </Link>
                                </>
                            ) : (
                                <>
                                    {NAV_LINKS.map((link) => (
                                        <Link
                                            key={link.path}
                                            href={link.path}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={cn(
                                                'block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200',
                                                isActive(link.path)
                                                    ? 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30'
                                                    : 'text-gray-700 dark:text-zinc-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-gray-50 dark:hover:bg-zinc-800'
                                            )}
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                    <Link
                                        href="/leaderboard"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={cn(
                                            'block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200',
                                            isActive('/leaderboard')
                                                ? 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30'
                                                : 'text-gray-700 dark:text-zinc-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-gray-50 dark:hover:bg-zinc-800'
                                        )}
                                    >
                                        Leaderboard
                                    </Link>
                                    {user && (
                                        <Link
                                            href="/create"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={cn(
                                                'block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200',
                                                isActive('/create')
                                                    ? 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30'
                                                    : 'text-gray-700 dark:text-zinc-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-gray-50 dark:hover:bg-zinc-800'
                                            )}
                                        >
                                            Create Post
                                        </Link>
                                    )}
                                </>
                            )}

                            <SignedOut>
                                <div className="pt-4 border-t border-gray-200 dark:border-zinc-800">
                                    <SignInButton mode="modal">
                                        <button
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="w-full text-left px-3 py-2 text-base font-medium text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors duration-200"
                                        >
                                            Sign In
                                        </button>
                                    </SignInButton>
                                </div>
                            </SignedOut>

                            <SignedIn>
                                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <Link
                                        href="/profile"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-zinc-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors duration-200"
                                    >
                                        <FiUser className="w-5 h-5 mr-3" />
                                        Profile
                                    </Link>
                                </div>
                            </SignedIn>
                        </div>
                    </div>
                )}
            </nav>

            {/* Spacer to prevent content from hiding behind fixed navbar */}
            <div className="h-16"></div>
        </>
    );
};

export default Navbar;
