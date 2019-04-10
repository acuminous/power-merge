var assert = require('chai').assert
var and = require('../../lib/commands/and')
var eq = require('../../lib/commands/eq')
var error = require('../../lib/commands/error')
var Context = require('../../lib/Context')

describe('and command', function() {

  var context = new Context()

  it('should return the result of all commands', function() {
    var cmd = and([
      eq('a.value', 1),
      eq('b.value', 2)
    ])(context)
    var facts = { a: { value : 1 }, b: { value: 2 } }

    assert.equal(cmd(facts), true)
  })

  it('should return the result of no commands', function() {
    var cmd = and([])(context)
    var facts = { a: { value : 1 }, b: { value: 2 } }

    assert.equal(cmd(facts), true)
  })

  it('should short circuit when a command return false', function() {
    var cmd = and([
      eq('a.value', 2),
      error('Did not short circuit')
    ])(context)
    var facts = { a: { value : 1 }, b: { value: 2 } }

    assert.equal(cmd(facts), false)
  })
})
