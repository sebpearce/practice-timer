(function(){
  // put code in here when finished
})();

import kit from './kit';
import Timer from './timer';
import styles from '../styles/main.scss';

window.practiceTimer = {};
window.practiceTimer.timers = [];

document.addEventListener('DOMContentLoaded', function(e) {
  document.getElementById('inputbox').value = 'Scales 3s\nChords 2s\nPatterns 15m\nParty 00:30\nTimex 7\nThings 8:00\nStuff 45:20\nLol 08:30:42';
});


function updateTimerDisplay(rawSeconds) {
  document.getElementById('timer-display-hr').innerHTML = kit.getHoursDisplay(rawSeconds);
  document.getElementById('timer-display-min').innerHTML = kit.getMinutesDisplay(rawSeconds);
  document.getElementById('timer-display-sec').innerHTML = kit.getSecondsDisplay(rawSeconds);
}

function updateActivityDisplay(activity) {
  document.getElementById('timer-display-activity').innerHTML = activity;
}

function loadTimers() {
  const inputText = document.getElementById('inputbox').value;
  const id = 1;
  const queue = kit.getQueueFromInput(inputText);
  queue.forEach((el, id) => {
    window.practiceTimer.timers.push(new Timer(id, el.period, el.activity));
    id++;
  });
  console.log(window.practiceTimer.timers);
}

document.getElementById('start').addEventListener('click', function(e) {

  loadTimers();
  let currentTimer = window.practiceTimer.timers[0];
  const now = Date.now();
  currentTimer.toFinishAt = new Date(now + currentTimer.totalSeconds * 1000);
  updateTimerDisplay((currentTimer.toFinishAt - now) / 1000);
  updateActivityDisplay(currentTimer.activity);

  window.practiceTimer.timerLoop = setInterval(() => {

    const now = Date.now();

    if (currentTimer.toFinishAt >= now) {
      const diff = Math.round((currentTimer.toFinishAt - now) / 1000);
      updateTimerDisplay(diff);
    } else {
      window.practiceTimer.timers.shift();
      if (window.practiceTimer.timers.length === 0) return;
      currentTimer = window.practiceTimer.timers[0];
      currentTimer.toFinishAt = new Date(now + currentTimer.totalSeconds * 1000);
      updateTimerDisplay((currentTimer.toFinishAt - now) / 1000);
      updateActivityDisplay(currentTimer.activity);
    }

  }, 1000);

});


