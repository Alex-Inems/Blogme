'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, Timestamp, doc, getDoc, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import Header from '@/components/Header';
import Image from 'next/image';
import NewsletterForm from './NewsletterForm';

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  authorProfileImage: string;
  createdAt: Timestamp;
  imageUrl: string;
  readingTime?: number;
}

const Home = () => {
  const { user, isSignedIn } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(9);
  const [profileImageUrl, setProfileImageUrl] = useState('/default-profile.png');

  useEffect(() => {
    const fetchUserProfileImage = async () => {
      if (user?.id) {
        const userDocRef = doc(db, 'users', user.id);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setProfileImageUrl(userData?.profileImageUrl || '/default-profile.png');
        }
      }
    };
    if (isSignedIn) fetchUserProfileImage();
  }, [isSignedIn, user?.id]);

  useEffect(() => {
    const fetchPosts = async () => {
      const postsCollection = collection(db, 'posts');
      const postsQuery = query(postsCollection, orderBy('createdAt', 'desc'));
      const postSnapshot = await getDocs(postsQuery);
      const postList = postSnapshot.docs.map(doc => ({
        ...(doc.data() as Omit<Post, 'id'>),
        id: doc.id,
      }));
      setPosts(postList);
      setFilteredPosts(postList);
    };
    fetchPosts();
  }, []);

  const handleSearch = () => {
    const filtered = posts.filter(post =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPosts(filtered);
    setCurrentPage(1);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  return (
    <section className="dark:bg-slate-900 dark:text-white flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 mt-20">
  <Header />
  <h1 className="dark:text-orange-700 mt-20 text-3xl font-bold mb-4 text-center text-orange-950 md:text-5xl">
    Welcome to Our Blogging Platform!
  </h1>
  <p className="dark:text-white text-lg mb-8 text-center text-gray-700 md:text-xl">
    Connect, share your thoughts, and read amazing articles from writers around the globe.
  </p>

  {!isSignedIn ? (
    <Link href="/sign-in" className="bg-blue-500 text-white px-6 py-3 rounded shadow-lg hover:bg-blue-600 transition mb-8">
      Sign In
    </Link>
  ) : (
    <div>
      <div className="flex flex-col items-center mb-4 text-lg md:flex-row">
        <p className="text-center">Hello, {user?.fullName || user?.username || 'User'}!</p>
        {profileImageUrl && (
          <Image
            src={profileImageUrl}
            alt="User profile"
            width={48}
            height={48}
            className="rounded-full mt-2 md:ml-4"
          />
        )}
      </div>
      <div className='mb-5 text-center'>
        <Link href="/profile" className="bg-blue-500 text-white px-6 py-3 rounded shadow-lg hover:bg-blue-600 transition mb-8">
          Profile
        </Link>
      </div>
    </div>
  )}

  <div className="mb-4 flex w-full max-w-md mx-auto">
    <input
      type="text"
      placeholder="Search by keyword, title, or author"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      onKeyDown={handleKeyPress}
      className="shadow border rounded-l w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" 
    />
    <button
      onClick={handleSearch}
      className="bg-blue-500 text-white px-4 py-3 rounded-r hover:bg-blue-600 transition">
      Search
    </button>
  </div>

  <div className="container mx-auto p-4 flex flex-col lg:flex-row">
    {/* Posts Section */}
    <div className="lg:w-3/5 grid grid-cols-1 gap-6 border-r border-gray-300 pr-4">
      {currentPosts.map(post => (
        <div key={post.id} className="border dark:border-gray-600 rounded-lg overflow-hidden shadow transition hover:shadow-xl">
          <Link href={`/post/${post.id}`}>
            <Image
              src={post.imageUrl || '/default-image.png'}
              alt={post.title}
              width={600}
              height={192}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{post.content.slice(0, 100)}...</p>
              <p className="mt-2 text-sm dark:text-gray-400  text-gray-500 flex items-center">
                By {post.author} on {post.createdAt.toDate().toLocaleDateString()}
                {post.authorProfileImage && (
                  <Image
                    src={post.authorProfileImage}
                    alt={`${post.author}'s profile`}
                    width={24}
                    height={24}
                    className="inline-block w-6 h-6 rounded-full ml-2"
                  />
                )}
              </p>
              {post.readingTime && (
                <p className="mt-2 text-sm text-red-700">
                  Estimated reading time: <span className='text-green-600'>{post.readingTime} minute{post.readingTime > 1 ? 's' : ''}</span>
                </p>
              )}
            </div>
          </Link>
        </div>
      ))}
    </div>

    {/* Recommendations Section */}
    <aside className="lg:block hidden lg:w-2/5 lg:pl-8 mt-8 lg:mt-0">
      <div className="sticky top-20">
        <h3 className="dark:text-orange-700 text-2xl font-semibold mb-4">Recommended Posts</h3>
        <ul className="space-y-4">
          {filteredPosts.slice(0, 5).map(post => (
            <li key={post.id} className="border dark:border-gray-600 rounded-lg p-4 shadow transition hover:shadow-lg">
              <Link href={`/post/${post.id}`}>
                <p className="font-bold text-lg">{post.title}</p>
                <p className="text-sm dark:text-gray-400 text-gray-600">{post.content.slice(0, 50)}...</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  </div>

  {/* Pagination Controls */}
  <div className="flex justify-center mt-6">
    <button
      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
      className="bg-blue-500 text-white px-4 py-2 rounded-l hover:bg-blue-600 transition disabled:bg-gray-400"
      aria-label="Go to previous page"
    >
      Previous
    </button>
    <span className="flex items-center px-4 text-gray-700">
      Page {currentPage} of {totalPages}
    </span>
    <button
      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
      disabled={currentPage === totalPages}
      className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 transition disabled:bg-gray-400"
      aria-label="Go to next page"
    >
      Next
    </button>
  </div>

  <NewsletterForm/>
</section>

  );
};

export default Home;
