import { db } from './firebase';
import { doc, getDoc, setDoc, updateDoc, increment, collection, query, where, getDocs } from 'firebase/firestore';

export interface FollowData {
  followerId: string;
  followingId: string;
  createdAt: Date;
}

/**
 * Follow a user
 */
export async function followUser(followerId: string, followingId: string): Promise<void> {
  if (followerId === followingId) {
    throw new Error('Cannot follow yourself');
  }

  const followRef = doc(db, 'follows', `${followerId}_${followingId}`);
  const followDoc = await getDoc(followRef);

  if (followDoc.exists()) {
    throw new Error('Already following this user');
  }

  // Create follow relationship
  await setDoc(followRef, {
    followerId,
    followingId,
    createdAt: Timestamp.fromDate(new Date()),
  });

  // Update follower's following count (with error handling)
  try {
    const followerRef = doc(db, 'users', followerId);
    const followerDoc = await getDoc(followerRef);
    if (followerDoc.exists()) {
      await updateDoc(followerRef, {
        following: increment(1),
      });
    } else {
      // Create user document if it doesn't exist
      await setDoc(followerRef, {
        following: 1,
        followers: 0,
      });
    }
  } catch (error) {
    console.error('Error updating follower count:', error);
  }

  // Update following user's followers count (with error handling)
  try {
    const followingRef = doc(db, 'users', followingId);
    const followingDoc = await getDoc(followingRef);
    if (followingDoc.exists()) {
      await updateDoc(followingRef, {
        followers: increment(1),
      });
    } else {
      // Create user document if it doesn't exist
      await setDoc(followingRef, {
        following: 0,
        followers: 1,
      });
    }
  } catch (error) {
    console.error('Error updating followers count:', error);
  }
}

/**
 * Unfollow a user
 */
export async function unfollowUser(followerId: string, followingId: string): Promise<void> {
  const followRef = doc(db, 'follows', `${followerId}_${followingId}`);
  const followDoc = await getDoc(followRef);

  if (!followDoc.exists()) {
    throw new Error('Not following this user');
  }

  // Delete follow relationship
  await followRef.delete();

  // Update follower's following count (with error handling)
  try {
    const followerRef = doc(db, 'users', followerId);
    const followerDoc = await getDoc(followerRef);
    if (followerDoc.exists()) {
      const currentFollowing = followerDoc.data().following || 0;
      await updateDoc(followerRef, {
        following: Math.max(0, currentFollowing - 1),
      });
    }
  } catch (error) {
    console.error('Error updating follower count:', error);
  }

  // Update following user's followers count (with error handling)
  try {
    const followingRef = doc(db, 'users', followingId);
    const followingDoc = await getDoc(followingRef);
    if (followingDoc.exists()) {
      const currentFollowers = followingDoc.data().followers || 0;
      await updateDoc(followingRef, {
        followers: Math.max(0, currentFollowers - 1),
      });
    }
  } catch (error) {
    console.error('Error updating followers count:', error);
  }
}

/**
 * Check if user is following another user
 */
export async function isFollowing(followerId: string, followingId: string): Promise<boolean> {
  if (followerId === followingId) return false;

  const followRef = doc(db, 'follows', `${followerId}_${followingId}`);
  const followDoc = await getDoc(followRef);
  return followDoc.exists();
}

/**
 * Get list of users a user is following
 */
export async function getFollowing(userId: string): Promise<string[]> {
  const followsRef = collection(db, 'follows');
  const q = query(followsRef, where('followerId', '==', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data().followingId);
}

/**
 * Get list of users following a user
 */
export async function getFollowers(userId: string): Promise<string[]> {
  const followsRef = collection(db, 'follows');
  const q = query(followsRef, where('followingId', '==', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data().followerId);
}
