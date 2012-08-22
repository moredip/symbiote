define ['frank'],(frank)->

  createController = ({
    treeView,
    ersatzView,
    detailsView,
    accessibleViewsView,
    tabsController})->

    treeView.model.on 'active-view-changed', (viewModel)->

    treeView.model.on 'selected-view-changed', (viewModel)->
      detailsView.updateModel(viewModel)
      tabsController.selectViewDetailsTab()

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
