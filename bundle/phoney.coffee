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

createViewLoader = ( ui )->

  processView = (view, depth)->
    view.depth = depth;
    ui.addViewSnapshot
      src: snapshotUrlForView(view)
      depth: depth
      frame: view.accessibilityFrame
      uid: view.uid

  processViewPlusSubviews = (view, depth)->
    processView(view, depth)
    processViewPlusSubviews(subview,depth+1) for subview in view.subviews

  update = ->
    $.when( requestSnapshotRefresh(), fetchViewHeirarchy() ).done (_, viewHeirResponse)->
      viewHeir = viewHeirResponse[0]
      ui.resetViewSnapshots()
      processViewPlusSubviews( viewHeir, 0 )

  {
    update: update
  }


symbiote.createViewLoader = createViewLoader
