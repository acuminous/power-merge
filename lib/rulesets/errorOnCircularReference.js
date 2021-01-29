const or = require('../commands/or');
const eq = require('../commands/eq');
const error = require('../commands/error');

module.exports = [
  {
    when: or([
      eq('a.circular', true),
      eq('b.circular', true)
    ]),
    then: error('Circular reference at {{node.path}}')
  }
];
