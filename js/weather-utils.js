// todo : cache
function getWeatherByCityName(city){
	$("#searchicon").addClass("loading");
	$.ajax({
		url : "http://openweathermap.org/data/2.1/find/city?lat="+lat+"&lon="+lng+"&cnt=1",
		dataType : "jsonp",
		success : function(data) {
				var id = data.list[0].id;
				getWeatherById(id);
			}
	});
}

// todo : cache
function getWeatherByLatLng(lat, lng){
	info("Searching weather data...");
	$.ajax({
		url : "http://openweathermap.org/data/2.1/find/city?lat="+lat+"&lon="+lng+"&cnt=1",
		dataType : "jsonp",
		success : function(data) {
				var id = data.list[0].id;
				infoHide(0);
				getWeatherById(id);				
			}
	});
}

/*
 * 
 * $("#degree .active").attr("value")
 */

var now = new Object();

// todo : cache
function getWeatherById(id){
	
	info("Searching weather data...");
	loadingShow();
	
	$('#multiCityList').html("").hide();
	
	if(!isInteger(id)){
		info("L'identifiant\" "+id+" \" est invalide");
		info("Affichage de la météo pour Paris, France");
		id= "2988507";
	}
	
	var lang = (getStorage("lang") == null)? "fr" : getStorage("lang");
	
	$.ajax({
			url : "http://api.openweathermap.org/data/2.5/forecast?id="+id + "&lang="+lang,
			dataType : "jsonp",
			success : function(data) {
				log(data);
				now = new Object();
				now = { date : unixtime2date(data.list[0].dt),
							hour: unixtime2date(data.list[0].dt).getHours(),
							temp :  kelvin2Celcius(data.list[0].main.temp),
							tempK :  parseInt(data.list[0].main.temp, 10),
							tempF : kelvin2Farh(data.list[0].main.temp),
							icon : data.list[0].weather[0].icon,
							iconcode : data.list[0].weather[0].id,
							cityId : data.city.id, 
							city : data.city.name,
							country: data.city.country,
							lat: data.city.coord.lat,
							lng: data.city.coord.lon,
							main : data.list[0].weather[0].main,
							description : data.list[0].weather[0].description,
							humidity : data.list[0].main.humidity,
							wind : mps2kmh(data.list[0].wind.speed),
							windMps : data.list[0].wind.speed,
							windMilesph : mps2milesph(data.list[0].wind.speed),
							windDegree : data.list[0].wind.deg-45,
							windDirection : degreeToText(data.list[0].wind.deg), 
							rain: ((data.list[0].rain != null)? data.list[0].rain["3h"] : null),
							cloud : data.list[0].clouds.all,
							snow : ((data.list[0].snow != null)? data.list[0].snow["3h"] : null),
							
							lat: data.city.coord.lat,
							lng: data.city.coord.lon,
							isFav : isFav(data.city.id) 
						};
				
				var tmpl = $("#today-tmpl").html(), html ="";
				html = Mustache.render(tmpl, now);
				$('#today').html("").append(html);
				
				$('.country').popover();
				
				
				var weekObject = {weekItem: []};
				var dayNumber = "";
				var dayArray = {dayItem: []};
				var o, fullDayObject = new Object();
				var tempFullDayMin, tempFullDayMax;
				for(i=0;i<data.list.length;i++){
					o = new Object();
										
					o = { 
						date : unixtime2date(data.list[i].dt),
						dayMinus: dayMinusNamesTab[unixtime2date(data.list[i].dt).getDay()],
						day: dayNamesTab[unixtime2date(data.list[i].dt).getDay()],
						dayNumber: unixtime2date(data.list[i].dt).getDate(),
						month: monthNamesTab[unixtime2date(data.list[i].dt).getMonth()],
						hour: unixtime2date(data.list[i].dt).getHours(),
						temp :  kelvin2Celcius(data.list[i].main.temp),
						tempK :  parseInt(data.list[i].main.temp, 10),
						tempF : kelvin2Farh(data.list[i].main.temp),
						tempMin :  kelvin2Celcius(data.list[i].main.temp_min),
						tempMax :  kelvin2Celcius(data.list[i].main.temp_max ),
						icon : data.list[i].weather[0].icon,
						iconcode : data.list[i].weather[0].id,
						city : data.city.name + ", " + data.city.country,
						main : data.list[i].weather[0].main,
						description : data.list[i].weather[0].description,
						humidity : data.list[i].main.humidity,						
						wind : mps2kmh(data.list[i].wind.speed),
						windMps : data.list[i].wind.speed,
						windMilesph : mps2milesph(data.list[i].wind.speed),
						windDegree : data.list[i].wind.deg-45,
						windDirection : degreeToText(data.list[i].wind.deg), 
						rain: ((data.list[i].rain != null)? data.list[i].rain["3h"] : null),
						cloud : data.list[i].clouds.all,
						snow : ((data.list[i].snow != null)? data.list[i].snow["3h"] : null),
					};
					
					
					if(i==0){
						dayNumber = o.dayNumber;
						fullDayObject = o;
						tempFullDayMin = data.list[i].main.temp; // = o.tempK
						tempFullDayMax = data.list[i].main.temp; // = o.tempK
					}
					
					/* if mid-day set fulldayicon with mid-day icon */
					
					if(o.hour == "12"){
						fullDayObject.icon = o.icon;
					}
					
					/* full day temp max/min */
					if(data.list[i].main.temp < tempFullDayMin){
						tempFullDayMin = o.tempK;
					}
					
					if(tempFullDayMax < data.list[i].main.temp ){
						tempFullDayMax = data.list[i].main.temp; // = o.tempK
					}
					/* full day temp max/min */
					
					// add to evolution day list
					if(dayNumber == o.dayNumber){
					 	dayArray.dayItem.push(o);
					}
					
					// another day
					if(dayNumber != o.dayNumber){
						fullDayObject.tempFullDayMinK = parseInt(tempFullDayMin,10);
						fullDayObject.tempFullDayMinCelcius = kelvin2Celcius(tempFullDayMin);
						fullDayObject.tempFullDayMinFarh = kelvin2Farh(tempFullDayMin);
						
						fullDayObject.tempFullDayMaxK = parseInt(tempFullDayMax,10);
						fullDayObject.tempFullDayMaxCelcius = kelvin2Celcius(tempFullDayMax);
						fullDayObject.tempFullDayMaxFarh = kelvin2Farh(tempFullDayMax);
						
						
						dayArray.dayItem.push(o);
						fullDayObject.dayEvolution = dayArray;
					 	weekObject.weekItem.push(fullDayObject);
					 	
					 	// re-init
					 	dayArray = {dayItem: []};
					 	fullDayObject = o;
					 	tempFullDayMin = data.list[i].main.temp; // = o.tempK
						tempFullDayMax = data.list[i].main.temp; // = o.tempK
					}
					
					
					dayNumber = o.dayNumber;
				}
				log("weekObject");
				log(weekObject);
				var weektmpl = $("#week-list-tmpl").html(), weekhtml ="";
				weekhtml = Mustache.render(weektmpl, weekObject);
				$('#week-list-div').html("").append(weekhtml);
				
				var weektmpl2 = $("#week-list-detail-tmpl").html(), weekhtml2 ="";
				weekhtml2 = Mustache.render(weektmpl2, weekObject);
				$('#week-list-detail-div').html("").append(weekhtml2);
				
				$('#week-list-detail-div [title]').tooltip({html:true});
				
				/* weeklist show details*/
	
				$("#week-list-div .accordion-toggle").click(function(){		
					$("#week-list-div .accordion-toggle").removeClass("active");
					
					var detailId = $(this).attr("href");										
					
					if($(detailId).hasClass("in") == false){
						$(this).addClass("active");
					}		
				});
				
				/* weeklist */
																
				var nowDate = new Date(); 
				$("#last-update").text(dayNamesTab[nowDate.getDay()] + " " + 
										nowDate.getDate() + " " +
										monthNamesTab[nowDate.getMonth()] + " " +
										 nowDate.toLocaleTimeString());
				
				/* remove hash # from url */
				document.location.hash = "";
				
				if(Modernizr.history){
					/* to really remove "#"  http://stackoverflow.com/a/5298684 */
					history.pushState("", document.title, window.location.pathname + window.location.search);
				}
				
				setStorage("lastId", id);
								
				var shareObj = new Object();
				var cityName = encodeURI(data.city.name).replace(/%20/ig,"_");
				
				/* "%2F" = "/" */
				shareObj = {							
							link: document.location.protocol + "//" + document.location.host+document.location.pathname+"#"+cityName+"/"+id ,
							linkText : document.location.host+document.location.pathname+"#"+cityName+"/"+id,
							city: data.city.name,
							tempc : now.temp,
							description : now.description,
							linkEscape : document.location.protocol + "//" + document.location.host+document.location.pathname+"%23"+cityName+"/"+id,
							img : $(".bigicon").css("background-image").replace('url(','').replace(')','')
				};

				var sharetmpl = $("#share-tmpl").html(), shareHtml ="";
				shareHtml = Mustache.render(sharetmpl, shareObj);
				$('#share').html("").append(shareHtml);
				
				var urltmpl = $("#url-tmpl").html(), shareHtml ="";
				urlHtml = Mustache.render(urltmpl, shareObj);
				$('.url').html("").append(urlHtml);
				
				infoHide(0);
				$("#search").val("");				
				$("#maphide").click();				
				loadingHide();
				animateBox(500);
				
				/*  refresh share button */
				//$.getScript("http://platform.twitter.com/widgets.js");
				twttr.widgets.load();
				gapi.plusone.go();

			}
		});
}


function updateMap(lat,lng){
	log(lat);
	log(lng);
	
	var center = new google.maps.LatLng(lat, lng);
	$("#bgMap").attr("lng",lng).attr("lat",lat);

	try {
		bgMap.panTo(center);
		var myLatLng = new google.maps.LatLng(lat, lng);
        var cityMarker = new google.maps.Marker({
            position: myLatLng,
            map: bgMap
        });
        
	} catch(e) {
		log("error for update map via panTo function");		
		log(e);
		
		var mapOptions = {
			center : new google.maps.LatLng(lat, lng),
			zoom : 7,
			mapTypeId : google.maps.MapTypeId.ROADMAP//,
			//disableDefaultUI: true
		};

		var bgMap = new google.maps.Map(document.getElementById('bgMap'), mapOptions);
		
        var myLatLng = new google.maps.LatLng(lat, lng);
        var cityMarker = new google.maps.Marker({
            position: myLatLng,
            map: bgMap
        });
	}
	
	/*
		http://staticmap.openstreetmap.de/staticmap.php?center=47.674096130445,4.4772529580305&zoom=4&size=200x150&markers=47.262162342348,2.895221708095,ol-marker-green
		http://staticmaplite.sourceforge.net/		
		http://www.iconfinder.com/icondetails/85833/30/_icon
		http://staticmap.openstreetmap.de/staticmap.php?center={{lat}},{{lng}}&zoom=4&size=200x150&markers={{lat}},{{lng}},ol-marker-green
	 */

}

function mps2kmh(speed){
	return parseInt(speed/0.27, 10)
}

function mps2milesph(speed){
	return parseInt(speed*2.2369362920544, 10)
}


function kelvin2Celcius(kelvin){
	return parseInt(kelvin  - 273.15, 10);
}

function kelvin2Farh(kelvin){
	return parseInt(((kelvin - 273.15)*9/5)+32, 10);
}
