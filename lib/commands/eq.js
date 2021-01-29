const debug = require('debug')('power-merge:commands:eq');
const getView = require('../getView');

module.exports = function __eq(path, value) {

  const view = getView(path);

  return function _eq() {

    return function eq(facts) {

      debug('value: %o, path: %o, facts: %o', value, path, facts);
      const result = view(facts) === value;

      debug('return: %s', result);
      return result;
    };
  };
};
