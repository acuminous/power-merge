var assert = require('chai').assert
var debug = require('../../lib/commands/debug')

describe('debug command', function() {

    var messages

    beforeEach(function() {
        messages = []
    })

    function log(message) {
        messages.push(message)
    }

    it('should debug via supplied function', function() {
        var cmd = debug('meh', log)
        cmd(1, 2)
        assert.equal(messages.length, 1)
        assert.equal(messages[0], 'meh')
    })

    it('should use template', function() {
        var cmd = debug('meh {{a}} {{b}}', log)
        cmd(1, 2)
        assert.equal(messages.length, 1)
        assert.equal(messages[0], 'meh 1 2')
    })

})
