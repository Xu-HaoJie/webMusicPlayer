var intervalTimeId = 0;
/* ͼƬ�����ƶ� */
function swingPic(startX, startY, leftX, rightX, interval){
	if(!document.getElementById) return false;
	if(!document.getElementById("title")) return false;
	var swingImg = document.getElementById("title");
	swingImg.style.position = "absolute";
	swingImg.style.left = startX + "px";
	swingImg.style.top = startY + "px";
	
	var curX = parseInt(swingImg.style.left);
	var moveDir = 1; //�ƶ�����0 ���ң� 1����
	intervalTimeId = setInterval(function(){
		if(moveDir == 1){
			if(curX >= rightX){
				moveDir = 0;
			}else{
				curX++;
			}
		}
		else{
			if(curX <= leftX){
				moveDir = 1;
			}else{
				curX--;
			}
		}
		swingImg.style.left = curX + "px";
	}, interval);
}



function startSwing(){
	swingPic(200,50,130,305,10);
}


addLoadEvent(startSwing);