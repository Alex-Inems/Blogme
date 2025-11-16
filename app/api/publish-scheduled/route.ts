import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, updateDoc, doc, Timestamp } from 'firebase/firestore';

/**
 * This API route should be called periodically (e.g., via cron job)
 * to publish scheduled posts. In production, set up a cron job to call
 * this endpoint every minute or use a service like Vercel Cron.
 */
export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');
        const cronSecret = process.env.CRON_SECRET;

        // Optional: Add authentication for cron job
        if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const now = Timestamp.fromDate(new Date());
        const postsRef = collection(db, 'posts');

        // Find posts that are scheduled and should be published now
        const q = query(
            postsRef,
            where('isDraft', '==', true),
            where('scheduledAt', '<=', now)
        );

        const querySnapshot = await getDocs(q);
        const updates: Promise<void>[] = [];

        querySnapshot.forEach((docSnapshot) => {
            const postData = docSnapshot.data();
            if (postData.scheduledAt && postData.scheduledAt.toDate() <= new Date()) {
                const postRef = doc(db, 'posts', docSnapshot.id);
                updates.push(
                    updateDoc(postRef, {
                        published: true,
                        isDraft: false,
                        scheduledAt: null,
                    })
                );
            }
        });

        await Promise.all(updates);

        return NextResponse.json({
            success: true,
            published: updates.length,
            message: `Published ${updates.length} scheduled post(s)`,
        });
    } catch (error) {
        console.error('Error publishing scheduled posts:', error);
        return NextResponse.json(
            { error: 'Failed to publish scheduled posts' },
            { status: 500 }
        );
    }
}

