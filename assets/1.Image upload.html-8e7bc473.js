import{_ as e,W as c,X as o,$ as s,a1 as n,Z as t,a2 as p,C as l}from"./framework-48328e23.js";const i={},u=p(`<h3 id="_1、使用腾讯云对象存储-cos" tabindex="-1"><a class="header-anchor" href="#_1、使用腾讯云对象存储-cos" aria-hidden="true">#</a> 1、使用腾讯云对象存储（COS）</h3><p>1）引入 COS 依赖：</p><div class="language-xml line-numbers-mode" data-ext="xml"><pre class="language-xml"><code><span class="token comment">&lt;!-- 腾讯云 cos 服务 --&gt;</span>  
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependency</span><span class="token punctuation">&gt;</span></span>  
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">&gt;</span></span>com.qcloud<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">&gt;</span></span>  
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">&gt;</span></span>cos_api<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">&gt;</span></span>  
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>version</span><span class="token punctuation">&gt;</span></span>5.6.227<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>version</span><span class="token punctuation">&gt;</span></span>  
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependency</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>2）在项目的 <code>config</code> 包下新建 <code>CosClientConfig</code> 类。负责读取配置文件，并创建一个 COS 客户端的 Bean。代码如下：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Configuration</span>  
<span class="token annotation punctuation">@ConfigurationProperties</span><span class="token punctuation">(</span>prefix <span class="token operator">=</span> <span class="token string">&quot;cos.client&quot;</span><span class="token punctuation">)</span>  
<span class="token annotation punctuation">@Data</span>  
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">CosClientConfig</span> <span class="token punctuation">{</span>  
  
    <span class="token doc-comment comment">/**  
     * 域名  
     */</span>  
    <span class="token keyword">private</span> <span class="token class-name">String</span> host<span class="token punctuation">;</span>  
  
    <span class="token doc-comment comment">/**  
     * secretId  
     */</span>  
    <span class="token keyword">private</span> <span class="token class-name">String</span> secretId<span class="token punctuation">;</span>  
  
    <span class="token doc-comment comment">/**  
     * 密钥（注意不要泄露）  
     */</span>  
    <span class="token keyword">private</span> <span class="token class-name">String</span> secretKey<span class="token punctuation">;</span>  
  
    <span class="token doc-comment comment">/**  
     * 区域  
     */</span>  
    <span class="token keyword">private</span> <span class="token class-name">String</span> region<span class="token punctuation">;</span>  
  
    <span class="token doc-comment comment">/**  
     * 桶名  
     */</span>  
    <span class="token keyword">private</span> <span class="token class-name">String</span> bucket<span class="token punctuation">;</span>  
  
    <span class="token annotation punctuation">@Bean</span>  
    <span class="token keyword">public</span> <span class="token class-name">COSClient</span> <span class="token function">cosClient</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>  
        <span class="token comment">// 初始化用户身份信息(secretId, secretKey)  </span>
        <span class="token class-name">COSCredentials</span> cred <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">BasicCOSCredentials</span><span class="token punctuation">(</span>secretId<span class="token punctuation">,</span> secretKey<span class="token punctuation">)</span><span class="token punctuation">;</span>  
        <span class="token comment">// 设置bucket的区域, COS地域的简称请参照 https://www.qcloud.com/document/product/436/6224  </span>
        <span class="token class-name">ClientConfig</span> clientConfig <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ClientConfig</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Region</span><span class="token punctuation">(</span>region<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  
        <span class="token comment">// 生成cos客户端  </span>
        <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">COSClient</span><span class="token punctuation">(</span>cred<span class="token punctuation">,</span> clientConfig<span class="token punctuation">)</span><span class="token punctuation">;</span>  
    <span class="token punctuation">}</span>  
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>3）填写配置文件。</p><p><strong>一定要注意防止密码泄露！</strong> 所以我们新建 <code>application-local.yml</code> 文件，并且在 <code>.gitignore</code> 中忽略该文件的提交，这样就不会将代码等敏感配置提交到代码仓库了。</p><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503182150556.png" alt="image-20250318215046319" style="zoom:50%;"><p><code>application-local.yml</code> 配置代码如下：</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token comment"># 对象存储配置（需要从腾讯云获取）  </span>
<span class="token key atrule">cos</span><span class="token punctuation">:</span>  
  <span class="token key atrule">client</span><span class="token punctuation">:</span>  
    <span class="token key atrule">host</span><span class="token punctuation">:</span> xxx  
    <span class="token key atrule">secretId</span><span class="token punctuation">:</span> xxx  
    <span class="token key atrule">secretKey</span><span class="token punctuation">:</span> xxx  
    <span class="token key atrule">region</span><span class="token punctuation">:</span> xxx  
    <span class="token key atrule">bucket</span><span class="token punctuation">:</span> xxx
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以通过如下方式分别获取需要的配置。</p><p>host 为存储桶域名，可以在 COS 控制台的域名信息部分找到：</p>`,12),k={href:"https://console.cloud.tencent.com/cam/capi",target:"_blank",rel:"noopener noreferrer"},d={href:"https://cloud.tencent.com/document/product/436/6224",target:"_blank",rel:"noopener noreferrer"},r=p(`<p>bucket 是存储桶名，可以点进存储桶详情页获取</p><h3 id="_2、通用能力类" tabindex="-1"><a class="header-anchor" href="#_2、通用能力类" aria-hidden="true">#</a> 2、通用能力类</h3><p>在 <code>manager</code> 包下新建 <code>CosManager</code> 类，提供通用的对象存储操作，比如文件上传、文件下载等。</p><p>💡 Manager 也是人为约定的一种写法，表示通用的、可复用的能力，可供其他代码（比如 Service）调用。</p><p>该类需要引入对象存储配置和 COS 客户端，用于和 COS 进行交互。代码如下：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Component</span>  
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">CosManager</span> <span class="token punctuation">{</span>  
  
    <span class="token annotation punctuation">@Resource</span>  
    <span class="token keyword">private</span> <span class="token class-name">CosClientConfig</span> cosClientConfig<span class="token punctuation">;</span>  
  
    <span class="token annotation punctuation">@Resource</span>  
    <span class="token keyword">private</span> <span class="token class-name">COSClient</span> cosClient<span class="token punctuation">;</span>  
  
    <span class="token comment">// ... 一些操作 COS 的方法  </span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3、文件上传下载" tabindex="-1"><a class="header-anchor" href="#_3、文件上传下载" aria-hidden="true">#</a> 3、文件上传下载</h3>`,7),m={href:"https://cloud.tencent.com/document/product/436/65935",target:"_blank",rel:"noopener noreferrer"},v=p(`<p>1）<code>CosManager</code> 新增上传、下载对象的方法，代码如下：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token doc-comment comment">/**  
 * 上传对象  
 *  
 * <span class="token keyword">@param</span> <span class="token parameter">key</span>  唯一键  
 * <span class="token keyword">@param</span> <span class="token parameter">file</span> 文件  
 */</span>  
<span class="token keyword">public</span> <span class="token class-name">PutObjectResult</span> <span class="token function">putObject</span><span class="token punctuation">(</span><span class="token class-name">String</span> key<span class="token punctuation">,</span> <span class="token class-name">File</span> file<span class="token punctuation">)</span> <span class="token punctuation">{</span>  
    <span class="token class-name">PutObjectRequest</span> putObjectRequest <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">PutObjectRequest</span><span class="token punctuation">(</span>cosClientConfig<span class="token punctuation">.</span><span class="token function">getBucket</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> key<span class="token punctuation">,</span>  
            file<span class="token punctuation">)</span><span class="token punctuation">;</span>  
    <span class="token keyword">return</span> cosClient<span class="token punctuation">.</span><span class="token function">putObject</span><span class="token punctuation">(</span>putObjectRequest<span class="token punctuation">)</span><span class="token punctuation">;</span>  
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 下载对象
 *
 * <span class="token keyword">@param</span> <span class="token parameter">key</span> 唯一键
*/</span>
<span class="token keyword">public</span> <span class="token class-name">COSObject</span> <span class="token function">getObject</span><span class="token punctuation">(</span><span class="token class-name">String</span> key<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token class-name">GetObjectRequest</span> getObjectRequest <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">GetObjectRequest</span><span class="token punctuation">(</span>cosClientConfig<span class="token punctuation">.</span><span class="token function">getBucket</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> key<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span> cosClient<span class="token punctuation">.</span><span class="token function">getObject</span><span class="token punctuation">(</span>getObjectRequest<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>2）为了方便测试，在 <code>FileController</code> 中编写测试文件上传接口。</p><p>核心流程是先接受用户上传的文件，指定上传的路径，然后调用 <code>cosManager.putObject</code> 方法上传文件到 COS 对象存储；上传成功后，会返回一个文件的 key（其实就是文件路径），便于我们访问和下载文件。</p><p><strong>需要注意，测试接口一定要加上管理员权限！防止任何用户随意上传文件。</strong></p><p>测试文件上传接口代码如下：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token doc-comment comment">/**  
 * 测试文件上传  
 *  
 * <span class="token keyword">@param</span> <span class="token parameter">multipartFile</span>  
 * <span class="token keyword">@return</span>  
 */</span>  
<span class="token annotation punctuation">@AuthCheck</span><span class="token punctuation">(</span>mustRole <span class="token operator">=</span> <span class="token class-name">UserConstant</span><span class="token punctuation">.</span><span class="token constant">ADMIN_ROLE</span><span class="token punctuation">)</span>  
<span class="token annotation punctuation">@PostMapping</span><span class="token punctuation">(</span><span class="token string">&quot;/test/upload&quot;</span><span class="token punctuation">)</span>  
<span class="token keyword">public</span> <span class="token class-name">BaseResponse</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> <span class="token function">testUploadFile</span><span class="token punctuation">(</span><span class="token annotation punctuation">@RequestPart</span><span class="token punctuation">(</span><span class="token string">&quot;file&quot;</span><span class="token punctuation">)</span> <span class="token class-name">MultipartFile</span> multipartFile<span class="token punctuation">)</span> <span class="token punctuation">{</span>  
    <span class="token comment">// 文件目录  </span>
    <span class="token class-name">String</span> filename <span class="token operator">=</span> multipartFile<span class="token punctuation">.</span><span class="token function">getOriginalFilename</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  
    <span class="token class-name">String</span> filepath <span class="token operator">=</span> <span class="token class-name">String</span><span class="token punctuation">.</span><span class="token function">format</span><span class="token punctuation">(</span><span class="token string">&quot;/test/%s&quot;</span><span class="token punctuation">,</span> filename<span class="token punctuation">)</span><span class="token punctuation">;</span>  
    <span class="token class-name">File</span> file <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>  
    <span class="token keyword">try</span> <span class="token punctuation">{</span>  
        <span class="token comment">// 上传文件  </span>
        file <span class="token operator">=</span> <span class="token class-name">File</span><span class="token punctuation">.</span><span class="token function">createTempFile</span><span class="token punctuation">(</span>filepath<span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  
        multipartFile<span class="token punctuation">.</span><span class="token function">transferTo</span><span class="token punctuation">(</span>file<span class="token punctuation">)</span><span class="token punctuation">;</span>  
        cosManager<span class="token punctuation">.</span><span class="token function">putObject</span><span class="token punctuation">(</span>filepath<span class="token punctuation">,</span> file<span class="token punctuation">)</span><span class="token punctuation">;</span>  
        <span class="token comment">// 返回可访问地址  </span>
        <span class="token keyword">return</span> <span class="token class-name">ResultUtils</span><span class="token punctuation">.</span><span class="token function">success</span><span class="token punctuation">(</span>filepath<span class="token punctuation">)</span><span class="token punctuation">;</span>  
    <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">Exception</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>  
        log<span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span><span class="token string">&quot;file upload error, filepath = &quot;</span> <span class="token operator">+</span> filepath<span class="token punctuation">,</span> e<span class="token punctuation">)</span><span class="token punctuation">;</span>  
        <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">BusinessException</span><span class="token punctuation">(</span><span class="token class-name">ErrorCode</span><span class="token punctuation">.</span><span class="token constant">SYSTEM_ERROR</span><span class="token punctuation">,</span> <span class="token string">&quot;上传失败&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  
    <span class="token punctuation">}</span> <span class="token keyword">finally</span> <span class="token punctuation">{</span>  
        <span class="token keyword">if</span> <span class="token punctuation">(</span>file <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>  
            <span class="token comment">// 删除临时文件  </span>
            <span class="token keyword">boolean</span> delete <span class="token operator">=</span> file<span class="token punctuation">.</span><span class="token function">delete</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  
            <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>delete<span class="token punctuation">)</span> <span class="token punctuation">{</span>  
                log<span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span><span class="token string">&quot;file delete error, filepath = {}&quot;</span><span class="token punctuation">,</span> filepath<span class="token punctuation">)</span><span class="token punctuation">;</span>  
            <span class="token punctuation">}</span>  
        <span class="token punctuation">}</span>  
    <span class="token punctuation">}</span>  
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
     * 测试文件下载
     *
     * <span class="token keyword">@param</span> <span class="token parameter">filepath</span> 文件路径
     * <span class="token keyword">@param</span> <span class="token parameter">response</span> 响应对象
     */</span>
<span class="token annotation punctuation">@AuthCheck</span><span class="token punctuation">(</span>mustRole <span class="token operator">=</span> <span class="token class-name">UserConstant</span><span class="token punctuation">.</span><span class="token constant">ADMIN_ROLE</span><span class="token punctuation">)</span>
<span class="token annotation punctuation">@GetMapping</span><span class="token punctuation">(</span><span class="token string">&quot;/test/download/&quot;</span><span class="token punctuation">)</span>
<span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">testDownloadFile</span><span class="token punctuation">(</span><span class="token class-name">String</span> filepath<span class="token punctuation">,</span> <span class="token class-name">HttpServletResponse</span> response<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">IOException</span> <span class="token punctuation">{</span>
    <span class="token class-name">COSObjectInputStream</span> cosObjectInput <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span> <span class="token comment">//流是要关闭的，所以得提出来</span>
    <span class="token keyword">try</span> <span class="token punctuation">{</span>
        <span class="token class-name">COSObject</span> cosObject <span class="token operator">=</span> cosManager<span class="token punctuation">.</span><span class="token function">getObject</span><span class="token punctuation">(</span>filepath<span class="token punctuation">)</span><span class="token punctuation">;</span>
        cosObjectInput <span class="token operator">=</span> cosObject<span class="token punctuation">.</span><span class="token function">getObjectContent</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">//得到实际的内容</span>
        <span class="token keyword">byte</span><span class="token punctuation">[</span><span class="token punctuation">]</span> bytes <span class="token operator">=</span> <span class="token class-name">IOUtils</span><span class="token punctuation">.</span><span class="token function">toByteArray</span><span class="token punctuation">(</span>cosObjectInput<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">//转换为字节</span>
        <span class="token comment">// 设置响应头，传到前端，前端就知道我要下载图片了</span>
        response<span class="token punctuation">.</span><span class="token function">setContentType</span><span class="token punctuation">(</span><span class="token string">&quot;application/octet-stream;charset=UTF-8&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        response<span class="token punctuation">.</span><span class="token function">setHeader</span><span class="token punctuation">(</span><span class="token string">&quot;Content-Disposition&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;attachment; filename=&quot;</span> <span class="token operator">+</span> filepath<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token comment">// 写入响应</span>
        response<span class="token punctuation">.</span><span class="token function">getOutputStream</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">write</span><span class="token punctuation">(</span>bytes<span class="token punctuation">)</span><span class="token punctuation">;</span>
        response<span class="token punctuation">.</span><span class="token function">getOutputStream</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">flush</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">Exception</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        log<span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span><span class="token string">&quot;file download error, filepath = &quot;</span> <span class="token operator">+</span> filepath<span class="token punctuation">,</span> e<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">BusinessException</span><span class="token punctuation">(</span><span class="token class-name">ErrorCode</span><span class="token punctuation">.</span><span class="token constant">SYSTEM_ERROR</span><span class="token punctuation">,</span> <span class="token string">&quot;下载失败&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">finally</span> <span class="token punctuation">{</span>
        <span class="token comment">// 释放流</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>cosObjectInput <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            cosObjectInput<span class="token punctuation">.</span><span class="token function">close</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>    
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4、图片上传" tabindex="-1"><a class="header-anchor" href="#_4、图片上传" aria-hidden="true">#</a> 4、图片上传</h3><h4 id="_1、数据模型" tabindex="-1"><a class="header-anchor" href="#_1、数据模型" aria-hidden="true">#</a> 1、数据模型</h4><p>在 <code>model.dto.picture</code> 下新建用于接受请求参数的类。由于图片需要支持重复上传（基础信息不变，只改变图片文件），所以要添加图片 id 参数：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Data</span>  
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">PictureUploadRequest</span> <span class="token keyword">implements</span> <span class="token class-name">Serializable</span> <span class="token punctuation">{</span>  
  
    <span class="token doc-comment comment">/**  
     * 图片 id（用于修改）  
     */</span>  
    <span class="token keyword">private</span> <span class="token class-name">Long</span> id<span class="token punctuation">;</span>  
  
    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token keyword">long</span> serialVersionUID <span class="token operator">=</span> <span class="token number">1L</span><span class="token punctuation">;</span>  
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在 <code>model.vo</code> 下新建上传成功后返回给前端的响应类，这是一个视图包装类，可以额外关联上传图片的用户信息。还可以编写 Picture 实体类和该 VO 类的转换方法，便于后续快速传值。</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Data</span>  
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">PictureVO</span> <span class="token keyword">implements</span> <span class="token class-name">Serializable</span> <span class="token punctuation">{</span>  
  
    <span class="token doc-comment comment">/**  
     * id  
     */</span>  
    <span class="token keyword">private</span> <span class="token class-name">Long</span> id<span class="token punctuation">;</span>  
  
    <span class="token doc-comment comment">/**  
     * 图片 url  
     */</span>  
    <span class="token keyword">private</span> <span class="token class-name">String</span> url<span class="token punctuation">;</span>  
  
    <span class="token doc-comment comment">/**  
     * 图片名称  
     */</span>  
    <span class="token keyword">private</span> <span class="token class-name">String</span> name<span class="token punctuation">;</span>  
  
    <span class="token doc-comment comment">/**  
     * 简介  
     */</span>  
    <span class="token keyword">private</span> <span class="token class-name">String</span> introduction<span class="token punctuation">;</span>  
  
    <span class="token doc-comment comment">/**  
     * 标签  
     */</span>  
    <span class="token keyword">private</span> <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> tags<span class="token punctuation">;</span>  
  
    <span class="token doc-comment comment">/**  
     * 分类  
     */</span>  
    <span class="token keyword">private</span> <span class="token class-name">String</span> category<span class="token punctuation">;</span>  
  
    <span class="token doc-comment comment">/**  
     * 文件体积  
     */</span>  
    <span class="token keyword">private</span> <span class="token class-name">Long</span> picSize<span class="token punctuation">;</span>  
  
    <span class="token doc-comment comment">/**  
     * 图片宽度  
     */</span>  
    <span class="token keyword">private</span> <span class="token class-name">Integer</span> picWidth<span class="token punctuation">;</span>  
  
    <span class="token doc-comment comment">/**  
     * 图片高度  
     */</span>  
    <span class="token keyword">private</span> <span class="token class-name">Integer</span> picHeight<span class="token punctuation">;</span>  
  
    <span class="token doc-comment comment">/**  
     * 图片比例  
     */</span>  
    <span class="token keyword">private</span> <span class="token class-name">Double</span> picScale<span class="token punctuation">;</span>  
  
    <span class="token doc-comment comment">/**  
     * 图片格式  
     */</span>  
    <span class="token keyword">private</span> <span class="token class-name">String</span> picFormat<span class="token punctuation">;</span>  
  
    <span class="token doc-comment comment">/**  
     * 用户 id  
     */</span>  
    <span class="token keyword">private</span> <span class="token class-name">Long</span> userId<span class="token punctuation">;</span>  
  
    <span class="token doc-comment comment">/**  
     * 创建时间  
     */</span>  
    <span class="token keyword">private</span> <span class="token class-name">Date</span> createTime<span class="token punctuation">;</span>  
  
    <span class="token doc-comment comment">/**  
     * 编辑时间  
     */</span>  
    <span class="token keyword">private</span> <span class="token class-name">Date</span> editTime<span class="token punctuation">;</span>  
  
    <span class="token doc-comment comment">/**  
     * 更新时间  
     */</span>  
    <span class="token keyword">private</span> <span class="token class-name">Date</span> updateTime<span class="token punctuation">;</span>  
  
    <span class="token doc-comment comment">/**  
     * 创建用户信息  
     */</span>  
    <span class="token keyword">private</span> <span class="token class-name">UserVO</span> user<span class="token punctuation">;</span>  
  
    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token keyword">long</span> serialVersionUID <span class="token operator">=</span> <span class="token number">1L</span><span class="token punctuation">;</span>  
  
    <span class="token doc-comment comment">/**  
     * 封装类转对象  
     */</span>  
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">Picture</span> <span class="token function">voToObj</span><span class="token punctuation">(</span><span class="token class-name">PictureVO</span> pictureVO<span class="token punctuation">)</span> <span class="token punctuation">{</span>  
        <span class="token keyword">if</span> <span class="token punctuation">(</span>pictureVO <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>  
            <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span>  
        <span class="token punctuation">}</span>  
        <span class="token class-name">Picture</span> picture <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Picture</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  
        <span class="token class-name">BeanUtils</span><span class="token punctuation">.</span><span class="token function">copyProperties</span><span class="token punctuation">(</span>pictureVO<span class="token punctuation">,</span> picture<span class="token punctuation">)</span><span class="token punctuation">;</span>  
        <span class="token comment">// 类型不同，需要转换（json转str）</span>
        picture<span class="token punctuation">.</span><span class="token function">setTags</span><span class="token punctuation">(</span><span class="token class-name">JSONUtil</span><span class="token punctuation">.</span><span class="token function">toJsonStr</span><span class="token punctuation">(</span>pictureVO<span class="token punctuation">.</span><span class="token function">getTags</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  
        <span class="token keyword">return</span> picture<span class="token punctuation">;</span>  
    <span class="token punctuation">}</span>  
  
    <span class="token doc-comment comment">/**  
     * 对象转封装类  
     */</span>  
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">PictureVO</span> <span class="token function">objToVo</span><span class="token punctuation">(</span><span class="token class-name">Picture</span> picture<span class="token punctuation">)</span> <span class="token punctuation">{</span>  
        <span class="token keyword">if</span> <span class="token punctuation">(</span>picture <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>  
            <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span>  
        <span class="token punctuation">}</span>  
        <span class="token class-name">PictureVO</span> pictureVO <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">PictureVO</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  
        <span class="token class-name">BeanUtils</span><span class="token punctuation">.</span><span class="token function">copyProperties</span><span class="token punctuation">(</span>picture<span class="token punctuation">,</span> pictureVO<span class="token punctuation">)</span><span class="token punctuation">;</span>  
        <span class="token comment">// 类型不同，需要转换（str转json）</span>
        pictureVO<span class="token punctuation">.</span><span class="token function">setTags</span><span class="token punctuation">(</span><span class="token class-name">JSONUtil</span><span class="token punctuation">.</span><span class="token function">toList</span><span class="token punctuation">(</span>picture<span class="token punctuation">.</span><span class="token function">getTags</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token class-name">String</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  
        <span class="token keyword">return</span> pictureVO<span class="token punctuation">;</span>  
    <span class="token punctuation">}</span>  
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_2、通用文件上传服务" tabindex="-1"><a class="header-anchor" href="#_2、通用文件上传服务" aria-hidden="true">#</a> 2、通用文件上传服务</h4><p>之前虽然我们已经编写了通用的对象存储操作类 CosManager，但这个类并不能直接满足我们的图片上传需求。</p><p>比如：</p><ul><li>图片是否符合要求？需要校验</li><li>将图片上传到哪里？需要指定路径</li><li>如何解析图片？需要使用数据万象服务</li></ul><p>1）在 <code>model.dto.file</code> 中新增用于接受图片解析信息的包装类：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>▼java复制代码<span class="token annotation punctuation">@Data</span>  
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">UploadPictureResult</span> <span class="token punctuation">{</span>  
  
    <span class="token doc-comment comment">/**  
     * 图片地址  
     */</span>  
    <span class="token keyword">private</span> <span class="token class-name">String</span> url<span class="token punctuation">;</span>  
  
    <span class="token doc-comment comment">/**  
     * 图片名称  
     */</span>  
    <span class="token keyword">private</span> <span class="token class-name">String</span> picName<span class="token punctuation">;</span>  
  
    <span class="token doc-comment comment">/**  
     * 文件体积  
     */</span>  
    <span class="token keyword">private</span> <span class="token class-name">Long</span> picSize<span class="token punctuation">;</span>  
  
    <span class="token doc-comment comment">/**  
     * 图片宽度  
     */</span>  
    <span class="token keyword">private</span> <span class="token keyword">int</span> picWidth<span class="token punctuation">;</span>  
  
    <span class="token doc-comment comment">/**  
     * 图片高度  
     */</span>  
    <span class="token keyword">private</span> <span class="token keyword">int</span> picHeight<span class="token punctuation">;</span>  
  
    <span class="token doc-comment comment">/**  
     * 图片宽高比  
     */</span>  
    <span class="token keyword">private</span> <span class="token class-name">Double</span> picScale<span class="token punctuation">;</span>  
  
    <span class="token doc-comment comment">/**  
     * 图片格式  
     */</span>  
    <span class="token keyword">private</span> <span class="token class-name">String</span> picFormat<span class="token punctuation">;</span>  
  
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,19),b={href:"https://cloud.tencent.com/document/product/436/55377",target:"_blank",rel:"noopener noreferrer"},g={href:"https://console.cloud.tencent.com/ci",target:"_blank",rel:"noopener noreferrer"},f=p(`<figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503182225764.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>3）在 FileManager 中编写上传图片的方法：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token doc-comment comment">/**  
 * 上传图片  
 *  
 * <span class="token keyword">@param</span> <span class="token parameter">multipartFile</span>    文件  
 * <span class="token keyword">@param</span> <span class="token parameter">uploadPathPrefix</span> 上传路径前缀  
 * <span class="token keyword">@return</span>  
 */</span>  
<span class="token keyword">public</span> <span class="token class-name">UploadPictureResult</span> <span class="token function">uploadPicture</span><span class="token punctuation">(</span><span class="token class-name">MultipartFile</span> multipartFile<span class="token punctuation">,</span> <span class="token class-name">String</span> uploadPathPrefix<span class="token punctuation">)</span> <span class="token punctuation">{</span>  
    <span class="token comment">// 校验图片  </span>
    <span class="token function">validPicture</span><span class="token punctuation">(</span>multipartFile<span class="token punctuation">)</span><span class="token punctuation">;</span>  
    <span class="token comment">// 图片上传地址  </span>
    <span class="token class-name">String</span> uuid <span class="token operator">=</span> <span class="token class-name">RandomUtil</span><span class="token punctuation">.</span><span class="token function">randomString</span><span class="token punctuation">(</span><span class="token number">16</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  
    <span class="token class-name">String</span> originFilename <span class="token operator">=</span> multipartFile<span class="token punctuation">.</span><span class="token function">getOriginalFilename</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  
    <span class="token class-name">String</span> uploadFilename <span class="token operator">=</span> <span class="token class-name">String</span><span class="token punctuation">.</span><span class="token function">format</span><span class="token punctuation">(</span><span class="token string">&quot;%s_%s.%s&quot;</span><span class="token punctuation">,</span> <span class="token class-name">DateUtil</span><span class="token punctuation">.</span><span class="token function">formatDate</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Date</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span> uuid<span class="token punctuation">,</span>  
            <span class="token class-name">FileUtil</span><span class="token punctuation">.</span><span class="token function">getSuffix</span><span class="token punctuation">(</span>originFilename<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  
    <span class="token class-name">String</span> uploadPath <span class="token operator">=</span> <span class="token class-name">String</span><span class="token punctuation">.</span><span class="token function">format</span><span class="token punctuation">(</span><span class="token string">&quot;/%s/%s&quot;</span><span class="token punctuation">,</span> uploadPathPrefix<span class="token punctuation">,</span> uploadFilename<span class="token punctuation">)</span><span class="token punctuation">;</span>  
    <span class="token class-name">File</span> file <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>  
    <span class="token keyword">try</span> <span class="token punctuation">{</span>  
        <span class="token comment">// 创建临时文件  </span>
        file <span class="token operator">=</span> <span class="token class-name">File</span><span class="token punctuation">.</span><span class="token function">createTempFile</span><span class="token punctuation">(</span>uploadPath<span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  
        multipartFile<span class="token punctuation">.</span><span class="token function">transferTo</span><span class="token punctuation">(</span>file<span class="token punctuation">)</span><span class="token punctuation">;</span>  
        <span class="token comment">// 上传图片  </span>
        <span class="token class-name">PutObjectResult</span> putObjectResult <span class="token operator">=</span> cosManager<span class="token punctuation">.</span><span class="token function">putPictureObject</span><span class="token punctuation">(</span>uploadPath<span class="token punctuation">,</span> file<span class="token punctuation">)</span><span class="token punctuation">;</span>  
        <span class="token class-name">ImageInfo</span> imageInfo <span class="token operator">=</span> putObjectResult<span class="token punctuation">.</span><span class="token function">getCiUploadResult</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getOriginalInfo</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getImageInfo</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  
        <span class="token comment">// 封装返回结果  </span>
        <span class="token class-name">UploadPictureResult</span> uploadPictureResult <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">UploadPictureResult</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  
        <span class="token keyword">int</span> picWidth <span class="token operator">=</span> imageInfo<span class="token punctuation">.</span><span class="token function">getWidth</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  
        <span class="token keyword">int</span> picHeight <span class="token operator">=</span> imageInfo<span class="token punctuation">.</span><span class="token function">getHeight</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  
        <span class="token keyword">double</span> picScale <span class="token operator">=</span> <span class="token class-name">NumberUtil</span><span class="token punctuation">.</span><span class="token function">round</span><span class="token punctuation">(</span>picWidth <span class="token operator">*</span> <span class="token number">1.0</span> <span class="token operator">/</span> picHeight<span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">doubleValue</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  
        uploadPictureResult<span class="token punctuation">.</span><span class="token function">setPicName</span><span class="token punctuation">(</span><span class="token class-name">FileUtil</span><span class="token punctuation">.</span><span class="token function">mainName</span><span class="token punctuation">(</span>originFilename<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  
        uploadPictureResult<span class="token punctuation">.</span><span class="token function">setPicWidth</span><span class="token punctuation">(</span>picWidth<span class="token punctuation">)</span><span class="token punctuation">;</span>  
        uploadPictureResult<span class="token punctuation">.</span><span class="token function">setPicHeight</span><span class="token punctuation">(</span>picHeight<span class="token punctuation">)</span><span class="token punctuation">;</span>  
        uploadPictureResult<span class="token punctuation">.</span><span class="token function">setPicScale</span><span class="token punctuation">(</span>picScale<span class="token punctuation">)</span><span class="token punctuation">;</span>  
        uploadPictureResult<span class="token punctuation">.</span><span class="token function">setPicFormat</span><span class="token punctuation">(</span>imageInfo<span class="token punctuation">.</span><span class="token function">getFormat</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  
        uploadPictureResult<span class="token punctuation">.</span><span class="token function">setPicSize</span><span class="token punctuation">(</span><span class="token class-name">FileUtil</span><span class="token punctuation">.</span><span class="token function">size</span><span class="token punctuation">(</span>file<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  
        uploadPictureResult<span class="token punctuation">.</span><span class="token function">setUrl</span><span class="token punctuation">(</span>cosClientConfig<span class="token punctuation">.</span><span class="token function">getHost</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">&quot;/&quot;</span> <span class="token operator">+</span> uploadPath<span class="token punctuation">)</span><span class="token punctuation">;</span>  
        <span class="token keyword">return</span> uploadPictureResult<span class="token punctuation">;</span>  
    <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">Exception</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>  
        log<span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span><span class="token string">&quot;图片上传到对象存储失败&quot;</span><span class="token punctuation">,</span> e<span class="token punctuation">)</span><span class="token punctuation">;</span>  
        <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">BusinessException</span><span class="token punctuation">(</span><span class="token class-name">ErrorCode</span><span class="token punctuation">.</span><span class="token constant">SYSTEM_ERROR</span><span class="token punctuation">,</span> <span class="token string">&quot;上传失败&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  
    <span class="token punctuation">}</span> <span class="token keyword">finally</span> <span class="token punctuation">{</span>  
        <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">deleteTempFile</span><span class="token punctuation">(</span>file<span class="token punctuation">)</span><span class="token punctuation">;</span>  
    <span class="token punctuation">}</span>  
<span class="token punctuation">}</span>  
  
<span class="token doc-comment comment">/**  
 * 校验文件  
 *  
 * <span class="token keyword">@param</span> <span class="token parameter">multipartFile</span> multipart 文件  
 */</span>  
<span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">validPicture</span><span class="token punctuation">(</span><span class="token class-name">MultipartFile</span> multipartFile<span class="token punctuation">)</span> <span class="token punctuation">{</span>  
    <span class="token class-name">ThrowUtils</span><span class="token punctuation">.</span><span class="token function">throwIf</span><span class="token punctuation">(</span>multipartFile <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token class-name">ErrorCode</span><span class="token punctuation">.</span><span class="token constant">PARAMS_ERROR</span><span class="token punctuation">,</span> <span class="token string">&quot;文件不能为空&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  
    <span class="token comment">// 1. 校验文件大小  </span>
    <span class="token keyword">long</span> fileSize <span class="token operator">=</span> multipartFile<span class="token punctuation">.</span><span class="token function">getSize</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  
    <span class="token keyword">final</span> <span class="token keyword">long</span> <span class="token constant">ONE_M</span> <span class="token operator">=</span> <span class="token number">1024</span> <span class="token operator">*</span> <span class="token number">1024L</span><span class="token punctuation">;</span>  
    <span class="token class-name">ThrowUtils</span><span class="token punctuation">.</span><span class="token function">throwIf</span><span class="token punctuation">(</span>fileSize <span class="token operator">&gt;</span> <span class="token number">2</span> <span class="token operator">*</span> <span class="token constant">ONE_M</span><span class="token punctuation">,</span> <span class="token class-name">ErrorCode</span><span class="token punctuation">.</span><span class="token constant">PARAMS_ERROR</span><span class="token punctuation">,</span> <span class="token string">&quot;文件大小不能超过 2M&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  
    <span class="token comment">// 2. 校验文件后缀  </span>
    <span class="token class-name">String</span> fileSuffix <span class="token operator">=</span> <span class="token class-name">FileUtil</span><span class="token punctuation">.</span><span class="token function">getSuffix</span><span class="token punctuation">(</span>multipartFile<span class="token punctuation">.</span><span class="token function">getOriginalFilename</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  
    <span class="token comment">// 允许上传的文件后缀  </span>
    <span class="token keyword">final</span> <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> <span class="token constant">ALLOW_FORMAT_LIST</span> <span class="token operator">=</span> <span class="token class-name">Arrays</span><span class="token punctuation">.</span><span class="token function">asList</span><span class="token punctuation">(</span><span class="token string">&quot;jpeg&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;jpg&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;png&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;webp&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  
    <span class="token class-name">ThrowUtils</span><span class="token punctuation">.</span><span class="token function">throwIf</span><span class="token punctuation">(</span><span class="token operator">!</span><span class="token constant">ALLOW_FORMAT_LIST</span><span class="token punctuation">.</span><span class="token function">contains</span><span class="token punctuation">(</span>fileSuffix<span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token class-name">ErrorCode</span><span class="token punctuation">.</span><span class="token constant">PARAMS_ERROR</span><span class="token punctuation">,</span> <span class="token string">&quot;文件类型错误&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  
<span class="token punctuation">}</span>  
  
<span class="token doc-comment comment">/**  
 * 删除临时文件  
 */</span>  
<span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">deleteTempFile</span><span class="token punctuation">(</span><span class="token class-name">File</span> file<span class="token punctuation">)</span> <span class="token punctuation">{</span>  
    <span class="token keyword">if</span> <span class="token punctuation">(</span>file <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>  
        <span class="token keyword">return</span><span class="token punctuation">;</span>  
    <span class="token punctuation">}</span>  
    <span class="token comment">// 删除临时文件  </span>
    <span class="token keyword">boolean</span> deleteResult <span class="token operator">=</span> file<span class="token punctuation">.</span><span class="token function">delete</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>deleteResult<span class="token punctuation">)</span> <span class="token punctuation">{</span>  
        log<span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span><span class="token string">&quot;file delete error, filepath = {}&quot;</span><span class="token punctuation">,</span> file<span class="token punctuation">.</span><span class="token function">getAbsolutePath</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  
    <span class="token punctuation">}</span>  
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上述代码中有几个实现关键：</p><ol><li>由于文件校验规则较复杂，单独抽象为 validPicture 方法，对文件大小、类型进行校验。</li><li>文件上传时，会先在本地创建临时文件，无论上传是否成功，都要记得删除临时文件，否则会导致资源泄露。</li><li>可以根据自己的需求定义文件上传地址，比如此处鱼皮给文件名前增加了上传日期和 16 位 uuid 随机数，便于了解文件上传时间并防止文件重复。还预留了一个 uploadPathPrefix 参数，由调用方指定上传文件到哪个目录。</li></ol><p>💡 如果多个项目共享存储桶，可以给上传文件路径再加一个 ProjectName 前缀。不过建议还是每个项目独立分配资源。</p><h4 id="_3、服务开发" tabindex="-1"><a class="header-anchor" href="#_3、服务开发" aria-hidden="true">#</a> 3、服务开发</h4><p>在 PictureService 中编写上传图片的方法：</p><p>接口：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token doc-comment comment">/**  
 * 上传图片  
 *  
 * <span class="token keyword">@param</span> <span class="token parameter">multipartFile</span>  
 * <span class="token keyword">@param</span> <span class="token parameter">pictureUploadRequest</span>  
 * <span class="token keyword">@param</span> <span class="token parameter">loginUser</span>  
 * <span class="token keyword">@return</span>  
 */</span>  
<span class="token class-name">PictureVO</span> <span class="token function">uploadPicture</span><span class="token punctuation">(</span><span class="token class-name">MultipartFile</span> multipartFile<span class="token punctuation">,</span>  
                        <span class="token class-name">PictureUploadRequest</span> pictureUploadRequest<span class="token punctuation">,</span>  
                        <span class="token class-name">User</span> loginUser<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>实现类：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Override</span>  
<span class="token keyword">public</span> <span class="token class-name">PictureVO</span> <span class="token function">uploadPicture</span><span class="token punctuation">(</span><span class="token class-name">MultipartFile</span> multipartFile<span class="token punctuation">,</span> <span class="token class-name">PictureUploadRequest</span> pictureUploadRequest<span class="token punctuation">,</span> <span class="token class-name">User</span> loginUser<span class="token punctuation">)</span> <span class="token punctuation">{</span>  
    <span class="token class-name">ThrowUtils</span><span class="token punctuation">.</span><span class="token function">throwIf</span><span class="token punctuation">(</span>loginUser <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token class-name">ErrorCode</span><span class="token punctuation">.</span><span class="token constant">NO_AUTH_ERROR</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  
    <span class="token comment">// 用于判断是新增还是更新图片  </span>
    <span class="token class-name">Long</span> pictureId <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>  
    <span class="token keyword">if</span> <span class="token punctuation">(</span>pictureUploadRequest <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>  
        pictureId <span class="token operator">=</span> pictureUploadRequest<span class="token punctuation">.</span><span class="token function">getId</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  
    <span class="token punctuation">}</span>  
    <span class="token comment">// 如果是更新图片，需要校验图片是否存在  </span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>pictureId <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>  
        <span class="token keyword">boolean</span> exists <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">lambdaQuery</span><span class="token punctuation">(</span><span class="token punctuation">)</span>  
                <span class="token punctuation">.</span><span class="token function">eq</span><span class="token punctuation">(</span><span class="token class-name">Picture</span><span class="token operator">::</span><span class="token function">getId</span><span class="token punctuation">,</span> pictureId<span class="token punctuation">)</span>  
                <span class="token punctuation">.</span><span class="token function">exists</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  
        <span class="token class-name">ThrowUtils</span><span class="token punctuation">.</span><span class="token function">throwIf</span><span class="token punctuation">(</span><span class="token operator">!</span>exists<span class="token punctuation">,</span> <span class="token class-name">ErrorCode</span><span class="token punctuation">.</span><span class="token constant">NOT_FOUND_ERROR</span><span class="token punctuation">,</span> <span class="token string">&quot;图片不存在&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  
    <span class="token punctuation">}</span>  
    <span class="token comment">// 上传图片，得到信息  </span>
    <span class="token comment">// 按照用户 id 划分目录  </span>
    <span class="token class-name">String</span> uploadPathPrefix <span class="token operator">=</span> <span class="token class-name">String</span><span class="token punctuation">.</span><span class="token function">format</span><span class="token punctuation">(</span><span class="token string">&quot;public/%s&quot;</span><span class="token punctuation">,</span> loginUser<span class="token punctuation">.</span><span class="token function">getId</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  
    <span class="token class-name">UploadPictureResult</span> uploadPictureResult <span class="token operator">=</span> fileManager<span class="token punctuation">.</span><span class="token function">uploadPicture</span><span class="token punctuation">(</span>multipartFile<span class="token punctuation">,</span> uploadPathPrefix<span class="token punctuation">)</span><span class="token punctuation">;</span>  
    <span class="token comment">// 构造要入库的图片信息  </span>
    <span class="token class-name">Picture</span> picture <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Picture</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  
    picture<span class="token punctuation">.</span><span class="token function">setUrl</span><span class="token punctuation">(</span>uploadPictureResult<span class="token punctuation">.</span><span class="token function">getUrl</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  
    picture<span class="token punctuation">.</span><span class="token function">setName</span><span class="token punctuation">(</span>uploadPictureResult<span class="token punctuation">.</span><span class="token function">getPicName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  
    picture<span class="token punctuation">.</span><span class="token function">setPicSize</span><span class="token punctuation">(</span>uploadPictureResult<span class="token punctuation">.</span><span class="token function">getPicSize</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  
    picture<span class="token punctuation">.</span><span class="token function">setPicWidth</span><span class="token punctuation">(</span>uploadPictureResult<span class="token punctuation">.</span><span class="token function">getPicWidth</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  
    picture<span class="token punctuation">.</span><span class="token function">setPicHeight</span><span class="token punctuation">(</span>uploadPictureResult<span class="token punctuation">.</span><span class="token function">getPicHeight</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  
    picture<span class="token punctuation">.</span><span class="token function">setPicScale</span><span class="token punctuation">(</span>uploadPictureResult<span class="token punctuation">.</span><span class="token function">getPicScale</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  
    picture<span class="token punctuation">.</span><span class="token function">setPicFormat</span><span class="token punctuation">(</span>uploadPictureResult<span class="token punctuation">.</span><span class="token function">getPicFormat</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  
    picture<span class="token punctuation">.</span><span class="token function">setUserId</span><span class="token punctuation">(</span>loginUser<span class="token punctuation">.</span><span class="token function">getId</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  
    <span class="token comment">// 如果 pictureId 不为空，表示更新，否则是新增  </span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>pictureId <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>  
        <span class="token comment">// 如果是更新，需要补充 id 和编辑时间  </span>
        picture<span class="token punctuation">.</span><span class="token function">setId</span><span class="token punctuation">(</span>pictureId<span class="token punctuation">)</span><span class="token punctuation">;</span>  
        picture<span class="token punctuation">.</span><span class="token function">setEditTime</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Date</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  
    <span class="token punctuation">}</span>  
    <span class="token keyword">boolean</span> result <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">saveOrUpdate</span><span class="token punctuation">(</span>picture<span class="token punctuation">)</span><span class="token punctuation">;</span>  
    <span class="token class-name">ThrowUtils</span><span class="token punctuation">.</span><span class="token function">throwIf</span><span class="token punctuation">(</span><span class="token operator">!</span>result<span class="token punctuation">,</span> <span class="token class-name">ErrorCode</span><span class="token punctuation">.</span><span class="token constant">OPERATION_ERROR</span><span class="token punctuation">,</span> <span class="token string">&quot;图片上传失败&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  
    <span class="token keyword">return</span> <span class="token class-name">PictureVO</span><span class="token punctuation">.</span><span class="token function">objToVo</span><span class="token punctuation">(</span>picture<span class="token punctuation">)</span><span class="token punctuation">;</span>  
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上述代码中，注意：</p><ol><li>我们将所有图片都放到了 public 目录下，并且每个用户的图片存储到对应用户 id 的目录下，便于管理。</li><li>如果 pictureId 不为空，表示更新已有图片的信息，需要判断对应 id 的图片是否存在，并且更新时要指定 editTime 编辑时间。可以调用 MyBatis Plus 提供的 saveOrUpdate 方法兼容创建和更新操作。</li></ol><h4 id="_4、接口开发" tabindex="-1"><a class="header-anchor" href="#_4、接口开发" aria-hidden="true">#</a> 4、接口开发</h4><p>在 PictureController 中编写上传图片接口，注意仅管理员可用：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token doc-comment comment">/**  
 * 上传图片（可重新上传）  
 */</span>  
<span class="token annotation punctuation">@PostMapping</span><span class="token punctuation">(</span><span class="token string">&quot;/upload&quot;</span><span class="token punctuation">)</span>  
<span class="token annotation punctuation">@AuthCheck</span><span class="token punctuation">(</span>mustRole <span class="token operator">=</span> <span class="token class-name">UserConstant</span><span class="token punctuation">.</span><span class="token constant">ADMIN_ROLE</span><span class="token punctuation">)</span>  
<span class="token keyword">public</span> <span class="token class-name">BaseResponse</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">PictureVO</span><span class="token punctuation">&gt;</span></span> <span class="token function">uploadPicture</span><span class="token punctuation">(</span>  
        <span class="token annotation punctuation">@RequestPart</span><span class="token punctuation">(</span><span class="token string">&quot;file&quot;</span><span class="token punctuation">)</span> <span class="token class-name">MultipartFile</span> multipartFile<span class="token punctuation">,</span>  
        <span class="token class-name">PictureUploadRequest</span> pictureUploadRequest<span class="token punctuation">,</span>  
        <span class="token class-name">HttpServletRequest</span> request<span class="token punctuation">)</span> <span class="token punctuation">{</span>  
    <span class="token class-name">User</span> loginUser <span class="token operator">=</span> userService<span class="token punctuation">.</span><span class="token function">getLoginUser</span><span class="token punctuation">(</span>request<span class="token punctuation">)</span><span class="token punctuation">;</span>  
    <span class="token class-name">PictureVO</span> pictureVO <span class="token operator">=</span> pictureService<span class="token punctuation">.</span><span class="token function">uploadPicture</span><span class="token punctuation">(</span>multipartFile<span class="token punctuation">,</span> pictureUploadRequest<span class="token punctuation">,</span> loginUser<span class="token punctuation">)</span><span class="token punctuation">;</span>  
    <span class="token keyword">return</span> <span class="token class-name">ResultUtils</span><span class="token punctuation">.</span><span class="token function">success</span><span class="token punctuation">(</span>pictureVO<span class="token punctuation">)</span><span class="token punctuation">;</span>  
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_5、测试" tabindex="-1"><a class="header-anchor" href="#_5、测试" aria-hidden="true">#</a> 5、测试</h4><p>使用 Swagger 进行测试，发现当上传图片过大时，会触发一段报错。但这个报错不是我们自定义的异常导致的，而是由于 Tomcat 服务器默认限制了请求中文件上传的大小。</p><p>需要在 <code>application.yml</code> 中更改配置，调大允许上传的文件大小：</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">spring</span><span class="token punctuation">:</span>  
  <span class="token comment"># 开放更大的文件上传体积  </span>
  <span class="token key atrule">servlet</span><span class="token punctuation">:</span>  
    <span class="token key atrule">multipart</span><span class="token punctuation">:</span>  
      <span class="token key atrule">max-file-size</span><span class="token punctuation">:</span> 10MB
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="扩展思路" tabindex="-1"><a class="header-anchor" href="#扩展思路" aria-hidden="true">#</a> 扩展思路</h4><p>1）可以用枚举类（FileUploadBizEnum）支持根据业务场景区分文件上传路径、校验规则等，从而复用 FileManager。</p><p>2）目前在文件上传时，会先在本地创建临时文件。如果你不需要对文件进行额外的处理、想进一步提高性能，可以直接用流的方式将请求中的文件上传到 COS。以下代码仅供参考：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token comment">// 上传文件  </span>
<span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">String</span> <span class="token function">uploadToCOS</span><span class="token punctuation">(</span><span class="token class-name">MultipartFile</span> multipartFile<span class="token punctuation">,</span> <span class="token class-name">String</span> bucketName<span class="token punctuation">,</span> <span class="token class-name">String</span> key<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">Exception</span> <span class="token punctuation">{</span>  
    <span class="token comment">// 创建 COS 客户端  </span>
    <span class="token class-name">COSClient</span> cosClient <span class="token operator">=</span> <span class="token function">createCOSClient</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  
  
    <span class="token keyword">try</span> <span class="token punctuation">(</span><span class="token class-name">InputStream</span> inputStream <span class="token operator">=</span> multipartFile<span class="token punctuation">.</span><span class="token function">getInputStream</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>  
        <span class="token comment">// 元信息配置  </span>
        <span class="token class-name">ObjectMetadata</span> metadata <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ObjectMetadata</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  
        metadata<span class="token punctuation">.</span><span class="token function">setContentLength</span><span class="token punctuation">(</span>multipartFile<span class="token punctuation">.</span><span class="token function">getSize</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  
        metadata<span class="token punctuation">.</span><span class="token function">setContentType</span><span class="token punctuation">(</span>multipartFile<span class="token punctuation">.</span><span class="token function">getContentType</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  
  
        <span class="token comment">// 创建上传请求  </span>
        <span class="token class-name">PutObjectRequest</span> putObjectRequest <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">PutObjectRequest</span><span class="token punctuation">(</span>bucketName<span class="token punctuation">,</span> key<span class="token punctuation">,</span> inputStream<span class="token punctuation">,</span> metadata<span class="token punctuation">)</span><span class="token punctuation">;</span>  
  
        <span class="token comment">// 上传文件  </span>
        cosClient<span class="token punctuation">.</span><span class="token function">putObject</span><span class="token punctuation">(</span>putObjectRequest<span class="token punctuation">)</span><span class="token punctuation">;</span>  
  
        <span class="token comment">// 生成访问链接  </span>
        <span class="token keyword">return</span> <span class="token string">&quot;https://&quot;</span> <span class="token operator">+</span> bucketName <span class="token operator">+</span> <span class="token string">&quot;.cos.&quot;</span> <span class="token operator">+</span> cosClient<span class="token punctuation">.</span><span class="token function">getClientConfig</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getRegion</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getRegionName</span><span class="token punctuation">(</span><span class="token punctuation">)</span>  
               <span class="token operator">+</span> <span class="token string">&quot;.myqcloud.com/&quot;</span> <span class="token operator">+</span> key<span class="token punctuation">;</span>  
    <span class="token punctuation">}</span> <span class="token keyword">finally</span> <span class="token punctuation">{</span>  
        cosClient<span class="token punctuation">.</span><span class="token function">shutdown</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  
    <span class="token punctuation">}</span>  
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>3）补充更严格的校验，比如为支持的图片格式定义枚举，仅允许上传枚举定义的格式。</p><h3 id="图片管理" tabindex="-1"><a class="header-anchor" href="#图片管理" aria-hidden="true">#</a> 图片管理</h3><p>图片管理功能具体可以拆分为：</p><ul><li>【管理员】根据 id 删除图片</li><li>【管理员】更新图片</li><li>【管理员】分页获取图片列表（不需要脱敏和限制条数）</li><li>【管理员】根据 id 获取图片（不需要脱敏）</li><li>分页获取图片列表（需要脱敏和限制条数）</li><li>根据 id 获取图片（需要脱敏）</li><li>修改图片</li></ul><h4 id="_1、数据模型-1" tabindex="-1"><a class="header-anchor" href="#_1、数据模型-1" aria-hidden="true">#</a> 1、数据模型</h4><p>每个操作都需要提供一个请求类，都放在 <code>model.dto.picture</code> 包下。</p>`,31);function y(w,h){const a=l("ExternalLinkIcon");return c(),o("div",null,[u,s("p",null,[n("secretId、secretKey 密钥对：在"),s("a",k,[n("腾讯云访问管理"),t(a)]),n(" => 密钥管理中获取。")]),s("p",null,[n("region 表示地域名，可以 "),s("a",d,[n("点此获取"),t(a)]),n("。3n/Enp4sfaVRq/PFMJKPxPdBTxeNas/Bp33wsl/l9Wg=")]),r,s("p",null,[n("参考 "),s("a",m,[n("官方文档"),t(a)]),n(" 的“上传对象”部分，可以编写出文件上传的代码。")]),v,s("p",null,[n("2）参考 "),s("a",b,[n("数据万象"),t(a)]),n(" 的文档，在 CosManager 中添加上传图片并解析图片的方法：")]),s("p",null,[n("如果你之前没有使用过数据万象，需要先 "),s("a",g,[n("开通数据万象并授权"),t(a)]),n("，否则会报错：")]),f])}const P=e(i,[["render",y],["__file","1.Image upload.html.vue"]]);export{P as default};
