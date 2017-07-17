var assert = require('chai').assert
var debug = require('../../lib/commands/debug')
var Context = require('../../lib/Context')

describe('debug command', function() {

    var context = new Context()
    var messages

    beforeEach(function() {
        messages = []
    })

    function log(message) {
        messages.push(message)
    }

    it('should debug via supplied function', function() {
        var cmd = debug('meh', log)
        var facts = { a: { value : 1 }, b: { value: 2 } }

        cmd(context, facts)
        assert.equal(messages.length, 1)
        assert.equal(messages[0], 'meh')
    })

    it('should use template', function() {
        var cmd = debug('meh {{a.value}} {{b.value}}', log)
        var facts = { a: { value : 1 }, b: { value: 2 } }

        cmd(context, facts)
        assert.equal(messages.length, 1)
        assert.equal(messages[0], 'meh 1 2')
    })

})
