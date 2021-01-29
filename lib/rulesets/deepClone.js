const or = require('../commands/or');
const eq = require('../commands/eq');
const recurseKeys = require('../commands/recurseKeys');
const iterate = require('../commands/iterate');
const clone = require('../commands/clone');

module.exports = [
  // Recurse into objects
  {
    when: or([
      eq('a.type', 'Object'),
      eq('b.type', 'Object')
    ]),
    then: recurseKeys()
  },
  {
    when: or([
      eq('a.type', 'Array'),
      eq('b.type', 'Array')
    ]),
    then: iterate()
  },
  // If the "a" value is undefined, clone the "b" value
  {
    when: eq('a.value', undefined),
    then: clone('b.value')
  },
  // Otherwise clone the "a" value
  {
    then: clone('a.value')
  }
];
