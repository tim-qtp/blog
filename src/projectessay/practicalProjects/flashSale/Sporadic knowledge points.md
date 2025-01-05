---
order: 2
author: 
title: "琐碎知识点！"
category:
  - 秒杀系统
  - 项目
  - 琐碎

---

### 1、去掉请求路径的前缀

```yaml
spring:
  cloud:
    gateway:
      routes:
        # 商品服务路由
        - id: goods_route
          uri: lb://seckill-goods
          predicates:
          - Path=/api/skuAct/**,/api/activity/**,/api/brand/**,/api/category/**,/api/seckillTime/**,/api/sku/**
          filters:
          - StripPrefix=1
```

`filters`: 过滤器链，这里使用 `StripPrefix=1` 过滤器来去掉请求路径的前缀。`StripPrefix=1` 意味着去掉请求路径中的第一个部分，防止在转发请求时带有不必要的前缀。

### 2、management 配置

```yaml
management:
  endpoint:
    gateway:
      enabled: true
    web:
      exposure:
        include: '*'
```

**`management.endpoint.gateway.enabled: true`**: 启用 Spring Boot Actuator 的网关相关端点，允许通过管理端点监控网关的运行状态。

**`management.endpoint.web.exposure.include: '\*'`**: 暴露所有 Web 相关的管理端点，包括 `health`、`info` 等，以便进行健康检查和其他管理任务。

### 3、logging配置

```yaml
logging:
  pattern:
    console: "%msg%n"
```

**`console`**: #定义日志控制台输出的格式，这里仅输出消息体内容 `%msg` 和换行符 `%n`。

### 4、设置时区

```yaml
spring:
  jackson:
    #设置全局的 JSON 时间序列化时区为东八区（中国标准时间）。
    time-zone: GMT+8
```

### 5、设置Bean

```yaml
spring:
  main:
    #允许多个同名 Bean 定义覆盖，避免 Bean 冲突报错。
    allow-bean-definition-overriding: true
```

### 6、在IntelliJ IDEA中，快速找到控制类（Controller类）中所有的方法

Alt + 7，Ctrl + F12

### 7、为什么要用Feign呢？

为了实现不同微服务进行远程调用

`seckill-search`的ES索引导入调用`seckill-goods`的`list`接口。

```java
//1、seckill-search
List<Sku> skus = skuFeign.list(page, size);
//2、seckill-feign-api page和size传到地址参数里
@GetMapping(value = "/sku/list/{page}/{size}")
List<Sku> list(@PathVariable(value = "page") Integer page, @PathVariable(value = "size") Integer size);
//3、seckill-goods
@GetMapping(value = "/list/{page}/{size}" )
public List<Sku> list(@PathVariable  int page, @PathVariable  int size){
    //调用SkuService实现分页条件查询Sku
    List<Sku> skus = skuService.list(page, size);
    return skus;
}
```

### 8、计算总页数

正好除尽，就`/`，不正好，那就再加个`1`

```java
//2.根据总记录数计算总页数
int totalpages = total % size == 0 ? total / size : (total / size) + 1;
```

### 9、将Sku数据转换成SkuInfo

先将`skus`List转化为json字符串，再将字符串转成SkuInfo

```java
List<Sku> skus = skuFeign.list(page, size);
List<SkuInfo> skuInfos = JSON.parseArray(JSON.toJSONString(skus), SkuInfo.class);
```

### 10、ES为什么频繁刷新（默认1秒）会出问题？

**打个比方：**

- 假设你开一家超市，页面不停地出现新的订单，但是每出现一行，你就立刻把这笔写到账本上（磁盘）。
- 账本每次写字都需要翻页、找位置，还要仔细抄写好（写段文件）。
- **结果**：你刚写完一两笔就去翻账本了，账本来回折腾，效率很低。

**ES 频繁刷新的问题也类似：**

- **频繁生成小文件**：每次只刷一小撮数据，磁盘被迫不停写文件，效率很低。
- **段合并压力大**：段文件多了，ES 会把这些小文件合并成大文件（段合并），合并过程特别费劲，==抢了大量 CPU== 和==磁盘资源==。
- **资源争夺**：写入的同时还要刷新，两边都需要磁盘和CPU，最后谁都干不好。

**那适当延长刷新间隔怎么解决问题？**

**再打个比方：**

- 你可以每天晚上一次性把当天的所有开销写到账本上，这样只翻一次账本，效率就高很多。

**ES 延长刷新间隔也是类似的思路：**

- **数据在内存里多积累一会儿**：一次性写更多数据到磁盘，这样减少了小文件的生成，磁盘压力更小。
- **减少段合并频率**：一次性写入大文件，小文件变少，段合并的次数也少了。
- **资源利用更高效**：写入和刷新分开安排时间，避免两者抢磁盘和 CPU。

**总结为什么“写入和刷新”会争夺资源**

- 写入数据到内存时，不是直接完成后就结束了，它还涉及到倒排索引的创建和更新，这需要 CPU 参与。
- 刷新数据到磁盘时，不仅仅是“写磁盘”，它还要进行段文件的创建、索引的（优化）持久化、段合并等复杂操作，这些操作都需要 CPU 和磁盘 I/O。
- 刷新过程会触发数据的**同步操作**，需要占用一部分 CPU 和磁盘资源。
- 如果刷新频繁，写入和刷新就会相互竞争 ==CPU== 和磁盘资源，==导致写入性能下降==。

### 11、`for` 循环与 `countDownLatch.countDown()` 是否会冲突？

```java
for (int i = 0; i < totalpages; i++) {
    pool.execute(() -> {
        List<Sku> skus = skuFeign.list(page.getAndIncrement(), size);

        // 数据转换和批量导入
        BulkRequest bulkRequest = new BulkRequest();
        for (SkuInfo skuInfo : skuInfos) {
            // 将数据添加到 bulkRequest
        }

        try {
            restHighLevelClient.bulk(bulkRequest, RequestOptions.DEFAULT);
        } catch (IOException e) {
            e.printStackTrace();
        }
        countDownLatch.countDown();  // 每个线程完成后减一
    });
}
```

==不会冲突==

#### **1. `for` 循环的作用**

最外层的 `for (int i = 0; i < totalpages; i++)` 循环用于启动 `totalpages` 个并发任务。对于每一页数据，都会启动一个新的线程来执行分页查询和数据导入操作。

- **每次迭代** 都会通过 `pool.execute()` 提交一个新任务到线程池中。
- 每个任务会从 `AtomicInteger page` 中获取当前页码并进行分页查询。

#### **2. `countDownLatch.countDown()` 的作用**

- `CountDownLatch` 用于等待所有分页查询任务完成后才继续执行。
- 每个线程在完成分页查询和批量导入任务后，会调用 `countDownLatch.countDown()` 来减少闭锁的计数。
- **主线程通过 `await()` 阻塞，直到所有线程都完成后，才继续执行后续操作。**

**3. 不会发生冲突的原因**

 `for`循环和`countDownLatch.countDown()`

 本质上是分别执行的两部分逻辑：

- `for` 循环负责启动并发任务。
- `countDownLatch.countDown()` 在每个线程完成任务后执行，用于通知主线程某个分页查询任务已经完成。



如果使用普通的 `int` 类型，多个线程同时读取和修改页码时，会出现数据不一致问题（例如两个线程同时读取相同的值，导致页码被重复使用或丢失）。

> `AtomicInteger` 提供原子操作方法（如 `getAndIncrement()`），保证了页码更新的线程安全。
>
> `volatile` 确保了变量对所有线程的可见性，使得每个线程读取到的是最新的值。

`AtomicInteger` 的操作是原子性的，不需要显式加锁即可确保线程安全。



### 12、Nginx有啥好处

速度快，高并发，高可靠，内存消耗少，高扩展性

应用：反向代理+文件服务+静态资源+负载均衡+Tomcat

### 13、什么情况会造成索引失效

1. 条件有or,部分条件没有索引
2. 复合索引未用左列字段
3. like以%开头
4. 需要类型转换
5. where中索引l列有运算
6. where中索列使用了函数
7. 加索引的列，数据重复率较高

### 14、binlog-format=ROW有啥用

`binlog-format=ROW` 表示 **二进制日志记录的格式为行级别（ROW）**，即**记录每一行数据的具体变化**，而不是记录 SQL 语句（STATEMENT 格式）或混合（MIXED 格式）

#### `ROW` 的作用

当 `binlog-format=ROW` 启用时：

1. 记录每一行实际的变化数据：
   - INSERT 操作记录的是新增的每一行。
   - UPDATE 操作记录的是被修改的每一行的 **旧值和新值**。
   - DELETE 操作记录的是被删除的每一行。
2. 精准反映数据变化：
   - 能清晰记录数据的变化细节，特别适合 **实时同步、数据监控和恢复场景**。

------

#### `ROW` 的具体例子

#### 假设有一张表：

```sql
sql复制代码CREATE TABLE products (
    id INT PRIMARY KEY,
    name VARCHAR(50),
    price DECIMAL(10, 2)
);
```

#### **1. INSERT 操作：**

执行的 SQL：

```sql
sql


复制代码
INSERT INTO products (id, name, price) VALUES (1, 'Laptop', 5000.00);
```

**`binlog-format=ROW` 中记录的内容：**

- 记录的是插入的具体数据：

```sql
plaintext


复制代码
INSERT INTO products VALUES (1, 'Laptop', 5000.00);
```

**解释：**

- 它会直接把 `id=1, name='Laptop', price=5000.00` 的数据记录到 binlog 中，精准反映插入操作。

------

#### **2. UPDATE 操作：**

执行的 SQL：

```sql
sql


复制代码
UPDATE products SET price = 5500.00 WHERE id = 1;
```

**`binlog-format=ROW` 中记录的内容：**

- 记录的是更新前后的数据变化：

```sql
plaintext复制代码BEFORE: (1, 'Laptop', 5000.00)
AFTER:  (1, 'Laptop', 5500.00)
```

**解释：**

- 它会清楚记录该行的旧值和新值，确保数据的正确性。
- 如果是多个行的更新，它会记录每一行的变化。

------

#### **3. DELETE 操作：**

执行的 SQL：

```sql
sql


复制代码
DELETE FROM products WHERE id = 1;
```

**`binlog-format=ROW` 中记录的内容：**

- 记录的是被删除行的具体内容：

```sql
plaintext


复制代码
DELETED: (1, 'Laptop', 5500.00)
```

**解释：**

- 会完整记录删除的这一行数据，便于数据恢复和同步。

### 15、根据模板名字获取模板对象

```java
Template template = configuration.getTemplate(templateName);
```

这里根据templateName去resources下的templates去获取test.ftl模板文件。

```java
//模板处理，获取生成的html文件字符串
String content = FreeMarkerTemplateUtils.processTemplateIntoString(template, dataMap);

//生成文件
FileUtils.writeStringToFile(new File(path, fileName), content);
```

