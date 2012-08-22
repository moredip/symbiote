baseUrlFor = (path)->
  window.location.protocol + "//" + window.location.host + "/" + path

fetchViewHeirarchy = ->
  request = $.ajax
    type: "POST",
    dataType: "json",
    url: baseUrlFor( "/dump" )

requestSnapshotRefresh = ->
  $.ajax
    type: 'GET'
    url: baseUrlFor( "/screenshot/snapshot-all-views" )

define ->
  fetchViewHeirarchy: fetchViewHeirarchy
  requestSnapshotRefresh: requestSnapshotRefresh
