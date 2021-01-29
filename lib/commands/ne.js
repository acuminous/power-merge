const debug = require('debug')('power-merge:commands:ne');
const getView = require('../getView');

module.exports = function __ne(path, value) {

  const view = getView(path);

  return function _ne() {

    return function ne(facts) {

      debug('value: %o, path: %o, facts: %o', value, path, facts);
      const result = view(facts) !== value;

      debug('return: %s', result);
      return result;
    };
  };
};
