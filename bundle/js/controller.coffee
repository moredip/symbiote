define ['frank'],(frank)->

  createController = ({
    tabsController,
    treeView,
    ersatzView,
    detailsView,
    accessibleViewsView,
    experimentBarModel,
    $asplodeButton})->

    treeView.model.on 'active-view-changed', (viewModel)->

    treeView.model.on 'selected-view-changed', (viewModel)->
      detailsView.updateModel(viewModel)
      tabsController.selectViewDetailsTab()

    treeView.model.on 'accessible-view-selected', (viewModel)->
      experimentBarModel.set( selector: viewModel.getShelleySelector() )


    experimentBarModel.on 'flash-clicked', ->
      frank.sendFlashCommand( 
        experimentBarModel.get('selector'), 
        experimentBarModel.get('engine')
      )


    $asplodeButton.on 'click', ->
      isAsploded = ersatzView.model.toggleAsploded()
      $asplodeButton.toggleClass( 'down', isAsploded )

    boot = ->
      tabsController.selectLocatorTab()
      frank.fetchViewHeirarchy().done (rawHeir)->
        treeView.model.resetViewHeir(rawHeir)
        ersatzView.model.resetViews(treeView.model.get('allViews'))

        accessibleViews = treeView.model.getAccessibleViews()
        accessibleViewsView.collection.reset( accessibleViews )

        ersatzView.render()

    {
      boot: boot
    }

  createController
