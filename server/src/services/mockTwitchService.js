const data2 = require("../mocks/twitch/dataStreams2");
const data1 = require("../mocks/twitch/dataStreams");

const shuffle = (items) => {
    const result = [...items];

    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
};

const getFrontPageStreams = () => {
    const streams = [];

    for (const category in data1.frontPage) {
        streams.push(...data1.frontPage[category]);
    }

    return shuffle(streams);
};

const getGroupedFrontPageStreams = () => {
    const groupedStreams = {};

    for (const category in data2.frontPage) {
        groupedStreams[category] = shuffle(data2.frontPage[category]);
    }

    for (const category in data1.frontPage) {
        groupedStreams[category] = shuffle(data1.frontPage[category]);
    }

    return groupedStreams;
};

module.exports = {
    getFrontPageStreams,
    getGroupedFrontPageStreams,
};
