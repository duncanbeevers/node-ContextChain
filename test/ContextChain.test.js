var vows = require('vows');
var assert = require('assert');
var path = require('path');

require.paths.push(path.join(__dirname, '../lib'));
var ContextChain = require('ContextChain');

vows.describe('A Context Chain').addBatch({
  'when initialized': {
    topic: function() {
      var context = {};
      return {
        context: context,
        chain: new ContextChain(context)
      };
    },
    'should implement arc': function(scenario) {
      var suppliedArgs;
      scenario.context.arc = function(x, y, radius, startAngle, endAngle, anticlockwise) {
        suppliedArgs = [].splice.call(arguments, 0);
      };

      var expectedArgs = [ 0, 0, 10, 0, 90, false ];
      scenario.chain.arc(0, 0, 10, 0, 90, false);
      assert.deepEqual(suppliedArgs, expectedArgs);
    },
    'should implement strokeStyle': function(scenario) {
      var style = '#ddd';

      scenario.chain.strokeStyle(style);
      assert.strictEqual(scenario.context.strokeStyle, style);
    },
    'should implement compositeSourceOver': function(scenario) {
      scenario.chain.compositeSourceOver();
      assert.strictEqual(scenario.context.globalCompositeOperation, 'source-over');
    },
    'should implement terminator createLinearGradient': function(scenario) {
      var actualArgs, expectedArgs = [ 1, 2, 3, 4 ], returnValue = {};
      scenario.context.createLinearGradient = function() {
        actualArgs = [].splice.call(arguments, 0);
        return returnValue;
      };
      var gradient = scenario.chain.createLinearGradient(1, 2, 3, 4);
      assert.deepEqual(actualArgs, expectedArgs);
      assert.strictEqual(gradient, returnValue);
    },
    'should decorate result of terminator createLinearGradient': function(scenario) {
      var actualArgs, expectedArgs = [ 1, 2, 3, 4 ], returnValue = {};
      scenario.context.createLinearGradient = function() {
        actualArgs = [].splice.call(arguments, 0);
        return returnValue;
      };
      var gradient = scenario.chain.createLinearGradient(1, 2, 3, 4, function(g) { g.decorated = true; });
      assert.strictEqual(gradient, returnValue);
      assert.strictEqual(gradient.decorated, true);
    }
  },
  'when initialized with no context': {
    topic: function() {
      var context;
      return {
        context: context,
        chain: new ContextChain(context)
      };
    },
    'should not throw on arc': function(scenario) {
      assert.doesNotThrow(scenario.chain.arc.bind(scenario.chain, 0, 0, 10, 0, 90, false));
    },
    'should not throw on strokeStyle': function(scenario) {
      assert.doesNotThrow(function() { scenario.chain.strokeStyle('#fff'); });
    },
    'should not throw on composite source over': function(scenario) {
      assert.doesNotThrow(function() { scenario.chain.compositeSourceOver(); });
    },
    'should not throw on terminator': function(scenario) {
      assert.doesNotThrow(function() { scenario.chain.createLinearGradient(1, 2, 3, 4); });
    },
    'should not throw on terminator with decorator': function(scenario) {
      var hasBeenRun = false;
      function fn() { hasBeenRun = true; }
      assert.doesNotThrow(function() { scenario.chain.createLinearGradient(1, 2, 3, 4, fn); });
      assert.strictEqual(hasBeenRun, false);
    }
  }
}).run();

