'use client';

import PageNav from '@/components/PageNav'; // Import the navigation component
import { useEffect, useState } from 'react'; // Import necessary hooks
import { useUser } from '@clerk/nextjs'; // Import Clerk's user hook
import { getDoc, doc, collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore'; // Firestore functions for fetching posts
import { db } from '@/lib/firebase'; // Firestore instance
import CommentsSection from '@/components/Comments'; // Import CommentsSection
import Image from 'next/image'; // Import Image component from Next.js
import Link from 'next/link'; // Import Next.js Link component
import { FiEdit } from 'react-icons/fi'; // Import Edit icon
import { FaFacebookF, FaTwitter, FaWhatsapp } from 'react-icons/fa'; // Import social icons

interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  author: string;
  authorProfileImage?: string;
  createdAt: { toDate: () => Date }; // Firestore timestamp
}

interface PostPageProps {
  params: { id: string }; // Expecting an id parameter
}

const PostPage = ({ params }: PostPageProps) => {
  const { id } = params; // Get post ID from params
  const { user } = useUser(); // Get user information from Clerk
  const [post, setPost] = useState<Post | null>(null); // State for post data
  const [loading, setLoading] = useState(true); // State for loading status
  const [recentPosts, setRecentPosts] = useState<Post[]>([]); // State for recent posts
  const [showModal, setShowModal] = useState(false); // State for modal visibility

  const isAuthor = post?.author === user?.username;

  useEffect(() => {
    const fetchPost = async () => {
      if (id) {
        const postDoc = await getDoc(doc(db, 'posts', id)); // Fetch post document
        if (postDoc.exists()) {
          setPost({ id: postDoc.id, ...postDoc.data() } as Post); // Set post data
        } else {
          console.error('Post not found');
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
        const fetchedPosts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Post[];
        setRecentPosts(fetchedPosts); // Set recent posts
      });

      return () => unsubscribe(); // Clean up listener on unmount
    };

    fetchPost();
    fetchRecentPosts();
  }, [id]);

  const shareOnSocialMedia = (platform: 'facebook' | 'twitter' | 'whatsapp') => {
    const url = encodeURIComponent(window.location.href);
    const message = encodeURIComponent(`Check out this post: ${post?.title}`);

    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${message}&url=${url}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${message} ${url}`;
        break;
      default:
        break;
    }

    window.open(shareUrl, '_blank');
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="w-full p-4 bg-gray-50 min-h-screen">
      <PageNav />

      <div className="max-w-6xl w-full mx-auto mt-32 shadow-md p-6 bg-white rounded-md">
        <h1 className="text-3xl font-bold text-center mb-4">{post?.title}</h1>

        {/* Author Profile Section */}
        <div className="border-t border-b border-gray-300 py-4 flex items-center justify-center space-x-4">
          <div className="relative">
            <Image
              src={isAuthor ? user?.imageUrl || '/path/to/fallback-image.png' : post?.authorProfileImage || '/path/to/fallback-image.png'}
              alt={`${post?.author}'s profile image`}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full"
              onMouseEnter={() => setShowModal(true)} // Show modal on hover
              onMouseLeave={() => setShowModal(false)} // Hide modal when not hovering
            />

            {/* Modal for Author Details */}
            {showModal && post && (
              <div className="absolute z-10 bg-white shadow-md w-52 h-24 flex flex-col items-center justify-center rounded-md mt-2">
                <div className='flex'>
                  <Image
                    src={isAuthor ? user?.imageUrl || '/path/to/fallback-image.png' : post.authorProfileImage || '/path/to/fallback-image.png'}
                    alt={`${post.author}'s profile`}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-full mb-2 object-cover"
                  />
                  <p className="text-sm font-bold text-center">{post.author}</p>
                </div>
                <p className="text-xs text-gray-500 text-center">Author details go here.</p>
              </div>
            )}
          </div>

          <p className="text-sm text-gray-500 text-center">
            By {post?.author} on {post?.createdAt ? new Date(post.createdAt.toDate()).toLocaleDateString() : 'N/A'}
          </p>
        </div>

        {post?.imageUrl && (
          <Image
            src={post.imageUrl}
            alt={post.title}
            width={640}
            height={240}
            className="w-full h-48 object-cover rounded mb-4"
          />
        )}

        <p className="mb-6">{post?.content}</p>

        {/* Comments Section */}
        <CommentsSection postId={post?.id || ''} />

        {isAuthor && (
          <div className="mt-4 flex justify-end items-center">
            <Link href={`/post/edit/${post?.id}`}>
              <div className="flex items-center text-orange-950 hover:text-orange-800 transition duration-300">
                <FiEdit className="mr-1" />
                <span>Edit Post</span>
              </div>
            </Link>
          </div>
        )}

        {/* Social Sharing Section */}
        {user && (
          <div className="mt-6 flex justify-center space-x-4">
            <button onClick={() => shareOnSocialMedia('facebook')} className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
              <FaFacebookF className="mr-2" /> Share on Facebook
            </button>
            <button onClick={() => shareOnSocialMedia('twitter')} className="flex items-center justify-center px-4 py-2 bg-blue-400 text-white rounded-md hover:bg-blue-500 transition">
              <FaTwitter className="mr-2" /> Share on Twitter
            </button>
            <button onClick={() => shareOnSocialMedia('whatsapp')} className="flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition">
              <FaWhatsapp className="mr-2" /> Share on WhatsApp
            </button>
          </div>
        )}

        {/* Recent Posts Section */}
        <h2 className="text-2xl font-bold mt-8 mb-4">Recent Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentPosts.map((recentPost) => (
            <div key={recentPost.id} className="border rounded p-4 bg-white shadow-md">
              {recentPost.imageUrl && (
                <Image
                  src={recentPost.imageUrl}
                  alt={recentPost.title}
                  width={640}
                  height={128}
                  className="w-full h-32 object-cover rounded mb-2"
                />
              )}
              <h3 className="text-xl font-semibold">{recentPost.title}</h3>
              <p className="text-gray-600">{recentPost.content.slice(0, 100)}...</p>
              <p className="mt-2 text-sm text-gray-500">
                By {recentPost.author} on {new Date(recentPost.createdAt.toDate()).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostPage;
