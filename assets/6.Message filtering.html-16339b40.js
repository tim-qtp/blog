import{_ as a,W as t,X as p,a2 as n,$ as s}from"./framework-6a3aa88c.js";const e={},o=n(`<p>按照发布订阅模型，RocketMQ 会将所有订阅了主题的消息都投递给消费者，但有时候消费者只关心消息里的<strong>某一内容</strong>而不是全量消息。</p><p>比如订单系统订单状态的改变需要被不同的子系统处理，而下游不同系统需要不同状态的订单：</p><ul><li>库存系统只关心已支付的订单，用来扣减库存</li><li>物流系统只关心待发货订单，用于安排发货</li><li>会计系统关心所有已完成的订单，且金额大于1000元的订单，用于财务统计</li></ul><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503091220560.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>这个时候怎么办呢？聪明的你肯定想到这还不简单，在各自系统做逻辑判断，全量接收后，各自系统做过滤呗。</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503091220496.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>这当然不是优雅的办法（追求优雅的道路不能停🐶），消息多了是会耗费资源和传输带宽的，要想解决这个问题，其实就用到了 RocketMQ 的<strong>消息过滤</strong>机制。</p><h2 id="什么是消息过滤" tabindex="-1"><a class="header-anchor" href="#什么是消息过滤" aria-hidden="true">#</a> 什么是消息过滤</h2><p>消息过滤是 RocketMQ 提供的一种帮助消费者高效过滤自己需要消息的机制。</p><blockquote><p>当然了，过滤是将符合条件的消息投递给消费者，而不是将消息过滤掉。</p></blockquote><p>也就是在 RocketMQ 投递消息的时候，就已经确定了消费者需要什么消息，而不是一股脑的都喂给消费者，这叫什么？</p><p>这就叫<strong>投其所好</strong>。（看到没，计算机的世界同样如此）</p><p>现在库存系统只想要已支付订单的消息是吧？</p><p>好，那我就只吧已支付订单的消息给你，其他消息就算烂掉也不给你，你也没说要啊。</p><p>用一张图来解释下会更清晰：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503091220550.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h2 id="消息过滤原理" tabindex="-1"><a class="header-anchor" href="#消息过滤原理" aria-hidden="true">#</a> 消息过滤原理</h2><p>问题很多的小明他又问了，那么消息过滤是怎么实现的，RocketMQ 怎么知道我想要什么消息，哪些消息投递给我呢？</p><p>但凡是要投其所好，得先知道对方喜欢什么吧？在 RocketMQ 中有一个强大的功能，可以对消息打标签，也可以对消息自定义属性。</p><p>这个很好理解，生产者在发送消息的时候就对消息做好标签和属性管理，在 RocketMQ 服务端仅需要根据过滤条件进行筛选，消费者订阅对应标签和属性的消息即可。</p><p>同样拿订单系统为例，将订单消息打好标签（已支付、待发货、已完成），库存系统现在仅需要已支付的订单，RocketMQ 就把标签是已支付的订单消息发给库存系统。</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503091220465.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>这其实主要是三方做下简单设置：</p><ul><li>生产者：发送消息的时候，给消息定义属性和标签</li><li>消费者：调用订阅关系注册接口告诉 RocketMQ 我想要哪些标签或属性的消息</li><li>RocketMQ 服务端：消费者获取消息时，会触发服务端的过滤算法，按需给消费者对应消息</li></ul><p>以上就是消息过滤的原理，看起来是不是蛮简单的，那具体该怎么操作呢？</p><h2 id="如何进行消息过滤" tabindex="-1"><a class="header-anchor" href="#如何进行消息过滤" aria-hidden="true">#</a> 如何进行消息过滤</h2><p>了解了消息过滤原理不难知道，首先是生产者设置标签或属性，然后消费者在<strong>订阅关系</strong>中指定自己需要的标签和属性即可完成。</p><blockquote><p>这里说的订阅关系，其实就是消费者获取消息的配置。</p></blockquote><p>消息过滤分 2 大类型，一种是 <strong>tag 标签过滤</strong>，一种是 <strong>SQL 属性过滤</strong>。</p><p>对于简单场景打个标签过滤就行了，但如果你的业务足够复杂，需要自定义过滤条件，那就得需要 <strong>SQL 属性过滤</strong>。</p><h3 id="tag-消息过滤" tabindex="-1"><a class="header-anchor" href="#tag-消息过滤" aria-hidden="true">#</a> Tag 消息过滤</h3><p>这是最常用的消息过滤类型了，生产者设置消息标签，消费者选择对应标签下的消息消费。</p><p>那么生产者如何对消息打标签呢？看看实例代码吧：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token class-name">Message</span> message <span class="token operator">=</span> messageBuilder<span class="token punctuation">.</span><span class="token function">setTopic</span><span class="token punctuation">(</span><span class="token string">&quot;topic&quot;</span><span class="token punctuation">)</span>
<span class="token comment">//设置消息索引键，可根据关键字精确查找某条消息。</span>
<span class="token punctuation">.</span><span class="token function">setKeys</span><span class="token punctuation">(</span><span class="token string">&quot;messageKey&quot;</span><span class="token punctuation">)</span>
<span class="token comment">//设置消息Tag，用于消费端根据指定Tag过滤消息。</span>
<span class="token comment">//该示例表示消息的Tag设置为&quot;TagA&quot;。</span>
<span class="token punctuation">.</span><span class="token function">setTag</span><span class="token punctuation">(</span><span class="token string">&quot;TagA&quot;</span><span class="token punctuation">)</span>
<span class="token comment">//消息体。</span>
<span class="token punctuation">.</span><span class="token function">setBody</span><span class="token punctuation">(</span><span class="token string">&quot;messageBody&quot;</span><span class="token punctuation">.</span><span class="token function">getBytes</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
<span class="token punctuation">.</span><span class="token function">build</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>看吧，是不是超简单，无非就是 setTag 一下呗。</p><p>消费者端如何拿到这个标签下的消息呢？看看示例代码：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token punctuation">[</span><span class="token class-name">Type</span><span class="token operator">/</span><span class="token class-name">Paste</span> <span class="token class-name">Your</span> <span class="token class-name">Code</span><span class="token punctuation">]</span><span class="token punctuation">(</span><span class="token operator">&lt;</span><span class="token class-name">String</span> topic <span class="token operator">=</span> <span class="token string">&quot;Your Topic&quot;</span><span class="token punctuation">;</span>
<span class="token comment">//只订阅消息标签为&quot;已支付&quot;的消息。</span>
<span class="token class-name">FilterExpression</span> filterExpression <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">FilterExpression</span><span class="token punctuation">(</span><span class="token string">&quot;yizhifu&quot;</span><span class="token punctuation">,</span> <span class="token class-name">FilterExpressionType</span><span class="token punctuation">.</span><span class="token constant">TAG</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
pushConsumer<span class="token punctuation">.</span><span class="token function">subscribe</span><span class="token punctuation">(</span>topic<span class="token punctuation">,</span> filterExpression<span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token operator">&gt;</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这样就可以匹配单个标签的消息了，那问题很多的小明他又问了，我如果需要匹配多个标签的消息怎么办呢？</p><p>比如客户服务系统，需要知道已完成的订单和退款的订单，用于分析客户行为。</p><p><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503091220524.png" alt="" loading="lazy">那也是没问题的，只需要在消费端匹配多个 tag 标签即可，示例如下：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token class-name">String</span> topic <span class="token operator">=</span> <span class="token string">&quot;Your Topic&quot;</span><span class="token punctuation">;</span>
<span class="token comment">//只订阅消息标签为&quot;已支付&quot;、&quot;待发货&quot;或&quot;已完成&quot;的消息。</span>
<span class="token class-name">FilterExpression</span> filterExpression <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">FilterExpression</span><span class="token punctuation">(</span><span class="token string">&quot;yizhifu||daifahuo||yiwancheng&quot;</span><span class="token punctuation">,</span> <span class="token class-name">FilterExpressionType</span><span class="token punctuation">.</span><span class="token constant">TAG</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
pushConsumer<span class="token punctuation">.</span><span class="token function">subscribe</span><span class="token punctuation">(</span>topic<span class="token punctuation">,</span> filterExpression<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>当然了过滤条件 FilterExpression 中啥也不写，那就是过滤所有标签了：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token punctuation">[</span><span class="token class-name">Type</span><span class="token operator">/</span><span class="token class-name">Paste</span> <span class="token class-name">Your</span> <span class="token class-name">Code</span><span class="token punctuation">]</span><span class="token punctuation">(</span><span class="token operator">&lt;</span><span class="token class-name">String</span> topic <span class="token operator">=</span> <span class="token string">&quot;Your Topic&quot;</span><span class="token punctuation">;</span>
<span class="token comment">//使用Tag标签过滤消息，订阅所有消息。</span>
<span class="token class-name">FilterExpression</span> filterExpression <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">FilterExpression</span><span class="token punctuation">(</span><span class="token string">&quot;*&quot;</span><span class="token punctuation">,</span> <span class="token class-name">FilterExpressionType</span><span class="token punctuation">.</span><span class="token constant">TAG</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
pushConsumer<span class="token punctuation">.</span><span class="token function">subscribe</span><span class="token punctuation">(</span>topic<span class="token punctuation">,</span> filterExpression<span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token operator">&gt;</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="sql-属性过滤" tabindex="-1"><a class="header-anchor" href="#sql-属性过滤" aria-hidden="true">#</a> SQL 属性过滤</h3><p>这是一种高级的过滤方式，有多高级呢？其实也没多高级😂，无非是生产者对消息设置 key-value 属性，消费者设置 <strong>SQL 语法的过滤表达式</strong>即可。</p><blockquote><p>其实在 SQL 语法中，如果定义了属性 TAGS，那其实也是 tag 标签。</p></blockquote><p>同样是上面的订单系统，订单的状态也可以用属性来定义，比如属性就叫做 status，也就是 key 是 status，那么不同的状态就对应不同的 value 值：</p>`,47),c=s("ul",null,[s("li",{"status:Havepaid":""},"已支付："),s("li",{"status:waitsent":""},"待发货："),s("li",{"status:complete":""},"已完成：")],-1),i=n(`<p>对应的过滤效果如下图所示：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503091220533.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>生产者设置消息的属性：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token class-name">Message</span> message <span class="token operator">=</span> messageBuilder<span class="token punctuation">.</span><span class="token function">setTopic</span><span class="token punctuation">(</span><span class="token string">&quot;topic&quot;</span><span class="token punctuation">)</span>
<span class="token comment">//设置消息索引键，可根据关键字精确查找某条消息。</span>
<span class="token punctuation">.</span><span class="token function">setKeys</span><span class="token punctuation">(</span><span class="token string">&quot;messageKey&quot;</span><span class="token punctuation">)</span>
<span class="token comment">//消息也可以设置自定义的分类属性，例如环境标签、地域、逻辑分支。</span>
<span class="token comment">//该示例表示为消息自定义一个属性，该属性为订单状态，属性值为已完成。</span>
<span class="token punctuation">.</span><span class="token function">addProperty</span><span class="token punctuation">(</span><span class="token string">&quot;status&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;complete&quot;</span><span class="token punctuation">)</span>
<span class="token comment">//消息体。</span>
<span class="token punctuation">.</span><span class="token function">setBody</span><span class="token punctuation">(</span><span class="token string">&quot;messageBody&quot;</span><span class="token punctuation">.</span><span class="token function">getBytes</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
<span class="token punctuation">.</span><span class="token function">build</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>那么消费者只需要写对应的 SQL 表达式来选择过滤条件，RocketMQ 中 SQL 过滤使用 <strong>SQL92语法</strong>作为过滤规则表达式。</p><p>那么在消费端就可以进行定义 SQL 过滤表达式来设置过滤条件：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token punctuation">[</span><span class="token class-name">Type</span><span class="token operator">/</span><span class="token class-name">Paste</span> <span class="token class-name">Your</span> <span class="token class-name">Code</span><span class="token punctuation">]</span><span class="token punctuation">(</span><span class="token operator">&lt;</span><span class="token class-name">String</span> topic <span class="token operator">=</span> <span class="token string">&quot;topic&quot;</span><span class="token punctuation">;</span>
<span class="token comment">//只订阅地域属性为杭州的消息。</span>
<span class="token class-name">FilterExpression</span> filterExpression <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">FilterExpression</span><span class="token punctuation">(</span><span class="token string">&quot;statu IS NOT NULL AND statu=&#39;complete&#39;&quot;</span><span class="token punctuation">,</span> <span class="token class-name">FilterExpressionType</span><span class="token punctuation">.</span><span class="token constant">SQL92</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
simpleConsumer<span class="token punctuation">.</span><span class="token function">subscribe</span><span class="token punctuation">(</span>topic<span class="token punctuation">,</span> filterExpression<span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token operator">&gt;</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,7),l=[o,c,i];function u(r,k){return t(),p("div",null,l)}const g=a(e,[["render",u],["__file","6.Message filtering.html.vue"]]);export{g as default};
