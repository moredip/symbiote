define ['frank'],(frank)->

  createController = ({
    tabsController,
    treeView,
    ersatzView,
    detailsView,
    accessibleViewsView,
    experimentBarModel})->

    treeView.model.on 'active-view-changed', (viewModel)->

    treeView.model.on 'selected-view-changed', (viewModel)->
      detailsView.updateModel(viewModel)
      tabsController.selectViewDetailsTab()

    treeView.model.on 'accessible-view-selected', (viewModel)->
      experimentBarModel.set( selector: viewModel.getShelleySelector() )

    boot = ->
      frank.fetchViewHeirarchy().done (rawHeir)->
        treeView.model.resetViewHeir(rawHeir)

        accessibleViews = treeView.model.getAccessibleViews()
        accessibleViewsView.collection.reset( accessibleViews )

        #ersatzView.model = newViewHeir

    {
      boot: boot
    }

  createController
