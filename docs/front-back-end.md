# Reference

[JAVA 架构师笔记](https://zq99299.github.io/note-architect/ztc/01/02.html)
[前后端分离架构：Web 实现前后端分离，前后端解耦](https://segmentfault.com/a/1190000039765982)

# 简化的协作流程图

HTML + CSS + JavaScript （前端页面）
↑
静态资源由 Nginx 提供
↓
API 请求发送至
↓
Nginx 反向代理
↓
Java 后端（Spring Boot）运行在 Tomcat 中
↓
处理业务逻辑，访问数据库

# Components

## 前端：HTML/CSS/JS 构建页面，由浏览器解析。

## 工具链/构建：Node.js + NPM

1. 常用于前端开发构建工具链。

- 开发阶段前端会用 Node.js 来跑开发服务器（vite/webpack），用 vite、webpack、babel 等工具打包前端代码, 构建完后生成的静态文件再交给 Nginx 托管
- 使用 SSR（如 Next.js）进行服务端渲染

2.  替代 Java/Spring 做后端

- 用于中小项目或需要前后端统一 JS 技术栈的场景。如使用 Express.js 写 API 服务器，连接 MongoDB。

## 中间层：Nginx 提供反向代理、负载均衡和静态资源托管。
- 位于最前面，作为负载均衡、反向代理、静态资源加速
- 处理静态资源（HTML/CSS/JS/Image）直接返回给浏览器。
- 把请求（如 /api/user）转发到后端的 Spring Boot（Tomcat）服务。

## 后端逻辑：Spring Boot 用 Java 构建业务逻辑，通过 Tomcat 提供 HTTP 服务

### Java 后端开发的核心框架: Spring / Spring Boot

- 提供 REST API、业务逻辑、数据库连接、权限认证等功能。

### Tomcat：

是一个 Servlet 容器，本质是 Java Web 应用的运行平台。
Spring Boot 通常内嵌了 Tomcat，不需要手动部署。
用于运行你写的 Java 后端 API，比如用户登录、数据库查询等。

## 数据库：MongoDB 存储数据，由 MongoDB 提供。

| 组件 / 技术                   | 类型          | 所属层级        | 主要用途 / 作用                                         | 语言 / 平台     | 特点                                                               |
| ----------------------------- | ------------- | --------------- | ------------------------------------------------------- | --------------- | ------------------------------------------------------------------ |
| **HTML**                      | 前端          | 表现层          | 定义网页结构，标记页面元素                              | HTML            | 浏览器原生支持，静态标记语言，所有网页的基础                       |
| **CSS**                       | 前端          | 表现层          | 美化页面外观：布局、颜色、字体、动画等                  | CSS             | 控制页面样式，响应式设计支持强，配合预处理器可增强功能（如 SCSS）  |
| **JavaScript**                | 前端          | 行为层          | 提供网页交互功能、控制 DOM、调用 API                    | JavaScript      | 浏览器支持 + Node.js 支持，单线程异步，前后端通用                  |
| **Node.js**                   | 工具链 / 后端 | 工具链 / 应用层 | 1) 前端构建工具环境 2) 编写 JS 后端服务（如 Express）   | JavaScript / V8 | 事件驱动、非阻塞 I/O，适合高并发，NPM 包生态丰富                   |
| **Nginx**                     | 服务器        | 网络代理层      | 静态资源服务器、反向代理、负载均衡、SSL 等              | C（原生编译）   | 高性能、低资源消耗，配置灵活，广泛用于前端托管和 API 转发          |
| **Tomcat**                    | Java 容器     | 应用服务器      | Java Web 应用运行环境，支持 Servlet/JSP                 | Java            | 轻量级 Java Web 容器，支持嵌入式运行（Spring Boot 默认内嵌）       |
| **Java Spring / Spring Boot** | 后端框架      | 应用逻辑层      | 构建企业级后端服务，处理业务逻辑、数据库、提供 REST API | Java / JVM      | 模块化强、社区活跃、配置灵活，Spring Boot 开发效率高，适合大型项目 |

## Web app

# Key conceptions

- 前后端分离 (解耦) 的核心思想是：前端 Html 页面通过 Ajax 调用后端的 RestFul API 并使用 Json 数据进行交互。
- 通过 Tomcat+Ngnix(也可以中间有个 Node.js)，有效地进行解耦。并且前后端分离会为以后的大型分布式架构、弹性计算架构、微服务架构、多端化服务（多种客户端，例如：浏览器，车载终端，安卓，IOS 等等）打下坚实的基础。
  注：【在互联网架构中，
  web 服务器：一般指像 nginx，apache 这类的服务器，他们一般只能解析静态资源。
  应用服务器：一般指像 tomcat，jetty，resin 这类的服务器可以解析动态资源也可以解析静态资源，但解析静态资源的能力没有 web 服务器好。
  一般只有 Web 服务器才能被外网访问，应用服务器只能内网访问。

# JavaWeb 项目

- 前端:
  html5，css3，ajax, jquery，angularjs，bootstrap，reactjs，vuejs，webpack，less/sass，gulp，nodejs，Google V8 引擎，javascript 多线程，模块化，面向切面编程，设计模式，浏览器兼容性，性能优化等等。
  前端追求的是：页面表现，速度流畅，兼容性，用户体验等等。
- 后端:
  java 基础，设计模式，jvm 原理，spring+springmvc 原理及源码，linux，mysql 事务隔离与锁机制，oracle/mongodb，http/tcp，多线程，分布式架构（dubbo，dubbox，spring cloud），弹性计算架构，微服务架构（springboot+zookeeper+docker+jenkins），java 性能优化，以及相关的项目管理等等。
  后端追求的是：三高（高并发，高可用，高性能），安全，存储，业务等等。

# how

- 大量并发浏览器请求
- html 页面负责调用服务端接口产生数据（通过 ajax 等等，后台返回 json 格式数据，json 数据格式因为简洁高效而取代 xml,填充 html，展现动态效果，在页面上进行解析并操作 DOM）
- web/前端服务器集群 (nginx):除了接口以外的其他所有 http 请求全部转移到前端 nginx 上, nginx 放的是 css，js，图片等等一系列静态资源,负责控制页面引用 & 跳转 & 路由，前端页面异步调用后端的接口,;支持页面热部署，不用重启服务器，前端升级更无缝。nginx 中部署证书，外网使用 https 访问，并且只开放 443 和 80 端口，其他端口一律关闭（防止黑客端口扫描），内网使用 http，性能和安全都有保障。
- 应用服务器集群 (tomcat): 想象成一个数据提供者，加快整体响应速度
- 文件 / 数据库 / 缓存 / 消息队列服务器集群
-
