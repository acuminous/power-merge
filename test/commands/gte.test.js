var assert = require('chai').assert
var gte = require('../../lib/commands/gte')
var Context = require('../../lib/Context')

describe('gte command', function() {

  var context = new Context()

  it('should return true when "a" value specified by the path is greater than the given value', function() {
    var cmd = gte('a.value', 0)(context)
    var facts = { a: { value : 1 }, b: { value: 2 } }

    assert.equal(cmd(facts), true)
  })

  it('should return true when "a" value specified by the path equals the given value', function() {
    var cmd = gte('a.value', 1)(context)
    var facts = { a: { value : 1 }, b: { value: 2 } }

    assert.equal(cmd(facts), true)
  })

  it('should return false when "a" value specified by the path is less than given value', function() {
    var cmd = gte('a.value', 2)(context)
    var facts = { a: { value : 1 }, b: { value: 2 } }

    assert.equal(cmd(facts), false)
  })

  it('should allow use of array paths', function() {
    var cmd = gte(['a', 'value'], 0)(context)
    var facts = { a: { value : 1 }, b: { value: 2 } }

    assert.equal(cmd(facts), true)
  })
})
