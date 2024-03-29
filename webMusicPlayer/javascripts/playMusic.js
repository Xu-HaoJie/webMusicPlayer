/* 全局对象用来存储歌曲播放信息 */
var playInfo={
	audio:null,
	loopPlay: false,
	context: null,
	voiceContext: null,
	currentTime: 0,
	totalTime: 0,
	curPlayIdx: 0,
	timeID: 0,
	curPlaySongName: null,
	songScaleBut:null,
	audioBar:null,
	playFlag:1   // 2: 暂停 1：播放 0：停止
};

/* 标识当前歌曲的总时长是否发生变化 */
var totalTimeChange = false;
var songBarScale = false;  //进度条发生拖动

var playImage = ["images/Audio/play.png", "images/Audio/pause.png"];
var songList = ["musics/jiehun.wav",
				"musics/刘德华 - 恭喜发财.mp3", 
	      "musics/罗大佑 - 恋曲1990.mp3",
			  "musics/毛宁 - 涛声依旧.mp3",
			  "musics/那英 - 山不转水转.mp3",
			  "musics/牛奶@咖啡 - 越长大越孤单.mp3"]; /* 歌曲列表 */

/* 设置是否需要循环播放 */
function resetLoopPlay(){
	var elem = document.getElementById("loopPlay");
	elem.onclick = function(){
		if(elem.checked == true){
			playInfo.audio.loop = true;
			playInfo.loopPlay = true;
		}
		else{
			playInfo.audio.loop = false;
			playInfo.loopPlay = false;
		}
	}
}

/* 刚开始播放需要查询下复选框的状态 */
function initLoopPlayState(){
	var elem = document.getElementById("loopPlay");
	if(elem.checked == true){
		playInfo.audio.loop = true;
		playInfo.loopPlay = true;
	}
	else{
		playInfo.audio.loop = false;
		playInfo.loopPlay = false;
	}
}

/* 显示播放时间及总时间 */
function showSongPlayTime(play_info, total_min, total_sec){
	play_info.context.font = "bold 16px Arial";
	play_info.context.textAlign = "center";
	play_info.context.textBaseline = "middle";
	play_info.context.fillStyle = "#0000ff";
	var cur_min = parseInt(play_info.currentTime / 60);
	var cur_sec = parseInt(play_info.currentTime % 60);
	/*数字小于10在前面补0*/
	if(cur_min < 10)
		cur_min = "0" + cur_min;
	if(cur_sec < 10)
		cur_sec = "0" + cur_sec;
	var showTime = cur_min + " : " + cur_sec + " / " + total_min + " : " + total_sec;
	play_info.context.clearRect(400, 0, 160, 20);
	play_info.context.fillText(showTime, 460, 10);
}

/* 显示当前播放歌曲的名称 */
function showCurPlaySong(songUrl){
	var s_idx = songUrl.lastIndexOf("/");
	var songName = songUrl.slice(s_idx+1);
	var elem = document.getElementById("songName");
	songName = "歌曲名: " + songName;
	elem.innerHTML = songName;
}

/* 重置进度条 */
function resetProgressBar(){
	playInfo.context.fillStyle = "#c9aeff";  //先清除下进度条
	playInfo.context.fillRect(0, 5, 400, 10);
}

/* 进度条及时间的显示和更新 */
function showProgressBarAndTime(play_info)
{
	clearInterval(play_info.timeID);
	play_info.context.fillStyle = "#ffff00";
	var step = (400-10) / play_info.totalTime; //计算进度条的步长,因为加了可拖动按钮10px宽所以减10
	var i = step * play_info.currentTime; //计算开始的位置

	var total_min = parseInt(play_info.totalTime / 60); //计算总时长的分钟数
	var total_sec = parseInt(play_info.totalTime % 60); //计算总时长的秒数
	if(total_min < 10)
		total_min = "0" + total_min;
	if(total_sec < 10)
		total_sec = "0" + total_sec;

	/* 一秒钟更新一次进度条及时间 */
	play_info.timeID = setInterval(function(){
		/* 如果播放停止或暂停则清除定时器 */
		if(play_info.playFlag == 0 || play_info.playFlag == 2){
			clearInterval(play_info.timeID);
			return;
		}

		/* 如果歌曲总时长发生改变需要重新计算 */
		if(totalTimeChange){
			step = (400-10) / play_info.totalTime;
			i = step * play_info.currentTime;
			total_min = parseInt(play_info.totalTime / 60);
			total_sec = parseInt(play_info.totalTime % 60);
			if(total_min < 10)
				total_min = "0" + total_min;
			if(total_sec < 10)
				total_sec = "0" + total_sec;
			totalTimeChange = false;
		}
		
		/* 歌曲进度条拖动发生 */
		if(songBarScale){
			i = step * play_info.currentTime;
			play_info.context.fillStyle = "#ffff00";
			songBarScale = false;
		}

		if(i + step >= (400-10)){
			if(play_info.loopPlay == false){
				clearInterval(play_info.timeID);
				return;
			}
			else{
				i = 0;
				play_info.currentTime = 0;
				play_info.context.fillStyle = "#c9aeff";
				play_info.context.fillRect(0, 5, 400, 10);
			}
		}
		/*进度条刷新*/
		play_info.context.fillRect(0, 5, i, 10);
		playInfo.songScaleBut.style.left = playInfo.audioBar.offsetLeft + i + "px";
		i += step;

		showSongPlayTime(play_info, total_min, total_sec);
		play_info.currentTime++;
		play_info.context.fillStyle = "#ffff00";
	}, 1000);
}

/* 绘制进度条的背景图案 */
function drawBackground(){
	/* 播放进度条 */
	var audioBar = document.getElementById("audioBar");
	playInfo.audioBar = audioBar;
	//alert(audioBar.offsetLeft);
	//alert(audioBar.offsetTop);
	if(audioBar.getContext){
		var context = audioBar.getContext("2d");
		context.fillStyle = "#00a2e8";
		context.fillRect(0, 0, 400, 20);

		//context.fillStyle = "rgba(255,255,0,0.5)";
		context.fillStyle = "#c9aeff";
		context.fillRect(0, 5, 400, 10);
	}

	playInfo.context = context;
	playInfo.currentTime = 0;
	showSongPlayTime(playInfo, "00", "00");  //显示时间
	
	/*歌曲进度条拖动按钮*/
	playInfo.songScaleBut = document.getElementById("songScaleBut");
	playInfo.songScaleBut.style.left = audioBar.offsetLeft + "px";
	playInfo.songScaleBut.style.top = audioBar.offsetTop - 4 + "px";
}

/* isPlayAfterPause表示是否是暂停后再继续播放 */
function musicStartPlay(isPlayAfterPause){
	var elem = document.getElementById("play_button");
	elem.setAttribute("src", playImage[1]);
	if(playInfo.audio.canPlayType("audio/wav") ||
		playInfo.audio.canPlayType("audio/mpeg")){
		/* 如果是暂停后继续播放则不需要重新设置src */
		if(isPlayAfterPause){
			var elem = document.getElementById("song");
			var src = elem.getAttribute("src");
			playInfo.audio.src = src;
			playInfo.songScaleBut.style.left = playInfo.audioBar.offsetLeft + "px";
		}
		//为了测试
		//playInfo.audio.currentTime = 220;  // 指定跳过的秒数 
	  //playInfo.currentTime = 220;
		//playInfo.audio.volume = 0;  /* 设置音量 0：静音 1：最大音 */
		//playInfo.audio.muted = true; /* 静音 */
		//playInfo.audio.playbackRate = 1.0 /* 播放速度：1.0正常，>1 快进  0~1 慢放 */
		//playInfo.audio.loop = true;
		/* 获得播放音乐的总时长 单位为秒 */
		//var totalTime = playInfo.audio.duration;
		//document.getElementById("debug").innerHTML = playInfo.audio.readyState;//parseInt(totalTime);
		//playInfo.totalTime = totalTime;
		initLoopPlayState(); /* 刷新网页的时候需要重新获得这个状态 */
		showProgressBarAndTime(playInfo);
		playInfo.audio.play();
	}
}

/* 暂停播放 */
function musicPause()
{
	var elem = document.getElementById("play_button");
	elem.setAttribute("src", playImage[0]);
	playInfo.audio.pause();
	clearInterval(playInfo.timeID);
}

/*继续播放*/
function musicContinue()
{
	playInfo.audio.currentTime = playInfo.currentTime;
	//alert(parseInt(playInfo.audio.currentTime));
	musicStartPlay(false);
}


function buttonClickHandle(){
	var father = document.getElementById("song_button");
	for(var i = 0; i < father.childNodes.length; i++){
		var curNode = father.childNodes[i];
		if(curNode.nodeType != 1) continue;
		if(curNode.className.indexOf("musicBut") == -1) continue;
		var id = curNode.getAttribute("id");
		var songElem = document.getElementById("song");
		switch(id){
			case "previous_button":
			{
				curNode.onclick = function(){
					playInfo.curPlayIdx--;
					if(playInfo.curPlayIdx < 0)
						playInfo.curPlayIdx = songList.length-1;
					var songUrl = songList[playInfo.curPlayIdx];
					songElem.setAttribute("src", songUrl);
					playInfo.audio.currentTime = 0;
					playInfo.currentTime = 0;
					playInfo.totalTime = parseInt(playInfo.audio.duration);
					playInfo.curPlaySongName = songUrl;
					playInfo.playFlag = 1;
					showCurPlaySong(songUrl);
					resetProgressBar();
					musicStartPlay(true);
				}
				break;
			}
			case "play_button":
			{
				curNode.onclick = function(){
					
					if(playInfo.audio.paused || playInfo.playFlag == 0){  // 按钮呈现暂停状态点击继续播放
						playInfo.playFlag = 1;
						playButtonFlag = false;
						musicContinue();
					}else{                       // 按钮呈现播放状态点击暂停播放
						playInfo.palyFlag = 2;
						musicPause();
					}
				}
				break;
			}
			case "next_button":
			{
				curNode.onclick = function(){
					playInfo.curPlayIdx++;
					if(playInfo.curPlayIdx >= songList.length)
						playInfo.curPlayIdx = 0;
					var songUrl = songList[playInfo.curPlayIdx];
					songElem.setAttribute("src", songUrl);
					playInfo.audio.currentTime = 0;
					playInfo.currentTime = 0;
					playInfo.totalTime = parseInt(playInfo.audio.duration);
					playInfo.curPlaySongName = songUrl;
					playInfo.playFlag = 1;
					showCurPlaySong(songUrl);
					resetProgressBar();
					musicStartPlay(true);
				}
				break;
			}
			default:
				break;
		}
	}
}


function songPlayEndEventAdd(){
	  playInfo.audio.addEventListener('ended', function(){
		var elem = document.getElementById("play_button");
		elem.setAttribute("src", playImage[0]);
		playInfo.playFlag = 0;
		playInfo.currentTime = 0;
		showSongPlayTime(playInfo, "00", "00");
		playInfo.context.fillStyle = "#c9aeff";
		playInfo.context.fillRect(0, 5, 400, 10);
		/*拖动按钮归0*/
		playInfo.songScaleBut.style.left = playInfo.audioBar.offsetLeft + "px";
	  playInfo.songScaleBut.style.top = playInfo.audioBar.offsetTop - 4 + "px";
	}, false);
}


var voiceInfo = {
	voiceContext:null,
	scaleBarElem:null,
	scaleButElem:null
};

/* 音量图片点击，静音和非静音切换 */
function voiceLogoClick(){
	var voiceLogo = document.getElementById("voiceLogo");
	voiceLogo.onclick = function(){
		if(playInfo.audio.muted == true){
			playInfo.audio.muted = false;
			voiceLogo.setAttribute("src", "images/Audio/voiceLogo.png");
		}else{
			playInfo.audio.muted = true;
			voiceLogo.setAttribute("src", "images/Audio/voiceMuteLogo.png");
		}
	}
}

function voiceLevelInit(){
	/* 音量拖动条 */
	voiceInfo.scaleBarElem = document.getElementById("voiceScaleBar");
	if(voiceInfo.scaleBarElem.getContext){
		voiceInfo.voiceContext = voiceInfo.scaleBarElem.getContext("2d");
		voiceInfo.voiceContext.fillStyle = "#c9aeff";
		voiceInfo.voiceContext.fillRect(0,0,100,4);
		//alert(voiceInfo.scaleBarElem.offsetLeft); //385px
		//alert(voiceInfo.scaleBarElem.offsetTop);  //676px
	}

	/* 拖动按钮指定到拖动条的中间位置 */
  voiceInfo.scaleButElem = document.getElementById("voiceScaleBut");
  voiceInfo.scaleButElem.style.left = voiceInfo.scaleBarElem.offsetLeft + 50 + "px";
  voiceInfo.scaleButElem.style.top = voiceInfo.scaleBarElem.offsetTop - 8 + "px";	
  
  voiceInfo.voiceContext.fillStyle = "#00f";
  voiceInfo.voiceContext.fillRect(0,0,50,4);
  
  playInfo.audio.volume = 0.5;
  
  var value = document.getElementById("voiceLeverValue");
  value.style.left = voiceInfo.scaleBarElem.offsetLeft + 110 + "px";
  
  voiceLogoClick();
}

/* 拖动音量拖动条拖动按钮的处理 */
function voiceScaleButMoveProcess(){
	var f=this,g=document,b=window,m=Math;
	voiceInfo.scaleButElem.onmousedown=function (e){
		var click_x =(e||b.event).clientX;  //鼠标点击的x坐标
		var click_y = (e||b.event).clientY;
		var but_x = this.offsetLeft;     //but的x坐标
		var max_length =voiceInfo.scaleBarElem.offsetWidth;  //拖动条长度px
		var scaleBarStartX = parseInt(voiceInfo.scaleBarElem.offsetLeft);  //拖动条起始x
		var scaleBarEndX = scaleBarStartX + max_length;
		g.onmousemove=function (e){
			var thisX =(e||b.event).clientX;
			var thisY = (e||b.event).clientY;
			/* 当只有纵坐标发生变化时进制在新窗口打开图片 */
			if(thisY != click_y && thisX == click_x){
				voiceInfo.scaleButElem.ondragstart = function(){
					return false;
				}
			}
			var to = but_x +(thisX - click_x);
			if(to > scaleBarEndX)
				to = scaleBarEndX
			if(to < scaleBarStartX)
			 	to = scaleBarStartX;
			var lever = to - scaleBarStartX;
			voiceInfo.scaleButElem.style.left=to+'px';	
			voiceInfo.voiceContext.fillStyle = "#00f";
			voiceInfo.voiceContext.fillRect(0,0,lever,4);
			voiceInfo.voiceContext.fillStyle = "#c9aeff";
			voiceInfo.voiceContext.fillRect(lever,0,100,4);
			playInfo.audio.volume = parseFloat(lever / 100);
			var value = document.getElementById("voiceLeverValue");
			value.lastChild.nodeValue = parseInt(playInfo.audio.volume * 100) + "%";
			//b.getSelection ? b.getSelection().removeAllRanges() : g.selection.empty();
		};
		//g.onmouseup=new Function('this.onmousemove=null');
		g.onmouseup = function(){
			g.onmousemove = null;
		};
	};

	/* 鼠标单击音量条改变音量 */
	voiceInfo.scaleBarElem.onclick=function (e){
		var click_x =(e||b.event).clientX;  //鼠标点击的x坐标
		var max_length =this.offsetWidth;  //拖动条长度px
		var scaleBarStartX = parseInt(this.offsetLeft);  //拖动条起始x
		var scaleBarEndX = scaleBarStartX + max_length;
		
		if(click_x >= scaleBarStartX && click_x <= scaleBarEndX){
			var lever = click_x - scaleBarStartX;
			voiceInfo.scaleButElem.style.left=click_x+'px';	
			voiceInfo.voiceContext.fillStyle = "#00f";
			voiceInfo.voiceContext.fillRect(0,0,lever,4);
			voiceInfo.voiceContext.fillStyle = "#c9aeff";
			voiceInfo.voiceContext.fillRect(lever,0,100,4);			
			playInfo.audio.volume = parseFloat(lever / 100);
			var value = document.getElementById("voiceLeverValue");
			value.lastChild.nodeValue = parseInt(playInfo.audio.volume * 100) + "%";
		}
		
	};
}


/* 拖动歌曲进度条拖动按钮的处理 */
function songScaleButMoveProcess(){
	var f=this,g=document,b=window,m=Math;
	var songScaleBar = g.getElementById("audioBar");
	var songScaleBut = g.getElementById("songScaleBut");
	songScaleBut.onmousedown=function (e){
		var click_x =(e||b.event).clientX;  //鼠标点击的x坐标
		var click_y = (e||b.event).clientY;
		var but_x = this.offsetLeft;     //but的x坐标
		var max_length =400-10;  //拖动条长度px
		var scaleBarStartX = parseInt(songScaleBar.offsetLeft);  //拖动条起始x
		var scaleBarEndX = scaleBarStartX + max_length;
		g.onmousemove=function (e){
			var thisY = (e||b.event).clientY;
			var thisX =(e||b.event).clientX;
			/* 当只有纵坐标发生变化时进制在新窗口打开图片 */
			if(thisY != click_y && thisX == click_x){
				songScaleBut.ondragstart = function(){
					return false;
				}
			}
			var to = but_x +(thisX - click_x);
			if(to > scaleBarEndX)
				to = scaleBarEndX
			if(to < scaleBarStartX)
			 	to = scaleBarStartX;
			var currentPos = to - scaleBarStartX;
			songScaleBut.style.left=to+'px';	
			playInfo.context.fillStyle = "#ff0";
			playInfo.context.fillRect(0,5,currentPos,10);
			playInfo.context.fillStyle = "#c9aeff";
			playInfo.context.fillRect(currentPos,5,400-currentPos,10);
			playInfo.audio.currentTime = currentPos/390*playInfo.totalTime;
			playInfo.currentTime = currentPos/390*playInfo.totalTime;
			songBarScale = true;
			//b.getSelection ? b.getSelection().removeAllRanges() : g.selection.empty();
		};
		//g.onmouseup=new Function('this.onmousemove=null');
		g.onmouseup = function(){
			g.onmousemove = null;
			//songBarScale = false;
		};
	};

	/* 单击歌曲进度条改变歌曲的播放进度 */
	songScaleBar.onclick=function (e){
		var click_x =(e||b.event).clientX;  //鼠标点击的x坐标
		var max_length = 390;  //拖动条长度px
		var scaleBarStartX = parseInt(this.offsetLeft);  //拖动条起始x
		var scaleBarEndX = scaleBarStartX + max_length;
		
		if(click_x >= scaleBarStartX && click_x <= scaleBarEndX){
			var currentPos = click_x - scaleBarStartX;
			songScaleBut.style.left=click_x+'px';	
			playInfo.context.fillStyle = "#ff0";
			playInfo.context.fillRect(0,5,currentPos,10);
			playInfo.context.fillStyle = "#c9aeff";
			playInfo.context.fillRect(currentPos,5,400-currentPos,10);
			playInfo.audio.currentTime = currentPos/390*playInfo.totalTime;
			playInfo.currentTime = currentPos/390*playInfo.totalTime;
			songBarScale = true;
		}
		
	};
}


function init(){
	playInfo.audio = document.getElementById("AudioPlayer");
	var checkBox = document.getElementById("loopPlay");
	checkBox.checked = true; /* 复选框默认勾选 */
	
	resetLoopPlay();  /* 注册是否是循环播放复选框的点击事件 */
	drawBackground();  /* 绘制进度条背景 */
	buttonClickHandle();  /* 按钮事件注册 */
	songPlayEndEventAdd(); /* 播放完成事件注册 */
	playInfo.totalTime = playInfo.audio.duration;

	var elem = document.getElementById("play_button");
	elem.setAttribute("src", playImage[1]);
	playInfo.playFlag = 1;
	playInfo.curPlaySongName = songList[0];
	musicStartPlay(true);

	/* 歌曲总时长发生改变触发事件 */
	playInfo.audio.addEventListener('durationchange', function(){
		playInfo.totalTime = playInfo.audio.duration;
		totalTimeChange = true;
	}, false);
	
	songScaleButMoveProcess();
	
	/* 音量相关 */
	voiceLevelInit();
	voiceScaleButMoveProcess(); /* 音量条拖动按钮拖动事件 */
}

addLoadEvent(init);