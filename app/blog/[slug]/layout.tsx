import { Metadata } from 'next';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const { slug } = params;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://blogme.africa';

    try {
        const postsCollection = collection(db, 'posts');
        const q = query(postsCollection, where('slug', '==', slug));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            const post = doc.data();

            const title = post.title || 'Untitled Post';
            const description = post.content
                ? post.content.replace(/<[^>]*>/g, '').substring(0, 160)
                : 'Read this post on Blogme';
            const imageUrl = post.imageUrl || `${baseUrl}/og-image.jpg`;
            const author = post.author || 'Anonymous';
            const publishedTime = post.createdAt?.toDate
                ? post.createdAt.toDate().toISOString()
                : new Date().toISOString();
            const modifiedTime = post.updatedAt?.toDate
                ? post.updatedAt.toDate().toISOString()
                : publishedTime;
            const url = `${baseUrl}/blog/${slug}`;
            const category = post.category || 'General';
            const tags = Array.isArray(post.tags) ? post.tags : [];

            return {
                title: `${title} | Blogme`,
                description,
                keywords: [category, ...tags].join(', '),
                authors: [{ name: author }],
                openGraph: {
                    title,
                    description,
                    url,
                    siteName: 'Blogme',
                    images: [
                        {
                            url: imageUrl,
                            width: 1200,
                            height: 630,
                            alt: title,
                        },
                    ],
                    locale: 'en_US',
                    type: 'article',
                    publishedTime,
                    modifiedTime,
                    authors: [author],
                    section: category,
                    tags: tags,
                },
                twitter: {
                    card: 'summary_large_image',
                    title,
                    description,
                    images: [imageUrl],
                    creator: `@${author.replace(/\s+/g, '')}`,
                },
                alternates: {
                    canonical: url,
                },
                other: {
                    'article:author': author,
                    'article:published_time': publishedTime,
                    'article:modified_time': modifiedTime,
                    'article:section': category,
                },
            };
        }
    } catch (error) {
        console.error('Error generating metadata:', error);
    }

    return {
        title: 'Post Not Found | Blogme',
        description: 'The post you are looking for does not exist.',
    };
}

export default function BlogPostLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}

