(function() {
  var guessAtDeviceFamilyBasedOnViewDump;

  guessAtDeviceFamilyBasedOnViewDump = function(viewHeir) {
    switch (viewHeir.accessibilityFrame.size.height) {
      case 1024:
        return 'ipad';
      case 480:
        return 'iphone';
      default:
        console.warn("couldn't recognize device family based on screen height of " + data.accessibilityFrame.size.height + "px");
        return 'unknown';
    }
  };

  define(['frank'], function(frank) {
    var createController;
    createController = function(_arg) {
      var $asplodeButton, accessibleViewsView, boot, detailsView, ersatzView, experimentBarModel, reportActionOutcome, tabsController, toastController, treeView;
      tabsController = _arg.tabsController, toastController = _arg.toastController, treeView = _arg.treeView, ersatzView = _arg.ersatzView, detailsView = _arg.detailsView, accessibleViewsView = _arg.accessibleViewsView, experimentBarModel = _arg.experimentBarModel, $asplodeButton = _arg.$asplodeButton;
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
      reportActionOutcome = function(action, numViews) {
        var message;
        message = (function() {
          switch (numViews) {
            case 0:
              return "Sorry, no views matched that selector so none were " + action;
            case 1:
              return "1 view was " + action;
            default:
              return "" + numViews + " views were " + action;
          }
        })();
        return toastController.showToastMessage(message);
      };
      experimentBarModel.on('flash-clicked', function(model) {
        return frank.sendFlashCommand(model.get('selector'), model.get('selectorEngine')).done(function(data) {
          return reportActionOutcome("flashed", data.length);
        });
      });
      experimentBarModel.on('touch-clicked', function(model) {
        var views;
        return views = frank.sendTouchCommand(model.get('selector'), model.get('selectorEngine')).done(function(data) {
          return reportActionOutcome("touched", data.length);
        });
      });
      $asplodeButton.on('click', function() {
        var isAsploded;
        isAsploded = ersatzView.model.toggleAsploded();
        return $asplodeButton.toggleClass('down', isAsploded);
      });
      boot = function() {
        tabsController.selectLocatorTab();
        return frank.fetchViewHeirarchy().done(function(rawHeir) {
          var accessibleViews, deviceFamily;
          deviceFamily = guessAtDeviceFamilyBasedOnViewDump(rawHeir);
          treeView.model.resetViewHeir(rawHeir);
          ersatzView.model.resetViews(treeView.model.get('allViews'), deviceFamily);
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
