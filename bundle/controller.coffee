define ['frank','view_heir_model'],(frank,ViewHeirModel)->

  createController = (treeView,ersatzView)->
    boot = ->
      frank.fetchViewHeirarchy().done (rawHeir)->
        treeView.model.resetViewHeir(rawHeir)
        #ersatzView.model = newViewHeir

    {
      boot: boot
    }

  createController
