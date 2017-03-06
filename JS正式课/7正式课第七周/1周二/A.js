/**
 * Created by wj007 on 2016/12/6.
 */

function sum(){
    var total=0;
    [].forEach.call(arguments,function(item,index){
        item = Number(item);
        if (!isNaN(item)){
            total+=item;
        }
    });
    /*for (var i=0;i<arguments.length;i++){
        var cur= Number(arguments[i]);
        if (!isNaN(cur)){
            tatol+=cur;
        }
    }*/
    return total;
}
module.exports={
    sum:sum
};

