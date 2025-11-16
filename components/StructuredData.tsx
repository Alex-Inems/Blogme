'use client';

interface ArticleData {
    title: string;
    description?: string;
    image?: string;
    publishedTime: string;
    modifiedTime?: string;
    author: string;
    authorImage?: string;
    url: string;
    category?: string;
    tags?: string[] | string;
}

interface BreadcrumbItem {
    name: string;
    url: string;
}

interface BreadcrumbData {
    items: BreadcrumbItem[];
}

type StructuredDataType = ArticleData | Record<string, unknown> | BreadcrumbData;

interface StructuredDataProps {
    type: 'Article' | 'Organization' | 'WebSite' | 'BreadcrumbList';
    data: StructuredDataType;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
    const getStructuredData = () => {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://blogme.africa';

        switch (type) {
            case 'Article': {
                const articleData = data as ArticleData;
                return {
                    '@context': 'https://schema.org',
                    '@type': 'Article',
                    headline: articleData.title,
                    description: articleData.description,
                    image: articleData.image || `${baseUrl}/og-image.jpg`,
                    datePublished: articleData.publishedTime,
                    dateModified: articleData.modifiedTime || articleData.publishedTime,
                    author: {
                        '@type': 'Person',
                        name: articleData.author,
                        image: articleData.authorImage,
                    },
                    publisher: {
                        '@type': 'Organization',
                        name: 'Blogme',
                        logo: {
                            '@type': 'ImageObject',
                            url: `${baseUrl}/logo.png`,
                        },
                    },
                    mainEntityOfPage: {
                        '@type': 'WebPage',
                        '@id': articleData.url,
                    },
                    articleSection: articleData.category,
                    keywords: Array.isArray(articleData.tags) ? articleData.tags.join(', ') : articleData.tags,
                };
            }

            case 'Organization':
                return {
                    '@context': 'https://schema.org',
                    '@type': 'Organization',
                    name: 'Blogme',
                    url: baseUrl,
                    logo: `${baseUrl}/logo.png`,
                    description: 'A platform for sharing your stories with the world',
                    sameAs: [
                        'https://twitter.com/blogme',
                        'https://facebook.com/blogme',
                        'https://instagram.com/blogme',
                    ],
                };

            case 'WebSite':
                return {
                    '@context': 'https://schema.org',
                    '@type': 'WebSite',
                    name: 'Blogme',
                    url: baseUrl,
                    description: 'A platform for sharing your stories with the world',
                    potentialAction: {
                        '@type': 'SearchAction',
                        target: {
                            '@type': 'EntryPoint',
                            urlTemplate: `${baseUrl}/?search={search_term_string}`,
                        },
                        'query-input': 'required name=search_term_string',
                    },
                };

            case 'BreadcrumbList':
                return {
                    '@context': 'https://schema.org',
                    '@type': 'BreadcrumbList',
                    itemListElement: (data as BreadcrumbData).items.map((item: BreadcrumbItem, index: number) => ({
                        '@type': 'ListItem',
                        position: index + 1,
                        name: item.name,
                        item: item.url,
                    })),
                };

            default:
                return {};
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(getStructuredData()) }}
        />
    );
}

