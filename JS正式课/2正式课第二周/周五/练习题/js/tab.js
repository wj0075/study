~function () {
//1.获取要操作的元素2.获取数据3.绑定数据4.隔行变色5.点击排序（点击当前列进行升降序（自定义属性），其余列默认状态）
    //1.获取要操作的元素
    var tTable = document.getElementById('box');
    var tHead = tTable.tHead;//获取表头
    var tCells = tHead.rows[0].cells;//获取表头第一行中的的每一列；
    var tBody = tTable.tBodies[0];
    var tRows = tBody.rows;//获取tbody中的每一行
    var data = null;
    //2.获取数据
    getData();
    function getData() {
        var xml = new XMLHttpRequest();
        xml.open('get', 'data.txt', false);
        xml.onreadystatechange = function () {
            if (xml.readyState === 4 && /^2\d{2}$/.test(xml.status)) {
                data = utils.jsonParse(xml.responseText);
            }
        };
        xml.send();
    }
    //3.绑定数据
    bind();
    function bind() {
        //文档碎片
        var frg = document.createDocumentFragment();
        for (var i = 0; i < data.length; i++) {
            var oTr = document.createElement('tr');
            var cur = data[i];
            for (var key in cur) {
                var td = document.createElement('td');
                if(key==='sex'){
                    cur[key]=cur[key]==0?'男':'女';
                }
                td.innerHTML = cur[key];
                oTr.appendChild(td);
            }
            frg.appendChild(oTr);
        }
        tBody.appendChild(frg);
        frg = null;
    }
    //4.隔行变色
    changeBg();
    function changeBg(){
        for(var i = 0; i<tRows.length;i++){
            tRows[i].className = 'bg'+i%3;
        }
    }
    //5.点击排序
    function sort(n){
        for(var i=0; i<tCells.length; i++){
            if(n==i){
                tCells[i].flag*=-1;
            }else {
                tCells[i].flag=-1;
            }
        }
        //1.类数组转数组
        var ary = utils.makeArray(tRows);
        //2.排序
        ary.sort(function(a,b){
            a = a.cells[n].innerHTML;
            b = b.cells[n].innerHTML;
            if (isNaN(a)||isNaN(b)){
                return a.localeCompare(b)*tCells[n].flag;
            }
            return (a-b)*tCells[n].flag;
        });
        //3.重新插入
        var frg = document.createDocumentFragment();
        for(var i=0;i<ary.length;i++){
            frg.appendChild(ary[i]);
        }
        tBody.appendChild(frg);
        frg=null;
        //4.重新隔行变色
        changeBg();
    }
    for(var i = 0;i<tCells.length;i++){
        if(tCells[i].className==='cursor'){
            tCells[i].flag=-1;
            tCells[i].index = i;
            tCells[i].onclick = function(){
                sort(this.index)
            }
        }
    }


}();

