/**
 * Created by 39753 on 2016/11/2.
 */
//1.获取元素  2.获取数据 3. 绑定数据 4.点击进行排序
(function(){
    //1.获取元素
    var oTab=document.getElementById('tab');
    var tHead=oTab.tHead;//获取表头
    var tCells=tHead.rows[0].cells;//获取表头中第一行的中每一列；
    var tBody=oTab.tBodies[0];//获取第一个表体
    var aRows=tBody.rows;//获取表体中的每一行；
    var data=null;
    //2.获取数据
    getData();
    function getData(){

    }
})();