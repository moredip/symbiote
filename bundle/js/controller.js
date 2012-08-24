(function() {

  define(['frank'], function(frank) {
    var createController;
    createController = function(_arg) {
      var accessibleViewsView, boot, detailsView, ersatzView, experimentBarModel, tabsController, treeView;
      tabsController = _arg.tabsController, treeView = _arg.treeView, ersatzView = _arg.ersatzView, detailsView = _arg.detailsView, accessibleViewsView = _arg.accessibleViewsView, experimentBarModel = _arg.experimentBarModel;
      treeView.model.on('active-view-changed', function(viewModel) {});
      treeView.model.on('selected-view-changed', function(viewModel) {
        detailsView.updateModel(viewModel);
        return tabsController.selectViewDetailsTab();
      });
      treeView.model.on('accessible-view-selected', function(viewModel) {
        return experimentBarModel.set({
          selector: viewModel.getShelleySelector()
        });
      });
      experimentBarModel.on('flash-clicked', function() {
        return frank.sendFlashCommand(experimentBarModel.get('selector'), experimentBarModel.get('engine'));
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
