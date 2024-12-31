---
order: 2
author: 
title: "Feign"
category:
  - SpringCloud
  - Feign


---

# Feign远程调用


Feign是一个声明式的Web服务客户端，它简化了使用基于HTTP的远程服务的开发。

Feign是在`RestTemplate`和`Ribbon`的基础上进一步封装，使用`RestTemplate`实现`Http`调用，使用`Ribbon`实现负载均衡。

以前利用`RestTemplate`发起远程调用的代码是这样的：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/9ca03769551f7970a73c4517d7074952.png)

存在下面的问题：

- 代码可读性差，编程体验不统一

- 参数复杂URL难以维护



Feign是一个声明式的http客户端，官方地址：https://github.com/OpenFeign/feign

其作用就是帮助我们优雅的实现http请求的发送，解决上面提到的问题。

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/0489c90e8c01db06c3e8e25c2cf26812.png)



## 2.1.Feign替代RestTemplate

Fegin的使用步骤如下：

### 1）引入依赖

我们在order-service服务的pom文件中引入feign的依赖：

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
```



### 2）添加注解

在order-service的启动类添加注解开启Feign的功能：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/307c15d119cf2e8d4439add429c523d1.png)



### 3）编写Feign的客户端

在order-service中新建一个接口，内容如下：

```java
package cn.itcast.order.client;

import cn.itcast.order.pojo.User;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient("userservice")
public interface UserClient {
    @GetMapping("/user/{id}")
    User findById(@PathVariable("id") Long id);
}
```



这个客户端主要是基于SpringMVC的注解来声明远程调用的信息，比如：

- 服务名称：userservice
- 请求方式：GET
- 请求路径：/user/{id}
- 请求参数：Long id
- 返回值类型：User

这样，Feign就可以帮助我们发送http请求，无需自己使用RestTemplate来发送了。





### 4）测试

修改order-service中的OrderService类中的queryOrderById方法，使用Feign客户端代替RestTemplate：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/00b3a6299b17e245b871a74014e119b7.png)

是不是看起来优雅多了。



### 5）总结

使用Feign的步骤：

① 引入依赖

② 添加@EnableFeignClients注解

③ 编写FeignClient接口

④ 使用FeignClient中定义的方法代替RestTemplate



<font color=LightSalmon>Feign不仅实现了远程调用，而且还是实现了负载均衡，查看依赖树：</font>

<font color=HotPink>发现Feign集成了Ribbon</font>

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/6c025066755ee2d737bf4964649ddcab.png)

 

## 2.2.自定义配置

Feign可以支持很多的自定义配置，如下表所示：

| 类型                   | 作用             | 说明                                                   |
| ---------------------- | ---------------- | ------------------------------------------------------ |
| **feign.Logger.Level** | 修改日志级别     | 包含四种不同的级别：NONE、BASIC、HEADERS、FULL         |
| feign.codec.Decoder    | 响应结果的解析器 | http远程调用的结果做解析，例如解析json字符串为java对象 |
| feign.codec.Encoder    | 请求参数编码     | 将请求参数编码，便于通过http请求发送                   |
| feign.Contract         | 支持的注解格式   | 默认是SpringMVC的注解                                  |
| feign.Retryer          | 失败重试机制     | 请求失败的重试机制，默认是没有，不过会使用Ribbon的重试 |

一般情况下，默认值就能满足我们使用，如果要自定义时，只需要创建自定义的@Bean覆盖默认Bean即可。



下面以日志为例来演示如何自定义配置。

### 2.2.1.配置文件方式

基于配置文件修改feign的日志级别可以针对单个服务：

```yaml
feign:  
  client:
    config: 
      userservice: # 针对某个微服务的配置
        loggerLevel: FULL #  日志级别 
```

也可以针对所有服务：

```yaml
feign:  
  client:
    config: 
      default: # 这里用default就是全局配置，如果是写服务名称，则是针对某个微服务的配置
        loggerLevel: FULL #  日志级别 
```



而日志的级别分为四种：

- NONE：不记录任何日志信息，这是默认值。
- BASIC：仅记录请求的方法（GET），URL（http://userservice/user/1）,  请求协议（HTTP /1.1），以及响应状态码(200)和执行时间(4ms)
- HEADERS：在BASIC的基础上，额外记录了请求和响应的头信息
- FULL：记录所有请求和响应的明细，包括头信息、请求体、元数据。



### 2.2.2.Java代码方式

也可以基于Java代码来修改日志级别，先声明一个类，然后声明一个Logger.Level的对象：

```java
public class DefaultFeignConfiguration  {
    @Bean
    public Logger.Level feignLogLevel(){
        return Logger.Level.BASIC; // 日志级别为BASIC
    }
}
```



如果要**全局生效**，将其放到启动类的@EnableFeignClients这个注解中：

```java
@EnableFeignClients(defaultConfiguration = DefaultFeignConfiguration .class) 
```



如果是**局部生效**，则把它放到对应的@FeignClient这个注解中：

```java
@FeignClient(value = "userservice", configuration = DefaultFeignConfiguration .class) 
```







## 2.3.Feign使用优化

>  Feign是声明式客户端，它只是把我们的==请求(声明)==变成HTTP请求，最终发http请求时，还是会用到别的一些组件

Feign底层发起http请求，依赖于其它的框架。其底层客户端实现包括：

- URLConnection：默认实现，==不支持连接池==

- Apache HttpClient ：支持连接池

- OKHttp：支持连接池



因此提高Feign的性能主要手段就是使用**连接池**代替默认的URLConnection。



这里我们用Apache的HttpClient来演示。

1）引入依赖

在order-service的pom文件中引入Apache的HttpClient依赖：

> 这个依赖已经被spring管理起来了，所以我们不需要管版本，只需要引就可以了

```xml
<!--httpClient的依赖 -->
<dependency>
    <groupId>io.github.openfeign</groupId>
    <artifactId>feign-httpclient</artifactId>
</dependency>
```



2）配置连接池

在order-service的application.yml中添加配置：

```yaml
feign:
  client:
    config:
      default: # default全局的配置
        loggerLevel: BASIC # 日志级别，BASIC就是基本的请求和响应信息
  httpclient:
    enabled: true # 开启feign对HttpClient的支持
    max-connections: 200 # 最大的连接数
    max-connections-per-route: 50 # 每个路径的最大连接数
```



接下来，在FeignClientFactoryBean中的loadBalance方法中打断点：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/abb4e264235626581d4acd6ad80e2246.png)

Debug方式启动order-service服务，可以看到这里的client，底层就是Apache HttpClient：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/f2912662f4a0ec6592e3ed4684ed7590.png)







总结，Feign的优化：

1.日志级别尽量用basic

2.使用HttpClient或OKHttp代替URLConnection

①  引入feign-httpClient依赖

②  配置文件开启httpClient功能，设置连接池参数



## 2.4.最佳实践

所谓最佳实践，就是使用过程中总结的经验，最好的一种使用方式。

仔细观察可以发现，Feign的客户端与服务提供者的controller代码非常相似：

feign客户端：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/868de537e2ea78ec9253c13d9ea6de98.png)

UserController：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/2c856eda05dabb96737f3ccb1ff4b4cc.png)



有没有一种办法简化这种重复的代码编写呢？

==上面这个接口最终的目的是什么：==

==是让消费者基于声明的信息，去发送一次HTTP的请求，最终这个请求到哪里啊？==

==是不是一定会到达，这个`userservice`服务对应的一个实例，最后到达`userservice`的`UsreController`。==



### 2.4.1.继承方式

一样的代码可以通过继承来共享（**契约编程**）： 

1）定义一个API接口，利用定义方法，并基于SpringMVC注解做声明。

2）Feign客户端和Controller都集成该接口



![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/678b00f03852a3f4bc6988db97c3f7bc.png)



优点：

- 简单
- 实现了代码共享

缺点：

- 服务提供方、服务消费方紧耦合

- 参数列表中的注解映射并不会继承，因此Controller中必须再次声明方法、参数列表、注解





### 2.4.2.抽取方式

将Feign的Client抽取为独立模块，并且把接口有关的POJO、默认的Feign配置都放到这个模块中，提供给所有消费者使用。

例如，将UserClient、User、Feign的默认配置都抽取到一个feign-api包中，所有微服务引用该依赖包，即可直接使用。

> UserController对外暴露了查询用户的接口，这两个微服务都想要去查询用户，以前是你写你的Client，我写我的Client；
>
> 但是将来我的微服务越来越多，十几个都来调UserService，那这个client是不是等于写了十多遍了；
>
> 重复开发



![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/a0097cfc1bdf63ca19f39b45d22b39f6.png)

> Feign调用的过程中，是不是会创建实体类，那我也帮你们定义好，省的你俩都得写实体类；
>
> 是不是以后还要写配置啊，你们也不用配了，我帮你们做一个默认配置；
>
> 这里接口肯定也不只一个，全都给你定义进来；
>
> 以后怎么用呢？引依赖，导jar包；                                  

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/d3bb46f8036d46c75b624e947da02335.png)





### 2.4.3.实现基于抽取的最佳实践

#### 1）抽取

首先创建一个module，命名为feign-api：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/23f76cb08518bd37325c4f14205021f2.png)

项目结构：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/597ffbe46c831157b7f619d53144d7d8.png)

在feign-api中然后引入feign的starter依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
```



然后，order-service中编写的UserClient、User、DefaultFeignConfiguration都复制到feign-api项目中

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/6477e2dfa1f553ca89185076a75c7f38.png)



#### 2）在order-service中使用feign-api

首先，删除order-service中的UserClient、User、DefaultFeignConfiguration等类或接口。



在order-service的pom文件中中引入feign-api的依赖：

```xml
<dependency>
    <groupId>cn.itcast.demo</groupId>
    <artifactId>feign-api</artifactId>
    <version>1.0</version>
</dependency>
```



修改order-service中的所有与上述三个组件有关的导包部分，改成导入feign-api中的包



#### 3）重启测试

重启后，发现服务报错了：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/b3b8266f3ea03a95891ba095c4e4bb57.png)

这是因为UserClient现在在cn.itcast.feign.clients包下，、

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1429b38a0ced32853e95205ecfe15253.png)

没有报错只是因为确实有这个类，但是没有被注册进spring容器；

```
为什么？
OrderApplication启动类扫描的是自己所在的包，也就是package cn.itcast.order；
```



#### 4）解决扫描包问题

方式一：

指定Feign应该扫描的包：

```java
@EnableFeignClients(basePackages = "cn.itcast.feign.clients")
```



方式二：

指定需要加载的Client接口（**各种各样的**）：

```java
@EnableFeignClients(clients = {UserClient.class})
```

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/a7e707f5cc22e8a1ae02e742ace28f3d.png)

成功！

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/d33e47e1a0e2bcd36771ebe0e22cdfaa.png)



