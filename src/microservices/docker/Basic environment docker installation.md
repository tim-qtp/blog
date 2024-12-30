---
order: 7
author: 
title: "基础脚手架环境安装"
category:
  - Docker
  - 安装环境

---

## Redis安装

- 下载Redis`7`的docker镜像：

```sh
docker pull redis:7
```

- 使用如下命令启动Redis服务：

```sh
docker run -p 6379:6379 --name redis \
-v /mydata/redis/data:/data \
-d redis:7 redis-server --appendonly yes
```

- 进入Redis容器使用`redis-cli`命令进行连接：

```sh
docker exec -it redis redis-cli
```

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241230172248420.png)



## JDK安装

- 宝塔方式安装，默认安装路径为

```sh
/www/server/java/jdk1.8.0_371
```

- 安装包解压方式

```sh
# jdk镜像仓库：https://repo.huaweicloud.com/java/jdk/8u171-b11/

# 下载、解压jdk
wget https://repo.huaweicloud.com/java/jdk/8u171-b11/jdk-8u171-linux-x64.tar.gz
tar -zxf jdk-8u171-linux-x64.tar.gz
mv jdk1.8.0_171 /usr/local/jdk8

# 配置环境
vi /etc/profile

# 添加内容：
export JAVA_HOME=/usr/local/jdk8
export PATH=$JAVA_HOME/bin:$PATH

# 配置生效命令
source /etc/profile
#查看java版本命令
java -version
```

- unzip命令安装

```sh
yum install -y unzip
```



## MySQL8.0安装

- 新建本机配置文件夹`/mydata/mysql/conf`，且创建配置文件

```sh
#创建MySQL配置文件
mkdir -p /mnt/mysql/conf
#创建配置文件mysql.cnf
vim /mnt/mysql/conf/mysql.cnf

#内容如下：
[mysqld]
# 设置关闭二进制日志
skip-log-bin
```

- 启动MySQL容器

```sh
docker run -p 3306:3306 --name mysql \
-v /mydata/mysql/log:/var/log/mysql \
-v /mydata/mysql/data:/var/lib/mysql \
-v /mydata/mysql/conf:/etc/mysql/conf.d  \
-e MYSQL_ROOT_PASSWORD=NFNUL0ec1pqN  \
-e TZ=Asia/Shanghai \
-d mysql:8.0
```



## Nacos

```SH
docker run -id --name nacos \
--restart=always -p 8848:8848 \
-e MODE=standalone nacos/nacos-server
```



## RabbitMQ安装

- 下载rabbitmq3.9.11-management的docker镜像：

```sh
docker pull rabbitmq:3.9.11-management
```

- 使用如下命令启动RabbitMQ服务：

```sh
docker run -p 5672:5672 -p 15672:15672 --name rabbitmq \
-v /mydata/rabbitmq/data:/var/lib/rabbitmq \
-d rabbitmq:3.9.11-management
```



- 开启防火墙

```sh
firewall-cmd --zone=public --add-port=15672/tcp --permanent
firewall-cmd --reload
```



- 访问地址查看是否安装成功：http://192.168.3.101:15672



![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/mall_linux_deploy_03.png)

-  输入账号密码并登录：guest guest 
-  创建帐号并设置其角色为管理员：mall mall 



![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/re_mall_deploy_docker_01.png)



- 创建一个新的虚拟host为：/mall



![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/re_mall_deploy_docker_02.png)

- 点击mall用户进入用户配置页面

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/re_mall_deploy_docker_03.png)

- 给mall用户配置该虚拟host的权限

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/re_mall_deploy_docker_04.png)



## Elasticsearch安装

- 下载Elasticsearch`7.17.3`的docker镜像：

```sh
docker pull elasticsearch:7.17.3
```

- 修改虚拟内存区域大小，否则会因为过小而无法启动:

```sh
sysctl -w vm.max_map_count=262144
```

- 使用如下命令启动Elasticsearch服务，内存小的服务器可以通过`ES_JAVA_OPTS`来设置占用内存大小：

```sh
docker run -p 9200:9200 -p 9300:9300 --name elasticsearch \
-e "discovery.type=single-node" \
-e "cluster.name=elasticsearch" \
-e "ES_JAVA_OPTS=-Xms512m -Xmx1024m" \
-v /mydata/elasticsearch/plugins:/usr/share/elasticsearch/plugins \
-v /mydata/elasticsearch/data:/usr/share/elasticsearch/data \
-d elasticsearch:7.17.3
```

- 启动时会发现`/usr/share/elasticsearch/data`目录没有访问权限，只需要修改`/mydata/elasticsearch/data`目录的权限，再重新启动即可；

```sh
chmod 777 /mydata/elasticsearch/data/
```

- 安装中文分词器IKAnalyzer，注意下载与Elasticsearch对应的版本，下载地址：https://release.infinilabs.com/analysis-ik/stable/

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241230172824287.png)

- 下载完成后解压到Elasticsearch的`/mydata/elasticsearch/plugins`目录下；
- 重新启动服务：

```sh
docker restart elasticsearch
```

- 开启防火墙：

```sh
firewall-cmd --zone=public --add-port=9200/tcp --permanent
firewall-cmd --reload
```

- 访问会返回版本信息：http://192.168.3.101:9200

```json
{
  "name": "708f1d885c16",
  "cluster_name": "elasticsearch",
  "cluster_uuid": "mza51wT-QvaZ5R0NmE183g",
  "version": {
    "number": "7.17.3",
    "build_flavor": "default",
    "build_type": "docker",
    "build_hash": "5ad023604c8d7416c9eb6c0eadb62b14e766caff",
    "build_date": "2022-04-19T08:11:19.070913226Z",
    "build_snapshot": false,
    "lucene_version": "8.11.1",
    "minimum_wire_compatibility_version": "6.8.0",
    "minimum_index_compatibility_version": "6.0.0-beta1"
  },
  "tagline": "You Know, for Search"
}
```



## Logstash安装



- 下载Logstash`7.17.3`的docker镜像：

```sh
docker pull logstash:7.17.3
```

- 修改Logstash的配置文件`logstash.conf`中`output`节点下的Elasticsearch连接地址为`es:9200`，配置文件地址：https://github.com/macrozheng/mall/blob/teach/document/elk/logstash.conf

```sh
output {
  elasticsearch {
    hosts => "es:9200"
    index => "mall-%{type}-%{+YYYY.MM.dd}"
  }
}
```

- 创建`/mydata/logstash`目录，并将Logstash的配置文件`logstash.conf`拷贝到该目录；

```sh
mkdir /mydata/logstash
```

- 使用如下命令启动Logstash服务；

```sh
docker run --name logstash -p 4560:4560 -p 4561:4561 -p 4562:4562 -p 4563:4563 \
--link elasticsearch:es \
-v /mydata/logstash/logstash.conf:/usr/share/logstash/pipeline/logstash.conf \
-d logstash:7.17.3
```

- 旧版需要进入容器内部，安装`json_lines`插件，新版本已自带，无需安装。

```sh
logstash-plugin install logstash-codec-json_lines
```



## Kibana安装

- 下载Kibana`7.17.3`的docker镜像：

```sh
docker pull kibana:7.17.3
```

- 使用如下命令启动Kibana服务：

```sh
docker run --name kibana -p 5601:5601 \
--link elasticsearch:es \
-e "elasticsearch.hosts=http://es:9200" \
-d kibana:7.17.3
```

- 开启防火墙

```sh
firewall-cmd --zone=public --add-port=5601/tcp --permanent
firewall-cmd --reload
```

- 访问地址进行测试：http://192.168.3.101:5601

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/mall_linux_deploy_new_04.png)



## MongoDB安装

- 下载MongoDB`4`的docker镜像：

```bash
docker pull mongo:4
```

- 使用docker命令启动：

```bash
docker run -p 27017:27017 --name mongo \
-v /mydata/mongo/db:/data/db \
-d mongo:4
```



## MinIO安装

- 下载MinIO的Docker镜像；

```bash
docker pull minio/minio
```

- 下载完成后使用如下命令运行MinIO服务，注意使用`--console-address`指定MinIO Console的运行端口（否则会随机端口运行）：

```bash
docker run -p 9090:9000 -p 9001:9001 --name minio \
-v /mydata/minio/data:/data \
-e MINIO_ROOT_USER=minioadmin \
-e MINIO_ROOT_PASSWORD=minioadmin \
-d minio/minio server /data --console-address ":9001"
```

- 运行成功后就可访问MinIO Console的管理界面了，输入账号密码`minioadmin:minioadmin`即可登录，访问地址：http://192.168.3.101:9001

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/mall_linux_deploy_new_07.png)

