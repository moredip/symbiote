(function() {

  define(['frank', 'view_heir_model'], function(frank, ViewHeirModel) {
    var createController;
    createController = function(treeView, ersatzView) {
      var boot;
      boot = function() {
        return frank.fetchViewHeirarchy().done(function(rawHeir) {
          return treeView.model.resetViewHeir(rawHeir);
        });
      };
      return {
        boot: boot
      };
    };
    return createController;
  });

}).call(this);
