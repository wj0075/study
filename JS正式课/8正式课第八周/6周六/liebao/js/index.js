~(function () {
    var banner = document.querySelector('.banner');
    var bannerInner = document.querySelector('bannerInner');
    var aDiv = document.querySelectorAll('.slide');
    var objA = document.querySelector('.obj-a');
    var objB = document.querySelector('.obj-b');
    var objC= document.querySelector('.obj-c');
    var objD = document.querySelector('.obj-d');
    var n=0;
    //进来先显示第一张
    show();
    function show() {
        utils.css(aDiv[0],{zIndex:1});
        objA.style.animation ='move 1s linear 1 both';
        objB.style.animation ='move1 1s linear 1 both';
        animate({
            id: aDiv[0],
            target: {
                opacity: 1
            }
        })
    }
    setInterval(function () {
        autoMove();
    },3000)
    function autoMove() {
        if (n>=aDiv.length-1){
            n=-1;
        }
        n++;
        setBanner();
    }
    function setBanner() {
        for (var i=0;i<aDiv.length;i++){
            if (i==n){
                if (n==0){
                    objA.style.animation ='move 0.5s linear 1 both';
                    objB.style.animation ='move1 0.5s linear 1 both';
                }else {
                    objA.style.animation ='';
                    objB.style.animation ='';
                }
                if (n==1){
                    objC.style.animation ='move2 0.5s linear 1 forwards';
                    objD.style.animation ='move3 0.5s linear 1 forwards';
                }else {
                    objC.style.animation ='';
                    objD.style.animation ='';
                }
                utils.css(aDiv[i],'zIndex',1);
                animate({
                    id:aDiv[i],
                    target:{
                        opacity:1,
                    },
                    callback:function(){
                        var siblingsa = utils.siblings(this);
                        for (var j=0;j<siblingsa.length;j++){
                            utils.css(siblingsa[j],'opacity',0);
                        }
                    }
                });
            }else {
                utils.css(aDiv[i],'opacity',0)
            }
        }
    }
})();
