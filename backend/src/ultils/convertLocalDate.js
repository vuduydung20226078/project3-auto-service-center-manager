
function buildLocalDayRange(dateStr) {
    const [y, m, d] = dateStr.split('-').map(Number);
    return {
        start: new Date(y, m - 1, d, 0, 0, 0, 0),
        end: new Date(y, m - 1, d, 23, 59, 59, 999),
    };
}

module.exports = {
    buildLocalDayRange
};
