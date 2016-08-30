function my_delay(ms){
	var myDate = new Date();
	var old_ms = myDate.getTime();
	while(1){
		var new_ms = myDate.getTime();
		if(new_ms - old_ms >= ms)
			break;
	}
}

/* 添加页面加载完成后需要执行的函数 */
function addLoadEvent(func){
	var oldOnLoad = window.onload;
	if(typeof window.onload != 'function'){  // 如果当前页面加载完后，没有需要执行的函数
		window.onload = func;    // 则将func函数执行
	}
	else{
		window.onload = function(){  //如果页面执行完已经有其他函数等待执行
			oldOnLoad();   //先执行之前add的函数
			func();   //再执行当前函数
		}
	}
}


function insertAfter(newElement, targetElement){
	var parent = targetElement.parentNode;
	if(parent.lastChild == targetElement){
		parent.appendChild(newElement);
	}
	else{
		parent.insertBefore(newElement, targetElement.nextSibling);
	}
}


function showAbbrsList(){
	if(!document.getElementsByTagName || !document.getElementById) return false;
	if(!document.createTextNode) return false;

	/* 创建 h2 标题 */
	var h2 = document.createElement("h2");
	var h2_text = document.createTextNode("Abbreviations");
	h2.appendChild(h2_text);

	/*
	var Ps = document.getElementsByTagName("p");
	insertAfter(h2, Ps[Ps.length-1]);*/
	document.body.appendChild(h2);

	/* 获取所有的缩略词 */
	var abbrs = document.getElementsByTagName("abbr");
	if(abbrs.length < 1) return false;
	var keyToText = new Array();
	for(var i = 0; i < abbrs.length; i++){
		if(abbrs[i].childNodes.length < 1) continue;
		var text = abbrs[i].getAttribute("title");
		var key = abbrs[i].lastChild.nodeValue;
		keyToText[key] = text;
	}

	/* 创建缩略词定义列表 */
	var dList = document.createElement("dl");
	for(key in keyToText){
		var definition = keyToText[key];
		var dtitle = document.createElement("dt");
		var dtitle_text = document.createTextNode(key);
		dtitle.appendChild(dtitle_text);

		var ddes = document.createElement("dd");
		var ddes_text = document.createTextNode(definition);
		ddes.appendChild(ddes_text);

		dList.appendChild(dtitle);
		dList.appendChild(ddes);
	}
	if(dList.childNodes.length < 1) return false;

	document.body.appendChild(dList);
}


/* 在引用内容的后面显示源网址的链接 */
function displayCitations(){
	if(!document.getElementsByTagName ||
		!document.getElementById ||
		!document.createTextNode) return false;

	/* 获取所有的 quote 元素 */
	var quotes = document.getElementsByTagName("blockquote");
	for(var i = 0; i < quotes.length; i++){
		if(!quotes[i].getAttribute("cite")) continue;
		var url = quotes[i].getAttribute("cite");  //获得cite后面的链接

		var quoteChildren = quotes[i].getElementsByTagName("*");
		if(quoteChildren.length < 1) continue;
		var lastElem = quoteChildren[quoteChildren.length-1];

		var link = document.createElement("a");
		var link_text = document.createTextNode("(source link click here)");
		link.appendChild(link_text);
		link.setAttribute("href", url);

		/* 上标的效果 */
		//var superScript = document.createElement("sup");
		//superScript.appendChild(link);

		//lastElem.appendChild(superScript);

		lastElem.appendChild(link);
	}
}

function getNextElement(node){
	if(!node) return null;
	if(node.nodeType == 1) return node;
	if(node.nextSibling){
		return getNextElement(node.nextSibling);
	}
	return null;
}

function addClass(element, value)
{
	if(!element.className){
		element.className = value;
	}
	else{
		var newClassValue = element.className;
		newClassValue += " ";
		newClassValue += value;
		element.className = newClassValue;
	}
}

function setElementPosition(element, left, top)
{
	element.style.position = "absolute";
	element.style.left = left;
	element.style.top = top
}

function setPositionByID(ID, left, top)
{
	if(!document.getElementById) return false;
	var element = document.getElementById(ID);
	element.style.position = "absolute";
	element.style.left = left;
	element.style.top = top
}


/* 返回主页面 */
function HomePageClickEvent(){
	var homePageBut = document.getElementById("backHomePageBut");
	homePageBut.onclick = function(){
		var homeUrl = "myResumeHomePage.html";
		document.location.href = homeUrl;
	}
}

