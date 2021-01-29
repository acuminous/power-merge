const assert = require('chai').assert;
const gt = require('../../lib/commands/gt');
const Context = require('../../lib/Context');

describe('gt command', () => {

  const context = new Context();

  it('should return true when "a" value specified by the path is greater than the given value', () => {
    const cmd = gt('a.value', 0)(context);
    const facts = { a: { value : 1 }, b: { value: 2 } };

    assert.equal(cmd(facts), true);
  });

  it('should return false when "a" value specified by the path equals the given value', () => {
    const cmd = gt('a.value', 1)(context);
    const facts = { a: { value : 1 }, b: { value: 2 } };

    assert.equal(cmd(facts), false);
  });

  it('should return false when "a" value specified by the path is less than given value', () => {
    const cmd = gt('a.value', 2)(context);
    const facts = { a: { value : 1 }, b: { value: 2 } };

    assert.equal(cmd(facts), false);
  });

  it('should allow use of array paths', () => {
    const cmd = gt(['a', 'value'], 0)(context);
    const facts = { a: { value : 1 }, b: { value: 2 } };

    assert.equal(cmd(facts), true);
  });
});
