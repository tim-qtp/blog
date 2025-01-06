import{_ as o,W as l,X as d,$ as n,a0 as a,Z as s,a1 as i,a2 as e,C as c}from"./framework-6a3aa88c.js";const r={},u=e('<h1 id="feign远程调用" tabindex="-1"><a class="header-anchor" href="#feign远程调用" aria-hidden="true">#</a> Feign远程调用</h1><p>Feign是一个声明式的Web服务客户端，它简化了使用基于HTTP的远程服务的开发。</p><p>Feign是在<code>RestTemplate</code>和<code>Ribbon</code>的基础上进一步封装，使用<code>RestTemplate</code>实现<code>Http</code>调用，使用<code>Ribbon</code>实现负载均衡。</p><p>以前利用<code>RestTemplate</code>发起远程调用的代码是这样的：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/9ca03769551f7970a73c4517d7074952.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>存在下面的问题：</p><ul><li><p>代码可读性差，编程体验不统一</p></li><li><p>参数复杂URL难以维护</p></li></ul>',7),g={href:"https://github.com/OpenFeign/feign",target:"_blank",rel:"noopener noreferrer"},k=e(`<p>其作用就是帮助我们优雅的实现http请求的发送，解决上面提到的问题。</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/0489c90e8c01db06c3e8e25c2cf26812.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h2 id="_2-1-feign替代resttemplate" tabindex="-1"><a class="header-anchor" href="#_2-1-feign替代resttemplate" aria-hidden="true">#</a> 2.1.Feign替代RestTemplate</h2><p>Fegin的使用步骤如下：</p><h3 id="_1-引入依赖" tabindex="-1"><a class="header-anchor" href="#_1-引入依赖" aria-hidden="true">#</a> 1）引入依赖</h3><p>我们在order-service服务的pom文件中引入feign的依赖：</p><div class="language-xml line-numbers-mode" data-ext="xml"><pre class="language-xml"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependency</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">&gt;</span></span>org.springframework.cloud<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">&gt;</span></span>spring-cloud-starter-openfeign<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependency</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-添加注解" tabindex="-1"><a class="header-anchor" href="#_2-添加注解" aria-hidden="true">#</a> 2）添加注解</h3><p>在order-service的启动类添加注解开启Feign的功能：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/307c15d119cf2e8d4439add429c523d1.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="_3-编写feign的客户端" tabindex="-1"><a class="header-anchor" href="#_3-编写feign的客户端" aria-hidden="true">#</a> 3）编写Feign的客户端</h3><p>在order-service中新建一个接口，内容如下：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">package</span> <span class="token namespace">cn<span class="token punctuation">.</span>itcast<span class="token punctuation">.</span>order<span class="token punctuation">.</span>client</span><span class="token punctuation">;</span>

<span class="token keyword">import</span> <span class="token import"><span class="token namespace">cn<span class="token punctuation">.</span>itcast<span class="token punctuation">.</span>order<span class="token punctuation">.</span>pojo<span class="token punctuation">.</span></span><span class="token class-name">User</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>cloud<span class="token punctuation">.</span>openfeign<span class="token punctuation">.</span></span><span class="token class-name">FeignClient</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>web<span class="token punctuation">.</span>bind<span class="token punctuation">.</span>annotation<span class="token punctuation">.</span></span><span class="token class-name">GetMapping</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>web<span class="token punctuation">.</span>bind<span class="token punctuation">.</span>annotation<span class="token punctuation">.</span></span><span class="token class-name">PathVariable</span></span><span class="token punctuation">;</span>

<span class="token annotation punctuation">@FeignClient</span><span class="token punctuation">(</span><span class="token string">&quot;userservice&quot;</span><span class="token punctuation">)</span>
<span class="token keyword">public</span> <span class="token keyword">interface</span> <span class="token class-name">UserClient</span> <span class="token punctuation">{</span>
    <span class="token annotation punctuation">@GetMapping</span><span class="token punctuation">(</span><span class="token string">&quot;/user/{id}&quot;</span><span class="token punctuation">)</span>
    <span class="token class-name">User</span> <span class="token function">findById</span><span class="token punctuation">(</span><span class="token annotation punctuation">@PathVariable</span><span class="token punctuation">(</span><span class="token string">&quot;id&quot;</span><span class="token punctuation">)</span> <span class="token class-name">Long</span> id<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个客户端主要是基于SpringMVC的注解来声明远程调用的信息，比如：</p><ul><li>服务名称：userservice</li><li>请求方式：GET</li><li id="">请求路径：/user/</li><li>请求参数：Long id</li><li>返回值类型：User</li></ul><p>这样，Feign就可以帮助我们发送http请求，无需自己使用RestTemplate来发送了。</p><h3 id="_4-测试" tabindex="-1"><a class="header-anchor" href="#_4-测试" aria-hidden="true">#</a> 4）测试</h3><p>修改order-service中的OrderService类中的queryOrderById方法，使用Feign客户端代替RestTemplate：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/00b3a6299b17e245b871a74014e119b7.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>是不是看起来优雅多了。</p><h3 id="_5-总结" tabindex="-1"><a class="header-anchor" href="#_5-总结" aria-hidden="true">#</a> 5）总结</h3><p>使用Feign的步骤：</p><p>① 引入依赖</p><p>② 添加@EnableFeignClients注解</p><p>③ 编写FeignClient接口</p><p>④ 使用FeignClient中定义的方法代替RestTemplate</p>`,26),m=e(`<figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/6c025066755ee2d737bf4964649ddcab.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h2 id="_2-2-自定义配置" tabindex="-1"><a class="header-anchor" href="#_2-2-自定义配置" aria-hidden="true">#</a> 2.2.自定义配置</h2><p>Feign可以支持很多的自定义配置，如下表所示：</p><table><thead><tr><th>类型</th><th>作用</th><th>说明</th></tr></thead><tbody><tr><td><strong>feign.Logger.Level</strong></td><td>修改日志级别</td><td>包含四种不同的级别：NONE、BASIC、HEADERS、FULL</td></tr><tr><td>feign.codec.Decoder</td><td>响应结果的解析器</td><td>http远程调用的结果做解析，例如解析json字符串为java对象</td></tr><tr><td>feign.codec.Encoder</td><td>请求参数编码</td><td>将请求参数编码，便于通过http请求发送</td></tr><tr><td>feign.Contract</td><td>支持的注解格式</td><td>默认是SpringMVC的注解</td></tr><tr><td>feign.Retryer</td><td>失败重试机制</td><td>请求失败的重试机制，默认是没有，不过会使用Ribbon的重试</td></tr></tbody></table><p>一般情况下，默认值就能满足我们使用，如果要自定义时，只需要创建自定义的@Bean覆盖默认Bean即可。</p><p>下面以日志为例来演示如何自定义配置。</p><h3 id="_2-2-1-配置文件方式" tabindex="-1"><a class="header-anchor" href="#_2-2-1-配置文件方式" aria-hidden="true">#</a> 2.2.1.配置文件方式</h3><p>基于配置文件修改feign的日志级别可以针对单个服务：</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">feign</span><span class="token punctuation">:</span>  
  <span class="token key atrule">client</span><span class="token punctuation">:</span>
    <span class="token key atrule">config</span><span class="token punctuation">:</span> 
      <span class="token key atrule">userservice</span><span class="token punctuation">:</span> <span class="token comment"># 针对某个微服务的配置</span>
        <span class="token key atrule">loggerLevel</span><span class="token punctuation">:</span> FULL <span class="token comment">#  日志级别 </span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>也可以针对所有服务：</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">feign</span><span class="token punctuation">:</span>  
  <span class="token key atrule">client</span><span class="token punctuation">:</span>
    <span class="token key atrule">config</span><span class="token punctuation">:</span> 
      <span class="token key atrule">default</span><span class="token punctuation">:</span> <span class="token comment"># 这里用default就是全局配置，如果是写服务名称，则是针对某个微服务的配置</span>
        <span class="token key atrule">loggerLevel</span><span class="token punctuation">:</span> FULL <span class="token comment">#  日志级别 </span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>而日志的级别分为四种：</p>`,12),v=n("li",null,"NONE：不记录任何日志信息，这是默认值。",-1),h={href:"http://userservice/user/1%EF%BC%89",target:"_blank",rel:"noopener noreferrer"},b=n("li",null,"HEADERS：在BASIC的基础上，额外记录了请求和响应的头信息",-1),f=n("li",null,"FULL：记录所有请求和响应的明细，包括头信息、请求体、元数据。",-1),y=e(`<h3 id="_2-2-2-java代码方式" tabindex="-1"><a class="header-anchor" href="#_2-2-2-java代码方式" aria-hidden="true">#</a> 2.2.2.Java代码方式</h3><p>也可以基于Java代码来修改日志级别，先声明一个类，然后声明一个Logger.Level的对象：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">DefaultFeignConfiguration</span>  <span class="token punctuation">{</span>
    <span class="token annotation punctuation">@Bean</span>
    <span class="token keyword">public</span> <span class="token class-name">Logger<span class="token punctuation">.</span>Level</span> <span class="token function">feignLogLevel</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token class-name">Logger<span class="token punctuation">.</span>Level</span><span class="token punctuation">.</span><span class="token constant">BASIC</span><span class="token punctuation">;</span> <span class="token comment">// 日志级别为BASIC</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果要<strong>全局生效</strong>，将其放到启动类的@EnableFeignClients这个注解中：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@EnableFeignClients</span><span class="token punctuation">(</span>defaultConfiguration <span class="token operator">=</span> <span class="token class-name">DefaultFeignConfiguration</span> <span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span> 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>如果是<strong>局部生效</strong>，则把它放到对应的@FeignClient这个注解中：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@FeignClient</span><span class="token punctuation">(</span>value <span class="token operator">=</span> <span class="token string">&quot;userservice&quot;</span><span class="token punctuation">,</span> configuration <span class="token operator">=</span> <span class="token class-name">DefaultFeignConfiguration</span> <span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span> 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="_2-3-feign使用优化" tabindex="-1"><a class="header-anchor" href="#_2-3-feign使用优化" aria-hidden="true">#</a> 2.3.Feign使用优化</h2><blockquote><p>Feign是声明式客户端，它只是把我们的==请求(声明)==变成HTTP请求，最终发http请求时，还是会用到别的一些组件</p></blockquote><p>Feign底层发起http请求，依赖于其它的框架。其底层客户端实现包括：</p><ul><li><p>URLConnection：默认实现，<mark>不支持连接池</mark></p></li><li><p>Apache HttpClient ：支持连接池</p></li><li><p>OKHttp：支持连接池</p></li></ul><p>因此提高Feign的性能主要手段就是使用<strong>连接池</strong>代替默认的URLConnection。</p><p>这里我们用Apache的HttpClient来演示。</p><p>1）引入依赖</p><p>在order-service的pom文件中引入Apache的HttpClient依赖：</p><blockquote><p>这个依赖已经被spring管理起来了，所以我们不需要管版本，只需要引就可以了</p></blockquote><div class="language-xml line-numbers-mode" data-ext="xml"><pre class="language-xml"><code><span class="token comment">&lt;!--httpClient的依赖 --&gt;</span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependency</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">&gt;</span></span>io.github.openfeign<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">&gt;</span></span>feign-httpclient<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependency</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>2）配置连接池</p><p>在order-service的application.yml中添加配置：</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">feign</span><span class="token punctuation">:</span>
  <span class="token key atrule">client</span><span class="token punctuation">:</span>
    <span class="token key atrule">config</span><span class="token punctuation">:</span>
      <span class="token key atrule">default</span><span class="token punctuation">:</span> <span class="token comment"># default全局的配置</span>
        <span class="token key atrule">loggerLevel</span><span class="token punctuation">:</span> BASIC <span class="token comment"># 日志级别，BASIC就是基本的请求和响应信息</span>
  <span class="token key atrule">httpclient</span><span class="token punctuation">:</span>
    <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">true</span> <span class="token comment"># 开启feign对HttpClient的支持</span>
    <span class="token key atrule">max-connections</span><span class="token punctuation">:</span> <span class="token number">200</span> <span class="token comment"># 最大的连接数</span>
    <span class="token key atrule">max-connections-per-route</span><span class="token punctuation">:</span> <span class="token number">50</span> <span class="token comment"># 每个路径的最大连接数</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>接下来，在FeignClientFactoryBean中的loadBalance方法中打断点：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/abb4e264235626581d4acd6ad80e2246.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>Debug方式启动order-service服务，可以看到这里的client，底层就是Apache HttpClient：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/f2912662f4a0ec6592e3ed4684ed7590.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>总结，Feign的优化：</p><p>1.日志级别尽量用basic</p><p>2.使用HttpClient或OKHttp代替URLConnection</p><p>① 引入feign-httpClient依赖</p><p>② 配置文件开启httpClient功能，设置连接池参数</p><h2 id="_2-4-最佳实践" tabindex="-1"><a class="header-anchor" href="#_2-4-最佳实践" aria-hidden="true">#</a> 2.4.最佳实践</h2><p>所谓最佳实践，就是使用过程中总结的经验，最好的一种使用方式。</p><p>仔细观察可以发现，Feign的客户端与服务提供者的controller代码非常相似：</p><p>feign客户端：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/868de537e2ea78ec9253c13d9ea6de98.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>UserController：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/2c856eda05dabb96737f3ccb1ff4b4cc.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>有没有一种办法简化这种重复的代码编写呢？</p><p><mark>上面这个接口最终的目的是什么：</mark></p><p><mark>是让消费者基于声明的信息，去发送一次HTTP的请求，最终这个请求到哪里啊？</mark></p><p><mark>是不是一定会到达，这个<code>userservice</code>服务对应的一个实例，最后到达<code>userservice</code>的<code>UsreController</code>。</mark></p><h3 id="_2-4-1-继承方式" tabindex="-1"><a class="header-anchor" href="#_2-4-1-继承方式" aria-hidden="true">#</a> 2.4.1.继承方式</h3><p>一样的代码可以通过继承来共享（<strong>契约编程</strong>）：</p><p>1）定义一个API接口，利用定义方法，并基于SpringMVC注解做声明。</p><p>2）Feign客户端和Controller都集成该接口</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/678b00f03852a3f4bc6988db97c3f7bc.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>优点：</p><ul><li>简单</li><li>实现了代码共享</li></ul><p>缺点：</p><ul><li><p>服务提供方、服务消费方紧耦合</p></li><li><p>参数列表中的注解映射并不会继承，因此Controller中必须再次声明方法、参数列表、注解</p></li></ul><h3 id="_2-4-2-抽取方式" tabindex="-1"><a class="header-anchor" href="#_2-4-2-抽取方式" aria-hidden="true">#</a> 2.4.2.抽取方式</h3><p>将Feign的Client抽取为独立模块，并且把接口有关的POJO、默认的Feign配置都放到这个模块中，提供给所有消费者使用。</p><p>例如，将UserClient、User、Feign的默认配置都抽取到一个feign-api包中，所有微服务引用该依赖包，即可直接使用。</p><blockquote><p>UserController对外暴露了查询用户的接口，这两个微服务都想要去查询用户，以前是你写你的Client，我写我的Client；</p><p>但是将来我的微服务越来越多，十几个都来调UserService，那这个client是不是等于写了十多遍了；</p><p>重复开发</p></blockquote><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/a0097cfc1bdf63ca19f39b45d22b39f6.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><blockquote><p>Feign调用的过程中，是不是会创建实体类，那我也帮你们定义好，省的你俩都得写实体类；</p><p>是不是以后还要写配置啊，你们也不用配了，我帮你们做一个默认配置；</p><p>这里接口肯定也不只一个，全都给你定义进来；</p><p>以后怎么用呢？引依赖，导jar包；</p></blockquote><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/d3bb46f8036d46c75b624e947da02335.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="_2-4-3-实现基于抽取的最佳实践" tabindex="-1"><a class="header-anchor" href="#_2-4-3-实现基于抽取的最佳实践" aria-hidden="true">#</a> 2.4.3.实现基于抽取的最佳实践</h3><h4 id="_1-抽取" tabindex="-1"><a class="header-anchor" href="#_1-抽取" aria-hidden="true">#</a> 1）抽取</h4><p>首先创建一个module，命名为feign-api：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/23f76cb08518bd37325c4f14205021f2.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>项目结构：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/597ffbe46c831157b7f619d53144d7d8.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>在feign-api中然后引入feign的starter依赖</p><div class="language-xml line-numbers-mode" data-ext="xml"><pre class="language-xml"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependency</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">&gt;</span></span>org.springframework.cloud<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">&gt;</span></span>spring-cloud-starter-openfeign<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependency</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后，order-service中编写的UserClient、User、DefaultFeignConfiguration都复制到feign-api项目中</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/6477e2dfa1f553ca89185076a75c7f38.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h4 id="_2-在order-service中使用feign-api" tabindex="-1"><a class="header-anchor" href="#_2-在order-service中使用feign-api" aria-hidden="true">#</a> 2）在order-service中使用feign-api</h4><p>首先，删除order-service中的UserClient、User、DefaultFeignConfiguration等类或接口。</p><p>在order-service的pom文件中中引入feign-api的依赖：</p><div class="language-xml line-numbers-mode" data-ext="xml"><pre class="language-xml"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependency</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">&gt;</span></span>cn.itcast.demo<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">&gt;</span></span>feign-api<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>version</span><span class="token punctuation">&gt;</span></span>1.0<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>version</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependency</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>修改order-service中的所有与上述三个组件有关的导包部分，改成导入feign-api中的包</p><h4 id="_3-重启测试" tabindex="-1"><a class="header-anchor" href="#_3-重启测试" aria-hidden="true">#</a> 3）重启测试</h4><p>重启后，发现服务报错了：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/b3b8266f3ea03a95891ba095c4e4bb57.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>这是因为UserClient现在在cn.itcast.feign.clients包下，、</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/1429b38a0ced32853e95205ecfe15253.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>没有报错只是因为确实有这个类，但是没有被注册进spring容器；</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>为什么？
OrderApplication启动类扫描的是自己所在的包，也就是package cn.itcast.order；
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_4-解决扫描包问题" tabindex="-1"><a class="header-anchor" href="#_4-解决扫描包问题" aria-hidden="true">#</a> 4）解决扫描包问题</h4><p>方式一：</p><p>指定Feign应该扫描的包：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@EnableFeignClients</span><span class="token punctuation">(</span>basePackages <span class="token operator">=</span> <span class="token string">&quot;cn.itcast.feign.clients&quot;</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>方式二：</p><p>指定需要加载的Client接口（<strong>各种各样的</strong>）：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@EnableFeignClients</span><span class="token punctuation">(</span>clients <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token class-name">UserClient</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/a7e707f5cc22e8a1ae02e742ace28f3d.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>成功！</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/d33e47e1a0e2bcd36771ebe0e22cdfaa.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>`,88);function x(_,C){const t=c("ExternalLinkIcon"),p=c("font");return l(),d("div",null,[u,n("p",null,[a("Feign是一个声明式的http客户端，官方地址："),n("a",g,[a("https://github.com/OpenFeign/feign"),s(t)])]),k,s(p,{color:"LightSalmon"},{default:i(()=>[a("Feign不仅实现了远程调用，而且还是实现了负载均衡，查看依赖树：")]),_:1}),s(p,{color:"HotPink"},{default:i(()=>[a("发现Feign集成了Ribbon")]),_:1}),m,n("ul",null,[v,n("li",null,[a("BASIC：仅记录请求的方法（GET），URL（"),n("a",h,[a("http://userservice/user/1）"),s(t)]),a(", 请求协议（HTTP /1.1），以及响应状态码(200)和执行时间(4ms)")]),b,f]),y])}const F=o(r,[["render",x],["__file","Feign.html.vue"]]);export{F as default};