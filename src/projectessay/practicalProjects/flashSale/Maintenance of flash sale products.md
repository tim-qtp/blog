---
order: 1
author: 
title: "秒杀系统维护"
category:
  - 秒杀系统
  - 项目

---

## 1 秒杀设计

### 1.1 业务流程

&#x20;       电商项目中，秒杀属于技术挑战最大的业务。后台可以发布秒杀商品后或者将现有商品列入秒杀商品，热点分析系统会对商品进行分析，对热点商品做特殊处理。商城会员可以在秒杀活动开始的时间内进行抢购，抢购后可以在线进行支付，支付完成的订单由平台工作人员发货，超时未支付订单会自动取消。

&#x20;       当前秒杀系统中一共涉及到管理员后台、搜索系统、秒杀系统、抢单流程系统、热点数据发现系统，如下图：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20210526173510527.png)

### 1.2 秒杀架构

&#x20;       B2B2C商城秒杀商品数据一般都是非常庞大，流量特别高，尤其是双十一等节日，所以设计秒杀系统，既要考虑系统抗压能力，也要考虑系统数据存储和处理能力。秒杀系统虽然流量特别高，但往往高流量抢购的商品为数不多，因此我们系统还需要对抢购热门的商品进行有效识别。

&#x20;       商品详情页的内容除了数量变更频率较高，其他数据基本很少发生变更，像这类变更频率低的数据，我们可以考虑采用模板静态化技术处理。

&#x20;       秒杀系统需要考虑抗压能力，编程语言的选择也有不少讲究。项目发布如果采用Tomcat，单台Tomcat抗压能力能调整到大约1000左右，占用资源较大。Nginx抗压能力轻飘的就能到5万，并且Nginx占用资源极小，运行稳定。如果单纯采用Java研发秒杀系统，用Tomcat发布项目，在抗压能力上显然有些不足，如果采用Nginx+Lua处理用户的请求，那么并发处理能力将大大提升。

&#x20;       下面是当前秒杀系统的架构图：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20210526173534171.png)

### 1.3 数据库设计

#### 1.3.1 秒杀商品数据库

数据库名字：`seckill_goods`

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1586244688393.png)

秒杀活动表：`tb_activity`

```sql
CREATE TABLE `tb_activity` (
  `id` varchar(60) NOT NULL,
  `name` varchar(100) NOT NULL,
  `status` int(2) NOT NULL DEFAULT '1' COMMENT '状态：1开启，2未开启',
  `startdate` date DEFAULT NULL,
  `begintime` datetime DEFAULT NULL COMMENT '开始时间，单位：时分秒',
  `endtime` datetime DEFAULT NULL COMMENT '结束时间，单位：时分秒',
  `total_time` float DEFAULT NULL,
  `is_del` int(1) DEFAULT '1' COMMENT '删除：1未删除，2已删除',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

商品品牌表：`tb_brand`

```sql
CREATE TABLE `tb_brand` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '品牌id',
  `name` varchar(100) NOT NULL COMMENT '品牌名称',
  `image` varchar(1000) DEFAULT '' COMMENT '品牌图片地址',
  `letter` char(1) DEFAULT '' COMMENT '品牌的首字母',
  `seq` int(11) DEFAULT NULL COMMENT '排序',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=325468 DEFAULT CHARSET=utf8 COMMENT='品牌表';
```

秒杀商品分类表：`tb_category`

```sql
CREATE TABLE `tb_category` (
  `id` int(20) NOT NULL AUTO_INCREMENT COMMENT '分类ID',
  `name` varchar(50) DEFAULT NULL COMMENT '分类名称',
  `goods_num` int(11) DEFAULT '0' COMMENT '商品数量',
  `is_show` char(1) DEFAULT NULL COMMENT '是否显示',
  `is_menu` char(1) DEFAULT NULL COMMENT '是否导航',
  `seq` int(11) DEFAULT NULL COMMENT '排序',
  `parent_id` int(20) DEFAULT NULL COMMENT '上级ID',
  `template_id` int(11) DEFAULT NULL COMMENT '模板ID',
  PRIMARY KEY (`id`),
  KEY `parent_id` (`parent_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11177 DEFAULT CHARSET=utf8 COMMENT='商品类目';
```

秒杀时刻表：`tb_seckill_time`

```sql
CREATE TABLE `tb_seckill_time` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL COMMENT '秒杀分类名字,双十一秒杀，每日时段秒杀等',
  `starttime` time NOT NULL COMMENT '开始时间',
  `endtime` time DEFAULT NULL,
  `total_time` float(11,2) DEFAULT NULL COMMENT '秒杀时长,按小时计算',
  `status` int(2) DEFAULT '1' COMMENT '是否启用，1：启用，2：停用',
  `sort` int(2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;
```

秒杀商品表：`tb_sku`

```sql
CREATE TABLE `tb_sku` (
  `id` varchar(60) NOT NULL COMMENT '商品id',
  `name` varchar(200) NOT NULL COMMENT 'SKU名称',
  `price` int(20) NOT NULL DEFAULT '1' COMMENT '价格（分）',
  `seckill_price` int(20) DEFAULT NULL COMMENT '单位，分',
  `num` int(10) DEFAULT '100' COMMENT '库存数量',
  `alert_num` int(11) DEFAULT NULL COMMENT '库存预警数量',
  `image` varchar(200) DEFAULT NULL COMMENT '商品图片',
  `images` varchar(2000) DEFAULT NULL COMMENT '商品图片列表',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `spu_id` varchar(60) DEFAULT NULL COMMENT 'SPUID',
  `category1_id` int(10) DEFAULT NULL COMMENT '类目ID',
  `category2_id` int(10) DEFAULT NULL,
  `category3_id` int(10) DEFAULT NULL,
  `category1_name` varchar(20) DEFAULT NULL,
  `category2_name` varchar(20) DEFAULT NULL,
  `category3_name` varchar(20) DEFAULT NULL COMMENT '类目名称',
  `brand_id` int(11) DEFAULT NULL,
  `brand_name` varchar(100) DEFAULT NULL COMMENT '品牌名称',
  `spec` varchar(200) DEFAULT NULL COMMENT '规格',
  `sale_num` int(11) DEFAULT '0' COMMENT '销量',
  `comment_num` int(11) DEFAULT '0' COMMENT '评论数',
  `seckill_end` datetime DEFAULT NULL COMMENT '秒杀结束时间',
  `seckill_begin` datetime DEFAULT NULL COMMENT '秒杀开始时间',
  `status` int(1) DEFAULT '1' COMMENT '商品状态 1普通商品，2参与秒杀',
  `islock` int(1) DEFAULT '1' COMMENT '是否锁定，1：未锁定，2：锁定',
  `seckill_num` int(11) DEFAULT NULL COMMENT '秒杀数量',
  PRIMARY KEY (`id`),
  KEY `cid` (`category1_id`),
  KEY `status` (`status`),
  KEY `updated` (`update_time`),
  KEY `spu_id` (`spu_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='商品表';
```

秒杀商品活动关联表：`tb_sku_act`

```sql
CREATE TABLE `tb_sku_act` (
  `sku_id` varchar(60) NOT NULL,
  `activity_id` varchar(60) NOT NULL,
  PRIMARY KEY (`sku_id`,`activity_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

日志记录表：`undo_log`

```sql
CREATE TABLE `undo_log` (
`id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'ID',
`branch_id` bigint(20) NOT NULL,
`xid` varchar(100) NOT NULL,
`context` varchar(128) NOT NULL,
`rollback_info` longblob NOT NULL,
`log_status` int(11) NOT NULL,
`log_created` datetime NOT NULL,
`log_modified` datetime NOT NULL,
PRIMARY KEY (`id`),
UNIQUE KEY `ux_undo_log` (`xid`,`branch_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ;
```

#### 1.3.2 秒杀订单数据库

数据库名字：`seckill_general_order`

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1586245109270.png)

秒杀订单表：`tb_order`

```sql
CREATE TABLE `tb_order` (
  `id` varchar(60) COLLATE utf8_bin NOT NULL COMMENT '订单id',
  `total_num` int(11) DEFAULT NULL COMMENT '数量合计',
  `pay_type` varchar(1) COLLATE utf8_bin DEFAULT NULL COMMENT '支付类型，1、在线支付、0 货到付款',
  `create_time` datetime DEFAULT NULL COMMENT '订单创建时间',
  `update_time` datetime DEFAULT NULL COMMENT '订单更新时间',
  `pay_time` datetime DEFAULT NULL COMMENT '付款时间',
  `consign_time` datetime DEFAULT NULL COMMENT '发货时间',
  `end_time` datetime DEFAULT NULL COMMENT '交易完成时间',
  `close_time` datetime DEFAULT NULL COMMENT '交易关闭时间',
  `receiver_contact` varchar(50) COLLATE utf8_bin DEFAULT NULL COMMENT '收货人',
  `receiver_mobile` varchar(12) COLLATE utf8_bin DEFAULT NULL COMMENT '收货人手机',
  `receiver_address` varchar(200) COLLATE utf8_bin DEFAULT NULL COMMENT '收货人地址',
  `transaction_id` varchar(30) COLLATE utf8_bin DEFAULT NULL COMMENT '交易流水号',
  `order_status` char(1) COLLATE utf8_bin DEFAULT NULL COMMENT '订单状态,0:未完成,1:已完成，2：已退货',
  `pay_status` char(1) COLLATE utf8_bin DEFAULT NULL COMMENT '支付状态,0:未支付，1：已支付，2：支付失败',
  `consign_status` char(1) COLLATE utf8_bin DEFAULT NULL COMMENT '发货状态,0:未发货，1：已发货，2：已收货',
  `is_delete` char(1) COLLATE utf8_bin DEFAULT NULL COMMENT '是否删除',
  `sku_id` varchar(60) COLLATE utf8_bin DEFAULT NULL,
  `name` varchar(200) COLLATE utf8_bin DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `username` varchar(50) NOT NULL COMMENT '用户账号',
  PRIMARY KEY (`id`),
  KEY `create_time` (`create_time`),
  KEY `status` (`order_status`),
  KEY `payment_type` (`pay_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
```

日志记录表：`undo_log`

```sql
CREATE TABLE `undo_log` (
`id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'ID',
`branch_id` bigint(20) NOT NULL,
`xid` varchar(100) NOT NULL,
`context` varchar(128) NOT NULL,
`rollback_info` longblob NOT NULL,
`log_status` int(11) NOT NULL,
`log_created` datetime NOT NULL,
`log_modified` datetime NOT NULL,
PRIMARY KEY (`id`),
UNIQUE KEY `ux_undo_log` (`xid`,`branch_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ;
```

#### 1.3.3 管理员数据库

数据库名字：`seckill_manager`

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1586245190614.png)

管理员表：`tb_admin`

```sql
CREATE TABLE `tb_admin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `login_name` varchar(20) DEFAULT NULL COMMENT '用户名',
  `password` varchar(60) DEFAULT NULL COMMENT '密码',
  `status` char(1) DEFAULT NULL COMMENT '状态',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
```

#### 1.3.4 用户数据库

数据库名字：`seckill_user`

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1586245252808.png)

用户表：`tb_user`

```sql
CREATE TABLE `tb_user` (
  `username` varchar(50) NOT NULL COMMENT '用户名',
  `password` varchar(100) NOT NULL COMMENT '密码，加密存储',
  `phone` varchar(20) DEFAULT NULL COMMENT '注册手机号',
  `email` varchar(50) DEFAULT NULL COMMENT '注册邮箱',
  `created` datetime NOT NULL COMMENT '创建时间',
  `updated` datetime NOT NULL COMMENT '修改时间',
  `nick_name` varchar(50) DEFAULT NULL COMMENT '昵称',
  `name` varchar(50) DEFAULT NULL COMMENT '真实姓名',
  PRIMARY KEY (`username`),
  UNIQUE KEY `username` (`username`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户表';
```

收件地址表：`tb_address`

```sql
CREATE TABLE `tb_address` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) DEFAULT NULL COMMENT '用户名',
  `provinceid` varchar(20) DEFAULT NULL COMMENT '省',
  `cityid` varchar(20) DEFAULT NULL COMMENT '市',
  `areaid` varchar(20) DEFAULT NULL COMMENT '县/区',
  `phone` varchar(20) DEFAULT NULL COMMENT '电话',
  `address` varchar(200) DEFAULT NULL COMMENT '详细地址',
  `contact` varchar(50) DEFAULT NULL COMMENT '联系人',
  `is_default` varchar(1) DEFAULT NULL COMMENT '是否是默认 1默认 0否',
  `alias` varchar(50) DEFAULT NULL COMMENT '别名',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

#### 1.3.5 相对重要的表

其中最重要的就是秒杀商品表了：tb_sku

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241231202400064.png)

商品状态：是看商品是否参与秒杀

是否锁定：会进行热点数据的实时分析，对分析出来的热点商品进行隔离操作，非热点数据-非锁定，热点数据-锁定。而且后面会进行热点和非热点的隔离下单，那么也需要`islock`去操作

秒杀数量：扣减，数量为0就不能让用户下单，所以这里就存在一个==负库存==的问题。

还有一个是秒杀订单表：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20250101110843885.png)

首先是订单id，秒杀对应的是高流量，高并发，如果只有一个订单微服务肯定是应对不了的，所以要==部署集群==，让多个订单微服务同时处理订单，那订单id的唯一性如何保证，这里使用的是雪花算法，来保证==分布式场景下订单id的唯一性==

#### 1.3.6 SKU和SPU

- **SPU**：T恤
- **SKU**：具体到这款T恤的每一个不同颜色和尺码的组合，比如“红色，M码”、“蓝色，L码”等

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20250102001817204.png)

## 2 项目介绍

### 2.1 技术栈介绍

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20210308174351600.png)

### 2.2 项目结构

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1586245527397.png)

### 2.3 环境准备

由于项目最终跑起来需要的服务器内存较大，建议使用16G或者更大内存的云服务器进行部署。

需要安装的环境包括：基础环境(Docker、JDK)、Nacos，MySQL，ElasticSearch，Kibana

CentOS 7.6

安装看本站Docker栏安装文章

最后：

连接kibana，测试中文分词

```bash
GET /_analyze
{
  "analyzer": "ik_smart",
  "text": "乒乓球明年总冠军"
}
```

![乒乓球明年总冠军](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20250101164722241.png)

#### 2.4 配置IP映射

直接使用IP访问存在的问题：

1. 开发环境和测试环境不是一个ip地址，进行测试的时候，需要更换。

2. 资源的引用（js、图片、css）有可能使用的是全路径，一旦环境变化，资源就无法加载

3. 客户进行访问，不可能使用ip地址，而是使用域名进行访问。（ip地址难记，没有规律，难以记忆）

所以我们这里使用各种服务首选并不是直接配置IP，而是使用自己指定的名称。

内容为：（注意192.168.200.188修改为云服务器的公网IP）

```plaintext
192.168.200.188 db-server
192.168.200.188 druid-server
192.168.200.188 redis-server
192.168.200.188 zk-server
192.168.200.188 kafka-server
192.168.200.188 nacos-server
192.168.200.188 es-server
192.168.200.188 canal-server
192.168.200.188 seata-server
```

### 2.5 工程案例

我们例举一下增删改查在当前项目中的一个案例。

项目中相关服务地址采用了别名，需要将别名配置到`C:\Windows\System32\drivers\etc\hosts`文件中：

可以借助uTools软件中的hosts插件完成

```plaintext
192.168.200.188 db-server
192.168.200.188 redis-server
192.168.200.188 zk-server
192.168.200.188 kafka-server
192.168.200.188 nacos-server
192.168.200.188 es-server
192.168.200.188 canal-server
192.168.200.188 seata-server
```

我们找一个项目中的案例，梳理和解读一下项目的访问流程，流程图如下：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20210530223603777.png)

在代码中，我们讲解一下用户查询所有品牌的案例：

请求路径:`/api/brand`

调用：

&#x20;       ①`seckill-gateway`

&#x20;       ②`seckill-service/seckill-goods/BrandController.findAll()`

代码图解：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20250101233708996.png)

## 3 索引库数据管理

&#x20;       秒杀商品数量庞大，我们要想实现快速检索，不建议直接使用关系型数据库查找。不建议使用Redis缓存所有数据，因为秒杀商品量大，会影响Redis的性能，并且Redis的条件检索能力偏弱。我们可以使用Elasticsearch，它在海量数据存储与检索上，能力卓越，市场使用面广。

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20250102002451930.png)

==类目名称==，==品牌名称==和==开始时间==是不做分词再搜索的，如果想找一个`平板电脑`，分词了变成了`平板`和`电脑`了。

### 3.1 批量导入

#### 3.1.1 实现秒杀商品查询接口

&#x20;       我们需要将秒杀商品数据导入到ES索引库中，但秒杀商品数量庞大，所以我们应该分页查询并导入，流程如下：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20210726154130937.png)

需求：需要把秒杀商品放到索引库中，商品微服务需要提供分页查询秒杀商品的接口

```plaintext
在seckill-goods微服务中实现接口：
GET   /api/sku/count    查询总数量
GET   /api/sku/list/{page}/{size}  分页查询(page页码数，size每页据条数)

分析：只需要查询秒杀商品即可，所以查询条件应该包括 ：
秒杀数量  seckillNum     大于0
秒杀状态  status         等于2(秒杀商品)
秒杀结束时间 seckillEnd   大于当前时间
```

**1)service总数量查询**

&#x20;       我们先在`seckill-goods`中编写相关方法实现数据查询，因为要用到分页，所以先查询总数量，然后再实现分页集合查询。

在`seckill-goods`的`com.seckill.goods.service.SkuService`中添加count方法，用于查询秒杀商品总数量：

```java
/**
 * 总数量加载
 */
Integer count();
```

在`seckill-goods`的`com.seckill.goods.service.impl.SkuServiceImpl`中添加count方法，用于实现查询秒杀商品总数量：

```java
/**
 * 总数量加载
 */
@Override
public Integer count() {
    Example example = new Example(Sku.class);
    Example.Criteria criteria = example.createCriteria();
    //秒杀剩余商品数量>0
    criteria.andGreaterThan("seckillNum",0);
    //状态为参与秒杀，1:普通商品，2:参与秒杀
    criteria.andEqualTo("status","2");
    //秒杀结束时间>=当前时间
    criteria.andGreaterThanOrEqualTo("seckillEnd",new Date());
    return skuMapper.selectCountByExample(example);
}
```

在`seckill-goods`的`com.seckill.goods.controller.SkuController`中添加count方法，用于实现查询秒杀商品总数量：

```java
/**
 * 分页查询-查询总数量
 */
@GetMapping(value = "/count")
public Integer count() {
    return skuService.count();
}
```

**2)service分页集合数据查询**

在`seckill-goods`的`com.seckill.goods.service.SkuService`中添加list方法，用于查询秒杀商品：

```java
/**
 * 分页加载
 */
List<Sku> list(int page, int size);
```

在`seckill-goods`的`com.seckill.goods.service.impl.SkuServiceImpl`中添加list方法，用于实现查询秒杀商品：

```java
/**
 * 分页加载
 */
@Override
public List<Sku> list(int page, int size) {
    //分页
    PageHelper.startPage(page,size);

    //条件构建
    Example example = new Example(Sku.class);
    Example.Criteria criteria = example.createCriteria();
    //秒杀剩余商品数量>0
    criteria.andGreaterThan("seckillNum",0);
    //状态为参与秒杀，1:普通商品，2:参与秒杀
    criteria.andEqualTo("status","2");
    //秒杀结束时间>=当前时间
    criteria.andGreaterThanOrEqualTo("seckillEnd",new Date());
    return skuMapper.selectByExample(example);
}
```

在`seckill-goods`的`com.seckill.goods.controller.SkuController`中添加list方法，用于实现查询秒杀商品：

```java
/**
 * Sku分页条件加载
 */
@GetMapping(value = "/list/{page}/{size}" )
public List<Sku> list(@PathVariable  int page, @PathVariable  int size){
    //调用SkuService实现分页条件查询Sku
    List<Sku> skus = skuService.list(page, size);
    return skus;
}
```

**3)Feign接口编写**

在`seckill-goods-api`的`com.seckill.goods.feign.SkuFeign`中编写feign方法，分别调用刚才的count、list方法，代码如下：

```java
/**
 * 分页查询-查询总数量
 */
@GetMapping(value = "/sku/count")
Integer count();


/**
 * 分页查询集合列表
 */
@GetMapping(value = "/sku/list/{page}/{size}")
List<Sku> list(@PathVariable(value = "page") Integer page, @PathVariable(value = "size") Integer size);
```

#### 3.1.2 实现ElasticSearch索引创建

创建ElasticSearch索引库，并建立索引，建立索引如下：

```plaintext
GET goodsindex
PUT goodsindex
{
        "mappings": {
                "properties": {
                        "name": {
                                "type": "text",
                                "analyzer": "ik_smart"
                        },
                        "price": { 
                                "type": "long"
                        },
                        "seckillPrice": { 
                                "type": "long"
                        },
                        "image": { 
                                "type": "text"
                        },
                        "updateTime": {
                                "type": "date"
                        },
                        "category1Id": { 
                                "type": "text"
                        },
                        "category2Id": { 
                                "type": "text"
                        },
                        "category3Id": { 
                                "type": "text"
                        },
                        "category1Name": {        
                                "type": "keyword"
                        },
                        "category2Name": {        
                                "type": "keyword"
                        },
                        "category3Name": {        
                                "type": "keyword"
                        },
                        "brandName": {        
                                "type": "keyword"
                        },
                        "bgtime": {        
                                "type": "keyword"
                        },
                        "brandId": {        
                                "type": "text"
                        },
                        "seckillBegin": {
                                "type": "date"
                        },
                        "seckillEnd": {
                                "type": "date"
                        },
                        "status": {
                                "type": "integer"
                        },
        
                        "spec": {                
                                "type": "text"
                        },
                        
                        "points": {        
                                "type": "integer"
                        }
                }
        }
}
```

数据添加到数据库：

```plaintext
1.将数据接到，并转成JavaBean->数据库表中对应的一个JavaBean
2.调用API，把JavaBean保存到数据库
```

将数据添加到索引库，流程和上面类似，也需要先创建一个能体现索引库的JavaBean映射对象，将要保存到索引库的数据赋值给JavaBean，利用API将JavaBean保存到索引库。

我们首先编写一个和索引库中一一对应的实体Bean，

在`seckill-search-api`的`com.seckill.search.pojo.SkuInfo`中编实现，代码如下：

```java
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class SkuInfo {

    // 商品id，同时也是商品编号
    // 也是ES唯一标识符，对应的_id
    private String id;

    // SKU名称
    // 需要分词
    private String name;

    //商品价格
    private Long price;

    //秒杀价
    private Long seckillPrice;

    //商品图片
    private String image;

    //更新时间
    private Date updateTime;

    //类目ID
    private String category1Id;

    //类目ID
    private String category2Id;

    //类目ID
    private String category3Id;

    //类目名称
    private String category1Name;

    //类目名称
    private String category2Name;

    //类目名称
    private String category3Name;

    //品牌名称
    private String brandName;

    //开始时间，用于做搜索
    private String bgtime;

    //品牌ID
    private String brandId;

    //秒杀开始时间
    private Date seckillBegin;

    //秒杀结束时间
    private Date seckillEnd;

    //秒杀状态，1普通商品，2秒杀
    private Integer status; 

    //规格
    private String spec;

    //比例
    private Integer points;

}
```

#### 3.1.3 实现项目整合ElasticSearch

集成SpringData Elasticsearch实现索引导入流程：

```plaintext
1.配置Elasticsearch地址信息
2.在Service中分页调用查询秒杀商品集合
3.分页导入秒杀商品集合数据到Elasticsearch中
```

当前项目已经集成好了SpringDataElasticsearch，我们只需要实现相关的操作过程即可。

bootstrap.yml添加es配置：

```plaintext
#取消对elastsearch的健康检查
management:
  health:
    elasticsearch:
      enabled: false
#自定义elasticsearch连接配置
elasticsearch:
  host: es-server
  port: 9200
```

在`seckill-search`的`com.seckill.search.config.ElasticSearchConfig`中编写配置类，代码如下：

```java
@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "elasticsearch")
public class ElasticSearchConfig {
    private String host;
    private int port;

    @Bean
    public RestHighLevelClient client(){
        return new RestHighLevelClient(RestClient.builder(
                new HttpHost(
                        host,
                        port,
                        "http"
                )
        ));
    }
}
```

#### 3.1.4 实现索引库批量导入

在`seckill-search`的`com.seckill.search.service.SkuInfoService`中编写接口方法，代码如下：

```java
public interface SkuInfoService {
    
    /**
     * 批量导入
     */
    void addAll();
}
```

在`seckill-search`的`com.seckill.search.service.impl.SkuInfoServiceImpl`中编写导入索引，代码如下：

```java
@Service
public class SkuInfoServiceImpl implements SkuInfoService {

    @Autowired
    private SkuFeign skuFeign;

    @Autowired
    private RestHighLevelClient restHighLevelClient;

    private String index_name = "goodsindex";

    /**
     * 批量导入
     */
    @Override
    public void addAll() {
        //分页数据
        int page = 1, size = 100;
       
        //1.查询总记录数
        Integer total = skuFeign.count();
        //2.根据总记录数计算总页数
        int totalpages = total % size == 0 ? total / size : (total / size) + 1;

        //3.循环总页数，查询每页的数据
        for (int i = 0; i < totalpages; i++) {
            List<Sku> skus = skuFeign.list(page, size);
            page++;

            // 4.将数据转换成SkuInfo
            List<SkuInfo> skuInfos = JSON.parseArray(JSON.toJSONString(skus), SkuInfo.class);

            //bulk批量导入
            BulkRequest bulkRequest = new BulkRequest();

            //2.1 循环goodsList，创建IndexRequest添加数据
            for (SkuInfo skuInfo : skuInfos) {
                // 将开始时间转换成字符串类型
                skuInfoConverter(skuInfo);

                //将skuInfo对象转换为json字符串
                String data = JSON.toJSONString(skuInfo);
                IndexRequest indexRequest = new IndexRequest(index_name);
                indexRequest.id(skuInfo.getId() + "").source(data, XContentType.JSON);

                //添加批量保存
                bulkRequest.add(indexRequest);
            }


            try {
                restHighLevelClient.bulk(bulkRequest, RequestOptions.DEFAULT);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    // 将开始时间转换成字符串类型
    private void skuInfoConverter(SkuInfo skuInfo) {
        if (skuInfo.getSeckillBegin() != null) {
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyyMMddHH");
            skuInfo.setBgtime(simpleDateFormat.format(skuInfo.getSeckillBegin()));
        }
    }
}
```

在`seckill-search`的`com.seckill.search.controller.SearchController`中编写导入索引，代码如下：

```java
@RestController
@RequestMapping(value = "/search")
@CrossOrigin
public class SearchController {

    @Autowired
    private SkuInfoService skuInfoService;

    /**
     * 批量导入
     */
    @GetMapping(value = "/add/all")
    public Result addAll() {
        //批量导入
        skuInfoService.addAll();
        return new Result(true, StatusCode.OK, "批量导入成功！");
    }
}
```

4\)测试

启动`seckill-goods`、`seckill-search`、`seckill-gateway`,访问刚才编写的批量导入的方法，访问地址：`http://localhost:8001/api/search/add/all`

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1586338463890.png)

#### 3.1.5 批量导入小结

使用bulkRequest可以减少网络的请求，I/O请求，提高性能。批量操作能进行增删改，但不支持get。

批量操作优化：

1. 减少refresh时间间隔

2. 减少刷新频率，降低潜在的写磁盘性能损耗。

3. 说明：ES 默认的刷新时间间隔是1s，对于写入量很大的场景，这样的配置会导致写入吞吐量很低，适当提高刷新间隔，可以提升写入量，代价就是让新写入的数据在更长时间之后才可以被搜索，新数据可见的及时性有所下降。
   在bulk大量数据到ES集群的时候甚至可以关闭刷新频率，把其值设置为-1就是关闭了刷新频率，在导入完之后设置成合理的值即可，例如30s或者60s即可。

```plaintext
# 修改 refresh_interval 的设置  ，goodsindex1是索引名
PUT goodsindex1/_settings
{"refresh_interval": "3s"}
```

1. 设置每次bulk的最佳数量

2. 越大的bulk size会导致内存压力过大，因此最好一个请求不要发送超过10mb的数据量。

3. 要知道一个bulk请求最佳的大小，需要对单个es node的单个shard做压测。先bulk写入100个document，然后200个，400个，以此类推，每次都将bulk size加倍一次。如果bulk写入性能开始变平缓的时候，那么这个就是最佳的bulk大小。

4. 使用多线程

5. 单线程发送bulk请求是无法最大化es集群写入的吞吐量的。

6. 如果要利用集群的所有资源，就需要使用多线程并发将数据bulk写入集群中。

7. 首先对单个es节点的单个shard做压测，例如先是2个线程，然后是4个线程，然后是8个线程，每次线程数量倍增。一旦发现es返回了TOO\_MANY\_REQUESTS的错误，JavaClient也就是EsRejectedExecutionException。此时那么就说明es是说已经到了一个并发写入的最大瓶颈了，此时我们就知道最多只能支撑这么高的并发写入了。

8. 使用自动生成的id

9. 如果手动给ES document设置一个id，那么ES需要每次都去确认一下那个id是否存在，这个过程比较耗费时间

### 3.2 增量导入

增量导入，也就是某个商品设置成秒杀商品的时候，或者发生变更的时候，能实现增量备份（只将修改的数据同步修改索引库），所以我们还需要实现单个商品导入索引库，我们可以在变更方法（增删改）中调用这边同步方法，但随着系统的增加，这种方法容易有漏网之鱼，我们可以采用canal实现数据库增量监听，然后调用`seckill-search`的单个操作方法。

需求：需要对索引库进行数据维护，要实现增删改接口

```plaintext
在seckill-search微服务中实现接口：
POST   /search/modify/sku/{type}        索引库增量操作 
        type： 1(新增)    2(修改)   3(删除)
        请求body为 Sku 的 json 格式数据
        
POST   /search/modify/{type}                索引库增量操作 
        type： 1(新增)    2(修改)   3(删除)
        请求body为 SkuInfo 的 json 格式数据

分析：两个接口功能几乎一样，只是一个接收Sku秒杀商品数据，另一个接收对应索引库的SkuInfo数据
     Service层中只需要实现根据type和SkuInfo修改即可，在Controller中，利用Json工具把Sku转为SkuInfo
```

1\)索引操作方法编写

在`seckill-search`的`com.seckill.search.service.SkuInfoService`中添加modify方法，代码如下：

```java
/**
 * 单条索引操作
 * @param type: 1:增加，2：修改，3：删除
 * @param skuInfo
 */
void modify(Integer type, SkuInfo skuInfo);
```

在`seckill-search`的`com.seckill.search.service.impl.SkuInfoServiceImpl`中添加modify实现方法，代码如下：

```java
/**
 * 增量操作
 * ->添加索引   type=1
 * ->修改索引   type=2
 * ->删除索引   type=3
 */
@Override
public void modify(Integer type, SkuInfo skuInfo) {
    try {
        if (type == 1 || type == 2) {
            // 将开始时间转换成字符串类型
            skuInfoConverter(skuInfo);

            //将对象转为json
            String data = JSON.toJSONString(skuInfo);
            IndexRequest request = new IndexRequest(index_name).id(skuInfo.getId()).source(data, XContentType.JSON);

            //增加-修改
            restHighLevelClient.index(request, RequestOptions.DEFAULT);

        } else {
            //删除
            DeleteRequest deleteRequest = new DeleteRequest(index_name, skuInfo.getId());
            restHighLevelClient.delete(new DeleteRequest(index_name, skuInfo.getId()), RequestOptions.DEFAULT);
        }
    } catch (IOException e) {
        e.printStackTrace();
    }
}
```

在`seckill-search`的`com.seckill.search.controller.SkuInfoController`中添加modify方法，代码如下：

```java
/**
 * 增量操作
 * ->删除索引   type=3
 * ->修改索引   type=2
 * ->添加索引   type=1
 */
@PostMapping(value = "/modify/{type}")
public Result modify(@PathVariable(value = "type") Integer type, @RequestBody SkuInfo skuInfo) {
    //索引更新
    skuInfoService.modify(type, skuInfo);
    return new Result(true, StatusCode.OK, "操作成功！");
}

/**
 * 修改Sku
 */
@PostMapping(value = "/modify/sku/{type}")
public Result modifySku(@PathVariable(value = "type") Integer type, @RequestBody Sku sku) {
    //索引更新
    SkuInfo skuInfo = JSON.parseObject(JSON.toJSONString(sku), SkuInfo.class);
    skuInfoService.modify(type, skuInfo);
    return new Result(true, StatusCode.OK, "操作成功！");
}
```

2\)Feign接口编写

在`seckill-search-api`中编写Feign接口，实现调用modify方法，代码如下：

```java
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

使用postman进行测试，并在kibana中查看结果：

```plaintext
GET goodsindex/_doc/S1235433012716498944
```

### 3.3 商品搜索

&#x20;       根据秒杀页面的需求，多数是查询指定秒杀时段下的秒杀商品，同时还会有分页，当然，如果有复杂的查询，我们Elasticsearch也都满足。我们可以根据多数秒杀需求，实现按照秒杀时段分页查询数据。

需求：实现在索引库中分页搜索指定秒杀时段的秒杀商品数据

```plaintext
在seckill-search微服务中实现接口：
GET   /search?starttime=2021010810                索引库查询 starttime是指定的秒杀时间

分析：搜索的秒杀商品，是指定时间中正在进行秒杀的商品，所以指定的时间要大于秒杀开始时间
     需要接收查询条件starttime，索引库的bgtime必须小于指定的starttime
          
```

编写Service`com.seckill.search.service.SkuInfoService`创建搜索方法，代码如下：

```java
/**
 * 搜索
 */
Page<SkuInfo> search(Map<String,String> searchMap);
```

编写Service`com.seckill.search.service.impl.SkuInfoServiceImpl`创建搜索实现方法，代码如下：

```java
/**
 * 秒杀搜索列表
 */
@Override
public Page<SkuInfo> search(Map<String, String> searchMap) {
    //时间  starttime
    String starttime = searchMap.get("starttime");
    //页码数
    int pageNum = pageNum2Int(searchMap);
    int pageSize = pageSize2Int(searchMap);

    SearchRequest searchRequest = new SearchRequest("goodsindex");
    SearchSourceBuilder sourceBuilder = new SearchSourceBuilder();

    //范围查询
    RangeQueryBuilder query = QueryBuilders.rangeQuery("bgtime");
    //指定下限
    query.gte(starttime);
    sourceBuilder.query(query);

    //设置分页
    sourceBuilder.from(pageNum);
    sourceBuilder.size(pageSize);

    searchRequest.source(sourceBuilder);


    try {
        SearchResponse searchResponse = restHighLevelClient.search(searchRequest, RequestOptions.DEFAULT);

        SearchHits searchHits = searchResponse.getHits();

        //获取记录数
        long total = searchHits.getTotalHits().value;

        List<SkuInfo> skuInfoList = new ArrayList<>();
        SearchHit[] hits = searchHits.getHits();
        for (SearchHit hit : hits) {
            String sourceAsString = hit.getSourceAsString();
            //转为java
            SkuInfo skuInfo = JSON.parseObject(sourceAsString, SkuInfo.class);
            skuInfoList.add(skuInfo);
        }

        Pageable pageable = PageRequest.of(pageNum, pageSize).first();
        return new PageImpl<>(skuInfoList, pageable, total);
    } catch (IOException e) {
        e.printStackTrace();
    }
    return null;
}

/**
 * 获取当前页->pageNum
 */
private Integer pageNum2Int(Map<String, String> searchMap) {
    try {
        return Integer.parseInt(searchMap.get("pageNum"));
    } catch (NumberFormatException e) {
        return 1;
    }
}

/**
 * 获取当前页->pageSize
 */
private Integer pageSize2Int(Map<String, String> searchMap) {
    try {
        return Integer.parseInt(searchMap.get("pageSize"));
    } catch (NumberFormatException e) {
        return 50;
    }
}
```

编写Service`com.seckill.search.controller.SearchController`创建搜索方法调用，代码如下：

```java
/**
 * 分页查询秒杀商品
 * pageNum:当前页
 * starttime:秒杀活动开始时间
 */
@GetMapping
public Page<SkuInfo> search(@RequestParam(required = false) Map<String, String> searchMap) {
    if(searchMap==null){
        return null;
    }
    return skuInfoService.search(searchMap);
}
```

## 4 商品详情页

### 4.1 索引使用测试

创建以下表：

```sql
CREATE TABLE `tb_table` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `name` varchar(20) DEFAULT NULL COMMENT '姓名',
  `number` int(11) DEFAULT NULL COMMENT '编号',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
```

执行以下sql，批量添加10条数据：

```sql
drop procedure if exists tb_insert; 
CREATE PROCEDURE tb_insert()
BEGIN
DECLARE i INT;
SET i = 0;
START TRANSACTION;
WHILE i < 10 DO -- 10即插入10条数据
        INSERT INTO tb_table (`name`,`number`) VALUES (concat("张三",i),i);
        SET i = i+1;
END WHILE;
COMMIT;
END;

call tb_insert();
```

在表没有添加索引和添加索引的时候，都执行以下查询：

```sql
SELECT * FROM tb_table WHERE number = 500000
```

然后再添加数据库的数据，插入100万条，再次测试有索引和没有索引的查询语句。

&#x20;       通过上面的对比测试可以看出，索引是快速搜索的关键。MySQL索引的建立对于MySQL的高效运行是很重要的。对于少量的数据，没有合适的索引影响不是很大，但是，当随着数据量的增加，性能会急剧下降。

### 4.2 静态化入门案例

&#x20;       秒杀活动中，热卖商品的详情页访问频率非常高，详情页的数据加载，我们可以采用直接从数据库查询加载，但这种方式会给数据库带来极大的压力，甚至崩溃，这种方式我们并不推荐。

&#x20;       商品详情页主要有商品介绍、商品标题、商品图片、商品价格、商品数量等，大部分数据几乎不变，可能只有数量会变，因此我们可以考虑把商品详情页做成静态页，每次访问只需要加载库存数量，这样就可以大大降低数据库的压力。

在`seckill-page`中生成商品详情页。

确认pom.xml中添加FreeMarker依赖：

```xml
<!--freemarker-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-freemarker</artifactId>
</dependency>
```

确认bootstrap.yml中添加以下配置

```yaml
  #freemarker配置
  freemarker:
    cache: false  #关闭模板缓存，方便测试
    settings:
      template_update_delay: 0  #检查模板更新延迟时间，设置为0表示立即检查，如果时间大于0会有缓存不方便进行模板测试
    template-loader-path: classpath:/templates
    charset: UTF-8
    check-template-location: true
    suffix: .ftl
    content-type: text/html
    expose-request-attributes: true
    expose-session-attributes: true
    request-context-attribute: request

# 静态页生成的位置 注意修改为自己指定的路径
htmlPath: C:/5_code/html
```

在`seckill-page`的`com.seckill.page.service`编写接口，内容如下：

```java
public interface SkuPageService {

    /**
     * 生成静态页
     */
    void writePage(Map<String,Object> dataMap) throws Exception;
}
```

在`seckill-page`的`com.seckill.page.service`编写文件生成逻辑，内容如下：

```java
@Service
public class SkuPageServiceImpl implements SkuPageService {

    @Autowired
    private Configuration configuration;

    /**
     * 生成静态页
     *
     * @param dataMap dataMap.templateName: 模板名字,例如item.ftl,模板放到resources/templates目录下
     *                dataMap.path: 生成文件存储路径，例如C:/page/html
     *                dataMap.name: 生成的文件名字，例如：12345.html
     */
    @Override
    public void writePage(Map<String, Object> dataMap) throws Exception {

        //获取模板名字
        String templateName = dataMap.get("templateName").toString();

        //文件生存的路径
        String path = dataMap.get("path").toString();

        //文件路径如果不存在，则创建
        File file = new File(path);
        if (!file.exists()) {
            file.mkdirs();
        }

        //获取文件名字
        String fileName = dataMap.get("name").toString();

        //获取模板对象
        Template template = configuration.getTemplate(templateName);

        //模板处理，获取生成的文件字符串
        String content = FreeMarkerTemplateUtils.processTemplateIntoString(template, dataMap);

        //生成文件
        FileUtils.writeStringToFile(new File(path, fileName), content);
    }
}
```

变量注释如下：

```plaintext
templateName:模板名字，例如item.ftl,模板放到templates目录下
path:生成文件的路径，例如C:/page/html
name:生成静态页文件的名字，例如：item.html
```

在`seckill-page`中创建`com.seckill.page.controller.SkuPageController`,添加测试Controller，代码如下：

```java
@RestController
@RequestMapping(value = "/page")
public class SkuPageController {

    @Value("${htmlPath}")
    private String htmlPath;

    @Autowired
    private SkuPageService skuPageService;

    /**
     * 测试商品详情静态页
     */
    @PostMapping(value = "/html")
    public Result html() throws Exception {
        String id = "1234";
        //数据模型
        Map<String, Object> dataMap = new HashMap<String, Object>();
        dataMap.put("templateName", "test.ftl"); //模板名字
        dataMap.put("name", id + ".html");  //生成静态页的文件名字
        dataMap.put("path", htmlPath);      //生成的静态页路径

        dataMap.put("title", "笔记本电脑"); //数据
        dataMap.put("arr", new String[]{"1", "2", "3"}); //集合

        //生成静态页
        skuPageService.writePage(dataMap);
        return new Result(true, StatusCode.OK, "生成成功！");
    }
}
```

创建模板文件 `test.ftl`

```html
<!DOCTYPE HTML>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>静态页测试</title>
</head>
<body>
<h3>${title}</h3>

<#list arr! as a>
    ${a}<br/>
</#list>

</body>
</html>
```

### 4.3 商品详情静态页生成

需求：实现秒杀商品详情页静态化接口

```plaintext
在seckill-page微服务中实现接口：
GET   /page/html/{skuId}                根据sku主键生成其对应的静态页面
DELETE   /page/html/{skuId}         根据sku主键删除其对应的静态页面

分析：参考FreeMarker案例，实现静态页生成功能。
     删除接口实现主要是进行文件操作，把静态页html删除即可
```

先查看资料中的seckill-static.zip 解压，可以看到商品详情页的html。

我们需要给每一个秒杀的Sku生成对应的html，所以需要先通过Sku的主键获取到Sku的数据，然后再把数据在页面中进行渲染。

在`seckill-page`中创建`com.seckill.page.controller.SkuPageController`,添加生成静态页方法，代码如下：

```java
@RestController
@RequestMapping(value = "/page")
public class SkuPageController {

    @Autowired
    private SkuPageService skuPageService;
    
    @Autowired
    private SkuFeign skuFeign;

    @Value("${htmlPath}")
    private String htmlPath;


    
    /**
     * Sku静态页生成
     */
    @GetMapping(value = "/html/{id}")
    public Result html(@PathVariable(value = "id") String id) throws Exception {
        Result<Sku> skuResult = skuFeign.findById(id);
        //数据模型
        Map<String, Object> dataMap = new HashMap<String, Object>();
        dataMap.put("path", htmlPath);
        dataMap.put("templateName", "items.ftl");
        dataMap.put("name", id + ".html");//id.html
        dataMap.put("address", "北京");
        dataMap.put("sku", skuResult.getData());
        dataMap.put("images", skuResult.getData().getImages().split(","));
        //获取spec
        String spec = skuResult.getData().getSpec();
        Map<String, String> specMap = JSON.parseObject(spec, Map.class);
        String speclist = "";
        for (Map.Entry<String, String> entry : specMap.entrySet()) {
            speclist += "/" + entry.getValue();
        }
        dataMap.put("spec", speclist);

        //生成静态页
        skuPageService.itemPage(dataMap);
        return new Result(true, StatusCode.OK, "生成静态页成功！");
    }
}
```

把静态页面html修改为静态页模板`resources\templates\sku.ftl`，内容为：

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="screen-orientation" content="portrait"> <!--    //Android 禁止屏幕旋转-->
    <meta name="full-screen" content="yes"> <!--    //全屏显示-->
    <meta name="browsermode" content="application">
    <!--    //UC应用模式，使用了application这种应用模式后，页面讲默认全屏，禁止长按菜单，禁止收拾，标准排版，以及强制图片显示。-->
    <meta name="x5-orientation" content="portrait"> <!--    //QQ强制竖屏-->
    <meta name="x5-fullscreen" content="true"> <!--    //QQ强制全屏-->
    <meta name="x5-page-mode" content="app"> <!--    //QQ应用模式-->
    <meta name="viewport"
          content="width=device-width,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no,minimal-ui">
    <!--    //WebApp全屏模式-->
    <meta name="format-detection" content="telphone=no, email=no"/> <!--    //忽略数字识别为电话号码和邮箱-->
    <style>

    </style>
    <link rel="icon" href="./images/favicon.ico">
    <title>秒杀抢购</title>
    <link rel="stylesheet" href="./js/layer_mobile/need/layer.css"/>
    <link rel="stylesheet" href="./css/index.css"/>
</head>

<body>
<div id="app">
    <header>
        <div class="swiper-container">
            <div class="swiper-wrapper">
                <div class="swiper-slide">
                    <img src="${sku.image}"
                         :onerror="defaultImage" width="100%"></img>
                </div>
                <div class="swiper-slide">
                    <img src="" :onerror="defaultImage" width="100%"></img>
                </div>
                <div class="swiper-slide">
                    <img src="${sku.image}"
                         :onerror="defaultImage" width="100%"></img>
                </div>
            </div>
            <!-- 如果需要分页器 -->
            <div class="swiper-pagination"></div>
        </div>
        <div class="detailsInfo">
            <div style="padding:8px 14px;position: relative;">
                <div class="cards"><span class="left"></span><span class="rit"></span></div>
                <img src="./images/detailLog.png" class="ico" width="45" alt="">
            </div>
            <div style="flex: 1; padding-top: 15px;padding-left: 30px;">
                <div><span style="font-size: 12px;">￥</span><span
                            style="font-size: 20px;font-weight: bold">${sku.seckillPrice}</span></div>
                <div style="text-decoration: line-through;font-size: 12px;"><span>￥</span><span>${sku.price}</span>
                </div>
            </div>
            <div style="padding-top: 10px;padding-right: 15px;font-size: 12px;">
                <div id="time-end" class="time">
                    <div style="margin-bottom: 6px">距离结束：</div>
                    <div class="tim"><span class="hours"></span> ：<span class="minutes"></span> ：<span
                                class="seconds"></span></div>
                </div>
                <div id="time-begin" class="time">
                    <div style="margin-bottom: 6px">距离开始：</div>
                    <div class="tim"><span class="hours"></span> ：<span class="minutes"></span> ：<span
                                class="seconds"></span></div>
                </div>
                <div id="time" class="time" style="line-height: 50px;">活动已结束</div>
            </div>
        </div>
    </header>
    <div class="skileDetail">
        <div class="itemCont infoCont">
            <div class="title">${sku.name}</div>
            <div class="desc">${sku.brandName} ${sku.category3Name}</div>
            <div class="item">
                <div class="info"><span>已选</span><span>${spec}</span></div>
                <img src="./images/right.png" width="44"
                     alt="">
            </div>
            <div class="item">
                <div class="info"><span>送至</span><span>北京市昌平区建材城西路9号, 传智播客前台</span></div>
                <img src="./images/right.png"
                     width="44" alt="">
            </div>
        </div>
        <div class="itemCont comment">
            <div class="title">
                <div class="tit">评论</div>
                <div class="rit">
                    <span>好评度 100%</span>
                    <img src="./images/right.png" width="44" alt="">
                </div>
            </div>
            <div class="cont">
                <div class="item">
                    <div class="top">
                        <div class="info">
                            <img src="./images/icon.png" width="25" height="25" alt=""/>
                            <div style="color:#666;margin-left: 10px; font-size: 14px;">张庆</div>
                        </div>
                        <div>
                            <img src="./images/shoucang.png" width="11" alt="">
                            <img src="./images/shoucang.png" width="11" alt="">
                            <img src="./images/shoucang.png" width="11" alt="">
                            <img src="./images/shoucang.png" width="11" alt="">
                            <img src="./images/shoucang.png" width="11" alt="">
                        </div>
                    </div>
                    <div class="des">
                        <div class="tit">质量不错，灵敏度高，结构巧妙，款式也好看</div>
                        <div style="margin: 10px 0">
                            <img src="./images/detail1.png" width="79" height="79" style="border-radius: 3px;"/>
                            <img src="./images/detail2.png" width="79" height="79" style="border-radius: 3px;"/>
                        </div>
                        <div class="font">
                            购买时间：2021-5-02 黑色，公开版，1件
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="content">
          <#list images! as img>
              <img src="${img}" width="100%" alt="">
          </#list>
        </div>
    </div>
    <footer>
        <div class="collection">
            <span><img src="./images/shoucang.png" width="21" alt=""></span>
            <span>收藏</span>
        </div>
        <button class="login-btn" value="立即购买">立即购买</button>
        <button class="login-btn-loading disabled" disabled="disabled">抢购中...</button>
        <button class="login-btn-disabled" value="立即购买" style="background: #92949C;" disabled="disabled">立即购买</button>
        <!-- <button v-if="isbegin!=1" value="立即购买" class="" style="background: #92949C;" disabled="disabled">立即购买</button> -->
    </footer>
</div>
<!-- 引入组件库 -->
<script type="text/javascript" src="./js/jquery-3.6.0.min.js"></script><!-- axios交互-->
<script type="text/javascript" src="./js/axios.js"></script><!-- axios交互-->
<script src="./js/layer_mobile/layer.js"></script>
<script>
    // 商品id
    var id = '${sku.id}';
    // 登录token
    var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIwYTZmYzcwNC0yZGI3LTRjZDEtOTNkMi1iNTMyNmE3MzE5MDQiLCJpYXQiOjE2MjE5Mjg4NjAsImlzcyI6IjBhNmZjNzA0LTJkYjctNGNkMS05M2QyLWI1MzI2YTczMTkwNCIsInN1YiI6IjBhNmZjNzA0LTJkYjctNGNkMS05M2QyLWI1MzI2YTczMTkwNCIsInBob25lIjoiMTM2MTExMTIyMjIiLCJuYW1lIjpudWxsLCJ1c2VybmFtZSI6Iml0aGVpbWEiLCJleHAiOjE2MjIwMTUyNjB9.4Cgfp7NCnYlRknKVdpwUAiX0dmYS5rphw6-kazwksbo'
    // websocketUrl
    var websocketUrl = 'ws://39.103.145.66:28082/ws/itheima'
    // 下单url
    var addOrderUrl = '/lua/order/add?id=' + id
</script>
<script src="./js/index.js"></script>
</body>

</html>
```

2\)Feign调用

在`seckill-page-api`中创建`com.seckill.page.feign.SkuPageFeign`实现调用，代码如下：

```java
@FeignClient(value = "seckill-page")
public interface SkuPageFeign {
    
    /**
     * 静态页生成
     */
    @GetMapping(value = "/page/html/{id}")
    Result html(@PathVariable(value = "id") String id) throws Exception;
}
```

### 4.4 静态页删除

&#x20;       当商品变成普通商品或者商品售罄的时候，需要删除详情页，因此还需要实现一个根据id删除详情页的方法。

在`seckill-page`中创建`com.seckill.page.service.SkuPageService`,添加删除静态页方法，代码如下：

```java
/**
 * 删除静态页
 * @param id
 * @param htmlPath
 */
void delItemPage(String id,String htmlPath);
```

在`seckill-page`中创建`com.seckill.page.service.impl.SkuPageServiceImpl`,添加删除静态页方法，代码如下：

```java
/**
 * 删除静态页
 * @param id
 * @param htmlPath
 */
@Override
public void delItemPage(String id, String htmlPath) {
    File file = new File(htmlPath,id+".html");
    if(file.exists()){
        file.delete();
    }
}
```

在`seckill-page`中创建`com.seckill.page.controller.SkuPageController`,添加删除静态页方法，代码如下：

```java
/**
 * 删除商品详情静态页
 */
@DeleteMapping(value = "/html/{id}")
public Result delHtml(@PathVariable(value = "id")String id) throws Exception {
    //删除静态页
    skuPageService.delItemPage(id,htmlPath);
    return new Result(true, StatusCode.OK,"删除成功！");
}
```

2\)Feign调用

在`seckill-page-api`中创建`com.seckill.page.feign.SkuPageFeign`实现调用，代码如下：

```java
/**
 * 删除商品详情静态页
 */
@DeleteMapping(value = "/page/html/{id}")
Result delHtml(@PathVariable(value = "id")String id) throws Exception;
```

## 5 静态页发布

秒杀商品详情页是静态网页，我们可以使用Nginx直接发布。

在这里使用OpenRestry，里面包含有Nginx，可以直接使用。

### 5.1 OpenRestry安装

如果因为本地计算机的内存不够，不能使用本地虚拟机而使用云服务器，最好还是把OpenRestry放在本地。

也就是说，**除了OpenRestry以外的服务都可以安装到云服务器上，OpenRestry需要安装到本地虚拟机中**。后面在进行秒杀抢单的时候，需要进行Nginx转发，OpenRestry在本地更方便配置。

安装OpenRestry：

```bash
# 安装环境
yum -y install pcre-devel openssl-devel gcc curl

# 上传openresty-1.11.2.5.tar.gz

# 解压
tar -xf openresty-1.11.2.5.tar.gz

# 进入到解压目录
cd openresty-1.11.2.5

# 安装
./configure --prefix=/usr/local/openresty \
--with-luajit \
--without-http_redis2_module \
--with-http_stub_status_module \
--with-http_v2_module \
--with-http_gzip_static_module \
--with-http_sub_module

# 编译
make
#安装
make install
```

配置环境变量：

```bash
# 修改环境文件
vi /etc/profile

# 修改为以下内容
export JAVA_HOME=/usr/local/jdk8
export OPENRESTY_HOME=/usr/local/openresty/nginx
export PATH=$JAVA_HOME/bin:$OPENRESTY_HOME/sbin:$PATH

# 使环境文件生效
source /etc/profile
```

### 5.2 详情页发布

&#x20;       商品详情页生成后会存储在指定的位置(seckill-page的yml配置文件中设置)，我们现在使用服务器的`/usr/local/server/web/items`目录进行存放。详情页是静态网页，我们可以使用Nginx直接发布。

创建存放详情页html的目录：

```bash
# 创建目录
mkdir -p /usr/local/server/web/items

# 把生成的静态页上传到目录中(真正上线是直接把静态页面生成到该目录)

# 修改Nginx配置文件
vi /usr/local/openresty/nginx/conf/nginx.conf

# 在配置文件中添加以下内容:
        location /items/ {
            root   /usr/local/server/web/;
        }
```

修改效果如下：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1586746890591.png)

访问测试：

```bash
# 启动Nginx(只能启动一次，启动命令第二次执行会报错)
nginx

# 重载Nginx(重新加载最新的配置，相当于重启nginx)
nginx -s reload
```

访问测试：<http://192.168.200.188/items/S1235433012716498944.html>

### 5.3 CDN加速

我们发现，页面中的所有静态资源(js、css、图片等)，都是由自己的服务器提供的。但是这些静态资源几乎不会修改，而且放在自己的服务器上，会占用自己服务器的网络资源，增加Nginx的压力。

我们可以使用CDN对静态资源进行加速。

**CDN工作原理**

内容分发网络（Content Delivery Network，简称CDN）是建立并覆盖在承载网之上，由分布在不同区域的边缘节点服务器群组成的分布式网络。

CDN应用广泛，支持多种行业、多种场景内容加速，例如：图片小文件、大文件下载、视音频点播、直播流媒体、全站加速、安全加速。

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/v2-5ba76e77f05b030b5879177bd336928f_720w.jpg)

**使用CDN加速**

在这里我们使用七牛云的CDN加速服务，那么首先需要注册七牛云账户，然后再申请一个存储空间。

访问https://portal.qiniu.com/kodo/bucket，新建空间

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20210528155903884.png)

空间创建成功后，会分配一个临时域名

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20210528155949471.png)

这个域名30天有效，如果需要长期有效，需要自己准备备案域名，并且按要求进行域名解析配置

配置参考：https://developer.qiniu.com/kodo/kb/5859/domain-name-to-access-the-storage-space

我们在学习阶段就不用考虑自己准备域名了，毕竟30天足够我们使用了

有了空间只有，就可以把css、js、图片等静态资源上传到空间中

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20210528160753321.png)

然后在把模板中的静态资源请求地址全部换为CDN加速的地址

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20210531235732017.png)

修改代码，使用新的模板

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20210820154449502.png)

商品详情页动静分离小结：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20210528164410888.png)

# 第2章 