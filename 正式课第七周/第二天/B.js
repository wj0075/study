var a = require('./A');
function avg() {
    //arguments -> [0:1,1:2,2:3,3:4,length:4]
    return a.sum.apply(null, arguments) / arguments.length;
}
module.exports = {
    avg: avg
};
