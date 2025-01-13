import{_ as s,W as a,X as n,a2 as e}from"./framework-6a3aa88c.js";const t={},o=e(`<p>#{}是标记一个占位符，可以防止sql注入。 \${}用于在动态sql中拼接字符串，直接将参数值替换到sql语句中，可能导致sql注入。</p><p>Mybatisi在处理#时，会将sql中的#替换为？号，调用PreparedStatement的set方法来赋值；</p><p>意味着在在sql语句之前进行了预处理，优化好了一个固定的模版，所以后续有危险的参数传入也不会景影响之前的模板逻辑。</p><p><strong>那在什么情况下只能使用\${}呢？</strong></p><h3 id="_1-动态表名或列名" tabindex="-1"><a class="header-anchor" href="#_1-动态表名或列名" aria-hidden="true">#</a> <strong>1. 动态表名或列名</strong></h3><div class="language-sql line-numbers-mode" data-ext="sql"><pre class="language-sql"><code><span class="token operator">&lt;</span><span class="token keyword">select</span> id<span class="token operator">=</span><span class="token string">&quot;getDataFromTable&quot;</span> resultType<span class="token operator">=</span><span class="token string">&quot;Map&quot;</span><span class="token operator">&gt;</span>
    <span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> \${tableName} <span class="token keyword">WHERE</span> \${columnName} <span class="token operator">=</span> <span class="token comment">#{value}</span>
<span class="token operator">&lt;</span><span class="token operator">/</span><span class="token keyword">select</span><span class="token operator">&gt;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-动态排序-order-by-子句" tabindex="-1"><a class="header-anchor" href="#_2-动态排序-order-by-子句" aria-hidden="true">#</a> <strong>2. 动态排序（ORDER BY 子句）</strong></h3><div class="language-sql line-numbers-mode" data-ext="sql"><pre class="language-sql"><code><span class="token operator">&lt;</span><span class="token keyword">select</span> id<span class="token operator">=</span><span class="token string">&quot;getSortedUsers&quot;</span> resultType<span class="token operator">=</span><span class="token string">&quot;User&quot;</span><span class="token operator">&gt;</span>
    <span class="token keyword">SELECT</span> id<span class="token punctuation">,</span> name<span class="token punctuation">,</span> age <span class="token keyword">FROM</span> <span class="token keyword">user</span> <span class="token keyword">ORDER</span> <span class="token keyword">BY</span> \${orderBy}
<span class="token operator">&lt;</span><span class="token operator">/</span><span class="token keyword">select</span><span class="token operator">&gt;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-动态限制-limit-和-offset-子句" tabindex="-1"><a class="header-anchor" href="#_3-动态限制-limit-和-offset-子句" aria-hidden="true">#</a> <strong>3. 动态限制（LIMIT 和 OFFSET 子句）</strong></h3><div class="language-sql line-numbers-mode" data-ext="sql"><pre class="language-sql"><code><span class="token operator">&lt;</span><span class="token keyword">select</span> id<span class="token operator">=</span><span class="token string">&quot;getPaginatedUsers&quot;</span> resultType<span class="token operator">=</span><span class="token string">&quot;User&quot;</span><span class="token operator">&gt;</span>
    <span class="token keyword">SELECT</span> id<span class="token punctuation">,</span> name<span class="token punctuation">,</span> age <span class="token keyword">FROM</span> <span class="token keyword">user</span> <span class="token keyword">LIMIT</span> \${<span class="token keyword">limit</span>} <span class="token keyword">OFFSET</span> \${<span class="token keyword">offset</span>}
<span class="token operator">&lt;</span><span class="token operator">/</span><span class="token keyword">select</span><span class="token operator">&gt;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-动态-sql-片段" tabindex="-1"><a class="header-anchor" href="#_4-动态-sql-片段" aria-hidden="true">#</a> <strong>4. 动态 SQL 片段</strong></h3><p>如果某些部分需要动态拼接复杂的 SQL 片段，且这些片段不是简单的参数值，使用 <code>\${}</code> 更灵活。</p><div class="language-sql line-numbers-mode" data-ext="sql"><pre class="language-sql"><code><span class="token operator">&lt;</span><span class="token keyword">select</span> id<span class="token operator">=</span><span class="token string">&quot;getUsersByDynamicCondition&quot;</span> resultType<span class="token operator">=</span><span class="token string">&quot;User&quot;</span><span class="token operator">&gt;</span>
    <span class="token keyword">SELECT</span> id<span class="token punctuation">,</span> name<span class="token punctuation">,</span> age<span class="token punctuation">,</span> gender 
    <span class="token keyword">FROM</span> <span class="token keyword">user</span> 
    <span class="token keyword">WHERE</span> <span class="token number">1</span><span class="token operator">=</span><span class="token number">1</span> 
    \${dynamicCondition}
<span class="token operator">&lt;</span><span class="token operator">/</span><span class="token keyword">select</span><span class="token operator">&gt;</span>

String dynamicCondition <span class="token operator">=</span> <span class="token string">&quot;AND age &gt; 25 AND gender = &#39;F&#39;&quot;</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,13),p=[o];function r(l,c){return a(),n("div",null,p)}const d=s(t,[["render",r],["__file","2.What is the difference between ___ and ___ in MyBatis.html.vue"]]);export{d as default};
