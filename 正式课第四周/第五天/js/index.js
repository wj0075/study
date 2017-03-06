/**
 * Created by 39753 on 2016/11/20.
 */
/*let fn=p=>p;
let fn3=()=>'我是没有参数的';
let fn4=(n,m)=>n+m;
let fn5=(n,m)=>{
    var total=n+m;
    return total;
}
console.log(fn(3));
console.log(fn3());
console.log(fn4(2,3));
console.log(fn5(4,5))*/
/*
var fn=function(p){
    return p;
}*/
/*class Father{//定义一个类；类通过class来添加
    constructor(name,age){//构造函数通过constructor来添加
        this.name=name;
        this.age=age;
    }
    getName(){//公有的属性和方法；
        console.log(this.name+'的年龄是'+this.age+'岁了');
    }
    static like(){//static添加静态的属性和方法；注意，他是类的私有属性，实例只能使用原型上的公有属性，不能使用类的私有属性
        console.log('我是类的静态方法')
    }
}
class Son extends Father{//子类通过extends继承父类；
    constructor(name,age,color){
        super(name,age);//必须写；
        this.color=color;
    }
    getColor(){
        console.log(this.name+'喜欢的颜色是'+this.color);
    }
}
var f=new Father('珠峰培训',8);
var s=new Son('珠峰',8,'red');
console.dir(s);*/
/*
*name
*age
*color
* __proto__:
*getColor
*constructor
* __proto__:
* constructor
* getName
* __proto__:Object
* */
/*s.getName();
s.getColor();
f.getName();
Father.like();*/
/*let obj={name:'zhufeng',age:8};
let a=1;
let b='2';
let fn=p=>p;
let objOther={a,b,fn,__proto__:obj};
console.log(objOther)
console.log(objOther.name)*/
//console.log(objOther.fn(3))
/*var a='zhufeng';
 var b=8;
 var str=a+'的年龄是'+b+'岁了';
 var str2=`${a}的年龄是${b}岁了`;
 console.log(str);
 console.log(str2);*/
/*var fn=p=>console.log(p);
var obj={a:1,b:'2',fn,person:{name:'zhfueng',age:8}};
var {a,fn,person}=obj;
fn(4);
console.log(person.name)*/
/*var reactNative=require('reactNative');//{};
var {ListView,Text,Image}=reactNative;*/
//console.log(a);
//console.log(b);
//console.log(fn);

/*function fn(name,age){
    name=name||'zhufeng';
    age=age||8;
    console.log(name+'的年龄是'+age);
}*/
/*function fn(name='zhufeng',age=8){
    console.log(name+'的年龄是'+age);
}
fn('zhufeng')*/
/*function fn(age,...keys){
    var obj=Object.create(null);
    for(var i=0; i<keys.length; i++){
        obj[i]=keys[i];
    }
    return obj;
}
console.log(fn(8,'3','3px',9))*/
/*var ary=[2,54,3,18];
console.log(Math.max(...ary))*/

/*for(let i=0; i<10; i++){};
console.log(i);*/
/*const a=12;
a=14;
console.log(a);*/
console.log(a);
const a=12;






