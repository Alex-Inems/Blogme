'use client';

import PageNav from '@/components/PageNav';
import { useEffect, useState } from 'react'; // Import necessary hooks
import { useUser } from '@clerk/nextjs'; // Import Clerk's user hook
import { getDoc, doc, collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore'; // Firestore functions for fetching posts
import { db } from '@/lib/firebase'; // Firestore instance
import CommentsSection from '@/components/Comments'; // Import CommentsSection
import { useRouter } from 'next/navigation'; // Import useRouter from next/navigation

const PostPage = ({ params }: { params: { id: string } }) => {
  const { id } = params; // Get post ID from params
  const { user } = useUser(); // Get user information from Clerk
  const [post, setPost] = useState<any>(null); // State for post data
  const [loading, setLoading] = useState(true); // State for loading status
  const [recentPosts, setRecentPosts] = useState<any[]>([]); // State for recent posts
  const [showModal, setShowModal] = useState(false); // State for modal visibility

  // Check if the current user is the author of the post
  const isAuthor = post?.author === user?.username;

  useEffect(() => {
    // Function to fetch post data from Firestore
    const fetchPost = async () => {
      if (id) {
        const postDoc = await getDoc(doc(db, 'posts', id)); // Fetch post document
        if (postDoc.exists()) {
          // If post exists, set the post data in state
          setPost({ id: postDoc.id, ...postDoc.data() });
        } else {
          console.error('Post not found'); // Handle case where document does not exist
        }
      }
      setLoading(false); // Set loading to false after fetching
    };

    const fetchRecentPosts = async () => {
      const q = query(
        collection(db, 'posts'),
        orderBy('createdAt', 'desc'),
        limit(5)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedPosts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setRecentPosts(fetchedPosts); // Set recent posts state
      });

      return () => unsubscribe(); // Clean up listener on unmount
    };

    fetchPost(); // Call fetchPost function
    fetchRecentPosts(); // Call fetchRecentPosts function
  }, [id]); // Run effect when ID changes

  if (loading) return <div>Loading...</div>; // Display loading state

  return (
    <div className="flex flex-col items-center p-4 bg-gray-50 min-h-screen">
      <PageNav postId={post.id} />

      <div className="max-w-2xl w-full mt-32 shadow-md">
        <h1 className="text-3xl font-bold text-center">{post.title}</h1>

        {/* Author Profile Section */}
        <div className="border-t border-b border-gray-300 p-4 flex items-center justify-center space-x-4">
          {/* Author Profile Image */}
          <div className="relative">
            <img
              src={isAuthor ? user?.imageUrl : post.authorProfileImage} // Use Clerk's imageUrl if the current user is the author
              alt={`${post.author}'s profile image`}
              className="w-10 h-10 rounded-full cursor-pointer"
              onMouseEnter={() => setShowModal(true)} // Show modal on hover
              onMouseLeave={() => setShowModal(false)} // Hide modal when not hovering
            />

            {/* Modal for Author Details */}
            {showModal && (
             
            <div className="absolute z-10 bg-white shadow-md w-52 h-24 flex flex-col items-center justify-center rounded-md mt-2">
               <div className='flex'>
                <img
                  src={isAuthor ? user?.imageUrl : post.authorProfileImage}
                  alt={`${post.author}'s profile`}
                  className="w-8 h-8 rounded-full mb-2 object-cover"
                />
                <p className="text-sm font-bold text-center">{post.author}</p>
                </div>
                <p className="text-xs text-gray-500 text-center">Author details go here.</p>
                {/* You can add more details about the author here */}
              </div>
            )}
          </div>

          {/* Author Name and Date */}
          <p className="text-sm text-gray-500 text-center">
            By {post.author} on {new Date(post.createdAt.toDate()).toLocaleDateString()}
          </p>
        </div>

        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-48 object-cover rounded mb-2"
          />
        )}

        <p className="">{post.content}</p>

        <CommentsSection postId={post.id} />

        {/* Recent Posts Section */}
        <h2 className="text-2xl font-bold mt-8 mb-4">Recent Posts</h2>
        <div className="grid grid-cols-1 gap-4">
          {recentPosts.map((recentPost) => (
            <div key={recentPost.id} className="border rounded p-4 bg-white shadow-md">
              {recentPost.imageUrl && (
                <img
                  src={recentPost.imageUrl}
                  alt={recentPost.title}
                  className="w-full h-32 object-cover rounded mb-2"
                />
              )}
              <h3 className="text-xl font-semibold">{recentPost.title}</h3>
              <p className="text-gray-600">{recentPost.content.slice(0, 100)}...</p>
              <p className="mt-2 text-sm text-gray-500">
                By {recentPost.author} on {new Date(recentPost.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostPage;
