require ['controller','tree_view','ersatz_view','details_view'], (createController,TreeView,ErsatzView,DetailsView)->
  $ ->

    $("#list-tabs").tabs();
    $("#inspect-tabs").tabs();

    treeView = new TreeView()

    ersatzView = new ErsatzView()
    ersatzView.iso_skew = 0
    ersatzView.render()

    detailsView = new DetailsView()

    controller = createController( treeView, ersatzView, detailsView )
    controller.boot()


