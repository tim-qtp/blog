---

order: 1
author: 
title: "@EnableAspectJAutoProxy"
category:
  - SpringBoot
  - 注解
  - AOP
  - 智能协同云图库
---

## 🍂 智能协同云图库


#### @EnableAspectJAutoProxy(exposeProxy = true)有什么用？

它是启用基于AspectJ的 AOP 功能的意思,它会告诉 Spring 使用代理来处理带有 AOP 注解的类。
 * 默认情况下，Spring 创建的代理对象是不可直接访问的，因为它是在 Spring 容器中管理的对象。
 * 通过设置 exposeProxy = true，你可以在代码中访问到代理对象，
 * 从而使得你能够在某些特殊情况下获取和操作代理对象。


举个例子：

我们有一个业务类 **`UserService`**，里面有两个方法：

1. `createUser()`：创建用户，同时调用 `sendNotification()` 方法。
2. `sendNotification()`：发送通知。

假设我们有一个切面（`LoggingAspect`）用来记录方法调用日志。

**重点问题**：
如果我们在 `createUser()` 方法内部直接调用 `sendNotification()`，默认情况下 Spring AOP 不会拦截这个调用（因为内部方法调用不会经过代理对象）。
通过 `exposeProxy = true` 和 `AopContext.currentProxy()`，我们可以在内部方法调用中获取代理对象，从而让切面正常工作。

### 1. **项目结构**

```less
src/main/java
  ├── AppConfig.java              // Spring 配置类
  ├── UserService.java            // 业务类
  ├── LoggingAspect.java          // 切面类
  └── MainApp.java                // 启动类
```

### 2. **代码实现**

#### 2.1 **Spring 配置类（启用 AOP 并暴露代理对象）**

```java
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

@Configuration
@ComponentScan("com.example")  // 扫描当前包下的组件
@EnableAspectJAutoProxy(exposeProxy = true)  // 启用 AOP，并暴露代理对象
public class AppConfig {
}
```

#### 2.2 **业务类（UserService）**

在 `createUser()` 方法中，我们通过 `AopContext.currentProxy()` 获取代理对象并调用 `sendNotification()`，从而触发切面增强。



```java
import org.springframework.aop.framework.AopContext;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    public void createUser() {
        System.out.println("正在创建用户...");

        // 直接调用当前类的另一个方法
        System.out.println("直接调用 sendNotification() 方法：");
        sendNotification();  // 直接调用，不会触发切面

        System.out.println("\n通过代理调用 sendNotification() 方法：");
        // 获取当前代理对象并调用方法
        UserService proxy = (UserService) AopContext.currentProxy();
        proxy.sendNotification();  // 通过代理调用，会触发切面
    }

    public void sendNotification() {
        System.out.println("正在发送通知...");
    }
}
```
#### 2.3 **切面类（LoggingAspect）**

切面会在 `UserService` 的方法执行前后记录日志。

```java
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.After;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class LoggingAspect {

    @Before("execution(* com.qtp.picture.UserService.*(..))")
    public void logBefore() {
        System.out.println("[日志] 方法执行开始。");
    }

    @After("execution(* com.qtp.picture.UserService.*(..))")
    public void logAfter() {
        System.out.println("[日志] 方法执行结束。");
    }
}
```

#### 2.4 **启动类（MainApp）**

启动 Spring 容器，获取 `UserService` 并调用方法。

```java
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class MainApp {

    public static void main(String[] args) {
        // 加载 Spring 容器
        ApplicationContext context = new AnnotationConfigApplicationContext(AppConfig.class);

        // 获取 UserService Bean
        UserService userService = context.getBean(UserService.class);

        // 调用 createUser() 方法
        userService.createUser();
    }
}
```

### 3. **执行输出**

运行 `MainApp`，输出结果如下：

```scss
正在创建用户...
直接调用 sendNotification() 方法：
正在发送通知...

通过代理调用 sendNotification() 方法：
[日志] 方法执行开始。
正在发送通知...
[日志] 方法执行结束。
```

### 4. **总结**

- **实际用途**：在业务逻辑复杂、需要触发切面增强的内部方法调用时，这是非常有用的。通过 `exposeProxy = true` 暴露代理对象，然后使用 `AopContext.currentProxy()` 获取当前代理对象，这样调用方法时就能触发切面逻辑。

![image-20241219135342304](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241219135342304.png)

