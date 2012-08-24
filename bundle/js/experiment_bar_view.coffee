define ['experiment_bar_model','dropdown_control'], (ExperimentBarModel,DropdownControl)->

  ExperimentBarView = Backbone.View.extend
    el: $("#selector-test")

    events:
      "click .action-buttons .drop-indicator": "actionDropDownClicked"
      "click .action-buttons .extra-actions": "actionSelected"
      "click button#flash": 'flashClicked'
      "click button#touch": 'touchClicked'
      "click button#highlight": 'highlightClicked'

    initialize: ->
      @actionDropdownView = new DropdownControl.DropdownView()
      @actionDropdownView.setElement(@$('.action-buttons'))
      @actionDropdownView.collection.reset([
        {name: 'highlight', text:'Highlight'},
        {name: 'bar', text:'Touch In App'},
        {name: 'baz', text:'Flash In App'}
      ])
      @actionDropdownView.collection.at(0).select()

      @engineDropdownView = new DropdownControl.DropdownView()
      @engineDropdownView.setElement(@$('.selector-engine'))
      @engineDropdownView.collection.reset([
        {name: 'shelley_compat', text:'Shelley'},
        {name: 'uiquery', text:'UIQuery'}
      ])
      @engineDropdownView.collection.at(0).select()


      @$extraActionsList = @$('.action-buttons .extra-actions')
      @$selectorInput = @$('input#query')
     
      
      # hackery
      $('body').on 'click', =>
        @$extraActionsList.removeClass('shown')

      @model = new ExperimentBarModel()
      @model.on 'change', _.bind(@update,@)
      @update()

    update: ->
      @$selectorInput.val( @model.get('selector') )

    actionDropDownClicked: (event)->
      event.stopPropagation()
      @$extraActionsList.toggleClass('shown')

    actionSelected: (event)->
      $selectedButton = $(event.target)
      $currentTopButton = @$('.action-buttons > button')

      unless $selectedButton[0] == $currentTopButton[0]

        # shove the button that was just selected into the 'top'
        # action button area
        $currentTopButton.after($selectedButton)
        # push the current top button to the top of the 'extra'
        # action button area. This will also remove it from the 'top' area
        @$extraActionsList.prepend($currentTopButton)


    updateModelFromSelectorInput: ->
      @model.set( 'selector', @$selectorInput.val() )

    flashClicked: ->
      @updateModelFromSelectorInput()
      @model.trigger 'flash-clicked'

    touchClicked: ->
      @updateModelFromSelectorInput()
      @model.trigger 'touch-clicked'

    highlightClicked: ->
      @updateModelFromSelectorInput()
      @model.trigger 'highlight-clicked'
