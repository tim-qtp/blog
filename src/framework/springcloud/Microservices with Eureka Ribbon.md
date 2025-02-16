---
order: 1
author: 
title: "微服务+Eureka+Ribbon"
category:
  - SpringCloud
  - 微服务
  - Eureka
  - Ribbon

---

## 一、微服务导学

### 1、概览：

![image-20250113181405916](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20250113181405916.png)

一个大型的互联网项目往往会包含数百上千的服务，最终形成一个集群，而一个业务往往会需要有多个服务来共同来完成。一个请求来了，它会调服务a，服务a又去调了服务b，而后又调了服务c，当业务越来越多、越来越复杂的时候，这些服务之间的调用关系就会越来越复杂，想靠人去记录和维护是不可能的。

### **2、注册中心：**

记录微服务中的每一个服务的ip端口，以及它能干什么事这些信息。当一个服务需要调用另一个服务的时候，它不需要自己去记录对方的ip，只需要去找注册中心就行，去那里拉取对应的服务信息。

### **3、配置文件：**

每个服务都有自己的配置文件，后面要修改配置文件，难道要逐一修改吗？不需要，统一管理。

>需要修改的时候，会通知相关的微服务实现==配置的热更新==。

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/ff9e1bf14637fcd00ecd5c40c1386b50.png)

### 4、排查:

在运行的过程中，如果出现了什么问题，不太好**排查**，所以我们还会引入两个新的组件来解决这种服务的异常定位。

1. **分布式日志服务**：是指将分散在多个服务器上的日志进行统一的收集、存储、查询和分析。通过采集系统各个节点的日志数据，并将其按一定格式整合存储，开发人员可以轻松地追踪和排查系统问题，同时也可以利用日志数据监控系统运行状态和性能指标，实现对系统的实时监控和预警。
2. **系统链路追踪**：是一种分布式系统监控技术，通过记录系统中每个请求的处理流程和性能数据，来协助开发人员快速定位和解决问题，优化系统性能。它可以帮助我们提高系统可观测性、定位延迟问题、优化服务调用链、跟踪用户行为和异常等，是大型分布式系统中必不可少的技术手段。

### 5、部署：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/2817efbf80c86b114fc5ede7fa08eee1.png)

> **Jenkins**是一种持续集成工具，用于自动化构建、测试和部署软件。
> **Docker**是一种容器化技术，将应用程序及其依赖项打包为容器，实现软件的跨平台部署。
> **Kubernetes**是一个开源的容器编排平台，用于管理Docker容器集群。
> **Rancher**是一个基于Kubernetes的容器管理平台，提供可视化的用户界面和自动化的部署。
>
> 它们之间的关系是：Jenkins用于自动化构建和测试代码，并将构建后的镜像推送到Docker仓库；Docker将应用程序及其依赖项打包为容器，并通过Kubernetes进行集群部署和管理；Rancher则提供了可视化的用户界面和自动化的部署来管理Kubernetes集群。总体来说，这些技术都致力于实现高效、可靠和可扩展的应用部署和管理。

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/8089edced18021cd9467b6fc1a36bb44.png)

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/10df806382af8daffef5283bdd4a5e86.png)

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/18257c49cd68a41b8e839ebfba39ab57.png)

## 二、架构演变，技术对比，SpringCloud

### **1、单体架构：**

将业务的所有功能集中在一个项目中开发，打成一个包部署。

**优点：**

- 架构简单
- 部署成本低

**缺点：**

- 耦合度高：拼多多&淘宝，服务可就不是两三个模块了，可能是几十上百个模块，代码不是几千行，而是数十万行，代码编译打包都得十几分钟。而且，模块太多，你中有我，我中有你，边界模糊，改一个地方的代码，可能要牵连很多地方，所以不敢乱动代码，耦合度太高。

### **2、分布式架构：**

根据业务功能对系统进行拆分，每个业务模块作为独立项目开发，称为一个服务。
**优点：**

- 降低服务耦合
- 有利于服务升级拓展

后面拆分好的机器还想保证高可用，又得做集群，

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/d57936d061ece21106518254c20d6080.png)

> ==单体==的时候，下单的时候需要商品信息，怎么办，你不是有一个service么，==我直接调你就行了==，因为在一个项目里，大家可以互相调

分布式架构的要考虑的问题：

- ==服务拆分粒度如何==？哪几个服务单独作为模块开发，哪些业务在一起呢，这个粒度需要你去把握。
- ==服务集群地址如何维护？==100个(支付模块)ip地址，别人怎么调，万一上线变了，怎么办，改？地址必须是方便维护的。
- ==服务之间如何实现远程调用？==RPC跨服务的调用啊，我可没学过。
- ==服务健康状态如何感知？==我调你，怎么能知道你上百个服务是好的呢？万一你挂了我调你，结果阻塞了，导致级联失败。

### **3、认识微服务：**

**微服务**：是一种经过`良好架构`设计的`分布式`架构方案，微服务架构特征：

- 单一职责：微服务拆分粒度更小，每一个服务都对应唯一的业务能力，做到单一职责，避免重复业务开发。<font face="STCAIYUN">会员服务</font>  <font face="STCAIYUN">用户服务</font>  <font face="STCAIYUN">积分服务</font>  
- 面向服务：微服务对外暴露业务接口
- 自治：团队独立、技术独立、数据独立、部署独立（<font color='red'>简单点 说话的方式简单点</font>）<font color=green>符合敏捷开发的思想</font>。所以你可以用你擅长的技术，Go，Java，C++都可以。
- 隔离性强：服务调用做好隔离、容错、降级，避免出现级联问题





![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/9f79daaa743f9ee59c9d19d26ca83fbc.png)

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/3fee3e7a65c4a2a056ef3f5c90ab067a.png)



### **4、服务拆分注意事项：**

1. 单一职责：不同微服务，不要重复开发相同业务
2. 数据独立：不要访问其它微服务的数据库
3. 面向服务：将自己的业务暴露为接口，供其它微服务调用

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/7a435c05b75729fb457fa128e525b2f0.png)

### **5、SpringCloud版本：**

基于SpringBoot实现了这些组件的自动装配，从而提供了良好的开箱即用体验，所以才能推广开来。![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/7f0061094d5d7f226b41d94f5052ad1a.png)

```json
"spring-cloud": {
"Hoxton.SR12": "Spring Boot >=2.2.0.RELEASE and <2.4.0.RELEASE",
"2020.0.6": "Spring Boot >=2.4.0.RELEASE and <2.6.0",
"2021.0.7": "Spring Boot >=2.6.0 and <3.0.0",
"2022.0.3": "Spring Boot >=3.0.0 and <3.2.0-M1"
},
"mybatis": {
"2.1.4": "Spring Boot >=2.1.0.RELEASE and <2.5.0-M1",
"2.2.2": "Spring Boot >=2.5.0-M1 and <2.7.0-M1",
"2.3.1": "Spring Boot >=2.7.0-M1 and <3.0.0-M1",
"3.0.2": "Spring Boot >=3.0.0-M1"
},
```

课堂学习的版本是 Hoxton.SR10，因此对应的SpringBoot版本是2.3.x版本。

可以自己点上方 View--Tool Windows--Services，弹出来后点那个加号点那个Type选springboot。

### **6、服务拆分及远程调用：**

<table><tr><td bgcolor=orange>注意：     mybatis:
  type-aliases-package:这个注解有什么作用?</td></tr></table>


`type-aliases-package`是MyBatis的一个配置项，用于指定类型别名所在的包路径。

​        在Java代码中，我们经常需要使用全限定类名来引用某个类，但如果类名过长或者使用频繁，这样的代码可读性就比较差。为了让代码更加简洁易读，MyBatis引入了类型别名的概念。

类型别名就是为Java类取一个短小的名称，代替完整的类名。通常情况下，类型别名与类名同名。例如，我们有一个名为`cn.itcast.user.pojo.User`的JavaBean类，可以在MyBatis配置文件中使用如下方式指定该类的类型别名：

```
<typeAliases>
  <typeAlias type="cn.itcast.user.pojo.User" alias="User"/>
</typeAliases>
```

​      这样，我们在写MyBatis映射文件时，就可以使用`<resultMap>`等标签直接使用`User`作为返回结果集的类型了：

```
<resultMap type="User" id="userMap">
  <id property="id" column="id"/>
  <result property="name" column="name"/>
  <result property="age" column="age"/>
</resultMap>
```

​	但是如果有很多JavaBean需要在MyBatis配置文件中作为返回结果集的类型，就需要逐个为它们设置类型别名，非常繁琐。因此，MyBatis提供了`type-aliases-package`配置项，可以一次性将一个包中所有的JavaBean类设置为类型别名：

```
<typeAliases>
  <package name="cn.itcast.user.pojo"/>
</typeAliases>
```

​	这样，MyBatis就会自动将`cn.itcast.user.pojo`包下的所有JavaBean类都设置为类型别名了。在编写Mapper映射文件时，只需要直接使用JavaBean名称即可，不再需要使用完整的类名。这样可以大大提高代码的可读性和可维护性。

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/2f79031b19db59c8f10df58b5f7277a0.png)



![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/cf7136e66cc0bd69e7a53f25652e2d4f.png)

**微服务远程调用：**

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/2a1b9a858c3db7eec78737e9a0ffcfc9.png)

<font color=red>我们都知道@bean的注入必须写在配置类中，但是@SpringBootApplication启动类其实也是一个配置类。</font>

步骤一：在order-service的OrderApplication中注册RestTemplate

```java
/**
 * 创建RestTemplate并注入Spring容器
 */
@Bean
public RestTemplate restTemplate(){
    return new RestTemplate();
}
```

步骤二：修改order-service中的OrderService的queryOrderById方法：

```java
@Service
public class OrderService {

    @Autowired
    private OrderMapper orderMapper;

    @Autowired
    private RestTemplate restTemplate;

    public Order queryOrderById(Long orderId) {
        // 1.查询订单
        Order order = orderMapper.findById(orderId);
        // 2.利用RestTemplate发起http请求，查询用户
        String url = "http://localhost:8081/user/" + order.getUserId();
        User user = restTemplate.getForObject(url, User.class);
        // 3.封装user和order
        order.setUser(user);
        // 4.返回
        return order;
    }
}
```

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/5cf77ca9e9037e9e585cd0e12a007691.png)

## 三、Eureka

### **1、提供者与消费者:**

- 服务提供者：一次业务中，被其它微服务调用的服务。（提供接口给其它微服务）
- 服务消费者：一次业务中，调用其它微服务的服务。（调用其它微服务提供的接口）

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/7acd93ef5bdd032baa335731bc5d6721.png)

服务调用关系

- 服务提供者：暴露接口给其它微服务调用
- 服务消费者：调用其它微服务提供的接口
- 提供者与消费者角色其实是相对的
- 一个服务可以同时是服务提供者和服务消费者

### 2、Eureka注册中心

假如我们的服务提供者user-service部署了多个实例，如图：

![image-20230606171808683](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/df312d076fb114033ca5b389f15763f2.png)

大家思考几个问题：

- order-service在发起远程调用的时候，该如何得知user-service实例的ip地址和端口？
  - 服务提供者启动时向eureka注册自己的信息
  - eureka保存这些信息
  - 消费者根据服务名称向eureka拉取提供者信息
- 有多个user-service实例地址，order-service调用时该如何选择？
  - 服务消费者利用负载均衡算法，从服务列表中挑选一个
- order-service如何得知某个user-service实例是否依然健康，是不是已经宕机？
  - 服务提供者会每隔30秒向EurekaServer发送心跳请求，报告健康状态
  - eureka会更新记录服务列表信息，心跳不正常会被剔除
  - 消费者就可以拉取到最新的信息

### 3、Eureka作用：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/ae67febe8982dc283dd7970115d8d31d.png)

### 4、搭建eureka-server：

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
</dependency>
```

```xml
父pom
<!-- springCloud -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-dependencies</artifactId>
    <version>${spring-cloud.version}</version>
    <type>pom</type>
    <scope>import</scope>
</dependency>
```

这里不需要写eureka的版本信息是因为，父pom中加载了spring-cloud的依赖，里面大量的springcloud的组件及版本信息已经定义好了。

![image-20230606174039793](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/7947310e7e7cdbaa1f0642b204eec1b6.png)

### 5、创建eureka-server服务

####  5.1、引入eureka依赖

引入SpringCloud为eureka提供的starter依赖：

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
</dependency>
```

#### 5.2、编写启动类

```java
@SpringBootApplication
@EnableEurekaServer
public class EurekaApplication {
    public static void main(String[] args) {
        SpringApplication.run(EurekaApplication.class, args);
    }
}
```

#### 5.3、编写配置文件

application.yml

```yaml
server:
  port: 10086
spring:
  application:
    name: eureka-server #eureka的服务名称
eureka:
  client:
	  fetch-registry: false #既不注册，也不获取
	  register-with-eureka: false
    service-url: #eureka集群的地址信息
      defaultZone: http://127.0.0.1:10086/eureka
      # eureka本身也是一个微服务，因为后面也要做集群； eureka在启动的时候，会将自己注册到eureka上
```

### 6、服务注册

#### 6.1、引入依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
```

#### 6.2、配置文件

在user-service中，修改application.yml文件，添加服务名称、eureka地址：

```yaml
server:
  port: 8081
spring:
  application:
    name: userservice
  datasource:
    url: jdbc:mysql://localhost:3306/cloud_user?useSSL=false
    username: root
    password: 123.com
    driver-class-name: com.mysql.cj.jdbc.Driver
    
mybatis:
  type-aliases-package: cn.itcast.user.pojo
  configuration:
    map-underscore-to-camel-case: true
    
logging:
  level:
    cn.itcast: debug
eureka:
  client:
    service-url:
      defaultZone: http://127.0.0.1:10086/eureka
```

### 7、启动多个user-service实例：

为了演示一个服务有多个实例的场景，复制原来的user-service启动配置，再启动一个user-service。

右键Copy Configuration，VM options：-Dserver.port=8082

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/b9629ad7025188b5d4b58fbc82bc74a1.png)

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/14ec6e69b4d8bb2bc42787e57dde8257.png)

> spring会自动帮助我们从eureka-server端，根据userservice这个服务名称，获取实例列表，而后完成负载均衡.
>
> 注意如果不加 @LoadBalanced ，将无法通过服务名请求访问
>
> 注意：是在这加：
>
> ```java
> /**
>  * 创建RestTemplate并注入Spring容器
>  */
> @Bean
> public RestTemplate restTemplate(){
>     return new RestTemplate();
> }
> ```

切换两个实例查看，发现确实实现了负载均衡**（这个课太棒了！）**

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/dd73fa8d01870373109563fcfe0f0f34.png)

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/6ed991bdf9845406bd563ec7bcf6502d.png)

### 8、注册中心总结：

#### 8.1、搭建EurekaServer

- 引入eureka-server依赖
- 添加@EnableEurekaServer注解
- 在application.yml中配置eureka地址

#### 8.2、服务注册

- 引入eureka-client依赖
- 在application.yml中配置eureka地址

#### 8.3、服务发现

- 引入eureka-client依赖
- 在application.yml中配置eureka地址
- 给RestTemplate添加@LoadBalanced注解
- 用服务提供者的服务名称远程调用



## 四、Ribbon负载均衡

上一节中，我们添加了@LoadBalanced注解，即可实现负载均衡功能，这是什么原理呢？

### 1.负载均衡原理：

SpringCloud底层其实是利用了一个名为Ribbon的组件，来实现负载均衡功能的。

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/02ca0de5a040bd3ffb7dc6a6681fa4d9.png)

那么我们发出的请求明明是http://userservice/user/1，怎么变成了http://localhost:8081的呢？



### 2.源码跟踪：

为什么我们只输入了service名称就可以访问了呢？之前还要获取ip和端口。

显然有人帮我们根据service名称，获取到了服务实例的ip和端口。它就是`LoadBalancerInterceptor`，这个类会在对RestTemplate的请求进行拦截，然后从Eureka根据服务id获取服务列表，随后利用负载均衡算法得到真实的服务地址信息，替换服务id。

我们进行源码跟踪：

**1）LoadBalancerIntercepor**

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/5387cd2d473a8292759818a56952f2c3.png)

可以看到这里的intercept方法，拦截了用户的HttpRequest请求，然后做了几件事：

- `request.getURI()`：获取请求uri，本例中就是 http://user-service/user/8
- `originalUri.getHost()`：获取uri路径的主机名，其实就是服务id，`user-service`
- `this.loadBalancer.execute()`：处理服务id，和用户请求。

这里的`this.loadBalancer`是`LoadBalancerClient`类型，我们继续跟入。

 

**2）LoadBalancerClient**

继续跟入execute方法：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/8a8b93b21130f2eb63357320de48b77d.png)

代码是这样的：

- getLoadBalancer(serviceId)：根据服务id获取ILoadBalancer，而ILoadBalancer会拿着服务id去eureka中获取服务列表并保存起来。
- getServer(loadBalancer)：利用内置的负载均衡算法，从服务列表中选择一个。本例中，可以看到获取了8082端口的服务



放行后，再次访问并跟踪，发现获取的是8081：

 ![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/b38fdd89ec0a1e631b1ac28089f25770.png)

果然实现了负载均衡。



**3）负载均衡策略IRule**

在刚才的代码中，可以看到获取服务使通过一个`getServer`方法来做负载均衡:

 ![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/b38fdd89ec0a1e631b1ac28089f25770.png)

我们继续跟入：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/a6675c34e11a186cbc0a57bda461c364.png)

继续跟踪源码chooseServer方法，发现这么一段代码： 

 ![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/b696a05f4f6a57719ea0b88c29046f89.png)

我们看看这个rule是谁：

 ![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/89d04a3d19e0ff546512206aa20d5629.png)

这里的rule默认值是一个`RoundRobinRule`，看类的介绍：

 ![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/a83e5752457212505a16dd77fc5fb11e.png)

这不就是轮询的意思嘛。

到这里，整个负载均衡的流程我们就清楚了。



**4）总结**

SpringCloudRibbon的底层采用了一个拦截器，拦截了RestTemplate发出的请求，对地址做了修改。用一幅图来总结一下：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/c5b66357207c152011c0fd3d92ed0178.png)



基本流程如下：

- 拦截我们的RestTemplate请求http://userservice/user/1
- RibbonLoadBalancerClient会从请求url中获取服务名称，也就是user-service
- DynamicServerListLoadBalancer根据user-service到eureka拉取服务列表
- eureka返回列表，localhost:8081、localhost:8082
- IRule利用内置负载均衡规则，从列表中选择一个，例如localhost:8081
- RibbonLoadBalancerClient修改请求地址，用localhost:8081替代userservice，得到http://localhost:8081/user/1，发起真实请求

### 3.负载均衡策略



#### 3.1.负载均衡策略

负载均衡的规则都定义在IRule接口中，而IRule有很多不同的实现类：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/127631c585d061a94d1222f6a44595d3.png)

不同规则的含义如下：

| **内置负载均衡规则类**    | **规则描述**                                                 |
| ------------------------- | ------------------------------------------------------------ |
| RoundRobinRule            | 简单轮询服务列表来选择服务器。它是Ribbon默认的负载均衡规则。 |
| AvailabilityFilteringRule | 对以下两种服务器进行忽略：   （1）在默认情况下，这台服务器如果3次连接失败，这台服务器就会被设置为“短路”状态。短路状态将持续30秒，如果再次连接失败，短路的持续时间就会几何级地增加。  （2）并发数过高的服务器。如果一个服务器的并发连接数过高，配置了AvailabilityFilteringRule规则的客户端也会将其忽略。并发连接数的上限，可以由客户端的`clientName``clientConfigNameSpace``ActiveConnectionsLimit`属性进行配置。 |
| WeightedResponseTimeRule  | 为每一个服务器赋予一个权重值。服务器响应时间越长，这个服务器的权重就越小。这个规则会随机选择服务器，这个权重值会影响服务器的选择。 |
| **ZoneAvoidanceRule**     | 以区域可用的服务器为基础进行服务器的选择。使用Zone对服务器进行分类，这个Zone可以理解为一个机房、一个机架等。而后再对Zone内的多个服务做轮询。 |
| BestAvailableRule         | 忽略那些短路的服务器，并选择并发数较低的服务器。             |
| RandomRule                | 随机选择一个可用的服务器。                                   |
| RetryRule                 | 重试机制的选择逻辑                                           |



默认的实现就是ZoneAvoidanceRule，是一种轮询方案 

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/9c4097dfddbff1593d294a21578a1dd5.png)

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/337a05a7d5ba0e8821075143bc3a26a9.png)

#### 3.2.自定义负载均衡策略

通过定义IRule实现可以修改负载均衡规则，有两种方式：

1. 代码方式：在order-service中的OrderApplication类中，定义一个新的IRule：

```java
@Bean
public IRule randomRule(){
    return new RandomRule();
}
```

上面这个是全局的，在`order-service`里，不管你调用的是`user-service`，还是以后商品服务也好，它都是随机的。

2. 配置文件方式：在order-service的application.yml文件中，添加新的配置也可以修改规则：

```yaml
userservice: # 给某个微服务配置负载均衡规则，这里是userservice服务
  ribbon:
    NFLoadBalancerRuleClassName: com.netflix.loadbalancer.RandomRule # 负载均衡规则 
```



> **注意**，一般用默认的负载均衡规则，不做修改。

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/0428f260972dcc6e4f71916c6650037a.png)

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/36bb98c1f4eafe937eac0ddb2afe607d.png)

### 4.饥饿加载：

Ribbon默认是采用懒加载，即第一次访问时才会去创建LoadBalanceClient，请求时间会很长。

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/12a988e8d4cd6b2ecf49c459428b9862.png)

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/91e80758b7b85fa37d3edc4a6205e396.png)

而饥饿加载则会在项目启动时创建，降低第一次访问的耗时，通过下面配置开启饥饿加载：

```yaml
ribbon:
  eager-load:
    enabled: true
    clients: userservice
```

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/6ace5daba447a0c72b5684fa1b7622d4.png)

直接缩短了一般时间

> 为什么时间还是这么长？那是因为还做了其他配置SpringMVC容器（DispatcherServlet）的初始化

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/268fc3ba8b51d1db7ce6f6866c75e144.png)



### 5.总结

1、Ribbon负载均衡规则

- 规则接口是IRule
- 默认实现是ZoneAvoidanceRule，根据zone选择服务列表，然后轮询

2、负载均衡自定义方式

- 代码方式：配置灵活，但修改时需要重新打包发布
- 配置方式：直观，方便，无需重新打包发布，但是无法做全局配置

3、饥饿加载

- 开启饥饿加载
- 指定饥饿加载的微服务名称
