
var currentNetworkData;
function getUserNetwork() {
    var token = getCookie("user_token");
    var emailid = getCookie("dev_user_id");

    var jdata = {
      "daction": "admin_user_network",
      "emailid" : emailid,
      "token" : token,
      "action" : "developer"};

    ajaxRequest(jdata, function (r) {
      if(r.result == "success") {
        if (r.data.length > 0) {
        	currentNetworkData = r.data;
        	hideLoader();
        	onlyConnectedNetworkList();
          onlyConnectedNetworkOnMap();
        }
        else {
          hideLoader();
        }
      }else {
        hideLoader();
      }
    }, function(request, status, error) {
      hideLoader();
      alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
    });
}


function onlyConnectedNetworkList()
{
		showLoader();
	  var g = new Dracula.Graph();

	  var edata = currentNetworkData;

	  if (edata == null) {
	  	alert("Empty");
	  	hideLoader();
	  	return;
	  }

		edata.forEach(function(element){
				if (  (element[0] != "-" && element[0] != null && element[0] != "null")
							&& (element[1] != "-" && element[1] != null && element[1] != "null")
							&& (element[0] != element[1])  )
              {
            		g.addEdge(element[0], element[1]);
              }
		});

		var layouter = new Dracula.Layout.Spring(g);
		layouter.layout();

		var renderer = new Dracula.Renderer.Raphael('#usernetwork', g, $('#usernetwork').width(), 1024);
		renderer.draw();

		hideLoader();
}


function allNetworkList()
{
		showLoader();
	  var g = new Dracula.Graph();

	  var edata = currentNetworkData;

	  if (edata == null) {
	  	alert("Empty");
	  	hideLoader();
	  	return;
	  }

		edata.forEach(function(element){
			if (element[1] == "-" || element[1] == null || element[1] == "null") {
				g.addEdge(element[0], element[0]);
			}
			else {
    		g.addEdge(element[0], element[1]);
    	}
		});

		var layouter = new Dracula.Layout.Spring(g);
		layouter.layout();

		var renderer = new Dracula.Renderer.Raphael('#usernetwork', g, $('#usernetwork').width(), 1024);
		renderer.draw();

		hideLoader();
}

function generateRandomNumber() {
    var min = -0.2,
        max = 0.2,
        highlightedNumber = Math.random() * (max - min) + min;

    return highlightedNumber;
};

function onlyConnectedNetworkOnMap()
{
		showLoader();

        // San Francisco
    var origin = [-122.414, 37.776];
    // Washington DC
    var destination = [126.8491235, 37.5650168];

    mapboxgl.accessToken = 'pk.eyJ1IjoiZ3VubWFuOTciLCJhIjoiY2lvOWFpdDc5MDMxdnZpbHpocjRmMzI2ZyJ9.lnenicwIbPNDr2k7gbKLbA';
      var map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11'
    });

	  var edata = currentNetworkData;

	  if (edata == null) {
	  	alert("Empty");
	  	hideLoader();
	  	return;
	  }

    map.on('load', function () {
          //
          // map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });

          var nodeList = [];
          var ii = 0;
      		edata.forEach(function(element){
      				if (  (element[0] != "-" && element[0] != null && element[0] != "null")
      							&& (element[1] != "-" && element[1] != null && element[1] != "null")
      							&& (element[0] != element[1])  )
                    {
                            var bFound = false;
                            var featuresArray = [];

                            origin[0] += generateRandomNumber();
                            origin[1] += generateRandomNumber();
                            destination[0] += generateRandomNumber();
                            destination[1] += generateRandomNumber();

                            for(var i=0;i<nodeList.length;i++) {
                              var dn = nodeList[i];
                              if (dn == element[0]) {
                                bFound = true;
                                break;
                              }
                            }

                            if (bFound == false) {
                              nodeList.push(element[0]);
                              featuresArray.push({
                                "type": "Feature",
                                "properties": {
                                      "description": element[0],
                                      "icon": "theatre"
                                    },
                                    "geometry": {
                                    "type": "Point",
                                    "coordinates": origin
                                    }
                              });
                            }

                            bFound = false;
                            for(var i=0;i<nodeList.length;i++) {
                              var dn = nodeList[i];
                              if (dn == element[1]) {
                                bFound = true;
                                break;
                              }
                            }

                            if (bFound == false) {
                              nodeList.push(element[1]);
                              featuresArray.push({
                                "type": "Feature",
                                "properties": {
                                      "description": element[1],
                                      "icon": "theatre"
                                    },
                                    "geometry": {
                                    "type": "Point",
                                    "coordinates": destination
                                    }
                              });
                            }





                            // A simple line from origin to destination.
                            var route = {
                                  "type": "FeatureCollection",
                                  "features": [{
                                      "type": "Feature",
                                      "geometry": {
                                          "type": "LineString",
                                          "coordinates": [
                                            origin,
                                            destination
                                          ]
                                        }
                                  }]
                            };

                            var points =
                                {
                                  "type": "FeatureCollection",
                                  "features": featuresArray
                            };

                            map.addSource('point' + ii, {
                              "type": "geojson",
                              "data": points
                            });

                            map.addLayer({
                                  "id": 'point_' + ii,
                                  "type": "symbol",
                                  "source": 'point' + ii,
                                  "layout": {
                                    "text-field": ["get", "description"],
                                    "text-variable-anchor": ["top", "bottom", "left", "right"],
                                    "text-radial-offset": 0.5,
                                    "text-justify": "auto",
                                    "icon-image": ["concat", ["get", "icon"], "-15"]
                                  }
                            });
                            //
                            // map.addLayer({
                            //   "id": 'point' + ii,
                            //   "source": 'point' + ii,
                            //   "type": "symbol",
                            //   "layout": {
                            //     "icon-image": "airport-15",
                            //     "icon-rotate": ["get", "bearing"],
                            //     "icon-rotation-alignment": "map",
                            //     "icon-allow-overlap": true,
                            //     "icon-ignore-placement": true
                            //   }
                            // });

                            // map.addLayer({
                            //   "id": 'point_' + ii,
                            //   "source": 'point_' + ii,
                            //   "type": "symbol",
                            //   "layout": {
                            //     "icon-image": "airport-15",
                            //     "icon-rotate": ["get", "bearing"],
                            //     "icon-rotation-alignment": "map",
                            //     "icon-allow-overlap": true,
                            //     "icon-ignore-placement": true
                            //   }
                            // });

                            map.addSource('route' + ii, {
                                "type": "geojson",
                                "data": route
                            });

                            map.addLayer({
                                "id": 'route_' + ii,
                                "source": 'route' + ii,
                                "type": "line",
                                "paint": {
                                  "line-width": 2,
                                  "line-color": "#007cbf"
                                }
                            });



                      ii++;
                    }
      		});

    });

		hideLoader();
}

function initAdmin() {
  getUserNetwork();
}



initAdmin();
