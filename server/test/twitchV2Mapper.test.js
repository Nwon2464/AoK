const test = require("node:test");
const assert = require("node:assert/strict");

const {
    replaceImageSize,
    toChannelDto,
    toHomeDto,
    toVideoDto,
} = require("../src/mappers/twitchV2Mapper");

test("image mapper supports Twitch stream, game, and video placeholders", () => {
    assert.equal(
        replaceImageSize("https://image/{width}x{height}.jpg", 440, 248),
        "https://image/440x248.jpg"
    );
    assert.equal(
        replaceImageSize("https://image/%{width}x%{height}.jpg", 440, 248),
        "https://image/440x248.jpg"
    );
});

test("home mapper produces stable frontend DTOs without Twitch snake_case", () => {
    const stream = {
        id: "stream-1",
        user_id: "user-1",
        user_login: "tester",
        user_name: "Tester",
        game_id: "27471",
        game_name: "Minecraft",
        title: "Live",
        type: "live",
        viewer_count: 10,
        tags: ["English"],
        started_at: "2026-08-07T00:00:00Z",
        language: "en",
        thumbnail_url: "https://image/{width}x{height}.jpg",
        is_mature: false,
    };
    const game = {
        id: "27471",
        name: "Minecraft",
        box_art_url: "https://box/{width}x{height}.jpg",
    };
    const user = {
        id: "user-1",
        profile_image_url: "https://profile/image.jpg",
    };

    const result = toHomeDto({
        liveStreams: [stream],
        liveStreamsNextCursor: "live-next-page",
        topGames: [game],
        topGamesNextCursor: "games-next-page",
        popularCategories: [{ game, streams: [stream], nextCursor: "next-page" }],
        users: [user],
    });

    assert.equal(result.liveChannels[0].user.login, "tester");
    assert.equal(result.liveChannels[0].user.profileImageUrl, user.profile_image_url);
    assert.equal(result.liveChannels[0].viewerCount, 10);
    assert.equal(result.liveChannelsPagination.nextCursor, "live-next-page");
    assert.equal(result.topGames[0].boxArtUrl, "https://box/285x385.jpg");
    assert.equal(result.topGamesPagination.nextCursor, "games-next-page");
    assert.equal(result.popularCategories[0].streams.length, 1);
    assert.equal(result.popularCategories[0].pagination.nextCursor, "next-page");
    assert.equal(Object.hasOwn(result.liveChannels[0], "viewer_count"), false);
});

test("channel mapper represents an offline channel with a null live stream", () => {
    const result = toChannelDto({
        user: {
            id: "user-1",
            login: "tester",
            display_name: "Tester",
            description: "Description",
            profile_image_url: "profile.jpg",
            offline_image_url: "offline.jpg",
            broadcaster_type: "affiliate",
            created_at: "2020-01-01T00:00:00Z",
        },
        channel: {
            title: "Last title",
            broadcaster_language: "en",
            game_id: "27471",
            game_name: "Minecraft",
            tags: [],
            content_classification_labels: [],
            is_branded_content: false,
        },
        liveStream: null,
    });

    assert.equal(result.user.login, "tester");
    assert.equal(result.channel.game.id, "27471");
    assert.equal(result.liveStream, null);
});

test("video mapper replaces percent-prefixed thumbnail placeholders", () => {
    const result = toVideoDto({
        id: "video-1",
        stream_id: "stream-1",
        user_id: "user-1",
        user_login: "tester",
        user_name: "Tester",
        title: "VOD",
        description: "",
        created_at: "2026-08-07T00:00:00Z",
        published_at: "2026-08-07T00:00:00Z",
        url: "https://twitch.tv/videos/1",
        thumbnail_url: "https://image/%{width}x%{height}.jpg",
        view_count: 10,
        language: "en",
        type: "archive",
        duration: "1h2m3s",
    });

    assert.equal(result.thumbnailUrl, "https://image/440x248.jpg");
    assert.equal(result.viewCount, 10);
});
