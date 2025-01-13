---
order: 2
author: 
title: "琐碎知识点！"
category:
  - 学成在线
  - 项目
  - 琐碎


---

### 1. @TableField

```java
@TableField(fill = FieldFill.INSERT)
private LocalDateTime createDate;

@TableField(fill = FieldFill.INSERT_UPDATE)
private LocalDateTime changeDate;
```

`@TableField(fill = FieldFill.INSERT)`：表示 `createDate` 字段在插入（`INSERT`）时会自动填充。也就是说，当执行插入操作时，MyBatis-Plus 会自动填充该字段的值，通常是当前的时间（`LocalDateTime.now()`），而不需要手动设置这个字段的值。

`@TableField(fill = FieldFill.INSERT_UPDATE)`：表示在插入和更新时都填充。

### 2.MyBatis-Plus主键返回

代码中有一段这样的：

```java
int insert = courseBaseMapper.insert(courseBaseNew);
Long courseId = courseBaseNew.getId();
```

刚插进去就可以获取到id，这是因为专门在实体类的主键字段上使用了 `@TableId` 注解来指定主键策略。

- 如果你的表主键是自增的（如 MySQL 的 `AUTO_INCREMENT`），MyBatis-Plus 会自动将生成的主键值回填到实体类的主键字段中。
- 如果你的主键策略是其他类型（如 UUID、雪花算法等），MyBatis-Plus 也会自动处理==主键生成==和==回填==。

### 3.  系统如何处理异常？

我们自定义一个统一的异常处理器去捕获并处理异常。
使用控制器增加注解`@ControllerAdvice`和异常处理注解`@ExceptionHandler`来实现。

- 处理自定义异常
  程序在编写代码时根据校验结果主动抛出自定义异常类对象，抛出异常时指定详细的异常信息，异常处理器捕获异
  常信息记录异常日志并响应给用户。
- 处理未知异常
  接口执行过程中的一些运行时异常也会由异常处理器统一捕获，记录异常日志，统一响应给用户500错误。
  在异常处理器中还可以针对某个异常类型进行单独处理。