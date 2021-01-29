const debug = require('debug')('power-merge:commands:lte');
const getView = require('../getView');

module.exports = function __lte(path, value) {

  const view = getView(path);

  return function _lte() {

    return function lte(facts) {

      debug('value: %o, path: %o, facts: %o', value, path, facts);
      const result = view(facts) <= value;

      debug('return: %s', result);
      return result;
    };
  };
};
