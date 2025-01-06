import{_ as n,W as s,X as a,a2 as e}from"./framework-6a3aa88c.js";const t={},p=e(`<h2 id="🍂-智能协同云图库" tabindex="-1"><a class="header-anchor" href="#🍂-智能协同云图库" aria-hidden="true">#</a> 🍂 智能协同云图库</h2><h4 id="enableaspectjautoproxy-exposepro-xy-true-有什么用" tabindex="-1"><a class="header-anchor" href="#enableaspectjautoproxy-exposepro-xy-true-有什么用" aria-hidden="true">#</a> @EnableAspectJAutoProxy(exposePro xy = true)有什么用？</h4><p>它是启用基于AspectJ的 AOP 功能的意思,它会告诉 Spring 使用代理来处理带有 AOP 注解的类。</p><ul><li>默认情况下，Spring 创建的代理对象是不可直接访问的，因为它是在 Spring 容器中管理的对象。</li><li>通过设置 exposeProxy = true，你可以在代码中访问到代理对象，</li><li>从而使得你能够在某些特殊情况下获取和操作代理对象。</li></ul><p>举个例子：</p><p>我们有一个业务类 <strong><code>UserService</code></strong>，里面有两个方法：</p><ol><li><code>createUser()</code>：创建用户，同时调用 <code>sendNotification()</code> 方法。</li><li><code>sendNotification()</code>：发送通知。</li></ol><p>假设我们有一个切面（<code>LoggingAspect</code>）用来记录方法调用日志。</p><p><strong>重点问题</strong>： 如果我们在 <code>createUser()</code> 方法内部直接调用 <code>sendNotification()</code>，默认情况下 Spring AOP 不会拦截这个调用（因为内部方法调用不会经过代理对象）。 通过 <code>exposeProxy = true</code> 和 <code>AopContext.currentProxy()</code>，我们可以在内部方法调用中获取代理对象，从而让切面正常工作。</p><h3 id="_1-项目结构" tabindex="-1"><a class="header-anchor" href="#_1-项目结构" aria-hidden="true">#</a> 1. <strong>项目结构</strong></h3><div class="language-less line-numbers-mode" data-ext="less"><pre class="language-less"><code>src<span class="token operator">/</span>main<span class="token operator">/</span>java
  ├── AppConfig.java              <span class="token comment">// Spring 配置类</span>
  ├── UserService.java            <span class="token comment">// 业务类</span>
  ├── LoggingAspect.java          <span class="token comment">// 切面类</span>
  └── MainApp.java                <span class="token comment">// 启动类</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-代码实现" tabindex="-1"><a class="header-anchor" href="#_2-代码实现" aria-hidden="true">#</a> 2. <strong>代码实现</strong></h3><h4 id="_2-1-spring-配置类-启用-aop-并暴露代理对象" tabindex="-1"><a class="header-anchor" href="#_2-1-spring-配置类-启用-aop-并暴露代理对象" aria-hidden="true">#</a> 2.1 <strong>Spring 配置类（启用 AOP 并暴露代理对象）</strong></h4><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>context<span class="token punctuation">.</span>annotation<span class="token punctuation">.</span></span><span class="token class-name">ComponentScan</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>context<span class="token punctuation">.</span>annotation<span class="token punctuation">.</span></span><span class="token class-name">Configuration</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>context<span class="token punctuation">.</span>annotation<span class="token punctuation">.</span></span><span class="token class-name">EnableAspectJAutoProxy</span></span><span class="token punctuation">;</span>

<span class="token annotation punctuation">@Configuration</span>
<span class="token annotation punctuation">@ComponentScan</span><span class="token punctuation">(</span><span class="token string">&quot;com.example&quot;</span><span class="token punctuation">)</span>  <span class="token comment">// 扫描当前包下的组件</span>
<span class="token annotation punctuation">@EnableAspectJAutoProxy</span><span class="token punctuation">(</span>exposeProxy <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">)</span>  <span class="token comment">// 启用 AOP，并暴露代理对象</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">AppConfig</span> <span class="token punctuation">{</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_2-2-业务类-userservice" tabindex="-1"><a class="header-anchor" href="#_2-2-业务类-userservice" aria-hidden="true">#</a> 2.2 <strong>业务类（UserService）</strong></h4><p>在 <code>createUser()</code> 方法中，我们通过 <code>AopContext.currentProxy()</code> 获取代理对象并调用 <code>sendNotification()</code>，从而触发切面增强。</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>aop<span class="token punctuation">.</span>framework<span class="token punctuation">.</span></span><span class="token class-name">AopContext</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>stereotype<span class="token punctuation">.</span></span><span class="token class-name">Service</span></span><span class="token punctuation">;</span>

<span class="token annotation punctuation">@Service</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">UserService</span> <span class="token punctuation">{</span>

    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">createUser</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;正在创建用户...&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

        <span class="token comment">// 直接调用当前类的另一个方法</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;直接调用 sendNotification() 方法：&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token function">sendNotification</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  <span class="token comment">// 直接调用，不会触发切面</span>

        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;\\n通过代理调用 sendNotification() 方法：&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token comment">// 获取当前代理对象并调用方法</span>
        <span class="token class-name">UserService</span> proxy <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token class-name">UserService</span><span class="token punctuation">)</span> <span class="token class-name">AopContext</span><span class="token punctuation">.</span><span class="token function">currentProxy</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        proxy<span class="token punctuation">.</span><span class="token function">sendNotification</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  <span class="token comment">// 通过代理调用，会触发切面</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">sendNotification</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;正在发送通知...&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_2-3-切面类-loggingaspect" tabindex="-1"><a class="header-anchor" href="#_2-3-切面类-loggingaspect" aria-hidden="true">#</a> 2.3 <strong>切面类（LoggingAspect）</strong></h4><p>切面会在 <code>UserService</code> 的方法执行前后记录日志。</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>aspectj<span class="token punctuation">.</span>lang<span class="token punctuation">.</span>annotation<span class="token punctuation">.</span></span><span class="token class-name">Aspect</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>aspectj<span class="token punctuation">.</span>lang<span class="token punctuation">.</span>annotation<span class="token punctuation">.</span></span><span class="token class-name">Before</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>aspectj<span class="token punctuation">.</span>lang<span class="token punctuation">.</span>annotation<span class="token punctuation">.</span></span><span class="token class-name">After</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>stereotype<span class="token punctuation">.</span></span><span class="token class-name">Component</span></span><span class="token punctuation">;</span>

<span class="token annotation punctuation">@Aspect</span>
<span class="token annotation punctuation">@Component</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">LoggingAspect</span> <span class="token punctuation">{</span>

    <span class="token annotation punctuation">@Before</span><span class="token punctuation">(</span><span class="token string">&quot;execution(* com.qtp.picture.UserService.*(..))&quot;</span><span class="token punctuation">)</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">logBefore</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;[日志] 方法执行开始。&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token annotation punctuation">@After</span><span class="token punctuation">(</span><span class="token string">&quot;execution(* com.qtp.picture.UserService.*(..))&quot;</span><span class="token punctuation">)</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">logAfter</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;[日志] 方法执行结束。&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_2-4-启动类-mainapp" tabindex="-1"><a class="header-anchor" href="#_2-4-启动类-mainapp" aria-hidden="true">#</a> 2.4 <strong>启动类（MainApp）</strong></h4><p>启动 Spring 容器，获取 <code>UserService</code> 并调用方法。</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>context<span class="token punctuation">.</span></span><span class="token class-name">ApplicationContext</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>context<span class="token punctuation">.</span>annotation<span class="token punctuation">.</span></span><span class="token class-name">AnnotationConfigApplicationContext</span></span><span class="token punctuation">;</span>

<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">MainApp</span> <span class="token punctuation">{</span>

    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// 加载 Spring 容器</span>
        <span class="token class-name">ApplicationContext</span> context <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">AnnotationConfigApplicationContext</span><span class="token punctuation">(</span><span class="token class-name">AppConfig</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

        <span class="token comment">// 获取 UserService Bean</span>
        <span class="token class-name">UserService</span> userService <span class="token operator">=</span> context<span class="token punctuation">.</span><span class="token function">getBean</span><span class="token punctuation">(</span><span class="token class-name">UserService</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

        <span class="token comment">// 调用 createUser() 方法</span>
        userService<span class="token punctuation">.</span><span class="token function">createUser</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-执行输出" tabindex="-1"><a class="header-anchor" href="#_3-执行输出" aria-hidden="true">#</a> 3. <strong>执行输出</strong></h3><p>运行 <code>MainApp</code>，输出结果如下：</p><div class="language-scss line-numbers-mode" data-ext="scss"><pre class="language-scss"><code>正在创建用户...
直接调用 <span class="token function">sendNotification</span><span class="token punctuation">(</span><span class="token punctuation">)</span> 方法：
正在发送通知...

通过代理调用 <span class="token function">sendNotification</span><span class="token punctuation">(</span><span class="token punctuation">)</span> 方法：
[日志] 方法执行开始。
正在发送通知...
[日志] 方法执行结束。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-总结" tabindex="-1"><a class="header-anchor" href="#_4-总结" aria-hidden="true">#</a> 4. <strong>总结</strong></h3><ul><li><strong>实际用途</strong>：在业务逻辑复杂、需要触发切面增强的内部方法调用时，这是非常有用的。通过 <code>exposeProxy = true</code> 暴露代理对象，然后使用 <code>AopContext.currentProxy()</code> 获取当前代理对象，这样调用方法时就能触发切面逻辑。</li></ul>`,28),o=[p];function c(i,l){return s(),a("div",null,o)}const r=n(t,[["render",c],["__file","Aop.html.vue"]]);export{r as default};