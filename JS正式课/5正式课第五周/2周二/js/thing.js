function Tab(){
    this.default = {
        /*id:this.init(opt),*/
        url:'json/data.txt',
        duration:700
    };
    this.oBox = document.getElementById(this.default.id);
    //console.log(this.oBox);


        //console.log(this.default1.id);
    //return new Tab.init();
    //console.log(this.default.id )
    //console.log(this.default);

}
Tab.prototype = {
    constructor:Tab,
    init:function(opt) {
        if (!opt.id) return;
        for (var key in opt){
            this.default[key]=opt[key]
        }
        return this.default.id;
        //this.oBox = document.getElementById(this.default.id);
        //console.log(this.default)
        console.log(this.oBox);
        //return this.default;
       // console.log(this.default);
        //console.log(this.default.id)
    }


};
