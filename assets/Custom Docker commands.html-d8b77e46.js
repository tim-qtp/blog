import{_ as s,W as a,X as n,a2 as e}from"./framework-6a3aa88c.js";const i={},t=e(`<h2 id="🍂神领物流" tabindex="-1"><a class="header-anchor" href="#🍂神领物流" aria-hidden="true">#</a> 🍂神领物流</h2><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241227213510157.png" alt="dps" tabindex="0" loading="lazy"><figcaption>dps</figcaption></figure><p>通过dps命令可以查询上述列表，dps是自定义命令。</p><p>自定义命令方法如下：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">vim</span> ~/.bashrc

<span class="token comment">#增加如下内容</span>
<span class="token builtin class-name">alias</span> <span class="token assign-left variable">dps</span><span class="token operator">=</span><span class="token string">&#39;docker ps --format &quot;table{{.ID}}\\t{{.Names}}\\t{{.Status}}\\t{{.Ports}}&quot;&#39;</span>
<span class="token comment">#保存退出</span>

<span class="token comment">#生效</span>
<span class="token builtin class-name">source</span> ~/.bashrc
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>看起来更简洁一些。</p>`,6),c=[t];function l(o,d){return a(),n("div",null,c)}const p=s(i,[["render",l],["__file","Custom Docker commands.html.vue"]]);export{p as default};
