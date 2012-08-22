define ['view_heir_model'],(ViewHeirModel)->

  TreeNodeView = Backbone.View.extend
    tagName: 'li'

    title: ->
      viewClass = @model.get('class')
      if label = @model.get('accessibilityLabel')
        "#{viewClass}: #{label}"
      else
        viewClass

    render: ->
      $childList = $("<ul/>")

      for child in @model.get('children')
        childView = new TreeNodeView( model: child )
        $childList.append( childView.render().el )

      @$el.append("<a>#{@title()}</a>").append($childList)
      @




  TreeView = Backbone.View.extend
    el: $('#dom-dump > ul')

    initialize: ->
      @model = new ViewHeirModel()
      @model.on 'change', _.bind(@refresh,@)

    refresh: ->
      @$el.empty()
      rootNodeView = new TreeNodeView(model: @model.get('root'))
      @$el.append( rootNodeView.render().el )
      @$el.treeview( collapsed: false )

