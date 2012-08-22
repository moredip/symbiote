(function() {

  define(['view_model'], function(ViewModel) {
    return Backbone.Model.extend({
      resetViewHeir: function(rawRootView) {
        return this.set('root', new ViewModel(rawRootView));
      }
    });
  });

}).call(this);
