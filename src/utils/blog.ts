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
