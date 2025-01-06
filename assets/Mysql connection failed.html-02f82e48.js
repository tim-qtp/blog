import{_ as n,W as a,X as s,a2 as e}from"./framework-6a3aa88c.js";const t={},i=e(`<p>报错信息为</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>HikariPool-1 - Failed to validate connection com.mysql.cj.jdbc.ConnectionImpl@23513b4a <span class="token punctuation">(</span>No operations allowed after connection closed.<span class="token punctuation">)</span>. Possibly consider using a shorter maxLifetime value.
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>解决方法：</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">spring</span><span class="token punctuation">:</span>
  <span class="token key atrule">datasource</span><span class="token punctuation">:</span>
    <span class="token key atrule">hikari</span><span class="token punctuation">:</span>
      <span class="token key atrule">max-lifetime</span><span class="token punctuation">:</span> <span class="token number">550000</span> <span class="token comment"># 单位是毫秒（550 秒）</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,4),l=[i];function c(o,d){return a(),s("div",null,l)}const r=n(t,[["render",c],["__file","Mysql connection failed.html.vue"]]);export{r as default};