listItemTitleFor = (rawView)->
  title = ""+rawView['class']
  if rawView.accessibilityLabel
    "#{title}: '#{rawView.accessibilityLabel}'"
  else
    title

transformDumpedViewToListItem = (rawView)->
  title = listItemTitleFor( rawView )
  viewListItem = $("<li><a>#{title}</a></li>")
  subviewList = $("<ul/>")

  $('a',viewListItem).data( 'rawView', rawView )
  
  for subview in rawView.subviews
    subviewList.append( transformDumpedViewToListItem( subview ) )
    
  viewListItem.append( subviewList )
  viewListItem

createViewTree = ($container)->
  $container.on 'click', 'a', ->
    $this = $(this)
    selectedView = $this.data('rawView')

    bean.fire(selectedView,'selected')

    $('a',$container).removeClass('selected')
    $this.addClass('selected')

  $container.on 'mouseenter', 'a', ->
    view = $(this).data('rawView')
    bean.fire(view,'hoverenter')

  $container.on 'mouseleave', 'a', ->
    view = $(this).data('rawView')
    bean.fire(view,'hoverleave')


  reload = (rootView)->
    $container.children().remove()
    $container.append( transformDumpedViewToListItem(rootView) )
    $container.treeview({
                 collapsed: false
                 });

  {
    reload:reload    
  }

symbiote.createViewTree = createViewTree
