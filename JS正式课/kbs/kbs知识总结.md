- lessc xxx.less xxx.min.css -x  编译LESS，编译成为正常的CSS，并且压缩
## 从服务器端请求数据（进行数据交互）
- 协议、域名、端口：当前页面的URL地址 PK，
 - 同源策略三个维度完全一致==》ajax
 - 非同源策略（跨域策略）只要有一个不相同就是非同源==》jsonp
## 目前项目中做数据绑定的方式：
- 非完全前后端分离：数据获取和绑定与JS没有啥关系。都是由后台语言来做的，PHP\JAVA(JSP)\.net(ASP.NEP)、Ruby、Python...
 - 优势：绑定的数据是可以在源代码中看到的（数据绑定都是在服务器端完成的，不需要所谓的数据JAX获取等操作，在服务器端处理完成后，推送给客户端渲染即可，）
 - 弊端：服务器的压力会非常大，而且前后端代码是混在一起。
- 完全前后端分离：后台使用什么语言和前端没有关系，我们前端开发工程师只需要按照API文档，使用AJAX/JSONP等技术从服务器端把数据获取到，在JS中使用字符串拼接，或模板引擎、“MVC”、“MVVM”，把数据展示绑定出来。
 - 弊端：使用JS做数据绑定，在页面的源代码中都看不到数据，不利于百度搜索引擎把内容收录，不利于SEO推广。
 - 字符串拼接的弊端：我们要花大量时间用来把HTML一点点的粘贴到JS中，开发效率低。JS代码和HTML代码混在一起，结构混乱，后期维护不方便。
 - 模板引擎：kTemplate\do.js\ejs\jade...
   1. 制作模板
   2. 为模板提供不同的数据
   3. 把模板字符串和数据统一交给模板引擎的框架进行处理，最后生成我们需要的HTML和数据结构
   4. 把生成的结果放在指定的容器中
   ```
   <script type="text/template/" id="calTemplate">
                       <%for(var i=0;i<calendarData.length;i++){%>
                       <%var cur=calendarData[i];%>
                       <li><a href="javascript:;">
                           <span class="week"><%=cur.weekday%></span>
                           <span class="date"><%=cur.date%></span>
                       </a></li>
                       <%}%>
                   </script>
   ```
