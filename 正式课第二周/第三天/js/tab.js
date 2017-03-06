/**
 * Created by 39753 on 2016/11/3.
 */
//需求：实现隔行换色的表格排序；
//1)获取元素  2）获取数据   3）展示数据  4）表格排序
(function(){
    //1)获取元素
    var oTab=document.getElementById('tab');
    var tHead=oTab.tHead;//一个表格中只有一个表头
    var tCells=tHead.rows[0].cells;//拿到表头中的每一列；
    var tBody=oTab.tBodies[0];
    var aRows=tBody.rows;//body下所有的行；
    var data=null;
    //2）获取数据
    getData();
    function getData(){
        //1.创建xml对象
        var xml=new XMLHttpRequest;
        //2.打开地址
        xml.open('get','data.txt',false);
        //3.请求响应
        xml.onreadystatechange=function(){
            if(xml.readyState===4 && /^2\d{2}$/.test(xml.status)){
                data=utils.jsonParse(xml.responseText);
            }
        }
        //4.发送请求
        xml.send();
    }
    //3)绑定数据
    bind();
    function bind(){//动态创建的绑定（文档碎片）
        var frg=document.createDocumentFragment();
        for(var i=0; i<data.length; i++){//多少组数据，代表的是多少行；
            var cur=data[i];
            var oTr=document.createElement('tr');
            for(var attr in cur){//一组数据中，多少个键值对，代表多少列；
                var oTd=document.createElement('td');
                if(attr==='sex'){//只有当属性名为sex的时候，才进行性别判断；
                    cur[attr]=cur[attr]==0?'男':'女';
                }
                oTd.innerHTML=cur[attr];
                oTr.appendChild(oTd);
            }
            frg.appendChild(oTr);
        }
        tBody.appendChild(frg);
        frg=null;
    }
    /*function bind(){//字符串绑定数据
        var str='';
        for(var i=0; i<data.length; i++){
            var curData=data[i];
            curData.sex=curData.sex==0?'男':'女';
            str+='<tr>\
                <td>'+curData.name+'</td>\
                <td>'+curData.age+'</td>\
                <td>'+curData.score+'</td>\
                <td>'+curData.sex+'</td>\
                </tr>';
        }
        tBody.innerHTML=str;
    }*/
    //4)隔行换色
    changeColor();
    function changeColor(){//%的应用技巧：有几种情况就%几；
        for(var i=0; i<aRows.length; i++){
            aRows[i].className='bg'+i%3;
        }
    }
    /*//5.点击排序
    function sort(n){
        //比较：当前行中索引为1的这一列的内容 跟  下一行中索引为1的这一列的内容 比较；
        tCells[n].flag*=-1;
        //1.类数组转数组
        var ary=utils.makeArray(aRows);
        //2.sort排序
        ary.sort(function(a,b){
            a= a.cells[n].innerHTML;//当前行中索引为1的这一列的内容
            b= b.cells[n].innerHTML;
            if(isNaN(a) && isNaN(b)){//比较的内容是汉字；
                return a.localeCompare(b)*tCells[n].flag;
            }
            return (a-b)*tCells[n].flag;//1 -1 1 -1
        });
        //3.把数组中排好序的内容重新插入页面；
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
            tCells[i].flag=-1;//1 -1 1
            tCells[i].index=i;
            tCells[i].onclick=function(){
                sort(this.index);
            }
        }
    }*/
    //5.点击排序
    function sort(n){
        for(var i=0; i<tCells.length; i++){
            //只让当前这一列*=-1，其他列的flag都恢复成初始值-1；
            tCells[i].flag=i==n?tCells[i].flag*-1:-1;
            /*if(i==n){
                tCells[i].flag*=-1;
            }else{
                tCells[i].flag=-1;
            }*/
        }
        //tCells[n].flag*=-1;//1 -1 1
        console.log(tCells[n].flag)
        //1.类数组转数组
        var ary=utils.makeArray(aRows);
        //2.sort排序
        ary.sort(function(a,b){
            a= a.cells[n].innerHTML;
            b= b.cells[n].innerHTML;
            if(isNaN(a) && isNaN(b)){
                return a.localeCompare(b)*tCells[n].flag;
            }
            return (a-b)*tCells[n].flag;//1 -1 1 -1....
        });
        //3.把数组中排好序的内容，重新插入页面；
        var frg=document.createDocumentFragment();
        for(var i=0; i<ary.length; i++){
            frg.appendChild(ary[i]);
        }
        tBody.appendChild(frg);
        frg=null;
        changeColor();
    }
    for(var i=0; i<tCells.length; i++){
        if(tCells[i].className=='cursor'){
            tCells[i].flag=-1;//1 -1 1
            tCells[i].index=i;//把正确的i值，存在元素的自定义属性上；
            tCells[i].onclick=function(){
                sort(this.index);//排序方法
            }
        }
    }



})();