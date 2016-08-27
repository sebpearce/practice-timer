(function(){
  // put code in here when finished
})();

function l(x) {
  if (typeof(x) != 'string' && typeof(x) != 'number') {
    console.log(JSON.stringify(x));
  } else {
    console.log(x);
  }
}

import kit from './kit';
import Timer from './timer';
import styles from '../styles/main.scss';

window.practiceTimer = {};
let timerQueue = window.practiceTimer.timerQueue = [];

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

function showTimerDisplay() {
  document.getElementById('timer-display').style.display = 'block';
}

function clearQueue() {
  timerQueue = [];
}

function stopTimer() {
  clearInterval(window.practiceTimer.timerLoop);
  updateTimerDisplay(0);
  updateActivityDisplay('');
}

function loadTimers() {
  // l('Queue was:');
  // l(timerQueue);
   clearQueue();
  // l('Queue has been cleared.');
  stopTimer();
  const inputText = document.getElementById('inputbox').value;
  const id = 1;
  const queue = kit.getQueueFromInput(inputText);
  l(queue);
  queue.forEach((el, id) => {
    timerQueue.push(new Timer(id, el.period, el.activity));
    id++;
  });
  // l('Queue is now:');
  // l(timerQueue);
}

document.getElementById('start').addEventListener('click', function(e) {

  loadTimers();
  if (timerQueue.length === 0) return;
  let currentTimer = timerQueue[0];
  updateTimerDisplay(currentTimer.secondsLeft);
  updateActivityDisplay(currentTimer.activity);
  showTimerDisplay();

  window.practiceTimer.timerLoop = setInterval(() => {

    if (currentTimer.secondsLeft > 0) {
      currentTimer.secondsLeft -= 1;
      updateTimerDisplay(currentTimer.secondsLeft);
    } else {
      timerQueue.shift();
      if (timerQueue.length === 0) return;
      currentTimer = timerQueue[0];
      updateTimerDisplay(currentTimer.secondsLeft);
      updateActivityDisplay(currentTimer.activity);
    }

  }, 1000);

});


