/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _kit = __webpack_require__(1);

	var _kit2 = _interopRequireDefault(_kit);

	var _timer = __webpack_require__(2);

	var _timer2 = _interopRequireDefault(_timer);

	var _main = __webpack_require__(3);

	var _main2 = _interopRequireDefault(_main);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/* TODO:
	 *
	 * - Settings link/modal
	 * - Option to flash screen on change
	 *   Option for count-in (e.g. 10 seconds)
	 * - Allow for 'sec', 'min' or 'hr' in input
	 * - Allow for input like 2m30s
	 * - Allow for decimals ilke 1.5h
	 * - Total time display (total time showing as you type in the input, total time remaining countdown)
	 * - Skip button to skip current stage
	 * - Local storage to remember textarea data
	 * - Beautify CSS
	 * - Keyboard shortcuts (pause = space or enter)
	 * - "Time since finished" functionality/display (timer keeps counting after finished)
	 * - Volume control (just use [audio element].volume)
	 */

	function l(x) {
	  if (typeof x != 'string' && typeof x != 'number') {
	    console.log(JSON.stringify(x));
	  } else {
	    console.log(x);
	  }
	}

	window.practiceTimer = {};
	window.practiceTimer.paused = false;
	window.practiceTimer.timerQueue = [];
	window.practiceTimer.inputMode = 'time';
	window.practiceTimer.percentageModeTotalTime = '3600';

	document.addEventListener('DOMContentLoaded', function (e) {
	  document.getElementById('inputbox').value = 'Scales 3m\nChords 2s\nPatterns 15m\nParty 00:30\nTimex 7\nThings 8:00\nStuff 45:20\nLol 08:30:42';
	  updateTotalPreview();
	  loadAudio();
	});

	function updateTimerDisplay(rawSeconds) {
	  if (window.practiceTimer.timerQueue.hoursNeeded) {
	    document.getElementById('timer-display-hr').innerHTML = _kit2.default.getHoursDisplay(rawSeconds);
	  }
	  document.getElementById('timer-display-min').innerHTML = _kit2.default.getMinutesDisplay(rawSeconds);
	  document.getElementById('timer-display-sec').innerHTML = _kit2.default.getSecondsDisplay(rawSeconds);
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
	  var now = new Date();
	  window.practiceTimer.startedAt = now;
	  document.getElementById('start-time').innerHTML = _kit2.default.formatDateAsClockTime(window.practiceTimer.startedAt);
	  document.getElementById('start-time-container').style.display = 'block';
	}

	function logFinishTime() {
	  var now = new Date();
	  window.practiceTimer.finishedAt = now;
	  document.getElementById('finish-time').innerHTML = _kit2.default.formatDateAsClockTime(window.practiceTimer.finishedAt);
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
	  var queueDisplayContainer = document.getElementById('queue-container');
	  queueDisplayContainer.innerHTML = '';

	  window.practiceTimer.timerQueue.forEach(function (el, i) {
	    var row = document.createElement('div');
	    row.className = 'queue-row';
	    var activity = document.createElement('span');
	    activity.className = 'queue-row-activity';
	    activity.appendChild(document.createTextNode(el.activity));
	    var period = document.createElement('span');
	    period.className = 'queue-row-period';
	    period.appendChild(document.createTextNode(_kit2.default.getFormattedTimeDisplay(el.period, window.practiceTimer.timerQueue.hoursNeeded)));
	    row.appendChild(activity);
	    row.appendChild(period);
	    window.practiceTimer.timerQueue[i].row = row;
	    queueDisplayContainer.appendChild(row);
	  });

	  var totalSeconds = window.practiceTimer.timerQueue.reduce(function (total, cur) {
	    return total + cur.period;
	  }, 0);

	  var totalRow = document.createElement('div');
	  totalRow.className = 'queue-row-total';
	  var totalRowActivity = document.createElement('span');
	  totalRowActivity.className = 'queue-row-activity';
	  totalRowActivity.appendChild(document.createTextNode('Total'));
	  var totalRowPeriod = document.createElement('span');
	  totalRowPeriod.className = 'queue-row-period';
	  totalRowPeriod.appendChild(document.createTextNode(_kit2.default.getFormattedTimeDisplay(totalSeconds, totalSeconds >= 3600)));
	  totalRow.appendChild(totalRowActivity);
	  totalRow.appendChild(totalRowPeriod);
	  queueDisplayContainer.appendChild(totalRow);
	}

	function hideHoursIfNotNeeded() {
	  window.practiceTimer.timerQueue.forEach(function (el) {
	    if (el.secondsLeft >= 3600) window.practiceTimer.timerQueue.hoursNeeded = true;
	  });
	  document.getElementById('timer-display-hr-section').style.display = window.practiceTimer.timerQueue.hoursNeeded ? 'inline' : 'none';
	}

	function loadTimers() {
	  clearQueue();
	  stopTimer();
	  var inputText = document.getElementById('inputbox').value;
	  var queue = _kit2.default.getQueueFromInput(inputText, window.practiceTimer.inputMode, window.practiceTimer.percentageModeTotalTime);
	  queue.forEach(function (el, id) {
	    window.practiceTimer.timerQueue.push(new _timer2.default(el.period, el.activity));
	  });
	}

	function updateQueueDisplayRowHighlight(queueItem) {
	  document.querySelectorAll('.queue-row').forEach(function (el) {
	    _kit2.default.removeClass(el, '-running'); //
	  });
	  if (queueItem) _kit2.default.addClass(queueItem.row, '-running');
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
	  var prev = document.getElementById('total-preview');
	  var inputText = document.getElementById('inputbox').value;
	  var queue = _kit2.default.getQueueFromInput(inputText, window.practiceTimer.inputMode, window.practiceTimer.percentageModeTotalTime);
	  var total = queue.reduce(function (total, cur) {
	    return total + cur.period;
	  }, 0);
	  prev.innerHTML = _kit2.default.getFormattedTimeDisplay(total, total >= 3600);
	}

	function showHourDisplay() {
	  document.getElementById('timer-display-hr-section').style.display = 'inline';
	}

	function hideHourDisplay() {
	  document.getElementById('timer-display-hr-section').style.display = 'none';
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
	  var currentTimer = window.practiceTimer.timerQueue[0];
	  window.practiceTimer.timerLoop = setInterval(function () {
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
	  var currentTimer = window.practiceTimer.timerQueue[0];
	  updateTimerDisplay(currentTimer.secondsLeft);
	  updateActivityDisplay(currentTimer.activity);
	  updateQueueDisplayRowHighlight(currentTimer);
	  showTimerDisplay();
	  logStartTime();
	  startTimerLoop();
	}

	function handleStartButtonClick(e) {
	  startTimer();
	}

	function handleInputModeRadioClick(e) {
	  if (document.getElementById('input-mode-time').checked) {
	    window.practiceTimer.inputMode = 'time';
	  }
	  if (document.getElementById('input-mode-percentage').checked) {
	    window.practiceTimer.inputMode = 'percentage';
	  }
	}

	function handlePercentageModeTotalTimeInputChange(e) {
	  window.practiceTimer.percentageModeTotalTime = _kit2.default.parseTotalSeconds(this.value);
	}

	document.getElementById('start').addEventListener('click', handleStartButtonClick);
	document.getElementById('pause').addEventListener('click', handlePauseButtonClick);
	document.getElementById('inputbox').addEventListener('keyup', handleKeyUp);
	document.getElementById('inputbox').addEventListener('keydown', handleKeyDown);
	document.getElementById('input-mode-time').addEventListener('change', handleInputModeRadioClick);
	document.getElementById('input-mode-percentage').addEventListener('change', handleInputModeRadioClick);
	document.getElementById('percentage-mode-total-time').addEventListener('change', handlePercentageModeTotalTimeInputChange);

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var kit = {
	  getQueueFromInput: function getQueueFromInput(input, inputMode, percentageModeTotalTime) {
	    var re = /(.+)\s(.+)$/;
	    var lines = input.split('\n');
	    var queue = lines.map(function (line) {
	      if (!line.match(re)) return null;
	      var activity = line.match(re)[1];
	      var period = inputMode === 'percentage' ? Math.ceil(percentageModeTotalTime * kit.parsePercentage(line.match(re)[2])) : kit.parseTotalSeconds(line.match(re)[2]);
	      return {
	        activity: activity,
	        period: period
	      };
	    });
	    // removes falsy elements
	    return queue.filter(function (el) {
	      return el;
	    });
	  },
	  parseTotalSeconds: function parseTotalSeconds(input) {
	    return kit.parseSecondsFromHMSNotation(input) || kit.parseSecondsFromDigitalNotation(input) || kit.parseSecondsFromSingleNumber(input) || 0;
	  },
	  parseSecondsFromHMSNotation: function parseSecondsFromHMSNotation(input) {
	    if (!input.match(/\d+\s?[hms]/)) return false;
	    var match = input.match(/(\d+)\s?([hms])/);
	    if (match.length !== 3) return;
	    var amt = parseInt(match[1]);
	    var dur = match[2];
	    var result = kit.durationInSeconds[dur] * amt;
	    return result;
	  },
	  parseSecondsFromDigitalNotation: function parseSecondsFromDigitalNotation(input) {
	    if (!input.match(/(\d+:)?\d+:\d+/)) return false;
	    var match = input.match(/((\d+):)?(\d+):(\d+)/);
	    if (match.length !== 5) return;
	    var hr = parseInt(match[2]) * 3600 || 0;
	    var min = parseInt(match[3]) * 60 || 0;
	    var sec = parseInt(match[4]) || 0;
	    var result = hr + min + sec;
	    return result;
	  },
	  parseSecondsFromSingleNumber: function parseSecondsFromSingleNumber(input) {
	    if (!input.match(/^(\d+)$/)) return false;
	    var result = parseInt(input) * 60;
	    return result;
	  },
	  parsePercentage: function parsePercentage(input) {
	    if (!input.match(/^(\d+)%$/)) return false;
	    var match = input.match(/^(\d+)%$/);
	    if (match.length !== 2) return;
	    return parseInt(match[1]) * 1e-2;
	  },
	  padWithZero: function padWithZero(x) {
	    return x < 10 ? '0' + x : x;
	  },
	  secondsBetweenNowAnd: function secondsBetweenNowAnd(laterTime) {
	    return Math.round((laterTime - Date.now()) / 1000);
	  },
	  getSecondsDisplay: function getSecondsDisplay(rawSeconds) {
	    return kit.padWithZero(rawSeconds % 60);
	  },
	  getMinutesDisplay: function getMinutesDisplay(rawSeconds) {
	    var s = rawSeconds % 60;
	    return kit.padWithZero((rawSeconds - s) / 60 % 60);
	  },
	  getHoursDisplay: function getHoursDisplay(rawSeconds) {
	    var s = rawSeconds % 60;
	    var m = (rawSeconds - s) / 60 % 60;
	    return kit.padWithZero((rawSeconds - m * 60 - s) / 3600);
	  },
	  getFormattedTimeDisplay: function getFormattedTimeDisplay(rawSeconds, includeHours) {
	    return (includeHours ? this.getHoursDisplay(rawSeconds) + ':' : '') + this.getMinutesDisplay(rawSeconds) + ':' + this.getSecondsDisplay(rawSeconds);
	  },


	  durationInSeconds: {
	    'h': 3600,
	    'm': 60,
	    's': 1
	  },

	  formatDateAsClockTime: function formatDateAsClockTime(date) {
	    return this.padWithZero(date.getHours()) + ':' + this.padWithZero(date.getMinutes());
	  },


	  // hasClas, addClass & removeClass taken from
	  // http://jaketrent.com/post/addremove-classes-raw-javascript/
	  hasClass: function hasClass(el, className) {
	    if (el.classList) return el.classList.contains(className);else return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
	  },
	  addClass: function addClass(el, className) {
	    if (el.classList) el.classList.add(className);else if (!hasClass(el, className)) el.className += " " + className;
	  },
	  removeClass: function removeClass(el, className) {
	    if (el.classList) el.classList.remove(className);else if (hasClass(el, className)) {
	      var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
	      el.className = el.className.replace(reg, ' ');
	    }
	  }
	};

	exports.default = kit;

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	function finishDate(startDate, deltaInMs) {
	  return new Date(startDate.getTime() + deltaInMs);
	}

	var Timer = function Timer(period, activity) {
	  var self = this;
	  this.activity = activity || '';
	  this.period = period || 600;
	  this.secondsLeft = period || 600;
	};

	exports.default = Timer;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(4);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(6)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../node_modules/css-loader/index.js!./../node_modules/sass-loader/index.js!./main.scss", function() {
				var newContent = require("!!./../node_modules/css-loader/index.js!./../node_modules/sass-loader/index.js!./main.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(5)();
	// imports


	// module
	exports.push([module.id, "body {\n  color: #444;\n  font-family: \"Open Sans\", \"Helvetica Neue\", \"Helvetica\", \"Arial\", sans-serif; }\n\n.input-mode-container {\n  margin: 1em 0; }\n\n.inputbox {\n  display: block;\n  font-family: \"Open Sans\", \"Helvetica Neue\", \"Helvetica\", \"Arial\", sans-serif;\n  font-size: 21px;\n  height: 400px;\n  margin: 0 0 1em 0;\n  width: 400px; }\n\n.percentage-mode-total-time-container {\n  margin: 1em 0; }\n\n.percentage-mode-total-time {\n  font-size: 1rem;\n  padding: 0.3em;\n  width: 50px; }\n\n.start-time-container,\n.finish-time-container {\n  display: none; }\n\nlabel[for='start-time'],\nlabel[for='finish-time'] {\n  display: inline-block;\n  width: 100px; }\n\n.-running {\n  color: red; }\n\n.queue {\n  margin: 1em 0; }\n\n.queue-row,\n.queue-row-total {\n  font-size: 20px; }\n\n.queue-row-total {\n  padding-top: 1em; }\n\n.queue-row-total .queue-row-activity,\n.queue-row-total .queue-row-period {\n  font-weight: bold; }\n\n.queue-row-activity,\n.queue-row-period {\n  display: inline-block; }\n\n.queue-row-activity {\n  width: 200px; }\n\n.queue-row-period {\n  min-width: 100px;\n  text-align: right; }\n\n.timer-display-container {\n  padding: 30px 0; }\n\n.timer-display {\n  display: none;\n  font-size: 100px;\n  font-weight: bold; }\n\n.timer-display-separator:after {\n  content: ':'; }\n\n.timer-display-activity {\n  display: block;\n  font-size: 50px;\n  font-weight: 400;\n  height: 40px; }\n\n.total-preview {\n  display: block;\n  margin: 0 0 1em 0; }\n", ""]);

	// exports


/***/ },
/* 5 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }
/******/ ]);