// userFollowUtils.ts

import { db } from '@/lib/firebase';
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';

/**
 * Function to follow a user.
 *
 * @param currentUserId - The ID of the user who is following.
 * @param targetUserId - The ID of the user being followed.
 * @throws Will throw an error if the Firestore update fails.
 */
export const followUser = async (currentUserId: string, targetUserId: string) => {
  // Reference to the current user's document in Firestore
  const currentUserRef = doc(db, 'users', currentUserId);

  try {
    // Update the current user's document to include the target user ID in the following array
    await updateDoc(currentUserRef, {
      following: arrayUnion(targetUserId), // Use arrayUnion to avoid duplicates
    });

    console.log(`User ${currentUserId} is now following ${targetUserId}`);
  } catch (error) {
    console.error('Error following user:', (error as Error).message);
    throw error; // Rethrow the error for handling in the component
  }
};

/**
 * Function to unfollow a user.
 *
 * @param currentUserId - The ID of the user who is unfollowing.
 * @param targetUserId - The ID of the user being unfollowed.
 * @throws Will throw an error if the Firestore update fails.
 */
export const unfollowUser = async (currentUserId: string, targetUserId: string) => {
  // Reference to the current user's document in Firestore
  const currentUserRef = doc(db, 'users', currentUserId);

  try {
    // Update the current user's document to remove the target user ID from the following array
    await updateDoc(currentUserRef, {
      following: arrayRemove(targetUserId), // Remove the target user from the following array
    });

    console.log(`User ${currentUserId} has unfollowed ${targetUserId}`);
  } catch (error) {
    console.error('Error unfollowing user:', (error as Error).message);
    throw error; // Rethrow the error for handling in the component
  }
};

/**
 * Function to check if the current user is following the target user.
 *
 * @param currentUserId - The ID of the user to check.
 * @param targetUserId - The ID of the user being checked.
 * @returns A promise that resolves to a boolean indicating if the user is followed.
 */
export const checkIfFollowing = async (currentUserId: string, targetUserId: string): Promise<boolean> => {
  const currentUserRef = doc(db, 'users', currentUserId);
  const currentUserDoc = await getDoc(currentUserRef);

  if (currentUserDoc.exists()) {
    const data = currentUserDoc.data();
    return data.following?.includes(targetUserId) || false; // Return true if the target user is in the following list
  }

  return false; // Default return value if user document does not exist
};
