goog.provide('glift.flattener.board');
goog.provide('glift.flattener.Board');
goog.provide('glift.flattener.BoardDiffPt');


glift.flattener.board = {
  /**
   * Constructs a board object: a 2D array of intersections.
   *
   * @param {!glift.orientation.Cropbox} cropping A cropping object, which says
   *    how to crop the board.
   * @param {!Object<!glift.rules.Move>} stoneMap A map from pt-string to
   *    move.
   * @param {!Object<glift.flattener.symbols>} markMap A map from pt-string to
   *    mark symbol.
   * @param {!Object<string>} labelMap A map from pt-string to label string
   *
   * @return {!glift.flattener.Board<Intersection>}
   */
  create: function(cropping, stoneMap, markMap, labelMap) {
    var point = glift.util.point;
    var board = [];
    var bbox = cropping.bbox;
    for (var y = bbox.top(); y <= bbox.bottom(); y++) {
      var row = [];
      for (var x = bbox.left(); x <= bbox.right(); x++) {
        var pt = point(x, y);
        var ptStr = pt.toString();
        var stone = stoneMap[ptStr];
        var stoneColor = stone ? stone.color : glift.enums.states.EMPTY;
        var mark = markMap[ptStr];
        var label = labelMap[ptStr]
        row.push(glift.flattener.intersection.create(
            pt, stoneColor, mark, label, cropping.size));
      }
      board.push(row);
    }
    return new glift.flattener.Board(board, bbox, cropping.size);
  }
};

/**
 * Board object.  Meant to be created with the static constuctor method 'create'.
 *
 * @param {!Array<!Array<!T>>} boardArray A matrix of
 *    intersection object of type T.
 * @param {!glift.orientation.BoundingBox} bbox The bounding box of the board
 *    (using board points).
 * @param {number} maxBoardSize Integer number denoting the max board size
 *    (i.e., usually 9, 13, or 19).
 *
 * @template T
 *
 * @constructor @final @struct
 */
glift.flattener.Board = function(boardArray, bbox, maxBoardSize) {
  /**
   * 2D Array of intersections. Generally, this is an array of intersections,
   * but could be backed by a different underlying objects based on a
   * transformation.
   *
   * @private {!Array<!Array<!T>>}
   */
  this.boardArray_ = boardArray;

  /**
   * Bounding box for the crop box.
   *
   * @private {!glift.orientation.BoundingBox}
   */
  this.bbox_ = bbox;

  /**
   * Maximum board size.  Generally 9, 13, or 19.
   *
   * @private {number}
   */
  this.maxBoardSize_ = maxBoardSize;
};

glift.flattener.Board.prototype = {
  /**
   * Provide a SGF Point (indexed from upper left) and retrieve the relevant
   * intersection.  This  takes into account cropping that could be indicated by
   * the bounding box.
   *
   * In other words, in many diagrams, we may wish to show only
   * a small fraction of the board. Thus, this board will be cropping
   * accordingly.  However, getIntBoardPt allows the user to pass in the normal
   * board coordinates, but indexed from the upper left as SGF coordinates are.
   *
   * Example: For
   * [[ a, b, c, d],
   *  [ e, f, g, h],
   *  [ i, j, k, l]]
   * and this is the upper-right corner of a 19x19, if we getIntBoardPt(17, 2),
   * this would return 'k'. (17=2nd to last column, 2=3rd row down);
   *
   * @param {!glift.Point|number} ptOrX a Point object or, optionaly, a number.
   * @param {number=} opt_y If the first param is a number.
   *
   * @return {T} Intersection or null if the
   *    coordinate is out of bounds.
   */
  // TODO(kashomon): Replace with getBoardPt. It's too confusing to have getInt
  // and getBoardPt (and that is already extremely confusing).
  getIntBoardPt: function(ptOrX, opt_y) {
    if (glift.util.typeOf(ptOrX) === 'number' &&
        glift.util.typeOf(opt_y) === 'number') {
      var pt = glift.util.point(
          /** @type {number} */ (ptOrX), /** @type {number} */ (opt_y));
    } else {
      var pt = ptOrX;
    }
    return this.getInt(this.boardPtToPt(pt));
  },

  /**
   * Get an intersection from the board array. Uses the absolute array
   * positioning. Returns null if the pt doesn't exist on the board.
   *
   * If other words, the first parameter is a column (x), the second parameter
   * is the row (y). Optionally, a glift.Point can be passed in instead of the
   * first parameter
   *
   * Example: getInt(1,2) for
   * [[ a, b, c, d],
   *  [ e, f, g, h],
   *  [ i, j, k, l]]
   * returns j
   *
   * @param {!glift.Point|number} ptOrX a Point object or, optionaly, a number.
   * @param {number=} opt_y If the first param is a number.
   *
   * @return {T}
   */
  getInt: function(ptOrX, opt_y) {
    if (glift.util.typeOf(ptOrX) === 'number' &&
        glift.util.typeOf(opt_y) === 'number') {
      var pt = glift.util.point(
          /** @type {number} */ (ptOrX), /** @type {number} */ (opt_y));
    } else {
      var pt = ptOrX;
    }
    var row = this.boardArray_[pt.y()];
    if (!row) { return null };
    return row[pt.x()] || null;
  },

  /**
   * Turns a 0 indexed pt to a point that's board-indexed (i.e., that's offset
   * according to the bounding box).
   *
   * @param {!glift.Point} pt
   * @return {!glift.Point} The translated point
   */
  ptToBoardPt: function(pt) {
    return pt.translate(this.bbox_.left(), this.bbox_.top());
  },

  /**
   * Turns a 0 indexed pt to a point that's board-indexed. What this means, is
   * that we take into account the cropping that could be provided by the
   * bounding box. This could return the IntPt, but it could be different.
   *
   * @param {!glift.Point} pt
   * @return {!glift.Point} The translated point
   */
  boardPtToPt: function(pt) {
    return pt.translate(-this.bbox_.left(), -this.bbox_.top());
  },

  /**
   * Returns the board array.
   * @return {!Array<!Array<!T>>}
   */
  boardArray: function() {
    return this.boardArray_;
  },

  /**
   * Returns the size of the board. Usually 9, 13 or 19.
   * @return {number}
   */
  maxBoardSize: function() {
    return this.maxBoardSize_;
  },

  /**
   * Returns the height of the Go board. Note that this won't necessarily be the
   * length of the board - 1 due to cropping.
   * @return {number}
   */
  height: function() {
    return this.boardArray_.length;
  },

  /**
   * Returns the width of the Go board. Note that this won't necessarily be the
   * length of the board - 1 due to cropping.
   * @return {number}
   */
  width: function() {
    // Here we assume that the Go board is rectangular.
    return this.boardArray_[0].length;
  },

  /**
   * Transforms the intersections into a board instance based on the
   * transformation function.
   *
   * Generally, expects a function of the form:
   *    fn(intersection, x, y);
   *
   * Where X and Y are indexed from the top left and range from 0 to the
   * cropping box width / height respectively.  Equivalently, you can think of x
   * and y as the column and row, although I find this more confusing.
   *
   * @param {function(T, number, number): U} fn Function that takes an
   *    Intersection, an x, and a y, and returns a new Intersection.
   * @return {!glift.flattener.Board<U>} A new board object.
   *
   * @template U
   */
  transform: function(fn) {
    var outArray = [];
    for (var y = 0; y < this.boardArray_.length; y++) {
      var row = [];
      // Assumes a rectangular double array but this should always be the case.
      for (var x = 0; x < this.boardArray_[0].length; x++) {
        var intersect = this.boardArray_[y][x];
        row.push(fn(intersect, x, y));
      }
      outArray.push(row);
    }
    return new glift.flattener.Board(outArray, this.bbox_, this.maxBoardSize_);
  },

  /**
   * Create a diff between this board and another board. Obviously for the board
   * diff to make sense, the boards must have the same type
   *
   * It is required that the boards be the same dimensions, or else an error is
   * thrown.
   *
   * @param {!glift.flattener.Board<T>} that
   * @return {!Array<!glift.flattener.BoardDiffPt<T>>}
   */
  diff: function(that) {
    if (!that || !that.boardArray_ || !that.bbox_ || !that.maxBoardSize_) {
      throw new Error('Diff board not defined or not a flattener board');
    }
    if (this.height() !== that.height() || this.width() !== that.width()) {
      throw new Error('Boards do not have the same dimensions.' +
        ' This: h:' + this.height() + ' w:' + this.width() +
        ' That: h:' + that.height() + ' w:' + that.width());
    }
    var out = [];
    for (var i = 0; i < this.boardArray_.length; i++) {
      var row = this.boardArray_[i];
      var thatrow = that.boardArray_[i];

      for (var j = 0; j < row.length; j++) {
        var intp = row[j];
        var thatintp = thatrow[j];
        if (!thatintp) { break; }

        var ptsEqual = false;
        if (intp.equals && typeof intp.equals === 'function') {
          // Equals is defined, let's use it.
          ptsEqual = intp.equals(thatintp);
        } else {
          // Use regular ===, since equals isn't defined
          ptsEqual = intp === thatintp;
        }
        if (!ptsEqual) {
          var pt = new glift.Point(j, i);
          out.push(new glift.flattener.BoardDiffPt(
            intp, thatintp, pt, this.ptToBoardPt(pt)));
        }
      }
    }
    return out;
  }
};

/**
 * Container that indicates a place in the board where there was a difference
 * between two different boards.
 *
 * @param {T} prevValue
 * @param {T} newValue
 * @param {!glift.Point} colRowPt
 * @param {!glift.Point} boardPt
 *
 * @template T
 *
 * @constructor @final @struct
 */
glift.flattener.BoardDiffPt = function(prevValue, newValue, colRowPt, boardPt) {
  this.prevValue = prevValue;
  this.newValue = newValue;
  this.colRowPt = colRowPt;
  this.boardPt = boardPt;
};
