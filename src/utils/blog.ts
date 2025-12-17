// Blog utility functions

/**
 * Calculate estimated reading time for a blog post
 * @param content - The raw markdown/HTML content
 * @returns Reading time in minutes
 */
export function calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const readingTime = Math.ceil(words / wordsPerMinute);
    return readingTime;
}

/**
 * Extract headings from markdown content for Table of Contents
 * @param content - The markdown content
 * @returns Array of headings with text, level, and id
 */
export function extractHeadings(content: string) {
    const headingRegex = /^(#{2,3})\s+(.+)$/gm;
    const headings: { level: number; text: string; id: string }[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
        const level = match[1].length;
        const text = match[2];
        const id = text
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-');

        headings.push({ level, text, id });
    }

    return headings;
}

/**
 * Generate excerpt from content if not provided
 * @param content - The full content
 * @param maxLength - Maximum length of excerpt
 * @returns Excerpt string
 */
export function generateExcerpt(content: string, maxLength: number = 160): string {
    // Remove markdown formatting
    const plainText = content
        .replace(/^#{1,6}\s+/gm, '') // Remove headings
        .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
        .replace(/\*(.+?)\*/g, '$1') // Remove italic
        .replace(/\[(.+?)\]\(.+?\)/g, '$1') // Remove links
        .replace(/`(.+?)`/g, '$1') // Remove code
        .replace(/\n+/g, ' ') // Replace newlines with space
        .trim();

    if (plainText.length <= maxLength) {
        return plainText;
    }

    // Cut at word boundary
    const trimmed = plainText.substring(0, maxLength);
    const lastSpace = trimmed.lastIndexOf(' ');
    return trimmed.substring(0, lastSpace) + '...';
}

/**
 * Find related posts based on shared tags
 * @param currentPost - The current post object
 * @param allPosts - Array of all posts
 * @param maxResults - Maximum number of related posts to return
 * @returns Array of related posts
 */
export function findRelatedPosts(
    currentPost: any,
    allPosts: any[],
    maxResults: number = 3
): any[] {
    if (!currentPost.data.tags || currentPost.data.tags.length === 0) {
        // If no tags, return random recent posts
        return allPosts
            .filter(post => post.slug !== currentPost.slug)
            .slice(0, maxResults);
    }

    // Calculate relevance score based on shared tags
    const scoredPosts = allPosts
        .filter(post => post.slug !== currentPost.slug)
        .map(post => {
            const sharedTags = post.data.tags?.filter((tag: string) =>
                currentPost.data.tags.includes(tag)
            ) || [];
            return {
                post,
                score: sharedTags.length,
            };
        })
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score);

    // If we have enough related posts, return them
    if (scoredPosts.length >= maxResults) {
        return scoredPosts.slice(0, maxResults).map(item => item.post);
    }

    // Otherwise, fill with recent posts
    const relatedPosts = scoredPosts.map(item => item.post);
    const remainingCount = maxResults - relatedPosts.length;
    const recentPosts = allPosts
        .filter(post =>
            post.slug !== currentPost.slug &&
            !relatedPosts.includes(post)
        )
        .slice(0, remainingCount);

    return [...relatedPosts, ...recentPosts];
}

/**
 * Sort posts by date (newest first)
 * @param posts - Array of posts
 * @returns Sorted array
 */
export function sortPostsByDate(posts: any[]): any[] {
    return posts.sort((a, b) => {
        const dateA = a.data.updatedDate || a.data.pubDate;
        const dateB = b.data.updatedDate || b.data.pubDate;
        return dateB.valueOf() - dateA.valueOf();
    });
}

/**
 * Format date for display
 * @param date - Date object
 * @returns Formatted date string
 */
export function formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(date);
}

/**
 * Group posts by category
 * @param posts - Array of posts
 * @returns Object with categories as keys
 */
export function groupByCategory(posts: any[]): Record<string, any[]> {
    return posts.reduce((acc, post) => {
        const category = post.data.category || 'Uncategorized';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(post);
        return acc;
    }, {} as Record<string, any[]>);
}
