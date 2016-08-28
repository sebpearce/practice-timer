function finishDate(startDate, deltaInMs) {
  return new Date(startDate.getTime() + deltaInMs);
}

const Timer = function(period, activity) {
  const self = this;
  this.activity = activity || '';
  this.period = period || 600;
  this.secondsLeft = period || 600;
}

export default Timer;
