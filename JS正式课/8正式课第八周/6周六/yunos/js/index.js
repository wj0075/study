~(function () {
    var inner = document.querySelector('.inner');
    var blue = document.querySelectorAll('.blue');
    var yw = document.querySelectorAll('.yw');
    var green = document.querySelectorAll('.green');
    var aDiv = inner.querySelectorAll('div');
    function remove() {
        for( i=0;i<aDiv.length;i++){
            var cur2 = aDiv[i];
            utils.removeClass(cur2,'bl');
            cur2.style.animation='';
        }
    }
    remove();
    inner.onclick = function (e) {
        e = e||window.event;
        var target = e.target||e.srcElement,
            tar = target.tagName.toLowerCase();
        e.stopPropagation();
        remove();
        if (tar==='div'){
            utils.addClass(target,'bl');
            target.addEventListener('transitionend',function () {
                for (var i = 0; i<aDiv.length;i++){
                    var cur = aDiv[i];
                    if (cur==target){
                        continue;
                    }else {
                        utils.addClass(cur,'bl');
                        /*utils.removeClass(cur,'bl')*/
                    }
                }
               /*setTimeout(function () {
                     for( i=0;i<aDiv.length;i++){
                        var cur1 = aDiv[i];
                        utils.removeClass(cur1,'bl')
                    }
                },1000)*/
               for (i=0;i<aDiv.length;i++){
                   var cur1 = aDiv[i];
                   cur1.style.animation = 'move 1s linear '+Math.random()*1+'s 1 both'
               }
            },false)
        }

    }
})();