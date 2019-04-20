$(document).ready(function(){
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
			$('.panel').css("display","block")
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
			if($('.h-header ul').css("display")=="none")
			$(".h-header ul").css("display","block")
			else
			$(".h-header ul").css("display","none")
		})
})
