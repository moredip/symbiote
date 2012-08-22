require ['controller','tabs_controller','tree_view','ersatz_view','details_view', 'accessible_views_view'], (createMainController,createTabsController,TreeView,ErsatzView,DetailsView,AccessibleViewsView)->
  $ ->

    $("#list-tabs").tabs();
    $("#inspect-tabs").tabs();

    treeView = new TreeView()

    ersatzView = new ErsatzView()
    ersatzView.iso_skew = 0
    ersatzView.render()

    detailsView = new DetailsView()
    accessibleViewsView = new AccessibleViewsView()

    tabsController = createTabsController( $("#list-tabs"), $("#inspect-tabs") );

    mainController = createMainController( 
      treeView: treeView
      ersatzView: ersatzView
      detailsView: detailsView
      accessibleViewsView: accessibleViewsView
      tabsController: tabsController
    )
    mainController.boot()


