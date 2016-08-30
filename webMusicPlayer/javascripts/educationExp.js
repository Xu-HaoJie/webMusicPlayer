var showFlag = {
	allshow:true,
	partshow:false,
	id:0
};

function selectShowSection(id){
	var textElem = document.getElementById("expandOrPackup_link");
	var imgElem = document.getElementById("expandOrPackup_img");
	textElem.lastChild.nodeValue = "收起";
	imgElem.setAttribute("src","images/packup.png");
	allshow = false;


	var divs = document.getElementsByTagName("div");
	for(var i = 0; i < divs.length; i++){
		if(divs[i].className.indexOf("section") == -1) continue;
		if(divs[i].getAttribute("id") != id){
			divs[i].style.display = "none";
		}
		else{
			divs[i].style.display = "block";
		}
	}
}

function eduExpListClickHandle(){
	if(!document.getElementsByTagName || !document.getElementById) return false;
	if(!document.getElementById("internalnav")) return false;
	var list = document.getElementById("internalnav");
	var links = list.getElementsByTagName("a");

	/* var expandOrPackup = document.getElementById("expandOrPackup");
	expandOrPackup.style.display = "none"; */

	for(var i = 0; i < links.length; i++){
		var href = links[i].getAttribute("href");
		var id = href.split('#')[1];
		if(!document.getElementById(id)) continue;
		document.getElementById(id).style.display = "none";
		links[i].destination = id;
		links[i].onclick = function(){
			selectShowSection(this.destination);
			return false;
		}
	}
}


function allShowOrHide(show){
	var divs = document.getElementsByTagName("div");
	for(var i = 0; i < divs.length; i++){
		if(divs[i].className.indexOf("section") == -1) continue;
		if(show == true)
			divs[i].style.display = "block";
		else
			divs[i].style.display = "none";
	}
}

var allshow = true;
function expandOrPackup(){
	var expandOrPackup = document.getElementById("expandOrPackup");
	for(var i = 0; i < expandOrPackup.childNodes.length; i++){
		var child = expandOrPackup.childNodes[i];
		if(child.nodeType != 1) continue;  /* 检测该节点是不是元素节点（元素节点：1，属性节点：2，文本节点：3） */
		var id = child.getAttribute("id");
		if(id.indexOf("expandOrPackup") == -1) continue;
		child.onclick = function(){
			var textElem = document.getElementById("expandOrPackup_link");
			var imgElem = document.getElementById("expandOrPackup_img");
			if(allshow == true){
				allShowOrHide(true);
				textElem.lastChild.nodeValue = "收起";
				imgElem.setAttribute("src","images/packup.png");
				allshow = false;
			}
			else{
				allShowOrHide(false);
				textElem.lastChild.nodeValue = "扩展";
				imgElem.setAttribute("src","images/expand.png");
				allshow = true;
			}
			return false;
		}
	}
}

addLoadEvent(eduExpListClickHandle);
addLoadEvent(HomePageClickEvent);
addLoadEvent(expandOrPackup);