'use client';

import PageNav from '@/components/PageNav';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { getDoc, doc, collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import CommentsSection from '@/components/Comments';
import Image from 'next/image';
import Link from 'next/link';
import { FiEdit } from 'react-icons/fi';
import { FaFacebookF, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import FollowButton from '@/components/FollowButton';

interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  author: string;
  authorProfileImage?: string;
  createdAt: { toDate: () => Date };
}

interface PostPageProps {
  params: { id: string };
}

const PostPage = ({ params }: PostPageProps) => {
  const { id } = params;
  const { user } = useUser();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [showModal, setShowModal] = useState(false);

  const isAuthor = post?.author === user?.username;

  useEffect(() => {
    const fetchPost = async () => {
      if (id) {
        const postDoc = await getDoc(doc(db, 'posts', id));
        if (postDoc.exists()) {
          setPost({ id: postDoc.id, ...postDoc.data() } as Post);
        } else {
          console.error('Post not found');
        }
      }
      setLoading(false);
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
        setRecentPosts(fetchedPosts);
      });

      return () => unsubscribe();
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
    <div className="w-full p-4 dark:bg-slate-950 bg-gray-50 min-h-screen">
      <PageNav />

      <div className="max-w-6xl w-full mx-auto mt-32 shadow-md p-6 dark:bg-slate-950 dark:text-white bg-white rounded-md">
        <h1 className="text-3xl font-bold text-center mb-4">{post?.title}</h1>

        <div className="border-t border-b border-gray-300 py-4 flex items-center justify-center space-x-4">
          <div className="relative">
            <Image
              src={isAuthor ? user?.imageUrl || '/path/to/fallback-image.png' : post?.authorProfileImage || '/path/to/fallback-image.png'}
              alt={`${post?.author}'s profile image`}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full"
              onMouseEnter={() => setShowModal(true)}
              onMouseLeave={() => setShowModal(false)}
            />

            {showModal && post && (
              <div
                className="absolute z-10  bg-white shadow-md w-64 h-auto flex flex-col items-center justify-center rounded-md mt-2 p-2"
                onMouseEnter={() => setShowModal(true)}
                onMouseLeave={() => setShowModal(false)}
              >
                <div className='flex'>
                  <Image
                    src={isAuthor ? user?.imageUrl || '/path/to/fallback-image.png' : post.authorProfileImage || '/path/to/fallback-image.png'}
                    alt={`${post.author}'s profile`}
                    width={34}
                    height={34}
                    className="w-8 h-8 rounded-full mb-2 object-cover"
                  />
                  <p className="text-sm font-bold text-center">{post.author}</p>
                </div>
                <p className="text-xs text-gray-500 text-center">Author details go here.</p>
                {!isAuthor && user && post?.author && (
                  <FollowButton 
                    authorId={post.author} 
                    currentUser={user}  
                  />
                )}
              </div>
            )}
          </div>

          <p className="text-sm text-gray-500 text-center">
            By {post?.author} on {post?.createdAt ? new Date(post.createdAt.toDate()).toLocaleDateString() : 'N/A'}
          </p>
          
          {!isAuthor && user && post?.author && (
            <FollowButton authorId={post.author} currentUser={user} />
          )}
          
        </div>

        {post?.imageUrl && (
          <Image
            src={post.imageUrl}
            alt={post.title}
            width={640}
            height={240}
            className="w-full h-auto object-contain rounded mb-4"
          />
        )}

        <p className="mb-6">{post?.content}</p>

        <CommentsSection postId={post?.id || ''} />

        {isAuthor && (
          <div className="mt-4 flex justify-end items-center">
            <Link href={`/post/edit/${post?.id}`} className="flex items-center text-orange-950 hover:text-orange-800 transition duration-300">
              <FiEdit className="mr-1" />
              <span>Edit Post</span>
            </Link>
          </div>
        )}

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

        <h2 className="text-2xl font-bold mt-8 mb-4">Recent Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentPosts.map((recentPost) => (
            <div key={recentPost.id} className="border dark:border-gray-700 rounded p-4 dark:bg-gray-700  bg-white shadow-md">
              {recentPost.imageUrl && (
                <Image
                  src={recentPost.imageUrl}
                  alt={recentPost.title}
                  width={640}
                  height={240}
                  className="w-full h-auto object-cover rounded mb-2"
                />
              )}
              <h3 className="text-lg font-semibold">{recentPost.title}</h3>
              <p className="text-sm dark:text-gray-400 text-gray-600">{recentPost.content.substring(0, 100)}...</p>
              <Link href={`/post/${recentPost.id}`} className="text-blue-500 hover:underline mt-2 inline-block">
                Read more
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostPage;
