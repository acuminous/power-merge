const debug = require('debug')('power-merge:commands:compose');

module.exports = function __compose(commands) {

  return function _compose(context) {

    const cmds = commands.map(command => command(context));

    return function compose(facts) {

      debug('commands: %o, facts: %o', commands, facts);
      const initialValue = cmds.length === 0 ? undefined : facts;
      const result = cmds.reduce((memo, fn) => fn(memo), initialValue);

      debug('return: %o', result);
      return result;
    };
  };
};
