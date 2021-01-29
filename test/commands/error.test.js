const assert = require('assert');
const error = require('../../lib/commands/error');
const Context = require('../../lib/Context');

describe('error command', () => {

  const context = new Context();

  it('should throw an error', () => {
    const cmd = error('Oh Noes!')(context);
    const facts = { a: { value : 1 }, b: { value: 2 } };

    assert.throws(() => {
      cmd(facts);
    }, /Oh Noes!/);
  });

  it('should use template', () => {
    const cmd = error('Oh Noes! {{a.value}} {{b.value}}')(context);
    const facts = { a: { value : 1 }, b: { value: 2 } };

    assert.throws(() => {
      cmd(facts);
    }, /Oh Noes! 1 2/);
  });

});
