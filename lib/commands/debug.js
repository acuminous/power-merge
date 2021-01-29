const dbug = require('debug')('power-merge:commands:debug');
const hogan = require('hogan.js');
const noop = require('../noop');

module.exports = function __debug(template, log) {

  if (arguments.length === 1) return __debug(template, console.log);

  const t = hogan.compile(template);

  return function _debug() {

    return function debug(facts) {
      dbug('template: %s, facts: %o', template, facts);
      log(t.render(facts));
      return noop;
    };
  };
};
