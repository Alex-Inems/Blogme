'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { followUser, unfollowUser, isFollowing } from '@/lib/userFollowUtils';
import { createNotification } from '@/lib/notifications';
import { toast } from 'sonner';
import { FiUserPlus, FiUserCheck } from 'react-icons/fi';

interface FollowButtonProps {
  userId: string;
  userName: string;
  className?: string;
}

const FollowButton = ({ userId, userName, className = '' }: FollowButtonProps) => {
  const { user } = useUser();
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!user || !userId || user.id === userId) {
        setChecking(false);
        return;
      }

      try {
        const status = await isFollowing(user.id, userId);
        setFollowing(status);
      } catch (error) {
        console.error('Error checking follow status:', error);
      } finally {
        setChecking(false);
      }
    };

    checkFollowStatus();
  }, [user, userId]);

  const handleFollow = async () => {
    if (!user) {
      toast.info('Sign in required', {
        description: 'Please sign in to follow users.',
      });
      return;
    }

    if (user.id === userId) {
      return;
    }

    setLoading(true);
    try {
      if (following) {
        await unfollowUser(user.id, userId);
        setFollowing(false);
        toast.success('Unfollowed', {
          description: `You've unfollowed ${userName}.`,
        });
      } else {
        await followUser(user.id, userId);
        setFollowing(true);

        // Create notification
        try {
          await createNotification(
            userId,
            'follow',
            `${user.fullName || user.username} started following you`,
            user.id
          );
        } catch (notifError) {
          console.error('Error creating notification:', notifError);
        }

        toast.success('Following', {
          description: `You're now following ${userName}.`,
        });
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update follow status.';
      toast.error('Error', {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.id === userId || checking) {
    return null;
  }

  return (
    <button
      onClick={handleFollow}
      disabled={loading}
      className={`${className} ${following
        ? 'bg-gray-200 dark:bg-zinc-800 hover:bg-gray-300 dark:hover:bg-zinc-700 text-gray-900 dark:text-zinc-50'
        : 'bg-orange-500 hover:bg-orange-600 text-white'
        } px-4 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {following ? (
        <>
          <FiUserCheck className="w-4 h-4" />
          Following
        </>
      ) : (
        <>
          <FiUserPlus className="w-4 h-4" />
          Follow
        </>
      )}
    </button>
  );
};

export default FollowButton;
