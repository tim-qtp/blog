import{_ as l,W as s,X as t,$ as i,a0 as e,Z as a,a2 as d,C as r}from"./framework-6a3aa88c.js";const c={},o=d(`<h2 id="_1-sentinel限流" tabindex="-1"><a class="header-anchor" href="#_1-sentinel限流" aria-hidden="true">#</a> 1 Sentinel限流</h2><p>​ 随着微服务的流行，服务和服务之间的稳定性变得越来越重要。 Sentinel 以流量为切入点，从流量控制、熔断降级、系统负载保护等多个维度保护服务的稳定性。</p><h3 id="_1-1-sentinel介绍" tabindex="-1"><a class="header-anchor" href="#_1-1-sentinel介绍" aria-hidden="true">#</a> 1.1 Sentinel介绍</h3><p>Sentinel 具有以下特征:</p><div class="language-Plaintext line-numbers-mode" data-ext="Plaintext"><pre class="language-Plaintext"><code>1.丰富的应用场景： Sentinel 承接了阿里巴巴近 10 年的双十一大促销流量的核心场景，例如秒杀（即突发流量控制在系统容量可以承受的范围）、消息削峰填谷、实时熔断下游不可用应用等。

2.完备的实时监控： Sentinel 同时提供实时的监控功能。您可以在控制台中看到接入应用的单台机器秒级数据，甚至 500 台以下规模的集群的汇总运行情况。

3.广泛的开源生态： Sentinel 提供开箱即用的与其它开源框架/库的整合模块，例如与 Spring Cloud、Dubbo、gRPC 的整合。您只需要引入相应的依赖并进行简单的配置即可快速地接入 Sentinel。

4.完善的 SPI 扩展点： Sentinel 提供简单易用、完善的 SPI 扩展点。您可以通过实现扩展点，快速的定制逻辑。例如定制规则管理、适配数据源等。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>​ Sentinel 目前已经针对 Servlet、Dubbo、Spring Boot/Spring Cloud、gRPC 等进行了适配，用户只需引入相应依赖并进行简单配置即可非常方便地享受 Sentinel 的高可用流量防护能力。Sentinel 还为 Service Mesh 提供了集群流量防护的能力。未来 Sentinel 还会对更多常用框架进行适配。</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503060559667.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>Sentinel 分为两个部分:</p><ul><li>核心库（Java 客户端）不依赖任何框架/库，能够运行于所有 Java 运行时环境，同时对 Dubbo / Spring Cloud 等框架也有较好的支持。</li><li>控制台（Dashboard）基于 Spring Boot 开发，打包后可以直接运行，不需要额外的 Tomcat 等应用容器。</li></ul><p>Sentinel 的关注点在于：</p><ul><li>多样化的流量控制</li><li>熔断降级</li><li>系统负载保护</li><li>实时监控和控制台</li></ul><p>Sentinel和Hystrix对比：</p><table><thead><tr><th></th><th>Sentinel</th><th>Hystrix</th></tr></thead><tbody><tr><td>隔离策略</td><td>信号量隔离（并发线程数限流）</td><td>线程池隔离/信号量隔离</td></tr><tr><td>熔断降级策略</td><td>基于响应时间、异常比率、异常数</td><td>基于异常比率</td></tr><tr><td>实时指标实现</td><td>滑动窗口（LeapArray）</td><td>滑动窗口（基于 RxJava）</td></tr><tr><td>规则配置</td><td>支持多种数据源</td><td>支持多种数据源</td></tr><tr><td>扩展性</td><td>多个扩展点</td><td>插件的形式</td></tr><tr><td>基于注解的支持</td><td>支持</td><td>支持</td></tr><tr><td>调用链路信息</td><td>支持同步调用</td><td>不支持</td></tr><tr><td>限流</td><td>基于 QPS / 并发数，支持基于调用关系的限流</td><td>有限支持</td></tr><tr><td>流量整形</td><td>支持慢启动、匀速器模式</td><td>不支持</td></tr><tr><td>系统负载保护</td><td>支持</td><td>不支持</td></tr><tr><td>控制台</td><td>开箱即用，可配置规则、查看秒级监控、机器发现等</td><td>较为简单</td></tr><tr><td>常见框架的适配</td><td>Servlet、Spring Cloud、Dubbo、gRPC 等</td><td>Servlet、Spring Cloud Netflix</td></tr></tbody></table><h3 id="_1-2-sentinel控制台安装" tabindex="-1"><a class="header-anchor" href="#_1-2-sentinel控制台安装" aria-hidden="true">#</a> 1.2 Sentinel控制台安装</h3><p>​ Sentinel 提供一个轻量级的开源控制台，它提供机器发现以及健康情况管理、监控（单机和集群）、规则管理和推送的功能。<code>https://github.com/alibaba/Sentinel/wiki/%E6%8E%A7%E5%88%B6%E5%8F%B0</code></p><p>Sentinel 控制台包含如下功能:</p><ul><li><strong>查看机器列表以及健康情况</strong>：收集 Sentinel 客户端发送的心跳包，用于判断机器是否在线。</li><li><strong>监控</strong> (单机和集群聚合)：通过 Sentinel 客户端暴露的监控 API，定期拉取并且聚合应用监控信息，最终可以实现秒级的实时监控。</li><li><strong>规则管理和推送</strong>：统一管理推送规则。</li><li><strong>鉴权</strong>：生产环境中鉴权非常重要。这里每个开发者需要根据自己的实际情况进行定制。</li></ul><p>1)jar包运行方式安装</p>`,18),v={href:"https://github.com/alibaba/Sentinel/releases",target:"_blank",rel:"noopener noreferrer"},u=i("p",null,"jar包下载后，直接启动即可，启动命令如下：",-1),p=i("div",{class:"language-Shell line-numbers-mode","data-ext":"Shell"},[i("pre",{class:"language-Shell"},[i("code",null,`java -Dserver.port=8858 -Dcsp.sentinel.dashboard.server=localhost:8080 -Dproject.name=sentinel-dashboard -jar sentinel-dashboard-1.7.2.jar
`)]),i("div",{class:"line-numbers","aria-hidden":"true"},[i("div",{class:"line-number"})])],-1),m={href:"http://localhost:8858",target:"_blank",rel:"noopener noreferrer"},g=d(`<figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503060559595.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>登录的账号密码都是sentinel。</p><p>2)Docker安装</p><div class="language-Shell line-numbers-mode" data-ext="Shell"><pre class="language-Shell"><code>docker pull bladex/sentinel-dashboard

docker run --name sentinel -d -p 8858:8858 -d bladex/sentinel-dashboard
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,4),b={href:"http://192.168.200.188:8858/",target:"_blank",rel:"noopener noreferrer"},h=d(`<figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503060559570.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="_1-3-sentinel案例" tabindex="-1"><a class="header-anchor" href="#_1-3-sentinel案例" aria-hidden="true">#</a> 1.3 Sentinel案例</h3><p>​ 我们基于SpringCloud工程集成Sentinel，实现限流操作。为了节省时间，我们可以直接把写好的半成品案例导入到IDEA中来，将<code>资料\\sentinel</code>中的sentinel工程导入进来，分别有一个生产者一个消费者和一个微服务网关。</p><p>生产者：<code>provider</code></p><p>消费者：<code>consumer</code></p><p>微服务网关：<code>gateway</code></p><h4 id="_1-3-1-基于feign的服务降级" tabindex="-1"><a class="header-anchor" href="#_1-3-1-基于feign的服务降级" aria-hidden="true">#</a> 1.3.1 基于Feign的服务降级</h4><p>​ 因为我们项目中服务之间调用使用的是feign，因此这里只讲解基于feign的服务降级实现。</p><p>1)引入依赖包：</p><p>在消费者中引入sentinel的包。</p><div class="language-XML line-numbers-mode" data-ext="XML"><pre class="language-XML"><code>&lt;!-- spring cloud alibaba sentinel 依赖 --&gt;
&lt;dependency&gt;
    &lt;groupId&gt;com.alibaba.cloud&lt;/groupId&gt;
    &lt;artifactId&gt;spring-cloud-starter-alibaba-sentinel&lt;/artifactId&gt;
&lt;/dependency&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>2)Sentinel配置</p><p>​ Sentinel 适配了 Feign 组件。如果想使用，除了引入 spring-cloud-starter-alibaba-sentinel 的依赖外还需要 开启Sentinel对feign的支持，并且配置控制台信息，我们可以在bootstrap.yml中配置，配置如下：</p><div class="language-Plaintext line-numbers-mode" data-ext="Plaintext"><pre class="language-Plaintext"><code>spring:
  cloud:
    #sentinel
    sentinel:
      transport:
        port: 8719
        dashboard: 192.168.200.188:8858

#Sentinel对feign的支持
feign:
  sentinel:
    enabled: true
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>3)配置服务降级方法</p><p>​ 服务降级的方法就是原来springcloud中的服务降级配置，这里的配置完全是feign的配置，所以不详细讲解了。</p><p>​ 创建服务降级处理工厂对象<code>com.itheima.feign.fallback.GoodsFeignFallback</code>，代码如下：</p><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>@Component
public class GoodsFeignFallback implements FallbackFactory&lt;GoodsFeign&gt; {

    @Override
    public GoodsFeign create(Throwable throwable) {
        return max -&gt; &quot;服务降级&quot;;
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>​ 在feign上添加fallbackFactory指向服务降级的工厂类对象，代码如下：</p><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>@FeignClient(value = &quot;goods&quot;,fallbackFactory = GoodsFeignFallback.class)
public interface GoodsFeign {

    /***
     * 获取一件商品
     */
    @GetMapping(value = &quot;/goods/one/{max}&quot;)
    String one(@PathVariable(value = &quot;max&quot;)Integer max);
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_1-3-2-sentinel控制台使用" tabindex="-1"><a class="header-anchor" href="#_1-3-2-sentinel控制台使用" aria-hidden="true">#</a> 1.3.2 Sentinel控制台使用</h4>`,21),f={href:"http://192.168.200.188:8858/#/dashboard/home%EF%BC%8C%E6%95%88%E6%9E%9C%E5%A6%82%E4%B8%8B%EF%BC%9A",target:"_blank",rel:"noopener noreferrer"},_=d(`<figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503060559583.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p><strong>指定方法流量实时监控：</strong></p><p>选择 实时监控，再输入被访问的方法名字，就会出现指定方法访问的流量报表，如下图：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503060559651.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p><strong>簇点链路</strong></p><p>这块主要是单个节点中所有资源以及实时的调用数据，如下图：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503060559592.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h5 id="_1-3-2-1-流量控制" tabindex="-1"><a class="header-anchor" href="#_1-3-2-1-流量控制" aria-hidden="true">#</a> 1.3.2.1 流量控制</h5><p><strong>流控：</strong></p><p>​ 在上图中，针对每个资源都有3个操作按钮，其中流控主要用于做流量控制操作，其原理是监控应用流量的 QPS 或并发线程数等指标，当达到指定的阈值时对流量进行控制，以避免被瞬时的流量高峰冲垮，从而保障应用的高可用性。</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503060559226.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>讲解：</p><div class="language-Plaintext line-numbers-mode" data-ext="Plaintext"><pre class="language-Plaintext"><code>resource：资源名，即限流规则的作用对象
count: 限流阈值
grade: 限流阈值类型（QPS 或并发线程数）
limitApp: 流控针对的调用来源，若为 default 则不区分调用来源
strategy: 调用关系限流策略
controlBehavior: 流量控制效果（直接拒绝、Warm Up、匀速排队）
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>流控模式：</p><div class="language-Plaintext line-numbers-mode" data-ext="Plaintext"><pre class="language-Plaintext"><code>直接（默认）：接口达到限流条件时，开启限流
关联：当关联的资源达到限流条件时，开启限流，适合做应用让步。例如为一个查询的接口添加关联流控，关联资源为一个更新的接口，当更新的接口达到阈值时，开启查询接口的限流：为更新接口让步服务器资源。
链路： 当从某个接口过来的资源达到限流条件时，开启限流。它的功能有点类似于针对来源配置项，区别在于：针对来源是针对上级微服务，而链路流控是针对上级接口，也就是说它的粒度更细
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>流控效果：</p><div class="language-Plaintext line-numbers-mode" data-ext="Plaintext"><pre class="language-Plaintext"><code>快速失败：
        当QPS超过任何规则的阈值后，新的请求就会立即拒绝，拒绝方式为抛出FlowException . 这种方式适用于对系统处理能力确切已知的情况下，比如通过压测确定了系统的准确水位时。
        
Warm Up：
        当系统长期处理低水平的情况下，当流量突然增加时，直接把系统拉升到高水位可能瞬间把系统压垮。通过&quot;冷启动&quot;，让通过的流量缓慢增加，在一定时间内逐渐增加到阈值的上限，给系统一个预热的时间，避免冷系统被压垮。
        
排队等待：
        匀速排队严格控制请求通过的时间间隔，也即是让请求以均匀的速度通过，对应的是漏桶算法。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="_1-3-2-2-降级规则" tabindex="-1"><a class="header-anchor" href="#_1-3-2-2-降级规则" aria-hidden="true">#</a> 1.3.2.2 降级规则</h5><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503060559165.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>RT（慢调用比例）：</p><p>当资源的响应时间超过最大RT（以ms为单位，最大RT即最大响应时间）之后，资源进入准降级状态。如果接下来1s内持续进入5个请求（最小请求数），它们的RT都持续超过这个阈值，那么在接下来的熔断时长之内，就会对这个方法进行服务降级。其中的“比例阈值”我设置发现无效，下次编辑会重置成1</p><p>异常比例：</p><p>当资源的每秒请求数大于等于最小请求数，并且异常总数占通过量的比例超过比例阈值时，资源进入降级状态。</p><p>异常数量：</p><p>当资源近1分钟的异常数目超过阈值（异常数）之后会进行服务降级。注意由于统计时间窗口是分钟级别的，若熔断时长小于60s，则结束熔断状态后仍可能再次进入熔断状态。</p><h5 id="_1-3-2-3-热点规则" tabindex="-1"><a class="header-anchor" href="#_1-3-2-3-热点规则" aria-hidden="true">#</a> 1.3.2.3 热点规则</h5><p>​ 热点即经常访问的数据。很多时候我们希望统计某个热点数据中访问频次最高的 Top K 数据，并对其访问进行限制。</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503060559236.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>参数说明：</p>`,29),x={href:"https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503060559376.png",target:"_blank",rel:"noopener noreferrer"},y=d(`<h5 id="_1-3-2-4-黑白名单" tabindex="-1"><a class="header-anchor" href="#_1-3-2-4-黑白名单" aria-hidden="true">#</a> 1.3.2.4 黑白名单</h5><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503060559298.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>参数说明：</p><table><thead><tr><th>Field</th><th>说明</th><th>默认值</th></tr></thead><tbody><tr><td>resource</td><td>资源名，即限流规则的作用对象</td><td>-</td></tr><tr><td>limitApp</td><td>对应的黑名单/白名单，不同 origin 用 <code>,</code> 分隔，如 <code>appA,appB</code></td><td>default，代表不区分调用来源</td></tr><tr><td>strategy</td><td>限制模式，<code>AUTHORITY_WHITE</code> 为白名单模式，<code>AUTHORITY_BLACK</code> 为黑名单模式，默认为白名单模式</td><td>AUTHORITY_WHITE</td></tr></tbody></table><h3 id="_1-4-微服务网关sentinel限流" tabindex="-1"><a class="header-anchor" href="#_1-4-微服务网关sentinel限流" aria-hidden="true">#</a> 1.4 微服务网关Sentinel限流</h3><p>​ 在秒杀项目中，我们需要集成Sentinel进行限流操作，有些商品目前属于非热点商品，但也有可能存在部分商品会在中途突然增加抢购热度成为热点，成为热点有可能会导致瞬间的流量膨胀，这时候我们可以采用Sentinel做限流操作，以实现对后台微服务的保护。后台秒杀我们在微服务网关进行限流操作。</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503060559374.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>1)引入依赖</p><p>微服务网关集成Sentinel限流，确认引入如下依赖包：</p><div class="language-XML line-numbers-mode" data-ext="XML"><pre class="language-XML"><code>&lt;!--Sentinel--&gt;
&lt;dependency&gt;
    &lt;groupId&gt;com.alibaba.cloud&lt;/groupId&gt;
    &lt;artifactId&gt;spring-cloud-alibaba-sentinel-gateway&lt;/artifactId&gt;
&lt;/dependency&gt;

&lt;!-- spring cloud alibaba sentinel 依赖 --&gt;
&lt;dependency&gt;
    &lt;groupId&gt;com.alibaba.cloud&lt;/groupId&gt;
    &lt;artifactId&gt;spring-cloud-starter-alibaba-sentinel&lt;/artifactId&gt;
&lt;/dependency&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>2)配置控制台信息</p><p>在bootstrap.yml中配置endpoint以及控制台信息，配置如下：</p><div class="language-YAML line-numbers-mode" data-ext="YAML"><pre class="language-YAML"><code>spring:
  cloud:
    #sentinel
    sentinel:
      transport:
        port: 8719
        dashboard: 192.168.211.137:8858
        
#endpoint
management:
  endpoints:
    web:
      exposure:
        include: &#39;*&#39;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>现在所有的集成就成功了，我们启动微服务网关，看看Sentinel控制台也会显示微服务网关的节点信息，并且可以在控制台配置限流策略。</p><h2 id="_2-nginx限流" tabindex="-1"><a class="header-anchor" href="#_2-nginx限流" aria-hidden="true">#</a> 2 nginx限流</h2><p>一般情况下，首页的并发量是比较大的，即使 有了多级缓存，当用户不停的刷新页面的时候，也是没有必要的，另外如果有恶意的请求 大量达到，也会对系统造成影响。</p><p>而限流就是保护措施之一。</p><h3 id="_2-1-生活中限流对比" tabindex="-1"><a class="header-anchor" href="#_2-1-生活中限流对比" aria-hidden="true">#</a> 2.1 生活中限流对比</h3><ul><li>水坝泄洪，通过闸口限制洪水流量（控制流量速度）。</li><li>办理银行业务：所有人先领号，各窗口叫号处理。每个窗口处理速度根据客户具体业务而定，所有人排队等待叫号即可。若快下班时，告知客户明日再来(拒绝流量)</li><li>火车站排队买票安检，通过排队的方式依次放入。（缓存等待处理任务）</li></ul><h3 id="_2-2-nginx的限流" tabindex="-1"><a class="header-anchor" href="#_2-2-nginx的限流" aria-hidden="true">#</a> 2.2 nginx的限流</h3><p>nginx提供两种限流的方式：</p><ul><li>一是控制速率</li><li>二是控制并发连接数</li></ul><h4 id="_2-2-1-控制速率" tabindex="-1"><a class="header-anchor" href="#_2-2-1-控制速率" aria-hidden="true">#</a> 2.2.1 控制速率</h4><p>控制速率的方式之一就是采用漏桶算法。</p><p>(1)漏桶算法实现控制速率限流</p><p>漏桶(Leaky Bucket)算法思路很简单，水(请求)先进入到漏桶里，漏桶以一定的速度出水(接口有响应速率)，当水流入速度过大会直接溢出(访问频率超过接口响应速率)，然后就拒绝请求，可以看出漏桶算法能强行限制数据的传输速率，示意图如下:</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503060559772.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>(2)nginx的配置</p><p>配置示意图如下：</p><p>修改<code>/usr/local/openresty/nginx/conf/nginx.conf</code>:</p><div class="language-Nginx line-numbers-mode" data-ext="Nginx"><pre class="language-Nginx"><code>#限流设置   binary_remote_addr:根据请求IP进行限流  contentRateLimit:缓存空间名称 10m:缓存空间
#rate=2r/s:每秒钟允许有2个请求被处理
limit_req_zone $binary_remote_addr zone=contentRateLimit:10m rate=2r/s;

server {
    ......
    #静态页
    location /items/ {
      #限流
      limit_req zone=contentRateLimit;
      try_files $uri @np;
        } 
    ......
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>配置说明：</p><div class="language-Plaintext line-numbers-mode" data-ext="Plaintext"><pre class="language-Plaintext"><code>binary_remote_addr 是一种key，表示基于 remote_addr(客户端IP) 来做限流，binary_ 的目的是压缩内存占用量。
zone：定义共享内存区来存储访问信息， contentRateLimit:10m 表示一个大小为10M，名字为contentRateLimit的内存区域。1M能存储16000 IP地址的访问信息，10M可以存储16W IP地址访问信息。
rate 用于设置最大访问速率，rate=10r/s 表示每秒最多处理10个请求。Nginx 实际上以毫秒为粒度来跟踪请求信息，因此 10r/s 实际上是限制：每100毫秒处理一个请求。这意味着，自上一个请求处理完后，若后续100毫秒内又有请求到达，将拒绝处理该请求.我们这里设置成2 方便测试。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>测试：</p><p>重新加载配置文件</p><div class="language-Plaintext line-numbers-mode" data-ext="Plaintext"><pre class="language-Plaintext"><code>cd /usr/local/openresty/nginx/sbin

./nginx -s reload
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>访问页面：<code>http://192.168.211.137/web/items/S1235433012716498944.html</code>，连续刷新会直接报错。</p><p>(3)处理突发流量</p><p>上面例子限制 2r/s，如果有时正常流量突然增大，超出的请求将被拒绝，无法处理突发流量，可以结合 <strong>burst</strong> 参数使用来解决该问题。</p><p>配置如下：</p><div class="language-Nginx line-numbers-mode" data-ext="Nginx"><pre class="language-Nginx"><code>limit_req_zone $binary_remote_addr zone=contentRateLimit:10m rate=2r/s;
server {
    ......
    #静态页
    location /items/ {
      #限流
      limit_req zone=contentRateLimit burst=4;
      try_files $uri @np;
        } 
    ......
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>burst 译为突发、爆发，表示在超过设定的处理速率后能额外处理的请求数,当 rate=10r/s 时，将1s拆成10份，即每100ms可处理1个请求。</p><p>此处，**burst=4 **，若同时有4个请求到达，Nginx 会处理第一个请求，剩余3个请求将放入队列，然后每隔500ms从队列中获取一个请求进行处理。若请求数大于4，将拒绝处理多余的请求，直接返回503.</p><p>不过，单独使用 burst 参数并不实用。假设 burst=50 ，rate依然为10r/s，排队中的50个请求虽然每100ms会处理一个，但第50个请求却需要等待 50 * 100ms即 5s，这么长的处理时间自然难以接受。</p><p>如果请求不添加nodelay参数，服务器会对请求进行延时处理，请求过多时会有大量的tcp连接请求等待。因此，burst 往往结合 nodelay 一起使用。</p><p>配置如下：</p><div class="language-Nginx line-numbers-mode" data-ext="Nginx"><pre class="language-Nginx"><code>limit_req_zone $binary_remote_addr zone=contentRateLimit:10m rate=2r/s;
server {
    ......
    #静态页
    location /items/ {
      #限流
      limit_req zone=contentRateLimit burst=4 nodelay;
      try_files $uri @np;
        } 
    ......
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如上表示：</p><p>平均每秒允许不超过2个请求，突发不超过4个请求，并且处理突发4个请求的时候，没有延迟，等到完成之后，按照正常的速率处理。</p><p>如上两种配置结合就达到了速率稳定，但突然流量也能正常处理的效果。</p><h4 id="_2-2-2-控制并发量" tabindex="-1"><a class="header-anchor" href="#_2-2-2-控制并发量" aria-hidden="true">#</a> 2.2.2 控制并发量</h4><p>ngx_http_limit_conn_module 提供了限制连接数的能力。主要是利用limit_conn_zone和limit_conn两个指令。</p><p>利用连接数限制 某一个用户的ip连接的数量来控制流量。</p><p>注意：并非所有连接都被计算在内 只有当服务器正在处理请求并且已经读取了整个请求头时，才会计算有效连接。此处忽略测试。</p><p>配置语法：</p><div class="language-Plaintext line-numbers-mode" data-ext="Plaintext"><pre class="language-Plaintext"><code>Syntax:        limit_conn zone number;
Default: —;
Context: http, server, location;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>(1)配置限制固定连接数</p><p>配置如下：</p><div class="language-Nginx line-numbers-mode" data-ext="Nginx"><pre class="language-Nginx"><code>#根据IP地址来限制，存储内存大小10M
limit_conn_zone $binary_remote_addr zone=addr:10m;

server{
   #测试
        location /user/ {
         limit_conn addr 2;
         proxy_pass http://172.16.0.235:18083;
        } 
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>表示：</p><div class="language-Plaintext line-numbers-mode" data-ext="Plaintext"><pre class="language-Plaintext"><code>limit_conn_zone $binary_remote_addr zone=addr:10m;  表示限制根据用户的IP地址来显示，设置存储地址为的内存大小10M

limit_conn addr 2;   表示 同一个地址只允许连接2次。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>(2)限制每个客户端IP与服务器的连接数，同时限制与虚拟服务器的连接总数</p><p>配置如下：</p><div class="language-Nginx line-numbers-mode" data-ext="Nginx"><pre class="language-Nginx"><code>limit_conn_zone $binary_remote_addr zone=addr:10m;
limit_conn_zone $server_name zone=serv:10m; 

server{
        #测试
        location /user/ {
         limit_conn addr 2; #单个客户端ip与服务器的连接数．
         limit_conn perserver 100; #限制与服务器的总连接数
         proxy_pass http://172.16.0.235:18083;
        } 
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-3-秒杀nginx限流" tabindex="-1"><a class="header-anchor" href="#_2-3-秒杀nginx限流" aria-hidden="true">#</a> 2.3 秒杀Nginx限流</h3><p>​ 秒杀抢单，需要在抢单的入口进行限流，限流根据每个IP和总的并发量进行配置，配置如下：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503060559770.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h2 id="_3-lvs-nginx集群配置" tabindex="-1"><a class="header-anchor" href="#_3-lvs-nginx集群配置" aria-hidden="true">#</a> 3 Lvs+Nginx集群配置</h2><h3 id="_3-1-lvs介绍" tabindex="-1"><a class="header-anchor" href="#_3-1-lvs介绍" aria-hidden="true">#</a> 3.1 Lvs介绍</h3><p>​ LVS（Linux Virtual Server）即Linux虚拟服务器，是由章文嵩博士主导的开源负载均衡项目，目前LVS已经被集成到Linux内核模块中。该项目在Linux内核中实现了基于IP的数据请求负载均衡调度方案，其体系结构如图1所示，终端互联网用户从外部访问公司的外部负载均衡服务器，终端用户的Web请求会发送给LVS调度器，调度器根据自己预设的算法决定将该请求发送给后端的某台Web服务器，比如，轮询算法可以将外部的请求平均分发给后端的所有服务器，终端用户访问LVS调度器虽然会被转发到后端真实的服务器，但如果真实服务器连接的是相同的存储，提供的服务也是相同的服务，最终用户不管是访问哪台真实服务器，得到的服务内容都是一样的，整个集群对用户而言都是透明的。</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503060559914.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>工作中采用Lvs集群模式：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503060559886.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="_3-2-lvs工作解析模式介绍" tabindex="-1"><a class="header-anchor" href="#_3-2-lvs工作解析模式介绍" aria-hidden="true">#</a> 3.2 Lvs工作解析模式介绍</h3><p>**NAT模式：**即网络地址转换</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503060559999.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>访问步骤：</p><div class="language-Plaintext line-numbers-mode" data-ext="Plaintext"><pre class="language-Plaintext"><code>1.用户通过互联网DNS服务器解析到公司负载均衡设备上面的外网地址，相对于真实服务器而言，LVS外网IP又称VIP（Virtual IP Address），用户通过访问VIP，即可连接后端的真实服务器（Real Server），而这一切对用户而言都是透明的，用户以为自己访问的就是真实服务器，但他并不知道自己访问的VIP仅仅是一个调度器，也不清楚后端的真实服务器到底在哪里、有多少真实服务器。

2.用户将请求发送至124.126.147.168，此时LVS将根据预设的算法选择后端的一台真实服务器（192.168.0.1~192.168.0.3），将数据请求包转发给真实服务器，并且在转发之前LVS会修改数据包中的目标地址以及目标端口，目标地址与目标端口将被修改为选出的真实服务器IP地址以及相应的端口。

3.真实的服务器将响应数据包返回给LVS调度器，调度器在得到响应的数据包后会将源地址和源端口修改为VIP及调度器相应的端口，修改完成后，由调度器将响应数据包发送回终端用户，另外，由于LVS调度器有一个连接Hash表，该表中会记录连接请求及转发信息，当同一个连接的下一个数据包发送给调度器时，从该Hash表中可以直接找到之前的连接记录，并根据记录信息选出相同的真实服务器及端口信息。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>TUN负载均衡模式（IP隧道）：</strong></p><p>​ 在LVS（NAT）模式的集群环境中，由于所有的数据请求及响应的数据包都需要经过LVS调度器转发，如果后端服务器的数量大于10台，则调度器就会成为整个集群环境的瓶颈。我们知道，数据请求包往往远小于响应数据包的大小。因为响应数据包中包含有客户需要的具体数据，所以LVS（TUN）的思路就是将请求与响应数据分离，让调度器仅处理数据请求，而让真实服务器响应数据包直接返回给客户端。VS/TUN工作模式拓扑结构如图3所示。其中，IP隧道（IP tunning）是一种数据包封装技术，它可以将原始数据包封装并添加新的包头（内容包括新的源地址及端口、目标地址及端口），从而实现将一个目标为调度器的VIP地址的数据包封装，通过隧道转发给后端的真实服务器（Real Server），通过将客户端发往调度器的原始数据包封装，并在其基础上添加新的数据包头（修改目标地址为调度器选择出来的真实服务器的IP地址及对应端口），LVS（TUN）模式要求真实服务器可以直接与外部网络连接，真实服务器在收到请求数据包后直接给客户端主机响应数据。</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503060559035.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p><strong>DR负载均衡模式（推荐：直接路由模式）：</strong></p><p>​ 在LVS（TUN）模式下，由于需要在LVS调度器与真实服务器之间创建隧道连接，这同样会增加服务器的负担。与LVS（TUN）类似，DR模式也叫直接路由模式，其体系结构如图4所示，该模式中LVS依然仅承担数据的入站请求以及根据算法选出合理的真实服务器，最终由后端真实服务器负责将响应数据包发送返回给客户端。与隧道模式不同的是，直接路由模式（DR模式）要求调度器与后端服务器必须在同一个局域网内，VIP地址需要在调度器与后端所有的服务器间共享，因为最终的真实服务器给客户端回应数据包时需要设置源IP为VIP地址，目标IP为客户端IP，这样客户端访问的是调度器的VIP地址，回应的源地址也依然是该VIP地址（真实服务器上的VIP），客户端是感觉不到后端服务器存在的。由于多台计算机都设置了同样一个VIP地址，所以在直接路由模式中要求调度器的VIP地址是对外可见的，客户端需要将请求数据包发送到调度器主机，而所有的真实服务器的VIP地址必须配置在Non-ARP的网络设备上，也就是该网络设备并不会向外广播自己的MAC及对应的IP地址，真实服务器的VIP对外界是不可见的，但真实服务器却可以接受目标地址VIP的网络请求，并在回应数据包时将源地址设置为该VIP地址。调度器根据算法在选出真实服务器后，在不修改数据报文的情况下，将数据帧的MAC地址修改为选出的真实服务器的MAC地址，通过交换机将该数据帧发给真实服务器。整个过程中，真实服务器的VIP不需要对外界可见。</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503060559349.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="_3-3-lvs-dr配置" tabindex="-1"><a class="header-anchor" href="#_3-3-lvs-dr配置" aria-hidden="true">#</a> 3.3 Lvs-DR配置</h3><p>​ 综合上面分析，我们可以得出结论，DR模式性能效率比较高，安全性很高，因此一般公司都推荐使用DR模式。我们这里也配置DR模式实现Lvs+Nginx集群。</p><p>参考：修改ip的命令：</p><div class="language-Bash line-numbers-mode" data-ext="Bash"><pre class="language-Bash"><code># 修改网卡配置
vi /etc/sysconfig/network-scripts/ifcfg-ens33

# 修改内容
# IPADDR=&quot;192.168.200.128&quot;
# 改为
# IPADDR=&quot;192.168.200.158&quot;

# 重启生效
systemctl restart network
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>准备3台 CentOS 7.6 的计算机，IP为： 192.168.200.156 192.168.200.157 192.168.200.158</p><p>准备使用的VIP为： 192.168.200.160</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503060559342.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h4 id="_3-3-1-vip配置" tabindex="-1"><a class="header-anchor" href="#_3-3-1-vip配置" aria-hidden="true">#</a> 3.3.1 Vip配置</h4><p>关闭网络配置管理器(每台机器都要做)</p><div class="language-Plaintext line-numbers-mode" data-ext="Plaintext"><pre class="language-Plaintext"><code>systemctl stop NetworkManager
systemctl disable NetworkManager
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>配置虚拟IP(VIP)</p><p>在<code>192.168.200.156</code>(负载均衡调度器)的<code>/etc/sysconfig/network-scripts</code>创建文件<code>ifcfg-ens33:1</code>：</p><div class="language-Bash line-numbers-mode" data-ext="Bash"><pre class="language-Bash"><code># 创建并添加文件：
vi /etc/sysconfig/network-scripts/ifcfg-ens33:1

# 添加如下内容：
BOOTPROTO=static
DEVICE=ens33:1
ONBOOT=yes
IPADDR=192.168.200.160
NETMASK=255.255.255.0

# 重启网络服务
systemctl restart network
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以使用<code>ip addr</code>命令看到ens33网卡上面添加了一个虚拟IP 192.168.200.160：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503060559460.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>同时需要对<code>192.168.200.157</code>、<code>192.168.200.158</code>构建虚拟机IP，但只是用于返回数据，而不能被用户访问到，这时候需要操作<code>ifcfg-lo</code>。</p><p>IPADDR=127.0.0.1，这里127.0.0.1属于本地回环地址，不属于任何一个有类别地址类。它代表设备的本地虚拟接口，所以默认被看作是永远不会宕掉的接口。</p><p>对<code>192.168.200.157和192.168.200.158</code>(两个应用服务器均要修改)的<code>/etc/sysconfig/network-scripts</code>中创建文件<code>ifcfg-lo:1</code>：</p><div class="language-Bash line-numbers-mode" data-ext="Bash"><pre class="language-Bash"><code># 创建并编辑文件：
vi /etc/sysconfig/network-scripts/ifcfg-lo:1

# 添加如下内容：
DEVICE=lo:1
IPADDR=192.168.200.160
NETMASK=255.255.255.255
NETWORK=127.0.0.0
BROADCAST=127.255.255.255
ONBOOT=yes
NAME=loopback

# 刷新lo，使其生效：
ifup lo
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以使用<code>ip addr</code>命令看到在lo网卡上面添加了一个虚拟IP 192.168.200.160：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503060559671.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h4 id="_3-3-2-lvs集群管理工具安装" tabindex="-1"><a class="header-anchor" href="#_3-3-2-lvs集群管理工具安装" aria-hidden="true">#</a> 3.3.2 LVS集群管理工具安装</h4><p>ipvsadm用于对lvs集群进行管理，需要手动安装。</p><p>在<code>192.168.200.156</code>(负载均衡调度器)中执行安装命令：</p><div class="language-Bash line-numbers-mode" data-ext="Bash"><pre class="language-Bash"><code># 安装命令：
yum install -y ipvsadm

# 查看版本：
ipvsadm -Ln
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>效果如下：</p>`,110),S={href:"https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503060559638.png",target:"_blank",rel:"noopener noreferrer"},P=d(`<p>查看集群管理命令的相关参数：<code>ipvsadm -h</code></p><h4 id="_3-3-3-arp配置-地址解析协议" tabindex="-1"><a class="header-anchor" href="#_3-3-3-arp配置-地址解析协议" aria-hidden="true">#</a> 3.3.3 ARP配置（地址解析协议）</h4><p>arp_ignore和arp_announce参数都和ARP协议相关，主要用于控制系统返回arp响应和发送arp请求时的动作。这两个参数很重要，特别是在LVS的DR场景下，它们的配置直接影响到DR转发是否正常。</p><p>arp-ignore：arp_ignore参数的作用是控制系统在收到外部的arp请求时，是否要返回arp响应（0~8，2-8用的很少）</p><ul><li>0：只要本机配置了IP，就能响应请求。</li><li>1：请求的目标地址到达对应的网络接口，才能响应对应请求</li></ul><p>arp-announce：ARP通告行为：</p><ul><li>0：本机上任何网络接口都向外通告（也就是任何请求都对用户进行响应），所有网卡都能接收通告</li><li>1：尽可能避免本网卡与不匹配的目标进行通告</li><li>2：只在本网卡进行通告（推荐）</li></ul><p>对<code>192.168.200.157和192.168.200.158</code>(两个应用服务器均要修改)的配置文件：<code>/etc/sysctl.conf</code>，添加配置信息：</p><div class="language-Bash line-numbers-mode" data-ext="Bash"><pre class="language-Bash"><code># 修改配置文件：
vi /etc/sysctl.conf

# 在配置文件最底部，添加内容：
net.ipv4.conf.all.arp_ignore = 1
net.ipv4.conf.default.arp_ignore = 1
net.ipv4.conf.lo.arp_ignore = 1
net.ipv4.conf.all.arp_announce = 2
net.ipv4.conf.default.arp_announce = 2
net.ipv4.conf.lo.arp_announce = 2

# 刷新配置
sysctl -p

# 安装路由工具
yum install -y net-tools

# 添加路由：
route add -host 192.168.200.160 dev lo
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>添加完host后，可以查看一下：<code>route -n</code>,效果如下：</p>`,10),q={href:"https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503060559802.png",target:"_blank",rel:"noopener noreferrer"},I=d(`<h4 id="_3-3-4-集群配置" tabindex="-1"><a class="header-anchor" href="#_3-3-4-集群配置" aria-hidden="true">#</a> 3.3.4 集群配置</h4><p>ipvsadm命令介绍：</p><ul><li>ipvsadm -A:用于创建集群</li><li>ipvsadm -E:用于修改集群</li><li>ipvsadm -D:用于删除集群</li><li>ipvsadm -C:用于清除集群数据</li><li>ipvsadm -R:用于重置集群配置规则</li><li>ipvsadm -S:用于保存修改的集群规则</li><li>ipvsadm -a:用于添加一个rs节点</li><li>ipvsadm -e:用于修改一个rs节点</li><li>ipvsadm -d:用于删除一个rs节点</li></ul><p>在<code>192.168.200.156</code>(负载均衡调度器)中进行集群管理配置：</p><div class="language-Bash line-numbers-mode" data-ext="Bash"><pre class="language-Bash"><code># 添加集群TCP服务地址：（外部请求由该配置指定的VIP处理）
ipvsadm -A -t 192.168.200.160:80 -s rr
#参数说明：
# -A：添加集群配置
# -t：TCP请求地址(VIP)
# -s：负载均衡算法


# 配置应用服务器rs(2个)节点：
ipvsadm -a -t 192.168.200.160:80 -r 192.168.200.157:80 -g
ipvsadm -a -t 192.168.200.160:80 -r 192.168.200.158:80 -g
# 参数说明：
# -a：给集群添加一个节点
# -t：指定VIP地址
# -r：指定real server地址
# -g：表示LVS的模式为dr模式
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>负载均衡算法：</p><table><thead><tr><th>算法</th><th>说明</th></tr></thead><tbody><tr><td>rr</td><td>轮询算法，它将请求依次分配给不同的rs节点，也就是RS节点中均摊分配。这种算法简单，但只适合于RS节点处理性能差不多的情况</td></tr><tr><td>wrr</td><td>加权轮训调度，它将依据不同RS的权值分配任务。权值较高的RS将优先获得任务，并且分配到的连接数将比权值低的RS更多。相同权值的RS得到相同数目的连接数。</td></tr><tr><td>Wlc</td><td>加权最小连接数调度，假设各台RS的全职依次为Wi，当前tcp连接数依次为Ti，依次去Ti/Wi为最小的RS作为下一个分配的RS</td></tr><tr><td>Dh</td><td>目的地址哈希调度（destination hashing）以目的地址为关键字查找一个静态hash表来获得需要的RS</td></tr><tr><td>SH</td><td>源地址哈希调度（source hashing）以源地址为关键字查找一个静态hash表来获得需要的RS</td></tr><tr><td>Lc</td><td>最小连接数调度（least-connection）,IPVS表存储了所有活动的连接。LB会比较将连接请求发送到当前连接最少的RS.</td></tr><tr><td>Lblc</td><td>基于地址的最小连接数调度（locality-based least-connection）：将来自同一个目的地址的请求分配给同一台RS，此时这台服务器是尚未满负荷的。否则就将这个请求分配给连接数最小的RS，并以它作为下一次分配的首先考虑。</td></tr></tbody></table><p>添加了节点后，我们可以通过<code>ipvsadm -Ln</code>查看，看到多了2个节点。</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503060559897.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>lvs有一个用户请求持久化操作，会将用户请求的数据持久化，下次请求的时候，会从持久化数据中取出来，如果有持久化数据，就按持久化数据中进行访问，没有则轮询。因此我们需要配置持久化时间。</p><p>在<code>192.168.200.156</code>(负载均衡调度器)中进行设置：(真正的lvs配置实用，不要进行如下命令执行，此处只是为了能够更快的测试效果)</p><div class="language-Bash line-numbers-mode" data-ext="Bash"><pre class="language-Bash"><code># -p 3 表示设置持久化时间为3秒
ipvsadm -E -t 192.168.200.160:80 -s rr -p 3

#设置tcp
ipvsadm --set 2 2 2
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_3-3-5-效果测试" tabindex="-1"><a class="header-anchor" href="#_3-3-5-效果测试" aria-hidden="true">#</a> 3.3.5 效果测试</h4><p>参考前面课程的内容，安装Nginx，用来测试lvs的效果。</p><p>对<code>192.168.200.157和192.168.200.158</code>(两个应用服务器均要修改)执行安装命令：</p><div class="language-Bash line-numbers-mode" data-ext="Bash"><pre class="language-Bash"><code># 安装环境
yum -y install pcre-devel openssl-devel gcc curl

# 上传OpenRestry

# 解压
tar -xf openresty-1.11.2.5.tar.gz

# 进入到解压目录
cd openresty-1.11.2.5

# 安装
./configure --prefix=/usr/local/openresty \\
--with-luajit \\
--without-http_redis2_module \\
--with-http_stub_status_module \\
--with-http_v2_module \\
--with-http_gzip_static_module \\
--with-http_sub_module

# 编译并安装
make &amp;&amp; make install

# 修改Nginx主页，以区分不同的服务器,便于演示测试效果
vi /usr/local/openresty/nginx/html/index.html
# 在index.html中添加本机的ip地址，例如： &lt;h3&gt;192.168.200.157&lt;/h3&gt;

# 启动nginx
/usr/local/openresty/nginx/sbin/nginx
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在浏览器中访问虚拟IP 192.168.200.160，进行访问测试。</p><p>注意：测试的时候注意间隔足够的时间，否则看不到负载均衡的效果，因为会缓存路由信息。</p><p>在<code>192.168.200.156</code>(负载均衡调度器)中，查看缓存的路由命令是<code>ipvsadm -Lnc</code> ，可以查看路由数据消失的时间：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503060559081.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>上图中的 00:34 表示34秒之后自动消失</p><h2 id="_4-压力测试" tabindex="-1"><a class="header-anchor" href="#_4-压力测试" aria-hidden="true">#</a> 4. 压力测试</h2><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503060559391.jpeg" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="_4-1-测试网络拓扑图" tabindex="-1"><a class="header-anchor" href="#_4-1-测试网络拓扑图" aria-hidden="true">#</a> 4.1 测试网络拓扑图</h3><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503060559335.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="_4-2-测试服务器配置" tabindex="-1"><a class="header-anchor" href="#_4-2-测试服务器配置" aria-hidden="true">#</a> 4.2 测试服务器配置</h3><table><thead><tr><th>性能测试环境</th><th></th></tr></thead><tbody><tr><td>Jdk版本</td><td>Jdk1.8</td></tr><tr><td>测试工具</td><td>Jmeter5.4.1</td></tr><tr><td>Jmeter负载服务器主机</td><td>2台32核64G</td></tr><tr><td>Jmeter负载服务器从机</td><td>10台16核32G</td></tr><tr><td>监控机</td><td>1台8核16G</td></tr></tbody></table><table><thead><tr><th>服务器部署环境</th><th></th></tr></thead><tbody><tr><td>Nginx服务器</td><td>4台16核32G</td></tr><tr><td>Redis服务器</td><td>1台8核16G</td></tr><tr><td>Kafka服务器</td><td>1台8核16G</td></tr><tr><td>热点订单服务器</td><td>9台8核16G</td></tr><tr><td>Mysql存储服务器</td><td>与热点订单服务器共用</td></tr><tr><td>公共微服务部署服务器</td><td>1台4核8G</td></tr></tbody></table><h3 id="_4-3-测试方法" tabindex="-1"><a class="header-anchor" href="#_4-3-测试方法" aria-hidden="true">#</a> 4.3 测试方法</h3><ol><li>正常测试：</li><li><strong>商品种类</strong>：100种</li><li><strong>商品数量</strong>：1亿个/每种，保证商品数量足够</li><li><strong>测试条件</strong>：总计5台压力机测试，每台发压200万。此时未达到秒杀系统的最大处理能力</li><li>测试目的：测试正常情况的处理情况。</li><li>前端极限测试：</li><li><strong>商品种类</strong>：100种</li><li><strong>商品数量</strong>：1000个/每种，商品数量不足</li><li><strong>测试条件</strong>：总计10台压力机测试，每台发压400万。此时达到秒杀系统的前端最大处理能力，但后端压力不大</li><li><strong>测试目的</strong>：测试大流量下，前端的处理情况。</li><li>前后端整体极限测试：</li><li><strong>商品种类</strong>：100种</li><li><strong>商品数量</strong>：1亿个/每种，商品数量足够</li><li><strong>测试条件</strong>：总计10台压力机测试，每台发压800万。此时达到秒杀系统的前后端整体的极限处理能力</li><li><strong>测试目的</strong>：测试大流量下，极端情况下的系统整体表现。</li></ol>`,30);function R(L,V){const n=r("ExternalLinkIcon");return s(),t("div",null,[o,i("p",null,[e("Sentinel控制台下载地址："),i("a",v,[e("https://github.com/alibaba/Sentinel/releases"),a(n)])]),u,p,i("p",null,[e("控制台访问："),i("a",m,[e("http://localhost:8858"),a(n)]),e(" 效果如下：")]),g,i("p",null,[e("访问"),i("a",b,[e("http://192.168.200.188:8858/"),a(n)]),e(" 登录后，效果如下：")]),h,i("p",null,[e("​ 我们接着启动生产者和消费者,并访问我们的控制台："),i("a",f,[e("http://192.168.200.188:8858/#/dashboard/home，效果如下："),a(n)])]),_,i("p",null,[e("!("),i("a",x,[e("https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503060559376.png"),a(n)]),e(")")]),y,i("p",null,[e("!("),i("a",S,[e("https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503060559638.png"),a(n)]),e(")")]),P,i("p",null,[e("!("),i("a",q,[e("https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503060559802.png"),a(n)]),e(")")]),I])}const N=l(c,[["render",R],["__file","6.Circuit breaker and current limiting and high concurrency processing.html.vue"]]);export{N as default};
