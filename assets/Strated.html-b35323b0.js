import{_ as s,W as t,X as i,$ as e,a0 as a,Z as n,a2 as r,C as c}from"./framework-6a3aa88c.js";const l={},d=e("h2",{id:"nacos注册中心",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#nacos注册中心","aria-hidden":"true"},"#"),a(" Nacos注册中心")],-1),h=e("p",null,"国内公司一般都推崇阿里巴巴的技术，比如注册中心，SpringCloudAlibaba也推出了一个名为Nacos的注册中心。",-1),p=e("h3",{id:"认识和安装nacos",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#认识和安装nacos","aria-hidden":"true"},"#"),a(" 认识和安装Nacos")],-1),g={href:"https://nacos.io/",target:"_blank",rel:"noopener noreferrer"},u={href:"https://spring.io/projects/spring-cloud",target:"_blank",rel:"noopener noreferrer"},_={href:"https://github.com/Netflix/eureka",target:"_blank",rel:"noopener noreferrer"},f=r(`<figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241231133649749.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>本机启动：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>startup.cmd <span class="token parameter variable">-m</span> standalone
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="什么是nacos" tabindex="-1"><a class="header-anchor" href="#什么是nacos" aria-hidden="true">#</a> 什么是Nacos</h2><p>Nacos <code>/nɑ:kəʊs/</code> 是 Dynamic Naming and Configuration Service的首字母简称，一个更易于构建云原生应用的动态服务发现、配置管理和服务管理平台。</p><p>Nacos 致力于帮助您发现、配置和管理微服务。Nacos 提供了一组简单易用的特性集，帮助您快速实现动态服务发现、服务配置、服务元数据及流量管理。</p><p>Nacos 帮助您更敏捷和容易地构建、交付和管理微服务平台。 Nacos 是构建以**“服务”**为中心的现代应用架构 (例如微服务范式、云原生范式) 的服务基础设施。</p><p>Nacos 支持几乎所有主流类型的**“服务”**的发现、配置和管理：</p>`,8),b={href:"https://kubernetes.io/docs/concepts/services-networking/service/",target:"_blank",rel:"noopener noreferrer"},N={href:"https://grpc.io/docs/guides/concepts.html#service-definition",target:"_blank",rel:"noopener noreferrer"},m={href:"https://dubbo.apache.org/",target:"_blank",rel:"noopener noreferrer"},x={href:"https://spring.io/projects/spring-cloud",target:"_blank",rel:"noopener noreferrer"},v=e("h3",{id:"产品功能",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#产品功能","aria-hidden":"true"},"#"),a(" 产品功能")],-1),k=e("p",null,[e("strong",null,"服务发现和服务健康监测")],-1),S={href:"https://nacos.io/docs/v3.0/guide/user/sdk/",target:"_blank",rel:"noopener noreferrer"},y={href:"https://nacos.io/docs/v3.0/guide/user/open-api/",target:"_blank",rel:"noopener noreferrer"},q={href:"https://nacos.io/docs/v3.0/guide/user/other-language/",target:"_blank",rel:"noopener noreferrer"},D={href:"https://nacos.io/docs/v3.0/ecology/use-nacos-with-coredns/",target:"_blank",rel:"noopener noreferrer"},P={href:"https://nacos.io/docs/v3.0/guide/user/open-api/",target:"_blank",rel:"noopener noreferrer"},C=e("p",null,"Nacos 提供对服务的实时的健康检查，阻止向不健康的主机或服务实例发送请求。Nacos 支持传输层 (PING 或 TCP)和应用层 (如 HTTP、MySQL、用户自定义）的健康检查。 对于复杂的云环境和网络拓扑环境中（如 VPC、边缘网络等）服务的健康检查，Nacos 提供了 agent 上报模式和服务端主动检测2种健康检查模式。Nacos 还提供了统一的健康检查仪表盘，帮助您根据健康状态管理服务的可用性及流量。",-1),I=e("p",null,[e("strong",null,"动态配置服务")],-1),A=e("p",null,"动态配置服务可以让您以中心化、外部化和动态化的方式管理所有环境的应用配置和服务配置。",-1),T=e("p",null,"动态配置消除了配置变更时重新部署应用和服务的需要，让配置管理变得更加高效和敏捷。",-1),R=e("p",null,"配置中心化管理让实现无状态服务变得更简单，让服务按需弹性扩展变得更容易。",-1),z={href:"http://console.nacos.io/nacos/index.html",target:"_blank",rel:"noopener noreferrer"},E=e("p",null,[e("strong",null,"动态 DNS 服务")],-1),O=e("p",null,"动态 DNS 服务支持权重路由，让您更容易地实现中间层负载均衡、更灵活的路由策略、流量控制以及数据中心内网的简单DNS解析服务。动态DNS服务还能让您更容易地实现以 DNS 协议为基础的服务发现，以帮助您消除耦合到厂商私有服务发现 API 上的风险。",-1),V={href:"https://nacos.io/docs/v3.0/ecology/use-nacos-with-coredns/",target:"_blank",rel:"noopener noreferrer"},L=e("li",null,[e("p",null,[e("strong",null,"服务及其元数据管理")]),e("p",null,"Nacos 能让您从微服务平台建设的视角管理数据中心的所有服务及元数据，包括管理服务的描述、生命周期、服务的静态依赖分析、服务的健康状态、服务的流量管理、路由及安全策略、服务的 SLA 以及最首要的 metrics 统计数据。")],-1),w=r('<h3 id="产品优势" tabindex="-1"><a class="header-anchor" href="#产品优势" aria-hidden="true">#</a> 产品优势</h3><ul><li><p><strong>易于使用</strong></p><p>Nacos经历几万人使用反馈优化，提供统一的服务发现和配置管理功能，通过直观的 Web 界面和简洁的 API，为开发和运维人员在云原生环境中带来了便捷的服务注册、发现和配置更新操作。</p></li><li><p><strong>特性丰富</strong></p><p>Nacos提供了包括服务发现、配置管理、动态 DNS 服务、服务元数据管理、流量管理、服务监控、服务治理等在内的一系列特性，帮助您在云原生时代，更轻松的构建、交付和管理微服务。</p></li><li><p><strong>极致性能</strong></p><p>Nacos经过阿里双十一超快伸缩场景的锤炼，提供高性能的服务注册和发现能力，以及低延迟的配置更新响应，确保在大规模分布式系统中的高效率和稳定运行。</p></li><li><p><strong>超大容量</strong></p><p>Nacos诞生自阿里的百万实例规模，造就支持海量服务和配置的管理，能够满足大型分布式系统对高并发和高可用性的需求。</p></li><li><p><strong>稳定可用</strong></p><p>Nacos 通过自研的同步协议，配合生态中应用广泛的Raft协议，确保了服务的高可用性和数据的稳定性，保证阿里双十一系统的高可用稳定运行。</p></li><li><p><strong>开放生态</strong></p><p>Nacos拥有活跃的开源社区、广泛的生态整合和持续的创新发展，不仅大量兼容了Spring Cloud、Dubbo等大受欢迎的开源框架、还提供了丰富的插件化能力，帮助用户在云原生时代，提供可定制满足自身特殊需求的独有云原生微服务系统。</p></li></ul><h2 id="设计理念" tabindex="-1"><a class="header-anchor" href="#设计理念" aria-hidden="true">#</a> 设计理念</h2><blockquote><p>我们相信一切都是服务，每个服务节点被构想为一个星球，每个服务都是一个星系。Nacos 致力于帮助建立这些服务之间的<strong>连接</strong>，助力每个面向星辰的梦想能够透过云层，飞在云上，更好的链接整片星空。</p></blockquote><p>Nacos希望帮助用户在云原生时代，在私有云、混合云或者公有云等所有云环境中，更好的构建、交付、管理自己的微服务平台，更快的复用和组合业务服务，更快的交付商业创新的价值，从而为用户赢得市场。正是基于这一愿景，Nacos的设计理念被定位为<code>易于使用</code>、<code>面向标准</code>、<code>高可用</code>和<code>方便扩展</code>。</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/design-philosophy.svg" alt="设计理念简图" tabindex="0" loading="lazy"><figcaption>设计理念简图</figcaption></figure><h4 id="易于使用" tabindex="-1"><a class="header-anchor" href="#易于使用" aria-hidden="true">#</a> 易于使用</h4><p>易于使用是 Nacos 的一个核心理念，它通过提供用户友好的 Web 界面和简洁的 API 来简化服务的注册、发现和配置管理过程。开发者可以轻松集成 Nacos 到他们的应用中，无需投入大量时间在复杂的设置和学习上。</p><h4 id="面向标准" tabindex="-1"><a class="header-anchor" href="#面向标准" aria-hidden="true">#</a> 面向标准</h4><p>Nacos 采用面向标准的设计理念，遵循云原生应用开发的最佳实践和标准协议，以确保其服务发现和配置管理功能与广泛的技术栈和平台无缝对接。</p><h4 id="高可用" tabindex="-1"><a class="header-anchor" href="#高可用" aria-hidden="true">#</a> 高可用</h4><p>为了满足企业级应用对高可用的需求，Nacos 实现了集群模式，确保在节点发生故障时，服务的发现和配置管理功能不会受影响。集群模式也意味着 Nacos 可以通过增加节点来水平扩展，提升系统的整体性能和承载能力。</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/availability-structure.svg" alt="Nacos高可用架构图" tabindex="0" loading="lazy"><figcaption>Nacos高可用架构图</figcaption></figure><h4 id="方便扩展" tabindex="-1"><a class="header-anchor" href="#方便扩展" aria-hidden="true">#</a> 方便扩展</h4><p>Nacos 还注重易于扩展，它采用了模块化的设计使得各个组件都可以独立地进行扩展或替换。这也为社区贡献者提供了方便，使他们能够针对特定的需求开发新的功能或者改善现有功能，进一步推动 Nacos 的生态发展。</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/plugin-structure.svg" alt="Nacos插件架构图" tabindex="0" loading="lazy"><figcaption>Nacos插件架构图</figcaption></figure><p>通过上述设计理念的实现，Nacos 为用户提供了一个强大而灵活的平台，以支持不断变化的业务需求，加速业务创新和数字转型，最终帮助用户在竞争激烈的市场中占据有利地位。</p><h2 id="部署模式" tabindex="-1"><a class="header-anchor" href="#部署模式" aria-hidden="true">#</a> 部署模式</h2><p>Nacos 提供了两种两种部署运行模式：<code>单机模式</code>和<code>集群模式</code></p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/deploy-structure.svg" alt="Nacos部署模式图" tabindex="0" loading="lazy"><figcaption>Nacos部署模式图</figcaption></figure><h3 id="单机模式" tabindex="-1"><a class="header-anchor" href="#单机模式" aria-hidden="true">#</a> 单机模式</h3><p>单机模式又称<code>单例模式</code>, 拥有所有Nacos的功能及特性，具有极易部署、快速启动等优点。但无法与其他节点组成集群，无法在节点或网络故障时提供高可用能力。单机模式同样可以使用内置Derby数据库（默认）和外置数据库进行存储。</p><p>单机模式主要适合于工程师于本地搭建或于测试环境中搭建Nacos环境，主要用于开发调试及测试使用；也能够兼顾部分对稳定性和可用性要求不高的业务场景。</p><h3 id="集群模式" tabindex="-1"><a class="header-anchor" href="#集群模式" aria-hidden="true">#</a> 集群模式</h3><p>集群模式通过自研一致性协议Distro以及Raft协议，将多个Nacos节点构建成了高可用的Nacos集群。数据将在集群中各个节点进行同步，保证数据的一致性。集群模式具有高可用、高扩展、高并发等优点，确保在故障发生时不影响业务的运行。集群模式<strong>默认</strong>采用外置数据库进行存储，但也可以通过内置数据库进行存储。</p><p>该模式主要适合于生产环境，也是社区最为推荐的部署模式。</p><h2 id="生态组件" tabindex="-1"><a class="header-anchor" href="#生态组件" aria-hidden="true">#</a> 生态组件</h2><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/ecology-structure.png" alt="Nacos生态图" tabindex="0" loading="lazy"><figcaption>Nacos生态图</figcaption></figure><h2 id="路线规划" tabindex="-1"><a class="header-anchor" href="#路线规划" aria-hidden="true">#</a> 路线规划</h2><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/roadmap.svg" alt="NacosRoadMap" tabindex="0" loading="lazy"><figcaption>NacosRoadMap</figcaption></figure><blockquote><ol><li></li></ol></blockquote>',31);function B(M,W){const o=c("ExternalLinkIcon");return t(),i("div",null,[d,h,p,e("p",null,[e("a",g,[a("Nacos"),n(o)]),a("是阿里巴巴的产品，现在是"),e("a",u,[a("SpringCloud"),n(o)]),a("中的一个组件。相比"),e("a",_,[a("Eureka"),n(o)]),a("功能更加丰富，在国内受欢迎程度较高。")]),f,e("ul",null,[e("li",null,[e("a",b,[a("Kubernetes Service"),n(o)])]),e("li",null,[e("a",N,[a("gRPC"),n(o)])]),e("li",null,[e("a",m,[a("Dubbo RPC Service"),n(o)])]),e("li",null,[e("a",x,[a("Spring Cloud RESTful Service"),n(o)])])]),v,e("ul",null,[e("li",null,[k,e("p",null,[a("Nacos 支持基于 DNS 和基于 RPC 的服务发现。服务提供者使用 "),e("a",S,[a("原生SDK"),n(o)]),a("、"),e("a",y,[a("OpenAPI"),n(o)]),a("、或一个"),e("a",q,[a("独立的Agent"),n(o)]),a("注册 Service 后，服务消费者可以使用"),e("a",D,[a("DNS TODO"),n(o)]),a(" 或"),e("a",P,[a("HTTP&API"),n(o)]),a("查找和发现服务。")]),C]),e("li",null,[I,A,T,R,e("p",null,[a("Nacos 提供了一个简洁易用的UI ("),e("a",z,[a("控制台样例 Demo"),n(o)]),a(") 帮助您管理所有的服务和应用的配置。Nacos 还提供包括配置版本跟踪、金丝雀发布、一键回滚配置以及客户端配置更新状态跟踪在内的一系列开箱即用的配置管理特性，帮助您更安全地在生产环境中管理配置变更和降低配置变更带来的风险。")])]),e("li",null,[E,O,e("p",null,[a("Nacos 提供了一些简单的 "),e("a",V,[a("DNS APIs TODO"),n(o)]),a(" 帮助您管理服务的关联域名和可用的 IP列表。")])]),L]),w])}const H=s(l,[["render",B],["__file","Strated.html.vue"]]);export{H as default};
