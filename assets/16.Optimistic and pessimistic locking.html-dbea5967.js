import{_ as s,W as n,X as a,a2 as e}from"./framework-6a3aa88c.js";const o={},t=e(`<p><strong>乐观锁：</strong> 顾名思义，就是很乐观，每次去拿数据的时候都认为别人不会修改，所以不会上锁，但是在更 新的时候会判断一下在此期间别人有没有去更新这个数据，可以使用版本号等机制。</p><p>乐观锁适 用于多读的应用类型，这样可以提高吞吐量，像数据库提供的类似于write_condition机制， 其实都是提供的乐观锁。在Java中java.util.concurrent.atomic包下面的原子变量类就是使用了乐观锁的一种实现方式CAS实现的。</p><p>数据库实现乐观锁的例子（版本号）：</p><div class="language-sql line-numbers-mode" data-ext="sql"><pre class="language-sql"><code><span class="token comment">-- 假设有一张用户表 users，包含 id、name 和 version 字段</span>
<span class="token comment">-- 读取数据</span>
<span class="token keyword">SELECT</span> id<span class="token punctuation">,</span> name<span class="token punctuation">,</span> version <span class="token keyword">FROM</span> users <span class="token keyword">WHERE</span> id <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span>

<span class="token comment">-- 更新数据时检查版本号</span>
<span class="token keyword">UPDATE</span> users
<span class="token keyword">SET</span> name <span class="token operator">=</span> <span class="token string">&#39;new_name&#39;</span><span class="token punctuation">,</span> version <span class="token operator">=</span> version <span class="token operator">+</span> <span class="token number">1</span>
<span class="token keyword">WHERE</span> id <span class="token operator">=</span> <span class="token number">1</span> <span class="token operator">AND</span> version <span class="token operator">=</span> current_version<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>悲观锁：</strong> 总是假设最坏的情况，每次去拿数据的时候都认为别人会修改，所以每次在拿数据的时候都会 上锁，这样别人想拿这个数据就会阻塞直到它拿到锁。</p><p>传统的关系型数据库里边就用到了很多 这种锁机制，比如行锁，表锁等，读锁，写锁等，都是在做操作之前先上锁。</p><p>再比如Java里 面的同步原语synchronized关键字的实现也是悲观锁。</p>`,7),p=[t];function i(c,r){return n(),a("div",null,p)}const d=s(o,[["render",i],["__file","16.Optimistic and pessimistic locking.html.vue"]]);export{d as default};
