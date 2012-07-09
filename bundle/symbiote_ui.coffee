setupSelectorEngineDropdown = ->
  $option_list = $('ul#selector_engine_options')
  $option_input = $('input#selector_engine')

  $('button#selector_engine_dropdown').on 'click', (e)->
    e.stopPropagation()
    $option_list.toggleClass('shown')

  $('body').on 'click', ->
    $option_list.removeClass('shown')

  $('li', $option_list).on 'click', (e)->
    $option_input.val( $(e.target).text() )

$ -> 
  setupSelectorEngineDropdown()
