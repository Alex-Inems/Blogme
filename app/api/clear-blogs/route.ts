import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

export async function DELETE(request: NextRequest) {
    try {
        console.log('Starting to clear all blogs...');

        // Get all posts from the database
        const postsCollection = collection(db, 'posts');
        const postsSnapshot = await getDocs(postsCollection);

        console.log(`Found ${postsSnapshot.docs.length} posts to delete`);

        // Delete each post
        const deletePromises = postsSnapshot.docs.map(async (postDoc) => {
            try {
                await deleteDoc(doc(db, 'posts', postDoc.id));
                console.log(`Deleted post: ${postDoc.data().title}`);
                return { success: true, id: postDoc.id };
            } catch (error) {
                console.error(`Error deleting post ${postDoc.id}:`, error);
                return { success: false, id: postDoc.id, error: error };
            }
        });

        const results = await Promise.all(deletePromises);
        const successful = results.filter(r => r.success).length;
        const failed = results.filter(r => !r.success).length;

        console.log(`Successfully deleted ${successful} posts, ${failed} failed`);

        return NextResponse.json({
            success: true,
            message: `Successfully deleted ${successful} posts from the database`,
            deleted: successful,
            failed: failed
        });

    } catch (error) {
        console.error('Error clearing blogs:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to clear blogs'
        }, { status: 500 });
    }
}
