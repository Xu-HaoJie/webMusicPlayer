function highlightPage(){
	if(!document.getElementById) return false;
	if(!document.getElementsByTagName) return false;
	if(!document.getElementById("navigation")) return false;

	var nav = document.getElementById("navigation");
	var links = document.getElementsByTagName("a");
	for(var i = 0; i < links.length; i++){
		var url = links[i].getAttribute("href");
		var cur_url = window.location.href;
		if(cur_url.indexOf(url) != -1){
			links[i].className = "here";
		}
	}
}

addLoadEvent(highlightPage);