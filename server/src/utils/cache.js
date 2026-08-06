const cacheStore = new Map();
const pendingRequests = new Map();

const getCache = (key) => {
    const cached = cacheStore.get(key);

    if (!cached) {
        return null;
    }

    if (Date.now() > cached.expiresAt) {
        cacheStore.delete(key);
        return null;
    }
    console.log(`[CACHE HIT] ${key}`);
    return cached.value;
};

const setCache = (key, value, ttlMs) => {
    console.log(`[CACHE SET] ${key} ttl=${ttlMs}ms`);
    cacheStore.set(key, {
        value,
        expiresAt: Date.now() + ttlMs,
    });
};

const deleteCache = (key) => {
    cacheStore.delete(key);
};

const clearCache = () => {
    cacheStore.clear();
    pendingRequests.clear();
};

const getOrSetCache = async (key, ttlMs, loader) => {
    const cached = getCache(key);

    if (cached !== null) {
        return cached;
    }

    if (pendingRequests.has(key)) {
        return pendingRequests.get(key);
    }

    const request = Promise.resolve()
        .then(loader)
        .then((value) => {
            setCache(key, value, ttlMs);
            return value;
        })
        .finally(() => {
            pendingRequests.delete(key);
        });

    pendingRequests.set(key, request);
    return request;
};

module.exports = {
    getCache,
    getOrSetCache,
    setCache,
    deleteCache,
    clearCache,
};
