// FollowButton.tsx

import { useEffect, useState } from 'react';
import { followUser, unfollowUser, checkIfFollowing } from '../lib/userFollowUtils'; // Adjust the import path

interface FollowButtonProps {
  authorId: string;
  currentUser: { id: string } | null; // Define your currentUser type appropriately
}

const FollowButton: React.FC<FollowButtonProps> = ({ authorId, currentUser }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFollowingStatus = async () => {
      if (currentUser) {
        const followingStatus = await checkIfFollowing(currentUser.id, authorId);
        setIsFollowing(followingStatus);
      }
    };

    fetchFollowingStatus();
  }, [currentUser, authorId]);

  const handleFollow = async () => {
    if (currentUser) {
      setIsFollowing(true); // Optimistically update the UI
      setLoading(true);
      try {
        await followUser(currentUser.id, authorId);
      } catch (error) {
        console.error("Error following user:", error);
        setIsFollowing(false); // Rollback on error
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUnfollow = async () => {
    if (currentUser) {
      setIsFollowing(false); // Optimistically update the UI
      setLoading(true);
      try {
        await unfollowUser(currentUser.id, authorId);
      } catch (error) {
        console.error("Error unfollowing user:", error);
        setIsFollowing(true); // Rollback on error
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <button  className='text-green-600' onClick={isFollowing ? handleUnfollow : handleFollow} disabled={loading}>
      {loading ? 'Loading...' : isFollowing ? 'Following' : 'Follow'}
    </button>
  );
};

export default FollowButton;
