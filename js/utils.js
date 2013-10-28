var dayMinusNamesTab = ['D', 'L', 'M', 'Me', 'J', 'V', 'S'];
var dayNamesTab = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
var monthNamesTab = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

function setStorage(_name,_value){
	if(supports_local_storage()){
		localStorage[_name] = _value;
	}else{
		setCookie(_name, _value);
	}
}

function getStorage(_name){
	if(supports_local_storage()){
		return localStorage[_name];
	}else{
		return getCookie(_name);
	}
}


function supports_local_storage() {
	try {
		return ('localStorage' in window && window['localStorage'] !== null);
	} catch(e) {
		return false;
	}
}

function setCookie(c_name, value, exdays) {
	
	if(exdays == null || exdays == undefined){
		exdays = 365*100;
	}
	
	var exdate = new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
	document.cookie = c_name + "=" + c_value;
}

function getCookie(c_name) {
	var i, x, y, ARRcookies = document.cookie.split(";");
	for ( i = 0; i < ARRcookies.length; i++) {
		x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
		y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
		x = x.replace(/^\s+|\s+$/g, "");
		if (x == c_name) {
			return unescape(y);
		}
	}
}


function log(logtext){
	try{
			//console.log(logtext);
		
	}catch(e) {
		return false;
	}
}


function info(message){
	if($("#info").css("display")!="none"){
		message =  $("#info p").html() + "<hr/>" + message ;		
	}
	$("#info p").html(message);
	$("#info").show().addClass("  animated");
}

function infoHide(time){
	if(time != undefined && time > 0){
		setTimeout(function(){
			//$("#info").hide();
			$("#info").show().addClass("hinge animated");
		}, time)
	}else{
		//$("#info").hide();
		time = 0;
		$("#info").show().addClass("hinge animated");
	}
	
	
	setTimeout(function(){
			$("#info").removeClass("hinge animated").hide();
		}, time+2000);
}

function loadingShow(){
	$("#refresh").addClass("loading");
}

function loadingHide(){
	$("#refresh").removeClass("loading");
}

function isInteger(value){ 
   return !isNaN(parseInt(value));
}

function unixtime2date(unixtime){
	return new Date(unixtime*1000);
}

function animateBox(_tempo) {
	_tempo = parseInt(_tempo,10);
	var _end =2000+parseInt(_tempo,10); 
	log(_tempo);
	log(_end);
	$("#today-info").removeClass("animated bounceInDown").addClass("hide");
	$("#container").removeClass("animated wobble");
	
	setTimeout(function() {
		$("#container").addClass("animated wobble");
		$("#today-info").addClass("animated bounceInDown");
	}, _tempo);
	
	setTimeout(function() {
		$("#today-info").removeClass("animated bounceInDown hide");
		$("#container").removeClass("animated wobble");
	}, _end);
}

