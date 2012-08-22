(function() {

  define(['frank'], function(frank) {
    var createController;
    createController = function(_arg) {
      var accessibleViewsView, boot, detailsView, ersatzView, tabsController, treeView;
      treeView = _arg.treeView, ersatzView = _arg.ersatzView, detailsView = _arg.detailsView, accessibleViewsView = _arg.accessibleViewsView, tabsController = _arg.tabsController;
      treeView.model.on('active-view-changed', function(viewModel) {});
      treeView.model.on('selected-view-changed', function(viewModel) {
        detailsView.updateModel(viewModel);
        return tabsController.selectViewDetailsTab();
      });
      boot = function() {
        return frank.fetchViewHeirarchy().done(function(rawHeir) {
          var accessibleViews;
          treeView.model.resetViewHeir(rawHeir);
          accessibleViews = treeView.model.getAccessibleViews();
          return accessibleViewsView.collection.reset(accessibleViews);
        });
      };
      return {
        boot: boot
      };
    };
    return createController;
  });

}).call(this);
