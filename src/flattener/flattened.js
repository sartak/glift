goog.provide('glift.flattener.Flattened');
goog.provide('glift.flattener.FlattenedParams');

/**
 * The Flattened object is complex. We pass in a strongly parameter object for
 * convenience.
 *
 * @typedef {{
 *  board: !glift.flattener.Board,
 *  collisions: !Array<!glift.flattener.Collision>,
 *  comment: string,
 *  isOnMainPath: boolean,
 *  startingMoveNum: number,
 *  endMoveNum: number,
 *  mainlineMoveNum: number,
 *  mainlineMove: ?glift.rules.Move,
 *  nextMainlineMove: ?glift.rules.Move,
 *  stoneMap: !Object<glift.PtStr, !glift.rules.Move>,
 *  markMap: !Object<glift.PtStr, !glift.flattener.symbols>,
 *  labelMap: !Object<glift.PtStr, string>
 * }}
 */
glift.flattener.FlattenedParams;

/**
 * Data used to populate either a display or diagram.
 *
 * @param {!glift.flattener.FlattenedParams} params
 * @constructor @final @struct
 */
glift.flattener.Flattened = function(params) {
  /**
   * Board wrapper. Essentially a double array of intersection objects.
   * @private {!glift.flattener.Board}
   */
  this.board_ = params.board;

  /**
   * @private {!Array<glift.flattener.Collision>}
   */
  this.collisions_ = params.collisions;

  /** @private {string} */
  this.comment_ = params.comment;

  /**
   * Whether or not the position is on the 'top' (zeroth) variation.
   * @private {boolean}
   */
  this.isOnMainPath_ = params.isOnMainPath;

  /**
   * The starting and ending move numbers. These are typically used for
   * labeling diagrams.
   * @private {number}
   */
  this.startMoveNum_ = params.startingMoveNum;
  /** @private {number} */
  this.endMoveNum_ = params.endMoveNum;
  /** @private {number} */
  this.mainlineMoveNum_ = params.mainlineMoveNum;

  /**
   * The move -- {color: <color>, point: <pt>} at the first mainline move in the
   * parent tree. Can be null if no move exists at the node.
   * @private {?glift.rules.Move}
   */
  this.mainlineMove_ = params.mainlineMove;
  /**
   * The next mainline move after the mainline move above.. Usually variations
   * are variations on the _next_ move, so it's usually useful to reference the
   * next move.
   * @private {?glift.rules.Move}
   */
  this.nextMainlineMove_ = params.nextMainlineMove;

  /**
   * All the stones for O(1) convenience =D.
   * @private {!Object<glift.PtStr, !glift.rules.Move>}
   */
  this.stoneMap_ = params.stoneMap;

  /**
   * All the marks!
   * @private {!Object<glift.PtStr, !glift.flattener.symbols>}
   */
  this.markMap_ = params.markMap;

  /**
   * All the labels!
   * @private {!Object<glift.PtStr, string>}
   */
  this.labelMap_ = params.labelMap;
};

glift.flattener.Flattened.prototype = {
  /** @return {!glift.flattener.Board} */
  board: function() { return this.board_; },

  /**
   * The comment C[...] for the position.
   * @return {string}
   */
  comment: function() { return this.comment_; },

  /**
   * A structure illustrating the board collisions. Only relevant for positions
   * with a next moves path.
   *
   * Array of collisions objects.  In other words, we record stones that
   * couldn't be placed on the board.
   *
   * Each object in the collisions array looks like:
   *    {color: <color>, mvnum: <number>, label: <label>}
   * (although the source of truth is in the typedef).
   *
   * @return {!Array<!glift.flattener.Collision>}
   */
  collisions: function() { return this.collisions_; },

  /**
   * Whether or not this position is on the main line or path variation.  For
   * game review diagrams, it's usually nice to distinguish between diagrams for
   * the real game and diagrams for exploratory variations.
   *
   * @return {boolean}
   */
  isOnMainPath: function() { return this.isOnMainPath_; },

  /**
   * Returns the starting move number.
   * @return {number}
   */
  startingMoveNum: function() { return this.startMoveNum_; },

  /**
   * Returns the ending move number.
   * @return {number}
   */
  endingMoveNum: function() { return this.endMoveNum_; },

  /**
   * Returns the first mainline move number in the parent-chain. This will be
   * equal to the startingMoveNum if isOnMainPath = true.
   * @return {number}
   */
  mainlineMoveNum: function() { return this.mainlineMoveNum_; },

  /**
   * Returns the move number of the nextMainlineMove (regardless of whether or
   * not it exists.
   * @return {number}
   */
  nextMainlineMoveNum: function() { return this.mainlineMoveNum() + 1; },

  /**
   * Returns the first mainline move in the parent-chain. Can be null if no move
   * exists and has the form {color: <color>, pt: <pt>} if defined.
   * @return {?glift.rules.Move}
   */
  mainlineMove: function() { return this.mainlineMove_; },

  /**
   * Returns the next mainline move after the mainline move in the parent-chain.
   * Can be null if no move exists and has the form {color: <color>, pt: <pt>}
   * if defined.
   * @return {?glift.rules.Move}
   */
  nextMainlineMove: function() { return this.nextMainlineMove_; },

  /**
   * Returns the stone map. An object with the following structure:
   * @return {!Object<glift.PtStr, !glift.rules.Move>}
   */
  stoneMap: function() { return this.stoneMap_; },

  /**
   * Returns the labels map. An object with the following structure:
   * @return {!Object<glift.PtStr, string>}
   */
  labelMap: function() {
    return this.labelMap_;
  },

  /**
   * Returns the marks map. An object with the following structure:
   * where the numbers correspond to an entry in glift.flattener.symbols.
   *
   * Note: This will include the TEXTLABEL symbol, even though the labels map
   * duplicates this information to some degree.
   *
   * @return {!Object<glift.PtStr, glift.flattener.symbols>}
   */
  markMap: function() {
    return this.markMap_;
  },

  /**
   * Helper for truncating labels if the labels are numbers > 100, which
   * is typically helpful for diagram-display. A no-op for all other labels
   * This used to be done automatically, but there are cases where users may
   * wish to preserve full 3 digit labels.
   *
   * Note: This helper only truncates when branchLength = endNum - startNum <
   * 100.
   *
   * @param {(number|string)} numOrString: The number represented either as a
   *    string or a number (probably the former, but who are we to judge?).
   * @return {string} The processed string label.
   */
  autoTruncateLabel: function(numOrString) {
    var num = numOrString;
    if (typeof numOrString === 'number') {
      // noop
    } else if (typeof numOrString === 'string' && /\d+/.test(numOrString)) {
      num = parseInt(numOrString, 10);
    } else {
      return numOrString;
    }
    var branchLength = this.endingMoveNum() - this.startingMoveNum();
    if (num > 100 && branchLength < 100 && num % 100 !== 0) {
      // Truncation time!
      num = num % 100;
    }
    return num + '';
  }
};
