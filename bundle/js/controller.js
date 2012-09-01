(function() {

  define(['frank'], function(frank) {
    var createController;
    createController = function(_arg) {
      var $asplodeButton, accessibleViewsView, boot, detailsView, ersatzView, experimentBarModel, tabsController, treeView;
      tabsController = _arg.tabsController, treeView = _arg.treeView, ersatzView = _arg.ersatzView, detailsView = _arg.detailsView, accessibleViewsView = _arg.accessibleViewsView, experimentBarModel = _arg.experimentBarModel, $asplodeButton = _arg.$asplodeButton;
      treeView.model.on('active-view-changed', function(viewModel) {});
      treeView.model.on('selected-view-changed', function(viewModel) {
        detailsView.updateModel(viewModel);
        return tabsController.selectViewDetailsTab();
      });
      treeView.model.on('accessible-view-selected', function(viewModel) {
        viewModel.setActive();
        return experimentBarModel.set({
          selector: viewModel.getShelleySelector()
        });
      });
      experimentBarModel.on('flash-clicked', function(model) {
        return frank.sendFlashCommand(model.get('selector'), model.get('selectorEngine'));
      });
      experimentBarModel.on('touch-clicked', function(model) {
        return frank.sendTouchCommand(model.get('selector'), model.get('selectorEngine'));
      });
      $asplodeButton.on('click', function() {
        var isAsploded;
        isAsploded = ersatzView.model.toggleAsploded();
        return $asplodeButton.toggleClass('down', isAsploded);
      });
      boot = function() {
        tabsController.selectLocatorTab();
        return frank.fetchViewHeirarchy().done(function(rawHeir) {
          var accessibleViews;
          treeView.model.resetViewHeir(rawHeir);
          ersatzView.model.resetViews(treeView.model.get('allViews'));
          accessibleViews = treeView.model.getAccessibleViews();
          accessibleViewsView.collection.reset(accessibleViews);
          return ersatzView.render();
        });
      };
      return {
        boot: boot
      };
    };
    return createController;
  });

}).call(this);
