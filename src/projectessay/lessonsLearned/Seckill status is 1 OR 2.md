---
order: 7
author: 
title: "秒杀同步于ES状态是2的才往里插"
category:
  - 粗心
  - 迷！


---

本来要实现的功能是利用`canal`监听`binlog`，实现`ES`索引库同步插入，先不说监听，就是正常往ES里导入全部数据现在也查不到了

结果，逻辑代码是状态为2（参与秒杀）的才参与构建索引，我在数据库里复制的全是状态为1（不参与秒杀）的

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20250105000339661.png)

几十个才出现一个，我复制的可不都是1的嘛！

下面这一段代码也没有注释掉！

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20250105000858364.png)

现在再试试：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20250105001741283.png)

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20250105001823538.png)

解决！