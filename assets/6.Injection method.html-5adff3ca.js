import{_ as n,W as s,X as a,a2 as e}from"./framework-48328e23.js";const p={},c=e(`<ol><li><p><strong>构造函数注入</strong>：通过类的构造函数将依赖对象传入。</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Component</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ExampleService</span> <span class="token punctuation">{</span>
    <span class="token keyword">private</span> <span class="token keyword">final</span> <span class="token class-name">Dependency</span> dependency<span class="token punctuation">;</span>

    <span class="token annotation punctuation">@Autowired</span>
    <span class="token keyword">public</span> <span class="token class-name">ExampleService</span><span class="token punctuation">(</span><span class="token class-name">Dependency</span> dependency<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>dependency <span class="token operator">=</span> dependency<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token comment">// 其他方法</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p><strong>Setter 方法注入</strong>：通过 Setter 方法为类的成员变量设置依赖对象。</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Component</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ExampleService</span> <span class="token punctuation">{</span>
    <span class="token keyword">private</span> <span class="token class-name">Dependency</span> dependency<span class="token punctuation">;</span>

    <span class="token annotation punctuation">@Autowired</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">setDependency</span><span class="token punctuation">(</span><span class="token class-name">Dependency</span> dependency<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>dependency <span class="token operator">=</span> dependency<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token comment">// 其他方法</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p><strong>字段注入</strong>：直接在类的成员变量上使用 <code>@Autowired</code> 注解，Spring 会自动注入依赖对象。</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Component</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ExampleService</span> <span class="token punctuation">{</span>
    <span class="token annotation punctuation">@Autowired</span>
    <span class="token keyword">private</span> <span class="token class-name">Dependency</span> dependency<span class="token punctuation">;</span>

    <span class="token comment">// 其他方法</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ol>`,1),t=[c];function i(l,o){return s(),a("div",null,t)}const u=n(p,[["render",i],["__file","6.Injection method.html.vue"]]);export{u as default};
