var assert = require('chai').assert
var iterate = require('../../lib/commands/iterate')
var Context = require('../../lib/Context')

describe('iterate command', function() {

    function concat(args) {
        return args[0] + '-' + args[1]
    }

    it('should iterate over arrays when both items are present', function() {
        var context = new Context({ merge: concat })

        var cmd = iterate()
        var facts = {
            a: { value: [ '1.1', '1.2' ] },
            b: { value: [ '2.1', '2.2' ] },
            node: { depth: 1 }
        }

        var result = cmd(context, facts)
        assert.equal(result.length, 2)
        assert.equal(result[0], '1.1-2.1')
        assert.equal(result[1], '1.2-2.2')
    })

    it('should iterate over arrays when item exists in a but not in b', function() {
        var context = new Context({ merge: concat })

        var cmd = iterate()
        var facts = {
            a: { value: [ '1.1', '1.2' ] },
            b: { value: [ '2.1' ] },
            node: { depth: 1 }
        }

        var result = cmd(context, facts)
        assert.equal(result.length, 2)
        assert.equal(result[0], '1.1-2.1')
        assert.equal(result[1], '1.2-undefined')
    })

    it('should iterate over arrays when item exists in b but not in a', function() {
        var context = new Context({ merge: concat })

        var cmd = iterate()
        var facts = {
            a: { value: [ '1.1' ] },
            b: { value: [ '2.1', '2.2' ] },
            node: { depth: 1 }
        }

        var result = cmd(context, facts)
        assert.equal(result.length, 2)
        assert.equal(result[0], '1.1-2.1')
        assert.equal(result[1], 'undefined-2.2')
    })
})
