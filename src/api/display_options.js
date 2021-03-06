goog.provide('glift.api.DisplayOptions');


/**
 * Miscellaneous options for display.
 * api:1.0
 *
 * @param {glift.api.DisplayOptions=} opt_o Optional display options obj.
 *
 * @constructor @final @struct
 */
glift.api.DisplayOptions = function(opt_o) {
  var o = opt_o || {};

  /**
   * Specify a background image for the go board.  You can specify an absolute
   * or a relative path.  As you may expect, you cannot do cross domain
   * requests.
   *
   * Examples:
   *  'images/kaya.jpg'
   *  'http://www.mywebbie.com/images/kaya.jpg'
   *
   * api:1.0
   *
   * @type {string}
   */
  this.goBoardBackground = o.goBoardBackground || '';

  /**
   * The name of the theme to be used for this instance. Other themes include:
   *  - DEPTH (stones with shadows)
   *  - MOODY (gray background, no stone outlines)
   *  - TRANSPARENT (board is transparent)
   *  - TEXTBOOK (Everything black and white)
   * api:1.0
   *
   * @type {string}
   */
  // TODO(kashomon): Make a proper enum for this.
  this.theme = o.theme || 'DEFAULT';

  /**
   * On the edges of the board, draw the board coordinates.
   * - On the left, use the numbers 1-19
   * - On the bottom, use A-T (all letters minus I)
   * api:1.0
   *
   * @type {boolean}
   */
  this.drawBoardCoords = !!o.drawBoardCoords || false;

  /**
   * Split percentages to use for a one-column widget format.
   *
   * @type {!Object}
   */
  // TODO(kashomon): Define proper type for this.
  this.oneColumnSplits = o.oneColumnSplits || {
    first: [
      { component: 'STATUS_BAR',   ratio: 0.06 },
      { component: 'BOARD',       ratio: 0.67 },
      { component: 'COMMENT_BOX', ratio: 0.18 },
      { component: 'ICONBAR',     ratio: 0.09 }
    ]
  };

  /**
   * Split percentages to use for a two-column widget format.
   *
   * @type {!Object}
   */
  // TODO(kashomon): Define a proper type for this.
  this.twoColumnSplits = o.twoColumnSplits || {
    first: [
      { component: 'BOARD', ratio: 1 }
    ],
    second: [
      { component: 'STATUS_BAR',     ratio: 0.07 },
      { component: 'COMMENT_BOX',   ratio: 0.83 },
      { component: 'ICONBAR',       ratio: 0.10 }
    ]
  };

  /**
   * Previous SGF icon.
   * @type {string}
   */
  this.previousSgfIcon = o.previousSgfIcon || 'chevron-left';

  /**
   * Next SGF Icon.
   * @type {string}
   */
  this.nextSgfIcon = o.nextSgfIcon || 'chevron-right';

  /**
   * For convenience: Disable zoom for mobile users.
   * @type {boolean}
   */
  this.disableZoomForMobile = !!o.disableZoomForMobile || false;

  /**
   * Whether or not to enable keyboard shortcuts. This currently binds
   * keypress events to document.body, so it's not unlikely this could
   * conflict with other applications' keybindings.
   * @type {boolean}
   */
  this.enableKeyboardShortcuts =
      o.enableKeyboardShortcuts !== undefined ?
      !!o.enableKeyboardShortcuts : true;

  /**
   * Use Markdown for the comment box.  This requires that marked.js be
   * installed in the global scope. (https://github.com/chjj/marked)
   * @api(experimental)
   *
   * @type {boolean}
   */
  this.useMarkdown = !!o.useMarkdown || false;
};
