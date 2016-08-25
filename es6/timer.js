import kit from './kit';

const Timer = function(id, totalSeconds) {
  const self = this;
  this.id = id;
  this.status = 'running';
  this.totalSeconds = totalSeconds || 600;
  this.createdAt = new Date;
  this.toFinishAt = kit.finishDate(this.createdAt, this.totalSeconds * 1000);
}

export default Timer;
