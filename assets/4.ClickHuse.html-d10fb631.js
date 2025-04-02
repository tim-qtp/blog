import{_ as n,W as s,X as a,a2 as p}from"./framework-48328e23.js";const t={},e=p(`<h3 id="_1、oltp与olap" tabindex="-1"><a class="header-anchor" href="#_1、oltp与olap" aria-hidden="true">#</a> 1、OLTP与OLAP</h3><p><strong>OLTP(Online Transaction Processing)联机事务处理系统</strong></p><ul><li>对数据的增删改查等操作</li><li>典型代表有MySQL、Oracle等数据库，对应的网站、系统应用后端数据库</li><li>存储的是业务数据，来记录某类业务事件的发生，比如下单、支付、注册等等</li><li>大多数支持事务</li><li>针对事务进行操作，对响应时间要求高，数据量相对较少</li></ul><p><strong>面临的问题</strong></p><ul><li>针对TP、PB级别的数据，传统的MySQL数据库已经力不从心，尤其是以数据分析这种典型 “全盘” 扫描的统计业务，大规模扫盘已让MySQL不堪重负，为了解决这类问题，从数据应用场景角度分为OLTP与OLAP。</li></ul><p><strong>OLAP(Online Analytical Processing)联机分析处理系统</strong></p><ul><li>OLAP支持复杂的分析操作，侧重决策，并且提供直观易懂的查询结果</li><li>典型代表有<span style="color:#FF0000;">ClickHouse、Doris、StarRocks</span></li><li>数据量非常大，<span style="color:#FF0000;">常规是TB级别的</span></li><li>已添加到数据库的数据<span style="color:#FF0000;">不擅长修改</span></li><li>对于读取，从数据库中提取相当多的行，但只提取列的一小部分</li><li>事务不是必须的</li><li>对数据一致性要求低</li></ul><h3 id="_2、clickhouse基本介绍" tabindex="-1"><a class="header-anchor" href="#_2、clickhouse基本介绍" aria-hidden="true">#</a> 2、ClickHouse基本介绍</h3><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503302219034.png" alt="ClickHouse" tabindex="0" loading="lazy"><figcaption>ClickHouse</figcaption></figure><ul><li>ClickHouse是俄罗斯的Yandex(搜索巨头)于2016年开源的列式存储数据库，使用c++编写，主要用于在线 分析处理查询(OLAP)。</li><li>ClickHouse支持标准的SQL查询语言，并提供了许多常用的查询功能和高级特性，如复杂的聚合函数、窗口函 数和跨表查询等。</li><li>另外还有一些关键特性，像是列式存储/数据分区与线程并行/支持丰富的表引擎</li></ul><h3 id="_3、列式存储" tabindex="-1"><a class="header-anchor" href="#_3、列式存储" aria-hidden="true">#</a> 3、列式存储</h3><p><strong>示例数据：</strong></p><table><thead><tr><th>用户ID</th><th>年龄</th><th>性别</th><th>注册日期</th></tr></thead><tbody><tr><td>1</td><td>25</td><td>M</td><td>2023-01-01</td></tr><tr><td>2</td><td>30</td><td>F</td><td>2023-01-02</td></tr><tr><td>3</td><td>25</td><td>M</td><td>2023-01-03</td></tr><tr><td>4</td><td>35</td><td>M</td><td>2023-01-04</td></tr><tr><td>5</td><td>30</td><td>F</td><td>2023-01-05</td></tr></tbody></table><p><strong>行式存储</strong></p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">,</span><span class="token number">25</span><span class="token punctuation">,</span><span class="token char">&#39;M&#39;</span><span class="token punctuation">,</span>&#39;<span class="token number">2023</span><span class="token operator">-</span><span class="token number">01</span><span class="token operator">-</span><span class="token number">01</span>&#39;<span class="token punctuation">]</span>
<span class="token punctuation">[</span><span class="token number">2</span><span class="token punctuation">,</span><span class="token number">30</span><span class="token punctuation">,</span><span class="token class-name">F</span>&#39;<span class="token punctuation">,</span>‘<span class="token number">2023</span><span class="token operator">-</span><span class="token number">01</span><span class="token operator">-</span><span class="token number">02</span>&#39;<span class="token punctuation">]</span>
<span class="token punctuation">[</span><span class="token number">3</span><span class="token punctuation">,</span><span class="token number">25</span><span class="token punctuation">,</span><span class="token char">&#39;M&#39;</span><span class="token punctuation">,</span>&#39;<span class="token number">2023</span><span class="token operator">-</span><span class="token number">01</span><span class="token operator">-</span><span class="token number">03</span>&#39;<span class="token punctuation">]</span>
<span class="token punctuation">[</span><span class="token number">4</span><span class="token punctuation">,</span><span class="token number">35</span><span class="token punctuation">,</span><span class="token char">&#39;M&#39;</span><span class="token punctuation">,</span>&#39;<span class="token number">2023</span><span class="token operator">-</span><span class="token number">01</span><span class="token operator">-</span><span class="token number">04</span>&#39;<span class="token punctuation">]</span>
<span class="token punctuation">[</span><span class="token number">5</span><span class="token punctuation">,</span><span class="token number">30</span><span class="token punctuation">,</span><span class="token char">&#39;F&#39;</span><span class="token punctuation">,</span>&#39;<span class="token number">2023</span><span class="token operator">-</span><span class="token number">01</span><span class="token operator">-</span><span class="token number">05</span>&#39;<span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>示例数据：</strong></p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>用户<span class="token constant">ID</span>列：<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">,</span><span class="token number">2</span><span class="token punctuation">,</span><span class="token number">3</span><span class="token punctuation">,</span><span class="token number">4</span><span class="token punctuation">,</span><span class="token number">5</span><span class="token punctuation">]</span>
年龄列：<span class="token punctuation">[</span><span class="token number">25</span><span class="token punctuation">,</span><span class="token number">30</span><span class="token punctuation">,</span><span class="token number">25</span><span class="token punctuation">,</span><span class="token number">35</span><span class="token punctuation">,</span><span class="token number">30</span><span class="token punctuation">]</span>
性别列：<span class="token punctuation">[</span><span class="token char">&#39;M&#39;</span><span class="token punctuation">,</span><span class="token char">&#39;F&#39;</span><span class="token punctuation">,</span><span class="token char">&#39;M&#39;</span><span class="token punctuation">,</span><span class="token char">&#39;M&#39;</span><span class="token punctuation">,</span><span class="token char">&#39;F&#39;</span><span class="token punctuation">]</span>
注册日期列：<span class="token punctuation">[</span>&#39;<span class="token number">2023</span><span class="token operator">-</span><span class="token number">01</span><span class="token operator">-</span><span class="token number">01</span><span class="token char">&#39;，&#39;</span><span class="token number">2023</span><span class="token operator">-</span><span class="token number">01</span><span class="token operator">-</span><span class="token number">02</span><span class="token char">&#39;，&#39;</span><span class="token number">2023</span><span class="token operator">-</span><span class="token number">01</span><span class="token operator">-</span><span class="token number">03</span><span class="token char">&#39;，&#39;</span><span class="token number">2023</span><span class="token operator">-</span><span class="token number">01</span><span class="token operator">-</span><span class="token number">04</span><span class="token char">&#39;，&#39;</span><span class="token number">2023</span><span class="token operator">-</span><span class="token number">01</span><span class="token operator">-</span><span class="token number">05</span>&#39;<span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>列式存储的优点：</strong></p><ul><li><p>不用读取整行，计数，求和等统计操作优于行式存储（比如说，这个数据库中有几名男性）</p></li><li><p>查询<span style="color:#FF0000;">部分列</span>时（因为只取某一列），查询IO量小</p></li><li><p>同一列数据类型相同，更容易进行数据压缩</p><ul><li><p>RLE/Delta/LZ4/字典压缩等压缩算法</p><p>对于性别列[‘M’, ‘F’, ‘M&#39;, ’M’, ’F’]，可以使用字典压缩算法：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>原始数据：<span class="token punctuation">[</span><span class="token char">&#39;M&#39;</span><span class="token punctuation">,</span><span class="token char">&#39;F&#39;</span><span class="token punctuation">,</span><span class="token char">&#39;M&#39;</span><span class="token punctuation">,</span><span class="token char">&#39;M&#39;</span><span class="token punctuation">,</span><span class="token char">&#39;F&#39;</span><span class="token punctuation">]</span>
字典：<span class="token punctuation">[</span><span class="token char">&#39;M&#39;</span><span class="token operator">:</span><span class="token number">0</span><span class="token punctuation">,</span><span class="token class-name">F</span>&#39;<span class="token operator">:</span><span class="token number">1</span><span class="token punctuation">]</span>
压缩数据：<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">,</span><span class="token number">0</span><span class="token punctuation">,</span><span class="token number">0</span><span class="token punctuation">,</span><span class="token number">11</span><span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul></li><li><p>由于压缩后数据量更小，所以更节省磁盘空间，同时可以间接提高缓存命中率与网络中传输效率</p></li></ul><h3 id="_4、数据分区与线程并行" tabindex="-1"><a class="header-anchor" href="#_4、数据分区与线程并行" aria-hidden="true">#</a> 4、数据分区与线程并行</h3><p><strong>一、什么是分区？</strong></p><ul><li>分区就是按照一定的业务逻辑，将数据“分门别类”的整理起来，方便后续的查询和管理</li></ul><p>创建表SQL语句</p><div class="language-sql line-numbers-mode" data-ext="sql"><pre class="language-sql"><code><span class="token keyword">CREATE</span> <span class="token keyword">TABLE</span> test{
    <span class="token identifier"><span class="token punctuation">\`</span>Days<span class="token punctuation">\`</span></span> <span class="token keyword">Date</span><span class="token punctuation">,</span>
    <span class="token identifier"><span class="token punctuation">\`</span>Name<span class="token punctuation">\`</span></span> String<span class="token punctuation">,</span>
    <span class="token identifier"><span class="token punctuation">\`</span>Event<span class="token punctuation">\`</span></span> String
}<span class="token keyword">engine</span><span class="token operator">=</span>MergeTree<span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token keyword">PARTITION</span> <span class="token keyword">BY</span> <span class="token punctuation">(</span>Days<span class="token punctuation">)</span> <span class="token keyword">ORDER</span> <span class="token keyword">BY</span> <span class="token punctuation">(</span>Name<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503302308671.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p><strong>二、线程并行指的是什么？</strong></p><p>ClickHouse将数据划分为多个partition,面对涉及跨分区的查询统计，ClickHouse会以分区为单位并行处理</p><ul><li>优点：在这种设计下，单条Query就能利用整机所有CPU。极致的并行处理能力，极大的降低了查询延时</li><li>缺点：对于单条查询使用多CPU核心，不利于同时并发多条查询。所以<span style="color:#FF0000;">对于高QPS的查询业务</span>，ClickHouse并不是强项。</li></ul><h3 id="_5、支持丰富表引擎" tabindex="-1"><a class="header-anchor" href="#_5、支持丰富表引擎" aria-hidden="true">#</a> 5、支持丰富表引擎</h3><p><strong>表引擎决定了什么？</strong></p><ul><li>数据的存储方式和位置，写到哪里以及从哪里读取数据</li><li>支持哪些查询以及如何支持</li><li>如何并发数据访问，是否可以执行多线程请求</li><li>是否存在索引，以及如何使用索引</li><li>数据复制如何进行复制</li></ul><p><strong>有哪些表引擎？</strong></p><ul><li>MergeTree：最常用的，仅持分区，支持TTL</li><li>日志引擎：具有最小功能的轻量级引擎。当您需要快速写入许多小表（最多约100万行）并在以后整体读取它们时，该类型的引擎是最有效的。TinyLog./StripeLog/Log</li><li>集成引擎：用于与其他的数据存储与处理系统集成的引擎。支kafka/MySQL/ODBC/JDBC/HDFS</li><li>用于其他特定功能的引擎</li></ul><h3 id="_6、直视其缺点" tabindex="-1"><a class="header-anchor" href="#_6、直视其缺点" aria-hidden="true">#</a> 6、直视其缺点</h3><p><strong>1.不支持高并发请求</strong></p><ul><li>ClickHouse的查询性能好，指的不是同时对外提供的QPS；而是可以在海量数据中快速进行检索的性能</li><li>ClickHouse快是因为采用了并行处理机制，即使一个查询，也会用服务器一半的CPU去执行</li><li>所以ClickHouse.不能支持高并发的使用场景</li></ul><p><strong>2.对Update/Delete支持不好</strong></p><ul><li>ClickHouse在数据导入时全部是顺序Append写，写入后数据段不可更改；顺序写的特性即便在机械硬盘 上也有着优异的写入性能。</li><li>为了支持修改，Clickhouse提供了一套单独的异步机制去操作</li></ul><p><strong>3.单个插入性能低</strong></p><ul><li>每次批量Insert都会生成一个新的Data Part，Data Part就是分区里的一个文件</li><li>如果每次只插入一条数据，在查询的时候，就会影响查询效率，因为他需要扫描分区内的所有Data Part</li></ul><h3 id="_7、适用场景" tabindex="-1"><a class="header-anchor" href="#_7、适用场景" aria-hidden="true">#</a> 7、适用场景</h3><ul><li>数据量大的，数据分析的场景</li><li>适合作为大宽表，即包含大量列（几百甚至上千列）的表结构，当需要分析海量数据但只涉及少数几列时，性能极高</li><li>数据批量写入，且数据少更新或不更新</li><li>无需事务，数据一致性要求低</li></ul><h3 id="_8、不适用场景" tabindex="-1"><a class="header-anchor" href="#_8、不适用场景" aria-hidden="true">#</a> 8、不适用场景</h3><ul><li>不支持事务，不适合作为“业务数据库”</li><li>不擅长根据主键按行粒度进行查询，故不应该把clickhouse当做key-value数据库使用</li><li>不擅长频繁的更新和删除数据操作</li></ul>`,44),l=[e];function o(c,i){return s(),a("div",null,l)}const r=n(t,[["render",o],["__file","4.ClickHuse.html.vue"]]);export{r as default};
