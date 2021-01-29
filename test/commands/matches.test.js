const assert = require('chai').assert;
const matches = require('../../lib/commands/matches');
const Context = require('../../lib/Context');

describe('matches command', () => {

  const context = new Context();

  it('should test facts with regex', () => {
    const cmd = matches('a.value', /^1$/)(context);
    assert.equal(cmd({ a: { value: 1 } }), true);
    assert.equal(cmd({ a: { value: 11 } }), false);
  });

  it('should test facts with regex', () => {
    const cmd = matches(['a', 'value'], /^1$/)(context);
    assert.equal(cmd({ a: { value: 1 } }), true);
    assert.equal(cmd({ a: { value: 11 } }), false);
  });

  it('should test facts with pattern', () => {
    const cmd = matches('a.value', '1')(context);
    assert.equal(cmd({ a: { value: 1 } }), true);
    assert.equal(cmd({ a: { value: 2 } }), false);
  });

  it('should return false when null', () => {
    const cmd = matches('a.value', /null/)(context);
    assert.equal(cmd({ a: { value: null } }), false);
  });

  it('should return false when undefined', () => {
    const cmd = matches('a.value', /undefined/)(context);
    assert.equal(cmd({ a: { value: undefined } }), false);
  });

  it('should return false when infinity', () => {
    const cmd = matches('a.value', /Infinity/)(context);
    assert.equal(cmd({ a: { value: 1/0 } }), false);
  });

  it('should return false when NaN', () => {
    const cmd = matches('a.value', /NaN/)(context);
    assert.equal(cmd({ a: { value: parseInt('A', 10) } }), false);
  });

  it('should tolerate dates', () => {
    const d = new Date('Thu Jul 13 2017 16:45:17 GMT+0100 (BST)');
    const cmd = matches('a.value', /2017/)(context);
    assert.equal(cmd({ a: { value: d } }), true);
  });

  it('should throw error on invalid patterns', () => {
    assert.throws(() => {
      matches('a.value', '[abc')(context);
    }, /Invalid regular expression/);
  });

});
