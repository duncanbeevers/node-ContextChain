var vows = require('vows');
var assert = require('assert');
var path = require('path');

require.paths.push(path.join(__dirname, '../lib'));
var ContextChain = require('ContextChain');

function topic() {
  var context = {};
  return {
    context: context,
    chain: new ContextChain(context)
  };
}

vows.describe('A Context Chain').addBatch({
  'when initialized': {
    topic: topic,
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
      var actualArgs, returnValue = {};
      scenario.context.createLinearGradient = function() {
        actualArgs = arguments; return returnValue;
      };
      var gradient = scenario.chain.createLinearGradient(1, 2, 3, 4);
      assert.strictEqual(actualArgs.length, 4);
      assert.strictEqual(actualArgs[0], 1);
      assert.strictEqual(actualArgs[1], 2);
      assert.strictEqual(actualArgs[2], 3);
      assert.strictEqual(actualArgs[3], 4);
      assert.strictEqual(gradient, returnValue);
    },
    'should decorate result of terminator createLinearGradient': function(scenario) {
      var actualArgs, returnValue = {};
      scenario.context.createLinearGradient = function() {
        actualArgs = arguments; return returnValue;
      };
      var gradient = scenario.chain.createLinearGradient(1, 2, 3, 4, function(g) { g.decorated = true; });
      assert.strictEqual(actualArgs.length, 4);
      assert.strictEqual(actualArgs[0], 1);
      assert.strictEqual(actualArgs[1], 2);
      assert.strictEqual(actualArgs[2], 3);
      assert.strictEqual(actualArgs[3], 4);
      assert.strictEqual(gradient, returnValue);
      assert.strictEqual(gradient.decorated, true);
    }
  }
}).run();

