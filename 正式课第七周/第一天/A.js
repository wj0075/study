function fn() {
    console.log('my name is a');
}
function sum() {
    console.log('my name is wangle');
}
module.exports = {//->在A模块中我们通过module.exports把需要供别人调取使用的方法导出(暴露出来)
    fn: fn
};