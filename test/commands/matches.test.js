var assert = require('chai').assert
var matches = require('../../lib/commands/matches')
var Context = require('../../lib/Context')

describe('matches command', function() {

  var context = new Context()

  it('should test facts with regex', function() {
    var cmd = matches('a.value', /^1$/)(context)
    assert.equal(cmd({ a: { value: 1 } }), true)
    assert.equal(cmd({ a: { value: 11 } }), false)
  })

  it('should test facts with regex', function() {
    var cmd = matches(['a', 'value'], /^1$/)(context)
    assert.equal(cmd({ a: { value: 1 } }), true)
    assert.equal(cmd({ a: { value: 11 } }), false)
  })

  it('should test facts with pattern', function() {
    var cmd = matches('a.value', '1')(context)
    assert.equal(cmd({ a: { value: 1 } }), true)
    assert.equal(cmd({ a: { value: 2 } }), false)
  })

  it('should return false when null', function() {
    var cmd = matches('a.value', /null/)(context)
    assert.equal(cmd({ a: { value: null } }), false)
  })

  it('should return false when undefined', function() {
    var cmd = matches('a.value', /undefined/)(context)
    assert.equal(cmd({ a: { value: undefined } }), false)
  })

  it('should return false when infinity', function() {
    var cmd = matches('a.value', /Infinity/)(context)
    assert.equal(cmd({ a: { value: 1/0 } }), false)
  })

  it('should return false when NaN', function() {
    var cmd = matches('a.value', /NaN/)(context)
    assert.equal(cmd({ a: { value: parseInt('A', 10) } }), false)
  })

  it('should tolerate dates', function() {
    var d = new Date('Thu Jul 13 2017 16:45:17 GMT+0100 (BST)')
    var cmd = matches('a.value', /2017/)(context)
    assert.equal(cmd({ a: { value: d } }), true)
  })

  it('should throw error on invalid patterns', function() {
    assert.throws(function() {
      matches('a.value', '[abc')(context)
    }, /Invalid regular expression/)
  })

})
