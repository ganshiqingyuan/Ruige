window.onload=function(){
	var which=1;
		var s=0;
		imgfade(s)
		function swift(){
			if(s==3){
				which=-1;
			}
			else if(s==0){
			which=1;
			}
			s=s+which;
			imgfade(s);
		}
		
		function imgfade(ss){
			console.log(which)
			console.log(s)
			$(".pro-con>span>div img").stop();
			$(".pro-con>span>div").stop()
			$(".pro-con>span>div img").css("opacity","0")
			$(".pro-con>span>div").css("display","none")
			if(ss==2){
					$(".imgthree").css("display","block");
					$(".imgthree h3").css({"transform":"translateX(70px)","opacity":"0"})
				    $(".imgthree span.in-foot").css({"transform":"translateX(70px)","opacity":"0"})
				    $(".imgthree span.in-content").css({"opacity":"0"})
				    $(".imgthree span.href").css({"transform":"translateX(70px)","opacity":"0"})
					$(".imgthree img").animate({opacity:"1"},500)
					setTimeout(function(){
						$(".imgthree h3").css({"transform":"translateX(0px)","opacity":"1",})
						setTimeout(function(){
						$(".imgthree span.in-foot").css({"transform":"translateX(0)","opacity":"1"})
						setTimeout(function(){
							$(".imgthree span.in-content").css({"opacity":"1"})
				            $(".imgthree span.href").css({"transform":"translateX(0)","opacity":"1"})
						},300)
					},300)
					},500)
				
			}
			else if(ss==3){
					$(".imgfour").css("display","block");
					$(".imgfour h3").css({"transform":"translateX(-70px)","opacity":"0"})
				    $(".imgfour span.in-foot").css({"transform":"translateX(-70px)","opacity":"0"})
				    $(".imgfour span.in-content").css({"opacity":"0"})
				    $(".imgfour span.href").css({"transform":"translateX(-70px)","opacity":"0"})
				    setTimeout(function(){
					$(".imgfour h3").css({"transform":"translateX(0px)","opacity":"1",})
					setTimeout(function(){
						$(".imgfour span.in-foot").css({"transform":"translateX(0)","opacity":"1"})
						setTimeout(function(){
							$(".imgfour span.in-content").css({"opacity":"1"})
				            $(".imgfour span.href").css({"transform":"translateX(0)","opacity":"1"})
				            $(".imgfour img").animate({opacity:"1"},1000)
						},300)
					},300)
				},100)
			}
			else if(ss==1){
				$(".imgtwo").css("display","block");
				$(".imgtwo h3").css({"transform":"translateX(-70px)","opacity":"0"})
				$(".imgtwo span.in-foot").css({"transform":"translateX(-70px)","opacity":"0"})
				$(".imgtwo span.in-content").css({"opacity":"0"})
				$(".imgtwo span.href").css({"transform":"translateX(-70px)","opacity":"0"})
				setTimeout(function(){
					$(".imgtwo h3").css({"transform":"translateX(0px)","opacity":"1",})
					setTimeout(function(){
						$(".imgtwo span.in-foot").css({"transform":"translateX(0)","opacity":"1"})
						setTimeout(function(){
							$(".imgtwo span.in-content").css({"opacity":"1"})
				            $(".imgtwo span.href").css({"transform":"translateX(0)","opacity":"1"})
				            $(".imgtwo img").animate({opacity:"1"},1000)
						},300)
					},300)
				},100)
			}
			else{
				$(".img").css("display","block");
				$(".img span.in-content").css({'margin-left':"70px","opacity":"0"})
				$(".img h3").css({'margin-left':"70px","opacity":"0"})
				$(".img span.in-foot3").css({'margin-left':"70px","opacity":"0"})
				$(".img span.in-foot2").css({"opacity":"0"})
				$(".img span.in-foot1").css({"opacity":"0"})
				$(".img span.href").css({"opacity":"0","margin-left":"70px"})
					$(".img img:last").animate({opacity:"1"},500,function(){
						$(".img span.in-content").animate({"opacity":"1","margin-left":"0"},400,function(){
							$(".img h3").animate({"opacity":"1",'margin-left':"0"},300)
							$(".img span.in-foot3").animate({"opacity":"1",'margin-left':"0"},200,function(){
								$(".img span.href").animate({"opacity":"1","margin-left":"0"},300)
								$(".img span.in-foot2").animate({"opacity":"1"},300)
								$(".img img:first").animate({opacity:"1"},300)
				                $(".img span.in-foot1").animate({"opacity":"1"},100)
							})
						})
					})
			}           
		}
		//初始化轮播
		//轮播图定时器
		var swipt=setInterval(swift,5000)
		//轮播左右移动
		$(".pro-top p:first").click(function(){
			if(s>0&&s<3){
				s--;
			}
			else if(s==3){
				s=2
			}
			else if(s==0){
				which=-1
				s=3;
			}
			imgfade(s)
		})
		$(".pro-top p:last").click(function(){
			if(s>0&&s<3){
				s++
			}
			else if(s==3){
				s=0;
				which=1;
			}
			else if(s==0){
				s=1
			}
			imgfade(s)
		})
		//控制轮播图里的圆圈
		for(var i=0;i<4;i++){
			(function(k){
				$(".four li").eq(k).hover(function(){
					s=k;
					imgfade(s)
					clearInterval(swipt);
		},function(){
			swipt=setInterval(swift,5000)
		})
			})(i)
		}
		//初始化chose里状态考虑兼容性
		for(var i=0;i<$(".chose li").length;i++){
			(function(k){
				$(".chose li").eq(k).children().eq(0).css("transform","translateY(+150%)");
			    $(".chose li").eq(k).children().eq(1).css("transform","translateY(-150%)");
			})(i)
		}
		//控制chose里面动画
		for(var i=0;i<$(".chose li").length;i++){
			(function(k){
				$(".chose li").eq(k).hover(function(){
			$(this).children().eq(0).css("transform","translateY(0)");
			$(this).children().eq(1).css("transform","translateY(0)");
		},function(){
			$(this).children().eq(0).css("transform","translateY(+150%)");
			$(this).children().eq(1).css("transform","translateY(-150%)");
		})
			})(i)
		}
		console.log(document.body.clientWidth)
		
		
		//控制panel
		var can=0;
		var cannone=1;
		$('.panel').hover(function(){
			if(can){
				cannone=0;
			}
		},function(){
			cannone=1;
			$(this).css("display","none")
		})
		
		$(".h-header li.prod").hover(function(){
			$('.panel').css("display","block");
			$(".panel li").css("min-height",parseInt($(".panel li:first-child").css("height"))+10+"px");
		},function(){
			can=1;
			setTimeout(function(){
				can=0;
				if(cannone){
					$('.panel').css("display","none")
				}
			},300);
		})
		//控制第一个导航条
		$(".spread").click(function(){
			console.log("123");
			if($('.h-header ul').css("display")=="none")
			{$(".h-header ul").css("display","block")}
			else
			{
			$(".h-header ul").css("display","none")
			}
		})
		//控制面板高度
}
