/* extract lat from "(48.959204, 2.540805999999975)" */



function getLatFromStr(geo) {
	return geo.split(",")[0].replace(/\(/, "");
}

/* extract lng from "(48.959204, 2.540805999999975)" */
function getLngFromStr(geo) {
	return geo.split(",")[1].replace(/\)/, "").replace(/ /, "");
}

function getLatlngFromCity(_city){
    getLatlngFromCityGoogle(_city);
}

function infoGeo(_msg){
    $("#multiCityList").text(_msg).show();
}

function infoGeoHide(){
    $("#multiCityList").hide();
}

function multiCityScreenPosition(){
    /* width form#search*/
    var multiWidth = parseInt($("form").width(),10)
        + parseInt($("form").css("padding-right"),10)      + parseInt($("form").css("padding-left"),10)
        + parseInt($("form").css("margin-right"),10)       + parseInt($("form").css("margin-left"),10)
        + parseInt($("form").css("border-right-width"),10) + parseInt($("form").css("border-left-width"),10)
        - parseInt($("#multiCityList").css("padding-right"),10)      - parseInt($("#multiCityList").css("padding-left"),10)
        - parseInt($("#multiCityList").css("margin-right"),10)       - parseInt($("#multiCityList").css("margin-left"),10)
        - parseInt($("#multiCityList").css("border-right-width"),10) - parseInt($("#multiCityList").css("border-left-width"),10);

    $("#multiCityList").css("width",multiWidth);

    /* top */
    var multiTop = $("form").position(top).top + parseInt($("form").css("height"),10)
        + parseInt($("form").css("padding-top"),10)+ parseInt($("form").css("padding-bottom"),10)
        + parseInt($("form").css("margin-top"),10)+ parseInt($("form").css("margin-bottom"),10);

    $("#multiCityList").css("top",multiTop);

    /* left */
    $("#multiCityList").css("left",$("form").position().left);

}

function getLatlngFromCityOSM(_city) {
	/*console.log("getLatlngFromCityOSM");*/
		
	var latlngO = [] , data, tmpl = $("#multiCityTmpl").html(), html = "";
	
	$('#multiCityList').html("").hide();
	
	/* lectured du cache */
	if(getStorage(_city) != undefined){


        info("Recherche en cours ... (cache)");
		
		/*console.log("get data from local storage!");*/
		
		latlngO = JSON.parse(getStorage(_city));
		
		log("getStorage("+_city+")");
		
		//getWeatherByLatLng(latlngO.lat, latlngO.lng);
		
		log("Trouvé/find: "+latlngO.address + " localStorage");

        infoHide();
        getWeatherByLatLng(latlngO.lat, latlngO.lng);

		return false;
	}else if(getStorage(_city+":list") != undefined){

        info("Recherche en cours ... (cache)");
		
		data = JSON.parse(getStorage(_city+":list")); /* lectured du cache */
	
		var cityArray = {cityItem: []};
	
		$.each(data, function(i, item) {
			var latlngO = new Object();
			latlngO = {
				"lat" : item.lat,
				"lng" : item.lon,
				"address" : item.display_name
			};

			log("storage:"+_city+":list");
			log("lat:"+latlngO.lat+" lng:"+latlngO.lng);					
			log("city: "+latlngO.address);
			
			cityArray.cityItem.push(latlngO);

		});
		
		html = Mustache.render(tmpl, cityArray);
		$('#multiCityList').html("").append(html).show();
      //  multiCityScreenPosition();
		infoHide();
		
		log("Plusieurs villes trouvées/ Several cities found (localStorage)");
		return false;
		
	}
	
	
	try {

        info("Recherche en cours ... (openstreetmap)");

		/* via Open Street Map*/
		$.getJSON('http://open.mapquestapi.com/nominatim/v1/search/?q=' + _city + '&format=json&json_callback=?', function(data) {
			
			log("Searching city information from OpenStreetMap...");
			
			if(data.length == 0){
				info("Aucune ville trouvée pour \"" + _city +"\".)");
			} else if(data.length == 1) {
				
						
					
					latlngO = {
						"lat" : data[0].lat,
						"lng" : data[0].lon,
						"address" : data[0].display_name
					};	
					setStorage(_city, JSON.stringify(latlngO)); /* mise en cache, ville saisie */
					setStorage(latlngO.address, JSON.stringify(latlngO)); /* mise en cache, nom de ville officiel */
					setStorage(escape(latlngO.address).replace(/_/g," "), JSON.stringify(latlngO)); /* mise en cache, nom de ville officiel "normalisé"*/
					


					
					
					log("getjson:"+_city);					
					log("lat:"+latlngO.lat+" lng:"+latlngO.lng);					
					log("city: "+latlngO.address);
					
					log("Trouvé/find: "+latlngO.address);

                    infoHide();
                    getWeatherByLatLng(latlngO.lat, latlngO.lng);

										
			} else {
	
				setStorage(_city+":list", JSON.stringify(data)); /* mise en cache */

				var cityArray = {cityItem: []};
				$.each(data, function(i, item) {

					latlngO = {
						"lat" : item.lat,
						"lng" : item.lon,
						"address" : item.display_name
					};
					
					log("getJson:"+_city+":list");
					log("lat:"+latlngO.lat+" lng:"+latlngO.lng);					
					log("city: "+latlngO.address);

					cityArray.cityItem.push(latlngO);
					
					setStorage(latlngO.address, JSON.stringify(latlngO)); /* mise en cache, nom de ville officiel */
					setStorage(escape(latlngO.address).replace(/_/g," "), JSON.stringify(latlngO)); /* mise en cache, nom de ville officiel "normalisé"*/
				});

				html = Mustache.render(tmpl, cityArray);
				$('#multiCityList').html("").append(html).show();
                //multiCityScreenPosition();
				//log(html);
				infoHide();
				
				log("Plusieurs villes trouvées/ Several cities found");				
			}
			
			
		}).success(function(e) {
			/*info("second success");*/
		}).error(function(e) {
			log("error");
		}).complete(function(e) {
			/*info("complete");*/
		});

	} catch(err) {
		return err;
	}
}


function getLatlngFromCityGoogle(_city) {

    info("Recherche en cours ... (ggl search)");

    /*console.log("getLatlngFromCityGoogle");*/

    var latlngO = [], tmpl = $("#multiCityTmpl").html(), html = "";
    //if(typeof(geocoder) == undefined) {
        var geocoder = new google.maps.Geocoder();
    //}

    geocoder.geocode({
        'address' : _city
    }, function(results, status) {
        if(status == google.maps.GeocoderStatus.OK) {
            if(results.length == 1) {

                latlngO = {
                    "lat" : getLatFromStr(results[0].geometry.location.toString()),
                    "lng" : getLngFromStr(results[0].geometry.location.toString()),
                    "address" : results[0].formatted_address
                };


                $("#multicity").html("").hide();

                infoHide();
                getWeatherByLatLng(latlngO.lat, latlngO.lng);

            } else {/* more than one result */

                var cityArray = {cityItem: []};
                $.each(results, function(key, val) {

                    latlngO= {
                        "lat" : getLatFromStr(val.geometry.location.toString()),
                        "lng" : getLngFromStr(val.geometry.location.toString()),
                        "address" : val.formatted_address
                    };
                    cityArray.cityItem.push(latlngO);


                });

                html = Mustache.render(tmpl, cityArray);
                $('#multiCityList').html("").append(html).show();
                infoHide();
                //multiCityScreenPosition();

            }
            /*console.log(latlngO.length);*/
            return latlngO;
        }else{
            info("Aucune ville trouvée pour \"" + _city +"\". (" + status +")"); /* "Geocode was not successful for the following reason: " + status*/
        }

    });

}

function getCityFromCoord(lat, lng) {
	var latlng = new google.maps.LatLng(lat, lng);

	// if(geocoder == null) {
		// geocoder = new google.maps.Geocoder();
	// }

var geocoder = new google.maps.Geocoder();
	geocoder.geocode({
		'latLng' : latlng
	}, function(results, status) {
		if(status == google.maps.GeocoderStatus.OK) {
			if(results[1]) {
				infoHide();
				//updateMap(results[0].formatted_address, lat, lng);
				getWeatherByLatLng(lat, lng);
				
			} else {
				info("Aucune nom de ville trouvé.");
				//updateMap(lat+","+lng, lat, lng);

				/* No results found*/
			}
		} else {
			info("Aucune nom de ville trouvé. (" + status + ")");
			//updateMap(lat+","+lng, lat, lng);
			/* "Geocoder failed due to: " + status*/
		}
	});
}

function degreeToText(h) {
	var t;
	if (typeof h !== "number") {
		t = ''; 
	} else if (h >= 337.5 || (h >= 0 &&  h <= 22.5)) {
		t =  'N'; 
	} else if (h >= 22.5 && h <= 67.5) {
		t =  'NE'; 
	} else if (h >= 67.5 && h <= 112.5) {
		t =  'E'; 
	} else if (h >= 112.5 && h <= 157.5) {
		t =  'SE'; 
	} else if (h >= 157.5 && h <= 202.5) {
		t =  'S'; 
	} else if (h >= 202.5 && h <= 247.5) {
		t =  'SW'; 
	} else if (h >= 247.5 && h <= 292.5) {
		t =  'W'; 
	} else if (h >= 292.5 && h <= 337.5) {
		t =  'NW'; 
	} else {
		t =  t;
	}
	return t;
}