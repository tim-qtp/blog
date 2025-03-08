import{_ as t,W as p,X as c,$ as s,a0 as n,Z as o,a2 as e,C as i}from"./framework-6a3aa88c.js";const l={},d=e('<h2 id="一、前言" tabindex="-1"><a class="header-anchor" href="#一、前言" aria-hidden="true">#</a> 一、前言</h2><p>近些年来不断有新的语言崛起，比如当下非常火的go语言，不过相比于C++，go语言确实是非常简单的。</p><p>而<code>rust</code>作为一名新兴语言，与go又有些许不同，因为它的目标是对标系统级开发，也就是试图动摇C、C++这两位纵横编程界数十年的老大哥位置。</p><p>比如我们最常用的<code>windows</code>系统，就是用C/C++语言开发的，也正因如此，我们才能用C++在VS中非常方便的调用win API函数。</p><p>而同样的，越是涉及到底层，需要控制的细节就会越多，即使是这位试图通过<strong>简便语法</strong>、<strong>便利包管理</strong>、<strong>安全可靠</strong>等良好特性脱颖而出的rust语言，也同样不例外。</p><p>目前来看，rust语言最大的缺陷是诞生时间太短，生态还不够完善。</p><p>比如当你想要用rust写GUI程序，就很麻烦，因为官方目前还没有推出GUI库。</p><p>但这并非是无法解决的，rust同样意识到了这个问题，所以它提供了简便的方式让你可以直接在代码中调用C语言开发的库，这部分内容可以参考后文。</p><p>这意味着只要是用C语言开发的库，你就能用rust语言调用它进行开发！</p><p>比如你可以使用rust绑定C开发的FLTK、GTK等GUI库就可以进行开发GUI程序了，当然也有正在发展的库，比如egui、iced、tauri等等。</p><blockquote><p>个人目前最推荐的是Tauri，不过前提是你需要会web前端。</p></blockquote><p>而rust带来的代码安全、便捷的开发又是C语言所无法比拟的，所以我预测要不了多少年，随着Rust生态的不断完善，会取代很大一部分C/C++的份额。</p><p>不过想要彻底将C/C++取代，短时间内还是有点不现实的，比如<code>windows</code>、<code>linux</code>、<code>mac</code>三大操作系统以及各种C/C++开源库的代码量是一个非常恐怖的数字，想要彻底替换，绝非一朝一夕之功。</p><p><strong>同时需要注意：学习rust前，你最好对C/C++语言有一定的了解，否则rust里面的很多概念你都可能无法理解。</strong></p><p>对于刚刚入门编程的同学，我依旧建议你先学C/C++语言，学成之后再来学rust。</p><h2 id="二、rust简介" tabindex="-1"><a class="header-anchor" href="#二、rust简介" aria-hidden="true">#</a> 二、Rust简介</h2><p>参考百度百科：</p><blockquote><p>Rust语言在2006年作为 Mozilla 员工 Graydon Hoare 的私人项目出现，而 Mozilla 于 2009 年开始赞助这个项目。第一个有版本号的 Rust 编译器于2012 年 1 月发布。Rust 1.0 是第一个稳定版本，于 2015年5月15日发布。</p></blockquote><p>可以看到，Rust是2015才对外开放稳定版本的，距今不到10年，根据目前程序员对Rust这门语言的普遍评价来说，现在学习Rust，还有机会享受到这门语言在不久的将来可能会带来的福利。</p><p>事实上现在在国内的招聘市场上，与rust语言相关的岗位已经开始变多了，同时相比之下，rust相关的开发岗位对程序员的要求比C/C++程序员要低不少。</p><p>相比于C/C++，<code>Rust</code>能为开发人员带来很多便捷：</p><ul><li><strong>内存安全</strong>：</li></ul><p>Rust 中的所有内存访问都经过了编译器的严格检查，并且在运行时不会出现空指针异常或数据竞争等问题。这意味着 Rust代码具有更高的可靠性和安全性，可以避免常见的安全漏洞。</p><p>而C/C++中则时常需要担心指针、内存问题，尤其是在大型项目中，非常容易因此出现各种各样的Bug。</p><ul><li><strong>高效性能</strong>：</li></ul><p>Rust具有与 C 和 C++ 相当的性能，并采用了现代语言的特性和设计理念，如智能指针、闭包和模式匹配等。这使得 Rust很适合编写高性能、低延迟的系统级应用程序和库。</p><ul><li><strong>并发性</strong>：</li></ul><p>Rust的所有权系统和借用规则使其易于编写线程安全的代码，即使在多线程环境下也可以保持高效率和可靠性。C/C++中则完全需要自己进行控制。</p><ul><li><strong>社区支持</strong>：</li></ul>',29),u={href:"https://www.rust-lang.org/zh-CN/community",target:"_blank",rel:"noopener noreferrer"},r={href:"https://crates.io/",target:"_blank",rel:"noopener noreferrer"},g=e('<p>C/C++虽然学习的人很多，但却几乎没有官方的、活跃的社区可以供大家交流，都是在各搞各的。</p><ul><li><strong>统一包管理</strong></li></ul><p>C/C++中，最让人诟病的便是包管理了，想要用一个包，还需要自己下载、安装、配置等等。</p><p>而Rust则直接提供了一个统一的包管理程序，只需要写一行代码，就能自动为你下载配置好你所需要的一切，并且还提供对应的文档，使用起来非常方便！</p><p>综上，你便能看出Rust的优势所在了。</p><p>Python语言之所以能火，有很多原因，而其中相当大的一个原因就是Python有一个统一的包管理程序<code>pip</code>，可以很方便的下载各种第三方包，而不需要像C/C++那样自己配置。</p><p>而一旦学会了Rust，即使是作为较为底层的开发人员，我们同样也能享受到这种便利了！</p><p>这是学习C/C++所无法想象的，虽然目前有一个<code>vcpkg</code>包管理库很不错，但这毕竟不是标准委员会推出的，而是微软带头组织的一个开源项目，如果不会科学上网，中国几乎也无法使用。</p><p><strong>RUst特别擅长的领域</strong></p><ul><li>高性能Web Service</li><li>WebAssembly</li><li>命令行工具</li><li>网络编程</li><li>嵌入式设备</li><li>系统编程</li></ul><h2 id="三、安装rust编译器" tabindex="-1"><a class="header-anchor" href="#三、安装rust编译器" aria-hidden="true">#</a> 三、安装Rust编译器</h2><p>与C/C++一样，Rust也是一门编译型语言，也就是说，Rust的代码必须要先编译成为二进制程序之后才能运行。</p><p>比如<code>window</code>系统中我们最常看到的<code>.exe</code>二进制可执行程序。</p><blockquote><p>而python则是解释性语言，无需编译，只要有python的解释器，就能一行一行的解释代码然后执行，这同样也是影响python运行速度的一大原因。</p></blockquote>',14),k=s("code",null,"Rust",-1),h={href:"https://www.rust-lang.org/zh-CN/",target:"_blank",rel:"noopener noreferrer"},m=e(`<p>然后点击“马上开始”：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503082305267.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>之后就是下载Rust的安装器，由于目前一般都是64位的电脑，所以选择第二个即可：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503082314206.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>下载后，点击运行这个程序，等待其安装完毕。</p><p>由于我原本就安装了<code>VS2024</code>，所以它并没有提示我安装任何东西，如果你没有安装VS，则它会要求你安装上方提示的Microsoft C++生成工具，你只需要在命令行中确认安装即可。</p><p>安装完成后，运行命令：<code>cargo --version</code></p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503082316279.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>能打印出版本则说明安装成功了</p><p>第一次使用你可能就会觉得有些疑惑，明明安装的是<code>Rust</code>，这里怎么是<code>Cargo</code>命令呢？</p><p>这一点可以看官网说明：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503082318539.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>简单来说就是<code>Cargo</code>是Rust语言的包管理软件、同时也是构建工具，后面我们开发<code>Rust</code>时，使用的也基本都是这个命令。</p><h2 id="四、第一个rust程序" tabindex="-1"><a class="header-anchor" href="#四、第一个rust程序" aria-hidden="true">#</a> 四、第一个Rust程序</h2><p>我们可以通过命令<code>cargo new projectName</code>来创建一个Rust项目。</p><p>比如运行<code>cargo new hello-world</code>：</p><p>然后它就会为我们在当前目录中生成一个项目文件夹：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503082324766.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>这里简单对其介绍一下：</p><ul><li><code>.git</code>：这是一个隐藏文件夹，用于<code>git</code>软件实现版本管理，学习rust期间一般用不着，不用管。</li><li><code>src</code>：这是存放代码的地方，以后我们写的rust代码就放在这个文件夹里面。</li><li><code>.gitignore</code>：这同样是git使用的，用于忽略哪些类型文件，不进行版本管理，一般同样不用管</li><li><code>Cargo.toml</code> ：这个文件就很重要了，<code>cargo</code>作为rust的包管理程序，就是通过这个文件知道你这个项目中需要哪些依赖库的</li></ul><p>打开<code>Cargo.toml</code>，就能看到下面这样的内容：</p><div class="language-toml line-numbers-mode" data-ext="toml"><pre class="language-toml"><code><span class="token punctuation">[</span><span class="token table class-name">package</span><span class="token punctuation">]</span>
<span class="token key property">name</span> <span class="token punctuation">=</span> <span class="token string">&quot;hello-world&quot;</span>
<span class="token key property">version</span> <span class="token punctuation">=</span> <span class="token string">&quot;0.1.0&quot;</span>
<span class="token key property">edition</span> <span class="token punctuation">=</span> <span class="token string">&quot;2021&quot;</span>

<span class="token punctuation">[</span><span class="token table class-name">dependencies</span><span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>对于你想要用到的库，直接写在<code>[dependencies]</code>项的下面即可，后面我会再对其进行详细介绍。</p><p>然后来到<code>src</code>这个存放rust代码的目录里面：</p><p>这里面默认有一个<code>main.rs</code>文件，其中后缀<code>.rs</code>便是<code>rust</code>的简写，这个文件是<code>rust</code>项目中不可或缺的，因为它将作为整个项目的入口文件。</p><p>注意：不可更改这个文件的名称！否则后面的编译将会直接失败！</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503082327720.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p><code>println!</code>是一个<code>rust</code>中的宏，用于简化我们输出一个字符串到控制台的步骤。</p><p>如果你学过C/C++、python、java等等其它语言，前期学习过程中可以直接把它当作一个<code>print</code>函数即可，只是要注意它的后面先有一个<code>!</code>、然后才是<code>()</code>。</p><p>现在回到控制台，进入这个文件夹，然后来运行这段代码试一试，运行代码的命令为<code>cargo run</code>：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503082328660.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>然后就可以看到它成功运行并打印出了<code>Hello World!</code>字符串。</p><p>如果你学过C/C++，会发现到目前为止，<code>rust</code>比<code>C/C++</code>会稍稍复杂一点，毕竟<code>C/C++</code>只需要一个源代码文件就能输出<code>hello world</code>了，而<code>rust</code>却一上来就给我们生成了这么多文件。</p><p>但很快你就会发现rust这样做的好处，尤其是在后面开发项目时。</p><p>前面我们说了，rust是一个编译型的语言，所以会编译成二进制后才能运行，我们可以在下面的目录中找到这个生成的<code>exe</code>程序：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503082329672.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>不过直接点击它运行是不行的，因为前面的代码中我们只写了一个打印字符串的代码，打印完程序就结束了，所以你只能看到一个黑影闪过，后面我们会想办法解决这个问题。</p><p>上面提到的这个<code>cargo run</code>命令即为编译并运行当前项目的意思，可如果我只想编译，不运行呢？</p><p>那就可以使用命令<code>cargo build</code>，其默认构建的是<code>Debug</code>版本，即可调试版本，直观的来说就是生成的<code>exe</code>程序会稍微比较大。</p><p>我们也可以构建<code>Release</code>版本，使用命令：<code>cargo build --release</code>，直观来说，这个命令生成的可执行文件会较小：</p><p>如果你还是觉得它比较大，那么我们还可以使用一些工具来进一步压缩它，可以让它只有<code>几十kb</code>，有兴趣的可以了解一下<code>upx</code>工具。</p><h2 id="五、-ide环境" tabindex="-1"><a class="header-anchor" href="#五、-ide环境" aria-hidden="true">#</a> 五、 IDE环境</h2><p>个人推荐<code>VSCode</code>这款编辑器，它也是目前最受欢迎的一个编辑器。</p><p>点击左边的插件选项，然后在上面输入rust进行搜索，然后安装<code>rust-analyzer</code>即可：</p><p>这样就完成了rust的开发环境的配置，现在当你输出前几个字符时，就会自动弹出代码提示：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503082333220.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>这时，你只需要按<code>Enter</code>键就可以自动帮你填充代码。</p><p>并且运行代码的方式也变简单了，只需要点击main函数上面的按钮，就可以直接运行：</p><p>同时你也可以直接点击<code>Debug</code>进入调试状态：</p><h2 id="六、初识包管理" tabindex="-1"><a class="header-anchor" href="#六、初识包管理" aria-hidden="true">#</a> 六、初识包管理</h2><p>配置好IDE后，我们再来试一下rust官网提供的一个示例，来看看rust的包管理有多好用。</p><p>比如我想要在终端打印出下面这个图案：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503082347059.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>这里就用到了<code>ferris-says</code>这个库，首先来到前面提到的<code>Cargo.toml</code>文件，然后在<code>[dependencies]</code>项添加一下这个库：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503082335936.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>后面的数字是这个库的版本号，<code>Ctrl+S</code>保存后，vscode就会自动给我们拉取这个库包到本地。</p><p>你可能也注意到了不知道什么时候，项目文件夹中多了一个<code>Cargo.lock</code>文件。</p><p>这个文件用于记录我们当前项目用到的所有库以及依赖，是由cargo自动管理的，我们无需操心。</p><p>虽然看上去它和<code>Cargo.toml</code>文件的作用有些重复多余，但实际上两者之间的区别还是很大的，<code>Cargo.toml</code>文件主要用于我们开发者指定各种项目信息、包依赖信息。</p><p>而<code>Cargo.lock</code>文件则是专门用来锁定某个库版本的，比如当你依赖了A、B这两个库，但A、B这两个库内部都依赖了C库，那么此时如何选择C库的版本呢？</p><p>这便是这个<code>Cargo.lock</code>所做的事了，rust编译器会根据规则指定此时C库的版本、并将其写入<code>Cargo.lock</code>文件中，这样做的好处就是，只要程序能在你本地编译成功，那么将这个<code>Cargo.lock</code>文件发给别人，别人也一定能编译成功，因此此时依赖包是完全一样的。</p><p>相反，如果不发Cargo.lock，只发源码与Cargo.toml配置文件，实际别人编译的程序和你编程的程序所依赖的包版本是不一定相同的，这在一些需要多人合作开发的大型项目中需要额外注意，否则很容易引发一些奇怪的问题。</p><p>现在来到代码中，让我们来使用一下这个库</p><div class="language-rust line-numbers-mode" data-ext="rs"><pre class="language-rust"><code><span class="token keyword">use</span> <span class="token namespace">ferris_says<span class="token punctuation">::</span></span>say<span class="token punctuation">;</span> <span class="token comment">// from the previous step</span>
<span class="token keyword">use</span> <span class="token namespace">std<span class="token punctuation">::</span>io<span class="token punctuation">::</span></span><span class="token punctuation">{</span>stdout<span class="token punctuation">,</span> <span class="token class-name">BufWriter</span><span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token keyword">fn</span> <span class="token function-definition function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">let</span> stdout <span class="token operator">=</span> <span class="token function">stdout</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">let</span> message <span class="token operator">=</span> <span class="token class-name">String</span><span class="token punctuation">::</span><span class="token function">from</span><span class="token punctuation">(</span><span class="token string">&quot;Hello https://tim-qtp.github.io/blog&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">let</span> width <span class="token operator">=</span> message<span class="token punctuation">.</span><span class="token function">chars</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">count</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token keyword">let</span> <span class="token keyword">mut</span> writer <span class="token operator">=</span> <span class="token class-name">BufWriter</span><span class="token punctuation">::</span><span class="token function">new</span><span class="token punctuation">(</span>stdout<span class="token punctuation">.</span><span class="token function">lock</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token function">say</span><span class="token punctuation">(</span>message<span class="token punctuation">.</span><span class="token function">as_bytes</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> width<span class="token punctuation">,</span> <span class="token operator">&amp;</span><span class="token keyword">mut</span> writer<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">unwrap</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>第一次看上去，你可能会感觉怎么有点复杂啊？</p><p>因为这一小段代码就涉及到了rust中相当多的概念，所以我暂时并不会讲解这段代码的逻辑，你可以自己随意更改这段代码里面的字符串：<code>&quot;Hello https://tim-qtp.github.io/blog&quot;</code></p><p>然后运行上面这段代码，就能在终端看到输出的图案了。</p><p>而这个库的下载安装位置默认为当前用户文件夹的<code>.Cargo</code>文件夹中</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503082344028.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>至于库代码上层的这个文件夹，则是代表着仓库名，你的可能是和我的一样是<code>github</code>之类的，这个不一定相同。</p><h2 id="七、总结" tabindex="-1"><a class="header-anchor" href="#七、总结" aria-hidden="true">#</a> 七、总结</h2><p>这是该系列笔记的第一章，主要介绍了rust的特点、安装、项目结构、IDE环境配置、代码运行。</p><p>主要有以下几个命令需要稍微记忆一下：</p><ul><li><code>cargo new</code>：新建一个rust项目</li><li><code>cargo run</code> ：直接运行代码</li><li><code>cargo build</code> ：只编译代码，不运行，默认编译的为<code>debug</code>版本</li><li><code>cargo build --release</code>：编译为<code>release</code>版本</li></ul><p>同时还可以使用upx工具减小最终编译程序的体积。</p><p>除此之外，如果你需要更新rust版本，非常的简单，只需要运行一下命令即可：<code>rustup update</code></p>`,76);function f(b,C){const a=i("ExternalLinkIcon");return p(),c("div",null,[d,s("p",null,[n("Rust拥有活跃的"),s("a",u,[n("社区"),o(a)]),n("，在"),s("a",r,[n("crates"),o(a)]),n("上提供了许多开源库、工具和框架，可以大幅度提升开发效率。")]),g,s("p",null,[n("一般在浏览器中直接搜索"),k,n("，出现的第一个就是Rust的官网了，不过我这里也还是放一下它的官网地址，可以直接点击查看："),s("a",h,[n("Rust"),o(a)])]),m])}const v=t(l,[["render",f],["__file","1.Getting Started.html.vue"]]);export{v as default};
