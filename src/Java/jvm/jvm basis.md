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

<center><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image%20(3).png" alt="image (3)" style="zoom:70%;" /></center>

> 为了安全考虑，对于开发者来说，只需要访问堆中的Class对象而不需要访问方法区中所有信息。
>
> 这样Java虚拟机就能很好地控制开发者访问数据的范围。

<center><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241224211356474.png" style="zoom: 60%;" /></center>

## 连接阶段？

- 验证，验证内容是否满足《Java虚拟机规范》。
- 准备，给静态变量赋初值。
- 解析，将常量池中的符号引用替换成指向内存的直接引用。

### 验证

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

### 准备

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

### 解析

解析阶段主要是将常量池中的符号引用替换为直接引用，符号引用就是在字节码文件中使用编号来访问常量池中的内容。

<img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image%20(6).png" style="zoom:50%;" />

直接引用不在使用编号，而是使用内存中地址进行访问具体的数据。

<img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image%20(7).png" style="zoom:50%;" />

## 初始化阶段？

### 基本概念

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



### 以下几种方式会导致类的初始化

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

### 面试题1

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

### **clinit不会执行的几种情况**

如下几种情况是不会进行初始化指令执行的：

1.无静态代码块且无静态变量赋值语句。

<img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image%20(8).png" style="zoom:33%;" />

2.有静态变量的声明，但是没有赋值语句。

<img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image%20(9).png" alt="image (9)" style="zoom:33%;" />

### 面试题2

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

### 补充练习题

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

<span style="color: red;">红</span>

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







## 为什么要有双亲委派机制？

避免类的重复加载，防止核心API被篡改。

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