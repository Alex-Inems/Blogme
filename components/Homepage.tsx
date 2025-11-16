'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { collection, query, orderBy, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { PostListSkeleton } from '@/components/LoadingSkeleton';
import Image from 'next/image';
import Link from 'next/link';
import NewsletterForm from './NewsletterForm';

interface Post {
  id: string;
  title: string;
  slug?: string;
  content: string;
  author: string;
  authorProfileImage?: string;
  createdAt: { toDate: () => Date };
  imageUrl?: string;
  category?: string;
  topic?: string;
  readingTime?: number;
  views?: number;
  likes?: number;
}

const Homepage = () => {
  const { user, isSignedIn } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const postsPerPage = 6;
  const [selectedCategory] = useState<string>('');
  const [selectedTag] = useState<string>('');
  const [sortBy] = useState<'newest' | 'oldest' | 'popular'>('newest');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const postsRef = collection(db, 'posts');
        // Only fetch published posts
        const q = query(postsRef, orderBy('createdAt', 'desc'), limit(100));
        const querySnapshot = await getDocs(q);
        const postsData = (querySnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Post[])
          .filter(post => post.published !== false); // Only show published posts
        setPosts(postsData);
        setFilteredPosts(postsData);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    if (user?.imageUrl) {
      setProfileImageUrl(user.imageUrl);
    }
  }, [user]);

  useEffect(() => {
    let filtered = [...posts];

    // Filter by search term
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // Filter by tag
    if (selectedTag) {
      filtered = filtered.filter(post =>
        post.tags?.some(tag => tag.toLowerCase() === selectedTag.toLowerCase())
      );
    }

    // Sort posts
    filtered.sort((a, b) => {
      if (sortBy === 'newest') {
        return b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime();
      } else if (sortBy === 'oldest') {
        return a.createdAt.toDate().getTime() - b.createdAt.toDate().getTime();
      } else if (sortBy === 'popular') {
        const aLikes = a.likes || 0;
        const bLikes = b.likes || 0;
        return bLikes - aLikes;
      }
      return 0;
    });

    setFilteredPosts(filtered);
    setCurrentPage(1);
  }, [searchTerm, posts, selectedCategory, selectedTag, sortBy]);

  const handleSearch = () => {
    // Search is handled by useEffect
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  // const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-12">
        <div className="w-full px-1">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8 space-y-4">
              <div className="h-12 bg-gray-200 dark:bg-zinc-800 rounded-lg w-3/4 mx-auto animate-pulse"></div>
              <div className="h-6 bg-gray-200 dark:bg-zinc-800 rounded-lg w-1/2 mx-auto animate-pulse"></div>
            </div>
            <PostListSkeleton count={6} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 text-white py-16 lg:py-24">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative w-full px-1">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Share Your Story with the World
            </h1>
            <p className="text-xl sm:text-2xl mb-8 text-orange-100 max-w-3xl mx-auto leading-relaxed">
              Connect, inspire, and discover amazing stories from writers around the globe.
              Your voice matters, and we&apos;re here to amplify it.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="flex bg-white rounded-lg shadow-2xl overflow-hidden">
                <input
                  type="text"
                  placeholder="Search stories, topics, or authors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="flex-1 px-6 py-4 text-gray-800 text-lg focus:outline-none"
                />
                <button
                  onClick={handleSearch}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 font-semibold transition-colors duration-200"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Auth Section */}
            {!isSignedIn ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/sign-in"
                  className="bg-white text-orange-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-orange-50 transition-colors duration-200 shadow-lg"
                >
                  Start Writing
                </Link>
                <Link
                  href="/stories"
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-orange-600 transition-colors duration-200"
                >
                  Explore Stories
                </Link>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-4 mb-6">
                  {profileImageUrl && (
                    <Image
                      src={profileImageUrl}
                      alt="User profile"
                      width={60}
                      height={60}
                      className="rounded-full border-4 border-white shadow-lg"
                    />
                  )}
                  <div className="text-left">
                    <p className="text-2xl font-semibold">Welcome back, {user?.fullName || user?.username || 'Writer'}!</p>
                    <p className="text-orange-100">Ready to share your next story?</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Link
                    href="/profile"
                    className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors duration-200"
                  >
                    My Profile
                  </Link>
                  <Link
                    href="/stories"
                    className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors duration-200"
                  >
                    Write New Story
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white dark:bg-zinc-900">
        <div className="w-full px-1">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-orange-600 mb-2">{filteredPosts.length}</div>
                <div className="text-gray-600 dark:text-zinc-400">Stories Published</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {filteredPosts.reduce((sum, post) => sum + (post.views || 0), 0).toLocaleString()}
                </div>
                <div className="text-gray-600 dark:text-zinc-400">Total Views</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {filteredPosts.reduce((sum, post) => sum + (post.likes || 0), 0).toLocaleString()}
                </div>
                <div className="text-gray-600 dark:text-zinc-400">Likes Received</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {new Set(filteredPosts.map(post => post.author)).size}
                </div>
                <div className="text-gray-600 dark:text-zinc-400">Active Writers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      <section className="py-16 bg-gray-50 dark:bg-zinc-950">
        <div className="w-full px-1">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-zinc-50 mb-4">
                Featured Stories
              </h2>
              <p className="text-xl text-gray-600 dark:text-zinc-400 max-w-2xl mx-auto">
                Discover the most engaging and popular stories from our community
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentPosts.slice(0, 6).map((post, index) => (
                <article key={post.id} className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                  <Link href={`/blog/${post.slug || post.id}`}>
                    <div className="relative">
                      {post.imageUrl ? (
                        <Image
                          src={post.imageUrl}
                          alt={post.title}
                          width={400}
                          height={250}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                          <div className="text-center text-white">
                            <h3 className="text-3xl font-bold mb-2">Blogme</h3>
                            <p className="text-orange-100 text-sm">Your Story Awaits</p>
                          </div>
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          #{index + 1}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center space-x-2 mb-3">
                        {post.authorProfileImage ? (
                          <Image
                            src={post.authorProfileImage}
                            alt={`${post.author}'s profile`}
                            width={32}
                            height={32}
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {post.author.charAt(0)}
                            </span>
                          </div>
                        )}
                        <span className="text-sm text-gray-600 dark:text-zinc-400">{post.author}</span>
                        <span className="text-gray-400 dark:text-zinc-500">•</span>
                        <span className="text-sm text-gray-600 dark:text-zinc-400">
                          {post.createdAt.toDate().toLocaleDateString()}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 dark:text-zinc-50 mb-3 line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-200">
                        {post.title}
                      </h3>

                      <p className="text-gray-600 dark:text-zinc-400 mb-4 line-clamp-3" dangerouslySetInnerHTML={{
                        __html: post.content.replace(/<[^>]*>/g, '').slice(0, 120) + '...'
                      }}></p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-zinc-400">
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {post.views || 0}
                          </span>
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            {post.likes || 0}
                          </span>
                          <span>{post.readingTime || 5} min read</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>

            {/* View All Button */}
            <div className="text-center mt-12">
              <Link
                href="/stories"
                className="inline-flex items-center bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 shadow-lg"
              >
                View All Stories
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-white dark:bg-zinc-900">
        <div className="w-full px-1">
          <div className="max-w-4xl mx-auto">
            <NewsletterForm />
          </div>
        </div>
      </section>

    </div>
  );
};

export default Homepage;