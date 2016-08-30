
function moveElementById(elemID, final_x, final_y, interval){
	var elem = document.getElementById(elemID);
	/*
	if(elem.timerOut)
		clearTimeout(elem.timerOut);
		*/
	
	if(elem.timeOut)
		clearInterval(elem.timeOut);

	if(!elem.style.left)
		elem.style.left = "0px";
	if(!elem.style.top)
		elem.style.top = "0px";

	var startXPos = parseInt(elem.style.left);
	var startYPos = parseInt(elem.style.top);

	elem.timeOut = setInterval(function(){
		if(startXPos == final_x && startYPos == final_y){
			clearInterval(elem.timeOut);
			return;
		}

		if(startXPos < final_x){
			var diff = Math.ceil((final_x - startXPos)/10);
			startXPos += diff;
		}
		if(startXPos > final_x){
			var diff = Math.ceil((startXPos - final_x)/10);
			startXPos -= diff;
		}
		if(startYPos < final_y){
			var diff = Math.ceil((final_y - startYPos)/10);
			startYPos += diff;
		}
		if(startYPos > final_y){
			var diff = Math.ceil((startYPos - final_y)/10);
			startYPos -= diff;
		}
		elem.style.left = startXPos + "px";
		elem.style.top = startYPos + "px";
	}, interval);
		
	/*var repeat = "moveElement("+elemID+","+final_x+","+final_y+","+interval+")";
	elem.timerOut = setTimeout(repeat, interval);*/
}

function prepareSlideShow()
{
	if(!document.getElementById) return false;
	if(!document.getElementsByTagName) return false;
	var imageList = document.getElementById("tagList");
	var links = document.getElementsByTagName("a");
	var slideImage = document.getElementById("slideImage");
	slideImage.style.position = "absolute";
	slideImage.style.left = "0px";
	slideImage.style.top = "0px";

	for(var i = 0; i < links.length; i++){
		links[i].onmouseover = function(){
			var dest = this.getAttribute("href");
			if(dest.indexOf("briefIntroduction.html") != -1){
				moveElementById("slideImage", -80, 0, 5);
			}

			if(dest.indexOf("BaseInfo.html") != -1){
				moveElementById("slideImage", -160, 0, 5);
			}

			if(dest.indexOf("ProjectExp.html") != -1){
				moveElementById("slideImage", -240, 0, 5);
			}

			if(dest.indexOf("Hobbies.html") != -1){
				moveElementById("slideImage", -320, 0, 5);
			}

			if(dest.indexOf("EducationExp.html") != -1){
				moveElementById("slideImage", -400, 0, 5);
			}
		}
	}
}

/* 类似于c语言的结构体 */
var person = {
	name:"fanchenxin",
	age:27,
	sex:"man",
	addr:"fujian",
	showInfo:function(){
		alert(this.name);
		alert(this.age);
	}
};


addLoadEvent(prepareSlideShow);