/**
 * Created by 39753 on 2016/11/6.
 */
//1.获取数据 2.绑定数据 3.隔行换色  4.表格排序
(function(){
    var oTab=document.getElementById('tab');
    var tHead=oTab.tHead;
    var tCells=tHead.rows[0].cells;
    var tBody=oTab.tBodies[0];
    var aRows=tBody.rows;
    var data=null;
    //1.获取数据
    (function(){
        var xml=new XMLHttpRequest;
        xml.open('get','data.txt',false);
        xml.onreadystatechange=function(){
            if(xml.readyState==4 && /^2\d{2}$/.test(xml.status)){
                data=utils.jsonParse(xml.responseText);
            }
        };
        xml.send();
    })();
    //2.绑定数据
    (function(){
        var frg=document.createDocumentFragment();
        for(var i=0; i<data.length; i++){
            var oTr=document.createElement('tr');
            for(var attr in data[i]){
                var oTd=document.createElement('td');
                if(attr==='sex'){
                    data[i][attr]=data[i][attr]==0?'男':'女';
                }
                oTd.innerHTML=data[i][attr];
                oTr.appendChild(oTd);
            }
            frg.appendChild(oTr);
        }
        tBody.appendChild(frg);
        frg=null;
    })();
    //3.隔行换色
    changeColor();
    function changeColor(){
        for(var i=0; i<aRows.length; i++){
            aRows[i].className='bg'+i%2;
        }
    }
    //4.表格排序
    function sort(n){
        for(var i=0; i<tCells.length; i++){
            if(i==n){
                tCells[i].flag*=-1;
            }else{
                tCells[i].flag=-1;
            }
        }
        //1.类数组转数组
        var ary=utils.makeArray(aRows);
        //2.sort排序
        ary.sort(function(a,b){
            a= a.cells[n].innerHTML;
            b= b.cells[n].innerHTML;
            if(isNaN(a) && isNaN(b)){
                return a.localeCompare(b)*tCells[n].flag;
            }
            return (a-b)*tCells[n].flag;
        });
        //3.把数组中排好序的元素重新插入页面；
        var frg=document.createDocumentFragment();
        for(var i=0; i<ary.length; i++){
            frg.appendChild(ary[i]);
        }
        tBody.appendChild(frg);
        frg=null;
        changeColor();
    }
    for(var i=0; i<tCells.length; i++){
        if(tCells[i].className==='cursor'){
            tCells[i].flag=-1;
            tCells[i].index=i;
            tCells[i].onclick=function(){
                sort(this.index);
            }
        }
    }
})();