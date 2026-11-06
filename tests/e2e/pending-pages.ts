// Pages the header and footer already link to but that later tasks build. While they are
// missing, the build only warns (handleHttpError: 'warn' in vite.config.ts), so the crawl skips
// them. The crawl fails if one of these starts returning 200, so each entry is removed as soon
// as its page exists.
export const pendingPages = ['/books', '/stories', '/games', '/about', '/legal'];
