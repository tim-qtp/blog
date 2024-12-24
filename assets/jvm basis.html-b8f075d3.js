import{_ as p,W as o,X as c,Z as s,a2 as t,a1 as e,$ as n,C as i}from"./framework-4e10303a.js";const l={},u=e(`<h2 id="jvm的功能" tabindex="-1"><a class="header-anchor" href="#jvm的功能" aria-hidden="true">#</a> JVM的功能？</h2><ul><li>1 - 解释和运行</li><li>2 - 内存管理</li><li>3 - 即时编译</li></ul><h2 id="java为什么需要实时解释" tabindex="-1"><a class="header-anchor" href="#java为什么需要实时解释" aria-hidden="true">#</a> JAVA为什么需要实时解释？</h2><p>C,C++：main.c ☛ main.exe(机器码)</p><p>JAVA：main.java ☛ <span style="color:red;">.class字节码指令</span> ☛ 机器码</p><p>java需要实时解释，<strong>主要是为了支持跨平台特性</strong>。</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241224120013253.png" alt="跨平台" tabindex="0" loading="lazy"><figcaption>跨平台</figcaption></figure><p>字节码指令交给不同平台的JVM。</p><h2 id="字节码文件的组成" tabindex="-1"><a class="header-anchor" href="#字节码文件的组成" aria-hidden="true">#</a> 字节码文件的组成？</h2><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241224133958360.png" alt="jclasslib" tabindex="0" loading="lazy"><figcaption>jclasslib</figcaption></figure><h2 id="magic魔数" tabindex="-1"><a class="header-anchor" href="#magic魔数" aria-hidden="true">#</a> Magic魔数？</h2><p>每个Java字节码文件的前四个字节是固定的，用16进制表示就是0xcafebabe。文件是无法通过文件扩展名来确定文件类型的，文件扩展名可以随意修改不影响文件的内容。软件会使用文件的头几个字节（文件头）去校验文件的类型，如果软件不支持该种类型就会出错。</p><p>比如常见的文件格式校验方式如下：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241224223116673.png" alt="魔数" tabindex="0" loading="lazy"><figcaption>魔数</figcaption></figure><p>Java字节码文件中，将文件头称为magic魔数。Java虚拟机会校验字节码文件的前四个字节是不是0xcafebabe，来保证加载的确实是字节码文件。</p><h2 id="主副版本号" tabindex="-1"><a class="header-anchor" href="#主副版本号" aria-hidden="true">#</a> 主副版本号</h2><p>1.2之后大版本号计算方法就是：主版本号 – 44，比如主版本号52就是JDK8。</p><p>比如出现如下错误：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241224134832430.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241224135249775.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>该字节码文件的版本号是jdk8，但运行时环境是jdk6，较低的运行时环境去运行较高的jdk版本，导致出错。</p><p>有两种方案：</p><p>1.升级JDK版本</p><p>2.将第三方依赖的版本号降低或者更换依赖（8的依赖改为6的依赖），以满足JDK版本的要求。 <span style="color:red;">√ 建议使用这种方案</span></p><h2 id="为什么要用字符串string去找info字面量" tabindex="-1"><a class="header-anchor" href="#为什么要用字符串string去找info字面量" aria-hidden="true">#</a> 为什么要用字符串string去找info字面量？</h2><p>可不可以直接通过字段去找到字面量呢 <span style="color:red;">✘</span></p><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241224142309506.png" alt="image-20241224142309506" style="zoom:67%;"><p>肯定不行，该字节码文件被解析并加载后，需要把String_info类型的常量池中的内容加载到java字符串常量池中，所以必须保留一个类型是String类型。</p><p>而且为了更省空间，<code>字段名</code>和<code>字符串内容</code>一样时，abc的名字索引直接引用到字面量utf8_info</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Main</span> <span class="token punctuation">{</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token class-name">String</span> a1 <span class="token operator">=</span> <span class="token string">&quot;abc&quot;</span><span class="token punctuation">;</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token class-name">String</span> a2 <span class="token operator">=</span> <span class="token string">&quot;abc&quot;</span><span class="token punctuation">;</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token class-name">String</span> abc <span class="token operator">=</span> <span class="token string">&quot;abc&quot;</span><span class="token punctuation">;</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">Main</span> main <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Main</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这是abc的描述信息，名字直接为<code>14</code></p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241224151312224.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>相比较，这是<code>a1</code>的<code>描述信息</code>及<code>常量信息</code></p><p><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241224151451079.png" alt="" loading="lazy"><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241224151506321.png" alt="" loading="lazy"></p><h2 id="为什么i-i-还是0" tabindex="-1"><a class="header-anchor" href="#为什么i-i-还是0" aria-hidden="true">#</a> 为什么i=i++还是0？</h2><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241224160134524.png" alt="i++" style="zoom:33%;"><p>因为<code>iinc 1 by 1</code>是在局部变量数组表中进行的，不是在操作数栈中进行的，i++ 先把0取出来放入临时的操作数栈中，接下来对<code>i</code>进行加1，<code>i</code>变成了1，最后再将之前保存的临时值0放入i，最后就变成了0。</p><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241224160512490.png" alt="++i" style="zoom:50%;"><p>而++i就比较<code>规矩</code>了，load和iinc调换顺序，自增完以后还要<code>存回操作数</code>中。</p><h2 id="字节码常用工具" tabindex="-1"><a class="header-anchor" href="#字节码常用工具" aria-hidden="true">#</a> 字节码常用工具？</h2><ul><li>javap：<code>输入javap -v 字节码文件名称 查看具体的字节码信息。（如果jar包需要先使用 jar –xvf 命令解压）</code></li><li>jclasslib：<code>也有Idea插件版本</code></li><li>Arthas</li></ul><blockquote><p>Arthas 是一款线上监控诊断产品，通过全局视角实时查看应用 load、内存、gc、线程的状态信息，并能在不修改应用代码的情况下，对业务问题进行诊断，大大提升线上问题排查效率。</p></blockquote><p>使用举例：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>dump 类的全限定名：dump已加载类的字节码文件到特定目录。
jad 类的全限定名： 反编译已加载类的源码。（小李怀疑是因为没有把最新的字节码文件部署到服务器上）
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="类的生命周期" tabindex="-1"><a class="header-anchor" href="#类的生命周期" aria-hidden="true">#</a> 类的生命周期？</h2><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image (1).png" alt="类的生命周期" tabindex="0" loading="lazy"><figcaption>类的生命周期</figcaption></figure><h2 id="加载阶段" tabindex="-1"><a class="header-anchor" href="#加载阶段" aria-hidden="true">#</a> 加载阶段？</h2><p>类加载器在加载完类之后，Java虚拟机会将字节码中的信息保存到方法区中，方法区中生成一个<code>InstanceKlass</code>对象，保存类的所有信息，里边还包含实现特定功能比如多态的信息。</p><div align="center"><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image (2).png" style="zoom:70%;"></div><p>Java虚拟机同时会在堆上生成与方法区中数据类似的<code>java.lang.Class</code>对象，作用是在Java代码中去获取类的信息以及存储静态字段的数据（<code>JDK8</code>及之后）。</p>`,50),d=n("img",{src:"https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image (3).png",alt:"image (3)",style:{zoom:"70%"}},null,-1),r=n("blockquote",null,[n("p",null,"为了安全考虑，对于开发者来说，只需要访问堆中的Class对象而不需要访问方法区中所有信息。"),n("p",null,"这样Java虚拟机就能很好地控制开发者访问数据的范围。")],-1),k=n("img",{src:"https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241224211356474.png",style:{zoom:"60%"}},null,-1),m=e(`<h2 id="连接阶段" tabindex="-1"><a class="header-anchor" href="#连接阶段" aria-hidden="true">#</a> 连接阶段？</h2><ul><li>验证，验证内容是否满足《Java虚拟机规范》。</li><li>准备，给静态变量赋初值。</li><li>解析，将常量池中的符号引用替换成指向内存的直接引用。</li></ul><h3 id="验证" tabindex="-1"><a class="header-anchor" href="#验证" aria-hidden="true">#</a> 验证</h3><p>1、文件格式验证，比如文件是否以0xCAFEBABE开头，主次版本号是否满足当前Java虚拟机版本要求。</p><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241224214046069.png" alt="字节码文件" style="zoom:33%;"><p>2、元信息验证，例如类必须有父类（super不能为空）。</p><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241224214414031.png" style="zoom:67%;"><p>3、验证程序执行指令的语义，比如方法内的指令执行中跳转到不正确的位置。</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241224214553834.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><blockquote><p>跳转到2可以，15就不行！</p></blockquote><p>4、符号引用验证，例如是否访问了其他类中private的方法等。</p><p>对版本号的验证，在JDK8的源码中如下：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">return</span> <span class="token punctuation">(</span>major <span class="token operator">&gt;=</span> <span class="token constant">JAVA_MIN_SUPPORTED_VERSION</span><span class="token punctuation">)</span> <span class="token operator">&amp;&amp;</span> <span class="token comment">//支持的最低版本号，JDK中常量是45，代表JDK1.0</span>
       <span class="token punctuation">(</span>major <span class="token operator">&lt;=</span> max_version<span class="token punctuation">)</span> <span class="token operator">&amp;&amp;</span> <span class="token comment">//支持的最低版本号,JDK8中是44+8=52，代表JDK8</span>
       <span class="token punctuation">(</span><span class="token punctuation">(</span>major <span class="token operator">!=</span> max_version<span class="token punctuation">)</span> <span class="token operator">||</span> <span class="token comment">//主版本号为52时，副版本号要为0</span>
        <span class="token punctuation">(</span>minor <span class="token operator">&lt;=</span> <span class="token constant">JAVA_MAX_SUPPORTED_MINOR_VERSION</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">//支持的最高副版本号，JDK未使用，为0</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>字节码文件的主版本号不能高于运行环境主版本号，如果主版本号相等，副版本号也不能超过。</p><h3 id="准备" tabindex="-1"><a class="header-anchor" href="#准备" aria-hidden="true">#</a> 准备</h3><p>为静态变量（static）分配内存并设置初值，每一种基本数据类型和引用数据类型都有其初值。<span style="color:red;">因为内存有残留，可能不干净！</span></p><table><thead><tr><th><strong>数据类型</strong></th><th><strong>初始值</strong></th></tr></thead><tbody><tr><td><strong>int</strong></td><td><strong>0</strong></td></tr><tr><td><strong>long</strong></td><td><strong>0L</strong></td></tr><tr><td><strong>short</strong></td><td><strong>0</strong></td></tr><tr><td><strong>char</strong></td><td><strong>‘\\u0000’</strong></td></tr><tr><td><strong>byte</strong></td><td><strong>0</strong></td></tr><tr><td><strong>boolean</strong></td><td><strong>false</strong></td></tr><tr><td><strong>double</strong></td><td><strong>0.0</strong></td></tr><tr><td><strong>引用数据类型</strong></td><td><strong>null</strong></td></tr></tbody></table><p>在准备阶段会为value分配内存并赋初值为0，在初始化阶段才会将值修改为1。</p><blockquote><p>final修饰的基本数据类型的静态变量，准备阶段直接会将代码中的值进行赋值。</p><p>如下例子中，变量加上final进行修饰，在准备阶段value值就直接变成1了，因为final修饰的变量后续不会发生值的变更。</p></blockquote><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image (4).png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>来看这个案例：</p><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>public class HsdbDemo {
    public static final int i = 2;
    public static void main(String[] args) throws IOException, InstantiationException, IllegalAccessException {
        HsdbDemo hsdbDemo = new HsdbDemo();
        System.out.println(i);
        System.in.read();
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>从字节码文件也可以看到，编译器已经确定了该字段指向了常量池中的常量2：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image (5).png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="解析" tabindex="-1"><a class="header-anchor" href="#解析" aria-hidden="true">#</a> 解析</h3><p>解析阶段主要是将常量池中的符号引用替换为直接引用，符号引用就是在字节码文件中使用编号来访问常量池中的内容。</p><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image (6).png" style="zoom:50%;"><p>直接引用不在使用编号，而是使用内存中地址进行访问具体的数据。</p><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image (7).png" style="zoom:50%;"><h2 id="初始化阶段" tabindex="-1"><a class="header-anchor" href="#初始化阶段" aria-hidden="true">#</a> 初始化阶段？</h2><h3 id="基本概念" tabindex="-1"><a class="header-anchor" href="#基本概念" aria-hidden="true">#</a> 基本概念</h3><ul><li>初始化阶段会执行静态代码块中的代码，并为静态变量赋值。</li><li>初始化阶段会执行字节码文件中<code>clinit</code>部分的字节码指令。</li></ul><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Demo1</span> <span class="token punctuation">{</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">int</span> value <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span>
    <span class="token keyword">static</span> <span class="token punctuation">{</span>
        value <span class="token operator">=</span> <span class="token number">2</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>

    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241224223751334.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><blockquote><p>构造方法 main方法 初始化阶段执行</p></blockquote><p>最后结果为2</p><p>如果静态变量和静态代码块颠倒顺序，则结果为1</p><h3 id="以下几种方式会导致类的初始化" tabindex="-1"><a class="header-anchor" href="#以下几种方式会导致类的初始化" aria-hidden="true">#</a> 以下几种方式会导致类的初始化</h3><p>1.访问一个类的静态变量或者静态方法，注意变量是final修饰的并且等号右边是常量不会触发初始化。</p><p>2.调用Class.forName(String className)，即使不使用。</p><p>3.new一个该类的对象时。</p><p>4.执行Main方法的当前类。</p><p>添加<code>-XX:+TraceClassLoading</code> 参数可以打印出加载并初始化的类</p><p><strong>验证1：</strong></p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Main</span> <span class="token punctuation">{</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>

        <span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token class-name">Demo2</span><span class="token punctuation">.</span>i<span class="token punctuation">;</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>i<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
<span class="token keyword">class</span> <span class="token class-name">Demo2</span><span class="token punctuation">{</span>
    <span class="token keyword">static</span> <span class="token punctuation">{</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;初始化了...&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241224231420884.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>可以看到初始化了并打印了0，且Demo2也被加载（<code>load</code>）并初始化（<code>init</code>）了</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>改为final，就没有输出<code>初始化了</code>，<code>Demo2</code>也没有发现。所以<code>final</code>不会触发这个类的初始化阶段。</p><p><strong>验证2：</strong></p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Main</span> <span class="token punctuation">{</span>
    <span class="token keyword">static</span> <span class="token punctuation">{</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;Main初始化了...&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">new</span> <span class="token class-name">Demo2</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
<span class="token keyword">class</span> <span class="token class-name">Demo2</span><span class="token punctuation">{</span>
    <span class="token keyword">static</span> <span class="token punctuation">{</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;demo2初始化了...&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token class-name">Main</span>初始化了<span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>
demo2初始化了<span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="面试题1" tabindex="-1"><a class="header-anchor" href="#面试题1" aria-hidden="true">#</a> 面试题1</h3><p>如下代码的输出结果是什么？</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Test1</span> <span class="token punctuation">{</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;A&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">new</span> <span class="token class-name">Test1</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">new</span> <span class="token class-name">Test1</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">public</span> <span class="token class-name">Test1</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;B&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token punctuation">{</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;C&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">static</span> <span class="token punctuation">{</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;D&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>DACBCB</p><h3 id="clinit不会执行的几种情况" tabindex="-1"><a class="header-anchor" href="#clinit不会执行的几种情况" aria-hidden="true">#</a> <strong>clinit不会执行的几种情况</strong></h3><p>如下几种情况是不会进行初始化指令执行的：</p><p>1.无静态代码块且无静态变量赋值语句。</p><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image (8).png" style="zoom:33%;"><p>2.有静态变量的声明，但是没有赋值语句。</p><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image (9).png" alt="image (9)" style="zoom:33%;"><h3 id="面试题2" tabindex="-1"><a class="header-anchor" href="#面试题2" aria-hidden="true">#</a> 面试题2</h3><p>如下代码的输出结果是什么？</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Demo01</span> <span class="token punctuation">{</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">new</span> <span class="token class-name">B02</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token constant">B02</span><span class="token punctuation">.</span>a<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">class</span> <span class="token class-name">A02</span><span class="token punctuation">{</span>
    <span class="token keyword">static</span> <span class="token keyword">int</span> a <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
    <span class="token keyword">static</span> <span class="token punctuation">{</span>
        a <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">class</span> <span class="token class-name">B02</span> <span class="token keyword">extends</span> <span class="token class-name">A02</span><span class="token punctuation">{</span>
    <span class="token keyword">static</span> <span class="token punctuation">{</span>
        a <span class="token operator">=</span> <span class="token number">2</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>分析步骤：</p><p>1、调用new创建对象，需要初始化B02，优先初始化父类。</p><p>2、执行A02的初始化代码，将a赋值为1。</p><p>3、B02初始化，将a赋值为2。</p><p>输出<code>2</code></p></blockquote><blockquote><h5 id="变化" tabindex="-1"><a class="header-anchor" href="#变化" aria-hidden="true">#</a> 变化</h5><p>将new B02() 注释掉会怎么样？</p><p>分析步骤：</p><p>1、访问父类的静态变量，只初始化父类。</p><p>2、执行A02的初始化代码，将a赋值为1。</p><p>输出<code>1</code></p></blockquote><h3 id="补充练习题" tabindex="-1"><a class="header-anchor" href="#补充练习题" aria-hidden="true">#</a> 补充练习题</h3><p>分析如下代码执行结果:</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Test2</span> <span class="token punctuation">{</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">Test2_A</span><span class="token punctuation">[</span><span class="token punctuation">]</span> arr <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Test2_A</span><span class="token punctuation">[</span><span class="token number">10</span><span class="token punctuation">]</span><span class="token punctuation">;</span>

    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">class</span> <span class="token class-name">Test2_A</span> <span class="token punctuation">{</span>
    <span class="token keyword">static</span> <span class="token punctuation">{</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;Test2 A的静态代码块运行&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><span style="color:red;">✘</span> 数组的创建不会导致数组中元素的类进行初始化。</p><p><span style="color:red;">红</span></p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Test4</span> <span class="token punctuation">{</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token class-name">Test4_A</span><span class="token punctuation">.</span>a<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">class</span> <span class="token class-name">Test4_A</span> <span class="token punctuation">{</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token keyword">int</span> a <span class="token operator">=</span> <span class="token class-name">Integer</span><span class="token punctuation">.</span><span class="token function">valueOf</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token keyword">static</span> <span class="token punctuation">{</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;Test3 A的静态代码块运行&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><span style="color:red;">✔</span> final修饰的变量如果赋值的内容需要执行指令才能得出结果，会执行clinit方法进行初始化。</p><h2 id="为什么要有双亲委派机制" tabindex="-1"><a class="header-anchor" href="#为什么要有双亲委派机制" aria-hidden="true">#</a> 为什么要有双亲委派机制？</h2><p>避免类的重复加载，防止核心API被篡改。</p><h2 id="tomcat为什么要自定义类加载器" tabindex="-1"><a class="header-anchor" href="#tomcat为什么要自定义类加载器" aria-hidden="true">#</a> Tomcat为什么要自定义类加载器？</h2><p>为了进行类的隔离，如果Tomcat直接使用AppClassLoader类加载类，那就会出现如下情况:</p><ol><li>应用A中有一个com.zhouyu.Hello.class</li><li>应用B中也有一个com.zhouyu.Hello.class</li><li>虽然都叫做Hello，但是具体的方法、属性可能不一样</li><li>如果AppClassLoader先加载了应用A中的Hello.class→</li><li>那么应用B中的Hello.class就不可能再被加载了，因为名字是一样</li><li>如果就需要针对应用A和应用B设置各自单独的类加载器，也就是WebappClassLoader</li><li>这样两个应用中的Hello.class都能被各自的类加载器所加载，不会冲突</li><li>这就是Tomcat为什么用自定义类加载器的核心原因，为了实现类加载的隔离</li><li><span style="color:red;">JVM中判断一个类是不是已经被加载的逻辑是：类名+对应的类加载器实例。</span></li></ol><h2 id="运行时数据区由哪些部分构成" tabindex="-1"><a class="header-anchor" href="#运行时数据区由哪些部分构成" aria-hidden="true">#</a> 运行时数据区由哪些部分构成？</h2><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241224112645303.png" alt="jvm结构" tabindex="0" loading="lazy"><figcaption>jvm结构</figcaption></figure><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241224112947297.png" alt="运行时数据区" tabindex="0" loading="lazy"><figcaption>运行时数据区</figcaption></figure><p>方法区和堆是多个线程共享的。</p><h2 id="程序计数器" tabindex="-1"><a class="header-anchor" href="#程序计数器" aria-hidden="true">#</a> 程序计数器</h2><p>PC Register，程序计数寄存器，简称为程序计数器：</p><ol><li>是物理寄存器的抽象实现</li><li>用来记录待执行的下一条指令的地址</li><li>它是程序控制流的指示器，循环、if else、异常处理、线程恢复等都依赖它来完成</li><li>解释器工作时就是通过它来获取下一条需要执行的字节码指令的</li><li>它是唯一一个在JVM规范中没有规定任何OutOfMemoryError情况的区域</li></ol>`,85);function v(g,b){const a=i("center");return o(),c("div",null,[u,s(a,null,{default:t(()=>[d]),_:1}),r,s(a,null,{default:t(()=>[k]),_:1}),m])}const y=p(l,[["render",v],["__file","jvm basis.html.vue"]]);export{y as default};