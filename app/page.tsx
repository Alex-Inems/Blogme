'use client'

// Import necessary hooks and functions
import { useEffect, useState } from 'react'; // React hooks for managing state and side effects
import { collection, getDocs, Timestamp } from 'firebase/firestore'; // Firestore functions for getting documents
import { db } from '@/lib/firebase'; // Firestore instance initialized in our firebase config file
import Link from 'next/link'; // Next.js Link component for client-side navigation
import { useUser } from '@clerk/nextjs'; // Import Clerk's user hook
import Header from '@/components/Header';
import Image from 'next/image'; // Import Next.js Image component

// Define the shape of a Post object with TypeScript interface
interface Post {
  id: string; // The unique ID of the post (Firestore document ID)
  title: string; // The title of the post
  content: string; // The main content/body of the post
  author: string; // The author of the post
  authorProfileImage: string; // URL of the author's profile image
  createdAt: Timestamp; // The timestamp when the post was created
  imageUrl: string; // URL of the image associated with the post
}

const Home = () => {
  const { user, isSignedIn } = useUser(); // Get user and signed-in status
  const [posts, setPosts] = useState<Post[]>([]); // State variable to store posts
  const [searchTerm, setSearchTerm] = useState(''); // State variable for the search term
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]); // State variable to store filtered posts

  // useEffect hook to fetch posts after the component mounts
  useEffect(() => {
    const fetchPosts = async () => {
      const postsCollection = collection(db, 'posts'); // Reference to 'posts' collection
      const postSnapshot = await getDocs(postsCollection); // Get documents in the collection

      // Map over the snapshot docs and convert them to a list of Post objects
      const postList = postSnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      })) as Post[]; // Type assertion to indicate this is an array of Post objects

      setPosts(postList); // Update state with the fetched posts
      setFilteredPosts(postList); // Initialize filteredPosts with all posts
    };

    fetchPosts(); // Call the fetchPosts function
  }, []); // Empty dependency array means this runs once on mount

  // interface PostProps {
  //   filteredPosts: Post[];
  // }

  // Function to handle search
  const handleSearch = () => {
    const filtered = posts.filter(post =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) || // Check if title matches
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) || // Check if content matches
      post.author.toLowerCase().includes(searchTerm.toLowerCase()) // Check if author matches
    );
    setFilteredPosts(filtered); // Update filtered posts based on search
  };

  // Function to handle key press events
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(); // Trigger search when Enter is pressed
    }
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 mt-20">
      <Header />
      <h1 className="text-4xl font-bold mb-4 text-center">
        Welcome to Our Blogging Platform!
      </h1>
      <p className="text-lg mb-8 text-center">
        Connect, share your thoughts, and read amazing articles from writers around the globe.
      </p>

      {!isSignedIn ? (
        <Link href="/sign-in" className="bg-blue-500 text-white px-6 py-3 rounded shadow hover:bg-blue-600 transition">
          Sign In
        </Link>
      ) : (
        <p className="text-lg mb-8 text-center">
          Hello, {user?.fullName}! Thanks for being a part of our community.
        </p>
      )}

      {/* Search Input with Button Beside */}
      <div className="mb-4 flex">
        <input
          type="text"
          placeholder="Search by keyword, title, or author"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term state
          onKeyDown={handleKeyPress} // Add key press event handler
          className="shadow appearance-none border rounded-l w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" // Adjust border for rounded left side
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 transition" // Adjust border for rounded right side
        >
          Search
        </button>
      </div>

      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Latest Posts</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* First Post (takes up 82% width) */}
          {filteredPosts.length > 0 && filteredPosts[0] && (
            <div className="col-span-1 md:col-span-2">
              <Link key={filteredPosts[0].id} href={`/post/${filteredPosts[0].id}`} className="border p-4 rounded hover:bg-gray-100 flex flex-col">
                <Image
                  src={filteredPosts[0].imageUrl}
                  alt={filteredPosts[0].title}
                  width={600}
                  height={192}
                  className="w-full h-48 object-cover rounded mb-2"
                  layout="responsive"
                />
                <h2 className="text-xl font-bold">{filteredPosts[0].title}</h2>
                <p>{filteredPosts[0].content.slice(0, 100)}...</p>
                <p className="mt-2 text-sm text-gray-500">
                  By {filteredPosts[0].author} on {filteredPosts[0].createdAt.toDate().toLocaleDateString()} 
                </p>
              </Link>
            </div>
          )}
          {/* Other Posts */}
          {filteredPosts.slice(1).map(post => (
            <div key={post.id} className="border p-4 rounded hover:bg-gray-100">
              <Link href={`/post/${post.id}`}>
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  width={600}
                  height={192}
                  className="w-full h-48 object-cover rounded mb-2"
                  layout="responsive"
                />
                <h2 className="text-xl font-bold">{post.title}</h2>
                <p>{post.content.slice(0, 100)}...</p>
                <p className="mt-2 text-sm text-gray-500">
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
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Home;
