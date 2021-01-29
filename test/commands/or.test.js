const assert = require('chai').assert;
const or = require('../../lib/commands/or');
const eq = require('../../lib/commands/eq');
const error = require('../../lib/commands/error');
const Context = require('../../lib/Context');

describe('or command', () => {

  const context = new Context();

  it('should return the result of all commands', () => {
    const cmd = or([
      eq('a.value', 2),
      eq('b.value', 1)
    ])(context);
    const facts = { a: { value : 1 }, b: { value: 2 } };

    assert.equal(cmd(facts), false);
  });

  it('should return the result of no commands', () => {
    const cmd = or([])(context);
    const facts = { a: { value : 1 }, b: { value: 2 } };

    assert.equal(cmd(facts), true);
  });

  it('should short circuit when a command return true', () => {
    const cmd = or([
      eq('a.value', 1),
      error('Did not short circuit')
    ])(context);
    const facts = { a: { value : 1 }, b: { value: 2 } };

    assert.equal(cmd(facts), true);
  });
});
