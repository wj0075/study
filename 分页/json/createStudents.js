function getRandom(n,m) {
    return Math.round(Math.random()*(m-n)+n);
}
var str1='赵钱孙李周吴郑王吃喝嫖赌抽坑蒙拐骗偷孔曹严华何吕施张',
    str2='一二三四五六七八九壹贰叁肆伍陆柒捌玖';
var ary=[];
for (var i=1;i<=99;i++){
    var obj={};
    obj.id=i;
    obj.name=str1[getRandom(0,25)]+str2[getRandom(0,17)]+str2[getRandom(0,17)];
    obj.sex=getRandom(0,1);
    obj.score=getRandom(58,99);
    ary.push(obj);
}
console.log(JSON.stringify(ary));
