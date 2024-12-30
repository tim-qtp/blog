---
order: 5
author: 
title: "DockerCompose"
category:
  - Docker
  - DockerCompose
  - 微服务集群


---

# 4.DockerCompose

Docker Compose可以基于Compose文件帮我们快速的部署分布式应用，而无需手动一个个创建和运行容器！

<img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/5fc86408df221dd6dc6513f012cd19e3.png" alt="image-20210731180921742" style="zoom:67%;" />

## 4.1.初识DockerCompose

Compose文件是一个文本文件，通过指令定义集群中的每个容器如何运行。格式如下：

> 该文件，就相当于把docker run的各种参数转化成指令去定义了
>
> ==把各个run集合进来了，然后把语法转化了一下==

![image-20230612180157251](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/c59470c80e2aa46b6d36eeff7339eef3.png)

```json
version: "3.8"
 services:
  mysql:
    image: mysql:5.7.25
    environment:
     MYSQL_ROOT_PASSWORD: 123 
    volumes:
     - "/tmp/mysql/data:/var/lib/mysql"
     - "/tmp/mysql/conf/hmy.cnf:/etc/mysql/conf.d/hmy.cnf"
  web:
    build: .
    ports:
     - "8090:8090"

```

上面的Compose文件就描述一个项目，其中包含两个容器：

- mysql：一个基于`mysql:5.7.25`镜像构建的容器，并且挂载了两个目录
- web：一个基于`docker build`临时构建的镜像容器，映射端口时8090



DockerCompose的详细语法参考官网：https://docs.docker.com/compose/compose-file/



其实DockerCompose文件可以看做是将多个docker run命令写到一个文件，只是语法稍有差异。



## 4.2.安装DockerCompose

参考 [DockerCompose安装](https://tim-qtp.github.io//blog/microservices/docker/Docker%20installation.html#_2-centos7%E5%AE%89%E8%A3%85dockercompose)

## 4.3.部署微服务集群

**需求**：将之前学习的cloud-demo微服务集群利用DockerCompose部署

**实现思路**：

① 查看课前资料提供的cloud-demo文件夹，里面已经编写好了docker-compose文件

② 修改自己的cloud-demo项目，将数据库、nacos地址都命名为docker-compose中的服务名

③ 使用maven打包工具，将项目中的每个微服务都打包为app.jar

④ 将打包好的app.jar拷贝到cloud-demo中的每一个对应的子目录中

⑤ 将cloud-demo上传至虚拟机，利用 docker-compose up -d 来部署



### 4.3.1.compose文件

查看资料里的cloud-demo文件夹，里面已经编写好了docker-compose文件，而且每个微服务都准备了一个独立的目录：

![image-20210731181341330](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/b1d8835dc48f20ba70d4b1e8e2d39696.png)

内容如下：

```yaml
version: "3.2"

services:
  nacos:
    image: nacos/nacos-server
    environment:
      MODE: standalone
    ports:
      - "8848:8848"
  mysql:
    image: mysql:5.7.25
    environment:
      MYSQL_ROOT_PASSWORD: 123
    volumes:
      - "$PWD/mysql/data:/var/lib/mysql"
      - "$PWD/mysql/conf:/etc/mysql/conf.d/"
  userservice:
    build: ./user-service
  orderservice:
    build: ./order-service
  gateway:
    build: ./gateway
    ports:
      - "10010:10010"
```

可以看到，其中包含5个service服务：

- `nacos`：作为注册中心和配置中心
  - `image: nacos/nacos-server`： 基于nacos/nacos-server镜像构建
  - `environment`：环境变量
    - `MODE: standalone`：单点模式启动
  - `ports`：端口映射，这里暴露了8848端口
- `mysql`：数据库
  - `image: mysql:5.7.25`：镜像版本是mysql:5.7.25
  - `environment`：环境变量
    - `MYSQL_ROOT_PASSWORD: 123`：设置数据库root账户的密码为123
  - `volumes`：数据卷挂载，这里挂载了mysql的data、conf目录，其中有我提前准备好的数据
- `userservice`、`orderservice`、`gateway`：都是基于Dockerfile临时构建的



查看mysql目录，可以看到其中已经准备好了cloud_order、cloud_user表：

![image-20210801095205034](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/74040ab607f0210708c153fe4af45bd0.png)

查看微服务目录，可以看到都包含Dockerfile文件：

![image-20210801095320586](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/4a34d93847e833f6ac61b80f45c81c85.png)

内容如下：

```dockerfile
FROM java:8-alpine
COPY ./app.jar /tmp/app.jar
ENTRYPOINT java -jar /tmp/app.jar
```





### 4.3.2.修改微服务配置

因为微服务将来要部署为docker容器，==而容器之间互联不是通过IP地址，而是通过容器名。==这里我们将order-service、user-service、gateway服务的mysql、nacos地址都修改为基于容器名的访问。

如下所示：

```yaml
spring:
  datasource:
    url: jdbc:mysql://mysql:3306/cloud_order?useSSL=false
    username: root
    password: 123
    driver-class-name: com.mysql.jdbc.Driver
  application:
    name: orderservice
  cloud:
    nacos:
      server-addr: nacos:8848 # nacos服务地址
```

注意看其中的==`mysql`和`nacos`==

### 4.3.3.打包

接下来需要将我们的每个微服务都打包。因为之前查看到Dockerfile中的jar包名称都是app.jar，因此我们的每个微服务都需要用这个名称。

可以通过修改pom.xml中的打包名称来实现，每个微服务都需要修改：

```xml
<build>
  <!-- 服务打包的最终名称 -->
  <finalName>app</finalName>
  <plugins>
    <plugin>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-maven-plugin</artifactId>
    </plugin>
  </plugins>
</build>
```

打包后：

![image-20210801095951030](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/024feff25e878d0fc9f7cfcae6ada228.png)

### 4.3.4.拷贝jar包到部署目录

编译打包好的app.jar文件，需要放到Dockerfile的同级目录中。注意：每个微服务的app.jar放到与服务名称对应的目录，别搞错了。

user-service：

![image-20210801100201253](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/0304b372e05c9bf462eba03f9db0ae55.png)

order-service：

![image-20210801100231495](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/90abfd5879f4beeb39afff7457dd2581.png)

gateway：

![image-20210801100308102](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/4999181643ef1b8826df9d1e70c1f7c9.png)

### 4.3.5.部署

最后，我们需要将文件整个cloud-demo文件夹上传到虚拟机中，理由DockerCompose部署。

上传到任意目录：

![image-20210801100955653](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/f26ba623a69b6b5d666b9a7aacd8494b.png)

部署：

进入cloud-demo目录，然后运行下面的命令：

```sh
docker-compose up -d
```



