import{_ as n,W as a,X as e,a2 as s}from"./framework-6a3aa88c.js";const i={},l=s(`<h1 id="第十三课-configmap-配置外置" tabindex="-1"><a class="header-anchor" href="#第十三课-configmap-配置外置" aria-hidden="true">#</a> 第十三课：ConfigMap 配置外置</h1><h2 id="一、在全局地图中的位置" tabindex="-1"><a class="header-anchor" href="#一、在全局地图中的位置" aria-hidden="true">#</a> 一、在全局地图中的位置</h2><p>已经学过的关系：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>Namespace
└── Deployment → Pod → Container

客户端 → DNS → Service → Pod
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>现在补上“配置”：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>ConfigMap → 把配置交给 Pod 中的 Container
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>本课只解决一个问题：同一个容器镜像，怎样使用不同环境配置？</p><h2 id="二、为什么配置不应写死在镜像中" tabindex="-1"><a class="header-anchor" href="#二、为什么配置不应写死在镜像中" aria-hidden="true">#</a> 二、为什么配置不应写死在镜像中</h2><p>青云商城前台在不同环境中可能需要不同配置：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>开发环境：MALL_TITLE=青云商城-开发环境
测试环境：MALL_TITLE=青云商城-测试环境
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>Nginx 镜像本身没有变化。变化的是运行环境提供给它的配置。</p><p>理想关系是：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>同一个镜像 nginx:1.27
        ↑
开发环境注入开发配置
测试环境注入测试配置
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果每改一次标题或接口地址都重新制作镜像，镜像就和环境绑定了。ConfigMap 用来保存普通、非敏感配置，让镜像与配置分开。</p><h2 id="三、configmap-是什么" tabindex="-1"><a class="header-anchor" href="#三、configmap-是什么" aria-hidden="true">#</a> 三、ConfigMap 是什么</h2><p>ConfigMap 是 Kubernetes 中保存普通配置的对象，内容通常是键值对：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>MALL_TITLE = 青云商城-开发环境
API_BASE_URL = http://product-api
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>本课把这些值作为环境变量交给容器：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>ConfigMap
    ↓
Pod 中的容器环境变量
    ↓
应用读取配置
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>ConfigMap 不适合保存密码、Token、私钥等敏感内容；这些以后学习 Secret。</p><h2 id="四、本课-yaml" tabindex="-1"><a class="header-anchor" href="#四、本课-yaml" aria-hidden="true">#</a> 四、本课 YAML</h2><p>实验文件：<code>labs/11-ConfigMap/01-商城前台配置.yaml</code></p><p>文件包含两个对象：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>ConfigMap qingyun-mall-web-config
Deployment qingyun-mall-web
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>在线阅读时，请把下面的完整内容保存为 <code>labs/11-ConfigMap/01-商城前台配置.yaml</code>：</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> ConfigMap
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> qingyun<span class="token punctuation">-</span>mall<span class="token punctuation">-</span>web<span class="token punctuation">-</span>config
  <span class="token key atrule">labels</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> qingyun<span class="token punctuation">-</span>mall
    <span class="token key atrule">tier</span><span class="token punctuation">:</span> frontend
<span class="token key atrule">data</span><span class="token punctuation">:</span>
  <span class="token key atrule">MALL_TITLE</span><span class="token punctuation">:</span> 青云商城<span class="token punctuation">-</span>开发环境
  <span class="token key atrule">API_BASE_URL</span><span class="token punctuation">:</span> http<span class="token punctuation">:</span>//product<span class="token punctuation">-</span>api
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> apps/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Deployment
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> qingyun<span class="token punctuation">-</span>mall<span class="token punctuation">-</span>web
  <span class="token key atrule">labels</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> qingyun<span class="token punctuation">-</span>mall
    <span class="token key atrule">tier</span><span class="token punctuation">:</span> frontend
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">replicas</span><span class="token punctuation">:</span> <span class="token number">1</span>
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">matchLabels</span><span class="token punctuation">:</span>
      <span class="token key atrule">app</span><span class="token punctuation">:</span> qingyun<span class="token punctuation">-</span>mall
      <span class="token key atrule">tier</span><span class="token punctuation">:</span> frontend
  <span class="token key atrule">template</span><span class="token punctuation">:</span>
    <span class="token key atrule">metadata</span><span class="token punctuation">:</span>
      <span class="token key atrule">labels</span><span class="token punctuation">:</span>
        <span class="token key atrule">app</span><span class="token punctuation">:</span> qingyun<span class="token punctuation">-</span>mall
        <span class="token key atrule">tier</span><span class="token punctuation">:</span> frontend
    <span class="token key atrule">spec</span><span class="token punctuation">:</span>
      <span class="token key atrule">containers</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> nginx
          <span class="token key atrule">image</span><span class="token punctuation">:</span> nginx<span class="token punctuation">:</span><span class="token number">1.27</span>
          <span class="token key atrule">envFrom</span><span class="token punctuation">:</span>
            <span class="token punctuation">-</span> <span class="token key atrule">configMapRef</span><span class="token punctuation">:</span>
                <span class="token key atrule">name</span><span class="token punctuation">:</span> qingyun<span class="token punctuation">-</span>mall<span class="token punctuation">-</span>web<span class="token punctuation">-</span>config
          <span class="token key atrule">ports</span><span class="token punctuation">:</span>
            <span class="token punctuation">-</span> <span class="token key atrule">containerPort</span><span class="token punctuation">:</span> <span class="token number">80</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果目录不存在，先执行：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">mkdir</span> <span class="token parameter variable">-p</span> labs/11-ConfigMap
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>其中关键连接点是：</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">envFrom</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">configMapRef</span><span class="token punctuation">:</span>
      <span class="token key atrule">name</span><span class="token punctuation">:</span> qingyun<span class="token punctuation">-</span>mall<span class="token punctuation">-</span>web<span class="token punctuation">-</span>config
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>它表示把这个 ConfigMap 中的键值作为环境变量交给容器。</p><h2 id="五、最小实验" tabindex="-1"><a class="header-anchor" href="#五、最小实验" aria-hidden="true">#</a> 五、最小实验</h2><p>进入项目并创建资源：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token builtin class-name">cd</span> /Users/qintianpeng/2026/code/k8s
kubectl apply <span class="token parameter variable">-f</span> labs/11-ConfigMap/01-商城前台配置.yaml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>等待 Deployment 就绪：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl rollout status deployment/qingyun-mall-web
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>查看 ConfigMap：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl get configmap qingyun-mall-web-config <span class="token parameter variable">-o</span> yaml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>进入 Deployment 管理的 Pod，查看容器收到的配置：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl <span class="token builtin class-name">exec</span> deployment/qingyun-mall-web -- <span class="token punctuation">\\</span>
  <span class="token function">printenv</span> MALL_TITLE API_BASE_URL
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>应该输出：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>青云商城-开发环境
http://product-api
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>这证明配置经过了下面这条链：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>ConfigMap → Pod → Container 环境变量
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="六、不要混淆镜像和配置" tabindex="-1"><a class="header-anchor" href="#六、不要混淆镜像和配置" aria-hidden="true">#</a> 六、不要混淆镜像和配置</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>镜像 nginx:1.27
→ 程序本身是什么

ConfigMap qingyun-mall-web-config
→ 程序运行时使用什么普通配置
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>同一个镜像可以在不同环境中配合不同 ConfigMap 使用。</p><h2 id="七、本课暂时不展开的内容" tabindex="-1"><a class="header-anchor" href="#七、本课暂时不展开的内容" aria-hidden="true">#</a> 七、本课暂时不展开的内容</h2><p>本课先不讨论：</p><ul><li>修改 ConfigMap 后，正在运行的容器是否自动变化；</li><li>把 ConfigMap 挂载成文件；</li><li>Secret；</li><li>多环境配置管理工具。</li></ul><p>先把“镜像与配置分离”理解牢固，后面再逐层补充。</p><h2 id="八、清理实验" tabindex="-1"><a class="header-anchor" href="#八、清理实验" aria-hidden="true">#</a> 八、清理实验</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl delete <span class="token parameter variable">-f</span> labs/11-ConfigMap/01-商城前台配置.yaml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>确认：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl get deployment,configmap <span class="token parameter variable">-l</span> <span class="token assign-left variable">app</span><span class="token operator">=</span>qingyun-mall
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="九、问题与直接回答" tabindex="-1"><a class="header-anchor" href="#九、问题与直接回答" aria-hidden="true">#</a> 九、问题与直接回答</h2><h3 id="configmap-保存什么" tabindex="-1"><a class="header-anchor" href="#configmap-保存什么" aria-hidden="true">#</a> ConfigMap 保存什么？</h3><p>普通、非敏感的应用配置。</p><h3 id="为什么不把配置直接写进镜像" tabindex="-1"><a class="header-anchor" href="#为什么不把配置直接写进镜像" aria-hidden="true">#</a> 为什么不把配置直接写进镜像？</h3><p>把程序和环境配置分开，同一个镜像才能方便地用于不同环境。</p><h3 id="configmap-会自己执行配置吗" tabindex="-1"><a class="header-anchor" href="#configmap-会自己执行配置吗" aria-hidden="true">#</a> ConfigMap 会自己执行配置吗？</h3><p>不会。Pod 必须通过 <code>envFrom</code> 等方式引用它，应用再读取相应环境变量。</p><h3 id="密码可以放进-configmap-吗" tabindex="-1"><a class="header-anchor" href="#密码可以放进-configmap-吗" aria-hidden="true">#</a> 密码可以放进 ConfigMap 吗？</h3><p>不应该。密码等敏感内容以后使用 Secret。</p><h2 id="本课只记住三句话" tabindex="-1"><a class="header-anchor" href="#本课只记住三句话" aria-hidden="true">#</a> 本课只记住三句话</h2><ol><li>镜像保存程序，ConfigMap 保存普通配置。</li><li>同一个镜像可以搭配不同环境的 ConfigMap。</li><li>ConfigMap 必须被 Pod 引用，配置才会进入容器。</li></ol><h2 id="下一课预告" tabindex="-1"><a class="header-anchor" href="#下一课预告" aria-hidden="true">#</a> 下一课预告</h2><p>下一课学习 Secret，只回答一个问题：数据库密码等敏感配置应该放在哪里？</p>`,68),t=[l];function p(d,c){return a(),e("div",null,t)}const r=n(i,[["render",p],["__file","15-第十三课-ConfigMap配置外置.html.vue"]]);export{r as default};
