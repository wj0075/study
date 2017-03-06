function Tab(opt){
    var options = {
        cName:'on',
        index:0
    };
    options = Object.assign({},options,opt)
    this.initVal = options;
    this.init();
    this.render();
    this.bindHandler();
}
Tab.prototype = {
    constructor:Tab,
    init(){
        this.len = this.initVal['data'].length;
        this.dataObj=this.initVal['data'];
    },
    render(){
        var tab = this.initVal['ele'];
        var ul = document.createElement('ul');
        ul.className = 'box-head';
        for (var i = 0; i < this.len; i++) {
            var li = document.createElement('li');
            if (i == this.initVal['index']) {
                li.className = this.initVal['cName'];
            }
            li.innerHTML = this.dataObj[i]['title'];
            ul.appendChild(li);
        }
        tab.appendChild(ul);
    },
    bindHandler(){
        var _this=this;
        var _tab=this.initVal['ele'];
        var _oLis = _tab.getElementsByTagName('li');
        for (let i=0;i<_this.len;i++){
            _oLis[i].onclick=function(){
                for (let j=0;j<_this.len;j++){
                    _oLis[j].className='';
                }
                _oLis[i].className=_this.initVal['cName'];
            }
        }
    }
};
