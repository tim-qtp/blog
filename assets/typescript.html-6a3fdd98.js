import{_ as n,W as s,X as a,a2 as e}from"./framework-6a3aa88c.js";const p={},t=e(`<h3 id="_1-typescript-是什么" tabindex="-1"><a class="header-anchor" href="#_1-typescript-是什么" aria-hidden="true">#</a> 1. TypeScript 是什么</h3><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20250109152636664.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="_2-typescript-为什么要为-js-添加类型支持" tabindex="-1"><a class="header-anchor" href="#_2-typescript-为什么要为-js-添加类型支持" aria-hidden="true">#</a> 2. TypeScript 为什么要为 JS 添加类型支持？</h3><p><strong>背景</strong>：JS 的类型系统存在“先天缺陷”，JS 代码中绝大部分错误都是类型错误（Uncaught TypeError）。</p><p><strong>问题</strong>：增加了找 Bug、改 Bug 的时间，严重影响开发效率。</p><p>从编程语言的动静来区分，TypeScript 属于静态类型的编程语言，JS 属于动态类型的编程语言。</p><p>静态类型：编译期做类型检查； 动态类型：执行期做类型检查。</p><p>代码编译和代码执行的顺序：1 编译 2 执行。</p><p>对于 JS 来说：需要等到代码真正去执行的时候才能发现错误（晚）。</p><p>对于 TS 来说：在代码编译的时候（代码执行前）就可以发现错误（早）。</p><p>并且，配合 VSCode 等开发工具，TS 可以提前到在编写代码的同时就发现代码中的错误，减少找 Bug、改 Bug 时间</p><h3 id="_3-typescript-相比-js-的优势" tabindex="-1"><a class="header-anchor" href="#_3-typescript-相比-js-的优势" aria-hidden="true">#</a> 3. TypeScript 相比 JS 的优势</h3><ol><li>更早（写代码的同时）发现错误，减少找 Bug、改 Bug 时间，提升开发效率。</li><li>序中任何位置的代码都有代码提示，随时随地的安全感，增强了开发体验。</li><li>强大的类型系统提升了代码的可维护性，使得重构代码更加容易。</li><li>支持最新的 ECMAScript 语法，优先体验最新的语法，让你走在前端技术的最前沿。</li><li>TS 类型推断机制，不需要在代码中的每个地方都显示标注类型，让你在享受优势的同时，尽量降低了成本。</li></ol><p>除此之外，Vue 3 源码使用 TS 重写、Angular 默认支持 TS、React 与 TS 完美配合，TypeScript 已成为大中型前端 项目的首先编程语言。</p><h3 id="_4-安装编译-ts-的工具包" tabindex="-1"><a class="header-anchor" href="#_4-安装编译-ts-的工具包" aria-hidden="true">#</a> 4. 安装编译 TS 的工具包</h3><p>Node.js/浏览器，只认识 JS 代码，不认识 TS 代码。需要先将 TS 代码转化为 JS 代码，然后才能运行。</p><p>安装命令：<code>npm i -g typescript</code>。</p><p>typescript 包：用来编译 <code>TS</code> 代码的包，提供了 <code>tsc</code> 命令，实现了 <code>TS -&gt; JS</code> 的转化。</p><p>验证是否安装成功：<code>tsc –v</code>（查看 <code>typescript</code> 的版本）。</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20250109153312156.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="_5-编译并运行-ts-代码" tabindex="-1"><a class="header-anchor" href="#_5-编译并运行-ts-代码" aria-hidden="true">#</a> 5. 编译并运行 TS 代码</h3><ol><li>创建 hello.ts 文件（注意：TS 文件的后缀名为 .ts）。</li><li>将 TS 编译为 JS：在终端中输入命令，tsc hello.ts（此时，在同级目录中会出现一个同名的 JS 文件）。</li><li>执行 JS 代码：在终端中输入命令，node hello.js</li></ol><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;Hello ts&#39;</span><span class="token punctuation">)</span>
<span class="token keyword">let</span> age<span class="token operator">:</span> <span class="token builtin">number</span> <span class="token operator">=</span> <span class="token number">18</span>
<span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>age<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>再看一下对应的js文件:</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;Hello ts&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">var</span> age <span class="token operator">=</span> <span class="token number">18</span><span class="token punctuation">;</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>age<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>确实没有<code>类型语句</code>了</p><p>注意：<span style="color:red;">约定了什么类型，就只能给变量赋值该类型的值</span>，否则，就会报错。</p><p><strong>简化方式</strong>：使用 ts-node 包，然后执行<code>ts-node hello.ts</code>，<code>ts-node</code> 命令在内部偷偷的将 <code>TS -&gt; JS</code>，然后，再运行 JS 代码。</p><p>先安装包：<code>npm i -g ts-node</code>（<code>ts-node</code>包提供了 <code>ts-node</code> 命令）</p><p><mark>但是要注意</mark>，根目录得初始化一个<code>tsconfig.json</code> 配置文件才行 ，初始化方式：<code>npx tsc --init</code></p><h3 id="_6-小对比" tabindex="-1"><a class="header-anchor" href="#_6-小对比" aria-hidden="true">#</a> 6. 小对比</h3><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">//js报错</span>
<span class="token keyword">let</span> count <span class="token operator">=</span> <span class="token number">18</span>
count <span class="token operator">=</span> <span class="token string">&#39;20&#39;</span>
count<span class="token punctuation">.</span><span class="token function">toFixed</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20250109203716837.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>然而ts已经报错了</p><h3 id="_7-常用基础类型" tabindex="-1"><a class="header-anchor" href="#_7-常用基础类型" aria-hidden="true">#</a> 7. 常用基础类型</h3><ol><li>JS 已有类型 <ul><li>原始类型：number/string/boolean/null/undefined/symbol。</li><li>对象类型：object（包括，数组、对象、函数等对象）。</li></ul></li><li>TS 新增类型 <ul><li>联合类型、自定义类型（类型别名）、接口、元组、字面量类型、枚举、void、any 等。</li></ul></li></ol><h3 id="_8-数组类型" tabindex="-1"><a class="header-anchor" href="#_8-数组类型" aria-hidden="true">#</a> 8. 数组类型</h3><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">let</span> numbers<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">,</span> <span class="token number">5</span><span class="token punctuation">]</span>
<span class="token keyword">let</span> numbers1<span class="token operator">:</span> <span class="token builtin">Array</span><span class="token operator">&lt;</span><span class="token builtin">number</span><span class="token operator">&gt;</span> <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">,</span> <span class="token number">5</span><span class="token punctuation">]</span> <span class="token comment">//啰嗦，不推荐</span>
<span class="token keyword">let</span> b<span class="token operator">:</span> <span class="token builtin">boolean</span><span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token boolean">true</span><span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">]</span>
<span class="token comment">// 联合类型（有竖线）：</span>
<span class="token comment">//数组中既有又有</span>
<span class="token keyword">let</span> arr<span class="token operator">:</span> <span class="token punctuation">(</span><span class="token builtin">number</span> <span class="token operator">|</span> <span class="token builtin">string</span><span class="token punctuation">)</span><span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">,</span> <span class="token number">5</span><span class="token punctuation">,</span> <span class="token string">&#39;a&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;b&#39;</span><span class="token punctuation">]</span>
<span class="token comment">//既可以是num类型，又可以是str[]数组类型</span>
<span class="token keyword">let</span> arr1<span class="token operator">:</span> <span class="token builtin">number</span> <span class="token operator">|</span> <span class="token builtin">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string">&#39;a&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;b&#39;</span><span class="token punctuation">]</span>
<span class="token keyword">let</span> arr1<span class="token operator">:</span> <span class="token builtin">number</span> <span class="token operator">|</span> <span class="token builtin">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token number">123</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_9-类型别名" tabindex="-1"><a class="header-anchor" href="#_9-类型别名" aria-hidden="true">#</a> 9. 类型别名</h3><p><span style="color:red;">类型别名</span>（自定义类型）：为任意类型起别名。 使用场景：当同一类型（复杂）被多次使用时，可以通过类型别名，简化该类型的使用。</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">type</span> <span class="token class-name">CustomArray</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token builtin">number</span> <span class="token operator">|</span> <span class="token builtin">string</span><span class="token punctuation">)</span><span class="token punctuation">[</span><span class="token punctuation">]</span>
<span class="token keyword">let</span> arr1<span class="token operator">:</span> CustomArray <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">,</span> <span class="token number">5</span><span class="token punctuation">,</span> <span class="token string">&#39;a&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;b&#39;</span><span class="token punctuation">]</span>
<span class="token keyword">let</span> arr2<span class="token operator">:</span> CustomArray <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token string">&#39;x&#39;</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token string">&#39;y&#39;</span><span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_10-函数类型" tabindex="-1"><a class="header-anchor" href="#_10-函数类型" aria-hidden="true">#</a> 10. 函数类型</h3><p>函数的类型实际上指的是：<span style="color:red;">函数参数</span>和<span style="color:red;">返回值</span>的类型。</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token comment">// 1. 单独指定参数、返回值类型：</span>
<span class="token keyword">function</span> <span class="token function">add</span><span class="token punctuation">(</span>num1<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">,</span> num2<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">number</span> <span class="token punctuation">{</span> <span class="token comment">//函数声明方式</span>
  <span class="token keyword">return</span> num1 <span class="token operator">+</span> num2
<span class="token punctuation">}</span>

<span class="token keyword">const</span> add <span class="token operator">=</span> <span class="token punctuation">(</span>num1<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">,</span> num2<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">number</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span> <span class="token comment">//函数表达式方式</span>
  <span class="token keyword">return</span> num1 <span class="token operator">+</span> num2
<span class="token punctuation">}</span>

<span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token function">add</span><span class="token punctuation">(</span><span class="token number">3</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">)</span>

<span class="token comment">// 2. 同时指定参数、返回值类型：</span>
<span class="token keyword">const</span> <span class="token function-variable function">add</span><span class="token operator">:</span> <span class="token punctuation">(</span>num1<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">,</span> num2<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token function-variable function">number</span> <span class="token operator">=</span> <span class="token punctuation">(</span>num1<span class="token punctuation">,</span> num2<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span> <span class="token comment">//</span>
  <span class="token keyword">return</span> num1 <span class="token operator">+</span> num2
<span class="token punctuation">}</span>
<span class="token comment">//注意：这种形式只适用于函数表达式。</span>

<span class="token comment">// 3. 如果函数没有返回值，那么，函数返回值类型为：void。</span>
<span class="token keyword">function</span> <span class="token function">greet</span><span class="token punctuation">(</span>name<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span> <span class="token punctuation">{</span>
  <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;Hello&#39;</span><span class="token punctuation">,</span> name<span class="token punctuation">)</span>
<span class="token punctuation">}</span>
<span class="token function">greet</span><span class="token punctuation">(</span><span class="token string">&#39;jack&#39;</span><span class="token punctuation">)</span>

<span class="token comment">// 4. 可传可不传参数</span>
<span class="token keyword">function</span> <span class="token function">mySlice</span><span class="token punctuation">(</span>start<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">,</span> end<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span> <span class="token punctuation">{</span> <span class="token comment">//说可选参数后面不能再出现必选参数</span>
  <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;起始索引：&#39;</span><span class="token punctuation">,</span> start<span class="token punctuation">,</span> <span class="token string">&#39;结束索引：&#39;</span><span class="token punctuation">,</span> end<span class="token punctuation">)</span>
<span class="token punctuation">}</span>
<span class="token function">mySlice</span><span class="token punctuation">(</span><span class="token number">10</span><span class="token punctuation">)</span>
<span class="token function">mySlice</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_11-对象类型" tabindex="-1"><a class="header-anchor" href="#_11-对象类型" aria-hidden="true">#</a> 11. 对象类型</h3><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token comment">// let person: { name: string; age: number; sayHi(): void; greet(name: string): void } = {</span>
<span class="token comment">//   name: &#39;刘老师&#39;,</span>
<span class="token comment">//   age: 18,</span>
<span class="token comment">//   sayHi() {},</span>
<span class="token comment">//   greet(name) {}</span>
<span class="token comment">// }</span>

<span class="token keyword">let</span> person<span class="token operator">:</span> <span class="token punctuation">{</span>
  name<span class="token operator">:</span> <span class="token builtin">string</span>
  age<span class="token operator">:</span> <span class="token builtin">number</span>
  <span class="token comment">// sayHi(): void</span>
  <span class="token function-variable function">sayHi</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token keyword">void</span>
  <span class="token function">greet</span><span class="token punctuation">(</span>name<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span>
<span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token punctuation">{</span>
  name<span class="token operator">:</span> <span class="token string">&#39;刘老师&#39;</span><span class="token punctuation">,</span>
  age<span class="token operator">:</span> <span class="token number">18</span><span class="token punctuation">,</span>
  <span class="token function">sayHi</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token function">greet</span><span class="token punctuation">(</span>name<span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_12-对象可选属性" tabindex="-1"><a class="header-anchor" href="#_12-对象可选属性" aria-hidden="true">#</a> 12. 对象可选属性</h3><p>对象的属性或方法，也可以是可选的，此时就用到可选属性了。</p><p>比如，我们在使用 axios({ … }) 时，如果发送 GET 请求，method 属性就可以省略。</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">function</span> <span class="token function">myAxios</span><span class="token punctuation">(</span>config<span class="token operator">:</span> <span class="token punctuation">{</span> url<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">;</span> method<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">string</span> <span class="token punctuation">}</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
<span class="token function">myAxios</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  url<span class="token operator">:</span> <span class="token string">&#39;&#39;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token comment">//？不写，就成必选的了!</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_13-接口" tabindex="-1"><a class="header-anchor" href="#_13-接口" aria-hidden="true">#</a> 13. 接口</h3><p>相当于Java中的类</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token comment">// let person: { name: string; age: number; sayHi(): void } = {</span>
<span class="token comment">//   name: &#39;刘老师&#39;,</span>
<span class="token comment">//   age: 18,</span>
<span class="token comment">//   sayHi() {}</span>
<span class="token comment">// }</span>

<span class="token comment">// let person1: { name: string; age: number; sayHi(): void }</span>

<span class="token comment">// 上面那个又繁琐了</span>
<span class="token comment">// 接口：</span>
<span class="token keyword">interface</span> <span class="token class-name">IPerson</span> <span class="token punctuation">{</span>
  name<span class="token operator">:</span> <span class="token builtin">string</span>
  age<span class="token operator">:</span> <span class="token builtin">number</span>
  <span class="token function">sayHi</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span>
<span class="token punctuation">}</span>

<span class="token keyword">let</span> person<span class="token operator">:</span> IPerson <span class="token operator">=</span> <span class="token punctuation">{</span>
  name<span class="token operator">:</span> <span class="token string">&#39;刘老师&#39;</span><span class="token punctuation">,</span>
  age<span class="token operator">:</span> <span class="token number">18</span><span class="token punctuation">,</span>
  <span class="token function">sayHi</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">let</span> person1<span class="token operator">:</span> IPerson <span class="token operator">=</span> <span class="token punctuation">{</span>
  name<span class="token operator">:</span> <span class="token string">&#39;jack&#39;</span><span class="token punctuation">,</span>
  age<span class="token operator">:</span> <span class="token number">16</span><span class="token punctuation">,</span>
  <span class="token function">sayHi</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_14-interface-接口-和-type-类型别名-的对比" tabindex="-1"><a class="header-anchor" href="#_14-interface-接口-和-type-类型别名-的对比" aria-hidden="true">#</a> 14. interface（接口）和 type（类型别名）的对比</h3><p>相同点：都可以给对象指定类型。</p><p>不同点：</p><ul><li>接口，只能为对象指定类型。</li><li>类型别名，不仅可以为对象指定类型，实际上可以为任意类型指定别名。</li></ul><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token comment">// 接口：</span>
<span class="token comment">// interface IPerson {</span>
<span class="token comment">//   name: string</span>
<span class="token comment">//   age: number</span>
<span class="token comment">//   sayHi(): void</span>
<span class="token comment">// }</span>

<span class="token comment">// 类型别名</span>
<span class="token keyword">type</span> <span class="token class-name">IPerson</span> <span class="token operator">=</span> <span class="token punctuation">{</span>
  name<span class="token operator">:</span> <span class="token builtin">string</span>
  age<span class="token operator">:</span> <span class="token builtin">number</span>
  <span class="token function">sayHi</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span>
<span class="token punctuation">}</span>

<span class="token keyword">let</span> person<span class="token operator">:</span> IPerson <span class="token operator">=</span> <span class="token punctuation">{</span>
  name<span class="token operator">:</span> <span class="token string">&#39;刘老师&#39;</span><span class="token punctuation">,</span>
  age<span class="token operator">:</span> <span class="token number">18</span><span class="token punctuation">,</span>
  <span class="token function">sayHi</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_15-接口继承" tabindex="-1"><a class="header-anchor" href="#_15-接口继承" aria-hidden="true">#</a> 15. 接口继承</h3><p>如果两个接口之间有相同的属性或方法，可以将公共的属性或方法抽离出来，通过继承来实现复用。</p><p>比如，这两个接口都有 x、y 两个属性，重复写两次，可以，但很繁琐。</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">interface</span> <span class="token class-name">Point2D</span> <span class="token punctuation">{</span> x<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">;</span> y<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">}</span>
<span class="token keyword">interface</span> <span class="token class-name">Point3D</span> <span class="token punctuation">{</span> x<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">;</span> y<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">;</span> z<span class="token operator">:</span> <span class="token builtin">number</span> <span class="token punctuation">}</span>

<span class="token comment">// 使用 继承 实现复用：</span>
<span class="token keyword">interface</span> <span class="token class-name">Point3D</span> <span class="token keyword">extends</span> <span class="token class-name">Point2D</span> <span class="token punctuation">{</span>
  z<span class="token operator">:</span> <span class="token builtin">number</span>
<span class="token punctuation">}</span>

<span class="token keyword">let</span> p3<span class="token operator">:</span> Point3D <span class="token operator">=</span> <span class="token punctuation">{</span>
  x<span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span>
  y<span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span>
  z<span class="token operator">:</span> <span class="token number">0</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_16-元组" tabindex="-1"><a class="header-anchor" href="#_16-元组" aria-hidden="true">#</a> 16. 元组</h3><p>场景：在地图中，使用经纬度坐标来标记位置信息。</p><p>可以使用数组来记录坐标，那么，该数组中只有两个元素，并且这两个元素都是数值类型。</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20250109234105553.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>使用 number[] 的缺点：不严谨，因为该类型的数组中可以出现任意多个数字。</p><p>更好的方式：元组（Tuple）。</p><p>元组类型是另一种类型的数组，它确切地知道包含多少个元素，以及特定索引对应的类型。</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">let</span> position<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token builtin">number</span><span class="token punctuation">,</span> <span class="token builtin">string</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token number">39</span><span class="token punctuation">,</span> <span class="token string">&#39;114&#39;</span><span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>元组类型可以确切地标记出有多少个元素，以及每个元素的类型。</p><h3 id="_17-类型推论" tabindex="-1"><a class="header-anchor" href="#_17-类型推论" aria-hidden="true">#</a> 17. 类型推论</h3><p>在 TS 中，某些没有明确指出类型的地方，TS 的类型推论机制会帮助提供类型。</p><p>换句话说：由于类型推论的存在，这些地方，类型注解可以省略不写！</p><p>发生类型推论的 2 种常见场景：1 声明变量<mark>并初始化时</mark> 2 决定函数返回值时。</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token comment">// 声明变量并立即初始化值，此时，可以省略类型注解</span>
<span class="token keyword">let</span> age <span class="token operator">=</span> <span class="token number">18</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token comment">// 注意：如果声明变量但没有立即初始化值，此时，还必须手动添加类型注解</span>
<span class="token keyword">let</span> a<span class="token operator">:</span> <span class="token builtin">number</span>
a <span class="token operator">=</span> <span class="token number">19</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">function</span> <span class="token function">add</span><span class="token punctuation">(</span>num1<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">,</span> num2<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> num1 <span class="token operator">+</span> num2
<span class="token punctuation">}</span>
<span class="token function">add</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">)</span>
<span class="token keyword">function</span> <span class="token function">add</span><span class="token punctuation">(</span>num1<span class="token punctuation">,</span> num2<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">//推荐写上类型</span>
  <span class="token keyword">return</span> num1 <span class="token operator">+</span> num2
<span class="token punctuation">}</span>
<span class="token function">add</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">)</span>
<span class="token function">add</span><span class="token punctuation">(</span><span class="token boolean">false</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_18-类型断言" tabindex="-1"><a class="header-anchor" href="#_18-类型断言" aria-hidden="true">#</a> 18. 类型断言</h3><p>有时候你会比 TS 更加明确一个值的类型，此时，可以使用类型断言来指定更具体的类型。 比如，</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20250110000447082.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20250110000551344.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>注意：getElementById 方法返回值的类型是 HTMLElement，该类型只包含所有标签公共的属性或方法，不包含 a 标签特有的 href 等属性。</p><p>因此，这个类型太宽泛（不具体），无法操作 href 等 a 标签特有的属性或方法。</p><p>解决方式：这种情况下就需要使用类型断言指定更加具体的类型。</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">const</span> aLink <span class="token operator">=</span> document<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">&#39;link&#39;</span><span class="token punctuation">)</span> <span class="token keyword">as</span> HTMLAnchorElement
<span class="token comment">// const aLink = &lt;HTMLAnchorElement&gt;document.getElementById(&#39;link&#39;) 不常用，原因是跟react冲突</span>
aLink<span class="token punctuation">.</span>href
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>解释：</p><ol><li>使用 as 关键字实现类型断言。</li><li>关键字 as 后面的类型是一个更加具体的类型（HTMLAnchorElement 是 HTMLElement 的子类型）。</li><li>通过类型断言，aLink 的类型变得更加具体，这样就可以访问 a 标签特有的属性或方法了。</li></ol><p><mark>技巧</mark>：在浏览器控制台，通过 <code>console.dir($0)</code> 打印 DOM 元素，在属性列表的最后面，即可看到该元素的类型。</p>`,89),o=[t];function c(i,l){return s(),a("div",null,o)}const r=n(p,[["render",c],["__file","typescript.html.vue"]]);export{r as default};
