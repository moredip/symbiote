(function() {
  var createViewLoader, fetchViewHeirarchy, requestSnapshotRefresh, snapshotUrlForView;

  fetchViewHeirarchy = function() {
    var request;
    return request = $.ajax({
      type: "POST",
      dataType: "json",
      data: '["DUMMY"]',
      url: symbiote.baseUrlFor("/dump")
    });
  };

  requestSnapshotRefresh = function() {
    return $.ajax({
      type: 'GET',
      url: symbiote.baseUrlFor("/screenshot/snapshot-all-views")
    });
  };

  snapshotUrlForView = function(view) {
    return symbiote.baseUrlFor("/screenshot/view-snapshot/" + view.uid + "?" + ((new Date()).getTime()));
  };

  createViewLoader = function(ui, tree, controller) {
    var onViewHovered, onViewUnhovered, processView, processViewPlusSubviews, update;
    onViewHovered = function(view) {
      return console.log('hover', view);
    };
    onViewUnhovered = function(view) {
      return console.log('done', view);
    };
    processView = function(view, parent, depth) {
      view.parent = parent;
      view.depth = depth;
      bean.add(view, 'hoverenter', function() {
        return onViewHovered(view);
      });
      bean.add(view, 'hoverleave', function() {
        return onViewUnhovered(view);
      });
      bean.add(view, 'selected', function() {
        view = this;
        controller.displayDetailsFor(view);
        return controller.selectViewDetailsTab();
      });
      return ui.addViewSnapshot({
        src: snapshotUrlForView(view),
        depth: depth,
        frame: view.accessibilityFrame,
        uid: view.uid
      });
    };
    processViewPlusSubviews = function(view, parent, depth) {
      var subview, _i, _len, _ref, _results;
      processView(view, parent, depth);
      _ref = view.subviews;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        subview = _ref[_i];
        _results.push(processViewPlusSubviews(subview, view, depth + 1));
      }
      return _results;
    };
    update = function() {
      return $.when(requestSnapshotRefresh(), fetchViewHeirarchy()).done(function(_, viewHeirResponse) {
        var viewHeir;
        viewHeir = viewHeirResponse[0];
        tree.reload(viewHeir);
        ui.resetViewSnapshots();
        return processViewPlusSubviews(viewHeir, void 0, 0);
      });
    };
    return {
      update: update
    };
  };

  symbiote.createViewLoader = createViewLoader;

}).call(this);
