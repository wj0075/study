## 完成一个实战项目需要用到那些技术
- h5
- css3 less
- jq
- 数据获取，直接从腾讯的服务器上获取
- 告别字符串，用EJS数据绑定
- iscroll.js 滚动条插件
- 有关于一些SEO优化的知识

## HTML&&CSS3&&响应式布局
### HTML5
- 新增加的构建页面语义化结构的标签，以及这标签的兼容性解决
- 对于INPUT标签新增加了很多的类型：search、url、email、tel、number、range、date、time、color....
- 音视频处理，音频：audio,视频：video
- canvas   highcharts Echarts..
- 使用工具绘制  adobe edge
- svg 和字体图标
- 离线缓存 xxx.manifest (不常用)
- 本地存储（cookie\web storage）
- 对于JS方面的提高 拖拽：dragstart\draging\dragend...数据：data-xxx自定义属性来做数据存储
- websocket && webworks
- 提供一些新的API 获取地理位置信息


#### 新增加类型的优势
- 调取出最符合用户输入的键盘，方便用户的操作
- 可以让我们告别传统的正则表单验证方式，可以使用自己本身提供的CSS和JS验证方式
- 在移动端表单元素没有keyup和keydown事件，我们统一使用input事件来代替这两个事件。oInput.addEventlistener('input',fn,false);
- HTML5对于表达元素提供了一个新的属性placeholder,做文本框默认提示用的（我们需要掌握在IE浏览器中不支持这个属性，用JS来写）
## CSS3
- 选择器
- 导入网络字体包 @font-face(项目中很少用，因为耗性能和流量)
- 一些新增加的样式属性
- 对于背景的变革，
- transform变形
- transition 过渡动画:property duration time-function delay
- animation帧动画
- CSS3的盒子模型 columns实现多列布局
box-sizing:border-box\padding-box\conrent-box..
 flexbox
- @media媒体查询
## 响应式布局
- 场景宣传+webApp+微信的二次开发（webApp）+phoneGap/React Native
- hybrid模式 混合式开发
- 流式布局（pc和移动端使用的是同一套项目，我们使用@media设置条件重写样式）
- rem响应式布局（移动端和PC分开的项目，我们做移动端使用REM）
- 目前市场上很多大项目，老项目的形响应式特别的混乱：流式布局+rem+flexbbox三者结合的方式来做的

## 移动端JS和事件
-
