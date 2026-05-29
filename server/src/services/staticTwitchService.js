const minecraftStreams = require("../mocks/twitch/minecraftStreams");
const fortniteStreams = require("../mocks/twitch/fortniteStreams");
const chatStreams = require("../mocks/twitch/chatStreams");
const fallGuysStreams = require("../mocks/twitch/fallGuysStreams");

const getMinecraftStreams = () => minecraftStreams;

const getFortniteStreams = () => fortniteStreams;

const getChatStreams = () => chatStreams;

const getFallGuysStreams = () => fallGuysStreams;

module.exports = {
    getMinecraftStreams,
    getFortniteStreams,
    getChatStreams,
    getFallGuysStreams,
};
