/**
 * Created by 39753 on 2016/12/3.
 */
class Father{
    constructor(name,age){//构造函数
        this.name=name;
        this.age=age;
    }
    //下面：都是父类公有的；
    getName(){
        alert(this.name)
    }
}
class Gril extends Father{
    constructor(name,age,job){//子类的构造函数
        super(name,age);//一定得写；super就相当于把父类构造函数重新调用了一遍；
        this.job=job;
    }
    //下面：都是子类公有的方法，并且不对父类造成影响；
}