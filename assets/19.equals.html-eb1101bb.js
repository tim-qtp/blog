import{_ as n,W as s,X as a,a2 as e}from"./framework-6a3aa88c.js";const o={},p=e(`<p>①、==：用于比较两个对象的引用，即它们是否指向同一个对象实例。</p><p>对于基本数据类型（如 <code>int</code>, <code>double</code>, <code>char</code> 等），<code>==</code> 比较的是值是否相等。</p><p>②、<strong>equals() 方法</strong>：用于比较两个对象的内容是否相等。默认情况下，<code>equals()</code> 方法的行为与 <code>==</code> 相同，即比较对象引用，如在超类 Object 中：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">boolean</span> <span class="token function">equals</span><span class="token punctuation">(</span><span class="token class-name">Object</span> obj<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token punctuation">(</span><span class="token keyword">this</span> <span class="token operator">==</span> obj<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然而，<code>equals()</code> 方法通常被各种类重写。例如，<code>String</code> 类重写了 <code>equals()</code> 方法，以便它可以比较两个字符串的字符内容是否完全一样。</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/javase-20240425093626.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>举个例子：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token class-name">String</span> a <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">String</span><span class="token punctuation">(</span><span class="token string">&quot;沉默王二&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token class-name">String</span> b <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">String</span><span class="token punctuation">(</span><span class="token string">&quot;沉默王二&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// 使用 == 比较</span>
<span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>a <span class="token operator">==</span> b<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 输出 false，因为 a 和 b 引用不同的对象</span>

<span class="token comment">// 使用 equals() 比较</span>
<span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>a<span class="token punctuation">.</span><span class="token function">equals</span><span class="token punctuation">(</span>b<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 输出 true，因为 a 和 b 的内容相同</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>那为什么重写 equals 时必须重写 hashCode ⽅法？</strong></p><p>因为只有两个对象通过 <code>equals()</code> 判断为相等时，返回相同的 <code>hashCode()</code> 值，这样才能在哈希表等数据结构中正确地存储和查找这些对象。</p><p>当我们重写 <code>equals()</code> 方法时，通常目的是让两个<strong>逻辑上相等</strong>的对象返回 <code>true</code>。例如，假设有个 <code>Person</code> 类，我们认为两个名字相同的人是相等的，即使它们不是同一个实例（内存地址不同）：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Person</span> <span class="token punctuation">{</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> name<span class="token punctuation">;</span>
    
    <span class="token keyword">public</span> <span class="token class-name">Person</span><span class="token punctuation">(</span><span class="token class-name">String</span> name<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>name <span class="token operator">=</span> name<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    
    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">boolean</span> <span class="token function">equals</span><span class="token punctuation">(</span><span class="token class-name">Object</span> obj<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span> <span class="token operator">==</span> obj<span class="token punctuation">)</span> <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>obj <span class="token operator">==</span> <span class="token keyword">null</span> <span class="token operator">||</span> <span class="token function">getClass</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">!=</span> obj<span class="token punctuation">.</span><span class="token function">getClass</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token keyword">return</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
        <span class="token class-name">Person</span> other <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token class-name">Person</span><span class="token punctuation">)</span> obj<span class="token punctuation">;</span>
        <span class="token keyword">return</span> name<span class="token punctuation">.</span><span class="token function">equals</span><span class="token punctuation">(</span>other<span class="token punctuation">.</span>name<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    
    <span class="token comment">// 如果不重写 hashCode，就使用 Object 类的 hashCode，</span>
    <span class="token comment">// 那么不同实例的 Person 对象会有不同的 hashCode，即使它们名字相同</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在这个例子中，如果只重写了 <code>equals()</code> 而没有重写 <code>hashCode()</code>，那么虽然两个名字相同的 <code>Person</code> 对象 <code>equals()</code> 返回 <code>true</code>，但它们的 <code>hashCode()</code> 却可能不相同（因为默认的 <code>hashCode()</code> 是基于内存地址），而存入不同的桶中，这是不对的！</p><p>导致：</p><ul><li><strong>查找失败</strong>：例如，在 <code>HashSet</code> 中用 <code>contains()</code> 查找时，会先通过 <code>hashCode()</code> 定位到桶，如果桶不相同，即使 <code>equals()</code> 返回 <code>true</code>，集合也找不到这个对象。</li><li><strong>重复存储</strong>：同样逻辑相等的对象可能会被认为是不同的，从而重复存储。</li></ul>`,15),t=[p];function c(l,i){return s(),a("div",null,t)}const d=n(o,[["render",c],["__file","19.equals.html.vue"]]);export{d as default};
