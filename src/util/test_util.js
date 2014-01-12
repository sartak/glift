glift.testUtil = {
  ptlistToMap: function(list) {
    var outMap = {};
    for (var i = 0; i < list.length; i++) {
      var item = list[i];
      if (item.value !== undefined) {
        outMap[item.point.hash()] = item; // LABEL
      } else {
        outMap[item.hash()] = item; // point
      }
    }
    return outMap;
  },

  assertFullDiv: function(divId) {
    // really this is just non-empty...
    ok($('#' + divId).text().length > 0, "Div should contain contents");
  },

  assertEmptyDiv: function(divId) {
    var contents = $('#' + divId).text();
    ok(contents.length === 0,
        'Div should not contain contents. Instead was [' + contents + ']');
  }
};
