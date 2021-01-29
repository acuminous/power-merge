const debug = require('debug')('power-merge:commands:reference');
const getView = require('../getView');

module.exports = function __reference(path) {

  const view = getView(path);

  return function _reference() {

    return function reference(facts) {

      debug('path: %o, facts: %o', path, facts);
      const result = view(facts);

      debug('return: %o', result);
      return result;
    };
  };
};
