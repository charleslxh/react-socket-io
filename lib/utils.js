'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Prints a warning in the console if it exists.
 *
 * @param {String} message The warning message.
 * @returns {void}
 */
var warning = exports.warning = function warning() {
  // debug on development and staging.
  if (process.env.NODE_ENV === 'production') return;

  /* eslint-disable no-console */

  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error.apply(console, args);
  }
  /* eslint-enable no-console */
  try {
    // This error was thrown as a convenience so that if you enable
    // "break on all exceptions" in your console,
    // it would pause the execution at this line.

    throw new Error(args.join(' '));
    /* eslint-disable no-empty */
  } catch (e) {}
  /* eslint-enable no-empty */
};

var debug = exports.debug = function debug() {
  // debug on development and staging.
  if (process.env.NODE_ENV === 'production') return;

  /* eslint-disable no-console */
  if (typeof console !== 'undefined' && typeof console.debug === 'function') {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    console.debug.apply(console, args);
  }
};