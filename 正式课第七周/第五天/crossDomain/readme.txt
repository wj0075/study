跨域

URL中最重要的三个部分：方案、域名、端口 （origin 源）

同源请求（同域请求）：请求url中的origin与当前宿主页面url中的origin相同，那么这个请求就叫做同源请求。

跨源请求（跨域请求）：请求url中的origin与当前宿主页面url中的origin不相同，那么这个请求就叫做跨源请求。


同源策略
名词解释：浏览厂商强制添加的一种安全限制，它限制了javascript在跨域时无法完成某些操作。


因为有同源策略的存在，如何成功完成一个跨域请求？

1、如何绕过同源策略
2、从html中寻找那些可以成功加载跨域资源的标签
img
可以成功加载跨域资源，但是如果返回的跨域资源不是一张合法的图片则加载失败。
缺点：只能请求图片
script
iframe


为什么叫做jsonp？
jsonp的名称来源是根据服务器返回的数据格式定义的。
key（前端传输过来的函数名） + ("hello cross origin")
functionName(JSON data)
json data padding a function name
json data padding
json padding
jsonp

jsonp的步骤：
1、通过script标签的src属性进行前后端交互
2、提前定义一个全局函数（详见例子中showData）
3、通过请求参数把全局函数传递给服务器
4、服务器根据接收到全局函数名拼接一个执行函数的表达式，并且把返回给前端的json属性写成参数的形式（详见例子中的“hello cross origin”）
5、浏览器收到服务器响应的数据，开始执行。

jsonp的注意事项：
1、必须提前定义一个<<全局>>函数
2、只能是get方法请求
3、服务器提前定义好用于前端传输全局函数名的那个请求参数（详见例子中的key）,它有一个学名：jsonpcallback
4、服务器返回的数据格式必须遵从 “全局函数名(json数据)”，如果不满足那么该接口就不是一个标准的jsonp接口

