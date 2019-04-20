window.onload=function(){
		
		//控制底部轮播
		var s=0;
		$(".mainproduct img").eq(0).click(function(){
			if(s>-2){
			s--;
			$(".b-content").css("transform","translateX("+s*25+"%)");
			}
		})
			$(".mainproduct img").eq(1).click(function(){
			if(s<0){
				s++;
			$(".b-content").css("transform","translateX("+s*25+"%)");
			}
		})
		//轮播图定时器
		setInterval(function(){
			if(s<0&&s>-2){
				if(which==0){
					s--;
				}
				else if(which==1){
					s++;
				}
				$(".b-content").css("transform","translateX("+s*25+"%)");
			}
			else if(s==-2){
				s++;
				which=1;
				$(".b-content").css("transform","translateX("+s*25+"%)");
			}
			else if(s==0){
				s--;
				which=0;
				$(".b-content").css("transform","translateX("+s*25+"%)");
			}
		},4000)
		$(".c-c-warp").eq(0).fadeIn();
		$(".c-content").css("height",$(".c-c-warp").eq(0).height())
		//控制第二个导航条
		$('.spread2').click(function(){
			if($('.product>ul').css("display")=="none")
			$('.product>ul').css("display","block")
			else
			$('.product>ul').css("display","none")
		})
		for(var i=0;i<4;i++){
			(function(k){
				
			$(".product li").eq(k).click(function(){
				$(".c-content").css("height",$(".c-c-warp").eq(k).height())
				for(var i=0;i<4;i++){
					$(".c-c-warp").eq(i).fadeOut()
				}
				$(".c-c-warp").eq(k).fadeIn();
			})
			})(i)
		}
		console.log("chenggong ")
		//监听页面滚动位置
		$(window).scroll(function(){
			
			if(window.scrollY>=400){
				$(".aboutus").animate({"opacity":"1","margin-top":"50"},500)
			}
			if(window.scrollY>=800){
				$(".product").animate({"opacity":"1","margin-top":"150"},500);
				console.log(window.scrollY)
			}
			if(window.scrollY>=1300){
				$(".mainproduct").animate({"opacity":"1"},500);
				console.log(window.scrollY)
			}
			if(window.scrollY==undefined){
				$(".aboutus").animate({"opacity":"1","margin-top":"50"},500);
				$(".product").animate({"opacity":"1","margin-top":"150"},500);
				$(".mainproduct").animate({"opacity":"1"},500);
			}
		})
		
		
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
