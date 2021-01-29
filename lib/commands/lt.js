const debug = require('debug')('power-merge:commands:lt');
const getView = require('../getView');

module.exports = function __lt(path, value) {

  const view = getView(path);

  return function _lt() {

    return function lt(facts) {

      debug('value: %o, path: %o, facts: %o', value, path, facts);
      const result = view(facts) < value;

      debug('return: %s', result);
      return result;
    };
  };
};
