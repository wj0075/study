
function getRand(n, m) {
    return Math.round(Math.random() * (m - n) + n)
}
var str = "赵钱孙李周吴郑王冯陈楚卫蒋沈韩杨朱秦尤许吕施张孔金魏桃江曹严华";
var str1 = "一二三四五六七八九壹贰叁私肆伍陆柒把玖";
var ary = [];
for (var i = 0; i <= 99; i++) {
    var obj = {};
    obj['id'] = i;
    obj["name"] = str[getRand(0,31)]+str1[getRand(0,17)]+str1[getRand(0,17)];
    obj["sex"] = getRand(0,1);
    obj["score"] = getRand(50,99);
    ary.push(obj)
}
console.log(JSON.stringify(ary));


