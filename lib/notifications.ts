import { db } from './firebase';
import { collection, addDoc, query, where, getDocs, orderBy, limit, Timestamp, updateDoc, doc } from 'firebase/firestore';

export interface Notification {
    id: string;
    userId: string;
    type: 'like' | 'comment' | 'follow' | 'mention';
    message: string;
    relatedUserId?: string;
    relatedPostId?: string;
    read: boolean;
    createdAt: Date;
}

/**
 * Create a notification
 */
export async function createNotification(
    userId: string,
    type: Notification['type'],
    message: string,
    relatedUserId?: string,
    relatedPostId?: string
): Promise<void> {
    await addDoc(collection(db, 'notifications'), {
        userId,
        type,
        message,
        relatedUserId,
        relatedPostId,
        read: false,
        createdAt: Timestamp.fromDate(new Date()),
    });
}

/**
 * Get notifications for a user
 */
export async function getNotifications(userId: string, limitCount: number = 50): Promise<Notification[]> {
    const notificationsRef = collection(db, 'notifications');
    const q = query(
        notificationsRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        userId: doc.data().userId,
        type: doc.data().type,
        message: doc.data().message,
        relatedUserId: doc.data().relatedUserId,
        relatedPostId: doc.data().relatedPostId,
        read: doc.data().read,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
    }));
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(notificationId: string): Promise<void> {
    const notificationRef = doc(db, 'notifications', notificationId);
    await updateDoc(notificationRef, { read: true });
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllNotificationsAsRead(userId: string): Promise<void> {
    const notificationsRef = collection(db, 'notifications');
    const q = query(notificationsRef, where('userId', '==', userId), where('read', '==', false));
    const querySnapshot = await getDocs(q);

    const updatePromises = querySnapshot.docs.map(doc =>
        updateDoc(doc.ref, { read: true })
    );

    await Promise.all(updatePromises);
}

/**
 * Get unread notification count
 */
export async function getUnreadNotificationCount(userId: string): Promise<number> {
    const notificationsRef = collection(db, 'notifications');
    const q = query(
        notificationsRef,
        where('userId', '==', userId),
        where('read', '==', false)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
}

