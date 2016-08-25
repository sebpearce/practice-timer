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

	(function () {
	  // put code in here when finished
	})();

	window.practiceTimer = {};
	window.practiceTimer.timers = [];

	document.addEventListener('DOMContentLoaded', function (e) {
	  document.getElementById('inputbox').value = 'Scales 10m\nChords 5m\nPatterns 15m\nParty 00:30\nThings 8:00\nStuff 45:20\nLol 08:30:42';
	});

	document.getElementById('start').addEventListener('click', function (e) {

	  var inputText = document.getElementById('inputbox').value;

	  console.log(JSON.stringify(_kit2.default.getQueueFromInput(inputText)));

	  // window.practiceTimer.timerLoop = setInterval(function() {
	  //   // console.log('hi!');
	  //   // console.log('Seconds left: ' + kit.secondsBetweenNowAnd(self.toFinishAt));
	  // }, 1000);
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var kit = {
	  getQueueFromInput: function getQueueFromInput(input) {
	    var re = /(.+)\s(.+)$/;
	    var lines = input.split('\n');
	    var queue = lines.map(function (line) {
	      var activity = line.match(re)[1];
	      var period = line.match(re)[2];
	      return {
	        activity: activity,
	        period: kit.parseTotalSeconds(line)
	      };
	    });
	    return queue;
	  },
	  parseTotalSeconds: function parseTotalSeconds(input) {
	    return kit.parseSecondsFromHMSNotation(input) || kit.parseSecondsFromDigitalNotation(input) || 0;
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
	  padWithZero: function padWithZero(x) {
	    return x < 10 ? '0' + x : x;
	  },
	  secondsBetweenNowAnd: function secondsBetweenNowAnd(laterTime) {
	    return Math.round((laterTime - Date.now()) / 1000);
	  },
	  finishDate: function finishDate(startDate, deltaInMs) {
	    return new Date(startDate.getTime() + deltaInMs);
	  },
	  getSecondsDisplay: function getSecondsDisplay(rawSeconds) {
	    return rawSeconds % 60;
	  },
	  getMinutesDisplay: function getMinutesDisplay(rawSeconds) {
	    var s = rawSeconds % 60;
	    return (rawSeconds - s) / 60 % 60;
	  },
	  getHoursDisplay: function getHoursDisplay(rawSeconds) {
	    var s = rawSeconds % 60;
	    var m = (rawSeconds - s) / 60 % 60;
	    return (rawSeconds - m * 60 - s) / 3600;
	  },
	  getFormattedTimeDisplay: function getFormattedTimeDisplay(rawSeconds) {
	    return this.padWithZero(this.getHoursDisplay(rawSeconds)) + ':' + this.padWithZero(this.getMinutesDisplay(rawSeconds)) + ':' + this.padWithZero(this.getSecondsDisplay(rawSeconds));
	  },


	  durationInSeconds: {
	    'h': 3600,
	    'm': 60,
	    's': 1
	  },

	  longhandNumbers: {
	    'a thousand': '1000',
	    'one thousand': '1000',
	    'thousand': '1000',
	    'one hundred': '100',
	    'a hundred': '100',
	    'hundred': '100',
	    'ninety': '90',
	    'eighty': '80',
	    'seventy': '70',
	    'sixty': '60',
	    'fifty': '50',
	    'forty': '40',
	    'thirty': '30',
	    'twenty': '20',
	    'nineteen': '19',
	    'eighteen': '18',
	    'seventeen': '17',
	    'sixteen': '16',
	    'fifteen': '15',
	    'fourteen': '14',
	    'thirteen': '13',
	    'twelve': '12',
	    'eleven': '11',
	    'ten': '10',
	    'nine': '9',
	    'eight': '8',
	    'seven': '7',
	    'six': '6',
	    'five': '5',
	    'four': '4',
	    'three': '3',
	    'two': '2',
	    'one': '1',
	    'and': '',
	    '-': ' '
	  }

	};

	exports.default = kit;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _kit = __webpack_require__(1);

	var _kit2 = _interopRequireDefault(_kit);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Timer = function Timer(id, totalSeconds) {
	  var self = this;
	  this.id = id;
	  this.status = 'running';
	  this.totalSeconds = totalSeconds || 600;
	  this.createdAt = new Date();
	  this.toFinishAt = _kit2.default.finishDate(this.createdAt, this.totalSeconds * 1000);
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
	exports.push([module.id, ".inputbox {\n  display: block;\n  font-size: 16px;\n  height: 200px;\n  margin: 0 0 1em 0;\n  width: 400px; }\n", ""]);

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