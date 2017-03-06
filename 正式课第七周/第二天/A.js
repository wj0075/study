//function sum() {
//    var total = null;
//    [].forEach.call(arguments, function (item, index) {
//        //item = Number(item);
//        //if (!isNaN(item)) {
//        //    total += item;
//        //}
//        total += item;
//    });
//    return total;
//}
function sum() {
    return eval([].join.call(arguments, '+'));
}
module.exports = {
    sum: sum
};