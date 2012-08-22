(function() {

  define(['frank'], function(frank) {
    var createController;
    createController = function(treeView, ersatzView, detailsView) {
      var boot;
      treeView.model.on('active-view-changed', function(viewModel) {
        return detailsView.updateModel(viewModel);
      });
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
