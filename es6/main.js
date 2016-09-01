/* TODO:
 *
 * - Option for count-in (e.g. 10 seconds)
 * - Keyboard shortcuts (pause = space or enter)
 * - "Time since finished" functionality/display (timer keeps counting after finished)
 * - Total time display (total time showing as you type in the input, total time remaining countdown)
 * - Allow for 'sec', 'min' or 'hr' in input
 * - Allow for input like 2m30s
 * - Allow for decimals like 1.5h
 * - Settings link/modal
 * - Skip button to skip current stage?
 * - Volume control (just use [audio element].volume)
 * - Option to flash screen on change
 * - Beautify CSS
 * - Add README.md
 * - Include licence/header info here
 * - Refactor
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
window.practiceTimer.countIn = false;

document.addEventListener('DOMContentLoaded', function(e) {
  const defaultTimeText = 'Scales 10m\nChords 10m\nPatterns 15m\nNew tune 20m';
  const defaultPercentageText = 'Reading 30%\nWriting 20%\nSpeaking 20%\nListening 20%\nVocabulary 10%';
  const defaultPercentageModeTotalTime = '1h';

  if (localStorage.getItem('timeInputString') === '') localStorage.setItem('timeInputString', defaultTimeText);
  if (localStorage.getItem('percentageInputString') === '') localStorage.setItem('percentageInputString', defaultPercentageText);
  if (localStorage.getItem('percentageModeTotalTimeString') === '') localStorage.setItem('percentageModeTotalTimeString', defaultPercentageModeTotalTime);

  if (localStorage.getItem('inputMode') === 'percentage') {
    window.practiceTimer.inputMode = 'percentage';
    document.getElementById('input-mode-percentage').checked = true;
    document.getElementById('inputbox').value = localStorage.getItem('percentageInputString');
    document.getElementById('percentage-mode-total-time').value = localStorage.getItem('percentageModeTotalTimeString');
    showPercentageModeTotalTime();
  } else {
    window.practiceTimer.inputMode = 'time';
    document.getElementById('inputbox').value = localStorage.getItem('timeInputString');
  }

  window.practiceTimer.percentageModeTotalTime = kit.parseTotalSeconds(localStorage.getItem('percentageModeTotalTimeString'));

  updateTotalPreview();
  loadAudio();
});

window.onbeforeunload = function() {
  if (document.getElementById('input-mode-time').checked) {
    localStorage.setItem('timeInputString', document.getElementById('inputbox').value);
  }
  if (document.getElementById('input-mode-percentage').checked) {
    localStorage.setItem('percentageInputString', document.getElementById('inputbox').value);
  }
  localStorage.setItem('inputMode', window.practiceTimer.inputMode);
  localStorage.setItem('percentageModeTotalTimeString', document.getElementById('percentage-mode-total-time').value);
}

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

function hideFinishTime() {
  document.getElementById('finish-time-container').style.display = 'none';
}

function hideStartTime() {
  document.getElementById('start-time-container').style.display = 'none';
}

function logStartTime() {
  const now = new Date();
  window.practiceTimer.startedAt = now;
  document.getElementById('start-time').innerHTML = kit.formatDateAsClockTime(window.practiceTimer.startedAt);
  document.getElementById('start-time-container').style.display = 'block';
}

function logFinishTime() {
  const now = new Date();
  window.practiceTimer.finishedAt = now;
  document.getElementById('finish-time').innerHTML = kit.formatDateAsClockTime(window.practiceTimer.finishedAt);
  document.getElementById('finish-time-container').style.display = 'block';
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
    if (i === 0 && window.practiceTimer.countIn) {
      kit.addClass(row, 'count-in');
    };
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

function hideHoursIfNotNeeded() {
  window.practiceTimer.timerQueue.forEach((el) => {
    if (el.secondsLeft >= 3600) window.practiceTimer.timerQueue.hoursNeeded = true;
  });
  document.getElementById('timer-display-hr-section').style.display = window.practiceTimer.timerQueue.hoursNeeded ? 'inline' : 'none';
}

function loadTimers() {
  clearQueue();
  stopTimer();
  const inputText = document.getElementById('inputbox').value;
  const queue = kit.getQueueFromInput(inputText, window.practiceTimer.inputMode, window.practiceTimer.percentageModeTotalTime);
  queue.forEach((el, id) => {
    window.practiceTimer.timerQueue.push(new Timer(el.period, el.activity));
  });
  if (window.practiceTimer.countIn) window.practiceTimer.timerQueue.unshift(new Timer(10, 'Starting...'));
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
    logFinishTime();
    return true;
  }
  return false;
}

function updateTotalPreview() {
  const prev = document.getElementById('total-preview');
  const inputText = document.getElementById('inputbox').value;
  const queue = kit.getQueueFromInput(inputText, window.practiceTimer.inputMode, window.practiceTimer.percentageModeTotalTime);
  const total = queue.reduce((total, cur) => {
    return total + cur.period;
  }, 0);
  prev.innerHTML = kit.getFormattedTimeDisplay(total, total >= 3600);
}

function showHourDisplay() {
  document.getElementById('timer-display-hr-section').style.display = 'inline';
}

function hideHourDisplay() {
  document.getElementById('timer-display-hr-section').style.display = 'none';
}

function handleInputBoxInput(e) {
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
  hideFinishTime();
  loadTimers();
  hideHoursIfNotNeeded();
  updateQueue();
  if (window.practiceTimer.timerQueue.length === 0) return;
  let currentTimer = window.practiceTimer.timerQueue[0];
  updateTimerDisplay(currentTimer.secondsLeft);
  updateActivityDisplay(currentTimer.activity);
  updateQueueDisplayRowHighlight(currentTimer);
  showTimerDisplay();
  logStartTime();
  startTimerLoop();
}

function showPercentageModeTotalTime() {
  document.getElementById('percentage-mode-total-time').value = localStorage.getItem('percentageModeTotalTimeString');
  document.getElementById('percentage-mode-total-time-container').style.display = 'block';
}

function hidePercentageModeTotalTime() {
  document.getElementById('percentage-mode-total-time-container').style.display = 'none';
}

function handleStartButtonClick(e) {
  startTimer();
}

function handleInputModeRadioClick(e) {
  if (document.getElementById('input-mode-time').checked) {
    localStorage.setItem('percentageInputString', document.getElementById('inputbox').value);
    localStorage.setItem('percentageModeTotalTimeString', document.getElementById('percentage-mode-total-time').value);
    window.practiceTimer.inputMode = 'time';
    document.getElementById('inputbox').value = localStorage.getItem('timeInputString') || '';
    hidePercentageModeTotalTime();
  }
  if (document.getElementById('input-mode-percentage').checked) {
    localStorage.setItem('timeInputString', document.getElementById('inputbox').value);
    window.practiceTimer.inputMode = 'percentage';
    document.getElementById('inputbox').value = localStorage.getItem('percentageInputString') || '';
    document.getElementById('percentage-mode-total-time').value = localStorage.getItem('percentageModeTotalTimeString');
    showPercentageModeTotalTime();
  }
  updateTotalPreview();
}

function handlePercentageModeTotalTimeInputChange(e) {
  window.practiceTimer.percentageModeTotalTime = kit.parseTotalSeconds(this.value);
  updateTotalPreview();
}

function handleCountInSettingChange(e) {
  window.practiceTimer.countIn = this.checked;
}

document.getElementById('start').addEventListener('click', handleStartButtonClick);
document.getElementById('pause').addEventListener('click', handlePauseButtonClick);
document.getElementById('inputbox').addEventListener('input', handleInputBoxInput);
document.getElementById('inputbox').addEventListener('keydown', handleKeyDown);
document.getElementById('input-mode-time').addEventListener('change', handleInputModeRadioClick);
document.getElementById('input-mode-percentage').addEventListener('change', handleInputModeRadioClick);
document.getElementById('percentage-mode-total-time').addEventListener('input', handlePercentageModeTotalTimeInputChange);
document.getElementById('count-in-setting').addEventListener('change', handleCountInSettingChange);
