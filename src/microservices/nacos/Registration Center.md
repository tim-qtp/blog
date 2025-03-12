---
order: 4
author: 
title: "注册中心"
category:
  - Nacos
  - 注册中心
  - 负载均衡

---

## 1.服务注册到nacos

Nacos是SpringCloudAlibaba的组件，而SpringCloudAlibaba也遵循SpringCloud中定义的服务注册、服务发现规范。因此使用Nacos和使用Eureka对于微服务来说，并没有太大区别。

主要差异在于：

- 依赖不同
- 服务地址不同



### 1.1.引入依赖

在cloud-demo父工程的pom文件中的`<dependencyManagement>`中引入SpringCloudAlibaba的依赖：

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-alibaba-dependencies</artifactId>
    <version>2.2.6.RELEASE</version>
    <type>pom</type>
    <scope>import</scope>
</dependency>
```

然后在user-service和order-service中的pom文件中引入nacos-discovery依赖：

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
</dependency>
```



> **注意**：不要忘了注释掉eureka的依赖。



### 1.2.配置nacos地址

在user-service和order-service的application.yml中添加nacos地址：

```yaml
spring:
  cloud:
    nacos:
      server-addr: localhost:8848
```



> **注意**：不要忘了注释掉eureka的地址



### 1.3.重启

重启微服务后，登录nacos管理页面，可以看到微服务信息：



## 2.服务分级存储模型

一个**服务**可以有多个**实例**，例如我们的user-service，可以有:

- 127.0.0.1:8081
- 127.0.0.1:8082
- 127.0.0.1:8083

假如这些实例分布于全国各地的不同机房，例如：

- 127.0.0.1:8081，在上海机房
- 127.0.0.1:8082，在上海机房
- 127.0.0.1:8083，在杭州机房 

Nacos就将同一机房内的实例 划分为一个**集群**。

也就是说，user-service是服务，一个服务可以包含多个集群，如杭州、上海，每个集群下可以有多个实例，形成分级模型，如图：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/f6564401044a0f1674031d2d5b9d4406.png)



微服务互相访问时，应该尽可能访问同集群实例，因为本地访问速度更快。当本集群内不可用时，才访问其它集群。例如：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1c37ab0d9c7b3ce310064efc3ba214f3.png)

杭州机房内的order-service应该优先访问同机房的user-service。



### 2.1.给user-service配置集群

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1b020ab8fda94a4337c568a9309755d5.png)

默认集群名为DEFAULT

修改user-service的application.yml文件，添加集群配置：

```yaml
spring:
  cloud:
    nacos:
      server-addr: localhost:8848
      discovery:
        cluster-name: HZ # 集群名称
```

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1e6c32c3ec15291ba183997ff3446677.png)

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/3335d59e99a12c37674e3a7631f89c2e.png)

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/3b0aaf1bae12be169fd8c36b5f4fa939.png)



### 2.2.Nacos小结：

1、Nacos服务分级存储模型

- 一级是服务，例如userservice
- 二级是集群，例如杭州或上海
- 三级是实例，例如杭州机房的某台部署了userservice的服务器

2、如何设置实例的集群属性

- 修改application.yml文件，添加spring.cloud.nacos.discovery.cluster-name属性即可



## 3.同集群优先的负载均衡

orderservice和userservice的8081和8082都在一个集群中了，我们希望的是orderservice，那此时呢我们希望的是order service发起远程调用时，优先选择8081和8082

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/bc2d8995777666c8df94ccd7ceb610a0.png)

==但是==默认的`ZoneAvoidanceRule`并不能实现根据同集群优先来实现负载均衡。

因此Nacos中提供了一个`NacosRule`的实现，可以优先从同集群中挑选实例。

### ***3.1.给order-service配置集群信息***

修改order-service的application.yml文件，添加集群配置：

```sh
spring:
  cloud:
    nacos:
      server-addr: localhost:8848
      discovery:
        cluster-name: HZ # 集群名称
```



### ***3.2.修改负载均衡规则***

修改order-service的application.yml文件，修改负载均衡规则：

```yaml
userservice:
  ribbon:
    NFLoadBalancerRuleClassName: com.alibaba.cloud.nacos.ribbon.NacosRule # 负载均衡规则 ,NacosRule---优先选择本地集群
```

### 3.3.如果配置了优先访问本地集群，那本地的多个集群都崩了会发生什么?

![image-20230607235047898](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/e626c7d4350f4ee02ab4a1b624ed59fd.png)

只留一个试试。

```java
一次跨集群访问发生了，谁呢?   userservice
想访问的是杭州，但实际是上海
A cross-cluster call occurs，name = userservice, clusterName = HZ, instance = [Instance{instanceId='192.168.43.172#8083#SH#DEFAULT_GROUP@@userservice', ip='192.168.43.172', port=8083, weight=1.0, healthy=true, enabled=true, ephemeral=true, clusterName='SH', serviceName='DEFAULT_GROUP@@userservice', metadata={preserved.register.source=SPRING_CLOUD}}]

```

运维人员看见警告就会处理。

### 3.4.总结

NacosRule负载均衡策略

- 优先选择同集群服务实例列表
- 本地集群找不到提供者，才去其它集群寻找，并且会报警告
- 确定了可用实例列表后，再采用随机负载均衡挑选实例

## 4.权重配置

实际部署中会出现这样的场景：

- 服务器设备性能有差异，部分实例所在机器性能较好，另一些较差，我们希望性能好的机器承担更多的用户请求。

但默认情况下NacosRule是同集群内随机挑选，不会考虑机器的性能问题。

因此，Nacos提供了权重配置来控制访问频率，权重越大则访问频率越高。

在nacos控制台，找到user-service的实例列表，点击编辑，即可修改权重：

![image-20210713235133225](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/4192d335f35eff4c6d4cf09be162eb5b.png)

在弹出的编辑窗口，修改权重：

![image-20210713235235219](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/b211a65fc38d0425e6ab69792f771c99.png)

![image-20230608222430037](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/df3df2f5a92e80ad89d1ae060c15a04c.png)

![image-20230608222647143](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/8e5807c9f7b537bd94df1af95e43ff17.png)

> **注意**：如果权重修改为0，则该实例永远不会被访问

<font color=green>如果一个服务想要做一个版本的升级，怎么办？  重启！王者荣耀不停服更新---部分分批更新（设权重）  </font>

#### 总结：

> 实例的权重控制
>
> - Nacos控制台可以设置实例的权重值，0~1之间
> - 同集群内的多个实例，权重越高被访问的频率越高
> - 权重设置为0则完全不会被访问

## 5.环境隔离

Nacos提供了namespace来实现环境隔离功能。

- nacos中可以有多个namespace
- namespace下可以有group、service等
- 不同namespace之间相互隔离，例如不同namespace的服务互相不可见

开发/测试/生产 三种环境需要隔离 服务和配置的

![image-20210714000101516](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/459a09af4f9ddbb94be4ac51b6f8afcb.png)



### 5.1.创建namespace

默认情况下，所有service、data、group都在同一个namespace，名为public：

![image-20210714000414781](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/c7ade712e06eb0395ce562c70ea8a757.png)



我们可以点击页面新增按钮，添加一个namespace：

![image-20210714000440143](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/e193a37f988088684e36bc15548a6de4.png)



然后，填写表单：

![image-20210714000505928](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/3a9563601ac8cbc3c1e4ad8cff2ce9c2.png)

就能在页面看到一个新的namespace：

![image-20210714000522913](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/5f6ab6500651acf4c67b1a6347b0b7be.png)



### 5.2.给微服务配置namespace

给微服务配置namespace只能通过修改配置来实现。

例如，修改order-service的application.yml文件：

```yaml
spring:
  cloud:
    nacos:
      server-addr: localhost:8848
      discovery:
        cluster-name: HZ
        namespace: 492a7d5d-237b-46a1-a99a-fa8e98e4b0f9 # 命名空间，填ID
```



重启order-service后，访问控制台，可以看到下面的结果：

![image-20210714000830703](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/684be5121966110be67f2accb3defc1e.png)



![image-20210714000837140](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/484caab3fa8b96f6673848b407a88c1a.png)

此时访问order-service，因为namespace不同，会导致找不到userservice，控制台会报错：

<font color=green>是两个世界的人了！  </font>

![image-20210714000941256](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/ba9db871150ba398c31c3b6d97989455.png)

> Nacos环境隔离
>
> - 每个namespace都有唯一id
> - 服务设置namespace时要写id而不是名称
> - 不同namespace下的服务互相不可见

## 6.Nacos与Eureka的区别

![image-20230609081002359](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/b5d44ae7be32f5dbe38d610c79225db1.png)

到目前为止，Nacos和Eurela没什么区别，



Nacos的服务实例分为两种l类型：

- 临时实例：如果实例宕机超过一定时间，会从服务列表剔除，默认的类型。

nacos默认情况下就是临时实例，临时实例栏是 `true`

<font color=red> 不写，ephemeral: false，停掉，就会等待一会儿后，nacos监测台就会爆红</font>

![image-20230609093334913](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/cb62baf822e56533b3e6d2975702a481.png)

- 非临时实例：如果实例宕机，不会从服务列表剔除，也可以叫永久实例。

![image-20230609093454247](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/6b5e436a224ca33cee40593f252b87a5.png)

配置一个服务实例为永久实例：

```yaml
spring:
  cloud:
    nacos:
      discovery:
        ephemeral: false # 设置为非临时实例
```





Nacos和Eureka整体结构类似，服务注册、服务拉取、心跳等待，但是也存在一些差异：

![image-20210714001728017](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/cebec10ce329a95801de61f390cb98b8.png)



- **Nacos与eureka的共同点**

  - 都支持服务注册和服务拉取
  - 都支持服务提供者心跳方式做健康检测

- **Nacos与Eureka的区别**

  - Nacos支持服务端主动检测提供者状态：临时实例采用心跳模式，非临时实例采用==主动检测==模式
  - 临时实例心跳不正常会被剔除，非临时实例则==不会被剔除==（**==只是把你标记为不健康==**）
  - Nacos支持服务列表变更的==消息推送push模式==，服务列表更新更及时
  - Nacos集群默认采用==AP==方式，当集群中存在非临时实例时，采用==CP==模式；Eureka采用AP方式

  

  **总结一下**，nacos与eureka的几点区别：

  1、功能作用不同，nacos是一个服务注册与服务发现，而且还是一个配置中心，euraka仅仅只是一个注册中心；

  2、心跳机制不同，nacos可以是主动询问微服务，也可以是微服务主动询问nacos，非临时实例与临时实例

  消费者默认每隔30秒会向注册中心拉取信息，但是服务30内挂了怎么办？这时注册中心已经监听到了不健康的服务，那消费者直接去消费就会出问题。   所以Eureka服务列表更新的频率也就比较差。

  有回应有主动 比渣男好多了！哈哈哈哈哈！！！

  **记忆：临时是Nacos的舔狗，Nacos是非临时的舔狗。**

> **为什么nacos临时实例采用心跳模式，非临时实例采用主动检测模式，为什么要区别对待？**
>
> Nacos采用心跳模式来监测临时实例的健康状况，而采用主动检测模式来监测非临时实例的健康状况，原因如下：
>
> 1. 对于临时实例，由于这些实例通常是一些==短暂存在于服务列表中的实例==，它们的声明周期较短，因此采用心跳模式更加适合。心跳模式是通过服务提供者定期发送心跳信息告诉注册中心自己还存活着，如果一段时间内没有收到心跳信息，则认为该实例已经下线，将其从服务列表中移除。这种方式可以及时发现实例的下线，避免了误判，并且减少了对网络带宽和系统资源的占用。
> 2. 对于非临时实例，这些实例通常存在比较长的生命周期，而采用心跳模式无法保证及时发现实例的下线，因此采用主动检测模式更加适合。主动检测模式是注册中心通过发送HTTP请求或者TCP请求等方式来主动探测服务提供者的状态，以此来保证服务的可用性。这种方式可以更加精确地判断实例的状态，但是也会带来一些额外的负担，因为需要耗费更多的资源和网络带宽。

