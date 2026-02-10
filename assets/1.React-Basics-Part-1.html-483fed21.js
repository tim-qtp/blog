import{_ as t,W as e,X as o,$ as n,a0 as s,Z as c,a2 as a,D as l}from"./framework-28eb7fba.js";const i={},r=a(`<h2 id="react介绍" tabindex="-1"><a class="header-anchor" href="#react介绍" aria-hidden="true">#</a> React介绍</h2><p>React由Meta公司开发，是一个用于 构建Web和原生交互界面的库 <img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/01.png" alt="" loading="lazy"></p><h3 id="react的优势" tabindex="-1"><a class="header-anchor" href="#react的优势" aria-hidden="true">#</a> React的优势</h3><p>相较于传统基于DOM开发的优势</p><ol><li>组件化的开发方式</li><li>不错的性能</li></ol><p>相较于其它前端框架的优势</p><ol><li>丰富的生态</li><li>跨平台支持</li></ol><h3 id="react的市场情况" tabindex="-1"><a class="header-anchor" href="#react的市场情况" aria-hidden="true">#</a> React的市场情况</h3><p>全球最流行，大厂必备 <img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/02.png" style="zoom:50%;"></p><h2 id="开发环境创建" tabindex="-1"><a class="header-anchor" href="#开发环境创建" aria-hidden="true">#</a> 开发环境创建</h2><p>create-react-app是一个快速创建React开发环境的工具，底层由Webpack构件，封装了配置细节，开箱即用 执行命令：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>npx create-react-app react-basic
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,12),u={class:"hint-container warning"},k=n("p",{class:"hint-container-title"},"注意",-1),d=n("p",null,"创建 React 项目的更多方式",-1),v={href:"https://zh-hans.react.dev/learn/start-a-new-react-project",target:"_blank",rel:"noopener noreferrer"},m=a(`<p>根组件</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">//index.js</span>
<span class="token keyword">import</span> React <span class="token keyword">from</span> <span class="token string">&#39;react&#39;</span>
<span class="token keyword">import</span> ReactDOM <span class="token keyword">from</span> <span class="token string">&#39;react-dom/client&#39;</span>
<span class="token comment">// 导入项目的根组件</span>
<span class="token keyword">import</span> App <span class="token keyword">from</span> <span class="token string">&#39;./App&#39;</span>
<span class="token comment">// 把App根组件渲染到id为root的dom节点上</span>
<span class="token keyword">const</span> root <span class="token operator">=</span> ReactDOM<span class="token punctuation">.</span><span class="token function">createRoot</span><span class="token punctuation">(</span>document<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">&#39;root&#39;</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
root<span class="token punctuation">.</span><span class="token function">render</span><span class="token punctuation">(</span><span class="token operator">&lt;</span>App <span class="token operator">/</span><span class="token operator">&gt;</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">//App.js</span>
<span class="token comment">// 项目的根组件</span>
<span class="token comment">//App-&gt; index.js -&gt; public/index.html(root)</span>
<span class="token keyword">function</span> <span class="token function">App</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token punctuation">(</span>
  <span class="token operator">&lt;</span>div className<span class="token operator">=</span><span class="token string">&quot;App&quot;</span><span class="token operator">&gt;</span> 
      <span class="token keyword">this</span> one is a app 
  <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">&gt;</span>
  <span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token keyword">export</span> <span class="token keyword">default</span> App
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>App-&gt; index.js -&gt; public/index.html(root)</strong></p><h2 id="jsx基础" tabindex="-1"><a class="header-anchor" href="#jsx基础" aria-hidden="true">#</a> JSX基础</h2><h3 id="什么是jsx" tabindex="-1"><a class="header-anchor" href="#什么是jsx" aria-hidden="true">#</a> 什么是JSX</h3><blockquote><p>概念：JSX是JavaScript和XMl(HTML)的缩写，表示在JS代码中编写HTML模版结构，它是React中构建UI的方式</p></blockquote><div class="language-jsx line-numbers-mode" data-ext="jsx"><pre class="language-jsx"><code><span class="token keyword">const</span> message <span class="token operator">=</span> <span class="token string">&#39;this is message&#39;</span>

<span class="token keyword">function</span> <span class="token function">App</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token punctuation">(</span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>h1</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">this is title</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>h1</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token punctuation">{</span>message<span class="token punctuation">}</span><span class="token plain-text">
    </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
  <span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>root<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>优势：</p><ol><li><mark>HTML的声明式模版写法</mark></li><li><mark>JavaScript的可编程能力</mark></li></ol><h3 id="jsx的本质" tabindex="-1"><a class="header-anchor" href="#jsx的本质" aria-hidden="true">#</a> JSX的本质</h3><blockquote><p>JSX并不是标准的JS语法，它是JS的语法扩展，浏览器本身不能识别，需要通过<mark>解析工具</mark>做解析之后才能在浏览器中使用</p></blockquote><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/03.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="jsx高频场景-js表达式" tabindex="-1"><a class="header-anchor" href="#jsx高频场景-js表达式" aria-hidden="true">#</a> JSX高频场景-JS表达式</h3><blockquote><p>在JSX中可以通过 <code>大括号语法{}</code> <mark>识别</mark>JavaScript中的表达式，比如常见的变量、函数调用、方法调用等等</p></blockquote><ol><li>使用引号传递字符串</li><li>使用JS变量</li><li>函数调用和方法调用</li><li>使用JavaScript对象<div class="hint-container warning"><p class="hint-container-title">注意</p><p>注意：if语句、switch语句、变量声明不属于表达式，不能出现在{}中</p></div></li></ol><div class="language-jsx line-numbers-mode" data-ext="jsx"><pre class="language-jsx"><code><span class="token keyword">const</span> message <span class="token operator">=</span> <span class="token string">&#39;this is message&#39;</span>

<span class="token keyword">function</span> <span class="token function">getAge</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token number">18</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">App</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token punctuation">(</span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>h1</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">this is title</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>h1</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token punctuation">{</span><span class="token comment">/* 字符串识别 */</span><span class="token punctuation">}</span><span class="token plain-text">
      </span><span class="token punctuation">{</span><span class="token string">&#39;this is str&#39;</span><span class="token punctuation">}</span><span class="token plain-text">
      </span><span class="token punctuation">{</span><span class="token comment">/* 变量识别 */</span><span class="token punctuation">}</span><span class="token plain-text">
      </span><span class="token punctuation">{</span>message<span class="token punctuation">}</span><span class="token plain-text">
      </span><span class="token punctuation">{</span><span class="token comment">/* 函数调用 渲染为函数的返回值 */</span><span class="token punctuation">}</span><span class="token plain-text">
      </span><span class="token punctuation">{</span><span class="token function">getAge</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">}</span><span class="token plain-text">
      </span><span class="token punctuation">{</span><span class="token comment">/*使用js对象*/</span><span class="token punctuation">}</span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">style</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span><span class="token punctuation">{</span><span class="token literal-property property">color</span><span class="token operator">:</span><span class="token string">&#39;red&#39;</span><span class="token punctuation">}</span><span class="token punctuation">}</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">this is div</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
    </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
  <span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="jsx高频场景-列表渲染" tabindex="-1"><a class="header-anchor" href="#jsx高频场景-列表渲染" aria-hidden="true">#</a> JSX高频场景-列表渲染</h3><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/04.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><blockquote><p>在JSX中可以使用原生js种的<code>map方法</code> 实现列表渲染</p></blockquote><div class="language-jsx line-numbers-mode" data-ext="jsx"><pre class="language-jsx"><code><span class="token keyword">const</span> list <span class="token operator">=</span> <span class="token punctuation">[</span>
  <span class="token punctuation">{</span><span class="token literal-property property">id</span><span class="token operator">:</span><span class="token number">1001</span><span class="token punctuation">,</span> <span class="token literal-property property">name</span><span class="token operator">:</span><span class="token string">&#39;Vue&#39;</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">{</span><span class="token literal-property property">id</span><span class="token operator">:</span><span class="token number">1002</span><span class="token punctuation">,</span> <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">&#39;React&#39;</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">{</span><span class="token literal-property property">id</span><span class="token operator">:</span><span class="token number">1003</span><span class="token punctuation">,</span> <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">&#39;Angular&#39;</span><span class="token punctuation">}</span>
<span class="token punctuation">]</span>

<span class="token keyword">function</span> <span class="token function">App</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token punctuation">(</span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>ul</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      // 这里需要绑定一个key
      </span><span class="token punctuation">{</span>list<span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token parameter">item</span><span class="token operator">=&gt;</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span> <span class="token attr-name">key</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>item<span class="token punctuation">.</span>id<span class="token punctuation">}</span></span><span class="token punctuation">&gt;</span></span><span class="token punctuation">{</span>item<span class="token punctuation">.</span>name<span class="token punctuation">}</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">)</span><span class="token punctuation">}</span><span class="token plain-text">
    </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>ul</span><span class="token punctuation">&gt;</span></span>
  <span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="jsx高频场景-条件渲染" tabindex="-1"><a class="header-anchor" href="#jsx高频场景-条件渲染" aria-hidden="true">#</a> JSX高频场景-条件渲染</h3><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/05.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><blockquote><p>在React中，可以通过逻辑与运算符&amp;&amp;、三元表达式(?😃 实现基础的条件渲染</p></blockquote><div class="language-jsx line-numbers-mode" data-ext="jsx"><pre class="language-jsx"><code><span class="token keyword">const</span> flag <span class="token operator">=</span> <span class="token boolean">true</span>
<span class="token keyword">const</span> loading <span class="token operator">=</span> <span class="token boolean">false</span>

<span class="token keyword">function</span> <span class="token function">App</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token punctuation">(</span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token punctuation">{</span>flag <span class="token operator">&amp;&amp;</span> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>span</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">this is span</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>span</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">}</span><span class="token plain-text">
      </span><span class="token punctuation">{</span>loading <span class="token operator">?</span> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>span</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">loading...</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>span</span><span class="token punctuation">&gt;</span></span><span class="token operator">:</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>span</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">this is span</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>span</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">}</span><span class="token plain-text">
    </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span></span><span class="token punctuation">&gt;</span></span>
  <span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="jsx高频场景-复杂条件渲染" tabindex="-1"><a class="header-anchor" href="#jsx高频场景-复杂条件渲染" aria-hidden="true">#</a> JSX高频场景-复杂条件渲染</h3><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/06.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><blockquote><p>需求：列表中需要根据文章的状态适配 解决方案：自定义函数 + 判断语句</p></blockquote><div class="language-jsx line-numbers-mode" data-ext="jsx"><pre class="language-jsx"><code><span class="token keyword">const</span> type <span class="token operator">=</span> <span class="token number">1</span>  <span class="token comment">// 0|1|3</span>

<span class="token keyword">function</span> <span class="token function">getArticleJSX</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
  <span class="token keyword">if</span><span class="token punctuation">(</span>type <span class="token operator">===</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">无图模式模版</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
  <span class="token punctuation">}</span><span class="token keyword">else</span> <span class="token keyword">if</span><span class="token punctuation">(</span>type <span class="token operator">===</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">单图模式模版</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
  <span class="token punctuation">}</span><span class="token keyword">else</span><span class="token punctuation">(</span>type <span class="token operator">===</span> <span class="token number">3</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">三图模式模版</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">App</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token punctuation">(</span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token punctuation">{</span> <span class="token function">getArticleJSX</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">}</span><span class="token plain-text">
    </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span></span><span class="token punctuation">&gt;</span></span>
  <span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="react的事件绑定" tabindex="-1"><a class="header-anchor" href="#react的事件绑定" aria-hidden="true">#</a> React的事件绑定</h2><h3 id="基础实现" tabindex="-1"><a class="header-anchor" href="#基础实现" aria-hidden="true">#</a> 基础实现</h3><blockquote><p>React中的事件绑定，通过语法 <code>on + 事件名称 = { 事件处理程序 }</code>，整体上遵循驼峰命名法</p></blockquote><div class="language-jsx line-numbers-mode" data-ext="jsx"><pre class="language-jsx"><code><span class="token keyword">function</span> <span class="token function">App</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>  
  <span class="token keyword">const</span> <span class="token function-variable function">clickHandler</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">=&gt;</span><span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;button按钮点击了&#39;</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> <span class="token punctuation">(</span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">onClick</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>clickHandler<span class="token punctuation">}</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">click me</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
  <span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="使用事件参数" tabindex="-1"><a class="header-anchor" href="#使用事件参数" aria-hidden="true">#</a> 使用事件参数</h3><blockquote><p>在事件回调函数中设置形参e即可</p></blockquote><div class="language-jsx line-numbers-mode" data-ext="jsx"><pre class="language-jsx"><code><span class="token keyword">function</span> <span class="token function">App</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
  <span class="token keyword">const</span> <span class="token function-variable function">clickHandler</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">e</span><span class="token punctuation">)</span><span class="token operator">=&gt;</span><span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;button按钮点击了&#39;</span><span class="token punctuation">,</span> e<span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> <span class="token punctuation">(</span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">onClick</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>clickHandler<span class="token punctuation">}</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">click me</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
  <span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="传递自定义参数" tabindex="-1"><a class="header-anchor" href="#传递自定义参数" aria-hidden="true">#</a> 传递自定义参数</h3><blockquote><p>语法：事件绑定的位置改造成箭头函数的写法，在执行clickHandler实际处理业务函数的时候传递实参</p></blockquote><div class="language-jsx line-numbers-mode" data-ext="jsx"><pre class="language-jsx"><code><span class="token keyword">function</span> <span class="token function">App</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
  <span class="token keyword">const</span> <span class="token function-variable function">clickHandler</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">name</span><span class="token punctuation">)</span><span class="token operator">=&gt;</span><span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;button按钮点击了&#39;</span><span class="token punctuation">,</span> name<span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> <span class="token punctuation">(</span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">onClick</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">=&gt;</span><span class="token function">clickHandler</span><span class="token punctuation">(</span><span class="token string">&#39;jack&#39;</span><span class="token punctuation">)</span><span class="token punctuation">}</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">click me</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
  <span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container warning"><p class="hint-container-title">注意</p><p>注意：不能直接写函数调用，这里事件绑定需要一个函数引用</p></div><h3 id="同时传递事件对象和自定义参数" tabindex="-1"><a class="header-anchor" href="#同时传递事件对象和自定义参数" aria-hidden="true">#</a> 同时传递事件对象和自定义参数</h3><blockquote><p>语法：在事件绑定的位置传递事件实参e和自定义参数，clickHandler中声明形参，注意顺序对应</p></blockquote><div class="language-jsx line-numbers-mode" data-ext="jsx"><pre class="language-jsx"><code><span class="token keyword">function</span> <span class="token function">App</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
  <span class="token keyword">const</span> <span class="token function-variable function">clickHandler</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">name<span class="token punctuation">,</span>e</span><span class="token punctuation">)</span><span class="token operator">=&gt;</span><span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;button按钮点击了&#39;</span><span class="token punctuation">,</span> name<span class="token punctuation">,</span>e<span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> <span class="token punctuation">(</span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">onClick</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span><span class="token punctuation">(</span><span class="token parameter">e</span><span class="token punctuation">)</span><span class="token operator">=&gt;</span><span class="token function">clickHandler</span><span class="token punctuation">(</span><span class="token string">&#39;jack&#39;</span><span class="token punctuation">,</span>e<span class="token punctuation">)</span><span class="token punctuation">}</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">click me</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
  <span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="react组件基础使用" tabindex="-1"><a class="header-anchor" href="#react组件基础使用" aria-hidden="true">#</a> React组件基础使用</h2><h3 id="组件是什么" tabindex="-1"><a class="header-anchor" href="#组件是什么" aria-hidden="true">#</a> 组件是什么</h3><p>概念：一个组件就是一个用户界面的一部分，它可以有自己的逻辑和外观，组件之间可以互相嵌套，也可以服用多次 <img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/07.png" alt="" loading="lazy"></p><h3 id="组件基础使用" tabindex="-1"><a class="header-anchor" href="#组件基础使用" aria-hidden="true">#</a> 组件基础使用</h3><blockquote><p>在React中，一个组件就是<strong>首字母大写的函数</strong>，内部存放了组件的逻辑和视图UI, 渲染组件只需要把组件当成标签书写即可</p></blockquote><div class="language-jsx line-numbers-mode" data-ext="jsx"><pre class="language-jsx"><code><span class="token comment">// 1. 定义组件</span>
<span class="token comment">// 函数组件</span>
<span class="token keyword">function</span> <span class="token function">Button</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">click me mbti</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
<span class="token punctuation">}</span>
<span class="token comment">// 箭头函数组件</span>
<span class="token keyword">const</span> <span class="token function-variable function">Button</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">=&gt;</span><span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">click me ai</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
<span class="token punctuation">}</span>

<span class="token comment">// 2. 使用组件</span>
<span class="token keyword">function</span> <span class="token function">App</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token punctuation">(</span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token punctuation">{</span><span class="token comment">/* 自闭和 */</span><span class="token punctuation">}</span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span><span class="token class-name">Button</span></span><span class="token punctuation">/&gt;</span></span><span class="token plain-text">
      </span><span class="token punctuation">{</span><span class="token comment">/* 成对标签 */</span><span class="token punctuation">}</span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span><span class="token class-name">Button</span></span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span><span class="token class-name">Button</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
    </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
  <span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="组件状态管理-usestate" tabindex="-1"><a class="header-anchor" href="#组件状态管理-usestate" aria-hidden="true">#</a> 组件状态管理-useState</h2><h3 id="基础使用" tabindex="-1"><a class="header-anchor" href="#基础使用" aria-hidden="true">#</a> 基础使用</h3><blockquote><p>useState 是一个 React Hook（函数），它允许我们向组件添加一个<code>状态变量</code>, 从而控制影响组件的渲染结果 和普通JS变量不同的是，状态变量一旦发生变化组件的视图UI也会跟着变化（数据驱动视图）</p></blockquote><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/08.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><div class="language-jsx line-numbers-mode" data-ext="jsx"><pre class="language-jsx"><code><span class="token keyword">function</span> <span class="token function">App</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
  <span class="token keyword">const</span> <span class="token punctuation">[</span> count<span class="token punctuation">,</span> setCount <span class="token punctuation">]</span> <span class="token operator">=</span> React<span class="token punctuation">.</span><span class="token function">useState</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span>
  <span class="token keyword">return</span> <span class="token punctuation">(</span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">onClick</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">=&gt;</span><span class="token function">setCount</span><span class="token punctuation">(</span>count<span class="token operator">+</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">}</span></span><span class="token punctuation">&gt;</span></span><span class="token punctuation">{</span> count <span class="token punctuation">}</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
    </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
  <span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="状态的修改规则" tabindex="-1"><a class="header-anchor" href="#状态的修改规则" aria-hidden="true">#</a> 状态的修改规则</h3><blockquote><p>在React中状态被认为是只读的，应该始终<code>替换它而不是修改它</code>, 直接修改状态不能引发视图更新</p></blockquote><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/09.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="修改对象状态" tabindex="-1"><a class="header-anchor" href="#修改对象状态" aria-hidden="true">#</a> 修改对象状态</h3><blockquote><p>对于对象类型的状态变量，应该始终给set方法一个<code>全新的对象</code> 来进行修改</p></blockquote><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/10.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h2 id="组件的基础样式处理" tabindex="-1"><a class="header-anchor" href="#组件的基础样式处理" aria-hidden="true">#</a> 组件的基础样式处理</h2><blockquote><p>React组件基础的样式控制有俩种方式，行内样式和class类名控制</p></blockquote><div class="language-jsx line-numbers-mode" data-ext="jsx"><pre class="language-jsx"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">style</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span><span class="token punctuation">{</span> <span class="token literal-property property">color</span><span class="token operator">:</span><span class="token string">&#39;red&#39;</span><span class="token punctuation">}</span><span class="token punctuation">}</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">this is div</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><div class="language-css line-numbers-mode" data-ext="css"><pre class="language-css"><code><span class="token selector">.foo</span><span class="token punctuation">{</span>
  <span class="token property">color</span><span class="token punctuation">:</span> red<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-jsx line-numbers-mode" data-ext="jsx"><pre class="language-jsx"><code><span class="token keyword">import</span> <span class="token string">&#39;./index.css&#39;</span>

<span class="token keyword">function</span> <span class="token function">App</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token punctuation">(</span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>span</span> <span class="token attr-name">className</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>foo<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">this is span</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>span</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
    </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
  <span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20250223150236639.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h2 id="b站评论案例" tabindex="-1"><a class="header-anchor" href="#b站评论案例" aria-hidden="true">#</a> B站评论案例</h2><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/11.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><ol><li>渲染评论列表</li><li>删除评论实现</li><li>渲染导航Tab和高亮实现</li><li>评论列表排序功能实现</li></ol><details class="hint-container details"><summary>基础模板</summary><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> useState <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;react&#39;</span>
<span class="token keyword">import</span> <span class="token string">&#39;./App.scss&#39;</span>
<span class="token keyword">import</span> avatar <span class="token keyword">from</span> <span class="token string">&#39;./images/bozai.png&#39;</span>

<span class="token doc-comment comment">/**
 * 评论列表的渲染和操作
 *
 * 1. 根据状态渲染评论列表
 * 2. 删除评论
 */</span>

<span class="token comment">// 评论列表数据</span>
<span class="token keyword">const</span> defaultList <span class="token operator">=</span> <span class="token punctuation">[</span>
  <span class="token punctuation">{</span>
    <span class="token comment">// 评论id</span>
    <span class="token literal-property property">rpid</span><span class="token operator">:</span> <span class="token number">3</span><span class="token punctuation">,</span>
    <span class="token comment">// 用户信息</span>
    <span class="token literal-property property">user</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">uid</span><span class="token operator">:</span> <span class="token string">&#39;13258165&#39;</span><span class="token punctuation">,</span>
      <span class="token literal-property property">avatar</span><span class="token operator">:</span> <span class="token string">&#39;&#39;</span><span class="token punctuation">,</span>
      <span class="token literal-property property">uname</span><span class="token operator">:</span> <span class="token string">&#39;周杰伦&#39;</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token comment">// 评论内容</span>
    <span class="token literal-property property">content</span><span class="token operator">:</span> <span class="token string">&#39;哎哟，不错哦&#39;</span><span class="token punctuation">,</span>
    <span class="token comment">// 评论时间</span>
    <span class="token literal-property property">ctime</span><span class="token operator">:</span> <span class="token string">&#39;10-18 08:15&#39;</span><span class="token punctuation">,</span>
    <span class="token literal-property property">like</span><span class="token operator">:</span> <span class="token number">88</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">{</span>
    <span class="token literal-property property">rpid</span><span class="token operator">:</span> <span class="token number">2</span><span class="token punctuation">,</span>
    <span class="token literal-property property">user</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">uid</span><span class="token operator">:</span> <span class="token string">&#39;36080105&#39;</span><span class="token punctuation">,</span>
      <span class="token literal-property property">avatar</span><span class="token operator">:</span> <span class="token string">&#39;&#39;</span><span class="token punctuation">,</span>
      <span class="token literal-property property">uname</span><span class="token operator">:</span> <span class="token string">&#39;许嵩&#39;</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token literal-property property">content</span><span class="token operator">:</span> <span class="token string">&#39;我寻你千百度 日出到迟暮&#39;</span><span class="token punctuation">,</span>
    <span class="token literal-property property">ctime</span><span class="token operator">:</span> <span class="token string">&#39;11-13 11:29&#39;</span><span class="token punctuation">,</span>
    <span class="token literal-property property">like</span><span class="token operator">:</span> <span class="token number">88</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">{</span>
    <span class="token literal-property property">rpid</span><span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span>
    <span class="token literal-property property">user</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">uid</span><span class="token operator">:</span> <span class="token string">&#39;30009257&#39;</span><span class="token punctuation">,</span>
      avatar<span class="token punctuation">,</span>
      <span class="token literal-property property">uname</span><span class="token operator">:</span> <span class="token string">&#39;黑马前端&#39;</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token literal-property property">content</span><span class="token operator">:</span> <span class="token string">&#39;学前端就来黑马&#39;</span><span class="token punctuation">,</span>
    <span class="token literal-property property">ctime</span><span class="token operator">:</span> <span class="token string">&#39;10-19 09:00&#39;</span><span class="token punctuation">,</span>
    <span class="token literal-property property">like</span><span class="token operator">:</span> <span class="token number">66</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">]</span>
<span class="token comment">// 当前登录用户信息</span>
<span class="token keyword">const</span> user <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token comment">// 用户id</span>
  <span class="token literal-property property">uid</span><span class="token operator">:</span> <span class="token string">&#39;30009257&#39;</span><span class="token punctuation">,</span>
  <span class="token comment">// 用户头像</span>
  avatar<span class="token punctuation">,</span>
  <span class="token comment">// 用户昵称</span>
  <span class="token literal-property property">uname</span><span class="token operator">:</span> <span class="token string">&#39;黑马前端&#39;</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 导航 Tab 的渲染和操作
 *
 * 1. 渲染导航 Tab 和高亮
 * 2. 评论列表排序
 *  最热 =&gt; 喜欢数量降序
 *  最新 =&gt; 创建时间降序
 */</span>

<span class="token comment">// 导航 Tab 数组</span>
<span class="token keyword">const</span> tabs <span class="token operator">=</span> <span class="token punctuation">[</span>
  <span class="token punctuation">{</span> <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">&#39;hot&#39;</span><span class="token punctuation">,</span> <span class="token literal-property property">text</span><span class="token operator">:</span> <span class="token string">&#39;最热&#39;</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">{</span> <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">&#39;time&#39;</span><span class="token punctuation">,</span> <span class="token literal-property property">text</span><span class="token operator">:</span> <span class="token string">&#39;最新&#39;</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">]</span>

<span class="token keyword">const</span> <span class="token function-variable function">App</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token punctuation">(</span>
    <span class="token operator">&lt;</span>div className<span class="token operator">=</span><span class="token string">&quot;app&quot;</span><span class="token operator">&gt;</span>
      <span class="token punctuation">{</span><span class="token comment">/* 导航 Tab */</span><span class="token punctuation">}</span>
      <span class="token operator">&lt;</span>div className<span class="token operator">=</span><span class="token string">&quot;reply-navigation&quot;</span><span class="token operator">&gt;</span>
        <span class="token operator">&lt;</span>ul className<span class="token operator">=</span><span class="token string">&quot;nav-bar&quot;</span><span class="token operator">&gt;</span>
          <span class="token operator">&lt;</span>li className<span class="token operator">=</span><span class="token string">&quot;nav-title&quot;</span><span class="token operator">&gt;</span>
            <span class="token operator">&lt;</span>span className<span class="token operator">=</span><span class="token string">&quot;nav-title-text&quot;</span><span class="token operator">&gt;</span>评论<span class="token operator">&lt;</span><span class="token operator">/</span>span<span class="token operator">&gt;</span>
            <span class="token punctuation">{</span><span class="token comment">/* 评论数量 */</span><span class="token punctuation">}</span>
            <span class="token operator">&lt;</span>span className<span class="token operator">=</span><span class="token string">&quot;total-reply&quot;</span><span class="token operator">&gt;</span><span class="token punctuation">{</span><span class="token number">10</span><span class="token punctuation">}</span><span class="token operator">&lt;</span><span class="token operator">/</span>span<span class="token operator">&gt;</span>
          <span class="token operator">&lt;</span><span class="token operator">/</span>li<span class="token operator">&gt;</span>
          <span class="token operator">&lt;</span>li className<span class="token operator">=</span><span class="token string">&quot;nav-sort&quot;</span><span class="token operator">&gt;</span>
            <span class="token punctuation">{</span><span class="token comment">/* 高亮类名： active */</span><span class="token punctuation">}</span>
            <span class="token operator">&lt;</span>span className<span class="token operator">=</span><span class="token string">&#39;nav-item&#39;</span><span class="token operator">&gt;</span>最新<span class="token operator">&lt;</span><span class="token operator">/</span>span<span class="token operator">&gt;</span>
            <span class="token operator">&lt;</span>span className<span class="token operator">=</span><span class="token string">&#39;nav-item&#39;</span><span class="token operator">&gt;</span>最热<span class="token operator">&lt;</span><span class="token operator">/</span>span<span class="token operator">&gt;</span>
          <span class="token operator">&lt;</span><span class="token operator">/</span>li<span class="token operator">&gt;</span>
        <span class="token operator">&lt;</span><span class="token operator">/</span>ul<span class="token operator">&gt;</span>
      <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">&gt;</span>

      <span class="token operator">&lt;</span>div className<span class="token operator">=</span><span class="token string">&quot;reply-wrap&quot;</span><span class="token operator">&gt;</span>
        <span class="token punctuation">{</span><span class="token comment">/* 发表评论 */</span><span class="token punctuation">}</span>
        <span class="token operator">&lt;</span>div className<span class="token operator">=</span><span class="token string">&quot;box-normal&quot;</span><span class="token operator">&gt;</span>
          <span class="token punctuation">{</span><span class="token comment">/* 当前用户头像 */</span><span class="token punctuation">}</span>
          <span class="token operator">&lt;</span>div className<span class="token operator">=</span><span class="token string">&quot;reply-box-avatar&quot;</span><span class="token operator">&gt;</span>
            <span class="token operator">&lt;</span>div className<span class="token operator">=</span><span class="token string">&quot;bili-avatar&quot;</span><span class="token operator">&gt;</span>
              <span class="token operator">&lt;</span>img className<span class="token operator">=</span><span class="token string">&quot;bili-avatar-img&quot;</span> src<span class="token operator">=</span><span class="token punctuation">{</span>avatar<span class="token punctuation">}</span> alt<span class="token operator">=</span><span class="token string">&quot;用户头像&quot;</span> <span class="token operator">/</span><span class="token operator">&gt;</span>
            <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">&gt;</span>
          <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">&gt;</span>
          <span class="token operator">&lt;</span>div className<span class="token operator">=</span><span class="token string">&quot;reply-box-wrap&quot;</span><span class="token operator">&gt;</span>
            <span class="token punctuation">{</span><span class="token comment">/* 评论框 */</span><span class="token punctuation">}</span>
            <span class="token operator">&lt;</span>textarea
              className<span class="token operator">=</span><span class="token string">&quot;reply-box-textarea&quot;</span>
              placeholder<span class="token operator">=</span><span class="token string">&quot;发一条友善的评论&quot;</span>
            <span class="token operator">/</span><span class="token operator">&gt;</span>
            <span class="token punctuation">{</span><span class="token comment">/* 发布按钮 */</span><span class="token punctuation">}</span>
            <span class="token operator">&lt;</span>div className<span class="token operator">=</span><span class="token string">&quot;reply-box-send&quot;</span><span class="token operator">&gt;</span>
              <span class="token operator">&lt;</span>div className<span class="token operator">=</span><span class="token string">&quot;send-text&quot;</span><span class="token operator">&gt;</span>发布<span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">&gt;</span>
            <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">&gt;</span>
          <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">&gt;</span>
        <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">&gt;</span>
        <span class="token punctuation">{</span><span class="token comment">/* 评论列表 */</span><span class="token punctuation">}</span>
        <span class="token operator">&lt;</span>div className<span class="token operator">=</span><span class="token string">&quot;reply-list&quot;</span><span class="token operator">&gt;</span>
          <span class="token punctuation">{</span><span class="token comment">/* 评论项 */</span><span class="token punctuation">}</span>
          <span class="token operator">&lt;</span>div className<span class="token operator">=</span><span class="token string">&quot;reply-item&quot;</span><span class="token operator">&gt;</span>
            <span class="token punctuation">{</span><span class="token comment">/* 头像 */</span><span class="token punctuation">}</span>
            <span class="token operator">&lt;</span>div className<span class="token operator">=</span><span class="token string">&quot;root-reply-avatar&quot;</span><span class="token operator">&gt;</span>
              <span class="token operator">&lt;</span>div className<span class="token operator">=</span><span class="token string">&quot;bili-avatar&quot;</span><span class="token operator">&gt;</span>
                <span class="token operator">&lt;</span>img
                  className<span class="token operator">=</span><span class="token string">&quot;bili-avatar-img&quot;</span>
                  alt<span class="token operator">=</span><span class="token string">&quot;&quot;</span>
                <span class="token operator">/</span><span class="token operator">&gt;</span>
              <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">&gt;</span>
            <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">&gt;</span>

            <span class="token operator">&lt;</span>div className<span class="token operator">=</span><span class="token string">&quot;content-wrap&quot;</span><span class="token operator">&gt;</span>
              <span class="token punctuation">{</span><span class="token comment">/* 用户名 */</span><span class="token punctuation">}</span>
              <span class="token operator">&lt;</span>div className<span class="token operator">=</span><span class="token string">&quot;user-info&quot;</span><span class="token operator">&gt;</span>
                <span class="token operator">&lt;</span>div className<span class="token operator">=</span><span class="token string">&quot;user-name&quot;</span><span class="token operator">&gt;</span>jack<span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">&gt;</span>
              <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">&gt;</span>
              <span class="token punctuation">{</span><span class="token comment">/* 评论内容 */</span><span class="token punctuation">}</span>
              <span class="token operator">&lt;</span>div className<span class="token operator">=</span><span class="token string">&quot;root-reply&quot;</span><span class="token operator">&gt;</span>
                <span class="token operator">&lt;</span>span className<span class="token operator">=</span><span class="token string">&quot;reply-content&quot;</span><span class="token operator">&gt;</span>这是一条评论回复<span class="token operator">&lt;</span><span class="token operator">/</span>span<span class="token operator">&gt;</span>
                <span class="token operator">&lt;</span>div className<span class="token operator">=</span><span class="token string">&quot;reply-info&quot;</span><span class="token operator">&gt;</span>
                  <span class="token punctuation">{</span><span class="token comment">/* 评论时间 */</span><span class="token punctuation">}</span>
                  <span class="token operator">&lt;</span>span className<span class="token operator">=</span><span class="token string">&quot;reply-time&quot;</span><span class="token operator">&gt;</span><span class="token punctuation">{</span><span class="token string">&#39;2023-11-11&#39;</span><span class="token punctuation">}</span><span class="token operator">&lt;</span><span class="token operator">/</span>span<span class="token operator">&gt;</span>
                  <span class="token punctuation">{</span><span class="token comment">/* 评论数量 */</span><span class="token punctuation">}</span>
                  <span class="token operator">&lt;</span>span className<span class="token operator">=</span><span class="token string">&quot;reply-time&quot;</span><span class="token operator">&gt;</span>点赞数<span class="token operator">:</span><span class="token punctuation">{</span><span class="token number">100</span><span class="token punctuation">}</span><span class="token operator">&lt;</span><span class="token operator">/</span>span<span class="token operator">&gt;</span>
                  <span class="token operator">&lt;</span>span className<span class="token operator">=</span><span class="token string">&quot;delete-btn&quot;</span><span class="token operator">&gt;</span>
                    删除
                  <span class="token operator">&lt;</span><span class="token operator">/</span>span<span class="token operator">&gt;</span>

                <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">&gt;</span>
              <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">&gt;</span>
            <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">&gt;</span>
          <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">&gt;</span>
        <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">&gt;</span>
      <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">&gt;</span>
    <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">&gt;</span>
  <span class="token punctuation">)</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> App
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-css line-numbers-mode" data-ext="css"><pre class="language-css"><code><span class="token selector">.app</span> <span class="token punctuation">{</span>
  <span class="token property">width</span><span class="token punctuation">:</span> 80%<span class="token punctuation">;</span>
  <span class="token property">margin</span><span class="token punctuation">:</span> 50px auto<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token selector">.reply-navigation</span> <span class="token punctuation">{</span>
  <span class="token property">margin-bottom</span><span class="token punctuation">:</span> 22px<span class="token punctuation">;</span>

  <span class="token selector">.nav-bar</span> <span class="token punctuation">{</span>
    <span class="token property">display</span><span class="token punctuation">:</span> flex<span class="token punctuation">;</span>
    <span class="token property">align-items</span><span class="token punctuation">:</span> center<span class="token punctuation">;</span>
    <span class="token property">margin</span><span class="token punctuation">:</span> 0<span class="token punctuation">;</span>
    <span class="token property">padding</span><span class="token punctuation">:</span> 0<span class="token punctuation">;</span>
    <span class="token property">list-style</span><span class="token punctuation">:</span> none<span class="token punctuation">;</span>

    <span class="token selector">.nav-title</span> <span class="token punctuation">{</span>
      <span class="token property">display</span><span class="token punctuation">:</span> flex<span class="token punctuation">;</span>
      <span class="token property">align-items</span><span class="token punctuation">:</span> center<span class="token punctuation">;</span>
      <span class="token property">width</span><span class="token punctuation">:</span> 114px<span class="token punctuation">;</span>
      <span class="token property">font-size</span><span class="token punctuation">:</span> 20px<span class="token punctuation">;</span>

      <span class="token selector">.nav-title-text</span> <span class="token punctuation">{</span>
        <span class="token property">color</span><span class="token punctuation">:</span> #18191c<span class="token punctuation">;</span>
        <span class="token property">font-weight</span><span class="token punctuation">:</span> 500<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      <span class="token selector">.total-reply</span> <span class="token punctuation">{</span>
        <span class="token property">margin</span><span class="token punctuation">:</span> 0 36px 0 6px<span class="token punctuation">;</span>
        <span class="token property">color</span><span class="token punctuation">:</span> #9499a0<span class="token punctuation">;</span>
        <span class="token property">font-weight</span><span class="token punctuation">:</span> normal<span class="token punctuation">;</span>
        <span class="token property">font-size</span><span class="token punctuation">:</span> 13px<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token selector">.nav-sort</span> <span class="token punctuation">{</span>
      <span class="token property">display</span><span class="token punctuation">:</span> flex<span class="token punctuation">;</span>
      <span class="token property">align-items</span><span class="token punctuation">:</span> center<span class="token punctuation">;</span>
      <span class="token property">color</span><span class="token punctuation">:</span> #9499a0<span class="token punctuation">;</span>
      <span class="token property">font-size</span><span class="token punctuation">:</span> 13px<span class="token punctuation">;</span>

      <span class="token selector">.nav-item</span> <span class="token punctuation">{</span>
        <span class="token property">cursor</span><span class="token punctuation">:</span> pointer<span class="token punctuation">;</span>

        <span class="token selector">&amp;:hover</span> <span class="token punctuation">{</span>
          <span class="token property">color</span><span class="token punctuation">:</span> #00aeec<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        <span class="token selector">&amp;:last-child::after</span> <span class="token punctuation">{</span>
          <span class="token property">display</span><span class="token punctuation">:</span> none<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token selector">&amp;::after</span> <span class="token punctuation">{</span>
          <span class="token property">content</span><span class="token punctuation">:</span> <span class="token string">&#39; &#39;</span><span class="token punctuation">;</span>
          <span class="token property">display</span><span class="token punctuation">:</span> inline-block<span class="token punctuation">;</span>
          <span class="token property">height</span><span class="token punctuation">:</span> 10px<span class="token punctuation">;</span>
          <span class="token property">width</span><span class="token punctuation">:</span> 1px<span class="token punctuation">;</span>
          <span class="token property">margin</span><span class="token punctuation">:</span> -1px 12px<span class="token punctuation">;</span>
          <span class="token property">background-color</span><span class="token punctuation">:</span> #9499a0<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>

      <span class="token selector">.nav-item.active</span> <span class="token punctuation">{</span>
        <span class="token property">color</span><span class="token punctuation">:</span> #18191c<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token selector">.reply-wrap</span> <span class="token punctuation">{</span>
  <span class="token property">position</span><span class="token punctuation">:</span> relative<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token selector">.box-normal</span> <span class="token punctuation">{</span>
  <span class="token property">display</span><span class="token punctuation">:</span> flex<span class="token punctuation">;</span>
  <span class="token property">transition</span><span class="token punctuation">:</span> 0.2s<span class="token punctuation">;</span>

  <span class="token selector">.reply-box-avatar</span> <span class="token punctuation">{</span>
    <span class="token property">display</span><span class="token punctuation">:</span> flex<span class="token punctuation">;</span>
    <span class="token property">align-items</span><span class="token punctuation">:</span> center<span class="token punctuation">;</span>
    <span class="token property">justify-content</span><span class="token punctuation">:</span> center<span class="token punctuation">;</span>
    <span class="token property">width</span><span class="token punctuation">:</span> 80px<span class="token punctuation">;</span>
    <span class="token property">height</span><span class="token punctuation">:</span> 50px<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token selector">.reply-box-wrap</span> <span class="token punctuation">{</span>
    <span class="token property">display</span><span class="token punctuation">:</span> flex<span class="token punctuation">;</span>
    <span class="token property">position</span><span class="token punctuation">:</span> relative<span class="token punctuation">;</span>
    <span class="token property">flex</span><span class="token punctuation">:</span> 1<span class="token punctuation">;</span>

    <span class="token selector">.reply-box-textarea</span> <span class="token punctuation">{</span>
      <span class="token property">width</span><span class="token punctuation">:</span> 100%<span class="token punctuation">;</span>
      <span class="token property">height</span><span class="token punctuation">:</span> 50px<span class="token punctuation">;</span>
      <span class="token property">padding</span><span class="token punctuation">:</span> 5px 10px<span class="token punctuation">;</span>
      <span class="token property">box-sizing</span><span class="token punctuation">:</span> border-box<span class="token punctuation">;</span>
      <span class="token property">color</span><span class="token punctuation">:</span> #181931<span class="token punctuation">;</span>
      <span class="token property">font-family</span><span class="token punctuation">:</span> inherit<span class="token punctuation">;</span>
      <span class="token property">line-height</span><span class="token punctuation">:</span> 38px<span class="token punctuation">;</span>
      <span class="token property">background-color</span><span class="token punctuation">:</span> #f1f2f3<span class="token punctuation">;</span>
      <span class="token property">border</span><span class="token punctuation">:</span> 1px solid #f1f2f3<span class="token punctuation">;</span>
      <span class="token property">border-radius</span><span class="token punctuation">:</span> 6px<span class="token punctuation">;</span>
      <span class="token property">outline</span><span class="token punctuation">:</span> none<span class="token punctuation">;</span>
      <span class="token property">resize</span><span class="token punctuation">:</span> none<span class="token punctuation">;</span>
      <span class="token property">transition</span><span class="token punctuation">:</span> 0.2s<span class="token punctuation">;</span>

      <span class="token selector">&amp;::placeholder</span> <span class="token punctuation">{</span>
        <span class="token property">color</span><span class="token punctuation">:</span> #9499a0<span class="token punctuation">;</span>
        <span class="token property">font-size</span><span class="token punctuation">:</span> 12px<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      <span class="token selector">&amp;:focus</span> <span class="token punctuation">{</span>
        <span class="token property">height</span><span class="token punctuation">:</span> 60px<span class="token punctuation">;</span>
        <span class="token property">background-color</span><span class="token punctuation">:</span> #fff<span class="token punctuation">;</span>
        <span class="token property">border-color</span><span class="token punctuation">:</span> #c9ccd0<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>

  <span class="token selector">.reply-box-send</span> <span class="token punctuation">{</span>
    <span class="token property">position</span><span class="token punctuation">:</span> relative<span class="token punctuation">;</span>
    <span class="token property">display</span><span class="token punctuation">:</span> flex<span class="token punctuation">;</span>
    <span class="token property">flex-basis</span><span class="token punctuation">:</span> 86px<span class="token punctuation">;</span>
    <span class="token property">align-items</span><span class="token punctuation">:</span> center<span class="token punctuation">;</span>
    <span class="token property">justify-content</span><span class="token punctuation">:</span> center<span class="token punctuation">;</span>
    <span class="token property">margin-left</span><span class="token punctuation">:</span> 10px<span class="token punctuation">;</span>
    <span class="token property">border-radius</span><span class="token punctuation">:</span> 4px<span class="token punctuation">;</span>
    <span class="token property">cursor</span><span class="token punctuation">:</span> pointer<span class="token punctuation">;</span>
    <span class="token property">transition</span><span class="token punctuation">:</span> 0.2s<span class="token punctuation">;</span>

    <span class="token selector">&amp; .send-text</span> <span class="token punctuation">{</span>
      <span class="token property">position</span><span class="token punctuation">:</span> absolute<span class="token punctuation">;</span>
      <span class="token property">z-index</span><span class="token punctuation">:</span> 1<span class="token punctuation">;</span>
      <span class="token property">color</span><span class="token punctuation">:</span> #fff<span class="token punctuation">;</span>
      <span class="token property">font-size</span><span class="token punctuation">:</span> 16px<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token selector">&amp;::after</span> <span class="token punctuation">{</span>
      <span class="token property">position</span><span class="token punctuation">:</span> absolute<span class="token punctuation">;</span>
      <span class="token property">width</span><span class="token punctuation">:</span> 100%<span class="token punctuation">;</span>
      <span class="token property">height</span><span class="token punctuation">:</span> 100%<span class="token punctuation">;</span>
      <span class="token property">background-color</span><span class="token punctuation">:</span> #00aeec<span class="token punctuation">;</span>
      <span class="token property">border-radius</span><span class="token punctuation">:</span> 4px<span class="token punctuation">;</span>
      <span class="token property">opacity</span><span class="token punctuation">:</span> 0.5<span class="token punctuation">;</span>
      <span class="token property">content</span><span class="token punctuation">:</span> <span class="token string">&#39;&#39;</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token selector">&amp;:hover::after</span> <span class="token punctuation">{</span>
      <span class="token property">opacity</span><span class="token punctuation">:</span> 1<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
<span class="token selector">.bili-avatar</span> <span class="token punctuation">{</span>
  <span class="token property">position</span><span class="token punctuation">:</span> relative<span class="token punctuation">;</span>
  <span class="token property">display</span><span class="token punctuation">:</span> block<span class="token punctuation">;</span>
  <span class="token property">width</span><span class="token punctuation">:</span> 48px<span class="token punctuation">;</span>
  <span class="token property">height</span><span class="token punctuation">:</span> 48px<span class="token punctuation">;</span>
  <span class="token property">margin</span><span class="token punctuation">:</span> 0<span class="token punctuation">;</span>
  <span class="token property">padding</span><span class="token punctuation">:</span> 0<span class="token punctuation">;</span>
  <span class="token property">border-radius</span><span class="token punctuation">:</span> 50%<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token selector">.bili-avatar-img</span> <span class="token punctuation">{</span>
  <span class="token property">position</span><span class="token punctuation">:</span> absolute<span class="token punctuation">;</span>
  <span class="token property">top</span><span class="token punctuation">:</span> 50%<span class="token punctuation">;</span>
  <span class="token property">left</span><span class="token punctuation">:</span> 50%<span class="token punctuation">;</span>
  <span class="token property">display</span><span class="token punctuation">:</span> block<span class="token punctuation">;</span>
  <span class="token property">width</span><span class="token punctuation">:</span> 48px<span class="token punctuation">;</span>
  <span class="token property">height</span><span class="token punctuation">:</span> 48px<span class="token punctuation">;</span>
  <span class="token property">object-fit</span><span class="token punctuation">:</span> cover<span class="token punctuation">;</span>
  <span class="token property">border</span><span class="token punctuation">:</span> none<span class="token punctuation">;</span>
  <span class="token property">border-radius</span><span class="token punctuation">:</span> 50%<span class="token punctuation">;</span>
  <span class="token property">image-rendering</span><span class="token punctuation">:</span> -webkit-optimize-contrast<span class="token punctuation">;</span>
  <span class="token property">transform</span><span class="token punctuation">:</span> <span class="token function">translate</span><span class="token punctuation">(</span>-50%<span class="token punctuation">,</span> -50%<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token selector">// 评论列表
.reply-list</span> <span class="token punctuation">{</span>
  <span class="token property">margin-top</span><span class="token punctuation">:</span> 14px<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token selector">.reply-item</span> <span class="token punctuation">{</span>
  <span class="token property">padding</span><span class="token punctuation">:</span> 22px 0 0 80px<span class="token punctuation">;</span>
  <span class="token selector">.root-reply-avatar</span> <span class="token punctuation">{</span>
    <span class="token property">position</span><span class="token punctuation">:</span> absolute<span class="token punctuation">;</span>
    <span class="token property">left</span><span class="token punctuation">:</span> 0<span class="token punctuation">;</span>
    <span class="token property">display</span><span class="token punctuation">:</span> flex<span class="token punctuation">;</span>
    <span class="token property">justify-content</span><span class="token punctuation">:</span> center<span class="token punctuation">;</span>
    <span class="token property">width</span><span class="token punctuation">:</span> 80px<span class="token punctuation">;</span>
    <span class="token property">cursor</span><span class="token punctuation">:</span> pointer<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token selector">.content-wrap</span> <span class="token punctuation">{</span>
    <span class="token property">position</span><span class="token punctuation">:</span> relative<span class="token punctuation">;</span>
    <span class="token property">flex</span><span class="token punctuation">:</span> 1<span class="token punctuation">;</span>

    <span class="token selector">&amp;::after</span> <span class="token punctuation">{</span>
      <span class="token property">content</span><span class="token punctuation">:</span> <span class="token string">&#39; &#39;</span><span class="token punctuation">;</span>
      <span class="token property">display</span><span class="token punctuation">:</span> block<span class="token punctuation">;</span>
      <span class="token property">height</span><span class="token punctuation">:</span> 1px<span class="token punctuation">;</span>
      <span class="token property">width</span><span class="token punctuation">:</span> 100%<span class="token punctuation">;</span>
      <span class="token property">margin-top</span><span class="token punctuation">:</span> 14px<span class="token punctuation">;</span>
      <span class="token property">background-color</span><span class="token punctuation">:</span> #e3e5e7<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token selector">.user-info</span> <span class="token punctuation">{</span>
      <span class="token property">display</span><span class="token punctuation">:</span> flex<span class="token punctuation">;</span>
      <span class="token property">align-items</span><span class="token punctuation">:</span> center<span class="token punctuation">;</span>
      <span class="token property">margin-bottom</span><span class="token punctuation">:</span> 4px<span class="token punctuation">;</span>

      <span class="token selector">.user-name</span> <span class="token punctuation">{</span>
        <span class="token property">height</span><span class="token punctuation">:</span> 30px<span class="token punctuation">;</span>
        <span class="token property">margin-right</span><span class="token punctuation">:</span> 5px<span class="token punctuation">;</span>
        <span class="token property">color</span><span class="token punctuation">:</span> #61666d<span class="token punctuation">;</span>
        <span class="token property">font-size</span><span class="token punctuation">:</span> 13px<span class="token punctuation">;</span>
        <span class="token property">line-height</span><span class="token punctuation">:</span> 30px<span class="token punctuation">;</span>
        <span class="token property">cursor</span><span class="token punctuation">:</span> pointer<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token selector">.root-reply</span> <span class="token punctuation">{</span>
      <span class="token property">position</span><span class="token punctuation">:</span> relative<span class="token punctuation">;</span>
      <span class="token property">padding</span><span class="token punctuation">:</span> 2px 0<span class="token punctuation">;</span>
      <span class="token property">color</span><span class="token punctuation">:</span> #181931<span class="token punctuation">;</span>
      <span class="token property">font-size</span><span class="token punctuation">:</span> 15px<span class="token punctuation">;</span>
      <span class="token property">line-height</span><span class="token punctuation">:</span> 24px<span class="token punctuation">;</span>
      <span class="token selector">.reply-info</span> <span class="token punctuation">{</span>
        <span class="token property">position</span><span class="token punctuation">:</span> relative<span class="token punctuation">;</span>
        <span class="token property">display</span><span class="token punctuation">:</span> flex<span class="token punctuation">;</span>
        <span class="token property">align-items</span><span class="token punctuation">:</span> center<span class="token punctuation">;</span>
        <span class="token property">margin-top</span><span class="token punctuation">:</span> 2px<span class="token punctuation">;</span>
        <span class="token property">color</span><span class="token punctuation">:</span> #9499a0<span class="token punctuation">;</span>
        <span class="token property">font-size</span><span class="token punctuation">:</span> 13px<span class="token punctuation">;</span>

        <span class="token selector">.reply-time</span> <span class="token punctuation">{</span>
          <span class="token property">width</span><span class="token punctuation">:</span> 76px<span class="token punctuation">;</span>
          <span class="token property">margin-right</span><span class="token punctuation">:</span> 20px<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token selector">.reply-like</span> <span class="token punctuation">{</span>
          <span class="token property">display</span><span class="token punctuation">:</span> flex<span class="token punctuation">;</span>
          <span class="token property">align-items</span><span class="token punctuation">:</span> center<span class="token punctuation">;</span>
          <span class="token property">margin-right</span><span class="token punctuation">:</span> 19px<span class="token punctuation">;</span>

          <span class="token selector">.like-icon</span> <span class="token punctuation">{</span>
            <span class="token property">width</span><span class="token punctuation">:</span> 14px<span class="token punctuation">;</span>
            <span class="token property">height</span><span class="token punctuation">:</span> 14px<span class="token punctuation">;</span>
            <span class="token property">margin-right</span><span class="token punctuation">:</span> 5px<span class="token punctuation">;</span>
            <span class="token property">color</span><span class="token punctuation">:</span> #9499a0<span class="token punctuation">;</span>
            <span class="token property">background-position</span><span class="token punctuation">:</span> -153px -25px<span class="token punctuation">;</span>
            <span class="token selector">&amp;:hover</span> <span class="token punctuation">{</span>
              <span class="token property">background-position</span><span class="token punctuation">:</span> -218px -25px<span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
          <span class="token punctuation">}</span>
          <span class="token selector">.like-icon.liked</span> <span class="token punctuation">{</span>
            <span class="token property">background-position</span><span class="token punctuation">:</span> -154px -89px<span class="token punctuation">;</span>
          <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token selector">.reply-dislike</span> <span class="token punctuation">{</span>
          <span class="token property">display</span><span class="token punctuation">:</span> flex<span class="token punctuation">;</span>
          <span class="token property">align-items</span><span class="token punctuation">:</span> center<span class="token punctuation">;</span>
          <span class="token property">margin-right</span><span class="token punctuation">:</span> 19px<span class="token punctuation">;</span>
          <span class="token selector">.dislike-icon</span> <span class="token punctuation">{</span>
            <span class="token property">width</span><span class="token punctuation">:</span> 16px<span class="token punctuation">;</span>
            <span class="token property">height</span><span class="token punctuation">:</span> 16px<span class="token punctuation">;</span>
            <span class="token property">background-position</span><span class="token punctuation">:</span> -153px -153px<span class="token punctuation">;</span>
            <span class="token selector">&amp;:hover</span> <span class="token punctuation">{</span>
              <span class="token property">background-position</span><span class="token punctuation">:</span> -217px -153px<span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
          <span class="token punctuation">}</span>
          <span class="token selector">.dislike-icon.disliked</span> <span class="token punctuation">{</span>
            <span class="token property">background-position</span><span class="token punctuation">:</span> -154px -217px<span class="token punctuation">;</span>
          <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token selector">.delete-btn</span> <span class="token punctuation">{</span>
          <span class="token property">cursor</span><span class="token punctuation">:</span> pointer<span class="token punctuation">;</span>
          <span class="token selector">&amp;:hover</span> <span class="token punctuation">{</span>
            <span class="token property">color</span><span class="token punctuation">:</span> #00aeec<span class="token punctuation">;</span>
          <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token selector">.reply-none</span> <span class="token punctuation">{</span>
  <span class="token property">height</span><span class="token punctuation">:</span> 64px<span class="token punctuation">;</span>
  <span class="token property">margin-bottom</span><span class="token punctuation">:</span> 80px<span class="token punctuation">;</span>
  <span class="token property">color</span><span class="token punctuation">:</span> #99a2aa<span class="token punctuation">;</span>
  <span class="token property">font-size</span><span class="token punctuation">:</span> 13px<span class="token punctuation">;</span>
  <span class="token property">line-height</span><span class="token punctuation">:</span> 64px<span class="token punctuation">;</span>
  <span class="token property">text-align</span><span class="token punctuation">:</span> center<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></details><details class="hint-container details"><summary>完成版本</summary><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code> <span class="token keyword">import</span> <span class="token punctuation">{</span> useState <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;react&#39;</span>
<span class="token keyword">import</span> <span class="token string">&#39;./App.scss&#39;</span>
<span class="token keyword">import</span> avatar <span class="token keyword">from</span> <span class="token string">&#39;./images/bozai.png&#39;</span>
<span class="token keyword">import</span> orderBy <span class="token keyword">from</span> <span class="token string">&#39;lodash/orderBy&#39;</span>

<span class="token doc-comment comment">/**
 * 评论列表的渲染和操作
 *
 * 1. 根据状态渲染评论列表
 * 2. 删除评论
 */</span>

<span class="token comment">// 评论列表数据</span>
<span class="token keyword">const</span> defaultList <span class="token operator">=</span> <span class="token punctuation">[</span>
  <span class="token punctuation">{</span>
    <span class="token comment">// 评论id</span>
    <span class="token literal-property property">rpid</span><span class="token operator">:</span> <span class="token number">3</span><span class="token punctuation">,</span>
    <span class="token comment">// 用户信息</span>
    <span class="token literal-property property">user</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">uid</span><span class="token operator">:</span> <span class="token string">&#39;13258165&#39;</span><span class="token punctuation">,</span>
      <span class="token literal-property property">avatar</span><span class="token operator">:</span> <span class="token string">&#39;&#39;</span><span class="token punctuation">,</span>
      <span class="token literal-property property">uname</span><span class="token operator">:</span> <span class="token string">&#39;周杰伦&#39;</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token comment">// 评论内容</span>
    <span class="token literal-property property">content</span><span class="token operator">:</span> <span class="token string">&#39;哎哟，不错哦&#39;</span><span class="token punctuation">,</span>
    <span class="token comment">// 评论时间</span>
    <span class="token literal-property property">ctime</span><span class="token operator">:</span> <span class="token string">&#39;10-18 08:15&#39;</span><span class="token punctuation">,</span>
    <span class="token literal-property property">like</span><span class="token operator">:</span> <span class="token number">88</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">{</span>
    <span class="token literal-property property">rpid</span><span class="token operator">:</span> <span class="token number">2</span><span class="token punctuation">,</span>
    <span class="token literal-property property">user</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">uid</span><span class="token operator">:</span> <span class="token string">&#39;36080105&#39;</span><span class="token punctuation">,</span>
      <span class="token literal-property property">avatar</span><span class="token operator">:</span> <span class="token string">&#39;&#39;</span><span class="token punctuation">,</span>
      <span class="token literal-property property">uname</span><span class="token operator">:</span> <span class="token string">&#39;许嵩&#39;</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token literal-property property">content</span><span class="token operator">:</span> <span class="token string">&#39;我寻你千百度 日出到迟暮&#39;</span><span class="token punctuation">,</span>
    <span class="token literal-property property">ctime</span><span class="token operator">:</span> <span class="token string">&#39;11-13 11:29&#39;</span><span class="token punctuation">,</span>
    <span class="token literal-property property">like</span><span class="token operator">:</span> <span class="token number">88</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">{</span>
    <span class="token literal-property property">rpid</span><span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span>
    <span class="token literal-property property">user</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">uid</span><span class="token operator">:</span> <span class="token string">&#39;30009257&#39;</span><span class="token punctuation">,</span>
      avatar<span class="token punctuation">,</span>
      <span class="token literal-property property">uname</span><span class="token operator">:</span> <span class="token string">&#39;黑马前端&#39;</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token literal-property property">content</span><span class="token operator">:</span> <span class="token string">&#39;学前端就来黑马&#39;</span><span class="token punctuation">,</span>
    <span class="token literal-property property">ctime</span><span class="token operator">:</span> <span class="token string">&#39;10-19 09:00&#39;</span><span class="token punctuation">,</span>
    <span class="token literal-property property">like</span><span class="token operator">:</span> <span class="token number">66</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">]</span>
<span class="token comment">// 当前登录用户信息</span>
<span class="token keyword">const</span> user <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token comment">// 用户id</span>
  <span class="token literal-property property">uid</span><span class="token operator">:</span> <span class="token string">&#39;30009257&#39;</span><span class="token punctuation">,</span>
  <span class="token comment">// 用户头像</span>
  avatar<span class="token punctuation">,</span>
  <span class="token comment">// 用户昵称</span>
  <span class="token literal-property property">uname</span><span class="token operator">:</span> <span class="token string">&#39;黑马前端&#39;</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 导航 Tab 的渲染和操作
 *
 * 1. 渲染导航 Tab 和高亮
 * 2. 评论列表排序
 *  最热 =&gt; 喜欢数量降序
 *  最新 =&gt; 创建时间降序
 */</span>

<span class="token comment">// 导航 Tab 数组</span>
<span class="token keyword">const</span> tabs <span class="token operator">=</span> <span class="token punctuation">[</span>
  <span class="token punctuation">{</span> <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">&#39;hot&#39;</span><span class="token punctuation">,</span> <span class="token literal-property property">text</span><span class="token operator">:</span> <span class="token string">&#39;最热&#39;</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">{</span> <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">&#39;time&#39;</span><span class="token punctuation">,</span> <span class="token literal-property property">text</span><span class="token operator">:</span> <span class="token string">&#39;最新&#39;</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">]</span>

<span class="token keyword">const</span> <span class="token function-variable function">App</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token comment">// 导航 Tab 高亮的状态</span>
  <span class="token keyword">const</span> <span class="token punctuation">[</span>activeTab<span class="token punctuation">,</span> setActiveTab<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token function">useState</span><span class="token punctuation">(</span><span class="token string">&#39;hot&#39;</span><span class="token punctuation">)</span>
  <span class="token keyword">const</span> <span class="token punctuation">[</span>list<span class="token punctuation">,</span> setList<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token function">useState</span><span class="token punctuation">(</span>defaultList<span class="token punctuation">)</span>

  <span class="token comment">// 删除评论</span>
  <span class="token keyword">const</span> <span class="token function-variable function">onDelete</span> <span class="token operator">=</span> <span class="token parameter">rpid</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token comment">// 如果要删除数组中的元素，需要调用 filter 方法，并且一定要调用 setList 才能更新状态</span>
    <span class="token function">setList</span><span class="token punctuation">(</span>list<span class="token punctuation">.</span><span class="token function">filter</span><span class="token punctuation">(</span><span class="token parameter">item</span> <span class="token operator">=&gt;</span> item<span class="token punctuation">.</span>rpid <span class="token operator">!==</span> rpid<span class="token punctuation">)</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// tab 高亮切换</span>
  <span class="token keyword">const</span> <span class="token function-variable function">onToggle</span> <span class="token operator">=</span> <span class="token parameter">type</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token function">setActiveTab</span><span class="token punctuation">(</span>type<span class="token punctuation">)</span>
    <span class="token keyword">let</span> newList
    <span class="token keyword">if</span> <span class="token punctuation">(</span>type <span class="token operator">===</span> <span class="token string">&#39;time&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 按照时间降序排序</span>
      <span class="token comment">// orderBy(对谁进行排序, 按照谁来排, 顺序)</span>
      newList <span class="token operator">=</span> <span class="token function">orderBy</span><span class="token punctuation">(</span>list<span class="token punctuation">,</span> <span class="token string">&#39;ctime&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;desc&#39;</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
      <span class="token comment">// 按照喜欢数量降序排序</span>
      newList <span class="token operator">=</span> <span class="token function">orderBy</span><span class="token punctuation">(</span>list<span class="token punctuation">,</span> <span class="token string">&#39;like&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;desc&#39;</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
    <span class="token function">setList</span><span class="token punctuation">(</span>newList<span class="token punctuation">)</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">return</span> <span class="token punctuation">(</span>
    <span class="token operator">&lt;</span>div className<span class="token operator">=</span><span class="token string">&quot;app&quot;</span><span class="token operator">&gt;</span>
      <span class="token punctuation">{</span><span class="token comment">/* 导航 Tab */</span><span class="token punctuation">}</span>
      <span class="token operator">&lt;</span>div className<span class="token operator">=</span><span class="token string">&quot;reply-navigation&quot;</span><span class="token operator">&gt;</span>
        <span class="token operator">&lt;</span>ul className<span class="token operator">=</span><span class="token string">&quot;nav-bar&quot;</span><span class="token operator">&gt;</span>
          <span class="token operator">&lt;</span>li className<span class="token operator">=</span><span class="token string">&quot;nav-title&quot;</span><span class="token operator">&gt;</span>
            <span class="token operator">&lt;</span>span className<span class="token operator">=</span><span class="token string">&quot;nav-title-text&quot;</span><span class="token operator">&gt;</span>评论<span class="token operator">&lt;</span><span class="token operator">/</span>span<span class="token operator">&gt;</span>
            <span class="token punctuation">{</span><span class="token comment">/* 评论数量 */</span><span class="token punctuation">}</span>
            <span class="token operator">&lt;</span>span className<span class="token operator">=</span><span class="token string">&quot;total-reply&quot;</span><span class="token operator">&gt;</span><span class="token punctuation">{</span>list<span class="token punctuation">.</span>length<span class="token punctuation">}</span><span class="token operator">&lt;</span><span class="token operator">/</span>span<span class="token operator">&gt;</span>
          <span class="token operator">&lt;</span><span class="token operator">/</span>li<span class="token operator">&gt;</span>
          <span class="token operator">&lt;</span>li className<span class="token operator">=</span><span class="token string">&quot;nav-sort&quot;</span><span class="token operator">&gt;</span>
            <span class="token punctuation">{</span><span class="token comment">/* 高亮类名： active */</span><span class="token punctuation">}</span>
            <span class="token punctuation">{</span>tabs<span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token parameter">item</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
              <span class="token keyword">return</span> <span class="token punctuation">(</span>
                <span class="token operator">&lt;</span>div
                  key<span class="token operator">=</span><span class="token punctuation">{</span>item<span class="token punctuation">.</span>type<span class="token punctuation">}</span>
                  className<span class="token operator">=</span><span class="token punctuation">{</span>
                    item<span class="token punctuation">.</span>type <span class="token operator">===</span> activeTab <span class="token operator">?</span> <span class="token string">&#39;nav-item active&#39;</span> <span class="token operator">:</span> <span class="token string">&#39;nav-item&#39;</span>
                  <span class="token punctuation">}</span>
                  onClick<span class="token operator">=</span><span class="token punctuation">{</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token function">onToggle</span><span class="token punctuation">(</span>item<span class="token punctuation">.</span>type<span class="token punctuation">)</span><span class="token punctuation">}</span>
                <span class="token operator">&gt;</span>
                  <span class="token punctuation">{</span>item<span class="token punctuation">.</span>text<span class="token punctuation">}</span>
                <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">&gt;</span>
              <span class="token punctuation">)</span>
            <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">}</span>
          <span class="token operator">&lt;</span><span class="token operator">/</span>li<span class="token operator">&gt;</span>
        <span class="token operator">&lt;</span><span class="token operator">/</span>ul<span class="token operator">&gt;</span>
      <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">&gt;</span>

      <span class="token operator">&lt;</span>div className<span class="token operator">=</span><span class="token string">&quot;reply-wrap&quot;</span><span class="token operator">&gt;</span>
        <span class="token punctuation">{</span><span class="token comment">/* 发表评论 */</span><span class="token punctuation">}</span>
        <span class="token operator">&lt;</span>div className<span class="token operator">=</span><span class="token string">&quot;box-normal&quot;</span><span class="token operator">&gt;</span>
          <span class="token punctuation">{</span><span class="token comment">/* 当前用户头像 */</span><span class="token punctuation">}</span>
          <span class="token operator">&lt;</span>div className<span class="token operator">=</span><span class="token string">&quot;reply-box-avatar&quot;</span><span class="token operator">&gt;</span>
            <span class="token operator">&lt;</span>div className<span class="token operator">=</span><span class="token string">&quot;bili-avatar&quot;</span><span class="token operator">&gt;</span>
              <span class="token operator">&lt;</span>img className<span class="token operator">=</span><span class="token string">&quot;bili-avatar-img&quot;</span> src<span class="token operator">=</span><span class="token punctuation">{</span>avatar<span class="token punctuation">}</span> alt<span class="token operator">=</span><span class="token string">&quot;用户头像&quot;</span> <span class="token operator">/</span><span class="token operator">&gt;</span>
            <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">&gt;</span>
          <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">&gt;</span>
          <span class="token operator">&lt;</span>div className<span class="token operator">=</span><span class="token string">&quot;reply-box-wrap&quot;</span><span class="token operator">&gt;</span>
            <span class="token punctuation">{</span><span class="token comment">/* 评论框 */</span><span class="token punctuation">}</span>
            <span class="token operator">&lt;</span>textarea
              className<span class="token operator">=</span><span class="token string">&quot;reply-box-textarea&quot;</span>
              placeholder<span class="token operator">=</span><span class="token string">&quot;发一条友善的评论&quot;</span>
            <span class="token operator">/</span><span class="token operator">&gt;</span>
            <span class="token punctuation">{</span><span class="token comment">/* 发布按钮 */</span><span class="token punctuation">}</span>
            <span class="token operator">&lt;</span>div className<span class="token operator">=</span><span class="token string">&quot;reply-box-send&quot;</span><span class="token operator">&gt;</span>
              <span class="token operator">&lt;</span>div className<span class="token operator">=</span><span class="token string">&quot;send-text&quot;</span><span class="token operator">&gt;</span>发布<span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">&gt;</span>
            <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">&gt;</span>
          <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">&gt;</span>
        <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">&gt;</span>
        <span class="token punctuation">{</span><span class="token comment">/* 评论列表 */</span><span class="token punctuation">}</span>
        <span class="token operator">&lt;</span>div className<span class="token operator">=</span><span class="token string">&quot;reply-list&quot;</span><span class="token operator">&gt;</span>
          <span class="token punctuation">{</span><span class="token comment">/* 评论项 */</span><span class="token punctuation">}</span>
          <span class="token punctuation">{</span>list<span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token parameter">item</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
            <span class="token keyword">return</span> <span class="token punctuation">(</span>
              <span class="token operator">&lt;</span>div key<span class="token operator">=</span><span class="token punctuation">{</span>item<span class="token punctuation">.</span>rpid<span class="token punctuation">}</span> className<span class="token operator">=</span><span class="token string">&quot;reply-item&quot;</span><span class="token operator">&gt;</span>
                <span class="token punctuation">{</span><span class="token comment">/* 头像 */</span><span class="token punctuation">}</span>
                <span class="token operator">&lt;</span>div className<span class="token operator">=</span><span class="token string">&quot;root-reply-avatar&quot;</span><span class="token operator">&gt;</span>
                  <span class="token operator">&lt;</span>div className<span class="token operator">=</span><span class="token string">&quot;bili-avatar&quot;</span><span class="token operator">&gt;</span>
                    <span class="token operator">&lt;</span>img
                      className<span class="token operator">=</span><span class="token string">&quot;bili-avatar-img&quot;</span>
                      src<span class="token operator">=</span><span class="token punctuation">{</span>item<span class="token punctuation">.</span>user<span class="token punctuation">.</span>avatar<span class="token punctuation">}</span>
                      alt<span class="token operator">=</span><span class="token string">&quot;&quot;</span>
                    <span class="token operator">/</span><span class="token operator">&gt;</span>
                  <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">&gt;</span>
                <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">&gt;</span>

                <span class="token operator">&lt;</span>div className<span class="token operator">=</span><span class="token string">&quot;content-wrap&quot;</span><span class="token operator">&gt;</span>
                  <span class="token punctuation">{</span><span class="token comment">/* 用户名 */</span><span class="token punctuation">}</span>
                  <span class="token operator">&lt;</span>div className<span class="token operator">=</span><span class="token string">&quot;user-info&quot;</span><span class="token operator">&gt;</span>
                    <span class="token operator">&lt;</span>div className<span class="token operator">=</span><span class="token string">&quot;user-name&quot;</span><span class="token operator">&gt;</span><span class="token punctuation">{</span>item<span class="token punctuation">.</span>user<span class="token punctuation">.</span>uname<span class="token punctuation">}</span><span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">&gt;</span>
                  <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">&gt;</span>
                  <span class="token punctuation">{</span><span class="token comment">/* 评论内容 */</span><span class="token punctuation">}</span>
                  <span class="token operator">&lt;</span>div className<span class="token operator">=</span><span class="token string">&quot;root-reply&quot;</span><span class="token operator">&gt;</span>
                    <span class="token operator">&lt;</span>span className<span class="token operator">=</span><span class="token string">&quot;reply-content&quot;</span><span class="token operator">&gt;</span><span class="token punctuation">{</span>item<span class="token punctuation">.</span>content<span class="token punctuation">}</span><span class="token operator">&lt;</span><span class="token operator">/</span>span<span class="token operator">&gt;</span>
                    <span class="token operator">&lt;</span>div className<span class="token operator">=</span><span class="token string">&quot;reply-info&quot;</span><span class="token operator">&gt;</span>
                      <span class="token punctuation">{</span><span class="token comment">/* 评论时间 */</span><span class="token punctuation">}</span>
                      <span class="token operator">&lt;</span>span className<span class="token operator">=</span><span class="token string">&quot;reply-time&quot;</span><span class="token operator">&gt;</span><span class="token punctuation">{</span>item<span class="token punctuation">.</span>ctime<span class="token punctuation">}</span><span class="token operator">&lt;</span><span class="token operator">/</span>span<span class="token operator">&gt;</span>
                      <span class="token punctuation">{</span><span class="token comment">/* 评论数量 */</span><span class="token punctuation">}</span>
                      <span class="token operator">&lt;</span>span className<span class="token operator">=</span><span class="token string">&quot;reply-time&quot;</span><span class="token operator">&gt;</span>点赞数<span class="token operator">:</span><span class="token punctuation">{</span>item<span class="token punctuation">.</span>like<span class="token punctuation">}</span><span class="token operator">&lt;</span><span class="token operator">/</span>span<span class="token operator">&gt;</span>
                      <span class="token punctuation">{</span>user<span class="token punctuation">.</span>uid <span class="token operator">===</span> item<span class="token punctuation">.</span>user<span class="token punctuation">.</span>uid <span class="token operator">&amp;&amp;</span> <span class="token punctuation">(</span>
                        <span class="token operator">&lt;</span>span
                          className<span class="token operator">=</span><span class="token string">&quot;delete-btn&quot;</span>
                          onClick<span class="token operator">=</span><span class="token punctuation">{</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token function">onDelete</span><span class="token punctuation">(</span>item<span class="token punctuation">.</span>rpid<span class="token punctuation">)</span><span class="token punctuation">}</span>
                        <span class="token operator">&gt;</span>
                          删除
                        <span class="token operator">&lt;</span><span class="token operator">/</span>span<span class="token operator">&gt;</span>
                      <span class="token punctuation">)</span><span class="token punctuation">}</span>
                    <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">&gt;</span>
                  <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">&gt;</span>
                <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">&gt;</span>
              <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">&gt;</span>
            <span class="token punctuation">)</span>
          <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">}</span>
        <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">&gt;</span>
      <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">&gt;</span>
    <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">&gt;</span>
  <span class="token punctuation">)</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> App
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></details>`,72);function b(g,y){const p=l("ExternalLinkIcon");return e(),o("div",null,[r,n("div",u,[k,d,n("p",null,[s("官方文档："),n("a",v,[s("https://zh-hans.react.dev/learn/start-a-new-react-project"),c(p)])])]),m])}const x=t(i,[["render",b],["__file","1.React-Basics-Part-1.html.vue"]]);export{x as default};
