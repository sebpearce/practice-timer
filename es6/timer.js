function finishDate(startDate, deltaInMs) {
  return new Date(startDate.getTime() + deltaInMs);
}

const Timer = function(id, totalSeconds, activity, period) {
  const self = this;
  this.id = id;
  this.activity = activity || '';
  // this.totalSeconds = totalSeconds || 600;
  this.period = period;
  this.secondsLeft = totalSeconds || 10;
}

export default Timer;
