var R = require('ramda')

module.exports = function(path) {
  return R.view(R.lensPath(toArray(path)))
}

function toArray(value) {
  if (R.type(value) === 'Array') return value
  // The separator should be configurable, but it can't form part of the context
  // since this would result in constructing the view each time the command was called
  // rather than at configuration time.
  if (R.type(value) === 'String') return value.split('.')
  return [value]
}
