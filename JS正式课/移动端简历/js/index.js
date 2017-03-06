(function () {
    var swiper = new Swiper(".swiper-container",{
        direction:'vertical',
        loop:true,
        onTransitionEnd:function (swiper) {
            var curIndex = swiper.activeIndex;
            var slides = swiper.slides;
            [].forEach.call(slides,function (item,index) {
                item.id='';
                if (index==curIndex){
                    if (index==0){
                        slides[0].id='page6';
                    } else if(index==slides.length-1){
                        slides[slides.length-1].id='page1';
                    }else {
                        slides[curIndex].id='page'+index;
                    }
                }
            });
        }

    });

    /*var music = document.querySelector('.music');
    var beyond = document.querySelector('#beyond');
    window.setTimeout(function () {
        music.style.opacity=1;
        beyond.play();
        music.className = 'music musicMove';
    },1500);
    music.addEventListener('click',function () {
        if (beyond.paused){
            beyond.play();
            music.className = 'music musicMove';
        }else {
            beyond.pause();
            music.className = 'music'
        }
    })*/




})();
