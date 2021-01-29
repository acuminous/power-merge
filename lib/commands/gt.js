const debug = require('debug')('power-merge:commands:gt');
const getView = require('../getView');

module.exports = function __gt(path, value) {

  const view = getView(path);

  return function _gt() {

    return function gt(facts) {
      debug('value: %o, path: %o, facts: %o', value, path, facts);
      const result = view(facts) > value;

      debug('return: %s', result);
      return result;
    };
  };
};
