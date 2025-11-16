'use client';

import { useEffect, useState, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { PostListSkeleton } from '@/components/LoadingSkeleton';
import { exportPostsToJSON, exportPostsToCSV, exportPostsToMarkdown } from '@/lib/exportUtils';
import { toast } from 'sonner';
import { FiDownload, FiFileText, FiFile, FiCode, FiEdit3, FiTrash2, FiEye, FiCalendar, FiClock, FiTag, FiMoreVertical, FiCheckCircle, FiFileMinus, FiSearch, FiFilter } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';
import { deleteDoc, doc } from 'firebase/firestore';

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: Timestamp;
  author: string;
  imageUrl?: string;
  readingTime?: number;
  slug?: string;
  category?: string;
  tags?: string[];
  published?: boolean;
  isDraft?: boolean;
  views?: number;
  likes?: number;
  scheduledAt?: Timestamp | null;
}

const StoriesPage: React.FC = () => {
  const { user, isLoaded } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'scheduled'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest');
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    // Wait for Clerk to finish loading
    if (!isLoaded) return;

    // If user is not signed in, stop loading and show message
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchPosts = async () => {
      try {
        setLoading(true);
        const q = query(
          collection(db, 'posts'),
          where('author', '==', user.fullName || user.username || '')
        );
        const querySnapshot = await getDocs(q);

        const userPosts: Post[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Post, 'id'>),
        })) as Post[];

        // Calculate reading time for each post
        const postsWithReadingTime = userPosts.map(post => {
          const textContent = post.content.replace(/<[^>]*>/g, ''); // Remove HTML tags
          return {
            ...post,
            readingTime: Math.ceil(textContent.split(' ').length / 200), // Approximate reading time (200 words/minute)
          };
        });

        setPosts(postsWithReadingTime);
      } catch (error) {
        console.error('Error fetching posts:', error);
        toast.error('Failed to load posts', {
          description: 'Please try refreshing the page.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [user, isLoaded]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectedPost) {
        const target = event.target as HTMLElement;
        const dropdownElement = dropdownRefs.current[selectedPost];
        const button = target.closest('button[aria-label="More options"]');

        // Close if clicking outside both the dropdown and the button
        if (dropdownElement && !dropdownElement.contains(target) && !button) {
          setSelectedPost(null);
        }
      }
    };

    if (selectedPost) {
      // Use a small delay to avoid immediate closure
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 0);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedPost]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-12">
        <div className="w-full px-1">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <div className="h-10 bg-gray-200 dark:bg-zinc-800 rounded-lg w-1/3 mb-4 animate-pulse"></div>
            </div>
            <PostListSkeleton count={6} />
          </div>
        </div>
      </div>
    );
  }

  // Show sign-in prompt if user is not authenticated
  if (!loading && !user) {
    return (
      <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
        {/* Wallpaper Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1920&q=80&auto=format&fit=crop)' } as React.CSSProperties}
        >
          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70 dark:from-black/80 dark:via-black/70 dark:to-black/80"></div>

          {/* Decorative elements */}
          <div className="absolute top-20 left-20 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl"></div>
        </div>

        {/* Content Card */}
        <div className="relative z-10 max-w-lg mx-auto p-8 md:p-12">
          <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 md:p-12 text-center border border-white/20 dark:border-zinc-700/50">
            {/* Icon */}
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-zinc-50">
              Welcome Back!
            </h1>

            {/* Description */}
            <p className="text-lg text-gray-600 dark:text-zinc-300 mb-8 leading-relaxed">
              Sign in to access your stories and continue your writing journey. Your stories are waiting for you.
            </p>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="flex flex-col items-center p-4 rounded-lg bg-orange-50/50 dark:bg-orange-900/20">
                <svg className="w-6 h-6 text-orange-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">Your Stories</span>
              </div>
              <div className="flex flex-col items-center p-4 rounded-lg bg-orange-50/50 dark:bg-orange-900/20">
                <svg className="w-6 h-6 text-orange-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">Edit & Create</span>
              </div>
              <div className="flex flex-col items-center p-4 rounded-lg bg-orange-50/50 dark:bg-orange-900/20">
                <svg className="w-6 h-6 text-orange-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">Track Progress</span>
              </div>
            </div>

            {/* Sign In Button */}
            <Link
              href="/sign-in"
              className="inline-flex items-center justify-center w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <span>Sign In to Continue</span>
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>

            {/* Additional Info */}
            <p className="text-sm text-gray-500 dark:text-zinc-400 mt-6">
              Don&apos;t have an account?{' '}
              <Link href="/sign-in" className="text-orange-500 dark:text-orange-400 hover:underline font-medium">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    try {
      const postRef = doc(db, 'posts', postId);
      await deleteDoc(postRef);
      setPosts(posts.filter(post => post.id !== postId));
      toast.success('Post deleted', {
        description: 'Your post has been permanently deleted.',
      });
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Error deleting post', {
        description: 'Please try again. If the problem persists, contact support.',
      });
    }
  };

  const handleExport = (format: 'json' | 'csv' | 'markdown') => {
    if (posts.length === 0) {
      toast.info('No posts to export', {
        description: 'You need to have at least one post to export.',
      });
      return;
    }

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `my-posts-${timestamp}`;

    try {
      switch (format) {
        case 'json':
          exportPostsToJSON(posts, `${filename}.json`);
          toast.success('Posts exported!', {
            description: 'Your posts have been exported as JSON.',
          });
          break;
        case 'csv':
          exportPostsToCSV(posts, `${filename}.csv`);
          toast.success('Posts exported!', {
            description: 'Your posts have been exported as CSV.',
          });
          break;
        case 'markdown':
          exportPostsToMarkdown(posts, `${filename}.md`);
          toast.success('Posts exported!', {
            description: 'Your posts have been exported as Markdown.',
          });
          break;
      }
    } catch (error) {
      console.error('Error exporting posts:', error);
      toast.error('Export failed', {
        description: 'There was an error exporting your posts. Please try again.',
      });
    }
  };

  // Filter and sort posts
  const filteredAndSortedPosts = posts
    .filter(post => {
      // Search filter
      if (searchTerm.trim()) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
          post.title.toLowerCase().includes(searchLower) ||
          post.content.replace(/<[^>]*>/g, '').toLowerCase().includes(searchLower) ||
          post.category?.toLowerCase().includes(searchLower) ||
          post.tags?.some(tag => tag.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filter === 'published') return post.published !== false && !post.isDraft;
      if (filter === 'draft') return post.isDraft === true;
      if (filter === 'scheduled') return post.scheduledAt && post.scheduledAt.toDate() > new Date();
      return true; // 'all'
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime();
      } else if (sortBy === 'oldest') {
        return a.createdAt.toDate().getTime() - b.createdAt.toDate().getTime();
      } else if (sortBy === 'popular') {
        const aScore = (a.views || 0) + (a.likes || 0) * 2;
        const bScore = (b.views || 0) + (b.likes || 0) * 2;
        return bScore - aScore;
      }
      return 0;
    });

  const publishedCount = posts.filter(p => p.published !== false && !p.isDraft).length;
  const draftCount = posts.filter(p => p.isDraft === true).length;
  const scheduledCount = posts.filter(p => p.scheduledAt && p.scheduledAt.toDate() > new Date()).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-zinc-50 mb-2">
                Your Stories
              </h1>
              <p className="text-gray-600 dark:text-zinc-400">
                Manage and organize all your published posts and drafts
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <FiEdit3 className="w-5 h-5" />
                Create New Story
              </Link>
              {posts.length > 0 && (
                <div className="relative group">
                  <button className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 hover:border-orange-500 dark:hover:border-orange-500 text-gray-700 dark:text-zinc-300 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg">
                    <FiDownload className="w-5 h-5" />
                    Export
                  </button>
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-gray-200 dark:border-zinc-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <button
                      onClick={() => handleExport('json')}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-zinc-800 flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-zinc-300 rounded-t-xl transition-colors"
                    >
                      <FiCode className="w-4 h-4 text-orange-500" />
                      Export as JSON
                    </button>
                    <button
                      onClick={() => handleExport('csv')}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-zinc-800 flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-zinc-300 transition-colors"
                    >
                      <FiFile className="w-4 h-4 text-orange-500" />
                      Export as CSV
                    </button>
                    <button
                      onClick={() => handleExport('markdown')}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-zinc-800 flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-zinc-300 rounded-b-xl transition-colors"
                    >
                      <FiFileText className="w-4 h-4 text-orange-500" />
                      Export as Markdown
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          {posts.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-md border border-gray-200 dark:border-zinc-800">
                <div className="text-2xl font-bold text-gray-900 dark:text-zinc-50">{posts.length}</div>
                <div className="text-sm text-gray-600 dark:text-zinc-400">Total Posts</div>
              </div>
              <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-md border border-gray-200 dark:border-zinc-800">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{publishedCount}</div>
                <div className="text-sm text-gray-600 dark:text-zinc-400">Published</div>
              </div>
              <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-md border border-gray-200 dark:border-zinc-800">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{draftCount}</div>
                <div className="text-sm text-gray-600 dark:text-zinc-400">Drafts</div>
              </div>
              <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-md border border-gray-200 dark:border-zinc-800">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{scheduledCount}</div>
                <div className="text-sm text-gray-600 dark:text-zinc-400">Scheduled</div>
              </div>
            </div>
          )}

          {/* Search and Filters */}
          {posts.length > 0 && (
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-md border border-gray-200 dark:border-zinc-800 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search your stories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-50"
                  />
                </div>

                {/* Filter */}
                <div className="flex items-center gap-2">
                  <FiFilter className="text-gray-400 w-5 h-5" />
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as typeof filter)}
                    className="px-4 py-2 border-2 border-gray-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-50"
                  >
                    <option value="all">All Posts</option>
                    <option value="published">Published</option>
                    <option value="draft">Drafts</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="px-4 py-2 border-2 border-gray-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-50"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiEdit3 className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-50 mb-3">
                No Stories Yet
              </h2>
              <p className="text-gray-600 dark:text-zinc-400 mb-8">
                Start your writing journey by creating your first story. Share your thoughts, experiences, and ideas with the world.
              </p>
              <Link
                href="/create"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <FiEdit3 className="w-5 h-5" />
                Create Your First Story
              </Link>
            </div>
          </div>
        ) : filteredAndSortedPosts.length === 0 ? (
          <div className="text-center py-16">
            <FiSearch className="w-16 h-16 text-gray-300 dark:text-zinc-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-zinc-50 mb-2">No posts found</h3>
            <p className="text-gray-600 dark:text-zinc-400">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
            {filteredAndSortedPosts.map((post) => {
              const isScheduled = post.scheduledAt && post.scheduledAt.toDate() > new Date();
              const scheduledDate = isScheduled ? post.scheduledAt!.toDate() : null;
              const textContent = post.content.replace(/<[^>]*>/g, '');
              const excerpt = textContent.substring(0, 150);

              return (
                <div
                  key={post.id}
                  className="group bg-white dark:bg-zinc-900 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-visible border border-gray-200 dark:border-zinc-800 hover:border-orange-500 dark:hover:border-orange-500"
                >
                  {/* Image */}
                  {post.imageUrl ? (
                    <Link href={post.slug ? `/blog/${post.slug}` : `/post/${post.id}`}>
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={post.imageUrl}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        {/* Status Badge */}
                        <div className="absolute top-3 right-3">
                          {post.isDraft ? (
                            <span className="px-3 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                              <FiFileMinus className="w-3 h-3" />
                              Draft
                            </span>
                          ) : isScheduled ? (
                            <span className="px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                              <FiCalendar className="w-3 h-3" />
                              Scheduled
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                              <FiCheckCircle className="w-3 h-3" />
                              Published
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div className="relative h-48 bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                      <div className="text-center text-white">
                        <FiEdit3 className="w-12 h-12 mx-auto mb-2 opacity-80" />
                        <p className="text-sm font-medium opacity-80">No Image</p>
                      </div>
                      {/* Status Badge */}
                      <div className="absolute top-3 right-3">
                        {post.isDraft ? (
                          <span className="px-3 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                            <FiFileMinus className="w-3 h-3" />
                            Draft
                          </span>
                        ) : isScheduled ? (
                          <span className="px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                            <FiCalendar className="w-3 h-3" />
                            Scheduled
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                            <FiCheckCircle className="w-3 h-3" />
                            Published
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-5">
                    {/* Category and Tags */}
                    {(post.category || post.tags) && (
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        {post.category && (
                          <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs font-medium rounded-md">
                            {post.category}
                          </span>
                        )}
                        {post.tags && post.tags.slice(0, 2).map((tag, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 text-xs font-medium rounded-md flex items-center gap-1">
                            <FiTag className="w-3 h-3" />
                            {tag}
                          </span>
                        ))}
                        {post.tags && post.tags.length > 2 && (
                          <span className="text-xs text-gray-500 dark:text-zinc-500">
                            +{post.tags.length - 2} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Title */}
                    <Link href={post.slug ? `/blog/${post.slug}` : `/post/${post.id}`}>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-zinc-50 mb-2 line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                        {post.title}
                      </h2>
                    </Link>

                    {/* Excerpt */}
                    <p className="text-gray-600 dark:text-zinc-400 text-sm mb-4 line-clamp-3">
                      {excerpt}...
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-zinc-500 mb-4">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <FiClock className="w-3 h-3" />
                          {post.readingTime || 1} min read
                        </span>
                        {post.views !== undefined && (
                          <span className="flex items-center gap-1">
                            <FiEye className="w-3 h-3" />
                            {post.views} views
                          </span>
                        )}
                      </div>
                      <span className="flex items-center gap-1">
                        <FiCalendar className="w-3 h-3" />
                        {post.createdAt.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>

                    {/* Scheduled Date */}
                    {isScheduled && scheduledDate && (
                      <div className="mb-4 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <p className="text-xs text-blue-700 dark:text-blue-300 flex items-center gap-1">
                          <FiCalendar className="w-3 h-3" />
                          Scheduled for: {scheduledDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-zinc-800 relative">
                      <div className="flex items-center gap-2">
                        <Link
                          href={post.slug ? `/blog/${post.slug}` : `/post/${post.id}`}
                          className="px-3 py-1.5 text-sm font-medium text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <FiEye className="w-4 h-4" />
                          View
                        </Link>
                        <Link
                          href={`/post/edit/${post.id}`}
                          className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <FiEdit3 className="w-4 h-4" />
                          Edit
                        </Link>
                      </div>
                      <div className="relative z-10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPost(selectedPost === post.id ? null : post.id);
                          }}
                          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                          aria-label="More options"
                          type="button"
                        >
                          <FiMoreVertical className="w-5 h-5" />
                        </button>
                        {selectedPost === post.id && (
                          <div
                            ref={(el) => {
                              dropdownRefs.current[post.id] = el;
                            }}
                            className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-zinc-900 rounded-lg shadow-2xl border border-gray-200 dark:border-zinc-800 z-[9999]"
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              minWidth: '10rem',
                              display: 'block',
                              visibility: 'visible',
                              opacity: 1
                            } as React.CSSProperties}
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowDeleteConfirm(post.id);
                                setSelectedPost(null);
                              }}
                              className="w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 rounded-lg transition-colors first:rounded-t-lg last:rounded-b-lg"
                              type="button"
                            >
                              <FiTrash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-zinc-50 mb-2">Delete Post?</h3>
            <p className="text-gray-600 dark:text-zinc-400 mb-6">
              Are you sure you want to delete this post? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeletePost(showDeleteConfirm)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoriesPage;
