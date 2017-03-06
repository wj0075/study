var qq = document.querySelector('#qq');
var ctrlDown = false;
qq.onkeydown = function(e){
    var keyCode = e.keyCode;
    if(keyCode == 17){
        ctrlDown = true;
        setTimeout(function(){
          ctrlDown = false;
        },1000);
    }
    if(keyCode == 13){
        if(ctrlDown){
            qq.value = qq.value+'\n';
        }else{
            alert(qq.value);
        }
    }
}