define ['frank'],(frank)->


  createController = ({
    tabsController,
    toastController,
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
      viewModel.setActive()
      experimentBarModel.set( selector: viewModel.getShelleySelector() )


    reportActionOutcome = (action,numViews)->
      message = switch numViews
        when 0 then "Sorry, no views matched that selector so none were #{action}"
        when 1 then "1 view was #{action}"
        else "#{numViews} views were #{action}"
      toastController.showToastMessage(message)

    experimentBarModel.on 'flash-clicked', (model)->
      frank.sendFlashCommand( 
        model.get('selector'), 
        model.get('selectorEngine')
      ).done (data)->
        reportActionOutcome( "flashed", data.length )

    experimentBarModel.on 'touch-clicked', (model)->
      views = frank.sendTouchCommand( 
        model.get('selector'), 
        model.get('selectorEngine')
      ).done (data)->
        reportActionOutcome( "touched", data.length )


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
