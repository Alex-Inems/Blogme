'use client';

import { useEffect, useState } from 'react'; // Import necessary hooks
import { useUser } from '@clerk/nextjs'; // Import Clerk's user hook
import { collection, addDoc, onSnapshot, query, where } from 'firebase/firestore'; // Firestore functions for fetching posts
import { db } from '@/lib/firebase'; // Firestore instance
import { HiOutlineChatAlt2 } from 'react-icons/hi'; // Import comment icon
import { Transition } from '@headlessui/react'; // Import Transition from Headless UI

interface CommentsSectionProps {
  postId: string; // Define the type for postId
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ postId }) => {
  const { user } = useUser(); // Get user information from Clerk
  const [comments, setComments] = useState<any[]>([]); // State for comments
  const [newComment, setNewComment] = useState(''); // State for the new comment
  const [showSheet, setShowSheet] = useState(false); // State to control the visibility of the sheet
  const [isMobile, setIsMobile] = useState(false); // State to check if on mobile

  // Check screen size to determine if it's mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Adjust breakpoint as needed
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize); // Add event listener for window resize

    return () => window.removeEventListener('resize', handleResize); // Clean up listener on unmount
  }, []);

  // Fetch comments from Firestore on component mount
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'comments'), where('postId', '==', postId)), // Filter comments by postId
      (snapshot) => {
        const fetchedComments = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setComments(fetchedComments); // Set comments state
      }
    );

    return () => unsubscribe(); // Clean up listener on unmount
  }, [postId]); // Re-fetch comments when postId changes

  // Function to handle comment submission
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission

    if (!newComment.trim()) return; // Ignore empty comments

    // Add new comment to Firestore with postId
    await addDoc(collection(db, 'comments'), {
      content: newComment,
      author: user?.fullName || 'Anonymous', // Use user's name or fallback
      createdAt: new Date(),
      postId, // Include postId with comment
    });

    setNewComment(''); // Clear comment input
    setShowSheet(false); // Close sheet after submission
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowSheet(!showSheet)}
        className="flex items-center space-x-2 p-2 text-blue-800 rounded-md"
      >
        <HiOutlineChatAlt2 size={20} />
        <span>Comments</span>
      </button>

      {/* Comment sheet for larger screens */}
      <Transition
        show={showSheet && !isMobile}
        enter="transition-transform duration-300 transform"
        enterFrom="translate-x-full"
        enterTo="translate-x-0"
        leave="transition-transform duration-300 transform"
        leaveFrom="translate-x-0"
        leaveTo="translate-x-full"
      >
        <div className="fixed right-0 top-0 w-1/3 h-full bg-white shadow-lg p-4">
          <h2 className="text-lg font-bold mb-2">Comments</h2>
          <div className="overflow-y-auto h-80 mb-4">
            {comments.map((comment) => (
              <div key={comment.id} className="border-b py-2">
                <p className="font-semibold">{comment.author}</p>
                <p>{comment.content}</p>
              </div>
            ))}
          </div>
          <form onSubmit={handleCommentSubmit} className="flex">
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 border rounded p-2"
            />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">
              Submit
            </button>
          </form>
        </div>
      </Transition>

      {/* Comment section for mobile */}
      {isMobile && showSheet && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4">
          <h2 className="text-lg font-bold mb-2">Comments</h2>
          <div className="overflow-y-auto max-h-40 mb-4">
            {comments.map((comment) => (
              <div key={comment.id} className="border-b py-2">
                <p className="font-semibold">{comment.author}</p>
                <p>{comment.content}</p>
              </div>
            ))}
          </div>
          <form onSubmit={handleCommentSubmit} className="flex">
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 border rounded p-2"
            />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">
              Submit
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CommentsSection;
