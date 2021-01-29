const assert = require('assert');
const eq = require('../../lib/commands/eq');
const Context = require('../../lib/Context');

describe('eq command', () => {

  const context = new Context();

  it('should return true when "a" equals value specified using an array path', () => {
    const cmd = eq(['a', 'value'], 1)(context);
    const facts = { a: { value : 1 }, b: { value: 2 } };

    assert.strictEqual(cmd(facts), true);
  });

  it('should return false when "a" does not equal value specified using an array path', () => {
    const cmd = eq(['value', 'a'], 2)(context);
    const facts = { a: { value : 1 }, b: { value: 2 } };

    assert.strictEqual(cmd(facts), false);
  });

  it('should return true when "b" equals the given value when specified using a string path', () => {
    const cmd = eq('b.value', 2)(context);
    const facts = { a: { value : 1 }, b: { value: 2 } };

    assert.strictEqual(cmd(facts), true);
  });
});
