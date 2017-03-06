## 一、ISCROLL
- 实现局部滚动的，v5.xxx版本专门为移动端准备的（动画默认都是采用的css3动画和变形效果来做的），不兼容IE低版本浏览器，如果需要兼容PC，我们可以使用其v1.xxx/v.xxx版本
- 它还有一个为开发者准备的版本，里面的功能和接口很多，我们基于这个版本可以实现很多高级的功能，例如：移动端的上啦刷新和下拉加载。
- 原理及必备条件
 - 实现局部滚动的区域需要有固定的高度，（只有这样，才会出现内容比它高的时候，有内容的溢出，才会出现所谓的局部滚动）
 - ISCROLL的原理是让滚动容器中的第一个子元素在容器中来回的运动，所以我们需要把所有内容都放在容器第一个子元素中
```
<div class='container'>
    <ul>
        li*10
    </ul>
    <ul>
        li*12 //第二个是不受iscroll的控制的。
    </ul>
</div>
```
- 当我们设置了scrollbars:true的时候，iscroll会默认的向当前滚动区域的末尾加一个div，这个div就是就是滚动条所在的区域，里面的小div就是滚动条
 ```
 <div class="iScrollVerticalScrollbar iScrollLoneScrollbar" style="position: absolute">
         <div class="iScrollIndicator"></div>
 </div>
 ```
- 我们可以自己通过样式类名获取到元素，然后设置自己想要的样式
  如果想让滚动条在滚动条的区域，我们需要给滚动条区域设置position：relative,让滚动条相当于当前区域定位。
- 默认是按照transform变形实现运动的，如果我们设置useTransform:false,将会按照控制子元素的top值来运动，但是此时我们需要给第一个子元素设置position：absolute
- 滚动条的高度都是动态计算出来的，当容器的高度或者内容的高度发生改变的时候，我们其实需要重新的计算滚动条的高度
    isCro 给当前滚动的容器绑定了resize事件，只要容器的高度变化了，is自己会重新的计算高度，不需要我们在二次的处理
    但是当内容的高度发生的时候，is没有做处理，需要我们自己调取方法做处理：menuExample.refresh();
    menuExample.scrollTo(x,y,speed)//滚动到具体的位置
    menuExample.scrollToElement(ele,speed)

- 以后研究框架或者插件：先看API和使用，通过查看HTML结构的变化等研究插件的原理 -》自己去看插件的实现代码--》尝试写出一款自己的插件。
## 二、在移动端一个应用
- 移动端对于position：fixed 的兼容性很差。
- 尤其是对于有评论框输入的部分，输入前评论区域是fixed定位的，在输入的时候调取出对应的虚拟键盘，区域上移到屏幕的中间，当输入完成，键盘消失，当评论区域还在原来的地方。
 - 保证当前页面有且只有一屏幕，三部分：导航+内容+MENU 不使用任何的定位，我只需要让三部分的高度加起来是一屏即可。内容区域高度现在是固定了，但是里面的内容比这个区域高，我们则使用ISCROLL实现局部滚动、
    解决position：fixed不兼容的问题

