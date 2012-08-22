define ['view_model'], (ViewModel)->
  ViewCollection = Backbone.Collection

  flatten = (rootViewModel)->
    flattenedViewModels = [rootViewModel]
    for childViewModel in rootViewModel.get('children')
      flattenedViewModels = flattenedViewModels.concat( flatten(childViewModel) )

    flattenedViewModels



  ViewHeirModel = Backbone.Model.extend
    resetViewHeir: (rawRootView)->
      rootViewModel = new ViewModel(rawRootView) 
      allViews = new ViewCollection( flatten( rootViewModel ) )

      allViews.on 'change:active', (viewModel)=>
        if viewModel.get('active')
          @trigger( 'active-view-changed', viewModel )

      allViews.on 'selected', (selectedViewModel)=>
        allViews.each (viewModel)->
          viewModel.set('selected',viewModel == selectedViewModel)
        @trigger( 'selected-view-changed', selectedViewModel )
      
      @set( 'root', rootViewModel )
      @set( 'allViews', allViews )


  ViewHeirModel
