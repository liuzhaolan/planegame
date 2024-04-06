
//-----------------------------背景------------------------------------//
window.onload = function() {

  var bg1 = document.getElementById("bg1");
  var bg2 = document.getElementById("bg2");
  
   //让背景动起来
   var timerBg = setInterval(function(){
    bg1.style.top = bg1.offsetTop + 2 + "px"
    bg2.style.top = bg2.offsetTop + 2 + "px"
    if (bg1.offsetTop >= 900){
        bg1.style.top = "-900px";
    }
    if (bg2.offsetTop >= 900){
        bg2.style.top = "-900px";
    }
   },10)

//----------------------------飞机移动-----------------------------------//
var screen = document.getElementById("screen");
var plane = document.getElementById("plane");
//按下鼠标则飞机开始随鼠标移动
plane.addEventListener("mousedown", function(evt){
    var baseX = evt.pageX;
    var baseY = evt.pageY;
    var moveX=0;
    var moveY=0;
    screen.onmousemove = function(ee){
        moveX = ee.pageX - baseX;
        moveY = ee.pageY - baseY;
        baseX = ee.pageX;
        baseY = ee.pageY;
		//飞机的新位置(修改飞机样式)
        plane.style.top = plane.offsetTop + moveY + "px";
        plane.style.left = plane.offsetLeft + moveX + "px";
    }
});

plane.addEventListener("mouseup",function(){
    screen.onmousemove = null;
});

//------------------------发射子弹 (我方)------------------------------//

function bullet0() {
   this.bullet = document.createElement("div");
   this.bullet.className = "bullet";
   this.isbool = true;
   this.exist = false;
}

var bulletArray = [];

for (var i = 0; i < 100; i++) {
  var tp = new bullet0();
  bulletArray.push(tp);
}

var bulletFly = setInterval(function(){
  for (var i = 0; i < bulletArray.length; i++) {
    if (bulletArray[i].isbool === true) {
      planeBulletaudio.play();
      bulletArray[i].isbool = false;
      bulletArray[i].bullet.style.top = plane.offsetTop + "px";
      bulletArray[i].bullet.style.left = plane.offsetLeft + plane.offsetWidth/2-2 + "px";
      break;
    }
  }
}, 150);

var paint = setInterval(function(){
  for (var i = 0; i < bulletArray.length; i++) {
    bulletArray[i].bullet.style.top = parseInt(bulletArray[i].bullet.style.top) - 3 + "px";
    if (bulletArray[i].isbool === false) {
      if(bulletArray[i].exist===false){
      screen.appendChild(bulletArray[i].bullet);
      bulletArray[i].exist = true;
    }
    if (parseInt(bulletArray[i].bullet.style.top) < 0 || parseInt(bulletArray[i].bullet.style.top) > screen.offsetHeight) {
      screen.removeChild(bulletArray[i].bullet);
      bulletArray[i].isbool = true;
      bulletArray[i].exist = false;
    }
  }
}},5);
//------------------------------敌人----------------------------------//

var timeBullet = setInterval(function(){
  //创建敌人
  var enemy = document.createElement("div");
  enemy.bits=0;
  var a= parseInt(Math.random() * 3); 
  enemy.className="all";
  switch(a){
    case 0: enemy.className+=" tank";  break;
    case 1: enemy.className+=" tank2"; break; 
    case 2: enemy.className+=" tank3"; break; 
  }
  screen.appendChild(enemy);
  enemy.style.left = parseInt(Math.random()*(1000-100)+100) + "px";
  enemy.style.top = "-300px";

  var enemyFly = setInterval(function(){
    if (enemy.classList.contains("tank")) {
      enemy.style.top = enemy.offsetTop + 10 + "px";
    }else if(enemy.classList.contains("tank2")){
      enemy.style.top = enemy.offsetTop + 7 + "px";
    }
    else enemy.style.top = enemy.offsetTop + 5 + "px";
      if (enemy.offsetTop >= screen.offsetHeight){
          clearInterval(enemyFly);
          screen.removeChild(enemy);
      }
  },30)
    enemy.timer = enemyFly;
},1000)
//=================================================================//
var enemys=document.getElementsByClassName('all');
//------------------------------------敌军射子弹---------------------------------------//

function enemybullet() {
  this.bullet = document.createElement("div");
  this.bullet.className = "bullet-enemy";
  this.isbool = true;
  this.exist = false;
}

var enemybulletArray = [];

for (var i = 0; i < 100; i++) {
 var tp = new enemybullet();
 enemybulletArray.push(tp);
}

var enemybulletFly = setInterval(function(){
  for(var i=0;i<enemys.length;i++){
    for (var j = 0; j < enemybulletArray.length; j++) {
      if (enemybulletArray[j].isbool === true) {
        enemybulletArray[j].isbool = false;
        enemybulletArray[j].bullet.style.top = enemys[i].offsetTop + enemys[i].offsetHeight + "px";
        enemybulletArray[j].bullet.style.left = enemys[i].offsetLeft + enemys[i].offsetWidth/2+2 + "px";
        break;
      }
    }
  }
}, 950);

var enemypaint = setInterval(function(){
  for (var i = 0; i < enemybulletArray.length; i++) {
    enemybulletArray[i].bullet.style.top = parseInt(enemybulletArray[i].bullet.style.top) + 15 + "px";
    if (enemybulletArray[i].isbool === false) {
      if(enemybulletArray[i].exist===false){
      screen.appendChild(enemybulletArray[i].bullet);
      enemybulletArray[i].exist = true;
    }
    if (parseInt(enemybulletArray[i].bullet.style.top) > screen.offsetHeight) {
      screen.removeChild(enemybulletArray[i].bullet);
      enemybulletArray[i].isbool = true;
      enemybulletArray[i].exist = false;
    }
  }
}},23);

//------------------------------判断爆炸------------------------------------------//
function boomImg(Id,isboom){
  var slider = document.querySelector(Id);
  var frames = slider.getElementsByTagName('img');
  slider.style.width = isboom.clientWidth + 'px';
  slider.style.height = isboom.clientHeight + 'px';
  slider.style.top = isboom.offsetTop + 'px';
  slider.style.left = isboom.offsetLeft + 'px';
  slider.style.display = 'block';
  var currentFrame = 0; 
  frames[currentFrame].style.display = 'block';
  var timeBoom = setInterval(function(){
    frames[currentFrame].style.display = 'none';
    currentFrame++;
    if (currentFrame >= frames.length) {
      clearInterval(timeBoom);
      slider.style.display = 'none';
    }
    frames[currentFrame].style.display = 'block';
  },50);
}
//------------------------------判断子弹和飞机碰撞-------------------------------------//
function Check(object1,object2){
    var enemyRect = object1.getBoundingClientRect();
    var bulletRect = object2.getBoundingClientRect();
    if( bulletRect.right >= enemyRect.left &&
        bulletRect.left <= enemyRect.right &&
        bulletRect.top <= enemyRect.bottom &&
        bulletRect.bottom >= enemyRect.top) return true;
        return false;
}
var scoreValueElement = document.getElementById("value");
var count=0;
var isOverlop = setInterval(function(){
    for(var i=0;i<enemys.length;i++){
        for(var j=0;j<bulletArray.length;j++)
        {
            if(bulletArray[j].isbool===false&&bulletArray[j].exist){
                if(Check(enemys[i],bulletArray[j].bullet)){
                  enemys[i].bits++;
                  bulletArray[j].isbool=true;
                  screen.removeChild(bulletArray[j].bullet);
                  bulletArray[j].exist=false;
                  if(enemys[i].classList.contains("tank")&&enemys[i].bits==1){
                    boomImg('#boom0', enemys[i]);
                    boomaudio1.play();
                    screen.removeChild(enemys[i]);
                    clearInterval(enemys[i].enemyFly);
                    count+=2;
                  }
                  else if(enemys[i].classList.contains("tank2")&&enemys[i].bits>=3){
                    boomImg('#boom1',enemys[i]);
                    boomaudio2.play();
                    screen.removeChild(enemys[i]);
                    clearInterval(enemys[i].enemyFly);
                    count+=5;
                  }
                  else if(enemys[i].classList.contains("tank3")&&enemys[i].bits>=6){
                    boomImg('#boom2', enemys[i]);
                    boomaudio3.play();
                    screen.removeChild(enemys[i]);
                    clearInterval(enemys[i].enemyFly);
                    count+=5;
                  }
                  scoreValueElement.textContent = count;
                }

            }
        }   

    }

},10);
//==========================我方飞机和敌方飞机是否碰撞和子弹===============================//
var gameover=document.createElement("div");
var btn = document.createElement("div");
btn.className = "again";
gameover.className="over";
var isOverlop2 = setInterval(function(){
  for(var i=0;i<enemys.length;i++){
       if(Check(enemys[i],plane)){
          boomImg('#boom3',plane);
          plane.style.display = "none";
          clearInterval(bulletFly);
          setTimeout(function(){
            screen.appendChild(gameover);
            screen.appendChild(btn);
            clearInterval(isOverlop2);
          },1000)
       }
   }
},10);

var isOverlop3 = setInterval(function(){
  for(var i=0;i<enemybulletArray.length;i++){
    if(enemybulletArray[i].isbool===false&&enemybulletArray[i].exist)
       if(Check(enemybulletArray[i].bullet,plane)){
          boomImg('#boom3',plane);
          enemybulletArray[i].isbool=true;
          screen.removeChild(enemybulletArray[i].bullet);
          enemybulletArray[i].exist=false;
          plane.style.display = "none";
          clearInterval(bulletFly);
          setTimeout(function(){
            screen.appendChild(gameover);
            screen.appendChild(btn);
            clearInterval(isOverlop3);
          },1000)
       }
   }
},10); 
  
  btn.onclick = function() {
      location.reload();
  };
   //------------------------------------------------------------------------------//
   // 创建音频元素
var planeBulletaudio = new Audio();
planeBulletaudio.src = "../bullet.wav";
planeBulletaudio.load();
var boomaudio1 = new Audio();
boomaudio1.src = "../b1.wav";
boomaudio1.load();
var boomaudio2 = new Audio();
boomaudio2.src = "../b2.wav";
boomaudio2.load();
var boomaudio3 = new Audio();
boomaudio3.src = "../b3.wav";
boomaudio3.load();
var ALLsound = new Audio();
ALLsound.src = "../gamemusic.ogg";
ALLsound.load();
//--------------------背景音乐按钮---------------//
var videobtn = document.createElement("div");
videobtn.className="begin";
screen.appendChild(videobtn);
var iswhat=false;
videobtn.onclick = function() {
  if(iswhat){
    iswhat=false;
    ALLsound.pause();
    videobtn.className="begin";
  }
  else{
    iswhat=true;
    ALLsound.play();
    videobtn.className="end";
  }
};
//---------------------------------------------------//
};

