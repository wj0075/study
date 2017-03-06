~function () {
    var table = document.getElementById('box');
    var tHead = table.tHead;
    var tCells = tHead.rows[0].cells;
    var tBody = table.tBodies[0];
    var tRows = tBody.rows;
    var data = null;
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
    console.log(data);
    bind();
    function bind() {
        var frg = document.createDocumentFragment();
        for (var i = 0; i < data.length; i++) {
            var oTr = document.createElement('tr');
            var cur = data[i];
            for (var key in cur) {
                var oTd = document.createElement('td');
                if (key === 'sex') {
                    cur[key] = cur[key] === 0 ? '男' : '女';
                }
                oTd.innerHTML = cur[key]
                oTr.appendChild(oTd);
            }
            frg.appendChild(oTr);
        }
        tBody.appendChild(frg);
        frg = null;
    }

    changeBg();
    function changeBg() {
        for (var i = 0; i < tRows.length; i++) {
            tRows[i].className = 'bg' + i % 2;
        }
    }
    function sort(n){
        for(var i=0;i<tCells.length;i++){
            i===n?tCells[i].flag*=-1:tCells[i].flag=-1;
        }
        var ary = utils.makeArray(tRows);
        ary.sort(function(a,b){
            a= a.cells[n].innerHTML;
            b= b.cells[n].innerHTML;
            if(isNaN(a)||isNaN(b)){
                return a.localeCompare(b)*tCells[n].flag;
            }
            return (a-b)*tCells[n].flag;
        });
        var frg = document.createDocumentFragment();
        for(var i=0;i<ary.length;i++){
            frg.appendChild(ary[i]);
        }
        tBody.appendChild(frg);
        frg=null;
        changeBg();
    }
    for(var i= 0;i<tCells.length;i++){
        if(tCells[i].className === 'cursor'){
            tCells[i].flag = -1;
            tCells[i].index=i;
            tCells[i].onclick=function(){
                sort(this.index)
            }
        }
    }

}();
