(function() {

  define(['view_model'], function(ViewModel) {
    var ViewCollection, ViewHeirModel, flatten;
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
    ViewHeirModel = Backbone.Model.extend({
      resetViewHeir: function(rawRootView) {
        var allViews, rootViewModel,
          _this = this;
        rootViewModel = new ViewModel(rawRootView);
        allViews = new ViewCollection(flatten(rootViewModel));
        allViews.on('change:active', function(viewModel) {
          if (viewModel.get('active')) {
            _this.trigger('active-view-changed', viewModel);
            return console.log(viewModel.getDesc(), 'is hot');
          }
        });
        this.set('root', rootViewModel);
        return this.set('allViews', allViews);
      }
    });
    return ViewHeirModel;
  });

}).call(this);
