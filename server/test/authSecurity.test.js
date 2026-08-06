const test = require("node:test");
const assert = require("node:assert/strict");

const jwt = require("jsonwebtoken");

const SignupUser = require("../src/models/signup");
const { requireJwt } = require("../src/auth/middleware");
const { toPublicUser } = require("../src/services/authService");

test("public user DTO never includes the password hash", () => {
    const result = toPublicUser({
        _id: "user-id",
        username: "tester",
        email: "tester@example.com",
        password: "$2b$10$secret-hash",
    });

    assert.deepEqual(result, {
        id: "user-id",
        username: "tester",
        email: "tester@example.com",
    });
    assert.equal(Object.hasOwn(result, "password"), false);
});

test("password is excluded from account queries by default", () => {
    assert.equal(SignupUser.schema.path("password").options.select, false);
    assert.equal(SignupUser.schema.path("username").options.unique, true);
    assert.equal(SignupUser.schema.path("email").options.unique, true);
});

test("JWT middleware rejects a request without a bearer token", () => {
    const request = { get: () => undefined };
    let receivedError;

    requireJwt(request, {}, (error) => {
        receivedError = error;
    });

    assert.equal(receivedError.statusCode, 401);
    assert.equal(receivedError.code, "AUTH_REQUIRED");
});

test("JWT middleware accepts and decodes a valid bearer token", () => {
    const previousSecret = process.env.JWT_SECRET;
    process.env.JWT_SECRET = "test-secret";

    try {
        const token = jwt.sign({ _id: "user-id", username: "tester" }, "test-secret");
        const request = { get: () => `Bearer ${token}` };
        let receivedError;

        requireJwt(request, {}, (error) => {
            receivedError = error;
        });

        assert.equal(receivedError, undefined);
        assert.equal(request.user._id, "user-id");
        assert.equal(request.user.username, "tester");
    } finally {
        if (previousSecret === undefined) {
            delete process.env.JWT_SECRET;
        } else {
            process.env.JWT_SECRET = previousSecret;
        }
    }
});
