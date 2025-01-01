---
order: 3
author: 
title: "docker启动redis密码问题"
category:
  - Docker
  - Redis

---

当你docker启动redis时，如果没有加

```bash
--requirepass zgfD4T8h1KjV \
```

这一行

你会发现Redis连接工具新建连接的时候，加不加密码都可以进去。	



