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
        var cacheBuster;
        cacheBuster = "?" + ((new Date()).getTime());
        return this.set('baseScreenshotUrl', frank.baseScreenshotUrl() + cacheBuster);
      },
      toggleAsploded: function() {
        var isAsploded;
        isAsploded = !(this.get('isAsploded'));
        this.set('isAsploded', isAsploded);
        return isAsploded;
      }
    });
  });

}).call(this);
