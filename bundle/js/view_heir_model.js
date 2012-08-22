(function() {

  define(['view_model'], function(ViewModel) {
    var ViewCollection, flatten;
    ViewCollection = Backbone.Collection;
    flatten = function(rootViewModel) {
      var childViewModel, flattenedViewModels, _i, _len, _ref;
      flattenedViewModels = [rootViewModel];
      _ref = rootViewModel.get('children');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        childViewModel = _ref[_i];
        flattenedViewModels = flattenedViewModels.concat(flatten(childViewModel));
      }
      return flattenedViewModels;
    };
    return Backbone.Model.extend({
      resetViewHeir: function(rawRootView) {
        var allViewModels, rootViewModel;
        rootViewModel = new ViewModel(rawRootView);
        allViewModels = flatten(rootViewModel);
        this.set('root', rootViewModel);
        return this.set('allViews', new ViewCollection(allViewModels));
      }
    });
  });

}).call(this);
