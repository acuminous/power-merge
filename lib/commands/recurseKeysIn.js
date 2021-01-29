const debug = require('debug')('power-merge:commands:recurseKeysIn');
const R = require('ramda');
const internalRecurseKeys = require('./internal/recurseKeys');

module.exports = function __recurseKeysIn() {

  return function _recurseKeysIn(context) {

    return function recurseKeysIn(facts) {
      return internalRecurseKeys(debug, getKeys, context, facts);
    };
  };

  function getKeys(a, b) {
    return R.union(R.keysIn(a), R.keysIn(b));
  }
};
