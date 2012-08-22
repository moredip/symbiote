define ->

  ViewModel = Backbone.Model.extend
    defaults:
      parent: undefined

    initialize: (attributes)->
      childModels = for subview in attributes.subviews
        new ViewModel( _.extend( subview, {parent:@} ) )

      @set( children: childModels )

    getDesc: ->
      viewClass = @get('class')
      if label = @get('accessibilityLabel')
        "#{viewClass}: #{label}"
      else
        viewClass

    getShelleySelector: ->
      if @has('accessibilityLabel')
        "view:'#{@get('class')}' marked:'#{@get('accessibilityLabel')}'"
      else
        false

  ViewModel
