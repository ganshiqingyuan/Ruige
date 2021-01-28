//控制panel
var can = 0;
var cannone = 1;
$('.panel').hover(function () {
    if (can) {
        cannone = 0;
    }
}, function () {
    cannone = 1;
    $(this).css("display", "none")
})

$(".h-header li.prod").hover(function () {
    $('.panel').css("display", "block");
    $(".panel li").css("min-height", parseInt($(".panel li:first-child").css("height")) + 10 + "px");
}, function () {
    can = 1;
    setTimeout(function () {
        can = 0;
        if (cannone) {
            $('.panel').css("display", "none")
        }
    }, 300);
})
//控制第一个导航条
$(".spread").click(function () {
    if ($('.ul').css("display") == "none") { 
        $(".ul").css("display", "block") 
        $(".drawer_container").css("background", "#cccccc")
        $(".drawer_container").css("opacity", "0.5")
    }
    else {
        $(".ul").css("display", "none")
        $(".drawer_container").css("background", "none")
        $(".drawer_container").css("opacity", "0.5")
    }
})
$(".closeBtn").click(function () {
    if ($('.ul').css("display") == "none") { 
        $(".ul").css("display", "block") 
        $(".drawer_container").css("background", "#cccccc")
        $(".drawer_container").css("opacity", "0.5")
    } else {
        $(".ul").css("display", "none")
        $(".drawer_container").css("background", "none")
        $(".drawer_container").css("opacity", "0.5")
    }
})

$(".drawer_container").click(function () {
    if ($('.ul').css("display") == "block") { 
        $(".ul").css("display", "none")
        $(".drawer_container").css("background", "none")
        $(".drawer_container").css("opacity", "0.5")
    }
})
