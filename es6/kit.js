const kit = {

  getQueueFromInput(input) {
    const re = /(.+)\s(.+)$/;
    const lines = input.split('\n');
    const queue = lines.map(function(line) {
      if (!line.match(re)) return null;
      const activity = line.match(re)[1];
      const period = line.match(re)[2];
      return {
        activity: activity,
        period: kit.parseTotalSeconds(period),
      };
    });
    // removes falsy elements
    return queue.filter((el) => (el));
  },

  parseTotalSeconds(input) {
    return kit.parseSecondsFromHMSNotation(input) ||
      kit.parseSecondsFromDigitalNotation(input) ||
      kit.parseSecondsFromSingleNumber(input) ||
      0;
  },

  parseSecondsFromHMSNotation(input) {
    if (!input.match(/\d+\s?[hms]/)) return false;
    const match = input.match(/(\d+)\s?([hms])/);
    if (match.length !== 3) return;
    const amt = parseInt(match[1]);
    const dur = match[2];
    const result = kit.durationInSeconds[dur] * amt;
    return result;
  },

  parseSecondsFromDigitalNotation(input) {
    if (!input.match(/(\d+:)?\d+:\d+/)) return false;
    const match = input.match(/((\d+):)?(\d+):(\d+)/);
    if (match.length !== 5) return;
    const hr = parseInt(match[2]) * 3600 || 0;
    const min = parseInt(match[3]) * 60 || 0;
    const sec = parseInt(match[4]) || 0;
    const result = hr + min + sec;
    return result;
  },

  parseSecondsFromSingleNumber(input) {
    if (!input.match(/^(\d+)$/)) return false;
    const result = parseInt(input) * 60;
    return result;
  },

  padWithZero(x) {
    return (x < 10) ? '0' + x : x;
  },

  secondsBetweenNowAnd(laterTime) {
    return Math.round((laterTime - Date.now()) / 1000);
  },

  getSecondsDisplay(rawSeconds) {
    return kit.padWithZero(rawSeconds % 60);
  },

  getMinutesDisplay(rawSeconds) {
    const s = rawSeconds % 60;
    return kit.padWithZero(((rawSeconds - s) / 60) % 60);
  },

  getHoursDisplay(rawSeconds) {
    const s = rawSeconds % 60;
    const m = ((rawSeconds - s) / 60) % 60;
    return kit.padWithZero((rawSeconds - (m * 60) - s) / 3600);
  },

  getFormattedTimeDisplay(rawSeconds) {
    return this.padWithZero(this.getHoursDisplay(rawSeconds))
      + ':' + this.padWithZero(this.getMinutesDisplay(rawSeconds))
      + ':' + this.padWithZero(this.getSecondsDisplay(rawSeconds));
  },

  durationInSeconds: {
    'h': 3600,
    'm': 60,
    's': 1,
  },

};

export default kit;
