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















