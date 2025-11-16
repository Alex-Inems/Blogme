import { MetadataRoute } from 'next';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://blogme.africa';

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/leaderboard`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/stories`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
    ];

    // Dynamic blog posts
    let blogPosts: MetadataRoute.Sitemap = [];

    try {
        // Use a try-catch to handle Firestore query errors gracefully
        const postsRef = collection(db, 'posts');
        // Note: Firestore doesn't support != operator directly, so we'll fetch all and filter
        const q = query(
            postsRef,
            orderBy('createdAt', 'desc'),
            limit(1000) // Limit to most recent 1000 posts
        );
        const querySnapshot = await getDocs(q);

        // Filter published posts
        const publishedPosts = querySnapshot.docs.filter(doc => {
            const data = doc.data();
            return data.published !== false;
        });

        blogPosts = publishedPosts.map(doc => {
            const data = doc.data();
            const slug = data.slug || doc.id;
            const lastModified = data.createdAt?.toDate
                ? data.createdAt.toDate()
                : data.updatedAt?.toDate
                    ? data.updatedAt.toDate()
                    : new Date();

            return {
                url: `${baseUrl}/blog/${slug}`,
                lastModified,
                changeFrequency: 'weekly' as const,
                priority: 0.7,
            };
        });
    } catch (error) {
        console.error('Error fetching posts for sitemap:', error);
    }

    return [...staticPages, ...blogPosts];
}

