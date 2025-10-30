import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';

export async function POST(request: NextRequest) {
    try {
        const { postId } = await request.json();

        if (!postId) {
            return NextResponse.json({
                success: false,
                error: 'Post ID is required'
            }, { status: 400 });
        }

        // Increment the likes count for the post
        const postRef = doc(db, 'posts', postId);
        await updateDoc(postRef, {
            likes: increment(1)
        });

        return NextResponse.json({
            success: true,
            message: 'Post liked successfully'
        });

    } catch (error) {
        console.error('Error liking post:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to like post'
        }, { status: 500 });
    }
}
