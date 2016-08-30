var audio = new Audio();
var timeID;

var playInfo={
	loopPlay: false,
	context: null,
	currentTime: 0,
	totalTime: 0,
	curPlayIdx: 0,
	timeID: 0,
	playFlag:1   // 2: 暂停 1：播放 0：停止
};

var playImage = ["images/Audio/play.png", "images/Audio/pause.png"];
var songList = ["musics/jiehun.wav","musics/liyugang.wav","musics/haikuotiankong.wav"];

function showSongPlayTime(play_info, total_min, total_sec){
	play_info.context.font = "bold 16px Arial";
	play_info.context.textAlign = "center";
	play_info.context.textBaseline = "middle";
	play_info.context.fillStyle = "#0000ff";
	var cur_min = parseInt(play_info.currentTime / 60);
	var cur_sec = parseInt(play_info.currentTime % 60);
	if(cur_min < 10)
		cur_min = "0" + cur_min;
	if(cur_sec < 10)
		cur_sec = "0" + cur_sec;
	var showTime = cur_min + " : " + cur_sec + " / " + total_min + " : " + total_sec;
	play_info.context.clearRect(400, 0, 160, 20);
	play_info.context.fillText(showTime, 460, 10);
}

function showProgressBarAndTime(play_info)
{
	clearInterval(play_info.timeID);
	play_info.context.fillStyle = "#c9aeff";  //先清除下进度条
	play_info.context.fillRect(0, 5, 400, 10);

	play_info.context.fillStyle = "#ffff00";
	var step = 400 / play_info.totalTime;
	var i = step * play_info.currentTime;

	var total_min = parseInt(play_info.totalTime / 60);
	var total_sec = parseInt(play_info.totalTime % 60);
	if(total_min < 10)
		total_min = "0" + total_min;
	if(total_sec < 10)
		total_sec = "0" + total_sec;

	play_info.timeID = setInterval(function(){
		if(play_info.playFlag == 0 || play_info.playFlag == 2){
			clearInterval(play_info.timeID);
			return;
		}

		if(i + step >= 400){
			play_info.context.fillRect(0, 5, 400, 10);
			play_info.context.fillStyle = "#c9aeff";
			play_info.context.fillRect(0, 5, 400, 10);
			//play_info.context.clearRect(0, 5, 400, 10);
			if(play_info.loopPlay == false){
				play_info.currentTime = 0;
				play_info.totalTime = 0;
				showSongPlayTime(play_info, "00", "00");
				clearInterval(play_info.timeID);
				return;
			}
			else{
				i = 0;
				play_info.currentTime = 0;
				audio.loop = false;
			}
		}
		play_info.context.fillRect(0, 5, i, 10);
		i += step;

		showSongPlayTime(play_info, total_min, total_sec);
		play_info.currentTime++;
		play_info.context.fillStyle = "#ffff00";
	}, 1000);
}


function drawBackground(){
	var audioBar = document.getElementById("audioBar");
	
	if(audioBar.getContext){
		var context = audioBar.getContext("2d");
		context.fillStyle = "#00a2e8";
		context.fillRect(0, 0, 400, 20);

		//context.fillStyle = "rgba(c9,ae,ff,0.5)";
		context.fillStyle = "#c9aeff";
		context.fillRect(0, 5, 400, 10);
	}

	playInfo.context = context;
	playInfo.currentTime = 0;
	showSongPlayTime(playInfo, "00", "00");  //显示时间
}


function PlayMusicTest(){
	var audioBar = document.getElementById("audioBar");
	
	if(audioBar.getContext){
		var context = audioBar.getContext("2d");
		context.fillStyle = "#00a2e8";
		context.fillRect(0, 0, 400, 20);

		//context.fillStyle = "rgba(c9,ae,ff,0.5)";
		context.fillStyle = "#c9aeff";
		context.fillRect(0, 5, 400, 10);
	}

	var AudioPlayer = document.getElementById("AudioPlayer");

	if(AudioPlayer.canPlayType("audio/wav")){
		var elem = document.getElementById("song");
		var src = elem.getAttribute("src");
		AudioPlayer.src = src;
		//audio.currentTime = 200;  /* 指定跳过的秒数 */
		//audio.volume = 0;  /* 设置音量 0：静音 1：最大音 */
		//audio.muted = true; /* 静音 */
		//audio.playbackRate = 1.0 /* 播放速度：1.0正常，>1 快进  0~1 慢放 */
		AudioPlayer.loop = true;
		/* 获得播放音乐的总时长 单位为秒 */
		var totalTime = AudioPlayer.duration;
		if(AudioPlayer.loop)
			playInfo.loopPlay = true;
		playInfo.context = context;
		playInfo.currentTime = 0;
		playInfo.totalTime = totalTime;
		showProgressBarAndTime(playInfo); //显示进度条
		showSongPlayTime(playInfo, "00", "00");  //显示时间
		//alert(parseInt(totalTime));
		AudioPlayer.play();
	}
}


function musicStartPlay(){
	if(audio.canPlayType("audio/wav")){
		var elem = document.getElementById("song");
		var src = elem.getAttribute("src");
		audio.src = src;
		//audio.currentTime = 200;  /* 指定跳过的秒数 */
		//audio.volume = 0;  /* 设置音量 0：静音 1：最大音 */
		//audio.muted = true; /* 静音 */
		//audio.playbackRate = 1.0 /* 播放速度：1.0正常，>1 快进  0~1 慢放 */
		//audio.loop = true;
		/* 获得播放音乐的总时长 单位为秒 */
		var AudioPlayer = document.getElementById("AudioPlayer");
		var totalTime = AudioPlayer.duration;
		//alert(parseFloat(audio.duration));
		//alert(AudioPlayer.duration);
		if(audio.loop)
			playInfo.loopPlay = true;
		playInfo.totalTime = totalTime;
		showProgressBarAndTime(playInfo);
		audio.play();
	}
}


function musicPause()
{
	audio.pause();
	clearInterval(playInfo.timeID);
}

function musicContinue()
{
	//audio.currentTime = parseInt(playInfo.currentTime);
	//alert(parseInt(audio.currentTime));
	var AudioPlayer = document.getElementById("AudioPlayer");
	//alert(parseInt(AudioPlayer.currentTime));
	AudioPlayer.currentTime = audio.currentTime;
	audio.
	musicStartPlay();
}

var playButtonFlag = false;
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
						playInfo.curPlayIdx = 0;
					var songUrl = songList[playInfo.curPlayIdx];
					songElem.setAttribute("src", songUrl);
					audio.currentTime = 0;
					playInfo.currentTime = 0;
					musicStartPlay();
				}
				break;
			}
			case "play_button":
			{
				curNode.onclick = function(){
					var elem = document.getElementById("play_button");
					if(playButtonFlag == true){  // 按钮呈现暂停状态点击继续播放
						playInfo.playFlag = 1;
						playButtonFlag = false;
						elem.setAttribute("src", playImage[1]);
						musicContinue();
					}else{                       // 按钮呈现播放状态点击暂停播放
						playInfo.palyFlag = 2;
						playButtonFlag = true;
						elem.setAttribute("src", playImage[0]);
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
					audio.currentTime = 0;
					playInfo.currentTime = 0;
					musicStartPlay();
				}
				break;
			}
			default:
				break;
		}
	}
}


function songPlayEndEventAdd(){
	audio.addEventListener('ended', function(){
		var elem = document.getElementById("play_button");
		elem.setAttribute("src", playImage[0]);
		playInfo.playFlag = 0;
	}, false);
}

function init(){
	drawBackground();  /* 绘制进度条背景 */
	buttonClickHandle();  /* 按钮事件注册 */
	songPlayEndEventAdd(); /* 播放完成事件注册 */
}
//addLoadEvent(PlayMusicTest);
addLoadEvent(init);
addLoadEvent(musicStartPlay);