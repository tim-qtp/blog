import{_ as p,W as c,X as o,$ as s,a0 as n,Z as t,a2 as e,C as i}from"./framework-6a3aa88c.js";const l={},u=s("h3",{id:"_1、图片裁剪",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#_1、图片裁剪","aria-hidden":"true"},"#"),n(" 1、图片裁剪：")],-1),k={href:"https://github.com/xyxiao001/vue-cropper?tab=readme-ov-file#2-%E5%BC%95%E5%85%A5-vue-cropper",target:"_blank",rel:"noopener noreferrer"},r=e('<p>效果大概是这样</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503211743733.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>不过测试的时候出现了一个问题，就是图片不显示，这是因为出现了跨域问题</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503211736490.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>这是因为前端域名和服务器（对象存储）的域名不一样导致的。</p><p>解决跨域问题的方式有很多，因为图片地址全部都是同一个对象存储 URL，所以可以直接登录云平台来修改对象存储的跨域访问 CORS 设置，直接给特定的源站（域名 + 端口）开放跨域。如图：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503211742941.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>这样就可以出现了！</p><h3 id="_2、ai扩图" tabindex="-1"><a class="header-anchor" href="#_2、ai扩图" aria-hidden="true">#</a> 2、AI扩图</h3><p>随着 AI 的高速发展，AI 几乎可以应用到任何传统业务中，增强应用的功能，带给用户更好的体验。</p><p>对于图库网站来说，AI 也有非常多的应用空间，比如可以利用 AI 绘图大模型来编辑图片，实现扩图、擦除补全、图配文、去水印等功能。</p><p>哈哈哈，说了点骚话。</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503211750358.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>',13),d={href:"https://click.aliyun.com/m/1000400273/",target:"_blank",rel:"noopener noreferrer"},v=s("figure",null,[s("img",{src:"https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503211810099.png",alt:"",tabindex:"0",loading:"lazy"}),s("figcaption")],-1),m={href:"https://click.aliyun.com/m/1000400274/",target:"_blank",rel:"noopener noreferrer"},b={href:"https://click.aliyun.com/m/1000400275/",target:"_blank",rel:"noopener noreferrer"},g={href:"https://click.aliyun.com/m/1000400407/",target:"_blank",rel:"noopener noreferrer"},y=s("h4",{id:"_1、调用方式",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#_1、调用方式","aria-hidden":"true"},"#"),n(" 1、调用方式")],-1),f={href:"https://click.aliyun.com/m/1000400274/",target:"_blank",rel:"noopener noreferrer"},h=e(`<figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503212236940.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>这是因为 AI 绘画任务计算量大且耗时长，同步调用会导致服务器线程长时间被单个任务占用，限制了并发处理能力，增加了超时和系统崩溃的风险。通过异步调用，服务器可以将任务放入队列中，合理调度资源，避免阻塞主线程，从而更高效地服务多个用户请求，提升整体系统的稳定性和可扩展性。</p><p>同步调用流程如下，好处是客户端可以直接获取到结果，调用更方便：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503212254136.png" alt="image-20250321225403083" tabindex="0" loading="lazy"><figcaption>image-20250321225403083</figcaption></figure><p>由于 AI 接口已经选择了异步调用，所以我们作为要调用 AI 接口的客户端，要使用轮询的方式来检查任务状态是否为 “已完成”，如果完成了，才可以获取到生成的图片。</p><h4 id="_2、那么是前端轮询还是后端轮询呢" tabindex="-1"><a class="header-anchor" href="#_2、那么是前端轮询还是后端轮询呢" aria-hidden="true">#</a> 2、那么是前端轮询还是后端轮询呢？</h4><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503212303817.png" alt="image-20250321230355755" tabindex="0" loading="lazy"><figcaption>image-20250321230355755</figcaption></figure><p>1）前端轮询（前调后，后调AI）</p><p>前端调用后端提交任务后得到任务 ID，然后通过定时器轮询请求查询任务状态接口，直到任务完成或失败。示例代码：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token comment">// 提交任务</span>
<span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token function">submitTask</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> response <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token function">fetch</span><span class="token punctuation">(</span><span class="token string">&#39;/api/createTask&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">{</span> method<span class="token operator">:</span> <span class="token string">&#39;POST&#39;</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> <span class="token punctuation">{</span> taskId <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token keyword">await</span> response<span class="token punctuation">.</span><span class="token function">json</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">checkTaskStatus</span><span class="token punctuation">(</span>taskId<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token comment">// 调用</span>
<span class="token function">submitTask</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// 检查任务状态</span>
<span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token function">checkTaskStatus</span><span class="token punctuation">(</span>taskId<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> intervalId <span class="token operator">=</span> <span class="token function">setInterval</span><span class="token punctuation">(</span><span class="token keyword">async</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> response <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token function">fetch</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">/api/taskStatus?taskId=</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>taskId<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">const</span> <span class="token punctuation">{</span> status<span class="token punctuation">,</span> result <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token keyword">await</span> response<span class="token punctuation">.</span><span class="token function">json</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token keyword">if</span> <span class="token punctuation">(</span>status <span class="token operator">===</span> <span class="token string">&#39;success&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;Task completed:&#39;</span><span class="token punctuation">,</span> result<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token function">clearInterval</span><span class="token punctuation">(</span>intervalId<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 停止轮询</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>status <span class="token operator">===</span> <span class="token string">&#39;failed&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span><span class="token string">&#39;Task failed&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token function">clearInterval</span><span class="token punctuation">(</span>intervalId<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 停止轮询</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">2000</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 每隔 2 秒轮询</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>2）后端轮询</p><p>后端通过循环或定时任务检测任务状态，<mark>接口保持阻塞</mark>，直到任务完成或失败，直接返回结果给前端。示例代码：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@RestController</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">TaskController</span> <span class="token punctuation">{</span>

    <span class="token annotation punctuation">@PostMapping</span><span class="token punctuation">(</span><span class="token string">&quot;/createTask&quot;</span><span class="token punctuation">)</span>
    <span class="token keyword">public</span> <span class="token class-name">String</span> <span class="token function">createTask</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">String</span> taskId <span class="token operator">=</span> taskService<span class="token punctuation">.</span><span class="token function">submitTask</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">return</span> taskId<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token annotation punctuation">@GetMapping</span><span class="token punctuation">(</span><span class="token string">&quot;/waitForTask&quot;</span><span class="token punctuation">)</span>
    <span class="token keyword">public</span> <span class="token class-name">ResponseEntity</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> <span class="token function">waitForTask</span><span class="token punctuation">(</span><span class="token annotation punctuation">@RequestParam</span> <span class="token class-name">String</span> taskId<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">while</span> <span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token class-name">String</span> status <span class="token operator">=</span> taskService<span class="token punctuation">.</span><span class="token function">checkTaskStatus</span><span class="token punctuation">(</span>taskId<span class="token punctuation">)</span><span class="token punctuation">;</span>

            <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token string">&quot;success&quot;</span><span class="token punctuation">.</span><span class="token function">equals</span><span class="token punctuation">(</span>status<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token keyword">return</span> <span class="token class-name">ResponseEntity</span><span class="token punctuation">.</span><span class="token function">ok</span><span class="token punctuation">(</span><span class="token string">&quot;Task completed&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token string">&quot;failed&quot;</span><span class="token punctuation">.</span><span class="token function">equals</span><span class="token punctuation">(</span>status<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token keyword">return</span> <span class="token class-name">ResponseEntity</span><span class="token punctuation">.</span><span class="token function">status</span><span class="token punctuation">(</span><span class="token class-name">HttpStatus</span><span class="token punctuation">.</span><span class="token constant">INTERNAL_SERVER_ERROR</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">body</span><span class="token punctuation">(</span><span class="token string">&quot;Task failed&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>

            <span class="token keyword">try</span> <span class="token punctuation">{</span>
                <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">sleep</span><span class="token punctuation">(</span><span class="token number">2000</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 等待 2 秒后重试</span>
            <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">InterruptedException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token keyword">return</span> <span class="token class-name">ResponseEntity</span><span class="token punctuation">.</span><span class="token function">status</span><span class="token punctuation">(</span><span class="token class-name">HttpStatus</span><span class="token punctuation">.</span><span class="token constant">INTERNAL_SERVER_ERROR</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">body</span><span class="token punctuation">(</span><span class="token string">&quot;Error occurred&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>显然，后端轮询容易因为任务阻塞导致资源耗尽，所以通常推荐 <strong>前端轮询</strong>。</p><h3 id="_3、后端开发" tabindex="-1"><a class="header-anchor" href="#_3、后端开发" aria-hidden="true">#</a> 3、后端开发</h3><h4 id="_1、ai-扩图-api" tabindex="-1"><a class="header-anchor" href="#_1、ai-扩图-api" aria-hidden="true">#</a> 1、AI 扩图 API</h4><p>首先开发业务依赖的基础能力，也就是 AI 扩图 API。</p>`,17),w={href:"https://click.aliyun.com/m/1000400275/",target:"_blank",rel:"noopener noreferrer"},q={href:"https://click.aliyun.com/m/1000400408/",target:"_blank",rel:"noopener noreferrer"},_=e(`<p>能够在控制台查看到 API Key，注意，API Key 一定不要对外泄露！</p><p>通过阅读文档发现，百炼支持通过 SDK 或 HTTP 调用。虽然官方写的支持 Java SDK，但 AI 扩图功能中对 SDK 的介绍非常少，此处考虑到兼容性，我们还是 <strong>使用 HTTP 调用</strong>。</p><p>由于使用异步的方式，需要开发创建任务和查询结果 2 个 API</p><p>3）在配置文件中填写获取到的 apiKey：</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token comment"># 阿里云 AI 配置</span>
<span class="token key atrule">aliYunAi</span><span class="token punctuation">:</span>
  <span class="token key atrule">apiKey</span><span class="token punctuation">:</span> xxxx
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>4）新建数据模型类</p><p>在 <code>api</code> 包下新建 <code>aliyunai</code> 包，存放阿里云 AI 相关代码。</p>`,7),I=s("code",null,"aliyunai.model",-1),R={href:"https://help.aliyun.com/zh/model-studio/developer-reference/image-scaling-api?utm_content=m_1000400274",target:"_blank",rel:"noopener noreferrer"},P=e(`<div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">curl</span> <span class="token parameter variable">--location</span> <span class="token parameter variable">--request</span> POST <span class="token string">&#39;https://dashscope.aliyuncs.com/api/v1/services/aigc/image2image/out-painting&#39;</span> <span class="token punctuation">\\</span>
<span class="token parameter variable">--header</span> <span class="token string">&quot;Authorization: Bearer <span class="token variable">$DASHSCOPE_API_KEY</span>&quot;</span> <span class="token punctuation">\\</span>
<span class="token parameter variable">--header</span> <span class="token string">&#39;X-DashScope-Async: enable&#39;</span> <span class="token punctuation">\\</span>
<span class="token parameter variable">--header</span> <span class="token string">&#39;Content-Type: application/json&#39;</span> <span class="token punctuation">\\</span>
<span class="token parameter variable">--data</span> <span class="token string">&#39;{
    &quot;model&quot;: &quot;image-out-painting&quot;,
    &quot;input&quot;: {
        &quot;image_url&quot;: &quot;http://xxx/image.jpg&quot;
    },
    &quot;parameters&quot;:{
        &quot;angle&quot;: 45,
        &quot;x_scale&quot;:1.5,
        &quot;y_scale&quot;:1.5
    }
}&#39;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>由于每个 AI 图片处理操的请求响应都有一些区别，所以单独给 AI 扩图功能编写具体的请求响应类。</p><p>创建扩图任务请求类：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Data</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">CreateOutPaintingTaskRequest</span> <span class="token keyword">implements</span> <span class="token class-name">Serializable</span> <span class="token punctuation">{</span>

    <span class="token doc-comment comment">/**
     * 模型，例如 &quot;image-out-painting&quot;
     */</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> model <span class="token operator">=</span> <span class="token string">&quot;image-out-painting&quot;</span><span class="token punctuation">;</span>

    <span class="token doc-comment comment">/**
     * 输入图像信息
     */</span>
    <span class="token keyword">private</span> <span class="token class-name">Input</span> input<span class="token punctuation">;</span>

    <span class="token doc-comment comment">/**
     * 图像处理参数
     */</span>
    <span class="token keyword">private</span> <span class="token class-name">Parameters</span> parameters<span class="token punctuation">;</span>

    <span class="token annotation punctuation">@Data</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">class</span> <span class="token class-name">Input</span> <span class="token punctuation">{</span>
        <span class="token doc-comment comment">/**
         * 必选，图像 URL
         */</span>
        <span class="token annotation punctuation">@Alias</span><span class="token punctuation">(</span><span class="token string">&quot;image_url&quot;</span><span class="token punctuation">)</span>
        <span class="token keyword">private</span> <span class="token class-name">String</span> imageUrl<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token annotation punctuation">@Data</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">class</span> <span class="token class-name">Parameters</span> <span class="token keyword">implements</span> <span class="token class-name">Serializable</span> <span class="token punctuation">{</span>
        <span class="token doc-comment comment">/**
         * 可选，逆时针旋转角度，默认值 0，取值范围 [0, 359]
         */</span>
        <span class="token keyword">private</span> <span class="token class-name">Integer</span> angle<span class="token punctuation">;</span>

        <span class="token doc-comment comment">/**
         * 可选，输出图像的宽高比，默认空字符串，不设置宽高比
         * 可选值：[&quot;&quot;, &quot;1:1&quot;, &quot;3:4&quot;, &quot;4:3&quot;, &quot;9:16&quot;, &quot;16:9&quot;]
         */</span>
        <span class="token annotation punctuation">@Alias</span><span class="token punctuation">(</span><span class="token string">&quot;output_ratio&quot;</span><span class="token punctuation">)</span>
        <span class="token keyword">private</span> <span class="token class-name">String</span> outputRatio<span class="token punctuation">;</span>

        <span class="token doc-comment comment">/**
         * 可选，图像居中，在水平方向上按比例扩展，默认值 1.0，范围 [1.0, 3.0]
         */</span>
        <span class="token annotation punctuation">@Alias</span><span class="token punctuation">(</span><span class="token string">&quot;x_scale&quot;</span><span class="token punctuation">)</span>
        <span class="token annotation punctuation">@JsonProperty</span><span class="token punctuation">(</span><span class="token string">&quot;xScale&quot;</span><span class="token punctuation">)</span>
        <span class="token keyword">private</span> <span class="token class-name">Float</span> xScale<span class="token punctuation">;</span>

        <span class="token doc-comment comment">/**
         * 可选，图像居中，在垂直方向上按比例扩展，默认值 1.0，范围 [1.0, 3.0]
         */</span>
        <span class="token annotation punctuation">@Alias</span><span class="token punctuation">(</span><span class="token string">&quot;y_scale&quot;</span><span class="token punctuation">)</span>
        <span class="token annotation punctuation">@JsonProperty</span><span class="token punctuation">(</span><span class="token string">&quot;yScale&quot;</span><span class="token punctuation">)</span>
        <span class="token keyword">private</span> <span class="token class-name">Float</span> yScale<span class="token punctuation">;</span>

        <span class="token doc-comment comment">/**
         * 可选，在图像上方添加像素，默认值 0
         */</span>
        <span class="token annotation punctuation">@Alias</span><span class="token punctuation">(</span><span class="token string">&quot;top_offset&quot;</span><span class="token punctuation">)</span>
        <span class="token keyword">private</span> <span class="token class-name">Integer</span> topOffset<span class="token punctuation">;</span>

        <span class="token doc-comment comment">/**
         * 可选，在图像下方添加像素，默认值 0
         */</span>
        <span class="token annotation punctuation">@Alias</span><span class="token punctuation">(</span><span class="token string">&quot;bottom_offset&quot;</span><span class="token punctuation">)</span>
        <span class="token keyword">private</span> <span class="token class-name">Integer</span> bottomOffset<span class="token punctuation">;</span>

        <span class="token doc-comment comment">/**
         * 可选，在图像左侧添加像素，默认值 0
         */</span>
        <span class="token annotation punctuation">@Alias</span><span class="token punctuation">(</span><span class="token string">&quot;left_offset&quot;</span><span class="token punctuation">)</span>
        <span class="token keyword">private</span> <span class="token class-name">Integer</span> leftOffset<span class="token punctuation">;</span>

        <span class="token doc-comment comment">/**
         * 可选，在图像右侧添加像素，默认值 0
         */</span>
        <span class="token annotation punctuation">@Alias</span><span class="token punctuation">(</span><span class="token string">&quot;right_offset&quot;</span><span class="token punctuation">)</span>
        <span class="token keyword">private</span> <span class="token class-name">Integer</span> rightOffset<span class="token punctuation">;</span>

        <span class="token doc-comment comment">/**
         * 可选，开启图像最佳质量模式，默认值 false
         * 若为 true，耗时会成倍增加
         */</span>
        <span class="token annotation punctuation">@Alias</span><span class="token punctuation">(</span><span class="token string">&quot;best_quality&quot;</span><span class="token punctuation">)</span>
        <span class="token keyword">private</span> <span class="token class-name">Boolean</span> bestQuality<span class="token punctuation">;</span>

        <span class="token doc-comment comment">/**
         * 可选，限制模型生成的图像文件大小，默认值 true
         * - 单边长度 &lt;= 10000：输出图像文件大小限制为 5MB 以下
         * - 单边长度 &gt; 10000：输出图像文件大小限制为 10MB 以下
         */</span>
        <span class="token annotation punctuation">@Alias</span><span class="token punctuation">(</span><span class="token string">&quot;limit_image_size&quot;</span><span class="token punctuation">)</span>
        <span class="token keyword">private</span> <span class="token class-name">Boolean</span> limitImageSize<span class="token punctuation">;</span>

        <span class="token doc-comment comment">/**
         * 可选，添加 &quot;Generated by AI&quot; 水印，默认值 true
         */</span>
        <span class="token annotation punctuation">@Alias</span><span class="token punctuation">(</span><span class="token string">&quot;add_watermark&quot;</span><span class="token punctuation">)</span>
        <span class="token keyword">private</span> <span class="token class-name">Boolean</span> addWatermark <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>注意，上述代码中，某些字段打上了 Hutool 工具类的 <code>@Alias</code> 注解，这个注解仅对 Hutool 的 JSON 转换生效，对 SpringMVC 的 JSON 转换没有任何影响。</p>`,5),T={href:"https://blog.csdn.net/JokerHH/article/details/88729590",target:"_blank",rel:"noopener noreferrer"},S=e(`<p>解决方案是，给这些字段增加 <code>@JsonProperty</code> 注解：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token doc-comment comment">/**
 * 可选，图像居中，在水平方向上按比例扩展，默认值 1.0，范围 [1.0, 3.0]
 */</span>
<span class="token annotation punctuation">@Alias</span><span class="token punctuation">(</span><span class="token string">&quot;x_scale&quot;</span><span class="token punctuation">)</span>
<span class="token annotation punctuation">@JsonProperty</span><span class="token punctuation">(</span><span class="token string">&quot;xScale&quot;</span><span class="token punctuation">)</span>
<span class="token keyword">private</span> <span class="token class-name">Float</span> xScale<span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * 可选，图像居中，在垂直方向上按比例扩展，默认值 1.0，范围 [1.0, 3.0]
 */</span>
<span class="token annotation punctuation">@Alias</span><span class="token punctuation">(</span><span class="token string">&quot;y_scale&quot;</span><span class="token punctuation">)</span>
<span class="token annotation punctuation">@JsonProperty</span><span class="token punctuation">(</span><span class="token string">&quot;yScale&quot;</span><span class="token punctuation">)</span>
<span class="token keyword">private</span> <span class="token class-name">Float</span> yScale<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>为什么 SpringMVC 要这样设计呢？通过查阅了解到，这是因为 Jackson 在处理字段名与 JSON 属性名映射时，会依赖 Java 的 <strong>标准命名规范</strong> 和 <strong>反射 API</strong>。</p><p>举个例子，根据 JavaBean 的规范，属性名称与其访问器方法（getter 和 setter）之间的映射规则是：如果属性名以小写字母开头，第二个字母是大写（如 <code>eMail</code>），规范仍认为属性名称是 <code>eMail</code>，而访问器方法应为 <code>geteMail()</code> 和 <code>seteMail()</code>。但 Jackson 会尝试推断属性名为 <code>email</code>（因为 <code>eMail</code> 不常见），从而导致 JSON 中 <code>eMail</code> 或 <code>email</code> 可能无法正确映射。</p><p>创建扩图任务响应类：</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">{</span>
    <span class="token property">&quot;output&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token property">&quot;task_status&quot;</span><span class="token operator">:</span> <span class="token string">&quot;PENDING&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;task_id&quot;</span><span class="token operator">:</span> <span class="token string">&quot;0385dc79-5ff8-4d82-bcb6-xxxxxx&quot;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token property">&quot;request_id&quot;</span><span class="token operator">:</span> <span class="token string">&quot;4909100c-7b5a-9f92-bfe5-xxxxxx&quot;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Data</span>
<span class="token annotation punctuation">@NoArgsConstructor</span>
<span class="token annotation punctuation">@AllArgsConstructor</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">CreateOutPaintingTaskResponse</span> <span class="token punctuation">{</span>

    <span class="token keyword">private</span> <span class="token class-name">Output</span> output<span class="token punctuation">;</span>

    <span class="token doc-comment comment">/**
     * 表示任务的输出信息
     */</span>
    <span class="token annotation punctuation">@Data</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">class</span> <span class="token class-name">Output</span> <span class="token punctuation">{</span>

        <span class="token doc-comment comment">/**
         * 任务 ID
         */</span>
        <span class="token keyword">private</span> <span class="token class-name">String</span> taskId<span class="token punctuation">;</span>

        <span class="token doc-comment comment">/**
         * 任务状态
         * <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>ul</span><span class="token punctuation">&gt;</span></span>
         *     <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span><span class="token punctuation">&gt;</span></span>PENDING：排队中<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">&gt;</span></span>
         *     <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span><span class="token punctuation">&gt;</span></span>RUNNING：处理中<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">&gt;</span></span>
         *     <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span><span class="token punctuation">&gt;</span></span>SUSPENDED：挂起<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">&gt;</span></span>
         *     <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span><span class="token punctuation">&gt;</span></span>SUCCEEDED：执行成功<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">&gt;</span></span>
         *     <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span><span class="token punctuation">&gt;</span></span>FAILED：执行失败<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">&gt;</span></span>
         *     <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span><span class="token punctuation">&gt;</span></span>UNKNOWN：任务不存在或状态未知<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">&gt;</span></span>
         * <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>ul</span><span class="token punctuation">&gt;</span></span>
         */</span>
        <span class="token keyword">private</span> <span class="token class-name">String</span> taskStatus<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 接口错误码。
     * <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">&gt;</span></span>接口成功请求不会返回该参数。<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">&gt;</span></span>
     */</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> code<span class="token punctuation">;</span>

    <span class="token doc-comment comment">/**
     * 接口错误信息。
     * <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">&gt;</span></span>接口成功请求不会返回该参数。<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">&gt;</span></span>
     */</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> message<span class="token punctuation">;</span>

    <span class="token doc-comment comment">/**
     * 请求唯一标识。
     * <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">&gt;</span></span>可用于请求明细溯源和问题排查。<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">&gt;</span></span>
     */</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> requestId<span class="token punctuation">;</span>

<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>查询任务响应类：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Data</span>
<span class="token annotation punctuation">@NoArgsConstructor</span>
<span class="token annotation punctuation">@AllArgsConstructor</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">GetOutPaintingTaskResponse</span> <span class="token punctuation">{</span>

    <span class="token doc-comment comment">/**
     * 请求唯一标识
     */</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> requestId<span class="token punctuation">;</span>

    <span class="token doc-comment comment">/**
     * 输出信息
     */</span>
    <span class="token keyword">private</span> <span class="token class-name">Output</span> output<span class="token punctuation">;</span>

    <span class="token doc-comment comment">/**
     * 表示任务的输出信息
     */</span>
    <span class="token annotation punctuation">@Data</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">class</span> <span class="token class-name">Output</span> <span class="token punctuation">{</span>

        <span class="token doc-comment comment">/**
         * 任务 ID
         */</span>
        <span class="token keyword">private</span> <span class="token class-name">String</span> taskId<span class="token punctuation">;</span>

        <span class="token doc-comment comment">/**
         * 任务状态
         * <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>ul</span><span class="token punctuation">&gt;</span></span>
         *     <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span><span class="token punctuation">&gt;</span></span>PENDING：排队中<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">&gt;</span></span>
         *     <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span><span class="token punctuation">&gt;</span></span>RUNNING：处理中<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">&gt;</span></span>
         *     <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span><span class="token punctuation">&gt;</span></span>SUSPENDED：挂起<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">&gt;</span></span>
         *     <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span><span class="token punctuation">&gt;</span></span>SUCCEEDED：执行成功<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">&gt;</span></span>
         *     <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span><span class="token punctuation">&gt;</span></span>FAILED：执行失败<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">&gt;</span></span>
         *     <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span><span class="token punctuation">&gt;</span></span>UNKNOWN：任务不存在或状态未知<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">&gt;</span></span>
         * <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>ul</span><span class="token punctuation">&gt;</span></span>
         */</span>
        <span class="token keyword">private</span> <span class="token class-name">String</span> taskStatus<span class="token punctuation">;</span>

        <span class="token doc-comment comment">/**
         * 提交时间
         * 格式：YYYY-MM-DD HH:mm:ss.SSS
         */</span>
        <span class="token keyword">private</span> <span class="token class-name">String</span> submitTime<span class="token punctuation">;</span>

        <span class="token doc-comment comment">/**
         * 调度时间
         * 格式：YYYY-MM-DD HH:mm:ss.SSS
         */</span>
        <span class="token keyword">private</span> <span class="token class-name">String</span> scheduledTime<span class="token punctuation">;</span>

        <span class="token doc-comment comment">/**
         * 结束时间
         * 格式：YYYY-MM-DD HH:mm:ss.SSS
         */</span>
        <span class="token keyword">private</span> <span class="token class-name">String</span> endTime<span class="token punctuation">;</span>

        <span class="token doc-comment comment">/**
         * 输出图像的 URL
         */</span>
        <span class="token keyword">private</span> <span class="token class-name">String</span> outputImageUrl<span class="token punctuation">;</span>

        <span class="token doc-comment comment">/**
         * 接口错误码
         * <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">&gt;</span></span>接口成功请求不会返回该参数<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">&gt;</span></span>
         */</span>
        <span class="token keyword">private</span> <span class="token class-name">String</span> code<span class="token punctuation">;</span>

        <span class="token doc-comment comment">/**
         * 接口错误信息
         * <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">&gt;</span></span>接口成功请求不会返回该参数<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">&gt;</span></span>
         */</span>
        <span class="token keyword">private</span> <span class="token class-name">String</span> message<span class="token punctuation">;</span>

        <span class="token doc-comment comment">/**
         * 任务指标信息
         */</span>
        <span class="token keyword">private</span> <span class="token class-name">TaskMetrics</span> taskMetrics<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 表示任务的统计信息
     */</span>
    <span class="token annotation punctuation">@Data</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">class</span> <span class="token class-name">TaskMetrics</span> <span class="token punctuation">{</span>

        <span class="token doc-comment comment">/**
         * 总任务数
         */</span>
        <span class="token keyword">private</span> <span class="token class-name">Integer</span> total<span class="token punctuation">;</span>

        <span class="token doc-comment comment">/**
         * 成功任务数
         */</span>
        <span class="token keyword">private</span> <span class="token class-name">Integer</span> succeeded<span class="token punctuation">;</span>

        <span class="token doc-comment comment">/**
         * 失败任务数
         */</span>
        <span class="token keyword">private</span> <span class="token class-name">Integer</span> failed<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>5）开发 API 调用类，通过 Hutool 的 HTTP 请求工具类来调用阿里云百炼的 API：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Slf4j</span>
<span class="token annotation punctuation">@Component</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">AliYunAiApi</span> <span class="token punctuation">{</span>
    <span class="token comment">// 读取配置文件</span>
    <span class="token annotation punctuation">@Value</span><span class="token punctuation">(</span><span class="token string">&quot;\${aliYunAi.apiKey}&quot;</span><span class="token punctuation">)</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> apiKey<span class="token punctuation">;</span>

    <span class="token comment">// 创建任务地址</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token class-name">String</span> <span class="token constant">CREATE_OUT_PAINTING_TASK_URL</span> <span class="token operator">=</span> <span class="token string">&quot;https://dashscope.aliyuncs.com/api/v1/services/aigc/image2image/out-painting&quot;</span><span class="token punctuation">;</span>

    <span class="token comment">// 查询任务状态</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token class-name">String</span> <span class="token constant">GET_OUT_PAINTING_TASK_URL</span> <span class="token operator">=</span> <span class="token string">&quot;https://dashscope.aliyuncs.com/api/v1/tasks/%s&quot;</span><span class="token punctuation">;</span>

    <span class="token doc-comment comment">/**
     * 创建任务
     *
     * <span class="token keyword">@param</span> <span class="token parameter">createOutPaintingTaskRequest</span>
     * <span class="token keyword">@return</span>
     */</span>
    <span class="token keyword">public</span> <span class="token class-name">CreateOutPaintingTaskResponse</span> <span class="token function">createOutPaintingTask</span><span class="token punctuation">(</span><span class="token class-name">CreateOutPaintingTaskRequest</span> createOutPaintingTaskRequest<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>createOutPaintingTaskRequest <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">BusinessException</span><span class="token punctuation">(</span><span class="token class-name">ErrorCode</span><span class="token punctuation">.</span><span class="token constant">OPERATION_ERROR</span><span class="token punctuation">,</span> <span class="token string">&quot;扩图参数为空&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token comment">// 发送请求</span>
        <span class="token class-name">HttpRequest</span> httpRequest <span class="token operator">=</span> <span class="token class-name">HttpRequest</span><span class="token punctuation">.</span><span class="token function">post</span><span class="token punctuation">(</span><span class="token constant">CREATE_OUT_PAINTING_TASK_URL</span><span class="token punctuation">)</span>
                <span class="token punctuation">.</span><span class="token function">header</span><span class="token punctuation">(</span><span class="token class-name">Header</span><span class="token punctuation">.</span><span class="token constant">AUTHORIZATION</span><span class="token punctuation">,</span> <span class="token string">&quot;Bearer &quot;</span> <span class="token operator">+</span> apiKey<span class="token punctuation">)</span>
                <span class="token comment">// 必须开启异步处理，设置为enable。</span>
                <span class="token punctuation">.</span><span class="token function">header</span><span class="token punctuation">(</span><span class="token string">&quot;X-DashScope-Async&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;enable&quot;</span><span class="token punctuation">)</span>
                <span class="token punctuation">.</span><span class="token function">header</span><span class="token punctuation">(</span><span class="token class-name">Header</span><span class="token punctuation">.</span><span class="token constant">CONTENT_TYPE</span><span class="token punctuation">,</span> <span class="token class-name">ContentType</span><span class="token punctuation">.</span><span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">getValue</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
                <span class="token punctuation">.</span><span class="token function">body</span><span class="token punctuation">(</span><span class="token class-name">JSONUtil</span><span class="token punctuation">.</span><span class="token function">toJsonStr</span><span class="token punctuation">(</span>createOutPaintingTaskRequest<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">try</span> <span class="token punctuation">(</span><span class="token class-name">HttpResponse</span> httpResponse <span class="token operator">=</span> httpRequest<span class="token punctuation">.</span><span class="token function">execute</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>httpResponse<span class="token punctuation">.</span><span class="token function">isOk</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                log<span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span><span class="token string">&quot;请求异常：{}&quot;</span><span class="token punctuation">,</span> httpResponse<span class="token punctuation">.</span><span class="token function">body</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">BusinessException</span><span class="token punctuation">(</span><span class="token class-name">ErrorCode</span><span class="token punctuation">.</span><span class="token constant">OPERATION_ERROR</span><span class="token punctuation">,</span> <span class="token string">&quot;AI 扩图失败&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
            <span class="token class-name">CreateOutPaintingTaskResponse</span> response <span class="token operator">=</span> <span class="token class-name">JSONUtil</span><span class="token punctuation">.</span><span class="token function">toBean</span><span class="token punctuation">(</span>httpResponse<span class="token punctuation">.</span><span class="token function">body</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token class-name">CreateOutPaintingTaskResponse</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token class-name">String</span> errorCode <span class="token operator">=</span> response<span class="token punctuation">.</span><span class="token function">getCode</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token class-name">StrUtil</span><span class="token punctuation">.</span><span class="token function">isNotBlank</span><span class="token punctuation">(</span>errorCode<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token class-name">String</span> errorMessage <span class="token operator">=</span> response<span class="token punctuation">.</span><span class="token function">getMessage</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                log<span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span><span class="token string">&quot;AI 扩图失败，errorCode:{}, errorMessage:{}&quot;</span><span class="token punctuation">,</span> errorCode<span class="token punctuation">,</span> errorMessage<span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">BusinessException</span><span class="token punctuation">(</span><span class="token class-name">ErrorCode</span><span class="token punctuation">.</span><span class="token constant">OPERATION_ERROR</span><span class="token punctuation">,</span> <span class="token string">&quot;AI 扩图接口响应异常&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
            <span class="token keyword">return</span> response<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 查询创建的任务
     *
     * <span class="token keyword">@param</span> <span class="token parameter">taskId</span>
     * <span class="token keyword">@return</span>
     */</span>
    <span class="token keyword">public</span> <span class="token class-name">GetOutPaintingTaskResponse</span> <span class="token function">getOutPaintingTask</span><span class="token punctuation">(</span><span class="token class-name">String</span> taskId<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token class-name">StrUtil</span><span class="token punctuation">.</span><span class="token function">isBlank</span><span class="token punctuation">(</span>taskId<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">BusinessException</span><span class="token punctuation">(</span><span class="token class-name">ErrorCode</span><span class="token punctuation">.</span><span class="token constant">OPERATION_ERROR</span><span class="token punctuation">,</span> <span class="token string">&quot;任务 id 不能为空&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">try</span> <span class="token punctuation">(</span><span class="token class-name">HttpResponse</span> httpResponse <span class="token operator">=</span> <span class="token class-name">HttpRequest</span><span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">.</span><span class="token function">format</span><span class="token punctuation">(</span><span class="token constant">GET_OUT_PAINTING_TASK_URL</span><span class="token punctuation">,</span> taskId<span class="token punctuation">)</span><span class="token punctuation">)</span>
                <span class="token punctuation">.</span><span class="token function">header</span><span class="token punctuation">(</span><span class="token class-name">Header</span><span class="token punctuation">.</span><span class="token constant">AUTHORIZATION</span><span class="token punctuation">,</span> <span class="token string">&quot;Bearer &quot;</span> <span class="token operator">+</span> apiKey<span class="token punctuation">)</span>
                <span class="token punctuation">.</span><span class="token function">execute</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>httpResponse<span class="token punctuation">.</span><span class="token function">isOk</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">BusinessException</span><span class="token punctuation">(</span><span class="token class-name">ErrorCode</span><span class="token punctuation">.</span><span class="token constant">OPERATION_ERROR</span><span class="token punctuation">,</span> <span class="token string">&quot;获取任务失败&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
            <span class="token keyword">return</span> <span class="token class-name">JSONUtil</span><span class="token punctuation">.</span><span class="token function">toBean</span><span class="token punctuation">(</span>httpResponse<span class="token punctuation">.</span><span class="token function">body</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token class-name">GetOutPaintingTaskResponse</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>注意，要按照官方文档的要求给请求头增加鉴权信息，拼接配置中写好的 apiKey：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503212346263.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503212333885.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h4 id="_2、扩图服务" tabindex="-1"><a class="header-anchor" href="#_2、扩图服务" aria-hidden="true">#</a> 2、扩图服务</h4><p>在 <code>model.dto.picture</code> 包下新建 AI 扩图请求类，用于接受前端传来的参数并传递给 Service 服务层。字段包括图片 id 和扩图参数：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Data</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">CreatePictureOutPaintingTaskRequest</span> <span class="token keyword">implements</span> <span class="token class-name">Serializable</span> <span class="token punctuation">{</span>

    <span class="token doc-comment comment">/**
     * 图片 id
     */</span>
    <span class="token keyword">private</span> <span class="token class-name">Long</span> pictureId<span class="token punctuation">;</span>

    <span class="token doc-comment comment">/**
     * 扩图参数
     */</span>
    <span class="token keyword">private</span> <span class="token class-name">CreateOutPaintingTaskRequest<span class="token punctuation">.</span>Parameters</span> parameters<span class="token punctuation">;</span>

    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token keyword">long</span> serialVersionUID <span class="token operator">=</span> <span class="token number">1L</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在图片服务中编写创建扩图任务方法，从数据库中获取图片信息和 url 地址，构造请求参数后调用 api 创建扩图任务。注意，如果图片有空间 id，则需要校验权限，直接复用以前的权限校验方法。</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Override</span>
<span class="token keyword">public</span> <span class="token class-name">CreateOutPaintingTaskResponse</span> <span class="token function">createPictureOutPaintingTask</span><span class="token punctuation">(</span><span class="token class-name">CreatePictureOutPaintingTaskRequest</span> createPictureOutPaintingTaskRequest<span class="token punctuation">,</span> <span class="token class-name">User</span> loginUser<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 获取图片信息</span>
    <span class="token class-name">Long</span> pictureId <span class="token operator">=</span> createPictureOutPaintingTaskRequest<span class="token punctuation">.</span><span class="token function">getPictureId</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token class-name">Picture</span> picture <span class="token operator">=</span> <span class="token class-name">Optional</span><span class="token punctuation">.</span><span class="token function">ofNullable</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">getById</span><span class="token punctuation">(</span>pictureId<span class="token punctuation">)</span><span class="token punctuation">)</span>
            <span class="token punctuation">.</span><span class="token function">orElseThrow</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">-&gt;</span> <span class="token keyword">new</span> <span class="token class-name">BusinessException</span><span class="token punctuation">(</span><span class="token class-name">ErrorCode</span><span class="token punctuation">.</span><span class="token constant">NOT_FOUND_ERROR</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// 权限校验</span>
    <span class="token function">checkPictureAuth</span><span class="token punctuation">(</span>loginUser<span class="token punctuation">,</span> picture<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// 构造请求参数</span>
    <span class="token class-name">CreateOutPaintingTaskRequest</span> taskRequest <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">CreateOutPaintingTaskRequest</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token class-name">CreateOutPaintingTaskRequest<span class="token punctuation">.</span>Input</span> input <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">CreateOutPaintingTaskRequest<span class="token punctuation">.</span>Input</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    input<span class="token punctuation">.</span><span class="token function">setImageUrl</span><span class="token punctuation">(</span>picture<span class="token punctuation">.</span><span class="token function">getUrl</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    taskRequest<span class="token punctuation">.</span><span class="token function">setInput</span><span class="token punctuation">(</span>input<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token class-name">BeanUtil</span><span class="token punctuation">.</span><span class="token function">copyProperties</span><span class="token punctuation">(</span>createPictureOutPaintingTaskRequest<span class="token punctuation">,</span> taskRequest<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// 创建任务</span>
    <span class="token keyword">return</span> aliYunAiApi<span class="token punctuation">.</span><span class="token function">createOutPaintingTask</span><span class="token punctuation">(</span>taskRequest<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_3、扩图接口" tabindex="-1"><a class="header-anchor" href="#_3、扩图接口" aria-hidden="true">#</a> 3、扩图接口</h4><p>在 PictureController 添加 AI 扩图接口，包括创建任务和查询任务状态接口：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token doc-comment comment">/**
 * 创建 AI 扩图任务
 */</span>
<span class="token annotation punctuation">@PostMapping</span><span class="token punctuation">(</span><span class="token string">&quot;/out_painting/create_task&quot;</span><span class="token punctuation">)</span>
<span class="token keyword">public</span> <span class="token class-name">BaseResponse</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">CreateOutPaintingTaskResponse</span><span class="token punctuation">&gt;</span></span> <span class="token function">createPictureOutPaintingTask</span><span class="token punctuation">(</span>
        <span class="token annotation punctuation">@RequestBody</span> <span class="token class-name">CreatePictureOutPaintingTaskRequest</span> createPictureOutPaintingTaskRequest<span class="token punctuation">,</span>
        <span class="token class-name">HttpServletRequest</span> request<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>createPictureOutPaintingTaskRequest <span class="token operator">==</span> <span class="token keyword">null</span> <span class="token operator">||</span> createPictureOutPaintingTaskRequest<span class="token punctuation">.</span><span class="token function">getPictureId</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">BusinessException</span><span class="token punctuation">(</span><span class="token class-name">ErrorCode</span><span class="token punctuation">.</span><span class="token constant">PARAMS_ERROR</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token class-name">User</span> loginUser <span class="token operator">=</span> userService<span class="token punctuation">.</span><span class="token function">getLoginUser</span><span class="token punctuation">(</span>request<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token class-name">CreateOutPaintingTaskResponse</span> response <span class="token operator">=</span> pictureService<span class="token punctuation">.</span><span class="token function">createPictureOutPaintingTask</span><span class="token punctuation">(</span>createPictureOutPaintingTaskRequest<span class="token punctuation">,</span> loginUser<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span> <span class="token class-name">ResultUtils</span><span class="token punctuation">.</span><span class="token function">success</span><span class="token punctuation">(</span>response<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 查询 AI 扩图任务
 */</span>
<span class="token annotation punctuation">@GetMapping</span><span class="token punctuation">(</span><span class="token string">&quot;/out_painting/get_task&quot;</span><span class="token punctuation">)</span>
<span class="token keyword">public</span> <span class="token class-name">BaseResponse</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">GetOutPaintingTaskResponse</span><span class="token punctuation">&gt;</span></span> <span class="token function">getPictureOutPaintingTask</span><span class="token punctuation">(</span><span class="token class-name">String</span> taskId<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token class-name">ThrowUtils</span><span class="token punctuation">.</span><span class="token function">throwIf</span><span class="token punctuation">(</span><span class="token class-name">StrUtil</span><span class="token punctuation">.</span><span class="token function">isBlank</span><span class="token punctuation">(</span>taskId<span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token class-name">ErrorCode</span><span class="token punctuation">.</span><span class="token constant">PARAMS_ERROR</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token class-name">GetOutPaintingTaskResponse</span> task <span class="token operator">=</span> aliYunAiApi<span class="token punctuation">.</span><span class="token function">getOutPaintingTask</span><span class="token punctuation">(</span>taskId<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span> <span class="token class-name">ResultUtils</span><span class="token punctuation">.</span><span class="token function">success</span><span class="token punctuation">(</span>task<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4、前端开发" tabindex="-1"><a class="header-anchor" href="#_4、前端开发" aria-hidden="true">#</a> 4、前端开发</h3><p>编写创建任务函数：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token comment">// 任务 id</span>
<span class="token keyword">let</span> taskId <span class="token operator">=</span> <span class="token generic-function"><span class="token function">ref</span><span class="token generic class-name"><span class="token operator">&lt;</span><span class="token builtin">string</span><span class="token operator">&gt;</span></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span>

<span class="token comment">/**
 * 创建任务
 */</span>
<span class="token keyword">const</span> <span class="token function-variable function">createTask</span> <span class="token operator">=</span> <span class="token keyword">async</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>props<span class="token punctuation">.</span>picture<span class="token operator">?.</span>id<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">const</span> res <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token function">createPictureOutPaintingTaskUsingPost</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    pictureId<span class="token operator">:</span> props<span class="token punctuation">.</span>picture<span class="token punctuation">.</span>id<span class="token punctuation">,</span>
    <span class="token comment">// 可以根据需要设置扩图参数</span>
    parameters<span class="token operator">:</span> <span class="token punctuation">{</span>
      xScale<span class="token operator">:</span> <span class="token number">2</span><span class="token punctuation">,</span>
      yScale<span class="token operator">:</span> <span class="token number">2</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>res<span class="token punctuation">.</span>data<span class="token punctuation">.</span>code <span class="token operator">===</span> <span class="token number">0</span> <span class="token operator">&amp;&amp;</span> res<span class="token punctuation">.</span>data<span class="token punctuation">.</span>data<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    message<span class="token punctuation">.</span><span class="token function">success</span><span class="token punctuation">(</span><span class="token string">&#39;创建任务成功，请耐心等待，不要退出界面&#39;</span><span class="token punctuation">)</span>
    <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>res<span class="token punctuation">.</span>data<span class="token punctuation">.</span>data<span class="token punctuation">.</span>output<span class="token punctuation">.</span>taskId<span class="token punctuation">)</span>
    taskId<span class="token punctuation">.</span>value <span class="token operator">=</span> res<span class="token punctuation">.</span>data<span class="token punctuation">.</span>data<span class="token punctuation">.</span>output<span class="token punctuation">.</span>taskId
    <span class="token comment">// 开启轮询</span>
    <span class="token function">startPolling</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
    message<span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span><span class="token string">&#39;创建任务失败，&#39;</span> <span class="token operator">+</span> res<span class="token punctuation">.</span>data<span class="token punctuation">.</span>message<span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>任务创建成功后，要开启轮询。</p><p>编写轮询逻辑。注意无论任务执行成功或失败、还是退出当前页面时，都需要执行清理逻辑，包括：</p><ul><li>清理定时器</li><li>将定时器变量设置为 null</li><li>将任务 id 设置为 null，这样允许前端多次执行任务</li></ul><p>代码如下：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token comment">// 轮询定时器</span>
<span class="token keyword">let</span> pollingTimer<span class="token operator">:</span> NodeJS<span class="token punctuation">.</span>Timeout <span class="token operator">=</span> <span class="token keyword">null</span>

<span class="token comment">// 清理轮询定时器</span>
<span class="token keyword">const</span> <span class="token function-variable function">clearPolling</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>pollingTimer<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">clearInterval</span><span class="token punctuation">(</span>pollingTimer<span class="token punctuation">)</span>
    pollingTimer <span class="token operator">=</span> <span class="token keyword">null</span>
    taskId<span class="token punctuation">.</span>value <span class="token operator">=</span> <span class="token keyword">null</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token comment">// 开始轮询</span>
<span class="token keyword">const</span> <span class="token function-variable function">startPolling</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>taskId<span class="token punctuation">.</span>value<span class="token punctuation">)</span> <span class="token keyword">return</span>

  pollingTimer <span class="token operator">=</span> <span class="token function">setInterval</span><span class="token punctuation">(</span><span class="token keyword">async</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token keyword">try</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> res <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token function">getPictureOutPaintingTaskUsingGet</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
        taskId<span class="token operator">:</span> taskId<span class="token punctuation">.</span>value<span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>res<span class="token punctuation">.</span>data<span class="token punctuation">.</span>code <span class="token operator">===</span> <span class="token number">0</span> <span class="token operator">&amp;&amp;</span> res<span class="token punctuation">.</span>data<span class="token punctuation">.</span>data<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">const</span> taskResult <span class="token operator">=</span> res<span class="token punctuation">.</span>data<span class="token punctuation">.</span>data<span class="token punctuation">.</span>output
        <span class="token keyword">if</span> <span class="token punctuation">(</span>taskResult<span class="token punctuation">.</span>taskStatus <span class="token operator">===</span> <span class="token string">&#39;SUCCEEDED&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          message<span class="token punctuation">.</span><span class="token function">success</span><span class="token punctuation">(</span><span class="token string">&#39;扩图任务成功&#39;</span><span class="token punctuation">)</span>
          resultImageUrl<span class="token punctuation">.</span>value <span class="token operator">=</span> taskResult<span class="token punctuation">.</span>outputImageUrl
          <span class="token function">clearPolling</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>taskResult<span class="token punctuation">.</span>taskStatus <span class="token operator">===</span> <span class="token string">&#39;FAILED&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          message<span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span><span class="token string">&#39;扩图任务失败&#39;</span><span class="token punctuation">)</span>
          <span class="token function">clearPolling</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span>error<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span><span class="token string">&#39;轮询任务状态失败&#39;</span><span class="token punctuation">,</span> error<span class="token punctuation">)</span>
      message<span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span><span class="token string">&#39;检测任务状态失败，请稍后重试&#39;</span><span class="token punctuation">)</span>
      <span class="token function">clearPolling</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">3000</span><span class="token punctuation">)</span> <span class="token comment">// 每隔 3 秒轮询一次</span>
<span class="token punctuation">}</span>

<span class="token comment">// 清理定时器，避免内存泄漏</span>
<span class="token function">onUnmounted</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token function">clearPolling</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5、扩展知识-异步任务优化" tabindex="-1"><a class="header-anchor" href="#_5、扩展知识-异步任务优化" aria-hidden="true">#</a> 5、扩展知识 - 异步任务优化</h3><p>1）任务队列和优先级</p><p>使用消息队列系统（比如 RabbitMQ、Kafka）对异步任务进行管理，可以根据优先级（会员&amp;普通用户）灵活调度任务。通过队列还可以限制同时处理的任务数量、削峰填谷，防止资源过载，提高系统稳定性。</p><p>2）任务记录和状态管理</p><p>现在用户是无法找到往期执行的任务和生成的图片的。可以设计任务记录表，存储每个任务的状态、结果和相关信息，并提供接口供用户查询历史任务。</p><p>前端可以给用户提供往期任务查询页面，能够查看任务结果、重试某一次任务等。还可以给管理员提供监控系统所有任务的页面，比如任务数、成功率和失败率，全面掌握任务执行情况。</p><p>实现起来并不难，其实就是对任务记录表的增删改查。</p><p>3）任务错误信息优化</p><p>完善任务失败的具体原因，帮助用户快速理解和解决问题。比如参数错误、图片格式不支持等。如果调用了第三方接口，需要认真阅读接口所有可能的错误情况。</p><p>4）计费与额度控制</p><p>AI 扩图一般是计费业务，需要做好额度控制，并且仅登录用户才可以使用。</p><p>分享几个实现思路：</p><ol><li>在用户表中添加“扩图额度”（比如使用次数或余额），每次提交任务前先检查额度是否足够，额度不足则提示用户充值。</li><li>每次任务提交时，可采用预扣费逻辑，任务完成扣费，任务失败则自动退还额度。</li><li>提供查询用户当前剩余额度的接口，用户可以在前端看到自己剩余的额度。</li><li>支持充值额度或会员订阅制收费，还可以根据扩图模式按比例扣费。比如普通模式扣 1 点，高清模式扣 2 点。</li></ol><p>💡 一般对于后付费资源（随用随付费），即使余额 &lt; 0，小额欠费也是可以接受的。尤其是对于大厂云服务来说，由于调用量巨大，很难做到实时计费。</p><p>5）安全性与稳定性</p><p>由于任务要消耗系统资源或成本，所以一定要设置合理的限流规则，防止恶意刷任务。比如限制单用户的任务提交频率，每分钟最多允许提交 3 次任务，超过限制后返回提示信息。</p><p>对于长耗时任务，还要设置任务的最大执行时间（比如 10 分钟），超时则自动标记任务失败。</p><h3 id="_6、扩展" tabindex="-1"><a class="header-anchor" href="#_6、扩展" aria-hidden="true">#</a> 6、扩展</h3>`,48),A={href:"https://help.aliyun.com/zh/model-studio/developer-reference/image-text-composition-api-reference",target:"_blank",rel:"noopener noreferrer"},O=s("p",null,"2、如果 AI 绘画 API 支持返回当前进度（比如 MidJourney 的 API），可以通过 SSE 的方式将进度返回给前端。",-1),x={href:"https://help.aliyun.com/zh/model-studio/developer-reference/image-scaling-api",target:"_blank",rel:"noopener noreferrer"};function E(N,C){const a=i("ExternalLinkIcon");return c(),o("div",null,[u,s("p",null,[n("图片裁剪和旋转等操作，可以用开源的 "),s("a",k,[n("vue-cropper 组件"),t(a)]),n("。")]),r,s("p",null,[n("国外比较知名的就是 Midjourney，我以前用的就过这个，不过不仅开发对接麻烦，价格也比较贵。国内的 AI 绘图大模型比较推荐 "),s("a",d,[n("阿里云百炼"),t(a)]),n(" ，它是一站式的大模型开发及应用构建平台，可以通过简单的界面操作，在 5 分钟内开发出一款大模型应用，并在线体验效果。")]),v,s("p",null,[n("通过阅读 "),s("a",m,[n("官方文档"),t(a)]),n("，发现它是支持 AI 图像编辑与生成功能的，包括 AI 扩图，支持 HTTP 调用，符合需求。")]),s("p",null,[n("在 "),s("a",b,[n("控制台"),t(a)]),n(" 也能看到对应的图像画面扩展模型：")]),s("p",null,[n("百炼的大模型提供了 "),s("a",g,[n("新人免费额度"),t(a)]),n("，可以通过文档或者点进大模型了解，对于学习用来说足够了：")]),y,s("p",null,[n("通过阅读 "),s("a",f,[n("AI 图像扩展的官方文档"),t(a)]),n("，可以发现，API 只支持异步方式调用。")]),h,s("p",null,[n("1）需要先进入 "),s("a",w,[n("阿里云百炼控制台"),t(a)]),n(" 开通服务：")]),s("p",null,[n("2）开通之后，我们要在控制台获取 API Key，可"),s("a",q,[n("参考文档"),t(a)])]),_,s("p",null,[n("在 "),I,n(" 包下新建数据模型类，可以让 AI 根据官方文档中的请求响应信息自动生成，无需自己手动编写。"),s("a",R,[n("图像画面扩展API参考"),t(a)])]),P,s("p",null,[n("💡 这里有一个巨坑的地方！经过测试发现，前端如果传递参数名 xScale，是无法赋值给 xScale 字段的；但是传递参数名 xscale，就可以赋值。这是因为 SpringMVC 对于第二个字母是大写的参数无法映射（和参数类别无关），"),s("a",T,[n("参考博客"),t(a)]),n("。")]),S,s("p",null,[n("1、尝试更多 AI 图片处理能力，比如 "),s("a",A,[n("参考文档实现图配文"),t(a)])]),O,s("p",null,[n("3、优化 AI 扩图参数。可以 "),s("a",x,[n("参考官方文档"),t(a)]),n("，补充更多扩图参数，并允许用户自主选择扩图参数：")])])}const D=p(l,[["render",E],["__file","8.AI Image Enlargement.html.vue"]]);export{D as default};
