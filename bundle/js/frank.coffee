cacheBust = (url)-> "#{url}?#{(new Date()).getTime()}"

baseUrlFor = (path)->
  window.location.protocol + "//" + window.location.host + "/" + path

isErrorResponse = (response)-> 'ERROR' == response.outcome

displayErrorResponse = (response)->
  alert(
    """Frank isn't happy: #{response.reason}
    details: #{response.details}""")

fetchViewHeirarchy = ->
  request = $.ajax
    type: "POST",
    dataType: "json",
    url: baseUrlFor( "/dump" )

requestSnapshotRefresh = ->
  $.ajax
    type: 'GET'
    url: baseUrlFor( "/screenshot/snapshot-all-views" )


sendMapRequest = ({selector, engine, methodName, methodArgs} )->
  selector ||= 'uiquery'
  methodArgs ||= []

  deferable = new $.Deferred()
  command = {
    query: selector
    selector_engine: engine
    operation: {
      method_name: methodName, 
      arguments: methodArgs
    }
  }

  $.ajax({
    type: "POST"
    dataType: "json"
    data: JSON.stringify( command )
    url: baseUrlFor( '/map' )
    success: (data)->
      if isErrorResponse( data )
        displayErrorResponse( data )
        deferable.reject(data)
      deferable.resolve(data)
    error: (xhr,status,error)->
      alert( "Error while talking to Frank: #{status}" )
      deferable.reject(error)
  })
  deferable.promise()



define ->
  fetchViewHeirarchy: fetchViewHeirarchy
  requestSnapshotRefresh: requestSnapshotRefresh
  baseScreenshotUrl: -> 
    cacheBust( baseUrlFor('/screenshot') )
  snapshotUrlForViewWithUid: (uid)-> 
    cacheBust( baseUrlFor( "/screenshot/view-snapshot/#{uid}" ) )
  sendFlashCommand: (selector,engine)-> 
    sendMapRequest( 
      selector:selector, 
      engine: engine, 
      methodName: 'FEX_flash'
    )
