const R = require('ramda');
const Node = require('./Node');

module.exports = function(_state) {

  const state = R.merge({
    options: {},
    namedCommands: {},
    node: new Node(),
    history: { 'Object': [], 'Array': [] }
  }, _state);

  this.get = function(key) {
    return state[key];
  };

  this.set = function(key, value) {
    state[key] = value;
  };

  this.isCircular = function(candidate) {
    return !!(state.history[candidate.type] && ~state.history[candidate.type].indexOf(candidate.value));
  };

  this.recordHistory = function(candidate) {
    state.history[candidate.type] && state.history[candidate.type].push(candidate.value);
  };

  this.eraseHistory = function(candidate) {
    state.history[candidate.type] && state.history[candidate.type].pop();
  };

  this.reset = function() {
    state.node = new Node();
    state.history = { 'Object': [], 'Array': [] };
  };
};
