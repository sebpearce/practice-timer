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
window.practiceTimer.timerQueue = [];

document.addEventListener('DOMContentLoaded', function(e) {
  document.getElementById('inputbox').value = 'Scales 3s\nChords 2s\nPatterns 15m\nParty 00:30\nTimex 7\nThings 8:00\nStuff 45:20\nLol 08:30:42';
  loadAudio();
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

function loadAudio() {
  window.practiceTimer.beep2 = document.getElementById('beep2');
  window.practiceTimer.beep4 = document.getElementById('beep4');
}

function playChangeSound() {
  window.practiceTimer.beep2.currentTime = 0;
  window.practiceTimer.beep2.play();
}

function playFinishedSound() {
  window.practiceTimer.beep4.currentTime = 0;
  window.practiceTimer.beep4.play();
}

function clearQueue() {
  window.practiceTimer.timerQueue = [];
}

function stopTimer() {
  clearInterval(window.practiceTimer.timerLoop);
  updateTimerDisplay(0);
  updateActivityDisplay('');
}

function updateQueue() {
  const queueDisplayContainer = document.getElementById('queue-container');
  queueDisplayContainer.innerHTML = '';

  window.practiceTimer.timerQueue.forEach((el, i) => {
    const row = document.createElement('div');
    row.className = 'queue-row';
    const activity = document.createElement('span');
    activity.className = 'queue-row-activity';
    activity.appendChild(document.createTextNode(el.activity));
    const period = document.createElement('span');
    period.className = 'queue-row-period';
    period.appendChild(document.createTextNode(el.period));
    row.appendChild(activity);
    row.appendChild(period);
    window.practiceTimer.timerQueue[i].row = row;
    queueDisplayContainer.appendChild(row);
  });
}

function loadTimers() {
  clearQueue();
  stopTimer();
  const inputText = document.getElementById('inputbox').value;
  const id = 1;
  const queue = kit.getQueueFromInput(inputText);
  l(queue);
  queue.forEach((el, id) => {
    window.practiceTimer.timerQueue.push(new Timer(id, el.secondsLeft, el.activity, kit.getFormattedTimeDisplay(el.secondsLeft)));
    id++;
  });
  updateQueue();
}

function updateQueueDisplayRowHighlight(queueItem) {
  document.querySelectorAll('.queue-row').forEach((el) => {
    kit.removeClass(el, '-running');//
  });
  if (queueItem) kit.addClass(queueItem.row, '-running');
}

function finishIfQueueIsEmpty() {
  if (window.practiceTimer.timerQueue.length === 0) {
    playFinishedSound();
    stopTimer();
    updateQueueDisplayRowHighlight();
    l('Finished!');
    return true;
  }
  return false;
}

function handleStartButtonClick(e) {

  loadTimers();
  if (window.practiceTimer.timerQueue.length === 0) return;
  let currentTimer = window.practiceTimer.timerQueue[0];
  updateTimerDisplay(currentTimer.secondsLeft);
  updateActivityDisplay(currentTimer.activity);
  updateQueueDisplayRowHighlight(currentTimer);
  showTimerDisplay();

  window.practiceTimer.timerLoop = setInterval(() => {

    if (currentTimer.secondsLeft > 0) {
      currentTimer.secondsLeft -= 1;
      updateTimerDisplay(currentTimer.secondsLeft);

      if (currentTimer.secondsLeft === 0) {
        window.practiceTimer.timerQueue.shift();
        if (finishIfQueueIsEmpty()) return;
        playChangeSound();
        currentTimer = window.practiceTimer.timerQueue[0];
        updateTimerDisplay(currentTimer.secondsLeft);
        updateActivityDisplay(currentTimer.activity);
        updateQueueDisplayRowHighlight(currentTimer);
      }
    }
  }, 1000);
}

document.getElementById('start').addEventListener('click', handleStartButtonClick);


