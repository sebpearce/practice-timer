/* TODO:
 *
 * - Settings link/modal
 *   Option to flash screen on change
 * - Display start time and finish time for logging purposes
 * - Total time display (total time showing as you type in the input, total time remaining countdown)
 * - Skip button to skip current stage
 * - Local storage to remember textarea data
 * - Beautify CSS
 * - Keyboard shortcuts
 * - "Time since finished" functionality/display
 * - Volume control (just use [audio element].volume)
 * - Ability to enter 2m30s
 */

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
window.practiceTimer.paused = false;
window.practiceTimer.timerQueue = [];

document.addEventListener('DOMContentLoaded', function(e) {
  document.getElementById('inputbox').value = 'Scales 3m\nChords 2s\nPatterns 15m\nParty 00:30\nTimex 7\nThings 8:00\nStuff 45:20\nLol 08:30:42';
  updateTotalPreview();
  loadAudio();
});

function updateTimerDisplay(rawSeconds) {
  if (window.practiceTimer.timerQueue.hoursNeeded) {
    document.getElementById('timer-display-hr').innerHTML = kit.getHoursDisplay(rawSeconds);
  }
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
  window.practiceTimer.beep2.volume = 0.1;
  window.practiceTimer.beep4.volume = 0.1;
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
    period.appendChild(document.createTextNode(kit.getFormattedTimeDisplay(el.period, window.practiceTimer.timerQueue.hoursNeeded)));
    row.appendChild(activity);
    row.appendChild(period);
    window.practiceTimer.timerQueue[i].row = row;
    queueDisplayContainer.appendChild(row);
  });

  const totalSeconds = window.practiceTimer.timerQueue.reduce((total, cur) => {
    return total + cur.period;
  }, 0);

  const totalRow = document.createElement('div');
  totalRow.className = 'queue-row-total';
  const totalRowActivity = document.createElement('span');
  totalRowActivity.className = 'queue-row-activity';
  totalRowActivity.appendChild(document.createTextNode('Total'));
  const totalRowPeriod = document.createElement('span');
  totalRowPeriod.className = 'queue-row-period';
  totalRowPeriod.appendChild(document.createTextNode(kit.getFormattedTimeDisplay(totalSeconds, totalSeconds >= 3600)));
  totalRow.appendChild(totalRowActivity);
  totalRow.appendChild(totalRowPeriod);
  queueDisplayContainer.appendChild(totalRow);
}

function checkIfHoursAreNeeded() {
  window.practiceTimer.timerQueue.forEach((el) => {
    if (el.secondsLeft >= 3600) window.practiceTimer.timerQueue.hoursNeeded = true;
  });
}

function loadTimers() {
  clearQueue();
  stopTimer();
  const inputText = document.getElementById('inputbox').value;
  const queue = kit.getQueueFromInput(inputText);
  l(queue);
  queue.forEach((el, id) => {
    window.practiceTimer.timerQueue.push(new Timer(el.period, el.activity));
  });
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

function updateTotalPreview() {
  const prev = document.getElementById('total-preview');
  const inputBox = document.getElementById('inputbox');
  const queue = kit.getQueueFromInput(inputBox.value);
  const total = queue.reduce((total, cur) => {
    return total + cur.period;
  }, 0);
  prev.innerHTML = kit.getFormattedTimeDisplay(total, total >= 3600);
}

function handleKeyUp(e) {
  updateTotalPreview();
}

function handleKeyDown(e) {
  if (e.metaKey && e.keyCode == 13) {
    startTimer();
  }
}

function handlePauseButtonClick(e) {
  if (window.practiceTimer.paused) {
    unpauseTimer();
    return;
  }
  pauseTimer();
}

function pauseTimer() {
  clearInterval(window.practiceTimer.timerLoop);
  window.practiceTimer.paused = true;
  document.getElementById('pause').innerHTML = 'Resume';
}

function unpauseTimer() {
  startTimerLoop();
}

function startTimerLoop() {
  window.practiceTimer.paused = false;
  document.getElementById('pause').innerHTML = 'Pause';
  let currentTimer = window.practiceTimer.timerQueue[0];
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

function startTimer() {
  loadTimers();
  checkIfHoursAreNeeded();
  updateQueue();
  if (window.practiceTimer.timerQueue.length === 0) return;
  let currentTimer = window.practiceTimer.timerQueue[0];
  updateTimerDisplay(currentTimer.secondsLeft);
  updateActivityDisplay(currentTimer.activity);
  updateQueueDisplayRowHighlight(currentTimer);
  showTimerDisplay();
  startTimerLoop();
}

function handleStartButtonClick(e) {
  startTimer();
}

document.getElementById('start').addEventListener('click', handleStartButtonClick);
document.getElementById('pause').addEventListener('click', handlePauseButtonClick);
document.getElementById('inputbox').addEventListener('keyup', handleKeyUp);
document.getElementById('inputbox').addEventListener('keydown', handleKeyDown);


