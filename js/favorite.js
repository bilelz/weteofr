$(document).ready(function() {
	
	printFav();
	
	$("body").on("click","a.favorite",function(){		
		$(this).toggleClass("isfav animated tada");
		
		if($(this).hasClass("isfav")){
			var favArray = {fav: []};

			if(getStorage("favorites") != null && getStorage("favorites") === undefined == false){
				favArray = jQuery.parseJSON(getStorage("favorites"));
			}
					
			var fav = new Object();
	
			fav = {
				"city" : $(this).attr("city"),
				"id" : $(this).attr("cityId")
			};
			
			favArray.fav.push(fav);
			setStorage("favorites", JSON.stringify(favArray));
		}else{
			removeFav($(this).attr("cityId"));
		}
		printFav();
		return false;
	});
	
	
	
	$("#bookmarkList").on("click","a.showFav",function(){		
			
		getWeatherById($(this).attr("id"));		
		$("#bookmarks").removeClass("open");
		
		return false;
	});
	
	$("#bookmarkList").on("click","a.removeFav",function(){		
			
		removeFav($(this).attr("id"));		
		printFav();
		
		return false;
	});
	
	// $("a#bookmarks").click(function(){
		// console.log(jQuery.parseJSON(getStorage("favorites")));
		// return false;
	// });		
});

function isFav(_id){
	if(getStorage("favorites") == null || getStorage("favorites") === undefined){
		return false;
	}
	
	var favlist = jQuery.parseJSON(getStorage("favorites"));
	for (var i in favlist){
		for (var j in favlist[i]){
			if(favlist[i][j].id == _id){
				console.log(favlist[i][j].city);
				return true;
			}
		}
	}
	return false;
}


function removeFav(_id){
	var favlist = jQuery.parseJSON(getStorage("favorites"));
	var favArray = {fav: []};
	
	for (var i in favlist){
		console.log(favlist[i]);
		for (var j in favlist[i]){
			console.log(favlist[i][j]);
			if(favlist[i][j].id != _id){

				var fav = new Object();
		
				fav = {
					"city" : favlist[i][j].city,
					"id" : favlist[i][j].id
				};
				favArray.fav.push(fav);
			}
		}
	}
	setStorage("favorites", JSON.stringify(favArray));
}

function printFav(){
	if(getStorage("favorites") == null || getStorage("favorites") === undefined){
		setStorage("favorites", '{"fav":[{"city":"Paris","id":"2988507"},{"city":"London","id":"2643743"},{"city":"Mecca","id":"104515"},{"city":"Moroni","id":"921772"}]}');// default list
	}
	
	
	
	var favlist = jQuery.parseJSON(getStorage("favorites"));
	favlist.fav = favlist.fav.sort(comparator); // sort by Alphabet ASC
	
	var bookmarkListTmpl = $("#bookmarkList-tmpl").html(), html = "";   
	html = Mustache.render(bookmarkListTmpl, favlist);
		
	$("#bookmarkList").html(html);	
}

function comparator(a, b) {
    return a["city"] > b["city"];
}

