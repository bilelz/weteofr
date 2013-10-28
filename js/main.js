var isAutocompleted = false;

$(document).ready(function() {
	if(Modernizr.touch){
		document.addEventListener("touchstart", function(){}, true);
	}
	
	if(!Modernizr.csstransforms3d){
		$("html").addClass("html4");
	}
	
	$("#mapshow").click(function(){
		if(Modernizr.csstransforms3d){
			$("#container").addClass("flip");
		}else{
			$("#container").addClass("flip");
		}		
	});
	
	$("#maphide").click(function(){		
		if(Modernizr.csstransforms3d){
			$("#container").removeClass("flip");
		}else{
			$("#container").removeClass("flip");
		}
	});
	
	
	/* search */
    $('form').submit(function() {
        if(!isAutocompleted){
            $("#search").blur();
            getLatlngFromCity($("#search").val());
            log("typed from input search");
        }

        isAutocompleted = false; /* reset boolean value */
        return false;
    });
	
	
	$("#multiCityList").on("click", "a", function (){
        $('#multiCityList').html("").hide();
        getWeatherByLatLng($(this).attr("lat"), $(this).attr("lng"));
        return false;
    });

    $("#multiCityList").on("click",".removeCityList", function (){
        $('#multiCityList').html("").hide();
    });

    $("*[type=reset]").on("click",function (){
        $('#multiCityList').html("").hide();
    });
	
	/* geo localisation */
	
	var userLang = (navigator.language) ? navigator.language : navigator.userLanguage; 
 	$("#ieMsg").addClass(userLang);
	
	$("#geo").click(function(e) {
		$("#geo").removeClass("show");

		info("Géolocalisation en cours ...");
		if(navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
		} else {
			info("Votre navigateur ne prend pas en compte la géolocalisation HTML5");
		}

		function successCallback(position) {
			getWeatherByLatLng(position.coords.latitude, position.coords.longitude);
			info("Géolocalisation réussie :-)");
			infoHide(3000);			
		};

		function errorCallback(error) {
			if(getStorage("lastId") != undefined){
				id = getStorage("lastId");
			}else{		
				id = "2988507" // Paris;
			}			
			getWeatherById(id);
			
			switch(error.code) {
				case error.PERMISSION_DENIED:
					info("L'utilisateur n'a pas autorisé l'accès à sa position");
					break;
				case error.POSITION_UNAVAILABLE:
					info("L'emplacement de l'utilisateur n'a pas pu être déterminé");
					break;
				case error.TIMEOUT:
					info("Le service n'a pas répondu à temps");
					break;
			}			
		};
		
		return false;
	});
	
	/* geo localisation */
	
	/* init */	
	var id = "2988507"; // 2988507 Paris;5128581/New York

	if(document.location.hash != ""  && document.location.hash.length > 2){
		log(document.location.hash);
		document.location.hash = unescape(document.location.hash);
		if(document.location.hash.indexOf("/") != -1){
			var hash = document.location.hash;
			var idx = document.location.hash.indexOf("/");
			id = hash.substring(1, idx);
			id = hash.substring(idx+1, hash.length);
			
		}else{
			id = document.location.hash.slice(1);			
		}
		getWeatherById(id);
	}else if(getStorage("lastId") != undefined){
		id = getStorage("lastId");
		 getWeatherById(id);
	}else{		
		//$("#geo").click(); /* first connexion to weteo.fr */
		getWeatherById(id);
	}
	
	
	log("init id:"+id);
	/* init */
	
		/* autocompletion from google */
	var map;
	var geocoder;
	var input = document.getElementById('search');
	var options = {
	  types: ['(cities)']
	};
	
	autocomplete = new google.maps.places.Autocomplete(input, options);
	
	google.maps.event.addListener(autocomplete, 'place_changed', function() {
		try{
			
			var placeLat = getLatFromStr(autocomplete.getPlace().geometry.location.toString());
			var placeLng = getLngFromStr(autocomplete.getPlace().geometry.location.toString());          
			
			getWeatherByLatLng(placeLat, placeLng);
			log("typed from autocomplete");
			$("#search").blur();
			isAutocompleted = true;
		}catch(e){
			isAutocompleted = false;
			log(e);
			$('form').submit();
		}		  
	});
		
	google.maps.event.addDomListener(input, 'keydown', function(e) {
		if (e.keyCode == 13) {
			if (e.preventDefault) {
				e.preventDefault();
			} else {
				/* nothing */
			}
		}
	});
	
	/* autocompletion from google */
	
	/* parameters */
	
	/* font */
	$("input[name=font]").change(function(){
		var font = $('input[name=font]:checked').val();
		setStorage("font",font);
		$("head").append("<link href='http://fonts.googleapis.com/css?family="+font+"' rel='stylesheet' type='text/css'>");
		
		if(font.indexOf(":") != -1){ /* ex. for "Roboto:100" */
			font = font.substring(0,font.indexOf(":"));
		}
		
		$("body").css("font-family",font);
		
	});
	
	/* https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyDx6yESNHPjUqcO3Xyw4dkWGbr7zLHN72E&sort=popularity 
								  		https://developers.google.com/webfonts/docs/developer_api?hl=fr#Details */
	
	/* end : Font */
	$("input[name=windspeed]").change(function(){				
		$("body").removeClass("mph ms").addClass($('input[name=windspeed]:checked').val());
		setStorage("windspeed",$('input[name=windspeed]:checked').val());
	});
	
	$("input[name=degree]").change(function(){				
		$("body").removeClass("kelvin farh").addClass($('input[name=degree]:checked').val());
		setStorage("degree",$('input[name=degree]:checked').val());
	});
	
	$("input[name=icon]").change(function(){				
		$("body").removeClass("googlenow weather weathercom SVG").addClass($('input[name=icon]:checked').val());
		setStorage("icon",$('input[name=icon]:checked').val());
	});
	
	$("input[name=lang]").change(function(){				
		setStorage("lang",$('input[name=lang]:checked').val());
	});
	
	
	/* init param. from localStorage */
	
	if(getStorage("font") != undefined){		
		$("label[for='"+getStorage("font")+"']").click()
	}
	
	if(getStorage("windspeed") != undefined){		
		$("label[for='"+getStorage("windspeed")+"']").click()
	}
	
	if(getStorage("degree") != undefined){		
		$("label[for='"+getStorage("degree")+"']").click()
	}
	
	if(getStorage("icon") != undefined){		
		$("label[for='"+getStorage("icon")+"']").click()
	}
	
	if(getStorage("lang") != undefined){		
		$("label[for='"+getStorage("lang")+"']").click()
	}
	
	/* end: parameters */
	
	$("#info-close").click(function(){				
		infoHide();
	});
	
	$("#refresh").click(function(){
		getWeatherById(getStorage("lastId"));
	});

	$("#buzz").click(function(){
		animateBox(0);
	});
	
	$("#clearStorage").click(function (){
		if(Modernizr.localstorage){
			localStorage.clear();
		}
	});
	
	$(document).on("click", ".mapclose", function() {
		$('.country').popover('hide');
	});
	
	
});
