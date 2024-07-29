/*
Formats
t - Short time (6:20)
T - Long time (6:20:30)
d - Short date (13/04/2006)
D - Long date (13 April 2006)
f - Short date/time (13 April 2006 6:20)
F - Long date/time (Tuesday, 13 April 2006 6:20)
R - Relative time (2 months ago)
*/

module.exports = (epochTimestamp, format = 'f') => {
    const seconds = Math.floor(epochTimestamp / 1000);
    return `<t:${seconds}:${format}>`;
};