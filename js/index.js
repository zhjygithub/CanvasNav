								
	$(function(){		
			//扇形效果
			var Nav=document.getElementById('nav');
			var aLi=document.querySelectorAll('li');
			//给封面添加点击事件
			var click=true;
			aLi[aLi.length-1].onclick=function(){								
				/*
				 * i:0 1  2 3 4 5 6  7 8 9 10 11 12
				 * 度数:-90deg,-75deg,-60deg -45deg -30deg -15deg 0deg 15deg 30deg 45deg 60deg 75deg 
				 * n:-6 -5 -4 -3 -2 -1 0 1 2 3 4 5
				 */
				for(var i=0;i<aLi.length;i++){
					//拿i的值减去aLi/2得出n 的值 然后拿n的值乘以15得出各自的度数
					var n=i-aLi.length/2;
					
					if(click){
						n=n*15;
					}else{
						n=360;
					};						
						aLi[i].style.transform='rotate('+n+'deg)';					
				};
					click=!click//每点击一次就换一个值
			};
			//给每一个aLi添加点击事件
			for(i=0;i<aLi.length-1;i++){
				aLi[i].index=i;//发编号
				aLi[i].onclick=function(){
					/*点击的时候要做的事情
					 * 1·点击的那个aLi的度数为0°；
					 * 2·点击左边的所有图片依次减去15度
					 * 3·点击右边的所有图片一次加上15度（紧挨着的那个图片要加上30deg）					 * 
					 */
					var leftDeg=0;
					var rightDeg=15;
					this.style.transform='rotate(0deg)';
					//左边图片旋转
					for(var i=this.index-1;i>=0;i--){
						leftDeg-=15;
						aLi[i].style.transform='rotate('+leftDeg+'deg)';
					};
					for(var i=this.index+1;i<aLi.length;i++){
						rightDeg+=15;
						aLi[i].style.transform='rotate('+rightDeg+'deg)';
					}
				};
			};
			//气泡效果
			var canvas=document.getElementById('canvas');
			var context=canvas.getContext('2d');
				canvas.width=window.innerWidth;
				canvas.height=window.innerHeight+400;
			var balls=[];
			var colors=['#ea2a29','#574e84','#f89322','#ffea0d','#87b11d','#008253','#3277b5','#4c549f','#764394','#ca0d86'];
			var timer=null;
				/*
				 * 一个圆
				 * 1·半径不同
				 * 2·颜色不同
				 * 3·速度不同
				 * 4·位置不同	
				 * 角度转弧度
				 * 	角度*π/180
				 * 
				 */
			//在canvas上画圆
			 function draw(ball){
			 	context.beginPath();//开始的半径
			 	
			 	context.arc(ball.x,ball.y,ball.r,0,Math.PI*2);//X轴位置 Y轴位置  起始弧度 结尾弧度
			 	context.fillStyle=ball.color;//给圆填充颜色
			 	context.globalCompositeOperation='lighter';//合成  lighter代表高亮
			 	context.fill();			 	
			 };
			 // 取X和Y之间的随机数Math.round(Math.random()*(y-x)+x)
			 function random(min,max){
			 	return Math.round(Math.random()*(max-min)+min);
			 };
			 
			 var on=true;//用来让鼠标移动的时候  定时也可以跑
			 //鼠标移动事件
			 
			 canvas.onmousemove=function(ev){
			 	ev = ev || event
			 	for(i=0;i<2;i++){//在移动的时候创建两个圆就可以了
			 		var ball={
			 			x:random(-5,5)+ev.clientX,//X轴在鼠标旁边的随机位置
			 			y:random(-5,5)+ev.clientY+window.pageYOffset,//Y轴在鼠标旁边的随机位置+页面滚动条滚动的距离
			 			r:random(10,45),//圆的半径的随机数
			 			vx:Math.random()-0.5,//X轴的速度的随机数（速度只能用小数0-1之间取值）
			 			vy:Math.random()-0.5,//Y轴的速度的随机数（速度只能用小数0-1之间取值）
			 			color:colors[random(0,colors.length-1)]//颜色数组中的随机数（从第0个到最后一个的随机数）
			 		};
			 		balls.push(ball);//添加进去创建圆的每一个对象
			 		if(balls.length>300){//判断如果圆超过300个
			 			//     删除
			 			balls.shift();
			 		};			 		
			 	};	
			 	if(on){//判断 如果为真 那么就清除定时器
			 		clearInterval(timer);
					//然后再运行定时器			 		
			 		timer=setInterval(drallBall,30);
			 		on=false;
			 		
			 	};
			 					 	
			 	function drallBall(){
			 		// 清空画布  清空X， Y 画布所有的宽度，高度
			 		context.clearRect(0,0,canvas.width,canvas.height);
			 		
			 		for(i=0;i<balls.length;i++){//循环画圆，画的时候改变圆的位置以及半径，看起来圆才是动的
			 			
			 			balls[i].x+=balls[i].vx*8;//通过速度改变X轴的位置 （数值可以改变）
			 			balls[i].y+=balls[i].vy*8;//通过速度改变Y轴的位置   (数值可以改变)
			 			balls[i].r=balls[i].r*0.94;//改变半径的位置（数值可以改变，让半径变小）
			 			
			 			balls[i].index=i;//添加索引，为了在下面能够找到它，并删除掉
			 			
			 			if(balls[i].r<1){//判断如果 圆的半径小于1的话
			 						
			 						//找到对应的圆并删掉对应的圆，1个。
			 				balls.splice(balls[i].index,1);
			 				continue;//持续
			 			};			 		
			 			draw(balls[i]);//调用函数并把每一个圆作为参数传进去；
			 			
			 			if(!balls.length){
			 				clearInterval(timer);
			 				on=true;
			 			};
			 		};
			 	};
			 };
		})