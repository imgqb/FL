var ns = FL.ns("billd");
FL.import(ns, this, "Player, Map, YellowBall, Spider");
FL.import(FL, this, "Stage, LoadProgress, ImageLoader");

FL.debug = false;

var	canvas = document.querySelector("canvas");
var width = 800;
var height = 300;
var fps = 60;
var mc;
var life = 99;
var score = 0;

var stage = new Stage(canvas, width, height, fps);
stage.start();

var loadProgress = new LoadProgress(new ImageLoader());
loadProgress.x = width>>1;loadProgress.y=height>>1;
loadProgress.addEventListener("complete", function(){
	stage.removeChild(this);
	this.removeAllEventListener("complete", arguments.callee);
	loadProgress = null;
	R.images = this.loader.images; 
	init();
});
loadProgress.load(R.images);
stage.addChild(loadProgress);

stage.initMouseEvent();
stage.initKeyboardEvent();

var map, player;
var spiders = [];

setInterval(function(){
	stage.render();
}, 1000/fps);

function init(){
	map = new Map();
	map.init(1100, 400);
	stage.addChild(map);
	Spider.map = YellowBall.map = map;

	player = Player.create();
	player.map = map;
	stage.addChild(player);

	for(var i = 0; i < mapData.mc.yellow_ball.length;i ++)
	{
		pos = mapData.mc.yellow_ball[i];
		ball = YellowBall.create(pos.x, pos.y);
		stage.addChild(ball);
	}

	for(var i = 0; i < mapData.mc.spider.length;i ++)
	{
		pos = mapData.mc.spider[i];
		spider = Spider.create(pos.x, pos.y);
		stage.addChild(spider);
		spiders.push(spider);
	}
	
	stage.update = update;
	map.y = 0;
	player.pos.x = 288;
	player.pos.y = player.y = 377;
}

function update(){
	if(player.x >= Math.floor(width * .6) && map.x > width - map.width)
	{
		map.x = width * .6 - player.pos.x;
	}

	else if(player.x <= width * .4 && map.x < 0)
	{
		map.x = width * .4 - player.pos.x;
	}

	if(player.y <= Math.ceil(height * .2))
	{
		map.y = height * .2 - player.pos.y;
	}
	
	else if(player.y >= Math.floor(height * .8) && map.y > height - map.height)
	{
		map.y = height * .8 - player.pos.y;

	}

	if(player.pos.x < player.width*.5){
		player.pos.x = player.width*.5;
	}

	if(player.pos.x > map.width-player.width*.5){
		player.pos.x = map.width-player.width*.5;
	}

	for(var i = 0, l = spiders.length;i < l;i ++)
	{
		var spider = spiders[i];
		if(	spider.alive && player.hitTestObject(spider))
		{
			if(player.v.y > 0){
				player.v.y = -5;
				spider.v.y = -4;
				spider.v.x = 0;
				spider.scaleX = 1;
				spider.setCenter();
				spiders.splice(spiders.indexOf(spider), 1);
				TweenLite.to(spider, 2, {scaleX:.8, scaleY:.8, angle:10, onComplete:function(){
					stage.removeChild(spider);
				}})
				spider.alive = false;
				score += 5;
			}	
			else if(player.alive){
				player.die();
				life --;
			}
			break;
		}
	}

	document.getElementById("life").innerHTML = "life:" + life;
	document.getElementById("score").innerHTML = "score:" + score;
}