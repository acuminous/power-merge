const R = require('ramda');
const asyncify = require('async.asyncify');
const variadic = require('variadic');
const path = require('path');
const commands = require('require-all')({ dirname: path.join(__dirname, 'lib', 'commands') });
const ruleSets = require('require-all')({ dirname: path.join(__dirname, 'lib', 'rulesets') });

const Context = require('./lib/Context');
const defaults = require('./lib/defaults');
const noop = require('./lib/noop');

function compile(_options, namedCommands) {
  const options = withDefaultOptions(_options);
  const context = new Context({ namedCommands, options });
  const rules = preProcessRules(context, options.rules);
  return buildMerge(context, rules);
}

function withDefaultOptions(options) {
  return R.mergeDeepLeft(options || {}, defaults);
}

function preProcessRules(context, rules) {
  return R.compose(R.map((rule) => ({
    when: rule.when ? rule.when(context) : commands.always(context),
    then: rule.then(context)
  })), R.flatten)(rules.concat(ruleSets.errorOnNoMatchingRules));
}

function buildMerge(context, rules) {
  const partial = R.curry(merge)(context, rules);
  context.set('merge', partial);
  return withApiWrapper(partial, context);
}

function withApiWrapper(fn, context) {
  fn = withResetWrapper(fn, context);
  const api = context.get('options').api;
  if (api.direction === 'right-to-left') fn = R.compose(fn, R.reverse);
  if (api.variadic) fn = variadic(fn);
  if (api.async) fn = asyncify(fn);
  return fn;
}

function withResetWrapper(fn, context) {
  return function(args) {
    context.reset();
    return fn(args);
  };
}

function merge(context, rules, args) {
  if (args.length === 0) return;
  if (args.length === 1) return args[0]; // To clone or not to clone

  let a = args[0];
  for (let i = 1; i < args.length; i++) {
    const b = args[i];
    for (let r = 0; r < rules.length; r++) {
      const rule = rules[r];
      const node = context.get('node');
      const facts = {
        a: { value: a, type: R.type(a) },
        b: { value: b, type: R.type(b) },
        node: node.getFacts()
      };
      facts.a.circular = context.isCircular(facts.a);
      facts.b.circular = context.isCircular(facts.b);
      if (!rule.when(facts)) continue;
      context.recordHistory(facts.a);
      context.recordHistory(facts.b);
      a = rule.then(facts);
      context.eraseHistory(facts.a);
      context.eraseHistory(facts.b);
      break;
    }
  }
  return a;
}

module.exports = { compile, noop, commands, ruleSets };
