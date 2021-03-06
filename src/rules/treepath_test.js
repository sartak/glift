(function() {
  module('glift.rules.treepathTest');
  var parse = glift.rules.treepath.parsePath;
  var flatten = glift.rules.treepath.flattenMoveTree;

  test('Test undefined', function() {
    deepEqual(parse(undefined), [], 'Should return empty array for undefined');
  });

  test('Test object', function() {
    deepEqual(parse({}), [], 'Should return empty array for object type');
  });

  test('Number', function() {
    deepEqual(parse(3), [0,0,0], 'Should parse correctly');
  });

  test('Test root case', function() {
    deepEqual(parse('0'), [], 'Should produce empty array for root init');
  });

  test('Test to end case', function() {
    deepEqual(parse('1+'), [0].concat(glift.rules.treepath.toEnd_()),
        'Should go to the end');
  });

  test('Test to end case: error', function() {
    try {
      parse('1+.2');
      ok(false, 'Shouldn\'t get here');
    } catch (e) {
      ok(/The \+ character/.test(e.message), 'exception message');
    }
  });

  test('Test simple cases', function() {
    deepEqual(parse('1'), [0], 'Should parse correctly');
    deepEqual(parse('3'), [0,0,0], 'Should parse correctly');
    deepEqual(parse('10'), [0,0,0,0,0,0,0,0,0,0], 'Should parse correctly');
  });

  test('Test one variation', function() {
    deepEqual(parse('2.0'), [0,0,0], 'Should parse correctly');
    deepEqual(parse('2.1'), [0,0,1], 'Should parse correctly');
    deepEqual(parse('3.10'), [0,0,0,10], 'Should parse correctly');
  });

  test('Complex tests', function() {
    deepEqual(parse('2.1-5.7'), [0,0,1,0,0,7], 'Should parse correctly');
    deepEqual(parse('0.0.0.0-6.7'), [0,0,0,0,0,0,7], 'Should parse correctly');
    deepEqual(parse('1.1-3.2-6.7'), [0,1,0,2,0,0,7], 'Should parse correctly');
  });

  test('Convert back to an init path string', function() {
    var convert  = glift.rules.treepath.toInitPathString;
    deepEqual(convert([]), '')
    deepEqual(convert([0]), '1')
    deepEqual(convert([0,0,0]), '3')
    deepEqual(convert([0,0,0,1]), '3.1')
    deepEqual(convert([0,0,0,1,0]), '3.1.0')
    deepEqual(convert([0,0,0,1,0,0]), '3.1.0.0')
    deepEqual(convert([0,0,0,1,0,0,12,0,5]), '3.1.0.0.12.0.5')
  });

  test('Parse a fragment', function() {
    var parseFragment = glift.rules.treepath.parseFragment;
    deepEqual(parseFragment([1,0]), [1,0]);
    deepEqual(parseFragment('1.2.0.2'), [1,2,0,2]);
    deepEqual(parseFragment('1.2-5.2'), [1,2,2], 'Should ignore the -5');
    deepEqual(
        parseFragment('1.11+'),
        [1,11].concat(glift.rules.treepath.toEnd_()));
  });

  test('Convert back to an path fragment string', function() {
    var convertToString = glift.rules.treepath.toFragmentString;
    deepEqual(convertToString([0,1,0,2,0,0,7]), '0.1.0.2.0.0.7');
    deepEqual(convertToString('0'), '0');
  });

  test('Test to end paths', function() {
    deepEqual(parse('0.1+'), [1].concat(glift.rules.treepath.toEnd_()));
    deepEqual(parse('0.2.3+'), [2,3].concat(glift.rules.treepath.toEnd_()));
  });

  test('Flatten Movetree', function() {
    var mt = glift.rules.movetree.getInstance();
    mt.addNode().addNode().addNode().addNode()
      .moveUp().moveUp().moveUp()
      .addNode().addNode();
    mt.getTreeFromRoot().addNode().addNode();
    mt = mt.getTreeFromRoot();
    var out = flatten(mt);
    ok(true, 'foo');
    deepEqual(out, [[0,0,0,0], [0,1,0], [1,0]], 'Must flatten correctly');
    mt.moveDown();

    var out2 = flatten(mt);
    deepEqual(out2, [[0,0,0], [1,0]], 'Must flatten correctly after moveDown');
  });
})();
