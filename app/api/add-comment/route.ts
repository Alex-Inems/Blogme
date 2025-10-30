import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export async function POST(request: NextRequest) {
    try {
        const { postId, author, content, authorImage } = await request.json();

        if (!postId || !author || !content) {
            return NextResponse.json({
                success: false,
                error: 'Post ID, author, and content are required'
            }, { status: 400 });
        }

        // Add comment to the comments collection
        const commentData = {
            postId,
            author,
            content,
            authorImage: authorImage || null,
            createdAt: Timestamp.now(),
            likes: 0
        };

        const docRef = await addDoc(collection(db, 'comments'), commentData);

        return NextResponse.json({
            success: true,
            message: 'Comment added successfully',
            commentId: docRef.id
        });

    } catch (error) {
        console.error('Error adding comment:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to add comment'
        }, { status: 500 });
    }
}
