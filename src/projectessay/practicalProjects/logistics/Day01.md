---
order: 1
author: 
title: "环境搭建与权限登录"
category:
  - 神领物流
  - 项目

---

## 1.项目介绍

### 1.1. 概述

神领物流是一个基于微服务架构体系的【**生产级**】物流项目系统

### 1.2. 基本业务流程

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image63.png)

流程说明：

- 客户在【**神领物流微信小程序**】中填写收、发件人地址，以及物品信息，提交订单
- 下单成功后，【**快递员上门取件**】，并要求用户进行【**在线支付**】
- 快递员取件成功后，会将快件送回到【**营业网点**】
- 快件到达营业网点后，司机开始运输，将快件交由【**转运中心**】进行一系列的转运
- 最后，快件会到达收件人所在的【**营业网点**】，再由【**快递员**】进行【**派件**】操作
- 收件人可以进行【**签收**】或【**拒收**】操作

### 1.3. 系统架构

![系统架构](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/yuque_diagram.jpg)

### 1.4. 技术架构

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/yuque_diagram.jpg)

## 2.环境搭建

![yuque_diagram (2)](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/yuque_diagram%20(2).jpg)

### 2.1.配置本机hosts：

在本机hosts文件中设置如下配置：

（也可以用uTools工具中的hosts插件修改）

```sh
192.168.150.101 git.sl-express.com
192.168.150.101 maven.sl-express.com
192.168.150.101 jenkins.sl-express.com
192.168.150.101 auth.sl-express.com
192.168.150.101 rabbitmq.sl-express.com
192.168.150.101 nacos.sl-express.com
192.168.150.101 neo4j.sl-express.com
192.168.150.101 xxl-job.sl-express.com
192.168.150.101 eaglemap.sl-express.com
192.168.150.101 seata.sl-express.com
192.168.150.101 skywalking.sl-express.com
192.168.150.101 api.sl-express.com
192.168.150.101 admin.sl-express.com
```

#### 服务列表:

| 名称       | 地址                                                         | 用户名/密码    | 端口  |
| ---------- | ------------------------------------------------------------ | -------------- | ----- |
| git        | [http://git.sl-express.com/](http://git.sl-express.com/)     | sl/sl123       | 10880 |
| maven      | [http://maven.sl-express.com/nexus/](http://maven.sl-express.com/nexus/) | admin/admin123 | 8081  |
| jenkins    | [http://jenkins.sl-express.com/](http://jenkins.sl-express.com/) | root/123       | 8090  |
| 权限管家   | [http://auth.sl-express.com/api/authority/static/index.html](http://auth.sl-express.com/api/authority/static/index.html) | admin/123456   | 8764  |
| RabbitMQ   | [http://rabbitmq.sl-express.com/](http://rabbitmq.sl-express.com/) | sl/sl321       | 15672 |
| MySQL      | -                                                            | root/123       | 3306  |
| nacos      | [http://nacos.sl-express.com/nacos/](http://nacos.sl-express.com/nacos/) | nacos/nacos    | 8848  |
| neo4j      | [http://neo4j.sl-express.com/browser/](http://neo4j.sl-express.com/browser/) | neo4j/neo4j123 | 7474  |
| xxl-job    | [http://xxl-job.sl-express.com/xxl-job-admin](http://xxl-job.sl-express.com/xxl-job-admin) | admin/123456   | 28080 |
| EagleMap   | [http://eaglemap.sl-express.com/](http://eaglemap.sl-express.com/) | eagle/eagle    | 8484  |
| seata      | [http://seata.sl-express.com/](http://seata.sl-express.com/) | seata/seata    | 7091  |
| Gateway    | [http://api.sl-express.com/](http://api.sl-express.com/)     | -              | 9527  |
| admin      | [http://admin.sl-express.com/](http://admin.sl-express.com/) | -              | 80    |
| skywalking | [http://skywalking.sl-express.com/](http://skywalking.sl-express.com/) | -              | 48080 |
| Redis      | -                                                            | 123321         | 6379  |
| MongoDB    | -                                                            | sl/123321      | 27017 |

#### 环境说明

通过上面的测试，可以通过域名访问各种服务了，访问过程是怎么样的呢？其实，在101机器中安装了nginx，通过反向代理功能访问到各种对应的服务。如下：

<img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/yuque_diagram%20(3).jpg" style="zoom:67%;" />

说明：

- 通过浏览器按照域名的访问访问，如：http://git.sl-express.com/ ，先通过本地系统的`hosts`文件找到映射的ip地址
- 此时，就会访问到虚拟机环境，由于请求没有加端口号，默认访问80端口
- 由于在101机器部署安装nginx服务并且占用的是80端口，请求就会进入nginx
- nginx会根据不同的域名将请求转发（==反向代理==）到不同的服务，例如：git.sl-express.com -> 127.0.0.1:18080
  通过`vim /usr/local/src/nginx/conf/nginx.conf`命令查看nginx的配置文件

```shell
server {
    listen       80;
    server_name  git.sl-express.com;
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   html;
    }

    location / {
        client_max_body_size  1024m;
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
        proxy_pass http://127.0.0.1:10880;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

}

    server {
        listen       80;
        server_name  jenkins.sl-express.com;
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }

        location / {
            client_max_body_size  300m;
            proxy_connect_timeout 300s;
            proxy_send_timeout 300s;
            proxy_read_timeout 300s;
            proxy_pass http://127.0.0.1:8090;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
	}	
```
### 2.2配置Maven私服 

在101机器中提供了maven私服，需要本地配置maven（建议版本为3.6.x）才能使用私服，配置文件参考如下：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<settings
        xmlns="http://maven.apache.org/SETTINGS/1.0.0"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0 http://maven.apache.org/xsd/settings-1.0.0.xsd">

    <!-- 本地仓库  这里要改成你自己的本地仓库位置 -->
    <localRepository>D:\maven\apache-maven-3.6.1\maven_repository</localRepository>

    <!-- 配置私服中deploy的账号 -->
    <servers>
        <server>
            <id>sl-releases</id>
            <username>deployment</username>
            <password>deployment123</password>
        </server>
        <server>
            <id>sl-snapshots</id>
            <username>deployment</username>
            <password>deployment123</password>
        </server>
    </servers>

    <!-- 使用阿里云maven镜像，排除私服资源库 -->
    <mirrors>
        <mirror>
            <id>mirror</id>
            <mirrorOf>central,jcenter,!sl-releases,!sl-snapshots</mirrorOf>
            <name>mirror</name>
            <url>https://maven.aliyun.com/nexus/content/groups/public</url>
        </mirror>
    </mirrors>

    <profiles>
        <profile>
            <id>sl</id>
            <!-- 配置项目deploy的地址 -->
            <properties>
                <altReleaseDeploymentRepository>
                    sl-releases::default::http://maven.sl-express.com/nexus/content/repositories/releases/
                </altReleaseDeploymentRepository>
                <altSnapshotDeploymentRepository>
                    sl-snapshots::default::http://maven.sl-express.com/nexus/content/repositories/snapshots/
                </altSnapshotDeploymentRepository>
            </properties>
            <!-- 配置项目下载依赖的私服地址 -->
            <repositories>
                <repository>
                    <id>sl-releases</id>
                    <url>http://maven.sl-express.com/nexus/content/repositories/releases/</url>
                    <releases>
                        <enabled>true</enabled>
                    </releases>
                    <snapshots>
                        <enabled>false</enabled>
                    </snapshots>
                </repository>
                <repository>
                    <id>sl-snapshots</id>
                    <url>http://maven.sl-express.com/nexus/content/repositories/snapshots/</url>
                    <releases>
                        <enabled>false</enabled>
                    </releases>
                    <snapshots>
                        <enabled>true</enabled>
                    </snapshots>
                </repository>
            </repositories>
        </profile>
    </profiles>

    <activeProfiles>
         <!-- 激活配置 -->
        <activeProfile>sl</activeProfile>
    </activeProfiles>

</settings>
```

1. **本地仓库**：

   ```xml
   <localRepository>D:\maven\apache-maven-3.6.1\maven_repository</localRepository>
   ```

   这部分指定了 Maven 的本地仓库位置，即 Maven 下载的依赖包将存储在这个目录下。

2. **服务器配置**（`servers`）： 配置了两个服务器，`sl-releases` 和 `sl-snapshots`，每个服务器都有对应的 `id`、`username` 和 `password`。这些信息用于 Maven 与私服（私有 Maven 仓库）进行交互时的认证。

3. **镜像配置**（`mirrors`）： 配置了一个镜像，`mirror`，它将所有请求重定向到阿里云的 Maven 镜像，除了 `sl-releases` 和 `sl-snapshots` 这两个私服资源库。这样可以加速依赖包的下载速度。

4. **配置文件**（`profiles`）： 定义了一个名为 `sl` 的配置文件，其中包含了两个部分：`properties` 和 `repositories`。

   - `properties` 中定义了项目部署到私服的地址，分别用于发布版本（`altReleaseDeploymentRepository`）和快照版本（`altSnapshotDeploymentRepository`）。
   - `repositories` 中定义了两个仓库，`sl-releases` 和 `sl-snapshots`，分别对应于发布版本和快照版本的私服地址。这里指定了哪些版本可以从此仓库下载。

5. **激活配置**（`activeProfiles`）： 指定了 Maven 启动时默认激活的配置文件，这里是 `sl`。

### 2.3git代码管理

#### 2.3.1GitFlow工作流程

在gitflow流程中，master和develop分支属于长期分支，长期分支是相对稳定，所有开发完成或测试通过的提交最终都要合并到这两个分支上，他俩也有一些区别：

- master：发布上线时，基于master打tag，基于tag进行发布，不允许在该分支上开发，始终保持该分支的稳定。
- develop：开发阶段使用的分支，提交到该分支代码都是相对稳定的，不能直接基于此分支开发，如果开发新的功能，需要基于此分支创建新的分支进行开发功能，待功能开发、测试通过后合并到develop分支。

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/yuque_diagram%20(4).jpg)

对于新功能的开发，基于Develop分支创建Feature分支，功能开发完后合并到Develop分支，**禁止未开发完成的代码合并到Develop分支**。

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/yuque_diagram%20(5).jpg)

在开发中，新功能的代码已经全部合并到Develop分支，此时需要基于Develop分支创建Release分支，在Release分支中不再添加新的功能，只是做bug的修复，等测试完成bug全部修复之后，需要将Release分支合并到Master分支和Develop分支，并且基于Master打出版本的tag。

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/yuque_diagram%20(6).jpg)

如果发布到生成环境的版本出现bug，比如：生产环境的v1.0版本出现bug需要尽快修复，此时就需要基于master创建hotfix分支，并且基于hotfix分支修复bug，待bug修复完成后需要将代码合并到master和develop分支。

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/yuque_diagram%20(7).jpg)

#### 2.3.2. 基于gogs服务开发

项目中将基于gogs服务进行开发

#### 2.3.2.1. 拉取代码

拉取代码步骤：

- 在本地创建 `sl-express` 文件夹，该目录存放项目课程期间所有的代码
  ![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680659969897-8a30aeac-6848-4b23-8d1a-8d32cacf955b.png)
- 启动idea，打开该目录
  ![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680660010437-6f258de6-653d-437d-a449-3a76bfe6f4de.png)
- 设置项目jdk为11版本
  ![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680660081098-b4144db6-749e-4e3c-8125-82cc5b7863ed.png)
- 拉取[sl-express-gitflow-web](http://git.sl-express.com/sl/sl-express-gitflow-web)代码，在本地运行起来，目前项目版本为1.0。

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680056971815-7dc6882b-3ea4-4391-bc28-3828758e3af4.png)

- 拉取完成后，点击【Cancel】按钮：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680057090942-cd9590ec-a0ad-4ab3-be4d-a4ef2a1773fc.png)

- 导入Module：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680057977065-2d1eab4c-e58f-4c83-a1a8-0b34b5967ff3.png)

- 启动后访问http://127.0.0.1:18099/doc.html

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680058134295-6d2c02e9-7ac3-414b-b4cf-6cf770b1fbb8.png)

- 测试功能：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680058172432-c9f772ef-613b-40f4-b409-7555b111295c.png)

#### 2.3.2.2. 创建develop分支

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680060724555-a69bcac8-8580-4ab2-88a1-4fc7b3495fb9.png)

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680060749999-1a20fc6a-88e3-4122-8bfe-214483440b36.png)

推送develop分支到gogs：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680060820627-1f803ee7-28ce-4e76-8c1e-e3f261dced08.png)

推送成功：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680060847611-3fb1e5d3-5a9d-46f6-8762-d4d7fd308aed.png)

#### 2.3.2.3. 基于feature分支开发新功能

开发新的功能需要基于develop分支创建feature分支，假设我们需要增加一个相乘的接口。

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680061424830-bb00dd4f-bb3a-4f6c-9b0b-336aa016903c.png)

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680061462768-1f225e10-78e1-4da9-adaa-2bd78927fff2.png)

在`com.sl.gitflow.controller.GitFlowController`中新增相乘的方法：

```java
    @ApiOperation("两个数相乘")
    @GetMapping("/mul")
    @ApiImplicitParams({@ApiImplicitParam(name = "value1", value = "第一个数", example = "1"), @ApiImplicitParam(name = "value2", value = "第两个数", example = "2")})
    public R<Object> mul(@RequestParam(value = "value1") Long value1, @RequestParam(value = "value2") Long value2) {
        return R.success(value1 * value2);
    }
```

重启、测试：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680061725687-cf9caf04-8608-410f-9c89-bc432752d8df.png)

测试完成后，将代码合并到`develop`分支：

提交代码（此时，在feature分支进行提交）：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680061831737-361b755b-4e22-408d-9554-6138cca68cc8.png)

切换到develop分支：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680061875435-1829feda-6089-4220-bbeb-91bfaa241b8c.png)

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680061998134-e3e917fe-71dd-4635-b6c4-675f8bc2806b.png)

推送develop分支到gogs：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680062111241-d4fef071-7fad-4693-bcc3-f40ae8063e48.png)

推送成功：

![](C:/Users/lenovo/AppData/Roaming/Typora/typora-user-images/image-20241228111555997.png)

推送完成后，==一般情况需要将feature分支删除掉，不推送到远程仓库==。

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680062263879-c095d51b-7e46-43c9-9feb-e8db2601bdca.png)

#### 2.3.2.4. 创建Release分支

在`develop`分支开发基本上结束后，将基于`develop`分支创建`release`分支，在此分支进行测试，测试完成后合并到`master`和`develop`分支。

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680071027705-7477bfc9-e32f-4a51-9cb9-84c8d94eafea.png)

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680071057337-5d1e3d7a-b798-4061-8dd7-1950d5e39e85.png)

创建分支后，模拟测试和bug修复，对代码增加注释改动：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680071244504-ef89b028-3b03-47f8-9eee-4c25abe873af.png)

提交代码：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680071377668-3654567e-3ad7-462a-8c4c-546f89897dc3.png)

推送到远程仓库：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680071538087-25b29434-4497-4d90-b85a-f5396a2f63f5.png)

推送成功：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241228112546175.png)

所有测试完成后，将`release`分支合并回`master`和`develop`，并且推送到远程仓库。

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680071682013-7d476e3b-e308-44df-ba32-3de56ec13478.png)

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680071751201-de2617b1-badb-4573-a6f7-ef8da37fce64.png)

#### 2.3.2.5. 创建tag标签

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680072254705-c1babc63-c34d-4482-bbdd-e92a6f25ab1c.png)

推送到远程：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680072484520-f7621773-7d02-4b03-8db0-3180cccc8c12.png)

推送成功：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680072499226-ede5e2ad-df9c-45f0-b644-d8594c52c4ca.png)

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241228113658321.png)

创建tag完成后，就可以基于tag发布了。

## 3.项目代码列表

在虚拟机中的gogs服务中已经提供了项目中所涉及都的项目代码，目前项目拥有**19**个微服务，**1**个网关，**1**个parent工程，**2**个公共依赖工程。如下：

| 序号 | 项目名称                                                     | 说明           |
| ---- | ------------------------------------------------------------ | -------------- |
| 1    | [sl-express-parent](http://git.sl-express.com/sl/sl-express-parent.git) | 父工程         |
| 2    | [sl-express-common](http://git.sl-express.com/sl/sl-express-common.git) | 通用工程       |
| 3    | [sl-express-mq](http://git.sl-express.com/sl/sl-express-mq.git) | 统一消息代码   |
| 4    | [sl-express-gateway](http://git.sl-express.com/sl/sl-express-gateway.git) | 统一网关       |
| 5    | [sl-express-ms-base](http://git.sl-express.com/sl/sl-express-ms-base-service.git) | 基础微服务     |
| 6    | [sl-express-ms-carriage](http://git.sl-express.com/sl/sl-express-ms-carriage-service.git) | 运费微服务     |
| 7    | [sl-express-ms-courier](http://git.sl-express.com/sl/sl-express-ms-courier-service.git) | 快递员微服务   |
| 8    | [sl-express-ms-dispatch](http://git.sl-express.com/sl/sl-express-ms-dispatch-service.git) | 调度微服务     |
| 9    | [sl-express-ms-driver](http://git.sl-express.com/sl/sl-express-ms-driver-service.git) | 司机微服务     |
| 10   | [sl-express-ms-oms](http://git.sl-express.com/sl/sl-express-ms-oms-service.git) | 订单微服务     |
| 11   | [sl-express-ms-service-scope](http://git.sl-express.com/sl/sl-express-ms-service-scope-service.git) | 服务范围微服务 |
| 12   | [sl-express-ms-sms](http://git.sl-express.com/sl/sl-express-ms-sms-service.git) | 短信微服务     |
| 13   | [sl-express-ms-track](http://git.sl-express.com/sl/sl-express-ms-track-service.git) | 轨迹微服务     |
| 14   | [sl-express-ms-trade](http://git.sl-express.com/sl/sl-express-ms-trade-service.git) | 支付微服务     |
| 15   | [sl-express-ms-transport](http://git.sl-express.com/sl/sl-express-ms-transport-service.git) | 路线微服务     |
| 16   | [sl-express-ms-transport-info](http://git.sl-express.com/sl/sl-express-ms-transport-info-service.git) | 物流信息微服务 |
| 17   | [sl-express-ms-user](http://git.sl-express.com/sl/sl-express-ms-user-service.git) | 用户微服务     |
| 18   | [sl-express-ms-web-courier](http://git.sl-express.com/sl/sl-express-ms-web-courier.git) | 快递员web服务  |
| 19   | [sl-express-ms-web-customer](http://git.sl-express.com/sl/sl-express-ms-web-customer.git) | 用户web服务    |
| 20   | [sl-express-ms-web-driver](http://git.sl-express.com/sl/sl-express-ms-web-driver.git) | 司机web服务    |
| 21   | [sl-express-ms-web-manager](http://git.sl-express.com/sl/sl-express-ms-web-manager.git) | 后台web服务    |
| 22   | [sl-express-ms-work](http://git.sl-express.com/sl/sl-express-ms-work-service.git) | 运单微服务     |
| 23   | [sl-express-ms-search](http://git.sl-express.com/sl/sl-express-ms-search-service.git) | 搜索微服务     |

为什么要有父工程，用来定义各种依赖的版本号的！

<div style="background-color: #2C3E50; color: #FFFFFF; padding: 10px; border-radius: 5px;">
  <p>❓思考：是否需要把所有的工程代码都拉取到本地进行编译运行？</p>
  <p>不需要的。你只需要将自己将要负责的开发任务相关的代码拉取到本地进行开发即可，其他的服务都可以调用测试环境正在运行的服务。</p>
  <p>另外，你有可能是没有权限拉取到其他开发组的代码的。</p>
</div>

## 4.Jenkins

### 4.1、持续集成

持续集成是指，开发人员将代码合并到远程仓库后，需要【**自动**】的完成构建、部署等操作。

下面以Spring Boot web项目举例，说明使用Jenkins进行持续集成的过程。

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680080244259-11b4dcaf-25d2-4b0c-9c8b-67c82afaf21b.jpeg)

过程说明：

- 本地开发环境推送代码到远程仓库
- 推送完成后，git服务会向Jenkins发送通知
- Jenkins接收到通知后，开始触发构建（也可以手动触发构建）
- 【git pull】从git仓库中拉取最新的代码
- 【maven package】通过maven进行打包，Spring Boot项目会打成可执行的jar包
- 【docker build & push】构建docker镜像，一般会将docker镜像上传到公司内部私服
- 【ssh remote】通过ssh命令登录到远程服务器（部署的目标服务器）
- 【docker pull】通过公司内部私服拉取docker镜像
- 【docker run】基于拉取到的镜像，运行容器
- 最后，完成构建

### 4.2、Jenkins使用

下面以部署【[sl-express-gitflow-web](http://git.sl-express.com/sl/sl-express-gitflow-web)】为例，通过Jenkins进行部署。

**第一步**，打开[Jenkins](http://jenkins.sl-express.com/)，通过root/123登录。

<img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680080929516-9cf78457-497c-4fa9-aebe-82077248e33a.png" alt="img"  />

**第二步**，创建构建任务：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680081096971-e3064c7f-81bc-400a-bde8-e7e1a1d56659.png)

**第三步**，设置任务内容：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680081234273-436b6176-a85c-434f-9479-83409abcd7fb.png)

设置一些构建参数：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680081800716-9af71335-c96a-45ef-b258-bf636dc43965.png)

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680081764737-6ed91faa-79d5-426e-b2a5-7e2eb4000ff1.png)

设置版本号参数：（该参数会在后面部署时使用）

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680141797017-3b7bf2b0-9b4c-45f7-bf6d-c787a17f76da.png)

设置微服务注册到nacos中的ip地址：（该参数会在后面部署时使用）`SPRING_CLOUD_NACOS_DISCOVERY_IP`

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680141930773-5e3b38f3-7bb9-4016-913c-2f6d67e68a8a.png)

设置端口参数：（该参数会在后面部署时使用）

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680141988489-201421d4-3d16-4366-8ab5-6f4f8315e75b.png)

设置服务名称参数：（该参数会在后面部署时使用）

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680142050034-18526f1a-5307-406e-9e52-6d1b285913af.png)

设置git仓库信息：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680082191526-96557cd5-e6bf-4562-8586-f960a08348b0.png)

设置分支：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680082342825-b4a9a3f0-0781-454d-a7bd-a7a81d693ac7.png)

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680082465863-790adae4-80d0-4530-ae83-f55b2ff746d2.png)

设置构建步骤：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680142386002-42c73045-700c-45fd-97d6-1fd6373c04fa.png)

```
chmod a+rw /var/run/docker.sock
```

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680083290215-e7328c65-34ee-4029-aa53-095b25e892d8.png)

```
clean package -Dmaven.test.skip=true -U
```

设置部署脚本：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680142566578-96f36191-1383-4961-ae59-e907c6a5af69.png)



```shell
#!/bin/bash
# 微服务名称
SERVER_NAME=${serverName}
# 服务版本
SERVER_VERSION=${version}
# 服务端口
SERVER_PORT=${port}
# 源jar名称，mvn打包之后，target目录下的jar包名称
JAR_NAME=$SERVER_NAME-$SERVER_VERSION
# jenkins下的目录
JENKINS_HOME=/var/jenkins_home/workspace/$SERVER_NAME
#进入jenkins目录
cd $JENKINS_HOME
# 修改文件权限
chmod 755 target/$JAR_NAME.jar
#输出docker版本
docker -v
echo "---------停止容器（$SERVER_NAME）---------"
docker stop $SERVER_NAME
echo "---------删除容器（$SERVER_NAME）---------"
docker rm $SERVER_NAME
echo "---------删除镜像（$SERVER_NAME:$SERVER_VERSION）---------"
docker rmi $SERVER_NAME:$SERVER_VERSION
echo "---------构建新镜像（$SERVER_NAME:$SERVER_VERSION）---------"
docker build -t $SERVER_NAME:$SERVER_VERSION .
echo "---------运行服务---------"
docker run -d -p $SERVER_PORT:8080 --name $SERVER_NAME -e SERVER_PORT=8080 -e SPRING_CLOUD_NACOS_DISCOVERY_IP=${SPRING_CLOUD_NACOS_DISCOVERY_IP} -e  SPRING_CLOUD_NACOS_DISCOVERY_PORT=${port} $SERVER_NAME:$SERVER_VERSION
```

开始构建：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680142792090-1c44a1a6-b691-4f5f-8edc-83384a9ebba8.png)

构建日志：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680142957129-76cc27c1-feb9-4f0b-9fee-c2450c5b8b72.png)

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680143221858-3bfcc3b7-8622-45d8-adc8-afbdb86b27a9.png)

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680143358615-c9fe8f99-6c07-4889-9038-925cb65ffdef.png)

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680143429467-b5838361-837c-47c2-8de3-b6433e467b68.png)

测试：http://192.168.150.101:18099/doc.html

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680143474183-35ea72c7-dd7b-44e0-974c-698b0e313bbe.png)

可以看到已经部署成功。



### 4.3、自动构建

想要实现在代码推送到git仓库后自动开始构建，需要分别在gogs和Jenkins中进行设置。

#### 4.3.1、gogs设置

点击【仓库设置】：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680144370437-d71f087a-0a89-45f2-a8f4-3f53732f1b51.png)

添加web钩子：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680144403527-3c505085-61fd-41ad-b49e-2e45c5e1f2b6.png)

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680144729401-814ce094-342d-4b3c-9e2a-24f9fe9f8550.png)

url格式：`http(s)://<< jenkins-server >>/gogs-webhook/?job=<< jobname >>`

添加成功：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680144754107-1d2054e5-2afd-48fa-a493-e5eb661fa8cc.png)

#### 4.3.2、Jenkins设置

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680145323880-6a2e8b4a-7917-4b6f-b389-3216fbdd5e2b.png)

#### 4.3.3、模拟推送

可以在gogs中模拟发起推送通知，来测试是否可以自动构建。

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680145597156-4b9eb7d4-faf9-4eac-9aa6-4597707bf4a3.png)

查看执行记录：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680145682197-a41c8552-56ba-424d-955a-07bbbd35463e.png)



## 5、登录业务

登录业务分别在四个终端都有涉及

四端的需求文档地址：

| 用户端   | https://share.lanhuapp.com/#/invite?sid=qx01hbI7      密码: UxGE |
| -------- | ------------------------------------------------------------ |
| 快递员端 | https://share.lanhuapp.com/#/invite?sid=qxe42Dya     密码: Nomz |
| 司机端   | https://share.lanhuapp.com/#/invite?sid=qX0NEmro   密码: yrzZ |
| 管理端   | https://share.lanhuapp.com/#/invite?sid=qX0axVem    密码: fh3i |

### 5.1、实现分析

实现登录业务主要会涉及到2个接口，分别是获取验证码、登录接口。

业务流程如下：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/ae036dfe86b559ec2479aadfb87d9f64.svg)

### 5.2、验证码功能

在登录功能中，为了防止恶意的登录操作，所以需要添加验证码功能，实现的效果如下：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680659547210-f41f018b-6e23-4b21-8da8-6e51ad65e26e.png)

### 5.3、拉取代码

- 登录 [git](http://git.sl-express.com/) 服务，找到 [sl-express-ms-web-manager](http://git.sl-express.com/sl/sl-express-ms-web-manager) 工程，拷贝地址，在idea中拉取代码（注意存储路径）
  ![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680660181773-630480ea-b7c2-4a01-bafc-7bbc0d1e0d34.png)

  ![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680660243243-f478eb17-0f04-4df2-a9d4-a569d163f304.png)

  ![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680660297460-8428940d-99f1-4418-8aea-8a63c16abd64.png)

- 添加modules，将 sl-express-ms-web-manager 加入进来
  ![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680660404022-6435d227-00bf-410f-8ebf-b577b4805ce4.png)

- 代码拉取完成

项目中的配置文件说明：

| 文件                | 说明                                             |
| ------------------- | ------------------------------------------------ |
| bootstrap.yml       | 通用配置项，服务名、日志文件、swagger配置等      |
| bootstrap-local.yml | 多环境配置，本地开发环境                         |
| bootstrap-prod.yml  | 多环境配置，生成环境（学习阶段忽略该文件）       |
| bootstrap-stu.yml   | 多环境配置，学生101环境                          |
| bootstrap-test.yml  | 多环境配置，开发组测试环境（学习阶段忽略该文件） |
| logback-spring.xml  | 日志配置文件                                     |

### 5.4、实现分析

将工程启动后，通过[swagger](http://127.0.0.1:18093/doc.html)接口页面可以看到获取验证码的的接口。

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680661756976-d8272866-8cbd-4d30-a34e-c3fa1c305072.png)

可以看出，接口地址、请求方法、请求参数。

同样，也可以在资料中的接口文档查看（管理员端.md）：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680840693289-1947d76c-fd80-49f9-815e-f803cb141443.png)

验证码的实现方式有很多种，项目中我们通过[hutool](https://www.hutool.cn/docs/#/captcha/概述)工具包中的验证码模块来实现。实现的效果如下：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680662378168-255ab669-bbcf-45ce-9fe0-831877ee6ce8.png)

其实这样是不能满足需求的，需求中验证码是两个数字的运算，类似这样：![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680662464903-db7ed5a2-b686-43ac-b675-f1843771d93f.png)

所以，需要使用自定义验证码功能：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680662545784-bca60728-5991-4417-ab9c-0ccdba3992dc.png)

### 5.5、具体实现

首先，基于master分支创建develop分支，用于功能的开发。

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680662664799-f9c9f89b-9a48-4a68-8f11-521c0faaaf8b.png)

Controller的代码定义如下：`com.sl.ms.web.manager.controller.auth.AuthController#captcha`

![img](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680662774620-85af45cd-1189-434b-bd8d-ce25a392ad48.png)

具体的业务实现是在`com.sl.ms.web.manager.service.AuthService`中完成。

```java
	private static final String CAPTCHA_REDIS_PREFIX = "CAPTCHA_";

	@Override
    public void createCaptcha(String key, HttpServletResponse response) throws IOException {
        //1. 生成验证码，指定宽、高、字符个数、干扰线条数
        LineCaptcha lineCaptcha = CaptchaUtil.createLineCaptcha(115, 42, 0, 10);
        //1.1 设置生成器为数字计算验证码生成器并且指定参与计算最大数字位数为1，也就是个位数相加
        lineCaptcha.setGenerator(new MathGenerator(1));
        //1.2 获取生成的验证码值
        String code = lineCaptcha.getCode();

        //2. 将验证码的值写入到redis，有效期为1分钟
        String redisKey = CAPTCHA_REDIS_PREFIX + key;
        this.stringRedisTemplate.opsForValue().set(redisKey, code, Duration.ofMinutes(1));

        //3. 输出到页面，设置页面不缓存
        response.setHeader(HttpHeaders.PRAGMA, "No-cache");
        response.setHeader(HttpHeaders.CACHE_CONTROL, "No-cache");
        response.setDateHeader(HttpHeaders.EXPIRES, 0L);
        lineCaptcha.write(response.getOutputStream());
    }

Pragma是一个HTTP/1.0的头部字段，用于向后兼容。在HTTP/1.1中，Pragma头通常被Cache-Control头所取代。No-cache指令告诉浏览器和代理服务器，它们必须先向服务器确认响应是否被更改，才能使用缓存中的版本。
```

在Controller中调用Service中的方法：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680665768083-4dc16ff5-79f1-43f5-adbd-97d437953833.png)

### 5.6、测试

重启服务，基于swagger进行测试：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680665814287-4e7bce09-600c-49c5-9b81-bf12d4444bd7.png)

检查redis中的值：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680665908660-40713775-113f-4f21-a3ae-e209a52f2d9b.png)

可以看到，验证码数据成功写入到redis中。

## 6、部署前端

前面已经完成了验证码功能的开发，下面我们将基于前端页面进行测试，所以需要将前端部署起立，部署前端的步骤：

第一步：拉取【[project-slwl-admin-vue](http://git.sl-express.com/sl/project-slwl-admin-vue)】代码。

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680676302182-896758d5-8354-4e4b-a76a-6a4d631939d2.png)

第二步：修改`.env.production.stu`文件，设置前后端交互接口改为本机地址和端口：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680676346306-9a3221d5-0302-4e8d-ad97-8246a850672b.png)

第三步，提交代码到git中，使用Jenkins进行部署：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1682322736096-f661d375-6605-426b-9eca-a09e4abc699f.png)

访问地址进行测试：[http://admin.sl-express.com/](http://admin.sl-express.com/#/login)

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680676912402-f9c480b1-bd69-4113-88a4-031dbad7d90e.png)

查看发送的请求：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680676989625-eae2d8f2-9ad6-4cc4-b379-83a8ed04df6c.png)

## 3.4、实现登录

获取验证码后，用户输入用户名和密码进行登录：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680746947614-fdc34a38-c8fc-42b4-8e81-df69d60f86fe.png)

### 3.4.1、实现分析

在登录业务功能中，需要对用户输入的用户名、密码以及验证码进行校验，只有全部校验通过后才能是登录成功。

在登录成功后，需要生成用户的登录凭证，也就是token，在项目中，采用jwt的方式生成token。

在后续的请求中，前端需要将token放置到请求头中发送到服务端，服务端需要对token进行校验。

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680748141364-0f3c6bfc-77ae-43fe-a4b2-b1be153677cb.png)

提交的参数：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680748294709-d89a97d3-e2a9-4e62-87d0-088ca55def58.png)

响应数据结构参考swagger文档：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680840974297-3b488789-5665-4e31-bf13-bc6e0348bfa4.png)

### 3.4.2、具体实现

```java
    /**
     * 登录
     *
     * @param login 用户登录信息
     * @return 登录结果
     */
    @Override
    public R<LoginDTO> login(LoginParamDTO login) {
        //1. 校验参数
        if (ObjectUtil.hasEmpty(login.getCode(), login.getKey())) {
            return R.error("验证码不能为空");
        }
        if (ObjectUtil.hasEmpty(login.getAccount(), login.getPassword())) {
            return R.error("用户名、密码不能为空");
        }

        //2. 校验验证码
        String redisKey = CAPTCHA_REDIS_PREFIX + login.getKey();
        String redisValue = this.stringRedisTemplate.opsForValue().get(redisKey);
        if (ObjectUtil.isEmpty(redisValue)) {
            return R.error("验证码已过期");
        }
        //验证码只能使用一次，所以需要将验证码删除
        this.stringRedisTemplate.delete(redisKey);
        boolean verify = new MathGenerator().verify(redisValue, login.getCode());
        if (!verify) {
            return R.error("验证码不正确");
        }

        //3. 校验用户名密码，校验通过生成token
        return this.login(login.getAccount(), login.getPassword());
    }

    /**
     * 登录获取token
     *
     * @param account  账号
     * @param password 密码
     * @return 登录信息
     */
    @Override
    public R<LoginDTO> login(String account, String password) {
        //说明：由于后台系统的账号在后面会由【权限管家】系统中管理，由于【权限管家】目前还没学习，所以这里的登录先做【模拟实现】
        if (!(StrUtil.equals(account, "shenlingadmin") && StrUtil.equals(password, "123456"))) {
            return R.error("用户名或密码错误");
        }

        LoginDTO loginDTO = new LoginDTO();

        //设置token
        Token token = new Token();
        token.setToken("eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIxMDI0NzA1NzA5MjU1NzczMzQ1IiwiYWNjb3VudCI6InNoZW5saW5nYWRtaW4iLCJuYW1lIjoi56We6aKG566h55CG5ZGYIiwib3JnaWQiOjEwMjQ3MDQ4NDQ0ODY3NTY2NDEsInN0YXRpb25pZCI6MTAyNDcwNTQ4OTQzNjQ5NDcyMSwiYWRtaW5pc3RyYXRvciI6ZmFsc2UsImV4cCI6MTY4MDc5NjE5OX0.W4RrB4p5YmjgEcdyGbbL4UrdWFirFbUu_e8Pgwxgr6vBVnj5z40JcFG4X3nIbrIXcSXUldi6oEuNfqAtZ9dUUw");
        token.setExpire(9999);
        loginDTO.setToken(token);

        //设置用户信息
        UserDTO userDTO = new UserDTO();
        userDTO.setAccount(account);
        userDTO.setName("神领管理员");
        //其它属性暂时不设置
        loginDTO.setUser(userDTO);

        return R.success(loginDTO);

    }
```

在Controller中调用：

```java
    /**
     * 管理端登录
     *
     * @param login 登录信息
     * @return 用户信息
     */
    @PostMapping(value = "/login")
    @ApiOperation(value = "登录", notes = "登录")
    public R<LoginDTO> login(@RequestBody LoginParamDTO login) {
        return this.authService.login(login);
    }
```

### 3.4.3、测试

基于swagger接口进行测试：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680776094854-c0d70ac7-4645-405b-bda3-06c981fb77ae.png)

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680776126776-c67b5a89-686e-47b9-a164-8654213f6723.png)

基于前端测试：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680776255082-694e791c-8cb2-4d00-a667-04325558711f.png)

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1680776266830-491d5641-f31b-4df5-924a-f511ef7b4459.png)

说明：

基于前端测试目前只能测试登录接口，在登录成功后还无法正常进入后台首页，原因是在`com.sl.ms.web.manager.config.ManagerWebConfig`中配置了`com.sl.transport.common.interceptor.UserInterceptor`拦截器，这个拦截器是对请求是否来源于网关的校验，而目前我们还没有网关，所以暂时先不测试成功跳转首页。







