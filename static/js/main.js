window.onload = function () {

    //控制底部轮播
    var s = 0;
    $(".mainproduct img").eq(0).click(function () {
        if (s > -2) {
            s--;
            $(".b-content").css("transform", "translateX(" + s * 25 + "%)");
        }
    })
    $(".mainproduct img").eq(1).click(function () {
        if (s < 0) {
            s++;
            $(".b-content").css("transform", "translateX(" + s * 25 + "%)");
        }
    })
    //轮播图定时器
    setInterval(function () {
        if (s < 0 && s > -2) {
            if (which == 0) {
                s--;
            }
            else if (which == 1) {
                s++;
            }
            $(".b-content").css("transform", "translateX(" + s * 25 + "%)");
        }
        else if (s == -2) {
            s++;
            which = 1;
            $(".b-content").css("transform", "translateX(" + s * 25 + "%)");
        }
        else if (s == 0) {
            s--;
            which = 0;
            $(".b-content").css("transform", "translateX(" + s * 25 + "%)");
        }
    }, 4000)
    $(".c-c-warp").eq(0).fadeIn();
    $(".c-content").css("height", $(".c-c-warp").eq(0).height())
    //控制第二个导航条
    $('.spread2').click(function () {
        if ($('.product>ul').css("display") == "none")
            $('.product>ul').css("display", "block")
        else
            $('.product>ul').css("display", "none")
    })
    for (var i = 0; i < 4; i++) {
        (function (k) {

            $(".product li").eq(k).click(function () {
                $(".c-content").css("height", $(".c-c-warp").eq(k).height())
                for (var i = 0; i < 4; i++) {
                    $(".c-c-warp").eq(i).fadeOut()
                }
                $(".c-c-warp").eq(k).fadeIn();
            })
        })(i)
    }
    //监听页面滚动位置
    $(window).scroll(function () {

        if (window.scrollY >= 400) {
            $(".aboutus").animate({ "opacity": "1", "margin-top": "50" }, 500)
        }
        if (window.scrollY >= 800) {
            $(".product").animate({ "opacity": "1", "margin-top": "150" }, 500);
        }
        if (window.scrollY >= 1300) {
            $(".mainproduct").animate({ "opacity": "1" }, 500);
        }
        if (window.scrollY == undefined) {
            $(".aboutus").animate({ "opacity": "1", "margin-top": "50" }, 500);
            $(".product").animate({ "opacity": "1", "margin-top": "150" }, 500);
            $(".mainproduct").animate({ "opacity": "1" }, 500);
        }
    })
}
