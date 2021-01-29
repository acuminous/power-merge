const debug = require('debug')('power-merge:commands:error');
const hogan = require('hogan.js');

module.exports = function __error(template) {

  const t = hogan.compile(template);

  return function _error() {

    return function error(facts) {
      debug('template: %s, facts: %o', template, facts);
      throw new Error(t.render(facts));
    };
  };
};
