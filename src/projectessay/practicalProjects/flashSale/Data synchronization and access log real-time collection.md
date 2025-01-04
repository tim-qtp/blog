---
order: 3
author: 
title: "数据同步和访问日志实时收集"
category:
  - 秒杀系统
  - 项目
  - 数据同步
  - 日志



---

# 第2章 数据同步和访问日志实时收集

## 1 Canal增量数据同步利器

### 1.1 Canal介绍

canal主要用途是基于 MySQL 数据库增量日志解析，并能提供增量数据订阅和消费，应用场景十分丰富。

github地址：<https://github.com/alibaba/canal>

版本下载地址：<https://github.com/alibaba/canal/releases>

文档地址：<https://github.com/alibaba/canal/wiki/Docker-QuickStart>

**Canal应用场景**

1.电商场景下商品、用户实时更新同步到至Elasticsearch、solr等搜索引擎；
2.价格、库存发生变更实时同步到redis；
3.数据库异地备份、数据同步；
4.代替使用轮询数据库方式来监控数据库变更，有效改善轮询耗费数据库资源。

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1586392961813.png)

**MySQL主从复制原理**

* MySQL master 将数据变更写入二进制日志( binary log, 其中记录叫做二进制日志事件binary log events)

* MySQL slave 将 master 的 binary log events 拷贝到它的中继日志(relay log)

* MySQL slave 重放 relay log 中事件，将数据变更反映它自己的数据

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20210127104926939.png)

**Canal工作原理**

1.canal 模拟 `MySQL slave` 的交互协议，伪装自己为 `MySQL slave` ，向 `MySQL master` 发送dump 协议
2.`MySQL master` 收到 dump 请求，开始推送 `binary log` 给 slave (即 canal )
3.canal 解析 `binary log` 对象(原始为 byte 流)

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1586393225994.png)

### 1.2 Canal安装

**配置MySQL**

需要让canal伪装成salve并正确获取mysql中的binary log，首先要开启 Binlog 写入功能，配置 binlog-format 为 ROW 模式

修改MySQL配置文件，如下操作：

```bash
# 执行修改命令
vi /mydata/mysql/conf/mysql.cnf
```

```bash
# 配置文件 mysql.cnf 内容如下
[mysqld]
# 设置关闭二进制日志
#skip-log-bin

# 开启二进制日志
log-bin=mysql-bin

#开启binlog 选择ROW模式
binlog-format=ROW

#server_id不要和canal的slaveId重复
server_id=1
```

配置文件修改完成后重启MySQL

```bash
docker restart mysql
```

在MySQL中执行以下sql，查询数据库状态

```sql
show variables like 'log_bin';
show variables like 'binlog_format';
show master status;
```

![log_bin](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20250104175141393.png)

![binlog_format](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20250104175203211.png)

![status](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20250104175219728.png)

创建连接MySQL的账号`canal`并授予作为 MySQL slave 的权限，执行以下sql：

```sql
# 创建账号
CREATE USER canal IDENTIFIED BY 'canal'; 
# 授予权限
GRANT SELECT, REPLICATION SLAVE, REPLICATION CLIENT ON *.* TO 'canal'@'%';
# 修改数据库加密算法,如果数据库是5.7及以下版本，这句话不需要执行
# 如果 MySQL 是 8.0 及以上，默认加密方式是 caching_sha2_password，而 Canal 目前不支持这种加密方式，因此需要手动将加密算法改为 mysql_native_password
ALTER USER 'canal'@'%' IDENTIFIED WITH mysql_native_password BY 'canal'; 
# 刷新并应用
FLUSH PRIVILEGES;
```

**创建并配置Cancal**

创建canal-server容器

```bash
docker run -d --name canal-server \
--restart=always -p 11111:11111 \
canal/canal-server:v1.1.4
```

配置Canal

```bash
# 进入Canal容器
docker exec -it canal-server /bin/bash

# 修改配置文件
vi /home/admin/canal-server/conf/example/instance.properties

# instance.properties需要修改以下三个部分
# 修改Canal的slaveId，不能和MySQL的server_id重复
canal.instance.mysql.slaveId=101
# 修改需要进行同步操作的MySQL的连接地址
canal.instance.master.address=localhost:3306
# 修改需要进行监听的数据库表（不配置的话，就会监听数据库里的所有表）
canal.instance.filter.regex=seckill_goods.tb_sku

# 修改完成后重启Canal服务
docker restart canal-server
```

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20250104200218600.png)

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20250104184222418.png)

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20250104200556996.png)

监听数据库表的配置 `canal.instance.filter.regex` 如下：

```plaintext
mysql 数据解析关注的表，Perl正则表达式.
多个正则之间以逗号(,)分隔，转义符需要双斜杠(\\) 
常见例子：
1.  所有表：.*   or  .*\\..*
2.  canal schema下所有表： canal\\..*
3.  canal下的以canal打头的表：canal\\.canal.*
4.  canal schema下的一张表：canal.test1
5.  多个规则组合使用：canal\\..*,mysql.test1,mysql.test2 (逗号分隔)
注意：此过滤条件只针对row模式的数据有效(ps. mixed/statement因为不解析sql，所以无法准确提取tableName进行过滤)
```

### 1.3 Canal微服务

&#x20;       我们需要有一个微服务，用于读取canal监听到的变更日志，微服务名字叫`seckill-canal`。该项目我们需要引入`canal-spring-boot-autoconfigure`包，并且需要实现`EntryHandler<T>`接口，该接口中有3个方法，分别为`insert`、`update`、`delete`,这三个方法用于监听数据增删改变化。

参考地址：<https://github.com/NormanGyllenhaal/canal-client>

1\)pom.xml

在`seckill-canal`中确保有Canal依赖：

```xml
<!--canal-->
<dependency>
    <groupId>top.javatool</groupId>
    <artifactId>canal-spring-boot-autoconfigure</artifactId>
    <version>1.2.1-RELEASE</version>
</dependency>
```

在`seckill-canal`的bootstrap.yml配置文件中添加以下依赖

```yaml
#Canal配置
canal:
  server: canal-server:11111
  destination: example
```

2\)创建`com.seckill.canal.handler.SkuHandler`实现`EntryHandler`接口，代码如下：

```java
@Component
@CanalTable(value = "tb_sku")
public class SkuHandler implements EntryHandler<Sku> {

    /**
     * 增加数据
     */
    @Override
    public void insert(Sku sku) {
        System.out.println("===========insert:"+sku);
    }

    /**
     * 修改数据
     */
    @Override
    public void update(Sku before, Sku after) {
        System.out.println("===========update-before:"+before);
        System.out.println("===========update-after:"+after);
    }

    /**
     * 删除数据
     */
    @Override
    public void delete(Sku sku) {
        System.out.println("===========delete:"+sku);
    }
}
```

启动服务，会看见canal一直在刷，会找canal服务来获取有没有数据发生改变

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20250104202439452.png)

然后现在在sku表中新增一条mysql数据

```sh
获取消息 Message[id=-1,entries=[],raw=false,rawEntries=[]]
获取消息 Message[id=-1,entries=[],raw=false,rawEntries=[]]
获取消息 Message[id=4,entries=[header {
  version: 1
  logfileName: "binlog.000004"
  logfileOffset: 16939
  serverId: 1
  serverenCode: "UTF-8"
  executeTime: 1735994504000
  sourceType: MYSQL
  schemaName: ""
  tableName: ""
  eventLength: 92
}
entryType: TRANSACTIONBEGIN
storeValue: " \024"
, header {
  version: 1
  logfileName: "binlog.000004"
  logfileOffset: 17152
  serverId: 1
  serverenCode: "UTF-8"
  executeTime: 1735994504000
  sourceType: MYSQL
  schemaName: "seckill_goods"
  tableName: "tb_sku"
  eventLength: 1164
  eventType: INSERT
  props {
    key: "rowsCount"
    value: "1"
  }
}
entryType: ROWDATA
storeValue: ...
],raw=false,rawEntries=[]]
===========insert:Sku(id=S1235473563734036490, name=联想（Lenovo）小新Air. 英特尔酷睿 超轻薄笔记本电脑 i-U G TSS高效办公套装  16英寸  红色  260GSSD  I5  16G  Linux, price=2899, seckillPrice=7215, num=10000, alertNum=742, image=https://img13.360buyimg.com/n7/jfs/t1/54714/11/11130/80706/5d81fc99E3b2bd96f/869a35194c403546.jpg, images=https://img14.360buyimg.com/n7/jfs/t1/85326/22/12388/159738/5e4a5e24Eecd70b49/7407233944c72cb3.jpg,https://img14.360buyimg.com/n7/jfs/t1/104005/13/3378/167316/5ddf6696Ea8341190/b9cfcae8e0319960.jpg,https://img13.360buyimg.com/n7/jfs/t1/54714/11/11130/80706/5d81fc99E3b2bd96f/869a35194c403546.jpg,https://img14.360buyimg.com/n7/jfs/t1/85326/22/12388/159738/5e4a5e24Eecd70b49/7407233944c72cb3.jpg,https://img12.360buyimg.com/n7/jfs/t1/109848/31/7651/151970/5e5dd942Edf02511c/d75224c62e794adf.jpg,https://img12.360buyimg.com/n7/jfs/t1/79105/5/1549/275769/5cfe0819E05803cb2/d56d258b14bad253.jpg, createTime=Wed Aug 18 11:00:00 CST 2021, updateTime=Sat Sep 18 10:00:00 CST 2021, seckillBegin=Sat Sep 18 10:00:00 CST 2021, seckillEnd=Mon Feb 03 01:03:19 CST 2025, spuId=P1235473556977012736, category1Id=161, category2Id=162, category3Id=163, category1Name=电脑、办公, category2Name=电脑整机, category3Name=笔记本, brandId=11516, brandName=联想, spec={"显示器":"16英寸","颜色":"红色","硬盘类型":"260GSSD","CPU":"I5","内存大小":"16G","系统":"Linux"}, saleNum=10000, commentNum=68, status=1, islock=1, startDate=null, startTimestr=null, len=null, seckillNum=1000, audit=1, count=1, isdel=1, points=80, bgtime=2021091810)
获取消息 Message[id=5,entries=[header {
  version: 1
  logfileName: "binlog.000004"
  logfileOffset: 18316
  serverId: 1
  serverenCode: "UTF-8"
  executeTime: 1735994504000
  sourceType: MYSQL
  schemaName: ""
  tableName: ""
  eventLength: 31
}
entryType: TRANSACTIONEND
storeValue: "\022\003104"
],raw=false,rawEntries=[]]
获取消息 Message[id=-1,entries=[],raw=false,rawEntries=[]]
获取消息 Message[id=-1,entries=[],raw=false,rawEntries=[]]
```

然后再修改一条mysql数据

```sh
获取消息 Message[id=-1,entries=[],raw=false,rawEntries=[]]
获取消息 Message[id=-1,entries=[],raw=false,rawEntries=[]]
获取消息 Message[id=6,entries=[header {
  version: 1
  logfileName: "binlog.000004"
  logfileOffset: 18426
  serverId: 1
  serverenCode: "UTF-8"
  executeTime: 1735994802000
  sourceType: MYSQL
  schemaName: ""
  tableName: ""
  eventLength: 93
}
entryType: TRANSACTIONBEGIN
storeValue: " \024"
, header {
  version: 1
  logfileName: "binlog.000004"
  logfileOffset: 18640
  serverId: 1
  serverenCode: "UTF-8"
  executeTime: 1735994802000
  sourceType: MYSQL
  schemaName: "seckill_goods"
  tableName: "tb_sku"
  eventLength: 1488
  eventType: UPDATE
  props {
    key: "rowsCount"
    value: "1"
  }
}
entryType: ROWDATA
storeValue: ...
],raw=false,rawEntries=[]]
===========update-before:Sku(id=null, name=null, price=7, seckillPrice=null, num=null, alertNum=null, image=null, images=null, createTime=null, updateTime=null, seckillBegin=null, seckillEnd=null, spuId=null, category1Id=null, category2Id=null, category3Id=null, category1Name=null, category2Name=null, category3Name=null, brandId=null, brandName=null, spec=null, saleNum=null, commentNum=null, status=null, islock=null, startDate=null, startTimestr=null, len=null, seckillNum=null, audit=null, count=null, isdel=null, points=80, bgtime=null)
===========update-after:Sku(id=S1235464737957928960, name=新诗“精魂”的追寻：穆旦研究新探  诗歌  西班牙语  老年, price=8, seckillPrice=8551, num=10000, alertNum=696, image=https://img10.360buyimg.com/n7/jfs/t1/26726/33/15408/237421/5cb081f4E1da4979a/8583ee357ff986d1.jpg, images=,https://img10.360buyimg.com/n7/jfs/t1/26726/33/15408/237421/5cb081f4E1da4979a/8583ee357ff986d1.jpg,https://img10.360buyimg.com/n7/10834/e478cacc-aaa5-405d-816c-77842ba74002.jpg,https://img13.360buyimg.com/n7/jfs/t1/22631/4/13382/142479/5c9dfa40E5849b686/3b72b4fd427638a5.jpg,, createTime=Wed Aug 18 11:00:00 CST 2021, updateTime=Sat Sep 18 10:00:00 CST 2021, seckillBegin=Sat Sep 18 10:00:00 CST 2021, seckillEnd=Mon Feb 03 01:03:19 CST 2025, spuId=P1235464735172911104, category1Id=1, category2Id=2, category3Id=3, category1Name=图书、音像、电子书刊, category2Name=电子书刊, category3Name=电子书, brandId=17424, brandName=威图, spec={"书籍类型":"诗歌","语言":"西班牙语","适合人群":"老年"}, saleNum=10000, commentNum=476, status=1, islock=1, startDate=null, startTimestr=null, len=null, seckillNum=1000, audit=1, count=1, isdel=1, points=80, bgtime=2021091810)
获取消息 Message[id=7,entries=[header {
  version: 1
  logfileName: "binlog.000004"
  logfileOffset: 20128
  serverId: 1
  serverenCode: "UTF-8"
  executeTime: 1735994802000
  sourceType: MYSQL
  schemaName: ""
  tableName: ""
  eventLength: 31
}
entryType: TRANSACTIONEND
storeValue: "\022\003106"
],raw=false,rawEntries=[]]
获取消息 Message[id=-1,entries=[],raw=false,rawEntries=[]]
获取消息 Message[id=-1,entries=[],raw=false,rawEntries=[]]
```

程序启动后，修改`tb_sku`数据，可以看到控制会打印修改前后的数据：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20250104204915048.png)

## 2 同步数据

### 2.1 索引库同步

&#x20;       当`tb_sku`秒杀商品发生变化时，我们应该==同时变更索引库中的索引数据==，比如秒杀商品增加，则需要同步==增加==秒杀商品的索引，如果有秒杀商品删除，则需要同步==移除==秒杀==商品==。

```plaintext
需求：当MySQL中的商品数据发生变化时，同步到ES索引库中

分析：使用Canal监听MySQL数据库，对增、删、改增量消息进行处理
     新增：调用索引库新增接口
     修改：判断秒杀商品status：修改后为2，修改索引库；修改后为1，则删除索引库
     删除：删除索引库数据

步骤：
    1：在seckill-canal中添加SkuHandler方法
    2：实现增、删、改方法，使用Fegin调用seckill-search服务进行ES索引库同步
```

修改`seckill-canal`中的`com.seckill.handler.SkuHandler`的增删改方法，代码如下：

```java
@Component
@CanalTable(value = "tb_sku")
public class SkuHandler implements EntryHandler<Sku> {

    @Autowired
    private SkuInfoFeign skuInfoFeign;

    /**
     * 增加数据监听
     */
    @SneakyThrows
    @Override
    public void insert(Sku sku) {
        // status=2 表示为秒杀商品，进行相关新增操作
        if (sku.getStatus().equals("2")) {
            //同步索引
            skuInfoFeign.modifySku(1, sku);
        }
    }

    /**
     * 修改数据监听
     */
    @SneakyThrows
    @Override
    public void update(Sku before, Sku after) {
        if (after.getStatus().equals("2")) {
            //同步索引库
            skuInfoFeign.modifySku(2, after);
        } else if (before.getStatus().equals("2") && after.getStatus().equals("1")) {
            //删除索引库
            skuInfoFeign.modifySku(3, after);
        }

        //逻辑删除，判断状态isdel
        if (after.getIsdel() == 2) {
            //删除索引库
            skuInfoFeign.modifySku(3, after);
        }
    }

    /**
     * 删除数据监听 商品只做逻辑删除，没有物理删除，所以不用处理删除监听
     */
    @Override
    public void delete(Sku sku) {
    }
}
```

开启Feign功能：`@EnableFeignClients(basePackages = {"com.seckill.search.feign"})`

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1586481189056.png)

此时对数据库中`tb_sku`表进行增删改的时候，会同步到索引库中。

**新增：**

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20250104231224333.png)

之前索引库中没有，

![image-20250105001936039](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20250105001936039.png)

现在可以查到了，

![image-20250105002017383](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20250105002017383.png)

**修改：**

上面是`1207`，改完是`1277`

![image-20250105002111746](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20250105002111746.png)

**删除：**

删除是逻辑删除，所以isDel改为2，

![image-20250105002524811](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20250105002524811.png)

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20250105002721059.png)

可以看到，索引库中没有了！

### 2.2 静态页同步

&#x20;       只需要添加Feign包，注入SkuPageFeign，根据增删改不同的需求实现生成静态页或删除静态页。

```plaintext
需求：当MySQL中的商品数据发生变化时，同步操作商品静态页

分析：使用Canal监听MySQL数据库，对增、删、改增量消息进行处理
     新增：调用索引库新增接口
     修改：判断秒杀商品status：修改后为2，修改静态页；修改后为1，则删除静态页
     删除：删除html静态页

步骤：
     1：新增Feign接口
     2：在seckill-canal中修改SkuHandler方法
     3：实现方法的增、删、改方法，使用Fegin调用seckill-page服务进行商品静态页数据同步
```

新增Feign接口：

```java
package com.seckill.search.feign;

import com.seckill.goods.pojo.Sku;
import com.seckill.search.pojo.SkuInfo;
import com.seckill.util.Result;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(value = "seckill-search")
public interface SkuInfoFeign {

    /**
     * 将一条记录导入到搜索引擎中
     */
    @PostMapping(value = "/search/modify/{type}")
    Result modify(@PathVariable(value = "type") Integer type, @RequestBody SkuInfo skuInfo);

    /**
     * 修改Sku
     */
    @PostMapping(value = "/search/modify/sku/{type}")
    Result modifySku(@PathVariable(value = "type") Integer type, @RequestBody Sku sku);
}
```

修改`SkuHandler`，代码如下：

```java
@Component
@CanalTable(value = "tb_sku")
public class SkuHandler implements EntryHandler<Sku> {

    @Autowired
    private SkuInfoFeign skuInfoFeign;

    @Autowired
    private SkuPageFeign skuPageFeign;

    /**
     * 增加数据监听
     */
    @SneakyThrows
    @Override
    public void insert(Sku sku) {
        // status=2 表示为秒杀商品，进行相关新增操作
        if (sku.getStatus().equals("2")) {
            //同步索引
            skuInfoFeign.modifySku(1, sku);
            //同步静态页
            skuPageFeign.html(sku.getId());
        }
    }

    /**
     * 修改数据监听
     */
    @SneakyThrows
    @Override
    public void update(Sku before, Sku after) {
        if (after.getStatus().equals("2")) {
            //同步索引库
            skuInfoFeign.modifySku(2, after);
            //同步静态页
            skuPageFeign.html(after.getId());
        } else if (before.getStatus().equals("2") && after.getStatus().equals("1")) {
            //删除索引库
            skuInfoFeign.modifySku(3, after);
            //删除静态页
            skuPageFeign.delHtml(after.getId());
        }

        //逻辑删除，判断状态isdel
        if (after.getIsdel() == 2) {
            //删除索引库
            skuInfoFeign.modifySku(3, after);
            //删除静态页
            skuPageFeign.delHtml(after.getId());
        }
    }

    /**
     * 删除数据监听 商品只做逻辑删除，没有物理删除，所以不用处理删除监听
     */
    @Override
    public void delete(Sku sku) {
    }
}
```

同时不要忘了添加feign包：`@EnableFeignClients(basePackages = {"com.seckill.search.feign","com.seckill.page.feign"})`

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1586482448734.png)

测试的时候，在数据对数据进行增删改，静态页也会同步操作。

### 2.3 配置404页面

为了提供更好的用户体验，我们可以在Nginx中统一配置404页面。

在这里提供**两种404的配置方式，任选其一**即可

首先需要准备一个404提示页面：

```bash
# 创建并编辑404页面
vim /usr/local/openresty/nginx/html/404.html

# 内容就是一个普通的html页面，例如以下内容：

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>商品下架</title>
</head>
<body>
<h3>该商品已下架</h3>
</body>
</html>
```

#### 2.3.1 通用404页面配置

在nginx的 http->server 部分都生效

```bash
# 修改配置文件nginx.conf
vim /usr/local/openresty/nginx/conf/nginx.conf

# 在http配置中添加以下配置：
fastcgi_intercept_errors on;

# 在对应的server中添加以下配置
error_page  404              /404.html;

# 保存并退出nginx.conf的修改，nginx重载
nginx -s reload
```

配置文件效果如下：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20210826111011492.png)

#### 2.3.2 指定路径404页面配置

如果希望404提示页面只对某一个请求路径生效，可以进行如下配置

```bash
# 修改配置文件nginx.conf
vim /usr/local/openresty/nginx/conf/nginx.conf

# 在server中添加404页面的请求信息
        location @np {
            rewrite ^/(.*)$     /404.html;
        }


# 在server的Location中添加 try_files属性
        location /items/ {
            root   /usr/local/server/web/;
            try_files $uri @np;
        }
        
# 保存并退出nginx.conf的修改，并执行nginx重载
nginx -s reload
```

配置文件效果如下：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20210826110738218.png)

## 3 分布式任务调度

### 3.1 分布式任务调度介绍

&#x20;       很多时候，我们需要定时执行一些程序完成一些预定要完成的操作，如果手动处理，一旦任务量过大，就非常麻烦，所以用定时任务去操作是个非常不错的选项。

&#x20;       现在的应用多数是分布式或者微服务，所以我们需要的是分布式任务调度，那么现在分布式任务调度流行的主要有elastic-job、xxl-job、quartz等，我们这里做一个对比：

| feature  | quartz                                                 | elastic-job                                                  | xxl-job                                                      | antares                          | opencron                                                     |
| -------- | ------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | -------------------------------- | ------------------------------------------------------------ |
| 依赖     | mysql                                                  | jdk1.7+, zookeeper 3.4.6+ ,maven3.0.4+                       | mysql ,jdk1.7+ , maven3.0+                                   | jdk 1.7+ , redis , zookeeper     | jdk1.7+ , Tomcat8.0+                                         |
| HA       | 多节点部署，通过竞争数据库锁来保证只有一个节点执行任务 | 通过zookeeper的注册与发现，可以动态的添加服务器。 支持水平扩容 | 集群部署                                                     | 集群部署                         | —                                                            |
| 任务分片 | —                                                      | 支持                                                         | 支持                                                         | 支持                             | —                                                            |
| 文档完善 | 完善                                                   | 完善                                                         | 完善                                                         | 文档略少                         | 文档略少                                                     |
| 管理界面 | 无                                                     | 支持                                                         | 支持                                                         | 支持                             | 支持                                                         |
| 难易程度 | 简单                                                   | 简单                                                         | 简单                                                         | 一般                             | 一般                                                         |
| 公司     | OpenSymphony                                           | 当当网                                                       | 个人                                                         | 个人                             | 个人                                                         |
| 高级功能 | —                                                      | 弹性扩容，多种作业模式，失效转移，运行状态收集，多线程处理数据，幂等性，容错处理，spring命名空间支持 | 弹性扩容，分片广播，故障转移，Rolling实时日志，GLUE（支持在线编辑代码，免发布）,任务进度监控，任务依赖，数据加密，邮件报警，运行报表，国际化 | 任务分片， 失效转移，弹性扩容 ， | 时间规则支持quartz和crontab ，kill任务， 现场执行，查询任务运行状态 |
| 使用企业 | 大众化产品，对分布式调度要求不高的公司大面积使用       | 36氪，当当网，国美，金柚网，联想，唯品会，亚信，平安，猪八戒 | 大众点评，运满满，优信二手车，拍拍贷                         | —                                | —                                                            |

### 3.2 elastic-job讲解

官网：https://shardingsphere.apache.org/elasticjob/index\_zh.html

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1586487263884.png)

#### 3.2.1 静态任务案例

使用elastic-job很容易，我们接下来学习下elastic-job的使用，这里的案例我们先实现静态任务案例，静态任务案例也就是执行时间事先写好。

创建Zookeeper：

```bash
docker run -d --name zk \
--net seckill_network --ip 172.36.0.16 \
--restart=always \
-v /etc/localtime:/etc/localtime \
-p 3181:2181 zookeeper:3.4.14
```

案例实现步骤：

```plaintext
1.引入依赖包
2.配置zookeeper节点以及任务名称命名空间
3.实现自定义任务，需要实现SimpleJob接口
```

1\)在`seckill-goods`中引入依赖

```xml
<!-- ElasticJobAutoConfiguration自动配置类作用-->
<dependency>
    <groupId>com.github.kuhn-he</groupId>
    <artifactId>elastic-job-lite-spring-boot-starter</artifactId>
    <version>2.1.5</version>
</dependency>
```

2\)配置elastic-job

在`bootstrap.yml`中配置`elastic-job`，如下：

```yaml
elaticjob:
  zookeeper:
    server-lists: zk-server:3181 #zookeeper的地址
    namespace: updatetask #定时任务命名空间
```

这里我们只展示了部分常用的参数，还有很多参数，但不一定常用，大家可以参考下面地址学习：

https://shardingsphere.apache.org/elasticjob/legacy/lite-2.x/02-guide/config-manual/

3\)任务创建

创建`com.seckill.goods.task.statictask.StaticJob`，代码如下：

```java
@Component
@ElasticSimpleJob(
        cron = "1/5 * * * * ?",   //任务执行周期
        jobName = "updatetask",   //和定时任务命名空间保持一致
        shardingTotalCount = 1    //分片
)
public class StaticJob implements SimpleJob {

    /**
     * 业务处理方法
     */
    @Override
    public void execute(ShardingContext shardingContext) {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("HH:mm:ss");
        System.out.println("时间：" + simpleDateFormat.format(new Date()));
    }
}
```

讲解：

```plaintext
cron:定时表达式
jobName：这里和bootstrap.yml中的namespace保持一致
shardingTotalCount：分片数量
```

#### 3.2.2 动态任务案例

&#x20;       参考地址：<https://github.com/LuoLiangDSGA/spring-learning/tree/master/boot-elasticjob>

&#x20;       动态任务案例主要是讲解程序在运行时，动态添加定时任务，这种场景应用非常广泛。使用elastic-job实现动态添加定时任务的实现有点复杂，我们接下来实际操作一次。

步骤：

```plaintext
1.配置初始化的zookeeper地址
2.自定义任务处理过程-实现SimpleJob
3.配置的定时任务命名空间(不一定会使用)
4.注册初始化数据
5.监听器->任务执行前后监听（可有可无）
6.动态添加定时任务实现
```

##### 3.2.2.1 入门案例

**1. 注册中心配置**

`bootstrap.yml` 添加配置

```yaml
# 动态定时任务
zkserver: zk-server:3181
zknamespace: zknamesp
```

**2. 创建任务**

创建任务类： `com.seckill.goods.task.dynamic.DynamicJob`

```java
public class DynamicJob implements SimpleJob {

    /**
     * 实现对应的任务
     */
    @Override
    public void execute(ShardingContext shardingContext) {
        //获取请求的参数
        String id = shardingContext.getJobParameter();
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("HH:mm:ss");
        String jobName = shardingContext.getJobName();
        System.out.println(jobName + "时间：" + simpleDateFormat.format(new Date()) + ":::" + id);
    }
}
```

创建配置类配置注册中心信息，`com.seckill.goods.task.dynamic.ElasticjobDynamicConfig`:

```java
@Configuration
public class ElasticjobDynamicConfig {

    @Value("${zkserver}")
    private String zkserver;
    @Value("${zknamespace}")
    private String zknamespace;

    @Autowired
    private ZookeeperRegistryCenter zookeeperRegistryCenter;

    /**
     * 1.配置初始化数据
     */
    @Bean
    public ZookeeperConfiguration zkConfig() {
        //1.Zookeeper地址
        //2.定时任务命名空间
        return new ZookeeperConfiguration(zkserver, zknamespace);
    }

    /**
     * 2.注册初始化数据
     */
    @Bean(initMethod = "init")
    public ZookeeperRegistryCenter registryCenter(ZookeeperConfiguration zkConfig) {
        return new ZookeeperRegistryCenter(zkConfig);
    }


    /**
     * 3.动态添加定时任务案例
     */
    public void addDynamicTask(String jobName, String cron, int shardingTotalCount, 
                               SimpleJob instance, String id) {
        //1.添加Elastjob-lite的任务作业器
        LiteJobConfiguration liteJobConfiguration = LiteJobConfiguration.newBuilder(
                new SimpleJobConfiguration(
                        JobCoreConfiguration.newBuilder(jobName, cron, shardingTotalCount)
                                .jobParameter(id)  //额外的参数
                                .build(),
                        instance.getClass().getName())
        ).overwrite(true).build();//overwrite(true)覆盖原来同名的任务

        //2.将Lite的任务作业器添加到Spring的任务启动器中，并初始化
        new SpringJobScheduler(instance, zookeeperRegistryCenter, liteJobConfiguration).init();
    }

}
```

**3. 编写测试Controller**

创建Controller用于测试，`com.seckill.goods.controller.TaskController`：

```java
@RestController
@RequestMapping(value = "/task")
public class TaskController {

    @Autowired
    private ElasticjobDynamicConfig elasticjobDynamicConfig;

    /**
     * 动态定时任务案例测试
     */
    @GetMapping
    public Result task(String jobName, Long time, String id) {
        String cron = "0/" + time + " * * * * ?";

        elasticjobDynamicConfig.addDynamicTask(jobName, cron, 1, new DynamicJob(), id);
        return new Result(true, StatusCode.OK, "执行成功！");
    }
}
```

##### 3.2.2.1 Date转Cron

在ElasticjobDynamicConfig中添加代码：

```java
//cron表达式格式
private static final String cron = "ss mm HH dd MM ? yyyy";

/**
 * 时间转换成Cron表达式
 * "1/5 * * * * ?";
 */
public static String date2cron(Date date) {
    SimpleDateFormat simpleDateFormat = new SimpleDateFormat(cron);
    return simpleDateFormat.format(date);
}
```

修改TaskController为以下内容：

```java
/**
 * 动态定时任务案例测试
 */
@GetMapping
public Result task(String jobName, Long time, String id) {
    // String cron = "1/" + time + " * * * * ?";

    //在当前时间往后延迟time毫秒执行
    String cron = ElasticjobDynamicConfig.date2cron(new Date(System.currentTimeMillis() + time));

    elasticjobDynamicConfig.addDynamicTask(jobName, cron, 1, new DynamicJob(), id);
    return new Result(true, StatusCode.OK, "执行成功！");
}
```

##### 3.2.2.3 监听器使用

编写监听器：`com.seckill.goods.task.dynamic.DynamicListener`

```java
public class DynamicListener extends AbstractDistributeOnceElasticJobListener {

    /**
     * 构造函数
     */
    public DynamicListener(long startedTimeoutMilliseconds, long completedTimeoutMilliseconds) {
        super(startedTimeoutMilliseconds, completedTimeoutMilliseconds);
    }

    /**
     * 执行前通知
     */
    @Override
    public void doBeforeJobExecutedAtLastStarted(ShardingContexts shardingContexts) {
        System.out.println("=======doBeforeJobExecutedAtLastStarted=======");
    }

    /**
     * 执行后通知
     */
    @Override
    public void doAfterJobExecutedAtLastCompleted(ShardingContexts shardingContexts) {
        System.out.println("=======doAfterJobExecutedAtLastCompleted=======");
    }
}
```

添加 `com.seckill.goods.task.dynamic.ElasticjobDynamicConfig` 的逻辑：

```java
@Autowired
private DynamicListener dynamicListener;

/**
 * 监听器
 */
@Bean
public DynamicListener dynamicListener() {
    return new DynamicListener(10000L, 100000L);
}

/**
 * 3.动态添加定时任务案例
 */
public void addDynamicTask(String jobName, String cron, int shardingTotalCount,
                           SimpleJob instance, String id) {
    //1.添加Elastjob-lite的任务作业器
    LiteJobConfiguration liteJobConfiguration = LiteJobConfiguration.newBuilder(
            new SimpleJobConfiguration(
                    JobCoreConfiguration.newBuilder(jobName, cron, shardingTotalCount)
                            .jobParameter(id)  //额外的参数
                            .build(),
                    instance.getClass().getName())
    ).overwrite(true).build();//overwrite(true)覆盖原来同名的任务

    //2.将Lite的任务作业器添加到Spring的任务启动器中，并初始化
    new SpringJobScheduler(instance, zookeeperRegistryCenter, liteJobConfiguration, dynamicListener).init();
}
```

## 4 索引+静态页动态更新

### 4.1 分析

&#x20;       索引和静态资源的更新功能已经完成，所有秒杀商品都只是参与一段时间活动，活动时间过了需要将秒杀商品从索引中移除，同时删除静态页。我们需要有这么一个功能，在秒杀商品活动结束的时候，将静态页删除、索引库数据删除。

&#x20;       此时我们可以使用elastic-job定时执行该操作,我们看如下活动表，活动表中有一个活动开始时间和活动结束时间，我们可以在每次增加、修改的时候，动态创建一个定时任务，把活动结束时间作为任务执行时间。

```sql
CREATE TABLE `tb_activity` (
  `id` varchar(60) NOT NULL,
  `name` varchar(100) NOT NULL,
  `status` int(2) NOT NULL DEFAULT '1' COMMENT '状态：1开启，2未开启',
  `startdate` date DEFAULT NULL,
  `begintime` datetime DEFAULT NULL COMMENT '开始时间',
  `endtime` datetime DEFAULT NULL COMMENT '结束时间',
  `total_time` float DEFAULT NULL,
  `is_del` int(1) DEFAULT '1' COMMENT '删除：1未删除，2已删除',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

实现步骤：

```plaintext
1.编写动态定时任务
2.修改/增加秒杀活动，添加动态定时任务，执行时间为秒杀活动结束时间
```

### 4.2 实现动态更新

&#x20;       我们在上面动态案例上进行修改，当添加和修改活动时，执行一个定时任务，定时任务以活动结束的时间为任务执行时间，将活动ID作为任务名字。

在`seckill-goods`的`com.seckill.goods.task.dynamic`中创建使用静态方法获取Spring容器中Bean：

```java
@Component
public class GetSpringBean implements ApplicationContextAware {

    // 声明一个静态变量用于保存spring容器上下文
    @Autowired
    private static ApplicationContext context;

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        this.context = applicationContext;
    }

    public static <T> T get(Class<T> clazz) {
        return context.getBean(clazz);
    }
}
```

创建定时任务对象

在`seckill-goods`的`com.seckill.goods.task.dynamic.DynamicTask`代码如下：

```java
public class DynamicTask implements SimpleJob {

    private SkuActMapper skuActMapper = GetSpringBean.get(SkuActMapper.class);

    private SkuMapper skuMapper = GetSpringBean.get(SkuMapper.class);
    ;

    /**
     * 实现对应的业务
     */
    @Override
    public void execute(ShardingContext shardingContext) {
        // String id = shardingContext.getJobParameter();
        // SimpleDateFormat simpleDateFormat = new SimpleDateFormat("HH:mm:ss");
        // System.out.println(id + ":::时间：" + simpleDateFormat.format(new Date()));

        //活动ID
        String id = shardingContext.getJobParameter();
        System.out.println("动态添加定时任务:" + id);

        try {
            modify(id);
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    /**
     * 1.根据活动ID查询活动ID下拥有的秒杀商品集合
     * 2.修改参与活动的秒杀商品状态，将状态改成非秒杀商品->
     * MySQL->binlog->Canal->获取增量数据->Canal微服务订阅增量数据->调用【静态页微服务、搜索微服务】
     */
    public void modify(String id) {
        //1.根据活动ID查询活动ID下拥有的秒杀商品集合
        SkuAct skuAct = new SkuAct();
        skuAct.setActivityId(id);
        List<SkuAct> skuActs = skuActMapper.select(skuAct);
        List<String> ids = new ArrayList<>();
        for (SkuAct act : skuActs) {
            ids.add(act.getSkuId());
        }

        //2.修改参与活动的秒杀商品状态
        Sku sku = new Sku();
        sku.setStatus("1");

        Example example = new Example(Sku.class);
        Example.Criteria criteria = example.createCriteria();
        criteria.andEqualTo("status", "2");
        criteria.andIn("id", ids);

        skuMapper.updateByExampleSelective(sku, example);
    }
}
```

2\)调用操作

在活动修改和增加的时候，添加定时任务，修改`com.seckill.goods.service.impl.ActivityServiceImpl`的相关方法。

更新活动代码如下：

```java
@Autowired
private ElasticjobDynamicConfig elasticjobDynamicConfig;

    /**
     * 修改Activity
     */
    @Override
    public void update(Activity activity) {

                // 业务代码
        ......

        //定时任务调度，将活动结束时间作为任务开始执行时间
        String cron = ElasticjobDynamicConfig.date2cron(activity.getEndtime());
        elasticjobDynamicConfig.addDynamicTask(activity.getId(), cron, 1, new DynamicJob(), activity.getId());
    }
```

### 4.3 测试

先确认数据库中的秒杀活动所对应的秒杀商品状态status是否为2(为2表示该商品为秒杀商品)

在Postman中，调用接口进行测试：

PUT /activity/No1269829400967376896

&#x20;接口请求body为json数据，内容为: {"endtime": "2021-05-28 17:42:24"}

## 5 访问日志收集

&#x20;       日志在我们项目中是非常重要的，日志的作用也有差异，例如根据日志查找问题、根据日志做数据分析。在我们秒杀系统中，活跃的热点商品其实并不多，我们往往需要对热点商品进行额外处理。用户每次抢购商品的时候，都是从详情页发起的，因此统计热度商品，详情页的访问频次可以算一个方向，详情页访问的频次我们可以记录访问日志，然后统计某一段时间的访问量，根据访问量评判商品是否是热点商品。

### 5.1 业务分析

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1586685996087.png)

&#x20;       日志收集流程如上图，用户请求经过nginx，此时已经留下了用户对某个商品访问的足迹，我们可以在这里将用户访问的商品信息发送给我们kafka，采用大数据实时分析工具`Apache Druid`实时存储访问信息，再通过程序分析计算访问情况。

### 5.2 Kafka介绍

&#x20;       从上面流程图中，可以看到实现日志收集中间件是MQ，我们秒杀系统中会搭建MQ服务。

&#x20;       目前市面上成熟主流的MQ有Kafka 、RocketMQ、RabbitMQ、ActiveMQ，我们这里对每款MQ做一个简单介绍。

**Kafka**

```plaintext
Kafka是最初由Linkedin公司开发，是一个分布式、支持分区的（partition）、多副本的（replica），基于zookeeper协调的分布式消息系统，它的最大的特性就是可以实时的处理大量数据以满足各种需求场景：比如基于hadoop的批处理系统、低延迟的实时系统、storm/Spark流式处理引擎，web/nginx日志、访问日志，消息服务等等，用scala语言编写，Linkedin于2010年贡献给了Apache基金会并成为顶级开源 项目。
        1.快速持久化：通过磁盘顺序读写与零拷贝机制，可以在O(1)的系统开销下进行消息持久化；
        2.高吞吐：在一台普通的服务器上既可以达到10W/s的吞吐速率；
        3.高堆积：支持topic下消费者较长时间离线，消息堆积量大；
        4.完全的分布式系统：Broker、Producer、Consumer都原生自动支持分布式，依赖zookeeper自动实现复杂均衡；
        5.支持Hadoop数据并行加载：对于像Hadoop的一样的日志数据和离线分析系统，但又要求实时处理的限制，这是一个可行的解决方案。
        6.高并发：支持数千个客户端同时读写
```

**RocketMQ**

```plaintext
RocketMQ的前身是Metaq，当Metaq3.0发布时，产品名称改为RocketMQ。RocketMQ是一款分布式、队列模型的消息中间件，具有以下特点 ：
        1.能够保证严格的消息顺序
         2.提供丰富的消息拉取模式
         3.高效的订阅者水平扩展能力
         4.实时的消息订阅机制
         5.支持事务消息
         6.亿级消息堆积能力
```

**RabbitMQ**

```plaintext
使用Erlang编写的一个开源的消息队列，本身支持很多的协议：AMQP，XMPP, SMTP,STOMP，也正是如此，使的它变的非常重量级，更适合于企业级的开发。同时实现了Broker架构，核心思想是生产者不会将消息直接发送给队列，消息在发送给客户端时先在中心队列排队。对路由(Routing)，负载均衡(Load balance)、数据持久化都有很好的支持。多用于进行企业级的ESB整合。
```

kafka官网：<http://kafka.apache.org/>

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1586742014619.png)

### 5.3 Kafka搭建

创建Kafka之前，必须先确保Zookeeper已经存在，请先确认 Zookeeper 是否创建完成。

使用Docker启动Kafka：

```bash
docker run -d --name kafka --net=host \
--restart=always -p 9092:9092 \
-e KAFKA_BROKER_ID=0 \
-e KAFKA_ZOOKEEPER_CONNECT=192.168.200.188:3181/kafka \
-e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://192.168.200.188:9092 \
-e KAFKA_LISTENERS=PLAINTEXT://0.0.0.0:9092 \
-v /etc/localtime:/etc/localtime \
wurstmeister/kafka:2.12-2.4.1
```

> 注意：需要修改192.168.200.188为宿主机的实际ip地址(如果有公网IP，填写公网IP地址)

**测试Kafka**

创建队列：

```bash
# 进入容器
docker exec -it kafka /bin/bash

# 进入目录
cd /opt/kafka_2.12-2.4.1/bin

# 创建队列
./kafka-topics.sh --create --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1 --topic itemaccess
```

使用kafka-topics.sh创建队列:
\--create:执行创建一个新的队列操作

&#x20;\--bootstrap-server：需要链接的kafka配置，必填

&#x20;\--partitions 1：设置一个topic设置几个分区(就是把数据切割成几块，分别存储)

&#x20;\--replication-factor 1:设置分区的副本数量（就是设置多少个备份，有了备份，一个挂了没事，可以使用备份）

&#x20;\--topic itemaccess：队列的名字叫itemaccess

消息发布

在kafka容器中执行消息发送（接着上面的步骤执行）：

```bash
# 发送消息
./kafka-console-producer.sh --broker-list localhost:9092 --topic itemaccess

# 发送内容为
{"actime":"2021-4-10 9:50:10","uri":"http://www-seckill.itheima.net/items/333.html","IP":"119.123.33.231","Token":"Bearer itcast"}
```

消息订阅

```bash
# 进入容器
docker exec -it kafka /bin/bash

# 进入目录
cd /opt/kafka_2.12-2.4.1/bin

# 订阅消息
./kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic itemaccess --from-beginning
```

其他命令

```bash
# 进入容器
docker exec -it kafka /bin/bash

# 进入目录
cd /opt/kafka_2.12-2.4.1/bin

# 查看topic列表
./kafka-topics.sh --bootstrap-server localhost:9092 --list

# 删除topics
./kafka-topics.sh --bootstrap-server localhost:9092 --delete --topic itemaccess2
```

### 5.3 收集日志-Lua

&#x20;       Lua 是一种轻量小巧的脚本语言，用标准C语言编写并以源代码形式开放， 其设计目的是为了嵌入应用程序中，从而为应用程序提供灵活的扩展和定制功能。

&#x20;       OpenResty® 是一个基于 Nginx 与 Lua 的高性能 Web 平台，其内部集成了大量精良的 Lua 库、第三方模块以及大多数的依赖项。用于方便地搭建能够处理超高并发、扩展性极高的动态 Web 应用、Web 服务和动态网关。OpenResty 通过lua脚本扩展nginx功能，可提供负载均衡、请求路由、安全认证、服务鉴权、流量控制与日志监控等服务。

&#x20;       OpenResty® 通过汇聚各种设计精良的 Nginx 模块（主要由 OpenResty 团队自主开发），从而将 Nginx 有效地变成一个强大的通用 Web 应用平台。这样，Web 开发人员和系统工程师可以使用 Lua 脚本语言调动 Nginx 支持的各种 C 以及 Lua 模块，快速构造出足以胜任 10K 乃至 1000K 以上单机并发连接的高性能 Web 应用系统。

&#x20;       关于Lua的基本知识，我们这里就不学习了，直接进入日志收集的使用操作。

&#x20;       使用Lua实现日志收集，并向Kafka发送访问的详情页信息，此时我们需要安装一个依赖组件`lua-restry-kafka`。关于`lua-restry-kafka`的下载和使用，可以参考`https://github.com/doujiang24/lua-resty-kafka`

**1）收集流程**

&#x20;       日志收集流程如下：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20210901152615431-1.png)

&#x20;       用户请求/web/items/1.html，进入到nginx第1个location中，在该location中向Kafka发送请求日志信息，并将请求中的/web去掉，跳转到另一个location中，并查找本地文件，这样既可以完成日志收集，也能完成文件的访问。

**2)插件配置**

`lua-restry-kafka`：https://github.com/doujiang24/lua-resty-kafka

```bash
# 上传lua-resty-kafka-master.zip

# 解压
unzip lua-resty-kafka-master.zip

# 移动到指定目录
mv lua-resty-kafka-master /usr/local/openresty/

# 修改nginx.conf
vi /usr/local/openresty/nginx/conf/nginx.conf

# 添加内容  在配置文件中指定lua-resty-kafka的库文件位置
# 配置到http里面，和server平级
lua_package_path "/usr/local/openresty/lua-resty-kafka-master/lib/?.lua;;";
```

配置效果如下：

```shell
http {
    ......
    
    #gzip  on;

    #添加内容  在配置文件中指定lua-resty-kafka的库文件位置
    lua_package_path "/usr/local/openresty/lua-resty-kafka-master/lib/?.lua;;";

    server {
        listen       80;
        server_name  localhost;   
        
    ......
}
```

**3)配置请求 指向lua脚本**

创建一个lua脚本,`items-access.lua`

编写测试内容：

```lua
ngx.say("test")
ngx.exit(200)
```

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20210901152615431.png)

&#x20;       按照上面的流程图，我们需要配置nginx的2个location，修改nginx.conf,代码如下：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1586766318976.png)

上图代码如下：

```lua
# lua插件位置
lua_package_path "/usr/local/openresty/lua-resty-kafka-master/lib/?.lua;;";

server {
    listen       8880;
    server_name  localhost;

    location /web/items/ {
        #向kafka发送日志记录，处理请求路径，把/web去掉
        content_by_lua_file /usr/local/openresty/nginx/lua/items-access.lua;
    }

    location /items/ {
        root   /usr/local/server/web;
    }

    location / {
        root   html;
        index  index.html index.htm;
    }

}
```

**4)日志收集**

&#x20;       用户访问详情页的时候，需要实现日志收集，日志收集采用Lua将当前访问信息发布到Kafka中，因此这里要实现Kafka消息生产者。

我们定义一个消息格式：

```json
{
  "actime": "2020-4-10 9:50:30",
  "uri": "/web/items/S1235433012716498944.html",
  "ip": "192.168.200.1",
  "token": "Bearer ITHEIMA"
}
```

生产者脚本：

定义好了消息格式后，创建一个生产者，往Kafka中发送详情页的访问信息。脚本内容如下：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1586765047556.png)

上图脚本内容如下：

```lua
--引入json解析库
local cjson = require("cjson")
--kafka依赖库
local client = require "resty.kafka.client"
local producer = require "resty.kafka.producer"

--配置kafka的服务地址
local broker_list = {
        { host = "192.168.200.188", port = 9092 }
}

--创建kafka生产者
local pro = producer:new(broker_list,{ producer_type="async"})

--获取IP
local headers=ngx.req.get_headers()
local ip=headers["X-REAL-IP"] or headers["X_FORWARDED_FOR"] or ngx.var.remote_addr or "0.0.0.0"

--定义消息内容
local msg = {}
msg["ip"]=ip
msg["actime"]=os.date("%Y-%m-%d %H:%M:%S")
msg["uri"]=ngx.var.uri
msg["token"]="Bearer ITHEIMA"

--发送异步消息，无论消息是否发送成功，都会执行后面的逻辑
local offset, err = pro:send("logsitems", nil, cjson.encode(msg))

--请求转发到/items/,给用户提供html静态页
local uri = ngx.var.uri
uri = string.gsub(uri,"/web","")
ngx.exec(uri)
```

Lua脚本的时间获取

local getTime = os.date("%c");

其中的%c可以是以下的一种：(注意大小写)

| 格式 | 输出内容                                  |
| ---- | ----------------------------------------- |
| %a   | abbreviated weekday name (e.g., Wed)      |
| %A   | full weekday name (e.g., Wednesday)       |
| %b   | abbreviated month name (e.g., Sep)        |
| %B   | full month name (e.g., September)         |
| %c   | date and time (e.g., 09/16/98 23:48:10)   |
| %d   | day of the month (16) \[01-31]            |
| %H   | hour, using a 24-hour clock (23) \[00-23] |
| %I   | hour, using a 12-hour clock (11) \[01-12] |
| %M   | minute (48) \[00-59]                      |
| %m   | month (09) \[01-12]                       |
| %p   | either "am" or "pm" (pm)                  |
| %S   | second (10) \[00-61]                      |
| %w   | weekday (3) \[0-6 = Sunday-Saturday]      |
| %x   | date (e.g., 09/16/98)                     |
| %X   | time (e.g., 23:48:10)                     |
| %Y   | full year (1998)                          |
| %y   | two-digit year (98) \[00-99]              |
| %%   | the character '%'                         |

**5)日志收集测试**

请求地址：<http://192.168.211.137/web/items/S1235433012716498944.html>

查看Kafka的logsitems队列数据：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20210901154057856.png)

访问日志收集完成。