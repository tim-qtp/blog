import{_ as n,W as s,X as a,a2 as e}from"./framework-28eb7fba.js";const p={},t=e(`<h3 id="_1、对于空间模块-通常得有这些功能" tabindex="-1"><a class="header-anchor" href="#_1、对于空间模块-通常得有这些功能" aria-hidden="true">#</a> 1、对于空间模块，通常得有这些功能：</h3><p>1）管理空间：仅管理员可用，可以对整个系统中的空间进行管理，比如搜索空间、编辑空间、删除空间，空间分析。</p><p>2）用户创建私有空间：用户可以创建 <strong>最多一个</strong> 私有空间，并且在私有空间内自由上传和管理图片。</p><p>3）私有空间权限控制：用户仅能访问和管理自己的私有空间和其中的图片，私有空间的图片不会展示在公共图库，也不需要管理员审核。</p><p>4）空间级别和限额控制：每个空间有不同的级别（如普通版和专业版），对应了不同的容量和图片数量限制，如果超出限制则无法继续上传图片。</p><h3 id="_2、空间库表设计" tabindex="-1"><a class="header-anchor" href="#_2、空间库表设计" aria-hidden="true">#</a> 2、空间库表设计</h3><h4 id="_1、空间表" tabindex="-1"><a class="header-anchor" href="#_1、空间表" aria-hidden="true">#</a> 1、空间表</h4><div class="language-sql line-numbers-mode" data-ext="sql"><pre class="language-sql"><code><span class="token comment">-- 空间表</span>
<span class="token keyword">create</span> <span class="token keyword">table</span> <span class="token keyword">if</span> <span class="token operator">not</span> <span class="token keyword">exists</span> space
<span class="token punctuation">(</span>
    id         <span class="token keyword">bigint</span> <span class="token keyword">auto_increment</span> <span class="token keyword">comment</span> <span class="token string">&#39;id&#39;</span> <span class="token keyword">primary</span> <span class="token keyword">key</span><span class="token punctuation">,</span>
    spaceName  <span class="token keyword">varchar</span><span class="token punctuation">(</span><span class="token number">128</span><span class="token punctuation">)</span>                       <span class="token boolean">null</span> <span class="token keyword">comment</span> <span class="token string">&#39;空间名称&#39;</span><span class="token punctuation">,</span>
    spaceLevel <span class="token keyword">int</span>      <span class="token keyword">default</span> <span class="token number">0</span>                 <span class="token boolean">null</span> <span class="token keyword">comment</span> <span class="token string">&#39;空间级别：0-普通版 1-专业版 2-旗舰版&#39;</span><span class="token punctuation">,</span>
    maxSize    <span class="token keyword">bigint</span>   <span class="token keyword">default</span> <span class="token number">0</span>                 <span class="token boolean">null</span> <span class="token keyword">comment</span> <span class="token string">&#39;空间图片的最大总大小&#39;</span><span class="token punctuation">,</span>
    maxCount   <span class="token keyword">bigint</span>   <span class="token keyword">default</span> <span class="token number">0</span>                 <span class="token boolean">null</span> <span class="token keyword">comment</span> <span class="token string">&#39;空间图片的最大数量&#39;</span><span class="token punctuation">,</span>
    totalSize  <span class="token keyword">bigint</span>   <span class="token keyword">default</span> <span class="token number">0</span>                 <span class="token boolean">null</span> <span class="token keyword">comment</span> <span class="token string">&#39;当前空间下图片的总大小&#39;</span><span class="token punctuation">,</span>
    totalCount <span class="token keyword">bigint</span>   <span class="token keyword">default</span> <span class="token number">0</span>                 <span class="token boolean">null</span> <span class="token keyword">comment</span> <span class="token string">&#39;当前空间下的图片数量&#39;</span><span class="token punctuation">,</span>
    userId     <span class="token keyword">bigint</span>                             <span class="token operator">not</span> <span class="token boolean">null</span> <span class="token keyword">comment</span> <span class="token string">&#39;创建用户 id&#39;</span><span class="token punctuation">,</span>
    createTime <span class="token keyword">datetime</span> <span class="token keyword">default</span> <span class="token keyword">CURRENT_TIMESTAMP</span> <span class="token operator">not</span> <span class="token boolean">null</span> <span class="token keyword">comment</span> <span class="token string">&#39;创建时间&#39;</span><span class="token punctuation">,</span>
    editTime   <span class="token keyword">datetime</span> <span class="token keyword">default</span> <span class="token keyword">CURRENT_TIMESTAMP</span> <span class="token operator">not</span> <span class="token boolean">null</span> <span class="token keyword">comment</span> <span class="token string">&#39;编辑时间&#39;</span><span class="token punctuation">,</span>
    updateTime <span class="token keyword">datetime</span> <span class="token keyword">default</span> <span class="token keyword">CURRENT_TIMESTAMP</span> <span class="token operator">not</span> <span class="token boolean">null</span> <span class="token keyword">on</span> <span class="token keyword">update</span> <span class="token keyword">CURRENT_TIMESTAMP</span> <span class="token keyword">comment</span> <span class="token string">&#39;更新时间&#39;</span><span class="token punctuation">,</span>
    isDelete   <span class="token keyword">tinyint</span>  <span class="token keyword">default</span> <span class="token number">0</span>                 <span class="token operator">not</span> <span class="token boolean">null</span> <span class="token keyword">comment</span> <span class="token string">&#39;是否删除&#39;</span><span class="token punctuation">,</span>
    <span class="token comment">-- 索引设计</span>
    <span class="token keyword">index</span> idx_userId <span class="token punctuation">(</span>userId<span class="token punctuation">)</span><span class="token punctuation">,</span>        <span class="token comment">-- 提升基于用户的查询效率</span>
    <span class="token keyword">index</span> idx_spaceName <span class="token punctuation">(</span>spaceName<span class="token punctuation">)</span><span class="token punctuation">,</span>  <span class="token comment">-- 提升基于空间名称的查询效率</span>
    <span class="token keyword">index</span> idx_spaceLevel <span class="token punctuation">(</span>spaceLevel<span class="token punctuation">)</span> <span class="token comment">-- 提升按空间级别查询的效率</span>
<span class="token punctuation">)</span> <span class="token keyword">comment</span> <span class="token string">&#39;空间&#39;</span> <span class="token keyword">collate</span> <span class="token operator">=</span> utf8mb4_unicode_ci<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_2、图片表" tabindex="-1"><a class="header-anchor" href="#_2、图片表" aria-hidden="true">#</a> 2、图片表</h4><p>由于一张图片只能属于一个空间，可以在图片表 picture 中新增字段 spaceId，实现图片与空间的关联，同时增加索引以提高查询性能。</p><p>SQL 如下：</p><div class="language-sql line-numbers-mode" data-ext="sql"><pre class="language-sql"><code><span class="token comment">-- 添加新列</span>
<span class="token keyword">ALTER</span> <span class="token keyword">TABLE</span> picture
    <span class="token keyword">ADD</span> <span class="token keyword">COLUMN</span> spaceId  <span class="token keyword">bigint</span>  <span class="token boolean">null</span> <span class="token keyword">comment</span> <span class="token string">&#39;空间 id（为空表示公共空间）&#39;</span><span class="token punctuation">;</span>

<span class="token comment">-- 创建索引</span>
<span class="token keyword">CREATE</span> <span class="token keyword">INDEX</span> idx_spaceId <span class="token keyword">ON</span> picture <span class="token punctuation">(</span>spaceId<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">--我们经常用空间id查询有多少条图片的</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>默认情况下，spaceId 为空，表示图片上传到了公共图库。</p><h3 id="_3、空间管理" tabindex="-1"><a class="header-anchor" href="#_3、空间管理" aria-hidden="true">#</a> 3、空间管理</h3><h4 id="_1、数据模型" tabindex="-1"><a class="header-anchor" href="#_1、数据模型" aria-hidden="true">#</a> 1、数据模型</h4><p>1）利用 MyBatisX 插件生成空间表相关的基础代码，包括实体类、Mapper、Service，然后修改实体类的主键生成策略并指定逻辑删除字段，Space 类的代码如下：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@TableName</span><span class="token punctuation">(</span>value <span class="token operator">=</span><span class="token string">&quot;space&quot;</span><span class="token punctuation">)</span>
<span class="token annotation punctuation">@Data</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Space</span> <span class="token keyword">implements</span> <span class="token class-name">Serializable</span> <span class="token punctuation">{</span>
    <span class="token doc-comment comment">/**
     * id
     */</span>
    <span class="token annotation punctuation">@TableId</span><span class="token punctuation">(</span>type <span class="token operator">=</span> <span class="token class-name">IdType</span><span class="token punctuation">.</span><span class="token constant">ASSIGN_ID</span><span class="token punctuation">)</span>
    <span class="token keyword">private</span> <span class="token class-name">Long</span> id<span class="token punctuation">;</span>

    <span class="token doc-comment comment">/**
     * 空间名称
     */</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> spaceName<span class="token punctuation">;</span>

    <span class="token doc-comment comment">/**
     * 空间级别：0-普通版 1-专业版 2-旗舰版
     */</span>
    <span class="token keyword">private</span> <span class="token class-name">Integer</span> spaceLevel<span class="token punctuation">;</span>

    <span class="token doc-comment comment">/**
     * 空间图片的最大总大小
     */</span>
    <span class="token keyword">private</span> <span class="token class-name">Long</span> maxSize<span class="token punctuation">;</span>

    <span class="token doc-comment comment">/**
     * 空间图片的最大数量
     */</span>
    <span class="token keyword">private</span> <span class="token class-name">Long</span> maxCount<span class="token punctuation">;</span>

    <span class="token doc-comment comment">/**
     * 当前空间下图片的总大小
     */</span>
    <span class="token keyword">private</span> <span class="token class-name">Long</span> totalSize<span class="token punctuation">;</span>

    <span class="token doc-comment comment">/**
     * 当前空间下的图片数量
     */</span>
    <span class="token keyword">private</span> <span class="token class-name">Long</span> totalCount<span class="token punctuation">;</span>

    <span class="token doc-comment comment">/**
     * 创建用户 id
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
     * 是否删除
     */</span>
    <span class="token annotation punctuation">@TableLogic</span>
    <span class="token keyword">private</span> <span class="token class-name">Integer</span> isDelete<span class="token punctuation">;</span>

    <span class="token annotation punctuation">@TableField</span><span class="token punctuation">(</span>exist <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">)</span>
    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token keyword">long</span> serialVersionUID <span class="token operator">=</span> <span class="token number">1L</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>2）每个操作都需要提供一个请求类，都放在 <code>model.dto.space</code> 包下</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503211149246.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>空间创建请求：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Data</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">SpaceAddRequest</span> <span class="token keyword">implements</span> <span class="token class-name">Serializable</span> <span class="token punctuation">{</span>

    <span class="token doc-comment comment">/**
     * 空间名称
     */</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> spaceName<span class="token punctuation">;</span>

    <span class="token doc-comment comment">/**
     * 空间级别：0-普通版 1-专业版 2-旗舰版
     */</span>
    <span class="token keyword">private</span> <span class="token class-name">Integer</span> spaceLevel<span class="token punctuation">;</span>

    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token keyword">long</span> serialVersionUID <span class="token operator">=</span> <span class="token number">1L</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>空间编辑请求，<mark>给用户使用</mark>，目前仅允许编辑空间名称：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Data</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">SpaceEditRequest</span> <span class="token keyword">implements</span> <span class="token class-name">Serializable</span> <span class="token punctuation">{</span>

    <span class="token doc-comment comment">/**
     * 空间 id
     */</span>
    <span class="token keyword">private</span> <span class="token class-name">Long</span> id<span class="token punctuation">;</span>

    <span class="token doc-comment comment">/**
     * 空间名称
     */</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> spaceName<span class="token punctuation">;</span>

    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token keyword">long</span> serialVersionUID <span class="token operator">=</span> <span class="token number">1L</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>空间更新请求，<mark>给管理员使用</mark>，可以修改空间级别和限额：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Data</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">SpaceUpdateRequest</span> <span class="token keyword">implements</span> <span class="token class-name">Serializable</span> <span class="token punctuation">{</span>

    <span class="token doc-comment comment">/**
     * id
     */</span>
    <span class="token keyword">private</span> <span class="token class-name">Long</span> id<span class="token punctuation">;</span>

    <span class="token doc-comment comment">/**
     * 空间名称
     */</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> spaceName<span class="token punctuation">;</span>

    <span class="token doc-comment comment">/**
     * 空间级别：0-普通版 1-专业版 2-旗舰版
     */</span>
    <span class="token keyword">private</span> <span class="token class-name">Integer</span> spaceLevel<span class="token punctuation">;</span>

    <span class="token doc-comment comment">/**
     * 空间图片的最大总大小
     */</span>
    <span class="token keyword">private</span> <span class="token class-name">Long</span> maxSize<span class="token punctuation">;</span>

    <span class="token doc-comment comment">/**
     * 空间图片的最大数量
     */</span>
    <span class="token keyword">private</span> <span class="token class-name">Long</span> maxCount<span class="token punctuation">;</span>

    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token keyword">long</span> serialVersionUID <span class="token operator">=</span> <span class="token number">1L</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>空间查询请求：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@EqualsAndHashCode</span><span class="token punctuation">(</span>callSuper <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">)</span>
<span class="token annotation punctuation">@Data</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">SpaceQueryRequest</span> <span class="token keyword">extends</span> <span class="token class-name">PageRequest</span> <span class="token keyword">implements</span> <span class="token class-name">Serializable</span> <span class="token punctuation">{</span>

    <span class="token doc-comment comment">/**
     * id
     */</span>
    <span class="token keyword">private</span> <span class="token class-name">Long</span> id<span class="token punctuation">;</span>

    <span class="token doc-comment comment">/**
     * 用户 id
     */</span>
    <span class="token keyword">private</span> <span class="token class-name">Long</span> userId<span class="token punctuation">;</span>

    <span class="token doc-comment comment">/**
     * 空间名称
     */</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> spaceName<span class="token punctuation">;</span>

    <span class="token doc-comment comment">/**
     * 空间级别：0-普通版 1-专业版 2-旗舰版
     */</span>
    <span class="token keyword">private</span> <span class="token class-name">Integer</span> spaceLevel<span class="token punctuation">;</span>

    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token keyword">long</span> serialVersionUID <span class="token operator">=</span> <span class="token number">1L</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>3）在 <code>model.dto.vo</code> 下新建空间的视图包装类，可以额外关联创建空间的用户信息。还可以编写 Space 实体类和该 VO 类的转换方法，便于后续快速传值。</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Data</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">SpaceVO</span> <span class="token keyword">implements</span> <span class="token class-name">Serializable</span> <span class="token punctuation">{</span>
    <span class="token doc-comment comment">/**
     * id
     */</span>
    <span class="token keyword">private</span> <span class="token class-name">Long</span> id<span class="token punctuation">;</span>

    <span class="token doc-comment comment">/**
     * 空间名称
     */</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> spaceName<span class="token punctuation">;</span>

    <span class="token doc-comment comment">/**
     * 空间级别：0-普通版 1-专业版 2-旗舰版
     */</span>
    <span class="token keyword">private</span> <span class="token class-name">Integer</span> spaceLevel<span class="token punctuation">;</span>

    <span class="token doc-comment comment">/**
     * 空间图片的最大总大小
     */</span>
    <span class="token keyword">private</span> <span class="token class-name">Long</span> maxSize<span class="token punctuation">;</span>

    <span class="token doc-comment comment">/**
     * 空间图片的最大数量
     */</span>
    <span class="token keyword">private</span> <span class="token class-name">Long</span> maxCount<span class="token punctuation">;</span>

    <span class="token doc-comment comment">/**
     * 当前空间下图片的总大小
     */</span>
    <span class="token keyword">private</span> <span class="token class-name">Long</span> totalSize<span class="token punctuation">;</span>

    <span class="token doc-comment comment">/**
     * 当前空间下的图片数量
     */</span>
    <span class="token keyword">private</span> <span class="token class-name">Long</span> totalCount<span class="token punctuation">;</span>

    <span class="token doc-comment comment">/**
     * 创建用户 id
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
     *
     * <span class="token keyword">@param</span> <span class="token parameter">spaceVO</span>
     * <span class="token keyword">@return</span>
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">Space</span> <span class="token function">voToObj</span><span class="token punctuation">(</span><span class="token class-name">SpaceVO</span> spaceVO<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>spaceVO <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token class-name">Space</span> space <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Space</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">BeanUtils</span><span class="token punctuation">.</span><span class="token function">copyProperties</span><span class="token punctuation">(</span>spaceVO<span class="token punctuation">,</span> space<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">return</span> space<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 对象转封装类
     *
     * <span class="token keyword">@param</span> <span class="token parameter">space</span>
     * <span class="token keyword">@return</span>
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">SpaceVO</span> <span class="token function">objToVo</span><span class="token punctuation">(</span><span class="token class-name">Space</span> space<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>space <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token class-name">SpaceVO</span> spaceVO <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">SpaceVO</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">BeanUtils</span><span class="token punctuation">.</span><span class="token function">copyProperties</span><span class="token punctuation">(</span>space<span class="token punctuation">,</span> spaceVO<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">return</span> spaceVO<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>4）在 <code>model.enums</code> 包下新建空间级别枚举，定义每个级别的空间对应的限额：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Getter</span>
<span class="token keyword">public</span> <span class="token keyword">enum</span> <span class="token class-name">SpaceLevelEnum</span> <span class="token punctuation">{</span>

    <span class="token function">COMMON</span><span class="token punctuation">(</span><span class="token string">&quot;普通版&quot;</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">100</span><span class="token punctuation">,</span> <span class="token number">100L</span> <span class="token operator">*</span> <span class="token number">1024</span> <span class="token operator">*</span> <span class="token number">1024</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token function">PROFESSIONAL</span><span class="token punctuation">(</span><span class="token string">&quot;专业版&quot;</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">1000</span><span class="token punctuation">,</span> <span class="token number">1000L</span> <span class="token operator">*</span> <span class="token number">1024</span> <span class="token operator">*</span> <span class="token number">1024</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token function">FLAGSHIP</span><span class="token punctuation">(</span><span class="token string">&quot;旗舰版&quot;</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">10000</span><span class="token punctuation">,</span> <span class="token number">10000L</span> <span class="token operator">*</span> <span class="token number">1024</span> <span class="token operator">*</span> <span class="token number">1024</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token keyword">private</span> <span class="token keyword">final</span> <span class="token class-name">String</span> text<span class="token punctuation">;</span>

    <span class="token keyword">private</span> <span class="token keyword">final</span> <span class="token keyword">int</span> value<span class="token punctuation">;</span>

    <span class="token keyword">private</span> <span class="token keyword">final</span> <span class="token keyword">long</span> maxCount<span class="token punctuation">;</span>

    <span class="token keyword">private</span> <span class="token keyword">final</span> <span class="token keyword">long</span> maxSize<span class="token punctuation">;</span>


    <span class="token doc-comment comment">/**
     * <span class="token keyword">@param</span> <span class="token parameter">text</span> 文本
     * <span class="token keyword">@param</span> <span class="token parameter">value</span> 值
     * <span class="token keyword">@param</span> <span class="token parameter">maxSize</span> 最大图片总大小
     * <span class="token keyword">@param</span> <span class="token parameter">maxCount</span> 最大图片总数量
     */</span>
    <span class="token class-name">SpaceLevelEnum</span><span class="token punctuation">(</span><span class="token class-name">String</span> text<span class="token punctuation">,</span> <span class="token keyword">int</span> value<span class="token punctuation">,</span> <span class="token keyword">long</span> maxCount<span class="token punctuation">,</span> <span class="token keyword">long</span> maxSize<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>text <span class="token operator">=</span> text<span class="token punctuation">;</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>value <span class="token operator">=</span> value<span class="token punctuation">;</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>maxCount <span class="token operator">=</span> maxCount<span class="token punctuation">;</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>maxSize <span class="token operator">=</span> maxSize<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 根据 value 获取枚举
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">SpaceLevelEnum</span> <span class="token function">getEnumByValue</span><span class="token punctuation">(</span><span class="token class-name">Integer</span> value<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token class-name">ObjUtil</span><span class="token punctuation">.</span><span class="token function">isEmpty</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">SpaceLevelEnum</span> spaceLevelEnum <span class="token operator">:</span> <span class="token class-name">SpaceLevelEnum</span><span class="token punctuation">.</span><span class="token function">values</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span>spaceLevelEnum<span class="token punctuation">.</span>value <span class="token operator">==</span> value<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token keyword">return</span> spaceLevelEnum<span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>💡 还有另外一种定义空间级别限额的方式，比如将空间限额配置存储在外部文件（如 JSON 文件或 properties 文件），并创建一个单独的类来接收参数。这样后期如果有变动，修改配置文件即可，而不必修改代码。</p><h4 id="_2、基础服务开发" tabindex="-1"><a class="header-anchor" href="#_2、基础服务开发" aria-hidden="true">#</a> 2、基础服务开发</h4><p>1）需要开发校验空间数据的方法，增加 add 参数用来区分是创建数据时校验还是编辑时校验，判断条件是不一样的：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Override</span>
<span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">validSpace</span><span class="token punctuation">(</span><span class="token class-name">Space</span> space<span class="token punctuation">,</span> <span class="token keyword">boolean</span> add<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token class-name">ThrowUtils</span><span class="token punctuation">.</span><span class="token function">throwIf</span><span class="token punctuation">(</span>space <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token class-name">ErrorCode</span><span class="token punctuation">.</span><span class="token constant">PARAMS_ERROR</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// 从对象中取值</span>
    <span class="token class-name">String</span> spaceName <span class="token operator">=</span> space<span class="token punctuation">.</span><span class="token function">getSpaceName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token class-name">Integer</span> spaceLevel <span class="token operator">=</span> space<span class="token punctuation">.</span><span class="token function">getSpaceLevel</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token class-name">SpaceLevelEnum</span> spaceLevelEnum <span class="token operator">=</span> <span class="token class-name">SpaceLevelEnum</span><span class="token punctuation">.</span><span class="token function">getEnumByValue</span><span class="token punctuation">(</span>spaceLevel<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// 要创建</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>add<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token class-name">StrUtil</span><span class="token punctuation">.</span><span class="token function">isBlank</span><span class="token punctuation">(</span>spaceName<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">BusinessException</span><span class="token punctuation">(</span><span class="token class-name">ErrorCode</span><span class="token punctuation">.</span><span class="token constant">PARAMS_ERROR</span><span class="token punctuation">,</span> <span class="token string">&quot;空间名称不能为空&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>spaceLevel <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">BusinessException</span><span class="token punctuation">(</span><span class="token class-name">ErrorCode</span><span class="token punctuation">.</span><span class="token constant">PARAMS_ERROR</span><span class="token punctuation">,</span> <span class="token string">&quot;空间级别不能为空&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    <span class="token comment">// 修改数据时，如果要改空间级别</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>spaceLevel <span class="token operator">!=</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> spaceLevelEnum <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">BusinessException</span><span class="token punctuation">(</span><span class="token class-name">ErrorCode</span><span class="token punctuation">.</span><span class="token constant">PARAMS_ERROR</span><span class="token punctuation">,</span> <span class="token string">&quot;空间级别不存在&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token class-name">StrUtil</span><span class="token punctuation">.</span><span class="token function">isNotBlank</span><span class="token punctuation">(</span>spaceName<span class="token punctuation">)</span> <span class="token operator">&amp;&amp;</span> spaceName<span class="token punctuation">.</span><span class="token function">length</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">&gt;</span> <span class="token number">30</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">BusinessException</span><span class="token punctuation">(</span><span class="token class-name">ErrorCode</span><span class="token punctuation">.</span><span class="token constant">PARAMS_ERROR</span><span class="token punctuation">,</span> <span class="token string">&quot;空间名称过长&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>2）在创建或更新空间时，需要根据空间级别自动填充限额数据，可以在服务中编写方法便于复用：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Override</span>
<span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">fillSpaceBySpaceLevel</span><span class="token punctuation">(</span><span class="token class-name">Space</span> space<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 根据空间级别，自动填充限额</span>
    <span class="token class-name">SpaceLevelEnum</span> spaceLevelEnum <span class="token operator">=</span> <span class="token class-name">SpaceLevelEnum</span><span class="token punctuation">.</span><span class="token function">getEnumByValue</span><span class="token punctuation">(</span>space<span class="token punctuation">.</span><span class="token function">getSpaceLevel</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>spaceLevelEnum <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">long</span> maxSize <span class="token operator">=</span> spaceLevelEnum<span class="token punctuation">.</span><span class="token function">getMaxSize</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>space<span class="token punctuation">.</span><span class="token function">getMaxSize</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            space<span class="token punctuation">.</span><span class="token function">setMaxSize</span><span class="token punctuation">(</span>maxSize<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">long</span> maxCount <span class="token operator">=</span> spaceLevelEnum<span class="token punctuation">.</span><span class="token function">getMaxCount</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>space<span class="token punctuation">.</span><span class="token function">getMaxCount</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            space<span class="token punctuation">.</span><span class="token function">setMaxCount</span><span class="token punctuation">(</span>maxCount<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果空间本身没有设置限额，才会自动填充，保证了灵活性。</p><h3 id="_4、用户创建私有空间" tabindex="-1"><a class="header-anchor" href="#_4、用户创建私有空间" aria-hidden="true">#</a> 4、用户创建私有空间</h3><p>流程如下：</p><ol><li>填充参数默认值</li><li>校验参数</li><li>校验权限，非管理员只能创建普通级别的空间</li><li>控制同一用户只能创建一个私有空间</li></ol><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token doc-comment comment">/**
     * 创建空间
     *
     * <span class="token keyword">@param</span> <span class="token parameter">spaceAddRequest</span>
     * <span class="token keyword">@param</span> <span class="token parameter">loginUser</span>
     * <span class="token keyword">@return</span>
     */</span>
<span class="token annotation punctuation">@Override</span>
<span class="token keyword">public</span> <span class="token keyword">long</span> <span class="token function">addSpace</span><span class="token punctuation">(</span><span class="token class-name">SpaceAddRequest</span> spaceAddRequest<span class="token punctuation">,</span> <span class="token class-name">User</span> loginUser<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 1. 填充参数默认值</span>
    <span class="token comment">// 转换实体类和 DTO</span>
    <span class="token class-name">Space</span> space <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Space</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token class-name">BeanUtils</span><span class="token punctuation">.</span><span class="token function">copyProperties</span><span class="token punctuation">(</span>spaceAddRequest<span class="token punctuation">,</span> space<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token class-name">StrUtil</span><span class="token punctuation">.</span><span class="token function">isBlank</span><span class="token punctuation">(</span>space<span class="token punctuation">.</span><span class="token function">getSpaceName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        space<span class="token punctuation">.</span><span class="token function">setSpaceName</span><span class="token punctuation">(</span><span class="token string">&quot;默认空间&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>space<span class="token punctuation">.</span><span class="token function">getSpaceLevel</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        space<span class="token punctuation">.</span><span class="token function">setSpaceLevel</span><span class="token punctuation">(</span><span class="token class-name">SpaceLevelEnum</span><span class="token punctuation">.</span><span class="token constant">COMMON</span><span class="token punctuation">.</span><span class="token function">getValue</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>space<span class="token punctuation">.</span><span class="token function">getSpaceType</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        space<span class="token punctuation">.</span><span class="token function">setSpaceType</span><span class="token punctuation">(</span><span class="token class-name">SpaceTypeEnum</span><span class="token punctuation">.</span><span class="token constant">PRIVATE</span><span class="token punctuation">.</span><span class="token function">getValue</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token comment">// 填充容量和大小</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">fillSpaceBySpaceLevel</span><span class="token punctuation">(</span>space<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// 2. 校验参数</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">validSpace</span><span class="token punctuation">(</span>space<span class="token punctuation">,</span> <span class="token boolean">true</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// 3. 校验权限，非管理员只能创建普通级别的空间</span>
    <span class="token class-name">Long</span> userId <span class="token operator">=</span> loginUser<span class="token punctuation">.</span><span class="token function">getId</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    space<span class="token punctuation">.</span><span class="token function">setUserId</span><span class="token punctuation">(</span>userId<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token class-name">SpaceLevelEnum</span><span class="token punctuation">.</span><span class="token constant">COMMON</span><span class="token punctuation">.</span><span class="token function">getValue</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">!=</span> space<span class="token punctuation">.</span><span class="token function">getSpaceLevel</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">&amp;&amp;</span> <span class="token operator">!</span>userService<span class="token punctuation">.</span><span class="token function">isAdmin</span><span class="token punctuation">(</span>loginUser<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">BusinessException</span><span class="token punctuation">(</span><span class="token class-name">ErrorCode</span><span class="token punctuation">.</span><span class="token constant">NO_AUTH_ERROR</span><span class="token punctuation">,</span> <span class="token string">&quot;无权限创建指定级别的空间&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token comment">// 4. 控制同一用户只能创建一个私有空间、以及一个团队空间</span>
    <span class="token class-name">String</span> lock <span class="token operator">=</span> <span class="token class-name">String</span><span class="token punctuation">.</span><span class="token function">valueOf</span><span class="token punctuation">(</span>userId<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">intern</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">synchronized</span> <span class="token punctuation">(</span>lock<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">Long</span> newSpaceId <span class="token operator">=</span> transactionTemplate<span class="token punctuation">.</span><span class="token function">execute</span><span class="token punctuation">(</span>status <span class="token operator">-&gt;</span> <span class="token punctuation">{</span>
            <span class="token comment">// 判断是否已有空间</span>
            <span class="token keyword">boolean</span> exists <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">lambdaQuery</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
                <span class="token punctuation">.</span><span class="token function">eq</span><span class="token punctuation">(</span><span class="token class-name">Space</span><span class="token operator">::</span><span class="token function">getUserId</span><span class="token punctuation">,</span> userId<span class="token punctuation">)</span>
                <span class="token punctuation">.</span><span class="token function">eq</span><span class="token punctuation">(</span><span class="token class-name">Space</span><span class="token operator">::</span><span class="token function">getSpaceType</span><span class="token punctuation">,</span> space<span class="token punctuation">.</span><span class="token function">getSpaceType</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
                <span class="token punctuation">.</span><span class="token function">exists</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token comment">// 如果已有空间，就不能再创建</span>
            <span class="token class-name">ThrowUtils</span><span class="token punctuation">.</span><span class="token function">throwIf</span><span class="token punctuation">(</span>exists<span class="token punctuation">,</span> <span class="token class-name">ErrorCode</span><span class="token punctuation">.</span><span class="token constant">OPERATION_ERROR</span><span class="token punctuation">,</span> <span class="token string">&quot;每个用户每类空间只能创建一个&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token comment">// 创建</span>
            <span class="token keyword">boolean</span> result <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">save</span><span class="token punctuation">(</span>space<span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token class-name">ThrowUtils</span><span class="token punctuation">.</span><span class="token function">throwIf</span><span class="token punctuation">(</span><span class="token operator">!</span>result<span class="token punctuation">,</span> <span class="token class-name">ErrorCode</span><span class="token punctuation">.</span><span class="token constant">OPERATION_ERROR</span><span class="token punctuation">,</span> <span class="token string">&quot;保存空间到数据库失败&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token comment">// 创建成功后，如果是团队空间，关联新增团队成员记录</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token class-name">SpaceTypeEnum</span><span class="token punctuation">.</span><span class="token constant">TEAM</span><span class="token punctuation">.</span><span class="token function">getValue</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">==</span> space<span class="token punctuation">.</span><span class="token function">getSpaceType</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token class-name">SpaceUser</span> spaceUser <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">SpaceUser</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                spaceUser<span class="token punctuation">.</span><span class="token function">setSpaceId</span><span class="token punctuation">(</span>space<span class="token punctuation">.</span><span class="token function">getId</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                spaceUser<span class="token punctuation">.</span><span class="token function">setUserId</span><span class="token punctuation">(</span>userId<span class="token punctuation">)</span><span class="token punctuation">;</span>
                spaceUser<span class="token punctuation">.</span><span class="token function">setSpaceRole</span><span class="token punctuation">(</span><span class="token class-name">SpaceRoleEnum</span><span class="token punctuation">.</span><span class="token constant">ADMIN</span><span class="token punctuation">.</span><span class="token function">getValue</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                result <span class="token operator">=</span> spaceUserService<span class="token punctuation">.</span><span class="token function">save</span><span class="token punctuation">(</span>spaceUser<span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token class-name">ThrowUtils</span><span class="token punctuation">.</span><span class="token function">throwIf</span><span class="token punctuation">(</span><span class="token operator">!</span>result<span class="token punctuation">,</span> <span class="token class-name">ErrorCode</span><span class="token punctuation">.</span><span class="token constant">OPERATION_ERROR</span><span class="token punctuation">,</span> <span class="token string">&quot;创建团队成员记录失败&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
            <span class="token comment">//                // 创建分表（仅对团队空间生效）为方便部署，暂时不使用</span>
            <span class="token comment">//                dynamicShardingManager.createSpacePictureTable(space);</span>
            <span class="token comment">// 返回新写入的数据 id</span>
            <span class="token keyword">return</span> space<span class="token punctuation">.</span><span class="token function">getId</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">return</span> <span class="token class-name">Optional</span><span class="token punctuation">.</span><span class="token function">ofNullable</span><span class="token punctuation">(</span>newSpaceId<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">orElse</span><span class="token punctuation">(</span><span class="token operator">-</span><span class="token number">1L</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>注意，上述代码中，我们使用本地 synchronized 锁对 userId 进行加锁，这样不同的用户可以拿到不同的锁，对性能的影响较低。在加锁的代码中，我们使用 Spring 的 <strong>编程式事务管理器</strong> transactionTemplate 封装跟数据库有关的查询和插入操作，而不是使用 @Transactional 注解来控制事务，这样可以保证事务的提交在加锁的范围内。</p><p>💡 只要涉及到事务操作，其实测试时自己 new 个运行时异常来验证是否会回滚就会知道。</p><h4 id="扩展-本地锁优化" tabindex="-1"><a class="header-anchor" href="#扩展-本地锁优化" aria-hidden="true">#</a> 扩展 - 本地锁优化</h4><p>上述代码中，我们是对字符串常量池（intern）进行加锁的，数据并不会及时释放。如果还要使用本地锁，可以按需选用另一种方式 —— 采用 <code>ConcurrentHashMap</code> 来存储锁对象。</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token class-name">Map</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Long</span><span class="token punctuation">,</span> <span class="token class-name">Object</span><span class="token punctuation">&gt;</span></span> lockMap <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ConcurrentHashMap</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">public</span> <span class="token keyword">long</span> <span class="token function">addSpace</span><span class="token punctuation">(</span><span class="token class-name">SpaceAddRequest</span> spaceAddRequest<span class="token punctuation">,</span> <span class="token class-name">User</span> user<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token class-name">Long</span> userId <span class="token operator">=</span> user<span class="token punctuation">.</span><span class="token function">getId</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token class-name">Object</span> lock <span class="token operator">=</span> lockMap<span class="token punctuation">.</span><span class="token function">computeIfAbsent</span><span class="token punctuation">(</span>userId<span class="token punctuation">,</span> key <span class="token operator">-&gt;</span> <span class="token keyword">new</span> <span class="token class-name">Object</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">synchronized</span> <span class="token punctuation">(</span>lock<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">try</span> <span class="token punctuation">{</span>
            <span class="token comment">// 数据库操作</span>
        <span class="token punctuation">}</span> <span class="token keyword">finally</span> <span class="token punctuation">{</span>
            <span class="token comment">// 防止内存泄漏</span>
            lockMap<span class="token punctuation">.</span><span class="token function">remove</span><span class="token punctuation">(</span>userId<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,47),c=[t];function o(l,i){return s(),a("div",null,c)}const k=n(p,[["render",o],["__file","4.Space Module.html.vue"]]);export{k as default};
