var debug = require('debug')('power-merge:index')
var R = require('ramda')
var asyncify = require('async.asyncify')
var variadic = require('variadic')
var path = require('path')
var commands = require('require-all')({ dirname: path.join(__dirname, 'lib', 'commands') })
var ruleSets = require('require-all')({ dirname: path.join(__dirname, 'lib', 'rulesets') })

var Context = require('./lib/Context')
var defaults = require('./lib/defaults')
var noop = require('./lib/noop')

function compile(_options, namedCommands) {
    var options = withDefaultOptions(_options)
    var rules = preProcessRules(options.rules)
    var context = new Context({ namedCommands: namedCommands, options: options, rules: rules })
    return buildMerge(context)
}

function withDefaultOptions(options) {
    return R.mergeDeepLeft(options || {}, defaults)
}

function preProcessRules(rules) {
    return R.compose(R.map(toWhenAndThen), R.flatten)(rules).concat({
        when: commands.always(),
        then: commands.error('No passing when condition for ({{a.value}}, {{b.value}})')
    })
}

function toWhenAndThen(rule) {
    return {
        when: rule.when ? rule.when : commands.always(),
        then: rule.then
    }
}

function buildMerge(context, rules) {
    var partial = R.curry(merge)(context, context.get('rules'))
    context.set('merge', partial)
    return withApiWrapper(partial, context)
}

function withApiWrapper(fn, context) {
    fn = withResetWrapper(fn, context)
    var api = context.get('options').api
    if (api.direction === 'right-to-left') fn = R.compose(fn, R.reverse)
    if (api.variadic) fn = variadic(fn)
    if (api.async) fn = asyncify(fn)
    return fn
}

function withResetWrapper(fn, context) {
    return function(args) {
        context.reset()
        return fn(args)
    }
}

function merge(context, rules, args) {
    if (args.length === 0) return
    if (args.length === 1) return args[0] // To clone or not to clone

    var a = args[0]
    for (var i = 1; i < args.length; i++) {
        var b = args[i]
        for (var r = 0; r < rules.length; r++) {
            var rule = rules[r]
            var node = context.get('node')
            var facts = {
                a: { value: a, type: R.type(a) },
                b: { value: b, type: R.type(b) },
                node: node.getFacts()
            }
            facts.a.circular = context.isCircular(facts.a)
            facts.b.circular = context.isCircular(facts.b)
            if (!rule.when(context, facts)) continue
            context.recordHistory(facts.a)
            context.recordHistory(facts.b)
            a = rule.then(context, facts)
            context.eraseHistory(facts.a)
            context.eraseHistory(facts.b)
            break
        }
    }
    return a
}

module.exports = { compile: compile, noop: noop, commands: commands, ruleSets: ruleSets }
