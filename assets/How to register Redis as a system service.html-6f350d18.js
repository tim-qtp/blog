import{_ as e,W as s,X as n,a2 as i}from"./framework-6a3aa88c.js";const a={},r=i(`<div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 安装为服务</span>
redis-server --service-install redis.windows.conf
<span class="token comment"># 启动服务</span>
redis-server --service-start 
<span class="token comment"># 停止服务</span>
redis-server --service-stop
<span class="token comment"># 卸载服务</span>
redis-server --service-uninstall
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1),c=[r];function t(d,l){return s(),n("div",null,c)}const v=e(a,[["render",t],["__file","How to register Redis as a system service.html.vue"]]);export{v as default};
