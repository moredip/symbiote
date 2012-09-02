define ["frank"], (frank)->

  ErsatzModel = Backbone.Model.extend
    initialize: ->
      @refreshBaseScreenshot()

    resetViews: (views,deviceFamily,orientation)->
      @set('allViews',views)
      @set('deviceFamily',deviceFamily)
      @set('orientation',orientation)

    refreshBaseScreenshot: ->
      @set('baseScreenshotUrl',frank.baseScreenshotUrl())

    toggleAsploded: ->
      isAsploded = !(@get('isAsploded'))
      @set('isAsploded',isAsploded)
      if isAsploded
        @updateAsplodedViews()

      isAsploded

    updateAsplodedViews: ()->
      frank.requestSnapshotRefresh().done =>
        @trigger('snapshots-refreshed',@)
      
