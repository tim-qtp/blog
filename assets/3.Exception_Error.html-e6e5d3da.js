import{_ as n,W as e,X as s,a2 as a}from"./framework-6a3aa88c.js";const o={},c=a(`<p>在 Java 中，<code>Exception</code> 和 <code>Error</code> 都是 <code>Throwable</code> 类的子类（只有继承了 <code>Throwable</code> 类的实例才可以被 <code>throw</code> 或者被 <code>catch</code>）。它们表示在程序运行时发生的异常或错误情况。</p><p>总结来看：<code>Exception</code> 表示<strong>可以被处理</strong>的程序异常，<code>Error</code> 表示系统级的<strong>不可恢复错误</strong>。</p><p>详细说明：</p><ol><li><strong>Exception</strong>：表示程序中可以处理的异常情况，通常是由于程序逻辑或外部环境中的问题引起的，可以通过代码进行恢复或处理。</li></ol><p>常见的子类有：<code>IOException</code>、<code>SQLException</code>、<code>NullPointerException</code>、<code>IndexOutOfBoundsException</code> 等。</p><p><code>Exception</code> 又分为 <strong>Checked Exception</strong>（编译期异常）和 <strong>Unchecked Exception</strong>（运行时异常）。</p><ul><li><strong>Checked Exception</strong>：在编译时必须进行处理（例如使用 <code>try-catch</code> 块或通过 <code>throws</code> 声明抛出），例如 <code>IOException</code>。</li><li><strong>Unchecked Exception</strong>：运行时异常，不需要显式处理，常见的如 <code>NullPointerException</code>、<code>IllegalArgumentException</code> 等，继承自 <code>RuntimeException</code>。</li></ul><ol start="2"><li><strong>Error</strong>：表示严重的错误，通常是 JVM 层次内系统级的、无法预料的错误，程序无法通过代码进行处理或恢复。例如内存耗尽（<code>OutOfMemoryError</code>）、栈溢出（<code>StackOverflowError</code>）。<code>Error</code> 不应该被程序捕获或处理，因为一般出现这种错误时，程序无法继续运行。</li></ol><p>这个解释清晰地说明了 Java 中 <code>Exception</code> 和 <code>Error</code> 的区别，强调了它们在 Java 应用程序中的角色以及如何处理它们。</p><p><strong>异常处理时需要注意的点：</strong></p><h4 id="_1-尽量不要捕获通用的异常-如-exception" tabindex="-1"><a class="header-anchor" href="#_1-尽量不要捕获通用的异常-如-exception" aria-hidden="true">#</a> 1. <strong>尽量不要捕获通用的异常（如 <code>Exception</code>）</strong></h4><ul><li>例如，只捕获 <code>IOException</code> 或 <code>SQLException</code>，而不是捕获所有类型的异常。</li></ul><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">try</span> <span class="token punctuation">{</span>
    <span class="token comment">// 执行文件操作</span>
<span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">IOException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 处理特定的IO异常</span>
<span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">Exception</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 如果真需要捕获一般异常，可以放在最后，捕获未知错误</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-logger-error-做日志保存" tabindex="-1"><a class="header-anchor" href="#_2-logger-error-做日志保存" aria-hidden="true">#</a> 2. logger.error() 做日志保存</h3><ul><li>捕获异常后，至少记录异常信息（例如日志），甚至可以重新抛出异常以便让上层调用者继续处理。</li><li><code>e.printStackTrace()</code> 只是打印，不会进行日志保存。</li></ul><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">try</span> <span class="token punctuation">{</span>
    <span class="token comment">// 执行可能抛出异常的代码</span>
<span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">IOException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 记录异常信息</span>
    logger<span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span><span class="token string">&quot;IO Error occurred&quot;</span><span class="token punctuation">,</span> e<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// 重新抛出异常或做适当处理</span>
    <span class="token keyword">throw</span> e<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,16),t=[c];function p(i,r){return e(),s("div",null,t)}const l=n(o,[["render",p],["__file","3.Exception_Error.html.vue"]]);export{l as default};
