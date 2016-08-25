const kit = {

  getQueueFromInput(input) {
    const re = /(.+)\s(.+)$/;
    const lines = input.split('\n');
    const queue = lines.map(function(line) {
      const activity = line.match(re)[1];
      const period = line.match(re)[2];
      return {
        activity: activity,
        period: kit.parseTotalSeconds(line),
      };
    });
    return queue;
  },

  parseTotalSeconds(input) {
    return kit.parseSecondsFromHMSNotation(input) ||
      kit.parseSecondsFromDigitalNotation(input) ||
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

  padWithZero(x) {
    return (x < 10) ? '0' + x : x;
  },

  secondsBetweenNowAnd(laterTime) {
    return Math.round((laterTime - Date.now()) / 1000);
  },

  finishDate(startDate, deltaInMs) {
    return new Date(startDate.getTime() + deltaInMs);
  },

  getSecondsDisplay(rawSeconds) {
    return rawSeconds % 60;
  },

  getMinutesDisplay(rawSeconds) {
    const s = rawSeconds % 60;
    return ((rawSeconds - s) / 60) % 60;
  },

  getHoursDisplay(rawSeconds) {
    const s = rawSeconds % 60;
    const m = ((rawSeconds - s) / 60) % 60;
    return (rawSeconds - (m * 60) - s) / 3600;
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

  longhandNumbers: {
    'a thousand': '1000',
    'one thousand': '1000',
    'thousand': '1000',
    'one hundred': '100',
    'a hundred': '100',
    'hundred': '100',
    'ninety': '90',
    'eighty': '80',
    'seventy': '70',
    'sixty': '60',
    'fifty': '50',
    'forty': '40',
    'thirty': '30',
    'twenty': '20',
    'nineteen': '19',
    'eighteen': '18',
    'seventeen': '17',
    'sixteen': '16',
    'fifteen': '15',
    'fourteen': '14',
    'thirteen': '13',
    'twelve': '12',
    'eleven': '11',
    'ten': '10',
    'nine': '9',
    'eight': '8',
    'seven': '7',
    'six': '6',
    'five': '5',
    'four': '4',
    'three': '3',
    'two': '2',
    'one': '1',
    'and': '',
    '-': ' ',
  },

};

export default kit;
