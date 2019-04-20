window.onload=function(){
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
