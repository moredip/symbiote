(function() {

  require(['controller', 'tree_view', 'ersatz_view', 'details_view'], function(createController, TreeView, ErsatzView, DetailsView) {
    return $(function() {
      var controller, detailsView, ersatzView, treeView;
      $("#list-tabs").tabs();
      $("#inspect-tabs").tabs();
      treeView = new TreeView();
      ersatzView = new ErsatzView();
      ersatzView.iso_skew = 0;
      ersatzView.render();
      detailsView = new DetailsView();
      controller = createController(treeView, ersatzView, detailsView);
      return controller.boot();
    });
  });

}).call(this);
