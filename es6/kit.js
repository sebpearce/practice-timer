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

  getFormattedTimeDisplay(rawSeconds, includeHours) {
    return (includeHours ? this.getHoursDisplay(rawSeconds) + ':' : '')
      + this.getMinutesDisplay(rawSeconds)
      + ':' + this.getSecondsDisplay(rawSeconds);
  },

  durationInSeconds: {
    'h': 3600,
    'm': 60,
    's': 1,
  },

  formatDateAsClockTime(date) {
    return this.padWithZero(date.getHours()) + ':' + this.padWithZero(date.getMinutes());
  },

  // hasClas, addClass & removeClass taken from
  // http://jaketrent.com/post/addremove-classes-raw-javascript/
  hasClass(el, className) {
    if (el.classList)
      return el.classList.contains(className)
    else
      return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
  },

  addClass(el, className) {
    if (el.classList)
      el.classList.add(className)
    else if (!hasClass(el, className)) el.className += " " + className
  },

  removeClass(el, className) {
    if (el.classList)
      el.classList.remove(className)
    else if (hasClass(el, className)) {
      var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
      el.className=el.className.replace(reg, ' ')
    }
  },

};

export default kit;
