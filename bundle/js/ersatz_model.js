(function() {

  define(["frank"], function(frank) {
    var ErsatzModel;
    return ErsatzModel = Backbone.Model.extend({
      initialize: function() {
        return this.refreshBaseScreenshot();
      },
      resetViews: function(views) {
        return this.set('allViews', views);
      },
      refreshBaseScreenshot: function() {
        return this.set('baseScreenshotUrl', frank.baseScreenshotUrl());
      },
      toggleAsploded: function() {
        var isAsploded;
        isAsploded = !(this.get('isAsploded'));
        this.set('isAsploded', isAsploded);
        if (isAsploded) {
          this.updateAsplodedViews();
        }
        return isAsploded;
      },
      updateAsplodedViews: function() {
        var _this = this;
        return frank.requestSnapshotRefresh().done(function() {
          return _this.trigger('snapshots-refreshed', _this);
        });
      }
    });
  });

}).call(this);
