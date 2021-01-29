const debug = require('debug')('power-merge:commands:gte');
const getView = require('../getView');

module.exports = function __gte(path, value) {

  const view = getView(path);

  return function _gte() {

    return function gte(facts) {

      debug('value: %o, path: %o, facts: %o', value, path, facts);
      const result = view(facts) >= value;

      debug('return: %s', result);
      return result;
    };
  };
};
