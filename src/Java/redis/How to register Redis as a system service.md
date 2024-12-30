---
order: 1
author: 
title: "如何把Redis注册为系统服务？"
category:
  - Redis

---

```sh
# 安装为服务
redis-server --service-install redis.windows.conf
# 启动服务
redis-server --service-start 
# 停止服务
redis-server --service-stop
# 卸载服务
redis-server --service-uninstall
```


