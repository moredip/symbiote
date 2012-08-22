define ['view_model'], (ViewModel)->
  ViewCollection = Backbone.Collection

  flatten = (rootViewModel)->
    flattenedViewModels = [rootViewModel]
    for childViewModel in rootViewModel.get('children')
      flattenedViewModels = flattenedViewModels.concat( flatten(childViewModel) )

    flattenedViewModels



  Backbone.Model.extend
    resetViewHeir: (rawRootView)->
      rootViewModel = new ViewModel(rawRootView) 
      allViewModels = flatten( rootViewModel )
      
      @set( 'root', rootViewModel )
      @set( 'allViews', new ViewCollection(allViewModels) )
