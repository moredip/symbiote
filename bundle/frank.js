(function() {
  var baseUrlFor, fetchViewHeirarchy, requestSnapshotRefresh;

  baseUrlFor = function(path) {
    return window.location.protocol + "//" + window.location.host + "/" + path;
  };

  fetchViewHeirarchy = function() {
    var request;
    return request = $.ajax({
      type: "POST",
      dataType: "json",
      url: baseUrlFor("/dump")
    });
  };

  requestSnapshotRefresh = function() {
    return $.ajax({
      type: 'GET',
      url: baseUrlFor("/screenshot/snapshot-all-views")
    });
  };

  define(function() {
    return {
      fetchViewHeirarchy: fetchViewHeirarchy,
      requestSnapshotRefresh: requestSnapshotRefresh
    };
  });

}).call(this);
