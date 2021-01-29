const assert = require('chai').assert;
const and = require('../../lib/commands/and');
const eq = require('../../lib/commands/eq');
const error = require('../../lib/commands/error');
const Context = require('../../lib/Context');

describe('and command', () => {

  const context = new Context();

  it('should return the result of all commands', () => {
    const cmd = and([
      eq('a.value', 1),
      eq('b.value', 2)
    ])(context);
    const facts = { a: { value : 1 }, b: { value: 2 } };

    assert.equal(cmd(facts), true);
  });

  it('should return the result of no commands', () => {
    const cmd = and([])(context);
    const facts = { a: { value : 1 }, b: { value: 2 } };

    assert.equal(cmd(facts), true);
  });

  it('should short circuit when a command return false', () => {
    const cmd = and([
      eq('a.value', 2),
      error('Did not short circuit')
    ])(context);
    const facts = { a: { value : 1 }, b: { value: 2 } };

    assert.equal(cmd(facts), false);
  });
});
