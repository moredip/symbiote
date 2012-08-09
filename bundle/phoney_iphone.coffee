ISO_SKEW = 15
ISO_MAJOR_OFFSET = 50
ISO_MINOR_OFFSET = 5
BACKDROP_FRAME = { x: 0, y: 0, width: 320, height: 480 }
SCREENSHOT_URL = symbiote.baseUrlFor( "screenshot" )

drawStaticBackdropAndReturnTransformer = (paper) ->
  paper.canvas.setAttribute "width", "100%"
  paper.canvas.setAttribute "height", "100%"
  paper.canvas.setAttribute "viewBox", "0 0 380 720"

  transformer = symbiote.transformStack()
  transformer.skew(0, ISO_SKEW).translate( 6, 6 )


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

  transformer.translate(24, 120).translate(-ISO_MAJOR_OFFSET, 0)
  transformer


matrixTransformedForView = (matrix, origin, depth) ->
  matrix.push().translate(origin.x, origin.y).translate(depth * -ISO_MINOR_OFFSET, 0).descAndPop()


cacheBustUrl = (url)->
  "#{url}?#{(new Date()).getTime()}"


createPhoneyPhone = (paper) ->
  backdropTransformer = drawStaticBackdropAndReturnTransformer(paper)
  backdrop = undefined

  refreshBackdrop = ()->
    debugger
    backdrop.remove() if backdrop?
    backdrop = paper.image()
      .transform(backdropTransformer.desc())
      .attr(BACKDROP_FRAME)
      .attr( 'src', cacheBustUrl(SCREENSHOT_URL) )
      .toFront()

  refreshBackdrop()

  addViewSnapshot = ({frame,src,depth,uid}) ->
    {size,origin}=frame

    paper
      .image(src, 0, 0, size.width, size.height)
      .transform( matrixTransformedForView(backdropTransformer, origin, depth) )

  drawHighlightFrame = (frame) ->
    {size,origin}=frame
    paper.rect(0, 0, size.width, size.height).attr(
      fill: "#aaff00"
      opacity: 0.8
      stroke: "black"
    ).transform( backdropTransformer.push().translate(origin.x, origin.y).descAndPop() )

  refreshBackdrop: refreshBackdrop
  drawHighlightFrame: drawHighlightFrame
  addViewSnapshot: addViewSnapshot
  updateBackdrop: updateBackdrop


window.symbiote.createPhoneyPhone = createPhoneyPhone
