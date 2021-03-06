(function() {
  module('glift.displays.resizedBoxTest');
  var util = glift.util,
      displays = glift.displays,
      enums = glift.enums,
      boardRegions = glift.enums.boardRegions,
      getResizedBox = glift.displays.getResizedBox
      cropbox = displays.cropbox,
      WIDTH = 300,
      HEIGHT = 400;

  test('Test get CropDimensions: ALL must make dims square', function() {
    var cropbox = displays.cropbox.getFromRegion(boardRegions.ALL, 19);
    var outDims = displays.getCropDimensions(120, 60, cropbox);
    deepEqual(outDims.height, outDims.width, 'Width and height must be equal');
  });

  test('Test get CropDimensions: LEFT', function() {
    var cropbox = displays.cropbox.getFromRegion(boardRegions.LEFT, 19);
    var outDims = displays.getCropDimensions(120, 60, cropbox);
    deepEqual(Math.round(outDims.height / outDims.width),
        Math.round(cropbox.heightMod() /  cropbox.widthMod()),
        'CropBox Ratio and dim ration must be the same');
  });

  test('Tall box: With resizing, should be square and centered', function() {
    glift.global.debugMode = true;
    var divBox = glift.orientation.bbox.fromPts(
        util.point(0,0), util.point(300, 400));
    deepEqual(divBox.width(), 300, 'Width must be 300');
    deepEqual(divBox.height(), 400, 'Height must be 400');

    var cb = displays.cropbox.getFromRegion(boardRegions.ALL, 19);

    var resized = getResizedBox(divBox, cb);
    var d = resized._debugInfo();
    deepEqual(d.newDims.height, d.newDims.width);
    deepEqual(d.yDiff, 100);
    deepEqual(d.xDiff, 0);
    deepEqual(d.yDelta, 50);
    deepEqual(d.xDelta, 0);

    deepEqual(Math.round(resized.width()), 300, 'Width must be 300');
    deepEqual(Math.round(resized.height()), 300, 'Height must be 300');

    deepEqual(resized.topLeft().x(), 0, 'Topleft.x should not move');
    deepEqual(resized.topLeft().y(), 50, 'Topleft.y should move');
    deepEqual(resized.botRight().x(), 300, 'BotRight.x = Width');
    deepEqual(resized.botRight().y(), 350, 'BotRight.y = height + delta');

    deepEqual(resized.top(), 50, 'top == TopLeft.y');
    deepEqual(resized.bottom(), 350, 'bottom == BotRight.y');
    deepEqual(resized.left(), 0, 'left == TopLeft.x');
    deepEqual(resized.right(), 300, 'right == BotRight.x');

    deepEqual(resized.center().x(), 150, 'x center');
    deepEqual(resized.center().y(), 200, 'y center');
    glift.global.debugMode = false;
  });

  test('Wide box: With resizing, should be square and centered', function() {
    glift.global.debugMode = true;
    var divBox = glift.orientation.bbox.fromPts(
        util.point(0,0), util.point(400, 300));
    deepEqual(divBox.width(), 400, 'Width must be 400');
    deepEqual(divBox.height(), 300, 'Height must be 300');

    var cb = displays.cropbox.getFromRegion(boardRegions.ALL, 19);

    var resized = getResizedBox(divBox, cb);
    var d = resized._debugInfo();
    deepEqual(d.newDims.height, d.newDims.width);
    deepEqual(d.yDiff, 0);
    deepEqual(d.xDiff, 100)
    deepEqual(d.yDelta, 0);
    deepEqual(d.xDelta, 50);

    deepEqual(Math.round(resized.width()), 300, 'Width must be 300');
    deepEqual(Math.round(resized.height()), 300, 'Height must be 300');

    deepEqual(resized.topLeft().x(), 50, 'Topleft.x');
    deepEqual(resized.topLeft().y(), 0, 'Topleft.y');
    deepEqual(resized.botRight().x(), 350, 'BotRight.x');
    deepEqual(resized.botRight().y(), 300, 'BotRight.y');

    deepEqual(resized.left(), 50, 'left');
    deepEqual(resized.top(), 0, 'top');
    deepEqual(resized.right(), 350, 'right');
    deepEqual(resized.bottom(), 300, 'bottom');

    deepEqual(resized.center().x(), 200, 'x center');
    deepEqual(resized.center().y(), 150, 'y center');
    glift.global.debugMode = false;
  });
})();
