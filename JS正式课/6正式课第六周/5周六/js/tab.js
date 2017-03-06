function Tab(id,url){
    this.url = url;
    this.oBox = document.getElementById(id);
    this.tHead=this.oBox.tHead;
    this.tCells = this.tHead.rows[0].cells;
    this.tBody = this.oBox.tBodies[0];
    this.tRows = this.tBody.rows;
    this.data = null;
    this.init();
}
Tab.prototype={
    constructor:Tab,
    init:function(){
        //1.获取数据
        this.getData();
        //2.绑定数据
        this.bind();
        //3.各行变色
        this.changeBg();
        //4.排序
        //先遍历整个th
        this.eachTh();
        //5.排序
    },
    getData:function(){
        var _this=this;
        var xml = new XMLHttpRequest();
        xml.open('get',this.url,false);
        xml.onreadystatechange=function(){
            if (xml.readyState===4 && /^2\d{2}$/.test(xml.status)){
                _this.data = utils.jsonParse(xml.responseText)
            }
        };
        xml.send();
    },
    bind:function(){
        var frg = document.createDocumentFragment();
        for (var i=0;i<this.data.length;i++){
            var oTr = document.createElement('tr');
            var cur = this.data[i];
            for (var key in cur){
                if (key =='sex'){
                    cur[key]=cur[key]===0?'男':'女';
                }
                var oTd = document.createElement('td');
                oTd.innerHTML = cur[key];
                oTr.appendChild(oTd);
            }
            frg.appendChild(oTr);
        }
        this.tBody.appendChild(frg);
        frg = null;
    },
    changeBg:function(){
        for (var i=0;i<this.tRows.length;i++){
            this.tRows[i].className = 'bg'+(i%2+1)
        }
    },
    sort:function(n){
        var _this = this;
        for (var j=0;j<this.tCells.length;j++){
            j==n?this.tCells[j].flag*=-1:this.tCells[j].flag=-1
        }
        //1.类数组转数组
        var ary = utils.makeArray(this.tRows);
        ary.sort(function(a,b){
            a=a.cells[n].innerHTML;
            b=b.cells[n].innerHTML;
            if (isNaN(a)||isNaN(b)){
                return a.localeCompare(b)*(_this.tCells[n].flag)
            }
            return (a-b)*(_this.tCells[n].flag);
        });
        var frg = document.createDocumentFragment();
        for (var i=0;i<ary.length;i++){
            frg.appendChild(ary[i])
        }
        this.tBody.appendChild(frg);
        frg=null;
        this.changeBg();
        //2.排序
        //3.绑定数据
        //5.隔行变色
    },
    eachTh:function(){
        var _this=this;
        for (var i=0;i<this.tCells.length;i++){
            if (this.tCells[i].className=='cursor'){

                this.tCells.flag = -1;
                this.tCells[i].index=i;

                this.tCells[i].onclick=function(){
                    _this.sort(this.index)
                }
            }
        }
    }

};
