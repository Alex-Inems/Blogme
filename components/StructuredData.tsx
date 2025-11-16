'use client';

interface StructuredDataProps {
    type: 'Article' | 'Organization' | 'WebSite' | 'BreadcrumbList';
    data: any;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
    const getStructuredData = () => {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://blogme.africa';

        switch (type) {
            case 'Article':
                return {
                    '@context': 'https://schema.org',
                    '@type': 'Article',
                    headline: data.title,
                    description: data.description,
                    image: data.image || `${baseUrl}/og-image.jpg`,
                    datePublished: data.publishedTime,
                    dateModified: data.modifiedTime || data.publishedTime,
                    author: {
                        '@type': 'Person',
                        name: data.author,
                        image: data.authorImage,
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
                        '@id': data.url,
                    },
                    articleSection: data.category,
                    keywords: Array.isArray(data.tags) ? data.tags.join(', ') : data.tags,
                };

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
                    itemListElement: data.items.map((item: any, index: number) => ({
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

