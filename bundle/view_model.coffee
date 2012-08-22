define ->

  ViewModel = Backbone.Model.extend
    defaults:
      parent: undefined

    initialize: (attributes)->
      childModels = for subview in attributes.subviews
        new ViewModel( _.extend( subview, {parent:@} ) )

      @set( rawChildren:attributes.children )
      @set( children: childModels )


  ViewModel
