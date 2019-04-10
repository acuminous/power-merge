var debug = require('debug')('power-merge:commands:compose')

module.exports = function __compose(commands) {

  return function _compose(context) {

    var cmds = commands.map(command => command(context))

    return function compose(facts) {

      debug('commands: %o, facts: %o', commands, facts)
      var initialValue = cmds.length === 0 ? undefined : facts
      var result = cmds.reduce(function(memo, fn) {
        return fn(memo)
      }, initialValue)

      debug('return: %o', result)
      return result
    }
  }
}
