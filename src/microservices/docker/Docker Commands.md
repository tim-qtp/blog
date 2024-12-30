---
order: 3
author: 
title: "Docker的基本操作"
category:
  - Docker
  - 镜像命令
  - 容器命令
  - 数据卷挂载


---

# 2.Docker的基本操作

## 2.1.镜像操作

### 2.1.1.镜像名称

首先来看下镜像的名称组成：

- 镜名称一般分两部分组成：[repository]:[tag]。
- 在没有指定tag时，默认是latest，代表最新版本的镜像

如图：

![image-20210731155141362](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/7ab7282084a7b300e0d3a69be6aece02.png)

这里的mysql就是repository，5.7就是tag，合一起就是镜像名称，代表5.7版本的MySQL镜像。



### 2.1.2.镜像命令

常见的镜像操作命令如图：

![image-20210731155649535](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/17dc13b3ccbcd68103b46128aeb92a3b.png)



### 2.1.3.案例1-拉取、查看镜像

需求：从DockerHub中拉取一个nginx镜像并查看

1）首先去镜像仓库搜索nginx镜像，比如[DockerHub](https://hub.docker.com/):

![image-20210731155844368](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/fb3217764d9edc6dc9bd7c790d91b369.png)

2）根据查看到的镜像名称，拉取自己需要的镜像，通过命令：docker pull nginx

![image-20210731155856199](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/96c3175c44df69904142bafd2005f575.png)

3）通过命令：docker images 查看拉取到的镜像

![image-20210731155903037](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/2029ddb0e737f9bbf65a1c5502f71edb.png)



### 2.1.4.案例2-保存、导入镜像

需求：利用docker save将nginx镜像导出磁盘，然后再通过load加载回来

1）利用docker xx --help命令查看docker save和docker load的语法

例如，查看save命令用法，可以输入命令：

```sh
docker save --help
```

结果：

![image-20210731161104732](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/6bc12ec0cdea34d6ff72f11cae68cc74.png)



命令格式：

```shell
docker save -o [保存的目标文件名称] [镜像名称]
```



2）使用docker save导出镜像到磁盘 

运行命令：

```sh
docker save -o nginx.tar nginx:latest
```

结果如图：

![image-20210731161354344](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/5e1888f5268e6ee81aef18cd33724795.png)



3）使用docker load加载镜像

先删除本地的nginx镜像：

```sh
docker rmi nginx:latest
```



然后运行命令，加载本地文件：

```sh
docker load -i nginx.tar
```

结果：

![image-20210731161746245](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/cc83ebd764e46e90e81604548545fb06.png)





### 2.1.5.练习

需求：去DockerHub搜索并拉取一个Redis镜像

目标：

1）去DockerHub搜索Redis镜像

2）查看Redis镜像的名称和版本

3）利用docker pull命令拉取镜像

4）利用docker save命令将 redis:latest打包为一个redis.tar包

5）利用docker rmi 删除本地的redis:latest

6）利用docker load 重新加载 redis.tar文件



## 2.2.容器操作

### 2.2.1.容器相关命令

容器操作的命令如图：

![image-20210731161950495](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/fcd89f6b617431b6f0be1c4f5145e5a3.png)

容器保护三个状态：

- 运行：进程正常运行
- 暂停：进程挂起，但不释放内存，内存暂存起来
- 停止：进程终止，回收进程占用的内存、CPU等资源



其中：

- docker run：创建并运行一个容器，处于运行状态
- docker pause：让一个运行的容器暂停
- docker unpause：让一个容器从暂停状态恢复运行
- docker stop：停止一个运行的容器
- docker start：让一个停止的容器再次运行

- docker rm：删除一个容器



### 2.2.2.案例-创建并运行一个容器

创建并运行nginx容器的命令：

```sh
docker run --name containerName -p 80:80 -d nginx
```

命令解读：

- docker run ：创建并运行一个容器
- --name : 给容器起一个名字，比如叫做mn
- -p ：将宿主机端口与容器端口映射，冒号左侧是宿主机端口，右侧是容器端口
- -d：后台运行容器
- nginx：镜像名称，例如nginx



这里的`-p`参数，是将容器端口映射到宿主机端口。

默认情况下，容器是隔离环境，我们直接访问宿主机的80端口，肯定访问不到容器中的nginx。

现在，将容器的80与宿主机的80关联起来，当我们访问宿主机的80端口时，就会被映射到容器的80，这样就能访问到nginx了：

![image-20210731163255863](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/6d56acdf897ad6d4a765945aff3c353c.png)



### 2.2.3.案例-进入容器，修改文件

**需求**：进入Nginx容器，修改HTML文件内容，添加“传智教育欢迎您”

**提示**：进入容器要用到docker exec命令。



**步骤**：

1）进入容器。进入我们刚刚创建的nginx容器的命令为：

```sh
docker exec -it mn bash
```

命令解读：

- docker exec ：进入容器内部，执行一个命令

- -it : 给当前进入的容器创建一个标准输入、输出终端，允许我们与容器交互

- mn ：要进入的容器的名称

- bash：进入容器后执行的命令，bash是一个linux终端交互命令



2）进入nginx的HTML所在目录 /usr/share/nginx/html

容器内部会模拟一个独立的Linux文件系统，看起来如同一个linux服务器一样：

![image-20210731164159811](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/b8d1a2000e4741866cc85a784e48409a.png)

nginx的环境、配置、运行文件全部都在这个文件系统中，包括我们要修改的html文件。

查看DockerHub网站中的nginx页面，可以知道nginx的html目录位置在`/usr/share/nginx/html`

我们执行命令，进入该目录：

```sh
cd /usr/share/nginx/html
```

 查看目录下文件：

![image-20210731164455818](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/b259f866372ddf082b112ffd1391ca04.png)





3）修改index.html的内容

容器内没有vi命令，无法直接修改，我们用下面的命令来修改：

```sh
sed -i -e 's#Welcome to nginx#春招顺利！！！#g' -e 's#<head>#<head><meta charset="utf-8">#g' index.html
```



在浏览器访问自己的虚拟机地址，例如我的是：http://8.140.248.10，即可看到结果：

![image-20241230100822780](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241230100822780.png)

### 2.2.4.小结



docker run命令的常见参数有哪些？

- --name：指定容器名称
- -p：指定端口映射
- -d：让容器后台运行

查看容器日志的命令：

- docker logs
- 添加 -f 参数可以持续查看日志

查看容器状态：

- docker ps
- docker ps -a 查看所有容器，包括已经停止的









## 2.3.数据卷（容器数据管理）

在之前的nginx案例中，修改nginx的html页面时，需要进入nginx内部。并且因为没有编辑器，修改文件也很麻烦。

这就是因为容器与数据（容器内文件）耦合带来的后果。

![image-20210731172440275](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/353ad7725cb1ac9e7a11fb7c96bc24b7.png)

要解决这个问题，必须将数据与容器解耦，这就要用到数据卷了。



### 2.3.1.什么是数据卷

**数据卷（volume）**是一个虚拟目录，指向宿主机文件系统中的某个目录。

![image-20210731173541846](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/578f9c52a8c44edbf684b34c4a4524b9.png)

一旦完成数据卷挂载，对容器的一切操作都会作用在数据卷对应的宿主机目录了。

这样，我们操作宿主机的`/var/lib/docker/volumes/html`目录，就等于操作容器内的`/usr/share/nginx/html`目录了



 

### 2.3.2.数据集操作命令



数据卷操作的基本语法如下：

```sh
docker volume [COMMAND]
```

docker volume命令是数据卷操作，根据命令后跟随的command来确定下一步的操作：

- create 创建一个volume
- inspect 显示一个或多个volume的信息
- ls 列出所有的volume
- prune 删除未使用的volume
- rm 删除一个或多个指定的volume



### 2.3.3.创建和查看数据卷

**需求**：创建一个数据卷，并查看数据卷在宿主机的目录位置

① 创建数据卷

```sh
docker volume create html
```



② 查看所有数据

```sh
docker volume ls
```

结果：

![image-20210731173746910](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/788ebfa96bb91499056c49280bab7157.png)





③ 查看数据卷详细信息卷

```sh
docker volume inspect html
```

结果：

![image-20210731173809877](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/bfcfb543416cc53d75b310c59011848b.png)

可以看到，我们创建的html这个数据卷关联的宿主机目录为`/var/lib/docker/volumes/html/_data`目录。

==所以，`create`后，宿主机和数据卷是自动创建并挂载的。==





**小结**：

数据卷的作用：

- 将容器与数据分离，解耦合，方便操作容器内数据，保证数据安全

数据卷操作：

- docker volume create：创建数据卷
- docker volume ls：查看所有数据卷
- docker volume inspect：查看数据卷详细信息，包括关联的宿主机目录位置
- docker volume rm：删除指定数据卷
- docker volume prune：删除所有未使用的数据卷



### 2.3.4.挂载数据卷

我们在创建容器时，可以通过 -v 参数来挂载一个数据卷到某个容器内目录，命令格式如下：

```sh
docker run \
  --name mn \
  -v html:/root/html \
  -p 8080:80
  nginx \
```

这里的-v就是挂载数据卷的命令：

- `-v html:/root/html` ：把html数据卷挂载到容器内的/root/html这个目录中



### 2.3.5.案例-给nginx挂载数据卷

**需求**：创建一个nginx容器，修改容器内的html目录内的index.html内容



**分析**：上个案例中，我们进入nginx容器内部，已经知道nginx的html目录所在位置/usr/share/nginx/html ，我们需要把这个目录挂载到html这个数据卷上，方便操作其中的内容。

**提示**：运行容器时使用 -v 参数挂载数据卷

步骤：

① 创建容器并挂载数据卷到容器内的HTML目录

```sh
docker run --name mn -v html:/usr/share/nginx/html -p 80:80 -d nginx
```



② 进入html数据卷所在位置，并修改HTML内容

```sh
# 查看html数据卷的位置
docker volume inspect html
# 进入该目录
cd /var/lib/docker/volumes/html/_data
# 修改文件
vi index.html
```

![image-20230612150425281](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/34b1773cfaa6a2afb5f10fcd7aa49088.png)

![image-20230612150507231](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/dc0d2545d1f5236bc53433240989a2c5.png)

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241230105940213.png)



### 2.3.6.小结

docker run的命令中通过 -v 参数挂载文件或目录到容器中：

- -v volume名称:容器内目录
- -v 宿主机文件:容器内文
- -v 宿主机目录:容器内目录

数据卷挂载与目录直接挂载的

- 数据卷挂载耦合度低，由docker来管理目录，但是目录较深，不好找
- 目录挂载耦合度高，需要我们自己管理目录，不过目录容易寻找查看

![image-20230612155530931](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/09098db2bf525c7b06249a1aae4193c3.png)


