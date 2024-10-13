'use client';

// Import necessary hooks and functions
import { useEffect, useState } from 'react';
import { collection, getDocs, Timestamp, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import Header from '@/components/Header';
import Image from 'next/image';

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  authorProfileImage: string;
  createdAt: Timestamp;
  imageUrl: string;
}

const Home = () => {
  const { user, isSignedIn } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  // Fetch user profile image from Firebase
  useEffect(() => {
    const fetchUserProfileImage = async () => {
      if (user?.id) {
        const userDocRef = doc(db, 'users', user.id); // Fetch the user document from Firestore
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setProfileImageUrl(userData?.profileImageUrl || '/default-profile.png'); // Set profile image
        }
      }
    };

    if (isSignedIn) {
      fetchUserProfileImage();
    }
  }, [isSignedIn, user?.id]);

  // Fetch posts from Firestore
  useEffect(() => {
    const fetchPosts = async () => {
      const postsCollection = collection(db, 'posts');
      const postSnapshot = await getDocs(postsCollection);
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
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 mt-20">
      <Header />
      <h1 className="text-5xl font-bold mb-4 text-center text-orange-950">
        Welcome to Our Blogging Platform!
      </h1>
      <p className="text-xl mb-8 text-center text-gray-700">
        Connect, share your thoughts, and read amazing articles from writers around the globe.
      </p>

      {!isSignedIn ? (
        <Link href="/sign-in" className="bg-blue-500 text-white px-6 py-3 rounded shadow-lg hover:bg-blue-600 transition mb-8">
          Sign In
        </Link>
      ) : (
        <div className="flex items-center mb-8 text-lg">
          <p className="text-center">Hello, {user?.fullName || user?.username || 'User'}!</p>
          {profileImageUrl && (
            <Image
              src={profileImageUrl}
              alt="User profile"
              width={48}
              height={48}
              className="rounded-full ml-4"
            />
          )}
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

      <div className="container mx-auto p-4">
        <h2 className="text-3xl font-bold mb-4">Latest Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredPosts.length > 0 && filteredPosts[0] && (
            <div className="col-span-1 md:col-span-2">
              <Link key={filteredPosts[0].id} href={`/post/${filteredPosts[0].id}`} className="border rounded-lg overflow-hidden shadow-lg transition hover:shadow-xl">
                <Image
                  src={filteredPosts[0].imageUrl || '/default-image.png'}
                  alt={filteredPosts[0].title}
                  width={600}
                  height={192}
                  className="w-full h-48 object-cover"
                  priority // Add this line for LCP
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{filteredPosts[0].title}</h3>
                  <p className="text-gray-600">{filteredPosts[0].content.slice(0, 100)}...</p>
                  <p className="mt-2 text-sm text-gray-500 flex items-center">
                    By {filteredPosts[0].author} on {filteredPosts[0].createdAt.toDate().toLocaleDateString()}
                    {filteredPosts[0].authorProfileImage && (
                      <Image
                        src={filteredPosts[0].authorProfileImage}
                        alt={`${filteredPosts[0].author}'s profile`}
                        width={24}
                        height={24}
                        className="inline-block w-6 h-6 rounded-full ml-2"
                      />
                    )}
                  </p>
                </div>
              </Link>
            </div>
          )}
          {filteredPosts.slice(1).map(post => (
            <div key={post.id} className="border rounded-lg overflow-hidden shadow transition hover:shadow-xl">
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
                  <p className="text-gray-600">{post.content.slice(0, 100)}...</p>
                  <p className="mt-2 text-sm text-gray-500 flex items-center">
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
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Home;
