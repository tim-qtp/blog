import{_ as e,W as t,X as d,a2 as n}from"./framework-6a3aa88c.js";const l={},i=n(`<p>依赖中<code>&lt;scope&gt;provided&lt;/scope&gt;</code>是什么意思？</p><p>表示该依赖在编译和测试阶段可用，但在运行时由运行环境（如应用服务器或容器）提供，因此不会被打包到最终的可部署单元中。</p><p><strong>实际示例：</strong></p><p>假设我们在开发一个需要使用 Servlet API 的 Web 应用程序。由于 Servlet API 通常由 Web 容器（如 Tomcat）提供，因此我们可以在 <code>pom.xml</code> 中将其依赖范围设置为 <code>provided</code>：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>&lt;dependency&gt;
    &lt;groupId&gt;javax.servlet&lt;/groupId&gt;
    &lt;artifactId&gt;javax.servlet-api&lt;/artifactId&gt;
    &lt;version&gt;4.0.1&lt;/version&gt;
    &lt;scope&gt;provided&lt;/scope&gt;
&lt;/dependency&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,5),s=[i];function c(o,r){return t(),d("div",null,s)}const v=e(l,[["render",c],["__file","2.provided.html.vue"]]);export{v as default};
