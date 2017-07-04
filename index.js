var R = require('ramda')
var asyncify = require('async.asyncify')
var variadic = require('variadic')
var path = require('path')
var debug = require('debug')('power-merge:index')
var commands = require('require-all')({ dirname: path.join(__dirname, 'lib', 'commands') })

function compile(_params) {
    var params = R.mergeDeepLeft(_params || {}, {
        config: { async: false, variadic: true, direction: 'left', rules: [] },
        functions: {},
        actions: {}
    })

    var rules = R.map(function(rule) {
        return { when: rule.when || commands.test(R.T), then: rule.then }
    }, params.config.rules)

    var fn = merge
    if (params.config.direction === 'right') fn = right(fn)
    if (params.config.variadic) fn = variadic(fn)
    if (params.config.async) fn = asyncify(fn)
    return fn

    function merge(args) {
        if (args.length == 0) return
        if (args.length == 1) return args[0] // To clone or not to clone

        var a = args[0]
        for (var i = 1; i < args.length; i++) {
            var b = args[i]
            for (var r = 0; r < rules.length; r++) {
                var rule = rules[r]
                var facts = {
                    a: { value: a, type: R.type(a) },
                    b: { value: b, type: R.type(b) }
                }
                if (!rule.when(facts)) continue
                a = rule.then(a, b)
                break
            }
        }
        return a
    }

    function right(fn) {
        return function(args) {
            return fn(R.reverse(args))
        }
    }
}

module.exports = R.merge({ compile: compile }, commands)
