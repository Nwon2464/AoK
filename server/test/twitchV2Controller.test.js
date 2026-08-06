const test = require("node:test");
const assert = require("node:assert/strict");

const {
    parseCursor,
    parseGameId,
    parseLimit,
    parseUserLogin,
} = require("../src/controllers/twitchV2Controller");

test("v2 query parsing applies defaults and accepts valid values", () => {
    assert.equal(parseLimit(undefined, 20), 20);
    assert.equal(parseLimit("12", 20), 12);
    assert.equal(parseCursor("next-page"), "next-page");
    assert.equal(parseGameId("27471"), "27471");
    assert.equal(parseUserLogin("TwitchDev"), "twitchdev");
});

test("v2 query parsing rejects invalid values with HTTP 400 errors", () => {
    assert.throws(() => parseLimit("0", 20), { statusCode: 400, code: "INVALID_LIMIT" });
    assert.throws(() => parseLimit("101", 20), { statusCode: 400, code: "INVALID_LIMIT" });
    assert.throws(() => parseGameId("minecraft"), {
        statusCode: 400,
        code: "INVALID_GAME_ID",
    });
    assert.throws(() => parseUserLogin("invalid-login!"), {
        statusCode: 400,
        code: "INVALID_USER_LOGIN",
    });
});
