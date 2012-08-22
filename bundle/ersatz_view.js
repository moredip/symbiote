(function() {
  var BACKDROP_FRAME, ISO_MAJOR_OFFSET, ISO_MINOR_OFFSET, ISO_SKEW;

  ISO_SKEW = 15;

  ISO_MAJOR_OFFSET = 50;

  ISO_MINOR_OFFSET = 5;

  BACKDROP_FRAME = {
    x: 0,
    y: 0,
    width: 320,
    height: 480
  };

  define(['transform_stack'], function(transformStack) {
    var drawStaticBackdropAndReturnTransformer;
    drawStaticBackdropAndReturnTransformer = function(paper, iso_skew) {
      var transformer;
      paper.canvas.setAttribute("width", "100%");
      paper.canvas.setAttribute("height", "100%");
      paper.canvas.setAttribute("viewBox", "0 0 380 720");
      transformer = transformStack();
      transformer.skew(0, iso_skew).translate(6, 6);
      paper.rect(0, 0, 360, 708, 40).attr({
        fill: "black",
        stroke: "gray",
        "stroke-width": 4
      }).transform(transformer.desc());
      transformer.push().translate(180, 655);
      paper.circle(0, 0, 34).transform(transformer.desc()).attr("fill", "90-#303030-#101010");
      paper.rect(0, 0, 22, 22, 5).attr({
        stroke: "gray",
        "stroke-width": 2
      }).transform(transformer.push().translate(-11, -11).descAndPop());
      transformer.translate(24, 120).translate(-ISO_MAJOR_OFFSET, 0);
      return transformer;
    };
    return Backbone.View.extend({
      el: $('#ui-locator-view'),
      initialize: function() {
        _.bindAll(this, 'render');
        this.paper = new Raphael(this.el);
        return this.iso_skew = ISO_SKEW;
      },
      render: function() {
        return this.backdropTransformer = drawStaticBackdropAndReturnTransformer(this.paper, this.iso_skew);
      }
    });
  });

}).call(this);
