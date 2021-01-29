const debug = require('debug')('power-merge:commands:and');

module.exports = function __and(commands) {

  return function _and(context) {

    const cmds = commands.map(command => command(context));

    return function and(facts) {

      debug('commands: %o, facts: %o', commands, facts);
      let result = true;
      for (let i = 0; i < cmds.length; i++) {
        result = cmds[i](facts);
        if (!result) break;
      }

      debug('return: %s', result);
      return result;
    };
  };
};
