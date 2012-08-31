(function() {
  var baseUrlFor, cacheBust, displayErrorResponse, fetchViewHeirarchy, isErrorResponse, requestSnapshotRefresh, sendMapRequest;

  cacheBust = function(url) {
    return "" + url + "?" + ((new Date()).getTime());
  };

  baseUrlFor = function(path) {
    return window.location.protocol + "//" + window.location.host + "/" + path;
  };

  isErrorResponse = function(response) {
    return 'ERROR' === response.outcome;
  };

  displayErrorResponse = function(response) {
    return alert("Frank isn't happy: " + response.reason + "\ndetails: " + response.details);
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

  sendMapRequest = function(_arg) {
    var command, deferable, engine, methodArgs, methodName, selector;
    selector = _arg.selector, engine = _arg.engine, methodName = _arg.methodName, methodArgs = _arg.methodArgs;
    selector || (selector = 'uiquery');
    methodArgs || (methodArgs = []);
    deferable = new $.Deferred();
    command = {
      query: selector,
      selector_engine: engine,
      operation: {
        method_name: methodName,
        "arguments": methodArgs
      }
    };
    $.ajax({
      type: "POST",
      dataType: "json",
      data: JSON.stringify(command),
      url: baseUrlFor('/map'),
      success: function(data) {
        if (isErrorResponse(data)) {
          displayErrorResponse(data);
          deferable.reject(data);
        }
        return deferable.resolve(data);
      },
      error: function(xhr, status, error) {
        alert("Error while talking to Frank: " + status);
        return deferable.reject(error);
      }
    });
    return deferable.promise();
  };

  define(function() {
    return {
      fetchViewHeirarchy: fetchViewHeirarchy,
      requestSnapshotRefresh: requestSnapshotRefresh,
      baseScreenshotUrl: function() {
        return cacheBust(baseUrlFor('/screenshot'));
      },
      snapshotUrlForViewWithUid: function(uid) {
        return cacheBust(baseUrlFor("/screenshot/view-snapshot/" + uid));
      },
      sendFlashCommand: function(selector, engine) {
        return sendMapRequest({
          selector: selector,
          engine: engine,
          methodName: 'FEX_flash'
        });
      }
    };
  });

}).call(this);
