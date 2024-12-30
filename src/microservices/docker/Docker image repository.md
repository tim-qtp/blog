---
order: 6
author: 
title: "镜像仓库 "
category:
  - Docker
  - 镜像仓库 


---

# 5.Docker镜像仓库 



## 5.1.搭建私有镜像仓库

### 5.1.1.Docker镜像仓库

搭建镜像仓库可以基于Docker官方提供的DockerRegistry来实现。

官网地址：https://hub.docker.com/_/registry



### 5.1.2.简化版镜像仓库

Docker官方的Docker Registry是一个基础版本的Docker镜像仓库，具备仓库管理的完整功能，但是没有图形化界面。

搭建方式比较简单，命令如下：

```sh
docker run -d \
    --restart=always \
    --name registry	\
    -p 5000:5000 \
    -v registry-data:/var/lib/registry \
    registry
```



命令中挂载了一个数据卷registry-data到容器内的/var/lib/registry 目录，这是私有镜像库存放数据的目录。 

访问http://YourIp:5000/v2/_catalog 可以查看当前私有镜像服务中包含的镜像



### 5.1.3.带有图形化界面版本

使用DockerCompose部署带有图象界面的DockerRegistry，命令如下：

```yaml
version: '3.0'
services:
  registry:
    image: registry
    volumes:
      - ./registry-data:/var/lib/registry
  ui:
    image: joxit/docker-registry-ui:static
    ports:
      - 8080:80
    environment:
      - REGISTRY_TITLE=传智教育私有仓库
      - REGISTRY_URL=http://registry:5000
    depends_on:
      - registry
```



### 5.1.4.配置Docker信任地址

我们的私服采用的是http协议，默认不被Docker信任，所以需要做一个配置：

```sh
# 打开要修改的文件
vi /etc/docker/daemon.json
# 添加内容：
"insecure-registries":["http://192.168.150.101:8080"]
# 重加载
systemctl daemon-reload
# 重启docker
systemctl restart docker
```



## 5.2.推送、拉取镜像

推送镜像到私有镜像服务必须先tag，步骤如下：

① 重新tag本地镜像，名称前缀为私有仓库的地址：43.143.146.93:8080

 ```sh
docker tag nginx:latest 43.143.146.93:8080/nginx:1.0 
 ```

② 推送镜像

```sh
docker push 43.143.146.93:8080/nginx:1.0 
```

③ 拉取镜像

```sh
docker pull 43.143.146.93:8080/nginx:1.0 
```

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/c3077419afd57ae4225a7f2550377d40.png)
1、推送本地镜像到仓库前都必须重命名(docker tag)镜像，以镜像仓库地址为前缀
2、镜像仓库推送前需要把仓库地址配置到docker服务的daemon.json文件中，被docker信任
3、推送使用docker push命令
4、拉取使用docker pull命令