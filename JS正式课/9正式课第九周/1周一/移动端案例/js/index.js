var swiper = new Swiper(".swiper-container",{
    direction:'vertical',
    loop:true,
    onTransitionEnd:function (swiper) {//动画结束后
        var curIndex = swiper.activeIndex;//活动滑块的索引
        var slides = swiper.slides;//所有滑块的索引。
        [].forEach.call(slides,function (item, index) {
            item.id='';
            if (index===curIndex){
                switch (index){
                    case 0:
                        item.id = 'page'+(slides.length-2);
                        break;
                    case slides.length-1:
                        item.id = 'page1';
                        break;
                    default:
                        slides[index].id = 'page'+index;
                }
                /*slides[index].id = 'page'+(curIndex+1);*/
            }
        })
    },
    /*onInit:function (swiper) {
        var slides = swiper.slides;
        slides[0].id = 'page1';
    }*/

});
var music = document.querySelector('.music');
var beyond = document.querySelector('#beyond');
window.setTimeout(function () {
    beyond.play();
    music.style.opacity = 1;
    music.className = 'music musicMove';
},1000);
music.addEventListener('click',function () {
    if (beyond.paused){
        beyond.play();
        music.className = 'music musicMove';
    }else {
        beyond.pause();
        music.className = 'music';
    }
},false);