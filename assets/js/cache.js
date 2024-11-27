// assets/js/cache.js

class CacheManager {
    constructor() {
        this.cacheName = 'dealspot-v1';
        this.initializeServiceWorker();
    }

    async initializeServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                console.log('ServiceWorker registered:', registration);
            } catch (error) {
                console.error('ServiceWorker registration failed:', error);
            }
        }
    }

    async cacheData(key, data, expiration = 3600) {
        try {
            const cache = await caches.open(this.cacheName);
            const response = new Response(JSON.stringify({
                data,
                timestamp: Date.now(),
                expiration
            }));
            await cache.put(key, response);
        } catch (error) {
            console.error('Cache storage failed:', error);
        }
    }

    async getCachedData(key) {
        try {
            const cache = await caches.open(this.cacheName);
            const response = await cache.match(key);
            
            if (!response) return null;

            const { data, timestamp, expiration } = await response.json();
            
            if (Date.now() - timestamp > expiration * 1000) {
                await cache.delete(key);
                return null;
            }

            return data;
        } catch (error) {
            console.error('Cache retrieval failed:', error);
            return null;
        }
    }

    async clearCache() {
        try {
            await caches.delete(this.cacheName);
        } catch (error) {
            console.error('Cache clearing failed:', error);
        }
    }
}
