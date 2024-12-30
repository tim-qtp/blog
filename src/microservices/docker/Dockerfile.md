---
order: 4
author: 
title: "Dockerfile自定义镜像"
category:
  - Docker
  - 基础


---

# 3.Dockerfile自定义镜像

常见的镜像在DockerHub就能找到，但是我们自己写的项目就必须自己构建镜像了。

而要自定义镜像，就必须先了解镜像的结构才行。

## 3.1.镜像结构

镜像是将应用程序及其需要的系统函数库、环境、配置、依赖打包而成。

> 总结一下：底层函数库->环境配置->依赖安装->应用安装->应用配置

我们以MySQL为例，来看看镜像的组成结构：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/7c4faf36f287a1602ef2f449a274719c.png)



简单来说，镜像就是在系统函数库、运行环境基础上，添加应用程序文件、配置文件、依赖文件等组合，然后编写好启动脚本打包在一起形成的文件。



我们要构建镜像，其实就是实现上述打包的过程。



## 3.2.Dockerfile语法

构建自定义的镜像时，并不需要一个个文件去拷贝，打包。

我们只需要告诉Docker，我们的镜像的组成，需要哪些BaseImage、需要拷贝什么文件、需要安装什么依赖、启动脚本是什么，将来Docker会帮助我们构建镜像。



而描述上述信息的文件就是Dockerfile文件。



**Dockerfile**就是一个文本文件，其中包含一个个的**指令(Instruction)**，用指令来说明要执行什么操作来构建镜像。每一个指令都会形成一层Layer。

![image-20210731180321133](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/4cd4be11c105a058afd23f701e1fdea3.png)



更新详细语法说明，请参考官网文档： https://docs.docker.com/engine/reference/builder







## 3.3.构建Java项目



### 3.3.1.基于Ubuntu构建Java项目

需求：基于Ubuntu镜像构建一个新镜像，运行一个java项目

- 步骤1：新建一个空文件夹docker-demo

  ![image-20210801101207444](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/ad271ae174571c699d8569f93e59a368.png)

- 步骤2：拷贝课前资料中的docker-demo.jar文件到docker-demo这个目录

  ![image-20210801101314816](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/5c2a909358e751ce36acf80638728e55.png)

- 步骤3：拷贝课前资料中的jdk8.tar.gz文件到docker-demo这个目录

  ![image-20210801101410200](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/595dda83adf39b5b367112a46f707bef.png)

- 步骤4：拷贝课前资料提供的Dockerfile到docker-demo这个目录

  ![image-20210801101455590](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/eac750902967e7d35eb526566a51ee11.png)

  其中的内容如下：

  ```dockerfile
  # 指定基础镜像
  FROM ubuntu:16.04
  # 配置环境变量，JDK的安装目录
  ENV JAVA_DIR=/usr/local
  
  # 拷贝jdk和java项目的包
  COPY ./jdk8.tar.gz $JAVA_DIR/
  COPY ./docker-demo.jar /tmp/app.jar
  
  # 安装JDK
  RUN cd $JAVA_DIR \
   && tar -xf ./jdk8.tar.gz \
   && mv ./jdk1.8.0_144 ./java8
  
  # 配置环境变量
  ENV JAVA_HOME=$JAVA_DIR/java8
  ENV PATH=$PATH:$JAVA_HOME/bin
  
  # 暴露端口
  EXPOSE 8090
  # 入口，java项目的启动命令
  ENTRYPOINT java -jar /tmp/app.jar
  ```

  

- 步骤5：进入docker-demo

  将准备好的docker-demo上传到虚拟机任意目录，然后进入docker-demo目录下

- 步骤6：运行命令：

  ```sh
  docker build -t javaweb:1.0 .
  ```

这个点代表的是`dockerfile`所在的目录

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/0e04b24834f92a52cea43aef331e5654.png)

最后访问http://43.143.146.93:8090/hello/count，其中的ip改成你的虚拟机ip

![今天被访问了8次](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/04ed4238af1e2ea2081d1543c32e3548.png)



### 3.3.2.基于java8构建Java项目

虽然我们可以基于Ubuntu基础镜像，添加任意自己需要的安装包，构建镜像，但是却比较麻烦。所以大多数情况下，我们都可以在一些安装了部分软件的基础镜像上做改造。

例如，构建java项目的镜像，可以在已经准备了JDK的基础镜像基础上构建。



需求：基于java:8-alpine镜像，将一个Java项目构建为镜像

实现思路如下：

- ① 新建一个空的目录，然后在目录中新建一个文件，命名为Dockerfile

- ② 拷贝课前资料提供的docker-demo.jar到这个目录中

- ③ 编写Dockerfile文件：

  - a ）基于java:8-alpine作为基础镜像

  - b ）将app.jar拷贝到镜像中

  - c ）暴露端口

  - d ）编写入口ENTRYPOINT

    内容如下：

    ```dockerfile
    FROM java:8-alpine
    COPY ./app.jar /tmp/app.jar
    EXPOSE 8090
    ENTRYPOINT java -jar /tmp/app.jar
    ```

    

- ④ 使用docker build命令构建镜像

- ⑤ 使用docker run创建容器并运行



## 3.4.小结

小结：

1. Dockerfile的本质是一个文件，通过指令描述镜像的构建过程

2. ==Dockerfile的第一行必须是FROM，从一个基础镜像来构建==

3. 基础镜像可以是基本操作系统，如Ubuntu。也可以是其他人制作好的镜像，例如：java:8-alpine

> `java:8-alpine` 是一个基于 Alpine Linux 的轻量级 Docker 镜像，它内置了 OpenJDK 8 环境。
>
> Alpine Linux 是一个轻量级的 Linux 发行版，体积非常小，通常不到 5 MB。`java:8-alpine` 镜像继承了 Alpine Linux 的小巧特性，整个镜像的大小通常在 10 MB 左右。