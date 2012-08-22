define ['experiment_bar_model'], (ExperimentBarModel)->
  ExperimentBarView = Backbone.View.extend
    el: $("#selector-test")

    initialize: ->
      @model = new ExperimentBarModel()
      @model.on 'change', _.bind(@update,@)
      @update()

    update: ->
      @$('input#query').val( @model.get('selector') )
      @

