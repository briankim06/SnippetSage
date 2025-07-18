
export function buildCacheKey(userId: string, params?: any, snippetId?: any) {
    if (snippetId) {
        return `snippets:${userId}:$snippetId}`;
    }
    
    const { q, tag, page = 1, limit = 20 } = params;
    return `snippets:${userId}:${q}:${tag}:${page}:${limit}`;
}