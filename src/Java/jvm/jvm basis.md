---

order: 1
author: 
title: "JVM基础概念"
category:
  - JVM
  - java虚拟机
---

## JVM的功能？

- 1 - 解释和运行
- 2 - 内存管理
- 3 - 即时编译

## JAVA为什么需要实时解释？

C,C++：main.c ☛ main.exe(机器码)

JAVA：main.java ☛ <span style="color: red;">.class字节码指令</span> ☛ 机器码

java需要实时解释，**主要是为了支持跨平台特性**。

![跨平台](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241224120013253.png)

字节码指令交给不同平台的JVM。

## 字节码文件的组成？

![jclasslib](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241224133958360.png)

## Magic魔数？

每个Java字节码文件的前四个字节是固定的，用16进制表示就是0xcafebabe。文件是无法通过文件扩展名来确定文件类型的，文件扩展名可以随意修改不影响文件的内容。软件会使用文件的头几个字节（文件头）去校验文件的类型，如果软件不支持该种类型就会出错。

比如常见的文件格式校验方式如下：

![魔数](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241224223116673.png)

Java字节码文件中，将文件头称为magic魔数。Java虚拟机会校验字节码文件的前四个字节是不是0xcafebabe，来保证加载的确实是字节码文件。

## 主副版本号

1.2之后大版本号计算方法就是：主版本号 – 44，比如主版本号52就是JDK8。

比如出现如下错误：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241224134832430.png)

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241224135249775.png)

该字节码文件的版本号是jdk8，但运行时环境是jdk6，较低的运行时环境去运行较高的jdk版本，导致出错。

有两种方案：

1.升级JDK版本

2.将第三方依赖的版本号降低或者更换依赖（8的依赖改为6的依赖），以满足JDK版本的要求。  <span style="color: red;">√ 建议使用这种方案</span>

## 为什么要用字符串string去找info字面量？

可不可以直接通过字段去找到字面量呢 <span style="color: red;">✘</span>

<img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241224142309506.png" alt="image-20241224142309506" style="zoom:67%;" />

肯定不行，该字节码文件被解析并加载后，需要把String_info类型的常量池中的内容加载到java字符串常量池中，所以必须保留一个类型是String类型。

而且为了更省空间，`字段名`和`字符串内容`一样时，abc的名字索引直接引用到字面量utf8_info

```java
public class Main {
    public static final String a1 = "abc";
    public static final String a2 = "abc";
    public static final String abc = "abc";
    public static void main(String[] args) {
        Main main = new Main();
    }
}
```

这是abc的描述信息，名字直接为`14`

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241224151312224.png)

相比较，这是`a1`的`描述信息`及`常量信息`

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241224151451079.png)![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241224151506321.png)

## 为什么i=i++还是0？

<img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241224160134524.png" alt="i++" style="zoom:33%;" />

因为`iinc 1 by 1`是在局部变量数组表中进行的，不是在操作数栈中进行的，i++ 先把0取出来放入临时的操作数栈中，接下来对`i`进行加1，`i`变成了1，最后再将之前保存的临时值0放入i，最后就变成了0。



<img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241224160512490.png" alt="++i" style="zoom: 50%;" />

而++i就比较`规矩`了，load和iinc调换顺序，自增完以后还要`存回操作数`中。

## 字节码常用工具？

- javap：`输入javap -v 字节码文件名称 查看具体的字节码信息。（如果jar包需要先使用 jar –xvf 命令解压）`
- jclasslib：`也有Idea插件版本`
- Arthas

> Arthas 是一款线上监控诊断产品，通过全局视角实时查看应用 load、内存、gc、线程的状态信息，并能在不修改应用代码的情况下，对业务问题进行诊断，大大提升线上问题排查效率。
>
> 官网：https://arthas.aliyun.com/doc/

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image%20(12).png)

**安装方法：**

1、将 资料/工具/arthas-boot.jar 文件复制到任意工作目录。

2、使用`java -jar arthas-boot.jar ` 启动程序。

3、输入需要Arthas监控的进程id。

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241225094215196.png)

4、输入命令即可使用。

使用举例：

```
dump 类的全限定名：dump已加载类的字节码文件到特定目录。
jad 类的全限定名： 反编译已加载类的源码。（小李怀疑是因为没有把最新的字节码文件部署到服务器上）
```



## 类的生命周期？

![类的生命周期](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image%20(1).png)

## 加载阶段？

类加载器在加载完类之后，Java虚拟机会将字节码中的信息保存到方法区中，方法区中生成一个`InstanceKlass`对象，保存类的所有信息，里边还包含实现特定功能比如多态的信息。

<div align="center"><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image%20(2).png"  style="zoom:70%;" /></div>

Java虚拟机同时会在堆上生成与方法区中数据类似的`java.lang.Class`对象，作用是在Java代码中去获取类的信息以及存储静态字段的数据（`JDK8`及之后）。

<center><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image%20(3).png"  style="zoom:70%;" /></center>

> 为了安全考虑，对于开发者来说，只需要访问堆中的Class对象而不需要访问方法区中所有信息。
>
> 这样Java虚拟机就能很好地控制开发者访问数据的范围。

<center><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241224211356474.png" style="zoom: 60%;" /></center>

## 连接阶段？

- 验证，验证内容是否满足《Java虚拟机规范》。
- 准备，给静态变量赋初值。
- 解析，将常量池中的符号引用替换成指向内存的直接引用。

### 1、验证

1、文件格式验证，比如文件是否以0xCAFEBABE开头，主次版本号是否满足当前Java虚拟机版本要求。

<img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241224214046069.png" alt="字节码文件" style="zoom: 33%;" />

2、元信息验证，例如类必须有父类（super不能为空）。

<img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241224214414031.png" style="zoom:67%;" />

3、验证程序执行指令的语义，比如方法内的指令执行中跳转到不正确的位置。

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241224214553834.png)

> 跳转到2可以，15就不行！

4、符号引用验证，例如是否访问了其他类中private的方法等。

对版本号的验证，在JDK8的源码中如下：

```java
return (major >= JAVA_MIN_SUPPORTED_VERSION) && //支持的最低版本号，JDK中常量是45，代表JDK1.0
       (major <= max_version) && //支持的最低版本号,JDK8中是44+8=52，代表JDK8
       ((major != max_version) || //主版本号为52时，副版本号要为0
        (minor <= JAVA_MAX_SUPPORTED_MINOR_VERSION)); //支持的最高副版本号，JDK未使用，为0
```

字节码文件的主版本号不能高于运行环境主版本号，如果主版本号相等，副版本号也不能超过。

### 2、准备

为静态变量（static）分配内存并设置初值，每一种基本数据类型和引用数据类型都有其初值。<span style="color: red;">因为内存有残留，可能不干净！</span>

| **数据类型**     | **初始值**   |
| ---------------- | ------------ |
| **int**          | **0**        |
| **long**         | **0L**       |
| **short**        | **0**        |
| **char**         | **‘\u0000’** |
| **byte**         | **0**        |
| **boolean**      | **false**    |
| **double**       | **0.0**      |
| **引用数据类型** | **null**     |

在准备阶段会为value分配内存并赋初值为0，在初始化阶段才会将值修改为1。

> final修饰的基本数据类型的静态变量，准备阶段直接会将代码中的值进行赋值。
>
> 如下例子中，变量加上final进行修饰，在准备阶段value值就直接变成1了，因为final修饰的变量后续不会发生值的变更。

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image%20(4).png)

来看这个案例：

```Java
public class HsdbDemo {
    public static final int i = 2;
    public static void main(String[] args) throws IOException, InstantiationException, IllegalAccessException {
        HsdbDemo hsdbDemo = new HsdbDemo();
        System.out.println(i);
        System.in.read();
    }
}
```

从字节码文件也可以看到，编译器已经确定了该字段指向了常量池中的常量2：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image%20(5).png)

### 3、解析

解析阶段主要是将常量池中的符号引用替换为直接引用，符号引用就是在字节码文件中使用编号来访问常量池中的内容。

<img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image%20(6).png" style="zoom:50%;" />

直接引用不在使用编号，而是使用内存中地址进行访问具体的数据。

<img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image%20(7).png" style="zoom:50%;" />

## 初始化阶段？

**基本概念**

-  初始化阶段会执行静态代码块中的代码，并为静态变量赋值。
-  初始化阶段会执行字节码文件中`clinit`部分的字节码指令。

```java
public class Demo1 {
    public static int value = 1;
    static {
        value = 2;
    }
    public static void main(String[] args) {

    }
}
```

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241224223751334.png)

> 构造方法  main方法  初始化阶段执行

最后结果为2

如果静态变量和静态代码块颠倒顺序，则结果为1



**以下几种方式会导致类的初始化**

1.访问一个类的静态变量或者静态方法，注意变量是final修饰的并且等号右边是常量不会触发初始化。

2.调用Class.forName(String className)，即使不使用。

3.new一个该类的对象时。

4.执行Main方法的当前类。

添加`-XX:+TraceClassLoading` 参数可以打印出加载并初始化的类

**验证1：**

```java
public class Main {
    public static void main(String[] args) {

        int i = Demo2.i;
        System.out.println(i);
    }
}
class Demo2{
    static {
        System.out.println("初始化了...");
    }
    public static int i = 0;
}
```

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241224231420884.png)

可以看到初始化了并打印了0，且Demo2也被加载（`load`）并初始化（`init`）了

```java
public static final int i = 0;
```

改为final，就没有输出`初始化了`，`Demo2`也没有发现。所以`final`不会触发这个类的初始化阶段。

**验证2：**

```java
public class Main {
    static {
        System.out.println("Main初始化了...");
    }
    public static void main(String[] args) {
        new Demo2();
    }
}
class Demo2{
    static {
        System.out.println("demo2初始化了...");
    }
}

Main初始化了...
demo2初始化了...
```

**面试题1**

如下代码的输出结果是什么？

```java
public class Test1 {
    public static void main(String[] args) {
        System.out.println("A");
        new Test1();
        new Test1();
    }

    public Test1(){
        System.out.println("B");
    }

    {
        System.out.println("C");
    }

    static {
        System.out.println("D");
    }
}
```

DACBCB

clinit不会执行的几种情况

如下几种情况是不会进行初始化指令执行的：

1.无静态代码块且无静态变量赋值语句。

<img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image%20(8).png" style="zoom:33%;" />

2.有静态变量的声明，但是没有赋值语句。

<img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image%20(9).png" alt="image (9)" style="zoom:33%;" />

**面试题2**

如下代码的输出结果是什么？

```java
public class Demo01 {
    public static void main(String[] args) {
        new B02();
        System.out.println(B02.a);
    }
}

class A02{
    static int a = 0;
    static {
        a = 1;
    }
}

class B02 extends A02{
    static {
        a = 2;
    }
}
```

> 分析步骤：
>
> 1、调用new创建对象，需要初始化B02，优先初始化父类。
>
> 2、执行A02的初始化代码，将a赋值为1。
>
> 3、B02初始化，将a赋值为2。
>
> 输出`2`

> ##### 变化
>
> 将new B02() 注释掉会怎么样？
>
> 分析步骤：
>
> 1、访问父类的静态变量，只初始化父类。
>
> 2、执行A02的初始化代码，将a赋值为1。
>
> 输出`1`

**补充练习题**

分析如下代码执行结果:

```java
public class Test2 {
    public static void main(String[] args) {
        Test2_A[] arr = new Test2_A[10];

    }
}

class Test2_A {
    static {
        System.out.println("Test2 A的静态代码块运行");
    }
}
```

<span style="color: red;">✘</span> 数组的创建不会导致数组中元素的类进行初始化。

```java
public class Test4 {
    public static void main(String[] args) {
        System.out.println(Test4_A.a);
    }
}

class Test4_A {
    public static final int a = Integer.valueOf(1);

    static {
        System.out.println("Test3 A的静态代码块运行");
    }
}
```

<span style="color: red;">✔</span> final修饰的变量如果赋值的内容需要执行指令才能得出结果，会执行clinit方法进行初始化。

## Tomcat为什么要自定义类加载器？

为了进行类的隔离，如果Tomcat直接使用AppClassLoader类加载类，那就会出现如下情况:

1. 应用A中有一个com.zhouyu.Hello.class
2. 应用B中也有一个com.zhouyu.Hello.class
3. 虽然都叫做Hello，但是具体的方法、属性可能不一样
4. 如果AppClassLoader先加载了应用A中的Hello.class→
5. 那么应用B中的Hello.class就不可能再被加载了，因为名字是一样
6. 如果就需要针对应用A和应用B设置各自单独的类加载器，也就是WebappClassLoader
7. 这样两个应用中的Hello.class都能被各自的类加载器所加载，不会冲突
8. 这就是Tomcat为什么用自定义类加载器的核心原因，为了实现类加载的隔离
9. <span style="color: red;">JVM中判断一个类是不是已经被加载的逻辑是：类名+对应的类加载器实例。</span>

## 运行时数据区由哪些部分构成？

![jvm结构](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241224112645303.png)

![运行时数据区](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241224112947297.png)

方法区和堆是多个线程共享的。

## 程序计数器

PC Register，程序计数寄存器，简称为程序计数器：

1. 是物理寄存器的抽象实现
2. 用来记录待执行的下一条指令的地址
3. 它是程序控制流的指示器，循环、if else、异常处理、线程恢复等都依赖它来完成
4. 解释器工作时就是通过它来获取下一条需要执行的字节码指令的
5. 它是唯一一个在JVM规范中没有规定任何OutOfMemoryError情况的区域

## 类加载器？

![类加载器应用场景](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241225092450482.png)

类加载器分为两类，一类是Java代码中实现的，一类是Java虚拟机底层源码实现的。

- **虚拟机底层实现**：源代码位于Java虚拟机的源码中，实现语言与虚拟机底层语言一致，比如Hotspot使用C++。主要目的是保证Java程序运行中基础类被**正确**地加载，比如`java.lang.String`，Java虚拟机需要确保其可靠性。
- **JDK中默认提供或者自定义**：JDK中默认提供了多种处理不同渠道的类加载器，程序员也可以自己根据需求定制，使用Java语言。所有Java中实现的类加载器都需要继承ClassLoader这个抽象类。

类加载器的设计JDK8和8之后的版本差别较大，首先来看JDK8及之前的版本，这些版本中默认的类加载器有如下几种：

![JDK8及之前版本](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image%20(10).png)

类加载器的详细信息可以通过Arthas的classloader命令查看：

> `classloader` - 查看 classloader 的继承树，urls，类加载信息，使用 classloader 去 getResource

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image%20(11).png)

- BootstrapClassLoader是启动类加载器，numberOfInstances是类加载器的数量只有1个，loadedCountTotal是加载类的数量1861个。
- ExtClassLoader是扩展类加载器
- AppClassLoader是应用程序类加载器

### **1、启动类加载器**

- 启动类加载器（Bootstrap ClassLoader）是由Hotspot虚拟机提供的、使用C++编写的类加载器。
- 默认加载Java安装目录/jre/lib下的类文件，比如rt.jar(==最核心==)，tools.jar，resources.jar等。

```Java
/**
 * 启动程序类加载器案例
 */
public class BootstrapClassLoaderDemo {
    public static void main(String[] args) throws IOException {
        ClassLoader classLoader = String.class.getClassLoader();
        System.out.println(classLoader);

        System.in.read();
    }
}
```

这段代码通过String类获取到它的类加载器并且打印，结果是`null`。这是因为启动类加载器在JDK8中是由C++语言来编写的，在Java代码中去获取既==不适合也不安全==，所以才返回`null`

在Arthas中可以通过`sc -d 类名`的方式查看加载这个类的类加载器详细的信息，比如：

![Arthas](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241225100433088.png)

通过上图可以看到，java.lang.String类的类加载器是空的，Hash值也是null。



#### 用户扩展基础jar包

如果用户想扩展一些比较基础的jar包，让启动类加载器加载，有两种途径：

- **放入jre/lib下进行扩展**。不推荐，尽可能不要去更改JDK安装目录中的内容，可能因为文件名不符合jdk规范而不匹配的问题，不会正常地被加载。
- **使用参数进行扩展**。推荐，使用-Xbootclasspath/a:jar包目录/jar包名 进行扩展，参数中的/a代表新增。

如下图，在IDEA配置中添加虚拟机参数，就可以加载`D:/jvm/jar/classloader-test.jar`这个jar包了。

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241225101636163.png)

```java
public class Main {
    public static void main(String[] args) throws ClassNotFoundException {
        Class<?> clazz = Class.forName("com.qtp.jvm.A");
        System.out.println(clazz);
        ClassLoader classLoader = clazz.getClassLoader();
        System.out.println(classLoader);
    }
}
A类被初始化了
class com.qtp.jvm.A
null
```



### 2、扩展类加载器和应用程序类加载器

- 扩展类加载器和应用程序类加载器都是JDK中提供的、使用Java编写的类加载器。
- 它们的源码都位于sun.misc.Launcher中，是一个静态内部类。继承自URLClassLoader。具备通过目录或者指定jar包将字节码文件加载到内存中。

继承关系图如下：

![image-20241225111330138](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241225111330138.png)

- ClassLoader类定义了具体的行为模式，简单来说就是先从本地或者网络获得字节码信息，然后调用虚拟机底层的方法创建方法区和堆上的对象。这样的好处就是让子类只需要去实现如何获取字节码信息这部分代码。
- SecureClassLoader提供了证书机制，提升了安全性。
- URLClassLoader提供了根据URL获取目录下或者指定jar包进行加载，获取字节码的数据。
- 扩展类加载器和应用程序类加载器继承自URLClassLoader，获得了上述的三种能力。

### 3、扩展类加载器

扩展类加载器（Extension Class Loader）是JDK中提供的、使用Java编写的类加载器。默认加载Java安装目录/jre/lib/ext下的类文件。

<img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241225105056539.png" alt="image-20241225105056539" style="zoom:67%;" />

如下代码会打印ScriptEnvironment类的类加载器。ScriptEnvironment是nashorn框架中用来运行javascript语言代码的环境类，他位于nashorn.jar包中被扩展类加载器加载

```java
import jdk.nashorn.internal.runtime.ScriptEnvironment;
import java.io.IOException;

/**
 * 扩展类加载器
 */
public class Main {
    public static void main(String[] args) throws IOException {
        ClassLoader classLoader = ScriptEnvironment.class.getClassLoader();
        System.out.println(classLoader);
    }
}
```

打印结果如下：

```java
sun.misc.Launcher$ExtClassLoader@45ee12a7
```

说明nashorn.jar包中的类，确实是由扩展类加载器加载的。



通过扩展类加载器去加载用户jar包：

- **放入/jre/lib/ext下进行扩展**。不推荐，尽可能不要去更改JDK安装目录中的内容。

- **使用参数进行扩展使用参数进行扩展**。推荐，使用-Djava.ext.dirs=jar包目录 进行扩展,这种方式会覆盖掉原始目录，可以用;(windows):(macos/linux)追加上原始目录

  同样`vm options`中加入以下信息：

```do
-Djava.ext.dirs="C:\Program Files\Java\jdk1.8.0_181\jre\lib\ext;D:\jvm\jar"
```

使用`引号`将整个地址包裹起来，这样路径中即便是有空格也不需要额外处理。路径中要包含原来ext文件夹，同时在最后加上扩展的路径。

```java
import jdk.nashorn.internal.runtime.ScriptEnvironment;

public class Main {
    public static void main(String[] args) throws ClassNotFoundException {
        Class<?> clazz = Class.forName("com.qtp.jvm.A");
        System.out.println(clazz);
        ClassLoader classLoader = clazz.getClassLoader();
        System.out.println(classLoader);

        ClassLoader classLoader2 = ScriptEnvironment.class.getClassLoader();
        System.out.println(classLoader2);
    }
}
看一下是否干扰，结果都输出了!
```

类加载器的加载路径可以通过classloader –c hash值 查看：

`classloader -l`可以知道整个类加载器的列表，并且知道每个类加载器的hash码

这样`扩展类加载器`加载的所有jar包就都显示出来了。

![Arthas](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image%20(13).png)



## 双亲委派机制？

避免类的重复加载，防止核心API被篡改。

> 防止核心API被篡改：避免恶意代码替换JDK中的核心类库，比如java.lang.String，确保核心类库的完整性和安全性。

双亲委派机制指的是：当一个类加载器接收到加载类的任务时，会自底向上查找是否加载过，再由顶向下进行加载。

![双亲委派](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image%20(14).png)

Java实现的类加载器，内部都保存了一个parent的成员变量，他表示的就是我的父类加载器是谁

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image21.png)

在类加载的过程中，每个类加载器都会先检查是否已经加载了该类，如果已经加载则直接返回，否则会将加载请求委派给父类加载器。

细节：

启动类加载器是C/C++编写的，在java代码中不能获得，虽然`扩`的父类加载器是`启`，所以由于没有办法拿到启动类加载器的`对象`，只能给这个对象赋值为

#### 案例1：

比如com.itheima.my.A假设在启动类加载器的加载目录(<span style="color: red;">已经被Bootstrap加载了</span>)中，而应用程序类加载器接到了加载类的任务。

1、应用程序类加载器首先判断自己加载过没有，没有加载过就交给父类加载器 - 扩展类加载器。

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image.png)

2、扩展类加载器也没加载过，交给他的父类加载器 - 启动类加载器。

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image16.png)

3、启动类加载器发现已经加载过，直接返回。

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image17.png)



#### 案例2：

B类在扩展类加载器加载路径中（<span style="color: red;">还没被加载</span>），同样应用程序类加载器接到了加载任务，按照案例1中的方式一层一层向上查找，发现都没有加载过。那么启动类加载器会首先尝试加载。它发现这类不在它的加载目录中，向下传递给扩展类加载器。

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image18.png)

扩展类加载器发现这个类在它加载路径中，加载成功并返回。

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image19.png)

如果第二次再接收到加载任务，同样地向上查找。扩展类加载器发现已经加载过，就可以返回了。

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image20.png)

#### 三个面试题

1、如果一个类重复出现在三个类加载器的加载位置，应该由谁来加载？

> 启动类加载器加载，根据双亲委派机制，它的优先级是最高的

2、String类能覆盖吗，在自己的项目中去创建一个java.lang.String类，会被加载吗？

> 不能，会返回启动类加载器加载在rt.jar包中的String类。

3、==**类的双亲委派机制是什么？**==

> - 当一个类加载器去加载某个类的时候，会自底向上查找是否加载过，如果加载过就直接返回，如果一直到最顶层的类加载器都没有加载，再由顶向下进行加载。
> - 应用程序类加载器的父类加载器是扩展类加载器，扩展类加载器的父类加载器是启动类加载器。
> - 双亲委派机制的好处有两点：第一是避免恶意代码替换JDK中的核心类库，比如java.lang.String，确保核心类库的完整性和安全性。第二是避免一个类重复地被加载。

#### 如何指定加载类的类加载器？

在Java中如何使用代码的方式去主动加载一个类呢？

方式1：使用`Class.forName`方法，使用当前类的类加载器去加载指定的类。

方式2：获取到类加载器，通过类加载器的loadClass方法指定某个类加载器加载。

```java
// 获取main方法所在类的类加载器，应用程序类加载器
ClassLoader classLoader = Demo1.class.getClassLoader();
System.out.println(classLoader);

// 使用应用程序类加载器加载 com.itheima.my.A
Class<?> clazz = classLoader.loadClass("com.itheima.my.A");
System.out.println(clazz.getClassLoader());
```



## 如何打破双亲委派机制？

打破双亲委派机制历史上有三种方式，但本质上只有第一种算是真正的打破了双亲委派机制：

- 自定义类加载器并且重写loadClass方法。Tomcat通过这种方式实现应用之间类隔离。
- 线程上下文类加载器。利用上下文类加载器加载类，比如JDBC和JNDI等。
- Osgi框架的类加载器。历史上Osgi框架实现了一套新的类加载器机制，允许同级之间委托进行类的加载，目前很少使用。

### 1、自定义类加载器

一个Tomcat程序中是可以运行多个Web应用的，如果这两个应用中出现了相同限定名的类，比如Servlet类，Tomcat要保证这两个类都能加载并且它们应该是不同的类。如果不打破双亲委派机制，当应用类加载器加载Web应用1中的MyServlet之后，Web应用2中相同限定名的MyServlet类就无法被加载了。

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image22.png)

Tomcat使用了自定义类加载器来实现应用之间类的隔离。 每一个应用会有一个独立的类加载器加载对应的类。

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image23.png)



**要想打破，就得先知道ClassLoader的原理，双亲委派机制的代码到底在哪里，接下来只需要把这段代码消除即可：**

ClassLoader中包含了4个核心方法，双亲委派机制的核心代码就位于loadClass方法中。

```java
public Class<?> loadClass(String name) //返回的都是，类信息的对象
protected Class<?> findClass(String name)
protected final Class<?> defineClass(String name, byte[] b, int off, int len)
protected final void resolveClass(Class<?> c)
```

 **调用顺序**

假如你在代码中调用 `loadClass("MyClass")`，它的调用顺序如下：

1. **`loadClass`**

   - 入口，负责整个加载流程。
   - **第一步**：检查类是否已经加载过（避免重复加载）。
   - **第二步**：先问父类加载器（双亲委派）。
   - **第三步**：如果父类加载器也加载不了，调用 `findClass`。

2. **`findClass`**

   - 子类（如 `URLClassLoader`）实现，**尝试加载类的字节码**。
   - 如果成功找到类的二进制字节码，就调用 `defineClass`。

3. **`defineClass`**

   - 把字节码数据转换成 JVM 能识别的类，并加载到内存。

4. **`resolveClass`**

   - 对加载的类进行最后的处理（如链接和准备），使类可以使用。

   

1、入口方法：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image24.png)

2、再进入看下：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image25.png)

如果查找都失败，进入加载阶段，首先会由启动类加载器加载，这段代码在`findBootstrapClassOrNull`中。如果失败会抛出异常，接下来执行下面这段代码：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image26.png)

父类加载器加载失败就会抛出异常，回到子类加载器的这段代码，这样就实现了加载并向下传递。

3、最后根据传入的参数判断是否进入连接阶段：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image27.png)

接下来实现打破双亲委派机制：





```java
package com.qtp.jvmc.jvm;

import org.apache.commons.io.IOUtils;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.regex.Matcher;

/**
 * 打破双亲委派机制 - 自定义类加载器
 */

public class BreakClassLoader1 extends ClassLoader {

    private String basePath;
    private final static String FILE_EXT = ".class";

    //设置加载目录
    public void setBasePath(String basePath) {
        this.basePath = basePath;
    }

    //使用commons io 从指定目录下加载文件
    private byte[] loadClassData(String name)  {
        try {
            String tempName = name.replaceAll("\\.", Matcher.quoteReplacement(File.separator));
            FileInputStream fis = new FileInputStream(basePath + tempName + FILE_EXT);
            try {
                return IOUtils.toByteArray(fis);
            } finally {
                IOUtils.closeQuietly(fis);
            }

        } catch (Exception e) {
            System.out.println("自定义类加载器加载失败，错误原因：" + e.getMessage());
            return null;
        }
    }

    //重写loadClass方法，把之前的一大段双亲委派机制代码彻底删掉，取而代之的是两行代码
    @Override
    public Class<?> loadClass(String name) throws ClassNotFoundException {
        //如果是java包下，还是走双亲委派机制
        if(name.startsWith("java.")){
            return super.loadClass(name);
        }
        //从磁盘中指定目录下加载
        byte[] data = loadClassData(name); //根据封装的方法，传入全限定类名，找到字节码文件，并加载到内存中，变为二进制数组
        //调用虚拟机底层方法，方法区和堆区创建对象
        return defineClass(name, data, 0, data.length); //调入底层defineClass方法，将二进制data传递进去，在堆和方法区生成对应的数据，完成加载阶段

    }

    public static void main(String[] args) throws ClassNotFoundException, InstantiationException, IllegalAccessException, IOException {
        //第一个自定义类加载器对象
        BreakClassLoader1 classLoader1 = new BreakClassLoader1();
        classLoader1.setBasePath("D:\\lib\\");

        Class<?> clazz1 = classLoader1.loadClass("com.qtp.my.A");

         //第二个自定义类加载器对象
        BreakClassLoader1 classLoader2 = new BreakClassLoader1();
        classLoader2.setBasePath("D:\\lib\\");

        Class<?> clazz2 = classLoader2.loadClass("com.qtp.my.A");

        System.out.println(clazz1 == clazz2);

        Thread.currentThread().setContextClassLoader(classLoader1);

        System.out.println(Thread.currentThread().getContextClassLoader());

        System.in.read();
     }
}
```

##### 自定义类加载器父类怎么是AppClassLoader呢？

默认情况下自定义类加载器的父类加载器是应用程序类加载器：

<img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image28.png" style="zoom: 50%;" />

以Jdk8为例，ClassLoader类中提供了构造方法设置parent的内容：

<img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image29.png" style="zoom:50%;" />

这个构造方法由另外一个构造方法调用，其中父类加载器由getSystemClassLoader方法设置，该方法返回的是AppClassLoader。

<img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image30.png" style="zoom:50%;" />



##### 两个自定义类加载器加载相同限定名的类，不会冲突吗？

不会冲突，在同一个Java虚拟机中，只有相同类加载器+相同的类限定名才会被认为是同一个类。

在Arthas中使用sc –d 类名的方式查看具体的情况。

如下代码：

```java
 public static void main(String[] args) throws ClassNotFoundException, InstantiationException, IllegalAccessException, IOException {
        //第一个自定义类加载器对象
        BreakClassLoader1 classLoader1 = new BreakClassLoader1();
        classLoader1.setBasePath("D:\\lib\\");

        Class<?> clazz1 = classLoader1.loadClass("com.itheima.my.A");
         //第二个自定义类加载器对象
        BreakClassLoader1 classLoader2 = new BreakClassLoader1();
        classLoader2.setBasePath("D:\\lib\\");

        Class<?> clazz2 = classLoader2.loadClass("com.itheima.my.A");

        System.out.println(clazz1 == clazz2);
     }
```

打印的应该是false，因为两个类加载器不同，尽管加载的是同一个类名，最终Class对象也不是相同的。

通过Arthas看：

<img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image31.png" style="zoom:80%;" />

也会出现两个不同的A类。



### 2、线程上下文类加载器

利用上下文类加载器加载类，比如JDBC和JNDI等。

我们来看下JDBC的案例：

1、JDBC中使用了DriverManager来管理项目中引入的不同数据库的驱动，比如mysql驱动、oracle驱动。

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241225183919347.png)

2、DriverManager类位于rt.jar包中，由启动类加载器加载。

3、依赖中的mysql驱动对应的类，由应用程序类加载器来加载。

<img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image32.png" style="zoom:33%;" /><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image33.png" style="zoom: 45%;" />

在类中有初始化代码：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image34.png)

这就违反了双亲委派机制

==所以现在就变成了这样：==

倒反天罡！

<img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241225192202383.png" style="zoom:67%;" />



那么问题来了，DriverManager怎么知道jar包中要加载的驱动在哪儿？

1、在类的初始化代码中有这么一个方法`LoadInitialDrivers`：

<img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image35.png" style="zoom:50%;" />

2、这里使用了SPI机制，去加载所有jar包中实现了Driver接口的实现类。

<img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image36.png" style="zoom:50%;" />

3、SPI机制就是在这个位置下存放了一个文件，文件名是接口名，文件里包含了实现类的类名。这样SPI机制就可以找到实现类了。

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image37.png)

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image40.png)

4、SPI中利用了线程上下文类加载器（应用程序类加载器）去加载类并创建对象。

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image38.png)

总结：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image39.png)



##### JDBC案例中真的打破了双亲委派机制吗？

最早这个论点提出是在周志明《深入理解Java虚拟机》中，他认为打破了双亲委派机制，这种由启动类加载器加载的类，委派应用程序类加载器去加载类的方式，所以打破了双亲委派机制。

但这里看似是直接选用了应用程序类加载器，但是选择应用程序类加载器的过程仍然符合双亲委派机制，即要先看启动类，再看扩展类，再看应用程序类，只是暴露出来的过程看似是直接选择了最后一个，其实逻辑是仍然是符合的。

所以我认为这里没有打破双亲委派机制，只是用一种巧妙的方法让启动类加载器加载的类，去引发的其他类的加载。

### 3、Osgi框架的类加载器

历史上，OSGi模块化框架。它存在同级之间的类加载器的委托加载。

> 在OSGi中，每个模块（bundle）都有自己的类加载器，这个类加载器负责加载模块内部的类。当一个模块需要使用另一个模块的类时，OSGi会通过其服务注册表（service registry）来解决模块间的依赖关系。这与双亲委派机制不同，因为OSGi允许模块之间有更灵活的类加载策略，而不是严格遵循从上到下的委托顺序。

OSGi还使用类加载器实现了热部署的功能。热部署指的是在服务不停止的情况下，动态地更新字节码文件到内存中。

### 4、案例：使用阿里arthas不停机解决线上问题

**背景：**

小李的团队将代码上线之后，发现存在一个小bug，但是用户急着使用，如果重新打包再发布需要一个多小时的时间，所以希望能使用arthas尽快的将这个问题修复。

**思路：**

1. 在出问题的服务器上部署一个 arthas，并启动。

2. jad --source-only 类全限定名 > 目录/文件名.java      

   > jad 命令反编译，然后可以用其它编译器，比如 vim 来修改源码

3. mc –c 类加载器的hashcode 目录/文件名.java -d 输出目录

   > mc 命令用来编译修改过的代码

4.  retransform class文件所在目录/xxx.class

   > 用 retransform 命令加载新的字节码

**详细流程：**

1、这段代码编写有误，在枚举中的类型判断上使用了`==` 而不是`equals`

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image50.png)

2、枚举中是这样定义的，1001是普通用户，1002是VIP用户：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image43.png)

3、由于代码有误，导致传递1001参数时，返回的是收费用户的内容。

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image44.png)

4、`jad --source-only 类全限定名 > 目录/文件名.java`，使用 jad 命令反编译，然后可以用其它编译器，比如 vim 来修改源码

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image45.png)

这里直接双击文件使用finalShell编辑：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image46.png)

5、`mc –c 类加载器的hashcode 目录/文件名.java -d 输出目录` 使用mc 命令用来编译修改过的代码

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image47.png)

6、`retransform class文件所在目录/xxx.class` 用 retransform 命令加载新的字节码
==加载到内存中，起到一个刷新作用==

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image48.png)

7、测试：

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image49.png)

**注意事项：**

1、程序重启之后，字节码文件会恢复（==retransform 只是将字节码更新到了内存中==），除非将class文件放入jar包中进行更新。

2、使用retransform不能==添加==方法或者字段，==只能修改==，也不能更新正在执行中的方法。

## JDK9之后的类加载器？

由于JDK9引入了module的概念，类加载器在设计上发生了很多变化。

1、启动类加载器使用Java编写，位于jdk.internal.loader.ClassLoaders类中。

> Java中的BootClassLoader继承自BuiltinClassLoader实现从模块中找到要加载的字节码资源文件。
>
> <span style="color: red;">启动类加载器依然无法通过java代码获取到，返回的仍然是null，保持了统一。</span>



![JDK9](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241225211306030.png)

2、扩展类加载器被替换成了平台类加载器（Platform Class Loader）。

> 平台类加载器遵循模块化方式加载字节码文件，所以继承关系从URLClassLoader
>
> （==从jar包中获取==）变成了BuiltinClassLoader，BuiltinClassLoader实现了从模块中加载字节码文件。<span style="color: red;">平台类加载器的存在更多的是为了与老版本的设计方案兼容，自身没有特殊的逻辑。</span>

![JDK9](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241225211543285.png)

**我们所说的**模块化思想本身就具有扩展性，而之前扩展类加载器被替换成了平台类加载器，扩展类加载器，他其实也是为了在JDK的一些核心类之外，去扩展一些类。如果你用了模块化的思想，理论上来说，像和这个平台类加载器就不需要了，但是为了保证和老版本的设计方案的**兼容**，==平台类加载器也得到了保存==。见上方红字。

如果后续想对JDK做一些扩展，你就按照JDK自身的模块化思想来扩展，就可以了，与这个平台类加载器关系不大。

总结：

![类加载器的作用](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241225212600327.png)

![双亲委派](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241225212759021.png)