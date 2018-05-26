;+function($){
    $.fn.Banner =function(banner_selector,options){
        new BannerPic(banner_selector,options);
    }
    function BannerPic(banner_selector,options){
        this.init(banner_selector,options);
    }

    BannerPic.prototype = {
        constructor : BannerPic,
        init:function(banner_selector,options){
            this.index = 0;
            this.bannerWrapper = $(banner_selector);
            this.direction = options.animate?options.animate:"fade";
            this.bannerItem = this.bannerWrapper.children();
            if(options.autoPlay){
                this.autoPlay();
            }
            this.bannerItem.css("background",function(){
                var r= Math.round(Math.random()*255);
                var g= Math.round(Math.random()*255);
                var b= Math.round(Math.random()*255);
                return `rgb(${r},${g},${b})`;
            })
            this.bannerNum = this.bannerItem.length;

            this.btnNext = options.nextBtn;
            this.btnPrev = options.prevBtn;
            this.btnNext
            .on("click.changeIndex",{turn:"next"},$.proxy(this.change_index,this))
            .on("click.animation",$.proxy(this.animation,this))

            this.btnPrev
            .on("click.changeIndex",{turn:"prev"},$.proxy(this.change_index,this))
            .on("click.animation",$.proxy(this.animation,this))
        },
        change_index:function(event){
            console.log(1)
            if(this.animation.moving){
                return;
            }
            var turnList = {
                "prev":function(){
                    this.prev = this.index;
                    if(this.index==0){
                        this.index = this.bannerNum-1
                    }else{
                        this.index--;
                    }
                }.bind(this),
                "next":function(){
                    this.prev = this.index;
                    if(this.index==this.bannerNum-1){
                        this.index =0;
                    }else{
                        this.index++;
                    }
                }.bind(this)
            }
            if(!(typeof turnList[event.data.turn] == "function")) return 0;
            turnList[event.data.turn]();
        },
        animation:function(event){
            if(this.animation.moving){
                return;
            }
            if(this.prev==this.index){
                return
            }
            var animationList = {
                "slide":function(){
                    console.log(this.index,this.prev,this.animation.moving)
                    animationList.slideFadeInit();
                    this.bannerItem.eq(this.index)
                    .addClass("banner-active")
                    .css({
                        display: "none"
                    })
                    .slideDown(function(){
                        this.animation.moving = false
                    }.bind(this))
                    .siblings()
                    .removeClass("banner-active");
                }.bind(this),
                "fade":function(){
                    animationList.slideFadeInit();
                    this.bannerItem.eq(this.index)
                    .addClass("banner-active")
                    .css({
                        display:"none"
                    })
                    .fadeIn(function(){
                        this.animation.moving = false
                    }.bind(this))
                    .siblings()
                    .removeClass("banner-active");
                }.bind(this),
                "slideFadeInit":function(){
                    this.bannerItem.eq(this.prev)
                    .css({zIndex:1})
                    .siblings()
                    .css({
                        zIndex:""
                    })
                }.bind(this)
            }

            this.animation.moving = true;
            animationList[this.direction]();
        },
        autoPlay:function(){
            this.bannerWrapper.on("mouseenter",function(){
                clearInterval(this.autoTimer)
            }.bind(this))
            this.bannerWrapper.on("mouseleave",function(){
                clearInterval(this.autoTimer);
                this.autoTimer = setInterval(function(){
                    this.prev =this.index;
                    this.index =++this.index%this.bannerNum;
                    this.animation();
                }.bind(this),2000)
            }.bind(this))
            this.bannerWrapper.trigger("mouseleave")
        }
    }
}(jQuery)