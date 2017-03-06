/**
 * Created by wj007 on 2016/11/2.
 */
//1.获取元素 2.获取数据 3.绑定数据4.点击表头进行排序
~function(){
    //1.获取元素
    var oTab = document.getElementById('tab');
    var tHead = oTab.tHead;//获取表头
    var tCells = tHead.rows[0].cells;//获取th表头中第一行中每一列
    var tBody = oTab.tBodies[0];//获取第一个表体
    var aRows = tBody.rows;//获取td每一行
    console.log(tCells);
    console.log(aRows);
    console.log(tHead);
    console.log(tBody);
    //2.获取数据
}();