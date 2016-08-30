function setHobbyText(whichLink){
	var elem = document.getElementById("hobby_text");
	var hobbytext = whichLink.getAttribute("title");
	elem.lastChild.nodeValue = hobbytext;
}

function setShowPlacePic(whichLink){
	var elem = document.getElementById("showPlace");
	var hobbyurl  = whichLink.getAttribute("href");
	elem.setAttribute("src", hobbyurl);
}

function test(){
	setHobbyText("游泳");
	setShowPlacePic("images/hobbys/swim.jpg");
}

function prepareHobbyPicShow(){
	if(!document.getElementsByTagName ||
		!document.getElementById) return false;
	var links = document.getElementsByTagName("a");
	for(var i = 0; i < links.length; i++){
		if(!links[i].getAttribute("title")) continue;
		links[i].onclick = function(){
			setHobbyText(this);
			setShowPlacePic(this);
			return false;
		}	
	}
}

/*addLoadEvent(test);*/
addLoadEvent(prepareHobbyPicShow);