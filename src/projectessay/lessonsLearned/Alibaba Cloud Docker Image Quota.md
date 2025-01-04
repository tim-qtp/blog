---
order: 3
author: 
title: "阿里云docker镜像限额"
category:
  - Docker
  - 阿里云
  - 镜像


---

现在是1月1日，今天从阿里云docker镜像下载时，发现根本拉不下来，很慢！

只能用其他节点代替，查阅官网才得知，个人用户从9月起便开始限额了，而且服务器地址也必须和云服务器地址选同一个区域

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20250101163629421.png)

我的ECS服务器地址是华北，而镜像实例地址却是华东

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20250101163825369.png)

![image-20250101163959878](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20250101163959878.png)

所以可能出现变慢情况

而且你会发现，腾讯云服务器配置阿里云的加速镜像完全不管用

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20250101164310492.png)

所以，如果你一天内没有拉取很多次镜像，你直接用阿里云镜像就可以！