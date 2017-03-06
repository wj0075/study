//1.获取元素 2.获取数据 3.绑定数据4.点击表头进行排序
//思路：1.获取元素2.获取数据3.绑定数据4.点击排序（要注意升降序排列，添加自定义属性的方法，让这一列拥有flag=-1,然后在进行排序时，让他*=-1；重新插入）5.优化（让每一列点击时，这一列进行排序，当内容为数字时进行数字的排序；当每一列为乱序时点击可以实现升序的排列，需要判断不是执行的这一列。让它们的flag恢复到默认值为-1；）
~function () {
    //1.获取元素
    var oTab = document.getElementById('tab');
    var tHead = oTab.tHead;//获取表头
    var tCells = tHead.rows[0].cells;//获取th表头中第一行中每一列
    var tBody = oTab.tBodies[0];//获取第一个表体
    var aRows = tBody.rows;//获取td每一行
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

    bind();
    function bind() {
        var frg = document.createDocumentFragment();
        for (var i = 0; i < data.length; i++) {
            var oTr = document.createElement('tr');
            var cur = data[i];
            for (var key in cur) {
                var oTd = document.createElement('td');
                if (key == 'sex') {
                    cur[key] = cur[key] == 0 ? '男' : '女';
                }
                oTd.innerHTML = cur[key];
                oTr.appendChild(oTd);
            }
            frg.appendChild(oTr);
        }
        tBody.appendChild(frg);
        frg = null;
    }

    /*function bind(){
     var str = '';
     for(var i = 0;i < data.length;i++){
     var cur = data[i];
     cur.sex=cur.sex==0?'男':'女';
     str+='<tr>\
     <td>'+cur.name+'</td>\
     <td>'+cur.age+'</td>\
     <td>'+cur.score+'</td>\
     <td>'+cur.sex+'</td>\
     </tr>'
     }
     tBody.innerHTML=str;
     }*/
    changeBg();
    function changeBg() {
        for (var i = 0; i < aRows.length; i++) {
            if (i % 2 === 1) {
                aRows[i].className = 'bg1';
            } else {
                aRows[i].className = 'bg2'
            }
        }
    }

    function sort(n) {
        var ary = utils.makeArray(aRows);
        for(var i=0;i<tCells.length;i++){
            i===n?tCells[i].flag*=-1:tCells[i].flag=-1;
            //if (i==n){
            //    tCells[i].flag *= -1;
            //}else {
            //    tCells[i].flag = -1;
            //}
        }

        ary.sort(function (a, b) {
            a = a.cells[n].innerHTML;
            b = b.cells[n].innerHTML;
            if (isNaN(a) && isNaN(b)) {
                return a.localeCompare(b) * tCells[n].flag;
            }
            return (a - b) * tCells[n].flag;
        });
        var frg = document.createDocumentFragment();
        for (var i = 0; i < ary.length; i++) {
            frg.appendChild(ary[i]);
        }
        tBody.appendChild(frg);
        frg = null;
    }

    for (var i = 0; i < tCells.length; i++) {
        if (tCells[i].className == 'cursor') {
            tCells[i].flag = -1;
            tCells[i].index = i;
            tCells[i].onclick = function () {
                sort(this.index);
                changeBg();
            };
        }
    }


    /* tCells[1].onclick = function(){
     //1.类数组转数组
     var ary = utils.makeArray(aRows);
     //2.根据每一行的第二列内容进行排序
     ary.sort(function(a,b){
     return (a.cells[1].innerHTML- b.cells[1].innerHTML)
     });
     //3.重新在插进去
     var frg = document.createDocumentFragment();
     for(var i = 0; i < ary.length; i++){
     frg.appendChild(ary[i]);
     }
     tBody.appendChild(frg);
     frg=null;

     changeBg();
     }*/


}();