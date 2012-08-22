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
      allViews = new ViewCollection( flatten( rootViewModel ) )

      allViews.on 'change:active', (viewModel)->
        if viewModel.get('active')
          console.log( viewModel.getDesc(), 'is hot' )
      
      @set( 'root', rootViewModel )
      @set( 'allViews', allViews )
