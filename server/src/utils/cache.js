const cacheStore = new Map();

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
};

module.exports = {
    getCache,
    setCache,
    deleteCache,
    clearCache,
};
