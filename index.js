var R = require('ramda')
var asyncify = require('async.asyncify')
var variadic = require('variadic')
var path = require('path')
var debug = require('debug')('power-merge:index')
var commands = require('require-all')({ dirname: path.join(__dirname, 'lib', 'commands') })

function compile(options) {
    var params = applyDefaults(options)
    var rules = preProcessRules(params.config.rules)
    var ruleBasedMerge = R.curry(merge)(rules)
    return applyApiWrapper(ruleBasedMerge, params.config)
}

function applyDefaults(params) {
    return R.mergeDeepLeft(params || {}, {
        config: { async: false, variadic: true, direction: 'left', rules: [] },
        functions: {},
        actions: {}
    })
}

function preProcessRules(rules) {
    return R.map(function(rule) {
        return { when: rule.when || commands.test(R.T), then: rule.then }
    }, rules)
}

function applyApiWrapper(fn, config) {
    if (config.direction === 'right') fn = R.compose(fn, R.reverse)
    if (config.variadic) fn = variadic(fn)
    if (config.async) fn = asyncify(fn)
    return fn
}

function merge(rules, args) {
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

module.exports = R.merge({ compile: compile }, commands)
