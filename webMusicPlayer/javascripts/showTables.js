function highLightRows(){
	if(!document.getElementsByTagName) return false;
	var rows = document.getElementsByTagName("tr");
	for(var i = 0; i < rows.length; i++){
		rows[i].onmouseover = function(){
			rows[i].style.fontWeight = "bold";
			rows[i].style.color = "#c60";
		}

		rows[i].onmouseout = function(){
			rows[i].style.fontWeight = "normal";
			rows[i].style.color = "#fff";
		}
	}
}

addLoadEvent(stripeTables);
addLoadEvent(showAbbrsList);
addLoadEvent(highLightRows);