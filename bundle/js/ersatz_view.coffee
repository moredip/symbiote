ISO_SKEW = 25
ISO_MAJOR_OFFSET = 50
ISO_MINOR_OFFSET = 5
BACKDROP_FRAME = { x: 0, y: 0, width: 320, height: 480 }
#SCREENSHOT_URL = symbiote.baseUrlFor( "screenshot" )

define ['transform_stack','ersatz_model'], (transformStack,ErsatzModel)->

  drawStaticBackdropAndReturnTransformer = (paper,iso_skew) ->
    paper.clear()
    paper.canvas.setAttribute "width", "100%"
    paper.canvas.setAttribute "height", "100%"
    paper.canvas.setAttribute "viewBox", "0 0 380 720"

    transformer = transformStack()
    transformer.skew(0, iso_skew).translate( 6, 6 )


    # main outline of device
    paper.rect(0, 0, 360, 708, 40).attr(
      fill: "black"
      stroke: "gray"
      "stroke-width": 4
    ).transform transformer.desc()

    # home button
    transformer.push().translate( 180, 655 )
    paper.circle(0, 0, 34).transform(transformer.desc()).attr( "fill", "90-#303030-#101010" )
   
    # square inside home button
    paper.rect(0, 0, 22, 22, 5).attr(
      stroke: "gray"
      "stroke-width": 2
    ).transform transformer.push().translate(-11, -11).descAndPop()

    transformer.translate(20, 120)
    if( iso_skew > 0 )
      transformer.translate(-ISO_MAJOR_OFFSET, 0)
    transformer


  transformFromBaseForViewModel = (baseTransformer,viewModel,withSkew=false)->
    {origin:{x,y}} = viewModel.get('accessibilityFrame')
    baseTransformer.push().translate(x,y)
    if( withSkew )
      baseTransformer.translate(viewModel.get('depth')*-ISO_MINOR_OFFSET, 0)
    baseTransformer.descAndPop()

  ErsatzViewSnapshotView = Backbone.View.extend
    initialize:->
      @model.on('change:active',_.bind(@updateOpacity,@))
      @render()

    render: ->
      frame = @model.get('accessibilityFrame')
      @el
        .attr
          transform: transformFromBaseForViewModel( @options.baseTransformer, @model,true )
          src: @model.getSnapshotUrl()
          x: 0
          y: 0
          width: frame.size.width
          height: frame.size.height
      @updateOpacity()
      @el

     updateOpacity: ->
       opacity = ( if @model.get('active') then 1.0 else 0.05 )
       @el.attr('opacity',opacity)


  ErsatzView = Backbone.View.extend
    el: $('#ui-locator-view')

    initialize: ->
      _.bindAll( @, 'render' )
      @model = new ErsatzModel()
      @paper = new Raphael(@.el)
      @model.on 'change:baseScreenshotUrl', _.bind(@refreshBaseScreenshot,@)
      @model.on 'change:isAsploded', _.bind(@render,@)
      @model.on 'snapshots-refreshed', _.bind(@refreshSnapshots,@)
      @model.on 'change:allViews', =>
        @model.get('allViews').on 'change:active', (subject,isActive)=>
          if isActive
            @highlight.show()
            @updateHighlight(subject)
          else
            @highlight.hide()

    render: ->
      iso_skew = (if @model.get('isAsploded') then ISO_SKEW else 0)
      console.log('skew:',iso_skew)
      @backdropTransformer = drawStaticBackdropAndReturnTransformer(@paper,iso_skew)
      @backdrop = @paper.image()
      @refreshBaseScreenshot()
      if @model.get('isAsploded')
        @backdrop.attr('opacity',0.5)
        @refreshSnapshots()

      @highlight = @paper.rect().attr(
        fill: "#aaff00"
        opacity: 0.8
        stroke: "black"
      )

      @el

    refreshBaseScreenshot: ->
      newScreenshotUrl = @model.get('baseScreenshotUrl')
      return unless newScreenshotUrl?

      @backdrop
        .transform(@backdropTransformer.desc())
        .attr(BACKDROP_FRAME)
        .attr( 'src', newScreenshotUrl )
        .toFront()

    refreshSnapshots: ->
      @model.get('allViews').each (viewModel) =>
        snapshotView = new ErsatzViewSnapshotView(
          model: viewModel
          baseTransformer: @backdropTransformer
          el: @paper.image()
        )

     updateHighlight: (viewModel)->
       if @model.get('isAsploded')
         @highlight.hide()
         return
       else
         @highlight.show()

       frame = viewModel.get('accessibilityFrame')
       @highlight.attr(
          transform: transformFromBaseForViewModel(@backdropTransformer,viewModel, false )
          x: 0
          y: 0
          width: frame.size.width
          height: frame.size.height
       ).toFront()


        #ErsatzView.
        #frame = view.get('accessibilityFrame')
        #transformation = @backdropTransformer
          #.push()
          #.translate(frame.origin.x, frame.origin.y)
          #.translate(view.get('depth')*-ISO_MINOR_OFFSET, 0)
          #.descAndPop()

        #@paper
         #.image( view.getSnapshotUrl(), 0, 0, frame.size.width, frame.size.height )
         #.transform(transformation)
