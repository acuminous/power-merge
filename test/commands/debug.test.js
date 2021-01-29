const assert = require('assert');
const debug = require('../../lib/commands/debug');
const Context = require('../../lib/Context');

describe('debug command', () => {

  const context = new Context();
  let messages;

  beforeEach(() => {
    messages = [];
  });

  function log(message) {
    messages.push(message);
  }

  it('should debug via supplied function', () => {
    const cmd = debug('meh', log)(context);
    const facts = { a: { value : 1 }, b: { value: 2 } };

    cmd(facts);
    assert.strictEqual(messages.length, 1);
    assert.strictEqual(messages[0], 'meh');
  });

  it('should use template', () => {
    const cmd = debug('meh {{a.value}} {{b.value}}', log)(context);
    const facts = { a: { value : 1 }, b: { value: 2 } };

    cmd(facts);
    assert.strictEqual(messages.length, 1);
    assert.strictEqual(messages[0], 'meh 1 2');
  });

});
