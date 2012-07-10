setupDropdowns = ->
  $extra_actions_list = $('.action-buttons .extra-actions')
  $se_option_list = $('ul#selector_engine_options')
  $se_option_input = $('input#selector_engine')

  $('button#selector_engine_dropdown').on 'click', (e)->
    e.stopPropagation()
    $se_option_list.toggleClass('shown')

  $('li', $se_option_list).on 'click', (e)->
    $se_option_input.val( $(e.target).text() )

  $('.action-buttons .drop-indicator').on 'click', (e)->
    e.stopPropagation()
    $extra_actions_list.toggleClass('shown')

  $('body').on 'click', ->
    $extra_actions_list.removeClass('shown')
    $se_option_list.removeClass('shown')

$ -> 
  setupDropdowns()
