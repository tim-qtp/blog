---
order: 1
author: 
title: "jdk8和17中VM加载并初始化类的参数不同"
category:
  - JDK8
  - JDK17
  - AVM

---

### JDK8中：

```livescript
-XX:+TraceClassLoading 
```

### JDK17中：

```livescript
-verbose:class
```

