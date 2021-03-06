goog.provide('glift.flattener.symbols');

/**
 * Symbolic representation of a Go Board display.
 * @enum {number}
 */
glift.flattener.symbols = {
  // Empty location.  Useful for creating dense arrays.  Can be used for any of
  // the three layers. Assigned to 0 for the usefulness of truthiness.
  EMPTY: 0,

  //
  // Board symbols.  This comprises the first layer.
  //
  TL_CORNER: 2,
  TR_CORNER: 3,
  BL_CORNER: 4,
  BR_CORNER: 5,
  TOP_EDGE: 6,
  BOT_EDGE: 7,
  LEFT_EDGE: 8,
  RIGHT_EDGE: 9,
  CENTER: 10,
  // Center + starpoint. Maybe should just be starpoint, but this is more clear.
  CENTER_STARPOINT: 11,

  //
  // Stone symbols. This comprises the second layer.
  //
  BSTONE: 20,
  WSTONE: 21,

  //
  // Labels and marks. This comprises the third layer.
  //
  TRIANGLE: 30,
  SQUARE: 31,
  CIRCLE: 32,
  XMARK: 33,

  // Text Labeling (numbers or letters)
  TEXTLABEL: 34,

  // Extra marks, used for display.  These are not specified by the SGF
  // specification, but they are often useful.
  LASTMOVE: 35,

  // It's useful to destinguish between standard TEXTLABELs and NEXTVARIATION
  // labels.
  NEXTVARIATION: 36
};

/**
 * Look-up map that allows us to determine a string key for a symbol number.
 * Lazily initialized via symbolStr.
 *
 * @private {Object<number, string>}
 */
glift.flattener.reverseSymbol_ = null;

/**
 * Convert a symbol number to a symbol string.
 * @param {number} num Symbol number
 * @return {string} Symbol name
 */
glift.flattener.symbolStr = function(num) {
  if (glift.flattener.reverseSymbol_ == null) {
    // Create and store a reverse mapping.
    var reverse = {};
    var symb = glift.flattener.symbols;
    for (var key in glift.flattener.symbols) {
      reverse[symb[key]] = key;
    }
    glift.flattener.reverseSymbol_ = reverse;
  }
  return glift.flattener.reverseSymbol_[num];
};
