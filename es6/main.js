(function(){
  // put code in here when finished
})();

import kit from './kit';
import Timer from './timer';
import styles from '../styles/main.scss';

window.practiceTimer = {};
window.practiceTimer.timers = [];

document.addEventListener('DOMContentLoaded', function(e) {
  document.getElementById('inputbox').value = 'Scales 10m\nChords 5m\nPatterns 15m\nParty 00:30\nThings 8:00\nStuff 45:20\nLol 08:30:42';
});

document.getElementById('start').addEventListener('click', function(e) {

  const inputText = document.getElementById('inputbox').value;

  console.log(JSON.stringify(kit.getQueueFromInput(inputText)));

  // window.practiceTimer.timerLoop = setInterval(function() {
  //   // console.log('hi!');
  //   // console.log('Seconds left: ' + kit.secondsBetweenNowAnd(self.toFinishAt));
  // }, 1000);

});


