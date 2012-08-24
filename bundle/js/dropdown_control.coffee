define ->

  DropdownModel = Backbone.Model.extend
    select: ->
      console.log( "selecting", @.get('name') )
      @collection.each (model) =>
        model.set( 'selected', model == @ )

  DropdownCollection = Backbone.Collection.extend
    model: DropdownModel

  DropdownView = Backbone.View.extend
    tagName: 'div'
    className: 'dropdown'

    events:
      "click .drop-indicator": 'clickedDrop'
      "click .button": 'clickedItem'

    initialize: ->
      @collection = new DropdownCollection()
      @collection.on 'all', _.bind(@render,@)
      
      # hackery :(
      $('body').on 'click', _.bind(@clickedOutsideDropdown,@)

    selectedModel: ->
      selected = @collection.find (m)-> m.get('selected')
      selected || @collection.at(0)
    unselectedModels: ->
      _(@collection.reject (m)-> m.get('selected'))

    createButtonForl: (model)->
      $("""<button>#{model.get('text')}</button>""")
        .on 'click', => @clickedItem(model)

    render: ->
      console.log( 'rendering' )
      @$el
        .empty()
        .append( @createButtonForl(@selectedModel()) )
        .append( $ul = $("<ul>") )

      @unselectedModels().each (model)=>
        $ul.append( @createButtonForl(model) )

      @$el.append( """<div class="drop-indicator">v</div>""" )

    clickedDrop: (e)->
      e.stopPropagation() #prevent clickedOutsideDropdown from firing
      @$('ul').toggleClass('shown')

    clickedOutsideDropdown: ->
      @$('ul').removeClass('shown')

    clickedItem: (model)->
      model.select()




  {
    DropdownModel : DropdownModel
    DropdownView  : DropdownView
  }
