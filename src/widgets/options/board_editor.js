/**
 * Board Editor options.
 */
glift.widgets.options.BOARD_EDITOR = {
  stoneClick: function(event, widget, pt) {},

  icons: ['start', 'end', 'arrowleft', 'arrowright'],

  problemConditions: {},

  showVariations: glift.enums.showVariations.ALWAYS,

  controllerFunc: glift.controllers.boardEditor
};