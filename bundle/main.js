(function() {

  require(['controller', 'tree_view', 'ersatz_view'], function(createController, TreeView, ErsatzView) {
    return $(function() {
      var controller, ersatzView, treeView;
      $("#list-tabs").tabs();
      $("#inspect-tabs").tabs();
      treeView = new TreeView();
      ersatzView = new ErsatzView();
      ersatzView.iso_skew = 0;
      ersatzView.render();
      controller = createController(treeView, ersatzView);
      return controller.boot();
    });
  });

}).call(this);
