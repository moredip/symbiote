(function() {

  define(function() {
    var ViewModel;
    ViewModel = Backbone.Model.extend({
      defaults: {
        parent: void 0
      },
      initialize: function(attributes) {
        var childModels, subview;
        childModels = (function() {
          var _i, _len, _ref, _results;
          _ref = attributes.subviews;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            subview = _ref[_i];
            _results.push(new ViewModel(_.extend(subview, {
              parent: this
            })));
          }
          return _results;
        }).call(this);
        return this.set({
          children: childModels
        });
      },
      getDesc: function() {
        var label, viewClass;
        viewClass = this.get('class');
        if (label = this.get('accessibilityLabel')) {
          return "" + viewClass + ": " + label;
        } else {
          return viewClass;
        }
      },
      getShelleySelector: function() {
        if (this.has('accessibilityLabel')) {
          return "view:'" + (this.get('class')) + "' marked:'" + (this.get('accessibilityLabel')) + "'";
        } else {
          return false;
        }
      }
    });
    return ViewModel;
  });

}).call(this);
