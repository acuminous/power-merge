const assert = require('assert');
const ne = require('../../lib/commands/ne');
const Context = require('../../lib/Context');

describe('ne command', () => {

  const context = new Context();

  it('should return true when "a" equals the value specified using an array path', () => {
    const cmd = ne(['a', 'value'], 2)(context);
    const facts = { a: { value : 1 }, b: { value: 2 } };

    assert.strictEqual(cmd(facts), true);
  });

  it('should return false when "a" does not equal the value specified using an array path', () => {
    const cmd = ne(['a', 'value'], 1)(context);
    const facts = { a: { value : 1 }, b: { value: 2 } };

    assert.strictEqual(cmd(facts), false);
  });

  it('should return true when "b" equals the the value specified using a string path', () => {
    const cmd = ne('b.value', 1)(context);
    const facts = { a: { value : 1 }, b: { value: 2 } };

    assert.strictEqual(cmd(facts), true);
  });
});
