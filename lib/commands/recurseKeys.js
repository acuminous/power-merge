const debug = require('debug')('power-merge:commands:recurseKeys');
const R = require('ramda');
const internalRecurseKeys = require('./internal/recurseKeys');
const noop = require('../noop');

module.exports = function __recurseKeys() {

  return function _recurseKeys(context) {

    return function recurseKeys(facts) {
      if (facts.a.circular && facts.b.circular) return noop;
      return internalRecurseKeys(debug, getKeys, context, facts);
    };
  };

  function getKeys(a, b) {
    return R.union(Object.keys(a), Object.keys(b));
  }
};
