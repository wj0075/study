## 移动端的touch事件
- PC端事件
 - click dblclick
 - mouseover mouseout mouseenter mouseleave mousedown mouseup mousemove mousewheel
 - keydown keyup
 - focus blur change submit checked selected
 - load error unload resize scroll
 - transitionend animationend
 - readystatechange
- 以上事件在移动端都存在吗？
 - keydown keyup存在吗？
 很多手机都不支持这两个事件，因为移动端是虚拟键盘，keydown和keyup在PC端经常用于验证在用户输入的过程中我们做什么事，在移动端我们有一个时间‘input’，是专门用来代替这两个事件的。
 - mouse系列的事件在移动端支持的都不好。在移动端的事件都是以手指为核心
 - click在PC端是点击（不区分是单机还是双击），在移动端也有click事件，移动端对于还是双击的需求还是很多的，所以移动端把click识别为单击（不是点击），当用户点击屏幕后手指离开，click事件并没有立马触发，而是等待了300ms，看这段时间内是否触发了第二次，如果触发了第二次就属于双击而不是单击（click）,没有触发第二次才是click=》移动端click事件存在，但是属于单击事件，所以有300ms的延迟。
 - 如何解决300ms的延迟？我们只需要引入一个js插件：fastclick.js
- 移动端有自己专门的事件（手指事件、重力感应事件。。。）
 - 单手指事件（Touch）/touchstart touchmove touchend touchcancle(意外情况导致手指操作终止会触发这个事件)
 - 多手值事件（Gesture）/gesturestart gesturechange getstureend gesturecancle