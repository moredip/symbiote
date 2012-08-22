(function() {

  define(['experiment_bar_model'], function(ExperimentBarModel) {
    var ExperimentBarView;
    return ExperimentBarView = Backbone.View.extend({
      el: $("#selector-test"),
      initialize: function() {
        this.model = new ExperimentBarModel();
        this.model.on('change', _.bind(this.update, this));
        return this.update();
      },
      update: function() {
        this.$('input#query').val(this.model.get('selector'));
        return this;
      }
    });
  });

}).call(this);
