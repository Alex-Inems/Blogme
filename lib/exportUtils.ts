'use client';

/**
 * Export posts to JSON format
 */
export function exportPostsToJSON(posts: any[], filename: string = 'posts.json'): void {
    const dataStr = JSON.stringify(posts, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Export posts to CSV format
 */
export function exportPostsToCSV(posts: any[], filename: string = 'posts.csv'): void {
    if (posts.length === 0) {
        return;
    }

    // Extract headers from first post
    const headers = ['Title', 'Content', 'Author', 'Category', 'Tags', 'Created Date', 'Published', 'Reading Time', 'Views', 'Likes'];

    // Convert posts to CSV rows
    const rows = posts.map(post => {
        const content = post.content
            ? post.content.replace(/"/g, '""').replace(/\n/g, ' ').substring(0, 500) // Limit content length
            : '';
        const tags = Array.isArray(post.tags) ? post.tags.join('; ') : '';
        const createdDate = post.createdAt?.toDate ? post.createdAt.toDate().toISOString() : new Date(post.createdAt || Date.now()).toISOString();

        return [
            `"${(post.title || '').replace(/"/g, '""')}"`,
            `"${content}"`,
            `"${(post.author || '').replace(/"/g, '""')}"`,
            `"${(post.category || '').replace(/"/g, '""')}"`,
            `"${tags.replace(/"/g, '""')}"`,
            `"${createdDate}"`,
            `"${post.published !== false ? 'Yes' : 'No'}"`,
            `"${post.readingTime || 0}"`,
            `"${post.views || 0}"`,
            `"${post.likes || 0}"`
        ].join(',');
    });

    // Combine headers and rows
    const csvContent = [headers.join(','), ...rows].join('\n');

    // Create and download file
    const dataBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Export posts to Markdown format
 */
export function exportPostsToMarkdown(posts: any[], filename: string = 'posts.md'): void {
    const markdown = posts.map((post, index) => {
        const createdDate = post.createdAt?.toDate ? post.createdAt.toDate().toISOString() : new Date(post.createdAt || Date.now()).toISOString();
        const tags = Array.isArray(post.tags) ? post.tags.map((t: string) => `#${t}`).join(' ') : '';

        return `# ${post.title || 'Untitled'}

**Author:** ${post.author || 'Unknown'}  
**Category:** ${post.category || 'Uncategorized'}  
**Created:** ${createdDate}  
**Published:** ${post.published !== false ? 'Yes' : 'No'}  
**Reading Time:** ${post.readingTime || 0} minutes  
**Views:** ${post.views || 0} | **Likes:** ${post.likes || 0}  
${tags ? `**Tags:** ${tags}\n` : ''}

---

${post.content || 'No content'}

---

`;
    }).join('\n\n');

    const dataBlob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

