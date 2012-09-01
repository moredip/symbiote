define ->
  ExperimentBarModel = Backbone.Model.extend
    defaults:
      engines: ['shelley_compat','uiquery']
      selectedEngine: 'shelley_compat'
      selector: ''

    actionClicked: (actionName)->
      @trigger("#{actionName}-clicked",@)

