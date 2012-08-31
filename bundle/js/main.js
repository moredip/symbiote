(function() {

  require(['controller', 'tabs_controller', 'tree_view', 'ersatz_view', 'details_view', 'accessible_views_view', 'experiment_bar_view'], function(createMainController, createTabsController, TreeView, ErsatzView, DetailsView, AccessibleViewsView, ExperimentBarView) {
    return $(function() {
      var accessibleViewsView, detailsView, ersatzView, experimentBarView, mainController, tabsController, treeView;
      treeView = new TreeView();
      ersatzView = new ErsatzView();
      detailsView = new DetailsView();
      accessibleViewsView = new AccessibleViewsView();
      experimentBarView = new ExperimentBarView();
      tabsController = createTabsController($("#list-tabs"), $("#inspect-tabs"));
      mainController = createMainController({
        tabsController: tabsController,
        treeView: treeView,
        ersatzView: ersatzView,
        detailsView: detailsView,
        accessibleViewsView: accessibleViewsView,
        experimentBarModel: experimentBarView.model,
        $asplodeButton: $('#asploder button')
      });
      return mainController.boot();
    });
  });

}).call(this);
