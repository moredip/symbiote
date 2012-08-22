require ['controller','tree_view','ersatz_view'], (createController,TreeView,ErsatzView)->
  $ ->

    $("#list-tabs").tabs();
    $("#inspect-tabs").tabs();

    treeView = new TreeView()

    ersatzView = new ErsatzView()
    ersatzView.iso_skew = 0
    ersatzView.render()

    controller = createController( treeView, ersatzView )
    controller.boot()


