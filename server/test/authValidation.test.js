const test = require("node:test");
const assert = require("node:assert/strict");

const { loginSchema, signUpSchema, validate } = require("../src/auth/validation");

test("sign-up validation keeps supported fields and strips client-only fields", () => {
    const { error, value } = validate(signUpSchema, {
        username: "tester",
        password: "password123",
        confirmPassword: "password123",
        email: "tester@example.com",
        dateofbirth: "january",
        month: "1",
        year: "2000",
    });

    assert.equal(error, undefined);
    assert.deepEqual(value, {
        username: "tester",
        password: "password123",
        email: "tester@example.com",
        dateofbirth: "january",
        month: 1,
        year: 2000,
    });
});

test("sign-up validation rejects invalid account data", () => {
    const { error } = validate(signUpSchema, {
        username: "a!",
        password: "short",
        email: "not-an-email",
    });

    assert.ok(error);
    assert.ok(error.details.length >= 3);
});

test("login validation strips unrelated fields", () => {
    const { error, value } = validate(loginSchema, {
        username: "tester",
        password: "password123",
        role: "admin",
    });

    assert.equal(error, undefined);
    assert.deepEqual(value, {
        username: "tester",
        password: "password123",
    });
});
