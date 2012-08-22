/*jslint browser: true, white: false, devel: true */
/*global window: true, Raphael: true, $: true, _: true */

var symbiote = {};

symbiote.baseUrlFor = function(path){ return window.location.protocol + "//" + window.location.host + "/" + path; };

symbiote.UiLocator = function(){
  var allViews = [],
      paper = new Raphael( 'ui-locator-view'),
      viewIndicators = [],
      imageViewsByUid = {},
      screenshotUrl = symbiote.baseUrlFor( "screenshot" ),
      backdrop = null,
      erstaz = null,
      ISO_MAJOR_OFFSET = 50,
      ISO_MINOR_OFFSET = 5;

  paper.canvas.setAttribute('preserveAspectRatio','xMidYMin meet');

  function iPadErsatz(raphael){
    var BACKDROP_FRAME = { x: 55, y: 55, width: 768, height: 1024 };

    function drawFakeDevice(backdrop){

      paper.canvas.setAttribute('width','100%');
      paper.canvas.setAttribute('height','100%');
      paper.canvas.setAttribute("viewBox", "0 0 900 1200");
      
      // main outline of device
      paper.rect( 10, 10, 855, 1110, 20 ).attr( {
          'fill': 'black',
          'stroke': 'gray',
          'stroke-width': 6
        });

      // home button
      //paper.circle( 180+6, 655, 34 ).attr( 'fill', '90-#303030-#101010' );

      // square inside home button
      //paper.rect( 180+6, 655, 22, 22, 5 ).attr({  
        //'stroke': 'gray',
        //'stroke-width': 2,
      //}).translate( -11, -11 );

      if( backdrop ){
        // reposition backdrop within frame
        backdrop.attr( BACKDROP_FRAME ).toFront();
      }
    }

    return {
      drawFakeDevice: drawFakeDevice,
      screenOffset: function(){ return BACKDROP_FRAME; }
    };

  }

  function pointIsWithinView(point,view){
    var offsetFromOrigin = {
      x: point.x - view.accessibilityFrame.origin.x,
      y: point.y - view.accessibilityFrame.origin.y
    },
        isInHorz = offsetFromOrigin.x >= 0 && offsetFromOrigin.x <= view.accessibilityFrame.size.width,
        isInVert = offsetFromOrigin.y >= 0 && offsetFromOrigin.y <= view.accessibilityFrame.size.height;
    return isInHorz && isInVert;
  }


  function findViewsAt( point ){
    return _.filter( allViews, function(view){
      return pointIsWithinView(point,view);
    });

  }

  function removeHighlights() {
    _.each( viewIndicators, function(v){ v.remove(); } );
  }

  function highlightAccessibilityFrames( frames ) {
    var screenOffset = erstaz.screenOffset();
   
    removeHighlights();

    viewIndicators = _.map( frames, function(frame){
      return erstaz.drawHighlightFrame(frame);
    });
  }

  function highlightAccessibilityFrame( frame ) {
    highlightAccessibilityFrames( [frame] );
  }

  function eachViewSnapshot( fn ){
    _.each( imageViewsByUid, function(image,uid){
      fn( image );
    });
  }

  function focusView( uid ) {
    var image = imageViewsByUid[uid];
    eachViewSnapshot( function(image){
      image.attr({ 
        opacity: 0.1
      });
    });

    if( image ){
      image.attr({ 
        opacity: 0.9
      });

      window.setTimeout( function(){
        image.attr( 'opacity', 0.1 );
      }, 1000 );
    }
  }

  function resetViewSnapshots(){
    eachViewSnapshot( function(image){
      image.remove();
    });
    imageViewsByUid = {};
  }

  function addViewSnapshot(params){
    var imageView = erstaz.addViewSnapshot( params );
    imageViewsByUid[params.uid] = imageView;
    return imageView;
  }

  function refreshBackdrop(){
    if( erstaz )
      erstaz.refreshBackdrop()
  }

  function updateDeviceFamily(deviceFamily){
    if( !erstaz )
    {
      paper.clear();

      if( deviceFamily === 'ipad' ){
        erstaz = iPadErsatz(paper);
      }else{
        erstaz = symbiote.createPhoneyPhone(paper);
      }
    }
  }

  function updateOrientation(orientation){
    // $(paper.canvas).parent().removeClass('landscape').removeClass('portrait').addClass(orientation);
    $('#ui-locator-view, .the-columns').removeClass('landscape').removeClass('portrait').addClass(orientation);
  }

  function updateViews(views){
    allViews = views;
  }


  return {
    highlightAccessibilityFrame: highlightAccessibilityFrame,
    highlightAccessibilityFrames: highlightAccessibilityFrames,
    addViewSnapshot: addViewSnapshot,
    resetViewSnapshots: resetViewSnapshots,
    focusView: focusView,
    removeHighlights: removeHighlights,
    refreshBackdrop: refreshBackdrop,
    updateViews: updateViews,
    updateDeviceFamily: updateDeviceFamily,
    updateOrientation: updateOrientation
  };
};

symbiote.LiveView = function(updateViewFn,updateHeirarchyFn){
  var viewTimer,heirTimer;

  function stop(){
    window.clearInterval(viewTimer);
    window.clearInterval(heirTimer);
  }

  function start(){
    stop(); // stop any existing timer

    viewTimer = window.setInterval( function(){
      updateViewFn();
    }, 700 );
    heirTimer = window.setInterval( function(){
      updateHeirarchyFn();
    }, 2000 );
  }

  return {
    start: start,
    stop: stop
  };
};


$(document).ready(function() { 

  var $domDetails = $('#dom_detail'),
      $domList = $('div#dom_dump > ul'),
      $domAccessibleDump = $('div#accessible-views'),
      $loading = $(''),
      INTERESTING_PROPERTIES = ['class', 'accessibilityLabel', 'tag', 'alpha', 'isHidden'],
      uiLocator = symbiote.UiLocator(),
      liveView,
      viewTree,
      viewLoader;

	$("#list-tabs").tabs();
	$("#inspect-tabs").tabs();

  function selectViewDetailsTab(){
    $("#inspect-tabs").tabs('select', 0);
  }
  function selectLocatorTab(){
    $("#inspect-tabs").tabs('select', 1);
  }


  function isErrorResponse( response ){
    return 'ERROR' === response.outcome;
  }

  function displayErrorResponse( response ){
    alert( "Frank isn't happy: "+response.reason+"\n" +
        "details: "+response.details );
  }

  function showLoadingUI() {
    $('body').addClass('working');
  }
  symbiote.showLoadingUI = showLoadingUI;

  function hideLoadingUI() {
    $('body').removeClass('working');
  }
  symbiote.hideLoadingUI = hideLoadingUI;


  function displayDetailsFor( view ) {
    console.debug( 'displaying details for:', view );

    var $ul = $('<ul/>');

    function createListItem( propertyName, propertyValue, cssClass ){
      if( propertyName === 'parent' ){
        return;
      }

      if( propertyValue === null ){
        propertyValue = 'null';
      }else if( typeof propertyValue === 'object' ){ 
        propertyValue = JSON.stringify(propertyValue);
      } 

      return $('<li/>').addClass(cssClass)
        .append( 
          $('<div/>').addClass('key').text(propertyName),
          $('<div/>').addClass('value').text(propertyValue) )
        .appendTo( $ul );
    }

    
    _.each( INTERESTING_PROPERTIES, function(propertyName) {
      if( !view.hasOwnProperty(propertyName) ){ return; }

      var propertyValue = view[propertyName];
      $ul.append( createListItem( propertyName, propertyValue, 'interesting' ) );
    });


    _.each( _.keys(view).sort(), function(propertyName) {
      if( propertyName === 'subviews' ){ return; }
      if( _.contains( INTERESTING_PROPERTIES, propertyName ) ){ return; } // don't want to include the interesting properties twice

      var propertyValue = view[propertyName];
      $ul.append( createListItem( propertyName, propertyValue ) );
    });

    $domDetails.empty();
    $ul.appendTo( $domDetails );
  }

  var controller = {
    displayDetailsFor: displayDetailsFor,
    selectViewDetailsTab: selectViewDetailsTab
  }

  viewTree = symbiote.createViewTree( $domList )
  viewLoader = symbiote.createViewLoader( uiLocator, viewTree, controller );

  //function treeElementSelected(){
    //var $this = $(this),
        //selectedView = $this.data('rawView');

    //bean.fire(selectedView,'selected');

    //displayDetailsFor( selectedView );
    //selectViewDetailsTab();

    //$('a',$domList).removeClass('selected');
    //$this.addClass('selected');
  //}

  //function treeElementEntered(){
    //var view = $(this).data('rawView');
    //bean.fire(view,'hoverenter');
    ////uiLocator.highlightAccessibilityFrame( view.accessibilityFrame );
    //uiLocator.focusView( view.uid );
  //}

  //function treeElementLeft(){
    //var view = $(this).data('rawView');
    //bean.fire(view,'hoverleave');
    //uiLocator.removeHighlights();
  //}

  //function listItemTitleFor( rawView ) {
    //var title = ""+rawView['class'];
    //if( rawView.accessibilityLabel ) {
      //return title + ": '"+rawView.accessibilityLabel+"'";
    //}else{
      //return title;
    //}
  //}

  //function transformDumpedViewToListItem( rawView ) {
    //var title = listItemTitleFor( rawView ),
        //viewListItem = $("<li><a>"+title+"</a></li>"),
        //subviewList = $("<ul/>");

    //$('a',viewListItem).data( 'rawView', rawView );

    //_.each( rawView.subviews, function(subview) {
      //subviewList.append( transformDumpedViewToListItem( subview ) );
    //});
    
    //viewListItem.append( subviewList );
    //return viewListItem; 
  //}

  //function updateDumpView( data ) {
    //$domList.children().remove();
    //$domList.append( transformDumpedViewToListItem( data ) );
    //$('a', $domList ).bind( 'click', treeElementSelected );
    //$('a', $domList ).bind( 'mouseenter', treeElementEntered );
    //$('a', $domList ).bind( 'mouseleave', treeElementLeft );
    //$domList.treeview({
                 //collapsed: false
                 //});
  //}

  function flattenViews( rootView ) {

    var flattenedViews = [];

    function collectSubViews( view ) {
      flattenedViews.push( view );
      _.each( view.subviews, function(subview){
        collectSubViews( subview );
      });
    } 

    collectSubViews( rootView, flattenedViews );
    return flattenedViews;
  }

  function filterAccessibleViews( views ) {
    return _.filter( views, function(view){
      return view.accessibilityLabel;
    });
  }

  function selectorForAccessibleView( view ) {
    return _.template( 
        "view:'<%=viewClass%>' marked:'<%=viewLabel%>'", 
        { viewClass: view['class'], viewLabel: view.accessibilityLabel }
        );
  }


  function sendMapRequest( selector, engine, method_name, method_args ) {
    var deferable = new $.Deferred(),
        command = {
          query: selector,
          selector_engine: engine ? engine : 'uiquery' ,
          operation: {
            method_name: method_name, 
            arguments: method_args || []
          }
        };

    showLoadingUI();

    $.ajax({
      type: "POST",
      dataType: "json",
      data: JSON.stringify( command ),
      url: symbiote.baseUrlFor( '/map' ),
      success: function(data) {
        if( isErrorResponse( data ) ) {
          displayErrorResponse( data );
          deferable.reject(data);
        }
        deferable.resolve(data);
      },
      error: function(xhr,status,error) {
        alert( "Error while talking to Frank: " + status );
        deferable.reject(error);
      },
      complete: function(xhr,status) {
        hideLoadingUI();
      }
    });

    return deferable.promise();
  }

  function highlightViewLocations( selector, engine ){
    sendMapRequest( selector, engine, 'accessibilityFrame' ).done( function(data){
      locations = data.results;
      if( locations.length < 1 ){
        alert( 'no views found for that selector' );
        return;
      }

      uiLocator.highlightAccessibilityFrames( locations );
      window.setTimeout( function(){
        uiLocator.removeHighlights();
      }, 1000 );
    });
  }

  function sendFlashCommand( selector, engine ) {
    sendMapRequest(selector,engine,'FEX_flash');
  }

  function sendTouchCommand( selector, engine ) {
    sendMapRequest(selector,engine,'touch');
  }

  function updateAccessibleViews( views ) {
    var accessibleViews = filterAccessibleViews( views ),
        divTemplate = _.template( '<div><a href="#" title="<%=selector%>"><span class="viewClass"><%=viewClass%></span> with label "<span class="viewLabel"><%=viewLabel%></span>"</a></div>' );

    $domAccessibleDump.children().remove();

    _.each( accessibleViews, function( view ) {
      var selector = selectorForAccessibleView(view),
          divHtml = divTemplate({ selector: selector, viewClass: view['class'], viewLabel: view.accessibilityLabel });

      $(divHtml)
        .click( function(){
          $('#query').val( selector );
          sendFlashCommand( selector );
          highlightViewLocations( selector );
          return false;
        })
        .appendTo( $domAccessibleDump );
    });
  }

  function guessAtDeviceFamilyBasedOnViewDump(data){
    var firstChildViewFrame = data.subviews[0].accessibilityFrame;

    console.log( JSON.stringify( firstChildViewFrame ) ) ;
    switch( data.accessibilityFrame.size.height ){
      case 1024:
        return 'ipad';
      case 480:
        return 'iphone';
      default:
        console.warn( "couldn't recognize device family based on screen height of " + data.accessibilityFrame.size.height + "px" );
        return 'unknown';
    }
  }

  function refreshOrientation(){
    $.ajax({
      type: 'GET',
      dataType: 'json',
      url: symbiote.baseUrlFor("/orientation"),
      success: function(data) {
        var orientation = data.orientation;
        
        console.debug( 'device orientation is '+orientation );
        uiLocator.updateOrientation(orientation);
      },
      error: function(xhr,status,error) {
        alert( "Error while talking to Frank: " + status );
      }
    });
  }


  function refreshViewHeirarchy(){
    showLoadingUI();

    viewLoader.update();

    refreshOrientation();

    $.ajax({
      type: "POST",
      dataType: "json",
      data: '["DUMMY"]', // a bug in cocoahttpserver means it can't handle POSTs without a body
      url: symbiote.baseUrlFor( "/dump" ),
      success: function(data) {
        console.debug( 'dump returned', data );

        var deviceFamily = guessAtDeviceFamilyBasedOnViewDump( data ),
            allViews = flattenViews(data);

        console.debug( 'device appears to be an '+deviceFamily );

        updateAccessibleViews( allViews );
        uiLocator.updateDeviceFamily( deviceFamily );
        uiLocator.updateViews( allViews );
      },
      error: function(xhr,status,error) {
        alert( "Error while talking to Frank: " + status );
      },
      complete: function(){
        hideLoadingUI();
      }
    });
  }


	$('#dump_button').click( function(){
    refreshViewHeirarchy();
    uiLocator.refreshBackdrop();
  });

  $('button#flash').click( function(){
      sendFlashCommand( $("input#query").val(), $("input#selector_engine").val() );
  });

  $('button#touch').click( function(){
      sendTouchCommand( $("input#query").val(), $("input#selector_engine").val() );
  });

  $('button#highlight').click( function(){
      highlightViewLocations( $("input#query").val(), $("input#selector_engine").val() );
  });
  
  liveView = symbiote.LiveView( uiLocator.refreshBackdrop, refreshViewHeirarchy );

  $("#live-view button").click( function(){
    $(this).toggleClass('down');
    if( $(this).hasClass('down') ){
      liveView.start();
    }else{
      liveView.stop();
    }
  });

  $("#asploder button").click( function(){

  });

  $('#ui-locator-rotator').click( function(){
    $('#ui-locator-view, .the-columns').toggleClass('landscape');
  });

  //initial UI setup

	// $('#loading').hide();
  
  // do initial DOM dump straight after page has finished loading
  $('#dump_button').click();
  
  // show locator tab by default
  selectLocatorTab();
  
});
