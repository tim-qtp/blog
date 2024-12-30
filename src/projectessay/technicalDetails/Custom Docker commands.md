---
order: 2
author: 
title: "自定义Docker命令"
category:
  - docker
  - 自定义
  - 神领物流
---

## 🍂神领物流

![dps](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241227213510157.png)

通过dps命令可以查询上述列表，dps是自定义命令。

自定义命令方法如下：

```shell
vim ~/.bashrc

#增加如下内容
alias dps='docker ps --format "table{{.ID}}\t{{.Names}}\t{{.Status}}\t{{.Ports}}"'
#保存退出

#生效
source ~/.bashrc
```

看起来更简洁一些。