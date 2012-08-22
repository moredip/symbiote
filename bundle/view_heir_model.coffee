define ['view_model'], (ViewModel)->
  Backbone.Model.extend
    resetViewHeir: (rawRootView)->
      @set( 'root', new ViewModel(rawRootView) )
