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

/* 设置表格斑马线显示 */
function stripeTables(){
	if(!document.getElementsByTagName) return false;
	var tables = document.getElementsByTagName("table");
	for(var i = 0; i < tables.length; i++){
		var odd = false;
		var rows = tables[i].getElementsByTagName("tr");
		for(var j = 0; j < rows.length; j++){
			if(odd == true){
				rows[j].style.backgroundColor = "#ffc";
				odd = false;
			}
			else{
				odd = true;
				rows[j].style.backgroundColor = "#9cc";
			}
		}
	}
}

addLoadEvent(highLightRows);
addLoadEvent(stripeTables);