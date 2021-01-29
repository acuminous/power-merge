const debug = require('debug')('power-merge:commands:clone');
const R = require('ramda');
const getView = require('../getView');

module.exports = function __clone(path) {

  const view = getView(path);

  return function _clone() {

    return function clone(facts) {

      debug('path: %o, facts: %o', path, facts);
      const result = R.clone(view(facts));

      debug('return: %o', result);
      return result;
    };
  };
};
