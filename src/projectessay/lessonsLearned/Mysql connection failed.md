---
order: 8
author: 
title: "Mysql连接失效"
category:
  - 粗心
  - 迷！



---

报错信息为

```sh
HikariPool-1 - Failed to validate connection com.mysql.cj.jdbc.ConnectionImpl@23513b4a (No operations allowed after connection closed.). Possibly consider using a shorter maxLifetime value.
```

解决方法：

```yaml
spring:
  datasource:
    hikari:
      max-lifetime: 550000 # 单位是毫秒（550 秒）
```

