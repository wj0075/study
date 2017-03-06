/**
 * Created by wj007 on 2016/11/20.
 */
let fn=p=>p;
console.log(fn(3));
let fn1=()=>'我没有返回值';
console.log(fn1());
let fn2 = (n,m)=>n+m;
console.log(fn2(3,4));

/*class Father{
    constructor(name,age){
        this.name = name;
        this.age = age;
    }
    getName(){//共有的属性和方法
        console.log(this.name+'的年龄是'+this.age+'岁了');
    }
    static like(){//static添加静态的属性的方法
        console.log('我是类的静态方法');//只能类能调用
    }

}
class Son extends Father{
    constructor(name,age,color){//父类的参数必须要写
        super(name,age);//必须写；
        this.color = color;
    }
    getColor(){
        console.log(this.name+'喜欢的颜色是'+this.color)
    }
}
var f = new Father('珠峰培训',8);
var s = new Son('zhu',8,'red');
s.getColor();
f.getName();
Father.like();//只能是类才能调用like*/

var obj1 = {name:'zhufen',age:8};
var a=1;
var b = '2';
var fn4=p=>p;
var objOther = {a,b,fn4,__proto__:obj1};

console.log(objOther.name);
console.log(objOther);

var a1 = 'zhufeng';
var b1 = 6;
var str=`${a1}的年龄是${b1}岁了`;
console.log(str);








