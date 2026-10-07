import{_ as a,W as n,X as s,a2 as e}from"./framework-6a3aa88c.js";const l={},i=e(`<h1 id="第十二课-namespace-环境隔离" tabindex="-1"><a class="header-anchor" href="#第十二课-namespace-环境隔离" aria-hidden="true">#</a> 第十二课：Namespace 环境隔离</h1><h2 id="一、本课只解决一个问题" tabindex="-1"><a class="header-anchor" href="#一、本课只解决一个问题" aria-hidden="true">#</a> 一、本课只解决一个问题</h2><p>青云商城现在要同时部署开发环境和测试环境：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>青云商城
├── 开发环境：程序员日常联调
└── 测试环境：测试人员验证功能
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>两个环境中都需要名为 <code>qingyun-mall-web</code> 的 Deployment 和 Service。</p><p>如果全部放在 <code>default</code> 中，同一类型的资源不能重名。Namespace 可以把一个集群划分成多个逻辑空间：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>qingyun-mall-dev  / qingyun-mall-web
qingyun-mall-test / qingyun-mall-web
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>同名资源因为位于不同 Namespace，所以不会冲突。</p><h2 id="二、先把-namespace-理解成园区" tabindex="-1"><a class="header-anchor" href="#二、先把-namespace-理解成园区" aria-hidden="true">#</a> 二、先把 Namespace 理解成园区</h2><p>可以把 Kubernetes 集群想成一个产业园：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>Kubernetes 集群
├── qingyun-mall-dev 园区
│   └── qingyun-mall-web
└── qingyun-mall-test 园区
    └── qingyun-mall-web
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>只说“去找 <code>qingyun-mall-web</code>”还不够完整，还要知道它位于哪个园区。</p><p>Namespace 是 Kubernetes 中资源名称的一部分：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>资源身份 = Namespace + 资源类型 + metadata.name
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="三、创建两个环境" tabindex="-1"><a class="header-anchor" href="#三、创建两个环境" aria-hidden="true">#</a> 三、创建两个环境</h2><p>Namespace 文件为 <code>labs/10-Namespace/01-开发与测试环境.yaml</code>。在线阅读时，请先保存下面的完整内容：</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Namespace
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> qingyun<span class="token punctuation">-</span>mall<span class="token punctuation">-</span>dev
  <span class="token key atrule">labels</span><span class="token punctuation">:</span>
    <span class="token key atrule">project</span><span class="token punctuation">:</span> qingyun<span class="token punctuation">-</span>mall
    <span class="token key atrule">environment</span><span class="token punctuation">:</span> development
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Namespace
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> qingyun<span class="token punctuation">-</span>mall<span class="token punctuation">-</span>test
  <span class="token key atrule">labels</span><span class="token punctuation">:</span>
    <span class="token key atrule">project</span><span class="token punctuation">:</span> qingyun<span class="token punctuation">-</span>mall
    <span class="token key atrule">environment</span><span class="token punctuation">:</span> testing
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果目录不存在，先执行：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">mkdir</span> <span class="token parameter variable">-p</span> labs/10-Namespace
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>先创建两个 Namespace：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token builtin class-name">cd</span> /Users/qintianpeng/2026/code/k8s
kubectl apply <span class="token parameter variable">-f</span> labs/10-Namespace/01-开发与测试环境.yaml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>两个环境的应用文件为 <code>labs/10-Namespace/02-两个环境的商城前台.yaml</code>。请保存下面的完整内容：</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> apps/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Deployment
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> qingyun<span class="token punctuation">-</span>mall<span class="token punctuation">-</span>web
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> qingyun<span class="token punctuation">-</span>mall<span class="token punctuation">-</span>dev
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
          <span class="token key atrule">ports</span><span class="token punctuation">:</span>
            <span class="token punctuation">-</span> <span class="token key atrule">containerPort</span><span class="token punctuation">:</span> <span class="token number">80</span>
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Service
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> qingyun<span class="token punctuation">-</span>mall<span class="token punctuation">-</span>web
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> qingyun<span class="token punctuation">-</span>mall<span class="token punctuation">-</span>dev
  <span class="token key atrule">labels</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> qingyun<span class="token punctuation">-</span>mall
    <span class="token key atrule">tier</span><span class="token punctuation">:</span> frontend
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> qingyun<span class="token punctuation">-</span>mall
    <span class="token key atrule">tier</span><span class="token punctuation">:</span> frontend
  <span class="token key atrule">ports</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> http
      <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">80</span>
      <span class="token key atrule">targetPort</span><span class="token punctuation">:</span> <span class="token number">80</span>
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> apps/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Deployment
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> qingyun<span class="token punctuation">-</span>mall<span class="token punctuation">-</span>web
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> qingyun<span class="token punctuation">-</span>mall<span class="token punctuation">-</span>test
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
          <span class="token key atrule">ports</span><span class="token punctuation">:</span>
            <span class="token punctuation">-</span> <span class="token key atrule">containerPort</span><span class="token punctuation">:</span> <span class="token number">80</span>
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Service
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> qingyun<span class="token punctuation">-</span>mall<span class="token punctuation">-</span>web
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> qingyun<span class="token punctuation">-</span>mall<span class="token punctuation">-</span>test
  <span class="token key atrule">labels</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> qingyun<span class="token punctuation">-</span>mall
    <span class="token key atrule">tier</span><span class="token punctuation">:</span> frontend
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> qingyun<span class="token punctuation">-</span>mall
    <span class="token key atrule">tier</span><span class="token punctuation">:</span> frontend
  <span class="token key atrule">ports</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> http
      <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">80</span>
      <span class="token key atrule">targetPort</span><span class="token punctuation">:</span> <span class="token number">80</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>再把两个同名的商城前台分别部署进去：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl apply <span class="token parameter variable">-f</span> labs/10-Namespace/02-两个环境的商城前台.yaml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>等待两个 Deployment 就绪：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl rollout status deployment/qingyun-mall-web <span class="token punctuation">\\</span>
  <span class="token parameter variable">-n</span> qingyun-mall-dev

kubectl rollout status deployment/qingyun-mall-web <span class="token punctuation">\\</span>
  <span class="token parameter variable">-n</span> qingyun-mall-test
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里第一次出现 <code>-n</code>：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>-n 是 --namespace 的缩写
-n qingyun-mall-dev 表示去开发环境中操作
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="四、查看-namespace" tabindex="-1"><a class="header-anchor" href="#四、查看-namespace" aria-hidden="true">#</a> 四、查看 Namespace</h2><p>执行：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl get namespaces
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><code>namespaces</code> 可以简写为 <code>ns</code>：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl get ns
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>你会看到：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>qingyun-mall-dev
qingyun-mall-test
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>集群还自带 <code>default</code>、<code>kube-system</code> 等 Namespace。本课不要修改这些系统空间。</p><h2 id="五、分别查看两个环境" tabindex="-1"><a class="header-anchor" href="#五、分别查看两个环境" aria-hidden="true">#</a> 五、分别查看两个环境</h2><p>查看开发环境：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl get deployment,pod,service <span class="token parameter variable">-n</span> qingyun-mall-dev
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>查看测试环境：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl get deployment,pod,service <span class="token parameter variable">-n</span> qingyun-mall-test
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>两个环境中都会出现：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>deployment/qingyun-mall-web
service/qingyun-mall-web
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>它们名称一样，但不是同一个对象。</p><h2 id="六、为什么不加-n-看不到它们" tabindex="-1"><a class="header-anchor" href="#六、为什么不加-n-看不到它们" aria-hidden="true">#</a> 六、为什么不加 <code>-n</code> 看不到它们</h2><p>执行：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl get deployment qingyun-mall-web
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>通常会提示 <code>default</code> 中找不到该资源。</p><p>原因是当前 kubectl 默认查询 <code>default</code> Namespace，而我们的两个 Deployment 分别在：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>qingyun-mall-dev
qingyun-mall-test
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>所以排障时看到 <code>NotFound</code>，不要立刻断定资源不存在，先确认是不是查错了 Namespace。</p><h2 id="七、一次查看所有-namespace" tabindex="-1"><a class="header-anchor" href="#七、一次查看所有-namespace" aria-hidden="true">#</a> 七、一次查看所有 Namespace</h2><p>执行：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl get pods --all-namespaces
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>也可以简写：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl get pods <span class="token parameter variable">-A</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>只筛选青云商城：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl get pods <span class="token parameter variable">-A</span> <span class="token parameter variable">-l</span> <span class="token assign-left variable">app</span><span class="token operator">=</span>qingyun-mall
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>输出多出一列 <code>NAMESPACE</code>，可以同时看见开发环境和测试环境的 Pod。</p><h2 id="八、结合上一课理解-dns" tabindex="-1"><a class="header-anchor" href="#八、结合上一课理解-dns" aria-hidden="true">#</a> 八、结合上一课理解 DNS</h2><p>开发环境客户端文件为 <code>labs/10-Namespace/03-开发环境客户端.yaml</code>。请保存下面的完整内容：</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Pod
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> mall<span class="token punctuation">-</span>debug<span class="token punctuation">-</span>client
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> qingyun<span class="token punctuation">-</span>mall<span class="token punctuation">-</span>dev
  <span class="token key atrule">labels</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> qingyun<span class="token punctuation">-</span>mall
    <span class="token key atrule">role</span><span class="token punctuation">:</span> debug<span class="token punctuation">-</span>client
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">containers</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> toolbox
      <span class="token key atrule">image</span><span class="token punctuation">:</span> busybox<span class="token punctuation">:</span>1.36.1
      <span class="token key atrule">command</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> sh
        <span class="token punctuation">-</span> <span class="token punctuation">-</span>c
        <span class="token punctuation">-</span> sleep 3600
  <span class="token key atrule">restartPolicy</span><span class="token punctuation">:</span> Never
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>创建位于开发环境的调试客户端：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl apply <span class="token parameter variable">-f</span> labs/10-Namespace/03-开发环境客户端.yaml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>等待它就绪：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl <span class="token function">wait</span> <span class="token parameter variable">--for</span><span class="token operator">=</span>condition<span class="token operator">=</span>Ready <span class="token punctuation">\\</span>
  pod/mall-debug-client <span class="token punctuation">\\</span>
  <span class="token parameter variable">-n</span> qingyun-mall-dev <span class="token punctuation">\\</span>
  <span class="token parameter variable">--timeout</span><span class="token operator">=</span>60s
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>客户端和开发环境 Service 位于同一 Namespace，因此可以使用短名称：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl <span class="token builtin class-name">exec</span> <span class="token parameter variable">-n</span> qingyun-mall-dev mall-debug-client -- <span class="token punctuation">\\</span>
  <span class="token function">wget</span> -qO- http://qingyun-mall-web
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>这个短名称默认指向同一 Namespace 中的：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>qingyun-mall-web.qingyun-mall-dev.svc.cluster.local
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>如果开发环境客户端要访问测试环境，就要明确写出测试 Namespace：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl <span class="token builtin class-name">exec</span> <span class="token parameter variable">-n</span> qingyun-mall-dev mall-debug-client -- <span class="token punctuation">\\</span>
  <span class="token function">wget</span> -qO- http://qingyun-mall-web.qingyun-mall-test
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>它的完整域名是：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>qingyun-mall-web.qingyun-mall-test.svc.cluster.local
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="九、namespace-隔离了什么" tabindex="-1"><a class="header-anchor" href="#九、namespace-隔离了什么" aria-hidden="true">#</a> 九、Namespace 隔离了什么</h2><p>Namespace 首先解决的是资源组织和名称范围问题：</p><ul><li>不同 Namespace 中可以存在同名 Deployment；</li><li>不同 Namespace 中可以存在同名 Service；</li><li>kubectl 可以按 Namespace 查询和操作；</li><li>Service DNS 名称包含 Namespace。</li></ul><h2 id="十、namespace-没有自动隔离什么" tabindex="-1"><a class="header-anchor" href="#十、namespace-没有自动隔离什么" aria-hidden="true">#</a> 十、Namespace 没有自动隔离什么</h2><p>不要把 Namespace 理解成一堵自动生成的绝对防火墙。</p><p>仅仅创建 Namespace，并不代表：</p><ul><li>开发环境一定不能访问测试环境；</li><li>CPU 和内存已经自动限制；</li><li>用户权限已经自动隔离；</li><li>两个环境可以安全使用同一个数据库。</li></ul><p>这些问题以后分别需要 NetworkPolicy、ResourceQuota、RBAC 和独立数据配置等机制。</p><p>本课只建立边界：</p><blockquote><p>Namespace 是逻辑分组和名称范围，不等于完整安全隔离。</p></blockquote><h2 id="十一、切换默认-namespace" tabindex="-1"><a class="header-anchor" href="#十一、切换默认-namespace" aria-hidden="true">#</a> 十一、切换默认 Namespace</h2><p>反复输入 <code>-n qingyun-mall-dev</code> 比较麻烦，可以修改当前 context 的默认 Namespace：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl config set-context <span class="token parameter variable">--current</span> <span class="token parameter variable">--namespace</span><span class="token operator">=</span>qingyun-mall-dev
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>之后执行：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl get pods
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>默认查询开发环境。</p><p>实验后切回 <code>default</code>：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl config set-context <span class="token parameter variable">--current</span> <span class="token parameter variable">--namespace</span><span class="token operator">=</span>default
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>修改默认 Namespace 只影响 kubectl 默认去哪查询，不会移动任何 Kubernetes 资源。</p><h2 id="十二、固定排障习惯" tabindex="-1"><a class="header-anchor" href="#十二、固定排障习惯" aria-hidden="true">#</a> 十二、固定排障习惯</h2><p>看到资源不存在或访问错环境时，按这个顺序检查：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>1. 当前操作的是哪个 Namespace？
2. 命令是否遗漏了 -n？
3. 用 -A 查看资源实际位于哪里。
4. Service DNS 中的 Namespace 是否正确？
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>常用命令：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl config view <span class="token parameter variable">--minify</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">-o</span> <span class="token assign-left variable">jsonpath</span><span class="token operator">=</span><span class="token string">&#39;{..namespace}{&quot;\\n&quot;}&#39;</span>

kubectl get pods <span class="token parameter variable">-A</span> <span class="token parameter variable">-l</span> <span class="token assign-left variable">app</span><span class="token operator">=</span>qingyun-mall
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果第一条命令输出为空，通常表示使用默认的 <code>default</code> Namespace。</p><h2 id="十三、清理实验" tabindex="-1"><a class="header-anchor" href="#十三、清理实验" aria-hidden="true">#</a> 十三、清理实验</h2><p>先确保 kubectl 默认 Namespace 回到 <code>default</code>：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl config set-context <span class="token parameter variable">--current</span> <span class="token parameter variable">--namespace</span><span class="token operator">=</span>default
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>然后删除两个实验 Namespace：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl delete namespace qingyun-mall-dev qingyun-mall-test
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>删除 Namespace 会删除其中的所有资源。本实验中两个 Namespace 都是专门创建的，可以整体清理；生产环境执行前必须确认范围。</p><p>最后检查：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl get ns <span class="token operator">|</span> <span class="token function">grep</span> qingyun-mall
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>没有输出表示清理完成。</p><h2 id="十四、问题与直接回答" tabindex="-1"><a class="header-anchor" href="#十四、问题与直接回答" aria-hidden="true">#</a> 十四、问题与直接回答</h2><h3 id="不同-namespace-可以创建同名-pod-或-service-吗" tabindex="-1"><a class="header-anchor" href="#不同-namespace-可以创建同名-pod-或-service-吗" aria-hidden="true">#</a> 不同 Namespace 可以创建同名 Pod 或 Service 吗？</h3><p>可以。它们属于不同的名称范围。</p><h3 id="为什么不加-n-会提示-notfound" tabindex="-1"><a class="header-anchor" href="#为什么不加-n-会提示-notfound" aria-hidden="true">#</a> 为什么不加 <code>-n</code> 会提示 NotFound？</h3><p>kubectl 默认只查询当前 Namespace，资源可能位于其他 Namespace。</p><h3 id="n-和-namespace-有区别吗" tabindex="-1"><a class="header-anchor" href="#n-和-namespace-有区别吗" aria-hidden="true">#</a> <code>-n</code> 和 <code>--namespace</code> 有区别吗？</h3><p>没有，<code>-n</code> 是简写。</p><h3 id="namespace-是网络防火墙吗" tabindex="-1"><a class="header-anchor" href="#namespace-是网络防火墙吗" aria-hidden="true">#</a> Namespace 是网络防火墙吗？</h3><p>不是。默认情况下，跨 Namespace 网络访问通常仍然可行。</p><h3 id="删除-namespace-会发生什么" tabindex="-1"><a class="header-anchor" href="#删除-namespace-会发生什么" aria-hidden="true">#</a> 删除 Namespace 会发生什么？</h3><p>该 Namespace 中的 Deployment、Pod、Service 等资源会一起删除，所以这是高影响操作，必须确认目标。</p><h2 id="本课只记住五句话" tabindex="-1"><a class="header-anchor" href="#本课只记住五句话" aria-hidden="true">#</a> 本课只记住五句话</h2><ol><li>Namespace 是集群中的逻辑分组和名称范围。</li><li>不同 Namespace 可以拥有同类型、同名称的资源。</li><li>kubectl 用 <code>-n</code> 指定 Namespace，用 <code>-A</code> 查看全部 Namespace。</li><li>同 Namespace 访问 Service 可用短名称，跨 Namespace 要带上 Namespace。</li><li>Namespace 不等于完整的网络、权限和资源隔离。</li></ol><h2 id="下一课预告" tabindex="-1"><a class="header-anchor" href="#下一课预告" aria-hidden="true">#</a> 下一课预告</h2><p>下一课学习 ConfigMap。我们会把青云商城的环境名称和页面配置从容器镜像中拿出来，让开发环境和测试环境使用不同配置。</p>`,124),t=[i];function p(c,u){return n(),s("div",null,t)}const o=a(l,[["render",p],["__file","13-第十二课-Namespace环境隔离.html.vue"]]);export{o as default};
