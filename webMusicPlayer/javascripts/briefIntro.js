/* 获得焦点 */
function focusLabels(){
	if(!document.getElementById || !document.getElementsByTagName) return false;

	var labels = document.getElementsByTagName("label");
	for(var i = 0; i < labels.length; i++){
		if(!labels[i].getAttribute("for")) continue;
		labels[i].onclick = function(){
			var id = this.getAttribute("for");
			if(!document.getElementById(id)) return false;
			var element = document.getElementById(id);
			element.focus();
		}
	}
}


/* 当获得焦点时清空默认内容，离开时获取默认值 */
function resetFields(whichform){
	for(var i = 0; i < whichform.elements.length; i++){
		var element = whichform.elements[i];
		if(element.type == "submit") continue;
		if(!element.defaultValue) continue;
		element.onfocus = function(){
			if(this.value == this.defaultValue)
				this.value = "";
		}

		element.onblur = function(){
			if(this.value == "")
				this.value = this.defaultValue;
		}
	}
}

/* 判断文本框是否有内容 */
function isFilled(field){
	if(field.value.length < 1 || 
		field.value == field.defaultValue)
		return false;
	else
		return true;
}

/* 简单判断邮件格式是否满足要求 */
function isEmail(field){
	if(field.value.indexOf("@") == -1 || 
		field.value.indexOf(".") == -1)
		return false;
	else
		return true;
}

function clearAllText(){
	for(var i = 0; i < document.forms.length; i++){
		var form = document.forms[i];
		/*
		for(var i = 0; i < form.elements.length; i++){
			var elem = form.elements[i];
			if(elem.className.indexOf("required") != -1){
				if(elem.value.length >= 1 || elem.value != elem.defaultValue)
					elem.value = elem.defaultValue;
			}
		}*/

		form.reset();  /* 简单粗暴的方法 */
	}
}

/* 检测表单填写是否正确 */
function checkFormIsValid(form){
	var name, email, message;
	for(var i = 0; i < form.elements.length; i++){
		var elem = form.elements[i];
		if(elem.className.indexOf("required") != -1){
			if(!isFilled(elem)){
				var errMsg = "Please input content into " + elem.name;
				errMsg += " field!!";
				alert(errMsg);
				elem.focus();
				return false;
			}
		}

		if(elem.className.indexOf("name") != -1)
			name = elem.value;
		if(elem.className.indexOf("message") != -1)
			message = elem.value;

		if(elem.className.indexOf("email") != -1){
			if(!isEmail(elem)){
				alert("The "+elem.name+" field must be a vaild email address!!");
				elem.focus();
				return false;
			}
			email = elem.value;
		}
	}

	var all = "Your submit information is:\r\n";
	all = "Your name: " + name + "\r\n";
	all += "Your email: " + email + "\r\n";
	all += "Your message: " + message + "\r\n";
	all += "Please check is right??";
	if(confirm(all)){
		sendMail("531266381@qq.com", "hello", all);
		/*var submitBut = form.elements["submitBut"];
		submitBut.disabled = true;*/
		return true;
	}
	else
		return false;
}

/* 发送邮件 */
function sendMail(towho, subject, body){
	var url = "mailto:"+towho+"?"+"subject="+subject+"&"+"body="+body;
	document.location.href = url;
}

function prepareForms(){
	for(var i = 0; i < document.forms.length; i++){
		var thisform = document.forms[i];
		resetFields(thisform);
		thisform.onsubmit = function(){
			return checkFormIsValid(thisform); /* 如果return flase则不会提交表单,内容也不会被清空 */
		}
	}
}

function cleanButtonClickEvent(){
	var cleanBut = document.getElementById("cleanBut");
	cleanBut.onclick = function(){
		clearAllText();
		return;
	}
}

addLoadEvent(focusLabels);
addLoadEvent(prepareForms);
addLoadEvent(cleanButtonClickEvent);
addLoadEvent(HomePageClickEvent);