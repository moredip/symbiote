fetchViewHeirarchy = ->
  request = $.ajax
    type: "POST",
    dataType: "json",
    data: '["DUMMY"]', # a bug in cocoahttpserver means it can't handle POSTs without a body
    url: symbiote.baseUrlFor( "/dump" )

requestSnapshotRefresh = ->
  $.ajax
    type: 'GET'
    url: symbiote.baseUrlFor( "/screenshot/snapshot-all-views" )

snapshotUrlForView = (view)->
  symbiote.baseUrlFor( "/screenshot/view-snapshot/#{view.uid}?#{(new Date()).getTime()}" )

createViewLoader = ( ui, tree, controller )->
  onViewHovered = (view)->
    console.log( 'hover', view )
  onViewUnhovered = (view)->
    console.log( 'done', view )

  processView = (view, parent, depth)->
    view.parent = parent
    view.depth = depth

    bean.add view, 'hoverenter', -> onViewHovered(view)
    bean.add view, 'hoverleave', -> onViewUnhovered(view)

    bean.add view, 'selected', ->
      view = this
      controller.displayDetailsFor(view)
      controller.selectViewDetailsTab()

    ui.addViewSnapshot
      src: snapshotUrlForView(view)
      depth: depth
      frame: view.accessibilityFrame
      uid: view.uid

  processViewPlusSubviews = (view, parent, depth)->
    processView(view, parent, depth)
    processViewPlusSubviews(subview,view,depth+1) for subview in view.subviews

  update = ->
    $.when( requestSnapshotRefresh(), fetchViewHeirarchy() ).done (_, viewHeirResponse)->
      viewHeir = viewHeirResponse[0]
      tree.reload(viewHeir)

      ui.resetViewSnapshots()
      processViewPlusSubviews( viewHeir, undefined, 0 )

  {
    update: update
  }


symbiote.createViewLoader = createViewLoader
