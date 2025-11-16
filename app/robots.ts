import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://blogme.africa';

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/admin/', '/profile/', '/create/'],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}

