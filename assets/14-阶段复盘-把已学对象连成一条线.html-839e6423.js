import{_ as e,W as i,X as n,a2 as a}from"./framework-6a3aa88c.js";const d={},l=a(`<h1 id="阶段复盘-pod、deployment、service、dns-与-namespace" tabindex="-1"><a class="header-anchor" href="#阶段复盘-pod、deployment、service、dns-与-namespace" aria-hidden="true">#</a> 阶段复盘：Pod、Deployment、Service、DNS 与 Namespace</h1><h2 id="一、我们究竟在学习什么" tabindex="-1"><a class="header-anchor" href="#一、我们究竟在学习什么" aria-hidden="true">#</a> 一、我们究竟在学习什么</h2><p>到目前为止，Kubernetes 只是在帮助我们处理三个问题：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>应用如何运行？
应用如何被持续管理？
应用之间如何稳定访问？
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>对应到已经学过的对象：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>Namespace
└── Deployment
    └── Pod

客户端
└── DNS 名称
    └── Service
        └── Pod
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="二、第一条线-应用如何运行和被管理" tabindex="-1"><a class="header-anchor" href="#二、第一条线-应用如何运行和被管理" aria-hidden="true">#</a> 二、第一条线：应用如何运行和被管理</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>Deployment → Pod → Container
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul><li>Container 是真正运行的程序，例如 Nginx。</li><li>Pod 是 Kubernetes 运行容器的基本单位。</li><li>Deployment 管理一组 Pod，负责副本、自愈和滚动更新。</li></ul><p>不要让业务调用方直接依赖某个 Pod，因为 Pod 可以被替换。</p><h2 id="三、第二条线-请求如何到达应用" tabindex="-1"><a class="header-anchor" href="#三、第二条线-请求如何到达应用" aria-hidden="true">#</a> 三、第二条线：请求如何到达应用</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>客户端 → DNS → Service → Pod
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul><li>DNS 把 Service 名称解析成地址。</li><li>Service 提供稳定入口，并通过 selector 找到 Pod。</li><li>Pod 最终接收并处理请求。</li></ul><p>DNS 找 Service，Service 找 Pod，两者职责不同。</p><h2 id="四、namespace-在哪里" tabindex="-1"><a class="header-anchor" href="#四、namespace-在哪里" aria-hidden="true">#</a> 四、Namespace 在哪里</h2><p>Namespace 是资源所在的逻辑空间：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>qingyun-mall-dev
├── Deployment/qingyun-mall-web
└── Service/qingyun-mall-web

qingyun-mall-test
├── Deployment/qingyun-mall-web
└── Service/qingyun-mall-web
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>它主要解决资源分组和同名问题，不是自动生成的网络防火墙。</p><h2 id="五、把青云商城完整连起来" tabindex="-1"><a class="header-anchor" href="#五、把青云商城完整连起来" aria-hidden="true">#</a> 五、把青云商城完整连起来</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>Namespace: qingyun-mall-dev

Deployment: qingyun-mall-web
        │ 创建和管理
        ↓
Pod A                  Pod B
app=qingyun-mall       app=qingyun-mall
tier=frontend          tier=frontend
        ↑                 ↑
        └──── Service ────┘
             qingyun-mall-web
                    ↑
              DNS 服务名称
                    ↑
             集群内客户端
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="六、出现问题时先判断属于哪条线" tabindex="-1"><a class="header-anchor" href="#六、出现问题时先判断属于哪条线" aria-hidden="true">#</a> 六、出现问题时先判断属于哪条线</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>Pod 没有运行
→ 检查 Deployment → Pod → Container

Pod 正常但访问失败
→ 检查 DNS → Service → selector → Pod

资源明明创建了却查询不到
→ 检查 Namespace
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>先找问题属于哪条线，再执行对应命令，不需要一次把所有命令都跑一遍。</p><h2 id="七、本次不做实验" tabindex="-1"><a class="header-anchor" href="#七、本次不做实验" aria-hidden="true">#</a> 七、本次不做实验</h2><p>这次复盘的目标是整理关系，不是增加操作量。只观察当前集群即可：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl get namespaces
kubectl get deployment,pod,service <span class="token parameter variable">-A</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>第一条观察集群有哪些逻辑空间；第二条同时观察已经学过的三类资源。</p><h2 id="本讲只记住三句话" tabindex="-1"><a class="header-anchor" href="#本讲只记住三句话" aria-hidden="true">#</a> 本讲只记住三句话</h2><ol><li>Deployment 管理 Pod，Pod 运行 Container。</li><li>DNS 找到 Service，Service 再找到 Pod。</li><li>Namespace 决定资源位于哪个逻辑空间。</li></ol><h2 id="下一课预告" tabindex="-1"><a class="header-anchor" href="#下一课预告" aria-hidden="true">#</a> 下一课预告</h2><p>下一课学习 ConfigMap，只解决一个问题：同一个容器镜像，怎样在开发环境和测试环境中使用不同配置。</p>`,31),s=[l];function r(c,v){return i(),n("div",null,s)}const u=e(d,[["render",r],["__file","14-阶段复盘-把已学对象连成一条线.html.vue"]]);export{u as default};
