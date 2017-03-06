~function () {
    var tTable = document.getElementById('box');
    var tHead = tTable.tHead;
    var tCell = tHead.rows[0].cells;
    var tBody = tTable.tBodies[0];
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
                oTd.innerHTML = cur[key];
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
            tRows[i].className = 'bg' + i % 3;
        }

    }

    function sort(n) {
        for (var i = 0; i < tCell.length; i++) {
            if (i === n) {
                tCell[i].flag *= -1;
            } else {
                tCell[i].flag = -1;
            }
        }
        var ary = utils.makeArray(tRows);
        ary.sort(function (a, b) {
            a = a.cells[n].innerHTML;
            b = b.cells[n].innerHTML;
            if (isNaN(a) || isNaN(b)) {
                return a.localeCompare(b) * tCell[n].flag;
            }
            return (a - b) * tCell[n].flag;
        })
        var frg = document.createDocumentFragment();
        for (var i = 0; i < ary.length; i++) {
            frg.appendChild(ary[i])
        }
        tBody.appendChild(frg);
        frg = null;
        changeBg();
    }

    for (var i = 0; i < tCell.length; i++) {
        if (tCell[i].className === 'cursor') {
            tCell[i].flag = -1;
            tCell[i].index = i;
            tCell[i].onclick = function () {
                sort(this.index)
            }
        }
    }
}();
