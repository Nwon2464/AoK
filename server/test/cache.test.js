const test = require("node:test");
const assert = require("node:assert/strict");

const { clearCache, getOrSetCache } = require("../src/utils/cache");

test("cache coalesces simultaneous requests for the same key", async () => {
    clearCache();
    let loadCount = 0;
    const loader = async () => {
        loadCount += 1;
        await new Promise((resolve) => setImmediate(resolve));
        return { value: "loaded" };
    };

    const [first, second] = await Promise.all([
        getOrSetCache("same-key", 1000, loader),
        getOrSetCache("same-key", 1000, loader),
    ]);

    assert.deepEqual(first, { value: "loaded" });
    assert.deepEqual(second, { value: "loaded" });
    assert.equal(loadCount, 1);
    clearCache();
});
