import { redirect } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const { id } = params;

    try {
        // First try to get the post by ID
        const postDoc = await getDoc(doc(db, 'posts', id));

        if (postDoc.exists()) {
            const postData = postDoc.data();
            if (postData.slug) {
                // Redirect to the new slug-based URL
                redirect(`/blog/${postData.slug}`);
            }
        }

        // If no post found or no slug, redirect to home
        redirect('/');
    } catch (error) {
        console.error('Error redirecting post:', error);
        redirect('/');
    }
}
