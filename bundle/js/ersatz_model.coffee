define ["frank"], (frank)->

  ErsatzModel = Backbone.Model.extend
    initialize: ->
      @refreshBaseScreenshot()

    resetViews: (views)->
      @set('allViews',views)

    refreshBaseScreenshot: ->
      cacheBuster = "?#{(new Date()).getTime()}"
      @set('baseScreenshotUrl', frank.baseScreenshotUrl()+cacheBuster)

    toggleAsploded: ->
      isAsploded = !(@get('isAsploded'))
      @set('isAsploded',isAsploded)
      isAsploded
