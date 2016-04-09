//获得对象
var pannel=document.getElementById("pannel");
var S_size=document.getElementById("selSize");
var S_speed=document.getElementById("selSpeed");
var ObtnStart=document.getElementById("btnStart");
var OdivG=document.getElementById("game");

/*键盘方向对象*/
var Diretion=new function()
{
   this.up=38;
   this.right=39;
   this.down=40;
   this.left=37;
}
var Scale =new function()
{
	this.width=20;
	this.height=20;
	this.speed=250;
	this.Score=0;
    this.ScoreStep=7;
	this.timer=null;
}

window.onload=function()
{      		
		var control=new Control();
		control.init();
		/*表格规模的变换*/
		S_size.onchange=function()
		{
			Scale.width=this.value;//此时的this指向S_size对象
			Scale.height=this.value;
			control.init();
		}
		/*运行速度的变化*/
		S_speed.onchange=function()
		{
			Scale.speed=this.value;
			Scale.ScoreStep=parseInt((1000-this.value)/100);
		}
		/*开始游戏*/
		ObtnStart.onclick=function()
		{
			control.StartGame();
			this.disabled=true;
			S_size.disabled=true;
			S_speed.disabled=true;
		}		

}


/*编写控制模块：
     1.控制表格的初始化;
	 2.控制蛇头移动的方向;
	 3.控制开始游戏;
*/

function Control()
{
	this.snake=new Snake();
	this.food=new Food();
    var me=this;
	this.init=function()
	{
		var html=[];
		html.push('<table>');
		for(var i=0;i<Scale.width;i++)
		{
			html.push('<tr>')
			for(var j=0;j<Scale.height;j++)
			{
				html.push('<td id=pos'+j+'_'+i+'></td>');//存储列的ID=POS
			}
			html.push('</tr>');
		}
		html.push('</table>');
		pannel.innerHTML=html.join("");
	}
//控制游戏开始
	this.StartGame=function()
	{
		this.snakeDir=function(ev)
		{
			var e=window.event||ev;
			me.snake.setDir(e.keyCode);
		}
	    //监听鼠标事件--控制蛇头的方向
		  if(document.attachEvent)
		{
			document.attachEvent("onkeydown",this.snakeDir);
		}
		else if(document.addEventListener)
		{
			document.addEventListener("keydown",this.snakeDir,false);
		}
		else
		{ 
			document.onkeydown=this.snakeDir;
		 }  
		this.food.creatFood();
		
		Scale.timer=setInterval(function()
		{   
		    me.snake.eatFood(me.food);
			me.snake.Move();
		},Scale.speed);//蛇运动，蛇去吃食物	
	}

}
/*构造蛇的对象
   1.蛇头有运动方向;
   2.蛇有长度;
   3.蛇吃食物;
*/
function Snake()
{
	this.position=new Array(new Pos());//用来存储蛇身的坐标
	this.init_dir=Diretion.down;//初始的蛇头方向
	var len=this.position.length;
	var me=this;
	this.Move=function()
	{
		
		var head=this.position[len-1];
		document.getElementById('pos'+me.position[0].Xlabel+'_'+me.position[0].Ylabel).className="";
		//蛇移动
		for(var i=0;i<len-1;i++)
		{
			this.position[i].Xlabel=this.position[i+1].Xlabel;
			this.position[i].Ylabel=this.position[i+1].Ylabel;
		}
		//设置头的方向
		switch (me.init_dir)
		{
		   case Diretion.up:
		        head.Ylabel--;
		        break;   
		   case Diretion.right:
		        head.Xlabel++;
		        break; 
		   case Diretion.left:
		        head.Xlabel--;
		        break; 
		   case Diretion.down:
		       head.Ylabel++;
		       break; 
		}
		this.position[len-1]=head;
		for (var num=0;num<len;num++)
		{
			for(var kk=num+1;kk<len;kk++)
			{
				if(this.position[num].Xlabel==this.position[kk].Xlabel && this.position[num].Ylabel==this.position[kk].Ylabel)
				{
					clearInterval(Scale.timer);
					alert("吃货，咬到自己啦！");
					if(Scale.Score>=0 && Scale.Score<=18)
						alert("您获得的分数是"+Scale.Score+"，继续加油哦！");
					else if(Scale.Score>18 && Scale.Score<=50)
						alert("您获得的分数是"+Scale.Score+"，很棒哦！");
					else
						alert("您获得的分数是"+Scale.Score+"，太厉害啦！");
					window.location.href="file:///D:/%E8%B4%AA%E5%90%83%E8%9B%87%E8%87%AA%E5%B7%B1%E5%86%99/%E8%B4%AA%E5%90%83%E8%9B%87.html"
					ObtnStart.disabled=false;
			        S_size.disabled=false;
			        S_speed.disabled=false;
					break;
				}
			}
		  var obj=document.getElementById('pos'+this.position[num].Xlabel+'_'+this.position[num].Ylabel);
		  if(obj)
			 obj.className="snake";//没有益处
		  else
		  {
			clearInterval(Scale.timer);
            alert('撞墙啦！！！');	
           if(Scale.Score>=0 && Scale.Score<=18)
			  alert("您获得的分数是"+Scale.Score+"，继续加油哦！");
		   else if(Scale.Score>18 && Scale.Score<=50)
			  alert("您获得的分数是"+Scale.Score+"，很棒哦！");
		   else
			  alert("您获得的分数是"+Scale.Score+"，太厉害啦！");
		  window.location.href="file:///D:/%E8%B4%AA%E5%90%83%E8%9B%87%E8%87%AA%E5%B7%B1%E5%86%99/%E8%B4%AA%E5%90%83%E8%9B%87.html"
           ObtnStart.disabled=false;
		   S_size.disabled=false;
		   S_speed.disabled=false;		  
		  }
		}			  
	}
	this.eatFood=function(food)
	{
		var head=this.position[len-1];
		var isEat=false;
		switch (me.init_dir)
		{
		   case Diretion.up:
		        if(head.Xlabel==food.position.Xlabel && head.Ylabel==food.position.Ylabel+1)
				  isEat=true;
		        break;   
		   case Diretion.right:
		        if(head.Xlabel==food.position.Xlabel-1 && head.Ylabel==food.position.Ylabel)
				  isEat=true;
		        break; 
		   case Diretion.left:
		        if(head.Xlabel==food.position.Xlabel+1 && head.Ylabel==food.position.Ylabel)
				  isEat=true;
		        break; 
		   case Diretion.down:
		        if(head.Xlabel==food.position.Xlabel && head.Ylabel==food.position.Ylabel-1)
				  isEat=true;
		       break; 
		}
		if(isEat)
		{
			//蛇吃到食物后要做的该表
			this.position[len]=new Pos(food.position.Xlabel,food.position.Ylabel);
			len++;//吃到食物后蛇的长度增加1
			Scale.Score+=Scale.ScoreStep;
			food.creatFood(this.position);
		}
		
	}
	
	//通过监听键盘设置蛇头的方向
	this.setDir=function(dir)
	{ 
		switch (this.init_dir)
		{
		   
		   case Diretion.up:
		        if(dir!=Diretion.down)
		           this.init_dir=dir;
		        break;   
		   case Diretion.right:
		        if(dir!=Diretion.left)
		        this.init_dir=dir;
		        break; 
		   case Diretion.left:
		        if(dir!=Diretion.right)
		        this.init_dir=dir;
		        break; 
		   case Diretion.down:
		        if(dir!=Diretion.up)
		        this.init_dir=dir;
		       break; 
		}
	}
	
}
/*构造食物对象
  1.食物对象有它的位置属性
  2.在随机的位置上创建食物
  3.要判断食物的位置是否和蛇对象有重合的地方
*/
function Food()
{
	this.position=new Pos();
	var x=0,y=0;
	this.creatFood=function(Spos)
	{
		//作用是将前一个食物颜色去掉
		document.getElementById('pos'+this.position.Xlabel+'_'+this.position.Ylabel).className="";
		//随机产生食物的坐标,食物的坐标不可以与蛇重合
		var isCover=false;
		do
		{
			x=parseInt(Math.random()*(Scale.width-1));
			y=parseInt(Math.random()*(Scale.height-1));
			if(Spos instanceof Array)
			{
				for (var i=0;i<Spos.length;i++)
			  {
				if(x==Spos[i].Xlabel && y==Spos[i].Ylabel)
				{
					isCover=true;
					break;
				}
			  }
			}
		}while(isCover);

		this.position=new Pos(x,y);
		this.td=document.getElementById('pos'+this.position.Xlabel+'_'+this.position.Ylabel);
		this.td.className="food";
	}
}


/*位置坐标对象*/
function Pos(x,y)
{
	this.Xlabel=0;
	this.Ylabel=0;
	if(arguments.length>=1)
		this.Xlabel=x;
	if(arguments.length>=2)
		this.Ylabel=y;
}
