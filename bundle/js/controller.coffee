define ['frank'],(frank)->

  createController = ({treeView,ersatzView,detailsView,tabsController})->

    treeView.model.on 'active-view-changed', (viewModel)->

    treeView.model.on 'selected-view-changed', (viewModel)->
      detailsView.updateModel(viewModel)
      tabsController.selectViewDetailsTab()

    boot = ->
      frank.fetchViewHeirarchy().done (rawHeir)->
        treeView.model.resetViewHeir(rawHeir)

        #ersatzView.model = newViewHeir

    {
      boot: boot
    }

  createController
