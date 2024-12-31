---
order: 3
author: 
title: "配置中心"
category:
  - Nacos
  - 配置中心
  - 负载均衡


---

## 1.Nacos配置管理

Nacos除了可以做注册中心，同样可以做配置管理来使用。



### 1.1.统一配置管理

当微服务部署的实例越来越多，达到数十、数百时，逐个修改微服务配置就会让人抓狂，而且很容易出错，==你还得重启==。我们需要一种统一配置管理方案，可以集中管理所有实例的配置。

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/d4dce5e853575598871cda222c9c62d1.png)



Nacos一方面可以将配置集中管理，另一方可以在配置变更时，及时通知微服务，实现==配置的热更新==。



#### 1.1.1.在nacos中添加配置文件

如何在nacos中管理配置呢？

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/9031c07d87c9dc8b06d6d345ed1322f6.png)

然后在弹出的表单中，填写配置信息：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/9d4734f3215e5521bab58f4a6de2e6dc.png)



> 注意：项目的核心配置，**需要热更新的配置**才有放到nacos管理的必要。基本不会变更的一些配置还是保存在微服务本地比较好。

比如一些==开关逻辑==放在这比较好，true就处理，false就不处理。



#### 1.1.2.从微服务拉取配置

**无法注入的在UserController上添加@RefreshScope就可以了**

微服务要拉取nacos中管理的配置，并且与本地的application.yml配置合并，才能完成项目启动。

但如果尚未读取application.yml，又如何得知nacos地址呢？

因此spring引入了一种新的配置文件：bootstrap.yaml文件，会在application.yml之前被读取，流程如下：



1）引入nacos-config依赖

首先，在user-service服务中，引入nacos-config的客户端依赖：

```xml
<!--nacos配置管理依赖-->
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
</dependency>
```

2）添加bootstrap.yaml

然后，在user-service中添加一个bootstrap.yaml文件，内容如下：

```yaml
spring:
  application:
    name: userservice # 服务名称
  profiles:
    active: dev #开发环境，这里是dev 
  cloud:
    nacos:
      server-addr: localhost:8848 # Nacos地址
      config:
        file-extension: yaml # 文件后缀名
```

这里会根据spring.cloud.nacos.server-addr获取nacos地址，再根据

`${spring.application.name}-${spring.profiles.active}.${spring.cloud.nacos.config.file-extension}`作为文件id，来读取配置。

本例中，就是去读取`userservice-dev.yaml`：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/6d4c3cfb995f7f57ccc84baca7336971.png)



3）读取nacos配置

在user-service中的UserController中添加业务逻辑，读取pattern.dateformat配置：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/27c7455fce8f983563efcab933e41d6e.png)



完整代码：

```java
package cn.itcast.user.web;

import cn.itcast.user.pojo.User;
import cn.itcast.user.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Slf4j
@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Value("${pattern.dateformat}")
    private String dateformat;
    
    @GetMapping("now")
    public String now(){
        return LocalDateTime.now().format(DateTimeFormatter.ofPattern(dateformat));
    }
    // ...略
}
```



在页面访问，可以看到效果：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/928b94d3b66b79a96bd10943a6d6a606.png)



### 1.2.配置热更新

我们最终的目的，是修改nacos中的配置后，微服务中无需重启即可让配置生效，也就是**配置热更新**。

```yaml
pattern:
  dateformat: yyyy年-MM月-dd日 HH:mm:ss
```

我们没有重启微服务，但发生了自动更新。

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/6c6278fe0f14d1f030bc4f92562d5d4b.png)

要实现配置热更新，可以使用两种方式：

#### 1.2.1.方式一

在@Value注入的变量所在类上添加注解@RefreshScope：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1f53b425a3ab3b25063af7860ae1f032.png)



#### 1.2.2.方式二（在属性注入时，推荐configurationpropertis，维护起来也方便）

使用@ConfigurationProperties注解代替@Value注解。

在user-service服务中，添加一个类，读取patterrn.dateformat属性：

```java
package cn.itcast.user.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@Data
@ConfigurationProperties(prefix = "pattern")
public class PatternProperties {
    private String dateformat;
}
```



在UserController中使用这个类代替@Value：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/e76d0659cbec36e317866b3533253f33.png)



完整代码：

```java
package cn.itcast.user.web;

import cn.itcast.user.config.PatternProperties;
import cn.itcast.user.pojo.User;
import cn.itcast.user.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Slf4j
@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private PatternProperties patternProperties;

    @GetMapping("now")
    public String now(){
        return 			         LocalDateTime.now().format(DateTimeFormatter.ofPattern(patternProperties.getDateformat()));
    }

    // 略
}
```





### 1.3.配置共享

其实微服务启动时，会去nacos读取多个配置文件，例如：

- `[spring.application.name]-[spring.profiles.active].yaml`，例如：userservice-dev.yaml

- `[spring.application.name].yaml`，例如：userservice.yaml

而`[spring.application.name].yaml`不包含环境，因此可以被多个环境共享。



下面我们通过案例来测试配置共享



#### 1）添加一个环境共享配置

我们在nacos中添加一个userservice.yaml文件：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/89910479e9102e7996dff95d700521ee.png)



#### 2）在user-service中读取共享配置

在user-service服务中，修改PatternProperties类，读取新添加的属性：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/361a80b95675bc404b8c78fdb3d3cec6.png)

在user-service服务中，修改UserController，添加一个方法：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/9c77d3bfeb08d028df352ae3d9709541.png)



#### 3）运行两个UserApplication，使用不同的profile

修改UserApplication2这个启动项，改变其profile值：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/d8f21b30e6d7d9bde9856a282d83c5be.png)



![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/b790de898350bc66dafe1dece2f4df78.png)



这样，UserApplication(8081)使用的profile是dev，UserApplication2(8082)使用的profile是test。

启动UserApplication和UserApplication2

访问http://localhost:8081/user/prop，结果：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/f319f955c9cef639ca9b1f4d71ae396c.png)

访问http://localhost:8082/user/prop，结果：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/71edddd72b966284382c222b4865afe8.png)

可以看出来，不管是dev，还是test环境，都读取到了envSharedValue这个属性的值。



### 4）配置共享的优先级

当nacos、服务本地同时出现相同属性时，优先级有高低之分：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/fefd67e1f779f6a39ecd79f0b4a96a33.png)

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/c5810abd1046aa74dca3cb20524ebe3b.png)

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/2f6d7ae8bc8950c3715f6f4717052352.png)

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/78325d48c62d653d175acedbfbeb94d1.png)





### 2.6.优化



- 实际部署时，需要给做反向代理的nginx服务器设置一个域名，这样后续如果有服务器迁移nacos的客户端也无需更改配置.

- Nacos的各个节点应该部署到多个不同服务器，做好容灾和隔离









# 3.Gateway服务网关

Spring Cloud Gateway 是 Spring Cloud 的一个全新项目，该项目是基于 Spring 5.0，Spring Boot 2.0 和 Project Reactor 等响应式编程和事件流技术开发的网关，它旨在为微服务架构提供一种简单有效的统一的 API 路由管理方式。



## 3.1.为什么需要网关

> **前言：**
>
> 当微服务内部有相互调用关系时，我们就可以利用Feign这样一个组件去做了；
>
> 当外部有请求时，直接发请求到我们的微服务就行了；？？？
>
> 不是所有的都是对外公开的，一些是内部使用的；
>
> 需要对用户的身份进行验证；

Gateway网关是我们服务的守门神，所有微服务的统一入口。

网关的**核心功能特性**：

- <font color=Plum>请求路由</font>
- <font color=MediumPurple>权限控制</font>
- <font color=Purple>限流</font>

> 小Tips：
>
> Feign的负载均衡是解决微服务内之间调用，
>
> 然后gateway负载均衡是解决客户端访问服务端的调用

架构图：

![image-20210714210131152](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/5db4df28837f7bb3168848fe545e3141.png)



**权限控制**：网关作为微服务入口，需要校验用户是是否有请求资格，如果没有则进行拦截。

**路由和负载均衡**：一切请求都必须先经过gateway，但网关不处理业务，而是根据某种规则，把请求转发到某个微服务，这个过程叫做路由。当然路由的目标服务有多个时，还需要做负载均衡。

**限流**：当请求流量过高时，在网关中按照下流的微服务能够接受的速度来放行请求，避免服务压力过大。



在SpringCloud中网关的实现包括两种：

- gateway
- zuul

Zuul是基于Servlet的实现，属于阻塞式编程。而SpringCloudGateway则是基于Spring5中提供的WebFlux，属于响应式编程的实现，具备更好的性能。





## 3.2.gateway快速入门

下面，我们就演示下网关的基本路由功能。基本步骤如下：

1. 创建SpringBoot工程gateway，引入网关依赖
2. 编写启动类  
3. 编写基础配置和路由规则
4. 启动网关服务进行测试



### 1）创建gateway服务，引入依赖

创建服务：

![image-20210714210919458](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/35dbc60a356f71c5b2a6d7a13f3b8a58.png)

引入依赖：

<font color=PaleVioletRed>starter依赖---也就是自动装配</font>

```xml
<!--网关-->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-gateway</artifactId>
</dependency>
<!--nacos服务发现依赖-->
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
</dependency>
```



### 2）编写启动类

```java
package cn.itcast.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class GatewayApplication {

	public static void main(String[] args) {
		SpringApplication.run(GatewayApplication.class, args);
	}
}
```



### 3）编写基础配置和路由规则

创建application.yml文件，内容如下：

```yaml
server:
  port: 10010 # 网关端口
spring:
  application:
    name: gateway # 服务名称
  cloud:
    nacos:
      server-addr: localhost:8848 # nacos地址
    gateway:
      routes: # 网关路由配置
        - id: user-service # 路由id，自定义，只要唯一即可
          # uri: http://127.0.0.1:8081 # 路由的目标地址 http就是固定地址
          uri: lb://userservice # 路由的目标地址 lb就是负载均衡，后面跟服务名称
          predicates: # 路由断言，也就是判断请求是否符合路由规则的条件
            - Path=/user/** # 这个是按照路径匹配，只要以/user/开头就符合要求
        - id: order-service
		  #uri: http://localhost:8080
          uri: lb://orderservice
          predicates:
           - Path=/order/**
```



我们将符合`Path` 规则的一切请求，都代理到 `uri`参数指定的地址。

本例中，我们将 `/user/**`开头的请求，代理到`lb://userservice`，lb是负载均衡，根据服务名拉取服务列表，实现负载均衡。



### 4）重启测试

重启网关，访问http://localhost:10010/user/1时，符合`/user/**`规则，请求转发到uri：http://userservice/user/1，得到了结果：

![image-20210714211908341](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/9a0abd0474c75825780b99a7fb3b1857.png)





### 5）网关路由的流程图

整个访问的流程如下：

![image-20210714211742956](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/e79fa391abca2a8df8ea3915ff60f7b2.png)



总结：

网关搭建步骤：

1. 创建项目，引入nacos服务发现和gateway依赖

2. 配置application.yml，包括服务基本信息、nacos地址、路由

路由配置包括：

1. 路由id：路由的唯一标示

2. 路由目标（uri）：路由的目标地址，http代表固定地址，lb代表根据服务名负载均衡

3. 路由断言（predicates）：判断路由的规则，

4. 路由过滤器（filters）：对请求或响应做处理



接下来，就重点来学习路由断言和路由过滤器的详细知识





## 3.3.断言工厂

我们在配置文件中写的断言规则只是字符串，这些字符串会被Predicate Factory读取并处理，转变为路由判断的条件

例如Path=/user/**是按照路径匹配，这个规则是由处理的

`org.springframework.cloud.gateway.handler.predicate.PathRoutePredicateFactory`类来

```yaml
      - id: user-service
#        uri: http://localhost:8081
        uri: lb://userservice
        predicates:
          - Path=/user/**
          - After=2024-01-20T17:42:47.789-07:00[America/Denver]
```

![image-20230610102944484](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/ed2d94d52e2fd81d748c6dab979818a5.png)

![image-20230610103010625](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/03a64bf97086d445e2d45f14da0f6a28.png)

像这样的断言工厂在SpringCloudGateway还有十几个:

| **名称**   | **说明**                       | **示例**                                                     |
| ---------- | ------------------------------ | ------------------------------------------------------------ |
| After      | 是某个时间点后的请求           | -  After=2037-01-20T17:42:47.789-07:00[America/Denver]       |
| Before     | 是某个时间点之前的请求         | -  Before=2031-04-13T15:14:47.433+08:00[Asia/Shanghai]       |
| Between    | 是某两个时间点之前的请求       | -  Between=2037-01-20T17:42:47.789-07:00[America/Denver],  2037-01-21T17:42:47.789-07:00[America/Denver] |
| Cookie     | 请求必须包含某些cookie         | - Cookie=chocolate, ch.p                                     |
| Header     | 请求必须包含某些header         | - Header=X-Request-Id, \d+                                   |
| Host       | 请求必须是访问某个host（域名） | -  Host=**.somehost.org,**.anotherhost.org                   |
| Method     | 请求方式必须是指定方式         | - Method=GET,POST                                            |
| Path       | 请求路径必须符合指定规则       | - Path=/red/{segment},/blue/**                               |
| Query      | 请求参数必须包含指定参数       | - Query=name, Jack或者-  Query=name                          |
| RemoteAddr | 请求者的ip必须是指定范围       | - RemoteAddr=192.168.1.1/24                                  |
| Weight     | 权重处理                       |                                                              |



我们只需要掌握Path这种路由工程就可以了。



## 3.4.过滤器工厂

GatewayFilter是网关中提供的一种过滤器，可以对进入网关的请求和微服务返回的响应做处理：

![image-20210714212312871](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/8d8e6250f1f7f7e8c7336453676d0cde.png)



### 3.4.1.路由过滤器的种类

Spring提供了31种不同的路由过滤器工厂。例如：

| **名称**             | **说明**                     |
| -------------------- | ---------------------------- |
| AddRequestHeader     | 给当前请求添加一个请求头     |
| RemoveRequestHeader  | 移除请求中的一个请求头       |
| AddResponseHeader    | 给响应结果中添加一个响应头   |
| RemoveResponseHeader | 从响应结果中移除有一个响应头 |
| RequestRateLimiter   | 限制请求的流量               |



### 3.4.2.请求头过滤器

下面我们以AddRequestHeader 为例来讲解。

> **需求**：给所有进入userservice的请求添加一个请求头：Truth=itcast is freaking awesome!



只需要修改gateway服务的application.yml文件，添加路由过滤即可：

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: user-service 
        uri: lb://userservice 
        predicates: 
        - Path=/user/** 
        filters: # 过滤器
        - AddRequestHeader=Truth, Itcast is freaking awesome! # 添加请求头
```

当前过滤器写在userservice路由下，因此仅仅对访问userservice的请求有效。

> 记得日志级别改为Header

![image-20230610113754972](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/5993e94d678ebeadb8dcc07119382aaf.png)

日志打印了出来

![image-20230610113814013](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/6c69427f1b5901af9a1c81790a9dcd04.png)

### 3.4.3.默认过滤器

如果要对所有的路由都生效，则可以将过滤器工厂写到default下。格式如下：

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: user-service 
        uri: lb://userservice 
        predicates: 
        - Path=/user/**
      default-filters: # 默认过滤项
      - AddRequestHeader=Truth, Itcast is freaking awesome! 
```



### 3.4.4.总结

过滤器的作用是什么？

① 对路由的请求或响应做加工处理，比如添加请求头

② 配置在路由下的过滤器只对当前路由的请求生效

defaultFilters的作用是什么？

① 对所有路由都生效的过滤器



## 3.5.全局过滤器

上一节学习的过滤器，网关提供了31种，但每一种过滤器的作用都是固定的。如果我们希望拦截请求，做自己的业务逻辑则没办法实现。

### 3.5.1.全局过滤器作用

全局过滤器的作用也是处理一切进入网关的请求和微服务响应，与GatewayFilter的作用一样。区别在于GatewayFilter通过配置定义，处理逻辑是固定的；而GlobalFilter的逻辑需要自己写代码实现。

定义方式是实现GlobalFilter接口。

```java
public interface GlobalFilter {
    /**
     *  处理当前请求，有必要的话通过{@link GatewayFilterChain}将请求交给下一个过滤器处理
     *
     * @param exchange 请求上下文（从请求网关开始，一直到结束为止），整个过程中都可以共享exchage对象，里面可以获取Request、Response等信息
     * @param chain 用来把请求委托给下一个过滤器 
     * @return {@code Mono<Void>} 返回标示当前过滤器业务结束
     */
    Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain);
}
```



在filter中编写自定义逻辑，可以实现下列功能：

- 登录状态判断
- 权限校验
- 请求限流等





### 3.5.2.自定义全局过滤器

需求：定义全局过滤器，拦截请求，判断请求的参数是否满足下面条件：

- 参数中是否有authorization，

- authorization参数值是否为admin

如果同时满足则放行，否则拦截



实现：

在gateway中定义一个过滤器：

```java
package cn.itcast.gateway.filters;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Order(-1)
@Component
public class AuthorizeFilter implements GlobalFilter {
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        // 1.获取请求参数
        MultiValueMap<String, String> params = exchange.getRequest().getQueryParams();
        // 2.获取authorization参数
        String auth = params.getFirst("authorization");
        // 3.校验
        if ("admin".equals(auth)) {
            // 放行
            return chain.filter(exchange);
        }
        // 4.拦截
        // 4.1.禁止访问，设置状态码
        exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
        // 4.2.结束处理
        return exchange.getResponse().setComplete();
    }
}
```

![image-20230610134430192](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/74af4a3997c2b8333bdc3821556d6173.png)

果然是403

![image-20230610134512810](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/5e1565a765997729072bc340af147095.png)



小结：

> 1、全局过滤器的作用是什么？
>
> - 对所有路由都生效的过滤器，并且可以自定义处理逻辑
>
> 2、实现全局过滤器的步骤？实现GlobalFilter接口
>
> - 添加@Order注解或实现Ordered接口
> - 编写处理逻辑

![image-20230610134902623](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/11095d5773bbe793bdb799b680e2d205.png)

![image-20230610135103617](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/bba03bfd3171d07c4900c16d9f3d3a51.png)

### 3.5.3.过滤器执行顺序

请求进入网关会碰到三类过滤器：当前路由的过滤器、DefaultFilter、GlobalFilter

请求路由后，会将当前路由过滤器和DefaultFilter、GlobalFilter，合并到一个过滤器链（集合）中，排序后依次执行每个过滤器：

![image-20210714214228409](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/7ea49c972768cfb164e85d769c5be2d9.png)



排序的规则是什么呢？

- 每一个过滤器都必须指定一个int类型的order值，**order值越小，优先级越高，执行顺序越靠前**。
- GlobalFilter通过实现Ordered接口，或者添加@Order注解来指定order值，由我们自己指定
- 路由过滤器和defaultFilter的order由Spring指定，默认是按照声明顺序从1递增。
- 当过滤器的order值一样时，会按照 defaultFilter > 路由过滤器 > GlobalFilter的顺序执行。



详细内容，可以查看源码：

`org.springframework.cloud.gateway.route.RouteDefinitionRouteLocator#getFilters()`方法是先加载defaultFilters，然后再加载某个route的filters，然后合并。



`org.springframework.cloud.gateway.handler.FilteringWebHandler#handle()`方法会加载全局过滤器，与前面的过滤器合并后根据order排序，组织过滤器链

> 适配器: 将一个类的接口转换成客户希望的另外一个接口

![image-20230610140613127](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/149a1212fd21e3f8b13cceeb266d2e3a.png)

也就是说，在网关中，所有的GlobalFilter都可以适配成GatewayFilter,所以都是GatewayFilter，都可以扔到GatewayFilter集合中去做排序；

## 3.6.跨域问题



### 3.6.1.什么是跨域问题

跨域：域名不一致就是跨域，主要包括：

- 域名不同： www.taobao.com 和 www.taobao.org 和 www.jd.com 和 miaosha.jd.com

- 域名相同，端口不同：localhost:8080和localhost8081

跨域问题：浏览器禁止请求的发起者与服务端发生跨域ajax请求，请求被浏览器拦截的问题



解决方案：CORS，这个以前应该学习过，这里不再赘述了。不知道的小伙伴可以查看https://www.ruanyifeng.com/blog/2016/04/cors.html



### 3.6.2.模拟跨域问题

找到课前资料的页面文件：

![image-20210714215713563](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/0535eab21133fd3d7cb67f3d262b8748.png)

放入tomcat或者nginx这样的web服务器中，启动并访问。

可以在浏览器控制台看到下面的错误：

![image-20210714215832675](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/12d867dece3d60d7b5cd743115ba3938.png)



从localhost:8090访问localhost:10010，端口不同，显然是跨域的请求。



### 3.6.3.解决跨域问题

在gateway服务的application.yml文件中，添加下面的配置：

```yaml
spring:
  cloud:
    gateway:
      # 。。。
      globalcors: # 全局的跨域处理
        add-to-simple-url-handler-mapping: true # 解决options请求被拦截问题
        corsConfigurations:
          '[/**]':
            allowedOrigins: # 允许哪些网站的跨域请求 
              - "http://localhost:8090"
            allowedMethods: # 允许的跨域ajax的请求方式
              - "GET"
              - "POST"
              - "DELETE"
              - "PUT"
              - "OPTIONS"
            allowedHeaders: "*" # 允许在请求中携带的头信息
            allowCredentials: true # 是否允许携带cookie
            maxAge: 360000 # 这次跨域检测的有效期
```









ring指定，默认是按照声明顺序从1递增。

- 当过滤器的order值一样时，会按照 defaultFilter > 路由过滤器 > GlobalFilter的顺序执行。



详细内容，可以查看源码：

`org.springframework.cloud.gateway.route.RouteDefinitionRouteLocator#getFilters()`方法是先加载defaultFilters，然后再加载某个route的filters，然后合并。



`org.springframework.cloud.gateway.handler.FilteringWebHandler#handle()`方法会加载全局过滤器，与前面的过滤器合并后根据order排序，组织过滤器链

> 适配器: 将一个类的接口转换成客户希望的另外一个接口

[外链图片转存中...(img-2tp5sbNg-1686874915080)]

也就是说，在网关中，所有的GlobalFilter都可以适配成GatewayFilter,所以都是GatewayFilter，都可以扔到GatewayFilter集合中去做排序；

## 3.6.跨域问题



### 3.6.1.什么是跨域问题

跨域：域名不一致就是跨域，主要包括：

- 域名不同： www.taobao.com 和 www.taobao.org 和 www.jd.com 和 miaosha.jd.com

- 域名相同，端口不同：localhost:8080和localhost8081

跨域问题：浏览器禁止请求的发起者与服务端发生跨域ajax请求，请求被浏览器拦截的问题



解决方案：CORS，这个以前应该学习过，这里不再赘述了。不知道的小伙伴可以查看https://www.ruanyifeng.com/blog/2016/04/cors.html



### 3.6.2.模拟跨域问题

找到课前资料的页面文件：

[外链图片转存中...(img-eEkZJFEU-1686874915080)]

放入tomcat或者nginx这样的web服务器中，启动并访问。

可以在浏览器控制台看到下面的错误：

[外链图片转存中...(img-pilFHEP4-1686874915080)]



从localhost:8090访问localhost:10010，端口不同，显然是跨域的请求。



### 3.6.3.解决跨域问题

在gateway服务的application.yml文件中，添加下面的配置：

```yaml
spring:
  cloud:
    gateway:
      # 。。。
      globalcors: # 全局的跨域处理
        add-to-simple-url-handler-mapping: true # 解决options请求被拦截问题
        corsConfigurations:
          '[/**]':
            allowedOrigins: # 允许哪些网站的跨域请求 
              - "http://localhost:8090"
            allowedMethods: # 允许的跨域ajax的请求方式
              - "GET"
              - "POST"
              - "DELETE"
              - "PUT"
              - "OPTIONS"
            allowedHeaders: "*" # 允许在请求中携带的头信息
            allowCredentials: true # 是否允许携带cookie
            maxAge: 360000 # 这次跨域检测的有效期
```









