var debug = require('debug')('power-merge:commands:error')
var hogan = require('hogan.js')

module.exports = function error(template) {

    var t = hogan.compile(template)

    return function(context, facts) {
        debug('template: %s, facts: %o', template, facts)
        throw new Error(t.render(facts))
    }
}
