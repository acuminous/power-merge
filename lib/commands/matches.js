const debug = require('debug')('power-merge:commands:matches');
const R = require('ramda');
const getView = require('../getView');

module.exports = function __matches(path, expression) {

  const regexp = new RegExp(expression);
  const view = getView(path);

  return function _matches() {

    return function matches(facts) {

      debug('expression: %s, path: %o, facts: %o', path, expression, facts);
      const property = view(facts);
      const result = isNothing(property) ? false : regexp.test(property);

      debug('return: %s', result);
      return result;
    };

    function isNothing(value) {
      return R.isNil(value) || value === Infinity || isNaN(value);
    }
  };
};
