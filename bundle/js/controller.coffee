define ['frank'],(frank)->

  createController = (treeView,ersatzView,detailsView)->

    treeView.model.on 'active-view-changed', (viewModel)->
      detailsView.updateModel(viewModel)

    boot = ->
      frank.fetchViewHeirarchy().done (rawHeir)->
        treeView.model.resetViewHeir(rawHeir)

        #ersatzView.model = newViewHeir

    {
      boot: boot
    }

  createController
