function finishDate(startDate, deltaInMs) {
  return new Date(startDate.getTime() + deltaInMs);
}

const Timer = function(id, totalSeconds, activity) {
  const self = this;
  this.id = id;
  this.activity = activity || '';
  // this.totalSeconds = totalSeconds || 600;
  this.secondsLeft = totalSeconds || 10;
}

export default Timer;
