---
order: 5
author: 
title: "ik分词器扩展字典不生效"
category:
  - ES
  - 分词器
  - 不生效


---

## 真是被自己气笑了！

很奇怪，明明配置了，为什么一直不生效啊

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20250102161517858.png)

我自己是这么配的：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20250102161750795.png)

正确是啥呢:sweat_smile:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE properties SYSTEM "http://java.sun.com/dtd/properties.dtd">
<properties>
        <comment>IK Analyzer 扩展配置</comment>
        <!--用户可以在这里配置自己的扩展字典-->
        <entry key="ext_dict">ext.dic</entry>
         <!--用户可以在这里配置自己的扩展停止词字典  *** 添加停用词词典-->
        <entry key="ext_stopwords">stopword.dic</entry>
</properties>
```

