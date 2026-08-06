require("dotenv").config();

const hasValue = (name) => Boolean(process.env[name]?.trim());

const requiredVariables = ["MONGO_URI", "COOKIE_KEY", "JWT_SECRET"];
const missingRequired = requiredVariables.filter((name) => !hasValue(name));

const featureStatus = (label, variables) => {
    const configured = variables.filter(hasValue);

    if (configured.length === variables.length) {
        console.log(`[사용 가능] ${label}`);
        return true;
    }

    if (configured.length === 0) {
        console.log(`[사용 안 함] ${label}`);
        return true;
    }

    const missing = variables.filter((name) => !hasValue(name));
    console.error(`[설정 오류] ${label}: ${missing.join(", ")} 값이 필요합니다.`);
    return false;
};

if (missingRequired.length > 0) {
    console.error(`[필수 설정 누락] ${missingRequired.join(", ")}`);
} else {
    console.log("[사용 가능] 서버, MongoDB, JWT 인증");
}

const twitchIsValid = featureStatus("Twitch Live API", ["CLIENT_ID", "CLIENT_SECRET"]);
const googleIsValid = featureStatus("Google 로그인", [
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
]);

console.log("[항상 사용 가능] 로컬 Mock API");

if (missingRequired.length > 0 || !twitchIsValid || !googleIsValid) {
    process.exitCode = 1;
}
