import{_ as a,W as l,X as r,$ as i,a0 as e,Z as d,a2 as n,C as u}from"./framework-6a3aa88c.js";const t={},c=n(`<h2 id="_1-apache-druid日志实时分析" tabindex="-1"><a class="header-anchor" href="#_1-apache-druid日志实时分析" aria-hidden="true">#</a> 1 Apache Druid日志实时分析</h2><h3 id="_1-1-业务分析" tabindex="-1"><a class="header-anchor" href="#_1-1-业务分析" aria-hidden="true">#</a> 1.1 业务分析</h3><p>​ 秒杀业务中，通常会有很多用户同时蜂拥而上去抢购热卖商品，经常会出现抢购人数远大于商品库存。其实在秒杀过程中，热卖商品并不多，几乎只占1%，而99%的流量都源自热卖商品，很有可能因为这1%的热卖商品导致服务器宕机，因此针对热卖商品我们要做特殊处理。</p><p>​ 热卖商品我们这里称为热点商品，针对热点商品的处理，有这么几种思路，一是优化，二是限制，三是隔离。</p><p>​ 优化：优化热点数据最有效的办法就是缓存热点数据。</p><p>​ 限制：限制其实是一种削峰手段，我们可以把热点商品抢单采用队列来存储用户抢单信息，将热点抢单限制在一个队列里，防止热点商品抢单占用太多的资源服务，而使得其他服务无法获取抢单机会。</p><p>​ 隔离：隔离其实就是将热点商品和非热点商品进行数据源的隔离、操作流程的隔离，不要因为1%的热点数据影响到另外的99%数据。我们可以把热点商品数据存储到缓存中和非热点数据分开，抢单程序也可以和非热点抢单分开。</p><p>​ 热点数据又分为离线热点数据和实时热点数据，离线热点数据主要是分析过往热点商品信息，这个统计起来并无难度，但根据用户抢单实时数据进行分析是一个很困难的事。</p><p>首先要存储大量的访问信息，同时还能高效的实时统计访问日志信息，从中获取热点商品信息。</p><h3 id="_1-2-apache-druid" tabindex="-1"><a class="header-anchor" href="#_1-2-apache-druid" aria-hidden="true">#</a> 1.2 Apache Druid</h3><h4 id="_1-2-1-apache-druid介绍" tabindex="-1"><a class="header-anchor" href="#_1-2-1-apache-druid介绍" aria-hidden="true">#</a> 1.2.1 Apache Druid介绍</h4><p><strong>介绍</strong></p><p>​ Apache Druid 是一个分布式的、支持实时多维 <strong>OLAP</strong> 分析的数据处理系统。它既支持高速的数据实时摄入，也支持实时且灵活的多维数据分析查询。因此 Druid 最常用的场景是大数据背景下、灵活快速的多维 <strong>OLAP</strong> 分析。 另外，Druid 还有一个关键的特点：它支持根据时间戳对数据进行预聚合摄入和聚合分析，因此也有用户经常在有时序数据处理分析的场景中用到它。</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503030024648.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p><strong>OLTP与OLAP的区别：</strong></p><p>OLTP是传统的关系型数据库的主要应用，主要是基本的、日常的事务处理。</p><p>OLAP是数据仓库系统的主要应用，支持复杂的分析操作，侧重决策支持，并且提供直观易懂的分析查询结果。</p><p>OLAP和OLTP区别：</p><table><thead><tr><th></th><th>OLTP</th><th>OLAP</th></tr></thead><tbody><tr><td>用户</td><td>面向操作人员，支持日常操作</td><td>面向决策人员，支持管理需要</td></tr><tr><td>功能</td><td>日常操作处理</td><td><mark>分析决策</mark></td></tr><tr><td>DB 设计</td><td>面向应用，事务驱动</td><td>面向主题，分析驱动</td></tr><tr><td>数据</td><td>当前的，最新的细节的</td><td>历史的，聚集的，多维的，集成的，统一的</td></tr><tr><td>存取</td><td>可更新，读/写数十条记录</td><td>不可更新，但周期性刷新，读上百万条记录</td></tr><tr><td>工作单位</td><td>简单的事务</td><td>复杂的查询</td></tr><tr><td>DB 大小</td><td>100MB-GB</td><td>100GB-TB</td></tr></tbody></table><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503030016371.png" alt="-" style="zoom:50%;"><p>OLTP就是面向我们的应用系统数据库的，OLAP是面向数据仓库的。</p><p>Apache Druid 特性：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503022326510.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><div class="language-Plaintext line-numbers-mode" data-ext="Plaintext"><pre class="language-Plaintext"><code>亚秒响应的交互式查询，支持较高并发。
支持实时导入，导入即可被查询，支持高并发导入。
采用分布式 shared-nothing 的架构，可以扩展到PB级。
支持聚合函数，count 和 sum，以及使用 javascript 实现自定义 UDF。
支持复杂的 Aggregator，近似查询的 Aggregator 例如 HyperLoglog 以及 Yahoo 开源的 DataSketches。
支持Groupby，Select，Search查询。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>开源OLAP数据处理系统性能方面我们做个对比：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503022326425.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p><strong>数据摄入</strong></p><p>​ Apache Druid同时支持流式和批量数据摄入。通常通过像 Kafka 这样的消息总线（加载流式数据）或通过像 HDFS 这样的分布式文件系统（加载批量数据）来连接原始数据源。</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503022326322.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h4 id="_1-2-2-apache-druid安装" tabindex="-1"><a class="header-anchor" href="#_1-2-2-apache-druid安装" aria-hidden="true">#</a> 1.2.2 Apache Druid安装</h4><p>下载Druid安装包 <code>https://mirrors.aliyun.com/apache/druid/</code>，注意下载bin版本，不是src源码</p><div class="language-Bash line-numbers-mode" data-ext="Bash"><pre class="language-Bash"><code># 上传资料中的apache-druid-0.20.2-bin.tar.gz，
# 也可以使用命令 wget https://mirrors.aliyun.com/apache/druid/0.20.2/apache-druid-0.20.2-bin.tar.gz获取安装包

# 解压
tar -zxf apache-druid-0.20.2-bin.tar.gz

# 移动到指定位置
mv apache-druid-0.20.2 /usr/local/druid

# 修改时区
cd /usr/local/druid/conf/druid/single-server
sed -i &quot;s/Duser.timezone=UTC/Duser.timezone=UTC+8/g&quot; \`grep Duser.timezone=UTC -rl ./\`

# 进入启动脚本的目录
cd /usr/local/druid/bin

# 选择合适的方式启动(根据实际情况选择不同的启动命令)
# Nano-Quickstart，要求硬件环境：1 CPU, 4GB RAM
./start-nano-quickstart

# 微型快速，要求硬件环境： 4 CPU, 16GB RAM
./start-micro-quickstart

# 小型，要求硬件环境：8 CPU，64GB RAM
./start-single-server-small

# 中型，要求硬件环境：16 CPU，128GB RAM
./start-single-server-medium

# 大型，要求硬件环境：32 CPU，256GB RAM
./start-single-server-large

# 大型X，要求硬件环境：64 CPU，512GB RAM
./start-single-server-xlarge
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,32),v={href:"http://8.141.90.31:8888",target:"_blank",rel:"noopener noreferrer"},o=n(`<h4 id="_1-2-3-数据摄入" tabindex="-1"><a class="header-anchor" href="#_1-2-3-数据摄入" aria-hidden="true">#</a> 1.2.3 数据摄入</h4><h5 id="_1-2-3-1-离线数据摄入" tabindex="-1"><a class="header-anchor" href="#_1-2-3-1-离线数据摄入" aria-hidden="true">#</a> 1.2.3.1 离线数据摄入</h5><p>从一个文件中将数据加载到<code>Apache Druid</code>，参考地址：W<code>&lt;https://druid.apache.org/docs/latest/tutorials/tutorial-batch.html&gt;</code>，如下操作：</p><p>1)点击Load data-&gt;Local disk-&gt;Connect data</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503022326458.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>2)选择要导入的数据</p><p>我们要导入的数据在<code>/usr/local/druid/quickstart/tutorial/wikiticker-2015-09-12-sampled.json.gz</code>,需要把该文件的相对路径填写到右边表单中，再点击Apply，如下图：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503022326605.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>3)解析数据</p><p>在上一个步骤上点击Next:Parse data,此时会解析导入的数据，如下图：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503031349167.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>4)解析时间</p><p>在上一个步骤上点击Next: Parse time，Apache Druid要求每条数据都有一个time列，如果我们导入的数据没有该列，Apache Druid会自动帮助我们创建该列，如下图：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503022326435.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>5)数据分区设置</p><p>点击下一步一直到Partition，我们根据需要设置数据分区方式，如下图：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503022326432.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>讲解：</p><div class="language-Plaintext line-numbers-mode" data-ext="Plaintext"><pre class="language-Plaintext"><code>Type:数据粒度使用的类型
Segment granularity：分片文件每个segment包含的时间戳范围
Force guaranteed rollup：是否启用批量推送模式
Partitioning type：分区类型
Max rows per segment：用于分片。确定每个段中的行数。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>更多参数如下图：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503022326741.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>6)设置数据源</p><p>Publish设置，注意设置数据源名字，这里类似数据库中数据库名字。</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503022326463.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>7)提交配置</p><p>最后一步需要提交配置，如下图，点击submit即可。</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503022326690.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>8)查询一下</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503031423486.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h5 id="_1-2-3-2-实时数据摄入" tabindex="-1"><a class="header-anchor" href="#_1-2-3-2-实时数据摄入" aria-hidden="true">#</a> 1.2.3.2 实时数据摄入</h5><p>​ 前面的案例是离线数据的摄入，接着实现实时数据摄入，我们以收集用户访问商品详情页的访问记录为例，如下图：</p>`,31),m={href:"https://druid.apache.org/docs/latest/tutorials/tutorial-kafka.html",target:"_blank",rel:"noopener noreferrer"},b=n(`<figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503022326049.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503031425373.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>这个界面别关，关了Druid就关了！</p><p>1)load data</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503022326356.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>2)配置Kafka源</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503031431447.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>3)配置数据源名字</p><p>其他的步骤和之前文件摄入一样，直到配置数据源名字，我们配置数据源名字叫itemlogs，最后一步submit和之前一样，如下图：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503022326360.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>刚开始是没有数据库的，因为我们还没有产生数据，当我们产生数据的时候，Druid救护自动生成数据库。</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503022326392.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>查询效果如下：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503031440038.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h4 id="_1-2-4-druid-sql" tabindex="-1"><a class="header-anchor" href="#_1-2-4-druid-sql" aria-hidden="true">#</a> 1.2.4 Druid SQL</h4><h5 id="_1-2-4-1-简介" tabindex="-1"><a class="header-anchor" href="#_1-2-4-1-简介" aria-hidden="true">#</a> 1.2.4.1 简介</h5><p>​ Apache Druid SQL是一个内置的SQL层，是Druid基于JSON的查询语言的替代品，由基于Apache Calcite的解析器和规划器提供支持。Druid SQL将SQL转换为Broker本机Druid查询，然后将其传递给数据进程。除了在<mark>Broker上转换SQL的（轻微）开销</mark>之外，与本机查询相比，没有额外的性能损失。</p><h5 id="_1-2-4-2-语法" tabindex="-1"><a class="header-anchor" href="#_1-2-4-2-语法" aria-hidden="true">#</a> 1.2.4.2 语法</h5><p>每个Druid数据源都显示为“Druid”模式,这也是默认模式，Druid数据源引用为<code>druid.dataSourceName</code>或者简单引用<code>dataSourceName</code>。</p><p>可以选择使用双引号引用数据源和列名等标识符。要在标识符中转义<mark>双引号</mark>，请使用另一个双引号，例如<code>&quot;My &quot;&quot;cat&quot;&quot; identifier&quot;</code>,所有标识符都区分大小写。</p><p>文字字符串应引用单引号，如<code>&#39;foo&#39;</code>,文字数字可以用<code>100</code>（表示整数），<code>100.0</code>（表示浮点值）或<code>1.0e5</code>（科学记数法）等形式编写。时间戳可以写成<code>TIMESTAMP &#39;2000-01-01 00:00:00&#39;</code>。时间算法，可以这样写<code>INTERVAL &#39;1&#39; HOUR</code>，<code>INTERVAL &#39;1 02:03&#39; DAY TO MINUTE</code>，<code>INTERVAL &#39;1-2&#39; YEAR TO MONTH</code>，等等。</p><p>Druid SQL支持具有以下结构的SELECT查询：</p><div class="language-SQL line-numbers-mode" data-ext="SQL"><pre class="language-SQL"><code>[ EXPLAIN PLAN FOR ]
[ WITH tableName [ ( column1, column2, ... ) ] AS ( query ) ]
SELECT [ ALL | DISTINCT ] { * | exprs }
FROM table
[ WHERE expr ]
[ GROUP BY exprs ]
[ HAVING expr ]
[ ORDER BY expr [ ASC | DESC ], expr [ ASC | DESC ], ... ]
[ LIMIT limit ]
[ UNION ALL &lt;another query&gt; ]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>查询所有：</p><div class="language-SQL line-numbers-mode" data-ext="SQL"><pre class="language-SQL"><code>SELECT * FROM logsitems
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>查询count列：</p><div class="language-SQL line-numbers-mode" data-ext="SQL"><pre class="language-SQL"><code>SELECT &quot;count&quot; FROM logsitems
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>查询前2条：</p><div class="language-SQL line-numbers-mode" data-ext="SQL"><pre class="language-SQL"><code>SELECT * FROM logsitems LIMIT 2
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>分组查询：</p><div class="language-SQL line-numbers-mode" data-ext="SQL"><pre class="language-SQL"><code>SELECT ip FROM logsitems GROUP BY ip
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>排序：</p><div class="language-SQL line-numbers-mode" data-ext="SQL"><pre class="language-SQL"><code>SELECT * FROM logsitems ORDER BY __time DESC
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>求和：</p><div class="language-SQL line-numbers-mode" data-ext="SQL"><pre class="language-SQL"><code>SELECT SUM(&quot;count&quot;) FROM logsitems
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>最大值：</p><div class="language-SQL line-numbers-mode" data-ext="SQL"><pre class="language-SQL"><code>SELECT MAX(&quot;count&quot;) FROM logsitems
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>平均值：</p><div class="language-SQL line-numbers-mode" data-ext="SQL"><pre class="language-SQL"><code>SELECT AVG(&quot;count&quot;) FROM logsitems
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>去重查询：</p><div class="language-SQL line-numbers-mode" data-ext="SQL"><pre class="language-SQL"><code>SELECT DISTINCT &quot;count&quot; FROM logsitems
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>查询5年之内的数据：</p><div class="language-SQL line-numbers-mode" data-ext="SQL"><pre class="language-SQL"><code>SELECT * FROM logsitems WHERE __time &gt; = CURRENT_TIMESTAMP - INTERVAL &#39;5&#39; YEAR
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>查询最近1小时访问量超过3的商品(具体的时间粒度根据需求确定)，SQL语句如下：</p><div class="language-SQL line-numbers-mode" data-ext="SQL"><pre class="language-SQL"><code>SELECT uri, COUNT(*) viewCount FROM logsitems 
-- Druid时区是UTC，本地时间是+8
WHERE __time &gt;= CURRENT_TIMESTAMP + INTERVAL &#39;7&#39; HOUR
GROUP BY uri HAVING viewCount &gt;2
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503031556307.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h5 id="_1-2-4-3-jdbc查询apache-druid" tabindex="-1"><a class="header-anchor" href="#_1-2-4-3-jdbc查询apache-druid" aria-hidden="true">#</a> 1.2.4.3 JDBC查询Apache Druid</h5><p>​ Apache Calcite是面向Hadoop的查询引擎，它提供了标准的SQL语言、多种查询优化和连接各种数据源的能力，除此之外，Calcite还提供了OLAP和流处理的查询引擎。</p><p>​ 如果使用java，可以使用Calcite JDBC驱动程序进行Druid SQL查询。可以下载Avatica客户端jar后，将其添加到类路径并使用连接字符串<code>jdbc:avatica:remote:url=http://192.168.211.137:8082/druid/v2/sql/avatica/</code></p><p>在<code>seckill-monitor</code>中引入<code>avatica-core</code>包，如下：</p><div class="language-XML line-numbers-mode" data-ext="XML"><pre class="language-XML"><code>&lt;dependency&gt;
    &lt;groupId&gt;org.apache.calcite.avatica&lt;/groupId&gt;
    &lt;artifactId&gt;avatica-core&lt;/artifactId&gt;
    &lt;version&gt;1.15.0&lt;/version&gt;
&lt;/dependency&gt;

&lt;dependency&gt;
    &lt;groupId&gt;com.alibaba&lt;/groupId&gt;
    &lt;artifactId&gt;druid&lt;/artifactId&gt;
    &lt;version&gt;1.1.12&lt;/version&gt;
&lt;/dependency&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>使用案例：</p><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>package com.seckill.monitor.demo;
import org.apache.calcite.avatica.AvaticaConnection;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class DruidSQlTest {

    public static void main(String[] args) throws Exception {
        //数据库连接地址
        String url = &quot;jdbc:avatica:remote:url=http://8.141.90.31:8888/druid/v2/sql/avatica/&quot;;

        //获取连接对象

        Connection connection = (AvaticaConnection)DriverManager.getConnection(url);
        //Statement
        Statement statement = connection.createStatement();

        //SQL语句
        String sql = &quot;SELECT * FROM logsitems&quot;;

        //执行查询
        ResultSet resultSet = statement.executeQuery(sql);

        //解析结果集
        while (resultSet.next()) {
            System.out.println(&quot;查询到的结果是：&quot; + resultSet.getString(&quot;uri&quot;));
        }

        //关闭资源
        resultSet.close();
        statement.close();
        connection.close();
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以发现，用Java代码获取到了<mark>用户访问点击数据</mark></p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503031744464.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h2 id="_2-热点数据隔离" tabindex="-1"><a class="header-anchor" href="#_2-热点数据隔离" aria-hidden="true">#</a> 2 热点数据隔离</h2><p>​ 热点数据统计主要是为了找出热点数据，找出热点数据后，需要对热点数据采取各种措施，例如隔离、做缓存、优化等。</p><h3 id="_2-1-热点数据隔离流程分析" tabindex="-1"><a class="header-anchor" href="#_2-1-热点数据隔离流程分析" aria-hidden="true">#</a> 2.1 热点数据隔离流程分析</h3><p>​ 这里实现热点数据收集，我们可以以小时为单位，算出平均每小时访问量最高的商品信息，并对该商品信息进行隔离，下单方式也单独处理，流程如下图：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503022326810.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>流程说明：</p><div class="language-Plaintext line-numbers-mode" data-ext="Plaintext"><pre class="language-Plaintext"><code>访问日志收集(在前面的已经完成)
1.用户请求/web/items/路径
2.lua脚本把用户请求日志发到Kafka消息队列中
3.lua脚本执行完异步消息发送后，把请求转发到 /items/ 路径
4.请求 /items/ 路径后，在磁盘中找到html静态页提供给用户。

热点数据实时分析(正在完成的内容)
1.Druid订阅Kafka消息队列，获取用户访问日志
2.热点分析系统实时读取Apache Druid的数据
3.分析哪些商品数据访问频率高
4.在MySQL中对访问频率高的数据进行锁定(修改islock为2)
5.把热点数据存放到Redis缓存中

下单(后续实现下单，在这里只做了解)
用户每次下单的时候，先到Redis缓存中查询该商品是否存在
如果缓存中没有该商品，则为非热点商品，则直接走订单系统下单
如果缓存中存在该商品，则为热点商品，走Kafka排队，不直接下单
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>Redis集群安装</strong></p><div class="language-Bash line-numbers-mode" data-ext="Bash"><pre class="language-Bash"><code>#创建文件目录
mkdir -p /mnt/redis/r1/data
mkdir -p /mnt/redis/r2/data
mkdir -p /mnt/redis/r3/data
mkdir -p /mnt/redis/r4/data
mkdir -p /mnt/redis/r5/data
mkdir -p /mnt/redis/r6/data
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>准备Redis配置文件，需要准备6份，第一份：</p><p>执行命令 <code>vi /mnt/redis/r1/redis.conf</code> 内容为：</p><div class="language-Bash line-numbers-mode" data-ext="Bash"><pre class="language-Bash"><code>port 6381
bind 0.0.0.0
protected-mode no
databases 1
appendonly yes
#开启集群
cluster-enabled yes
cluster-config-file nodes.conf
cluster-node-timeout 15000
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>配置文件注意路径不同，端口号为6381~6381</p><p>编写 <code>vim /mnt/redis/docker-compose.yml</code> ，内容为：</p><div class="language-YAML line-numbers-mode" data-ext="YAML"><pre class="language-YAML"><code>version: &quot;3.6&quot;
services:
  redis1:
    container_name: redis1
    image: redis:5.0.9
    network_mode: host
    volumes:
      - /mnt/redis/r1/redis.conf:/config/redis.conf
      - /mnt/redis/r1/data:/data
    command: [ &quot;redis-server&quot;, /config/redis.conf ]
    restart: always
  redis2:
    container_name: redis2
    image: redis:5.0.9
    network_mode: host
    volumes:
      - /mnt/redis/r2/redis.conf:/config/redis.conf
      - /mnt/redis/r2/data:/data
    command: [ &quot;redis-server&quot;, /config/redis.conf ]
    restart: always
  redis3:
    container_name: redis3
    image: redis:5.0.9
    network_mode: host
    volumes:
      - /mnt/redis/r3/redis.conf:/config/redis.conf
      - /mnt/redis/r3/data:/data
    command: [ &quot;redis-server&quot;, /config/redis.conf ]
    restart: always
  redis4:
    container_name: redis4
    image: redis:5.0.9
    network_mode: host
    volumes:
      - /mnt/redis/r4/redis.conf:/config/redis.conf
      - /mnt/redis/r4/data:/data
    command: [ &quot;redis-server&quot;, /config/redis.conf ]
    restart: always
  redis5:
    container_name: redis5
    image: redis:5.0.9
    network_mode: host
    volumes:
      - /mnt/redis/r5/redis.conf:/config/redis.conf
      - /mnt/redis/r5/data:/data
    command: [ &quot;redis-server&quot;, /config/redis.conf ]
    restart: always
  redis6:
    container_name: redis6
    image: redis:5.0.9
    network_mode: host
    volumes:
      - /mnt/redis/r6/redis.conf:/config/redis.conf
      - /mnt/redis/r6/data:/data
    command: [ &quot;redis-server&quot;, /config/redis.conf ]
    restart: always
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>执行服务编排：</p><div class="language-Bash line-numbers-mode" data-ext="Bash"><pre class="language-Bash"><code>#进入指定路径
cd /mnt/redis

#服务编排启动Redis集群
docker-compose up -d
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503031803249.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>启动集群：</p><div class="language-Bash line-numbers-mode" data-ext="Bash"><pre class="language-Bash"><code># 进入容器内部
docker exec -it redis1 /bin/bash

#执行Redis集群创建命令，注意要修改所有的192.168.200.188为自己设备的实际IP，如果使用云服务器，则使用公网IP
redis-cli --cluster create 8.141.90.31:6381 8.141.90.31:6382 8.141.90.31:6383 8.141.90.31:6384 8.141.90.31:6385 8.141.90.31:6386 --cluster-replicas 1

#集群节点信息
redis-cli -p 6381 cluster nodes

# 连接集群
redis-cli -h 127.0.0.1 -p 6381 -c
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><em>如果卡在</em> <em><code>Waiting for the cluster to join</code></em> <em>这一步，检查端口号是否开放。redis集群除了需要使用7001~7006，还需要开通集群总线端口，端口号为redis端口号+10000 在这里就是端口号为17001~17006的都需要开放</em></p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503031901891.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503031901373.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p><strong>注意：</strong></p><p>集群启动成功后，需要在宿主机中检查集群节点的配置文件（Ctrl+d可以退出容器）</p><div class="language-Bash line-numbers-mode" data-ext="Bash"><pre class="language-Bash"><code>#查看配置文件命令：
cat /mnt/redis/r1/data/nodes.conf

# 如果出现内网IP(例如172.x.x.x)，则需要修改宿主机的集群配置文件
# 检查6个配置文件，把所有的内网IP都改为当前公网IP
# 在宿主机分别执行以下命令，分别进行修改：
vi /mnt/redis/r1/data/nodes.conf
vi /mnt/redis/r2/data/nodes.conf
vi /mnt/redis/r3/data/nodes.conf
vi /mnt/redis/r4/data/nodes.conf
vi /mnt/redis/r5/data/nodes.conf
vi /mnt/redis/r6/data/nodes.conf

#进入指定路径
cd /mnt/redis

#服务编排停止Redis集群并删除容器
docker-compose down

#服务编排启动Redis集群
docker-compose up -d
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503032006574.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="_2-2-实时热点数据分析" tabindex="-1"><a class="header-anchor" href="#_2-2-实时热点数据分析" aria-hidden="true">#</a> 2.2 实时热点数据分析</h3><p>​ 我们在热点数据分析系统中查询Druid，然后将热点数据存入到Redis缓存进行隔离。我们可以采用elastic-job每5秒钟查询一次被访问的商品信息，如果某一个商品最近一小时的访问量超过1000，我们就认为是热点数据。注意这里不是查历史访问量，应该最近一段时间的数据</p><p>热点数据查询出来后，我们需要将热点数据隔离，隔离的方式我们可以直接采用将数据单独存储到Redis的方式隔离。</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503022326981.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>每隔5秒查询一次Druid，并对查询到的热点商品进行隔离操作。需要在seckill-monitor中实现逻辑：</p><div class="language-Plaintext line-numbers-mode" data-ext="Plaintext"><pre class="language-Plaintext"><code>1. 使用Elastic-Job实现定时查询Druid
    1.1 查询redis缓存中已经存在的热点商品ID
    1.2 查询1小时内访问1000次的商品,并排除redis中已有的热点商品
    1.3 查询结果是uri地址，需要进行字符串处理得到商品 ID
    1.4 使用静态任务，每隔5秒查询一次

2. 实现热点数据隔离方法
    2.1 在MySQL中对热点商品进行锁定，就是修改islock状态
            修改条件：id 和 islock为1   修改的值：islock=2
    2.2 如果商品锁定成功(islock修改成功)，则把该商品加入到redis中
    2.3 如果商品锁定失败，则不做任何操作
            需要把商品的库存数量、主键、价格和名称都放到redis中

3. 把第2步实现的隔离方法，放到第1步的定时任务逻辑中
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>需要使用定时任务，所以要在seckill-monitor中的pom.xml添加以下依赖</p><div class="language-XML line-numbers-mode" data-ext="XML"><pre class="language-XML"><code>&lt;!-- ElasticJobAutoConfiguration自动配置类作用--&gt;
&lt;dependency&gt;
    &lt;groupId&gt;com.github.kuhn-he&lt;/groupId&gt;
    &lt;artifactId&gt;elastic-job-lite-spring-boot-starter&lt;/artifactId&gt;
    &lt;version&gt;2.1.5&lt;/version&gt;
&lt;/dependency&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_2-2-1-热点数据查询" tabindex="-1"><a class="header-anchor" href="#_2-2-1-热点数据查询" aria-hidden="true">#</a> 2.2.1 热点数据查询</h4><p>​ 工程名字：<code>seckill-monitor</code>，我们在该工程下实现热点数据查询功能，Redis集群我们就不在这里演示搭建了，直接配置链接使用了。</p><p><strong>1)配置Redis链接</strong></p><p>在seckill-monitor的bootstrap.yml中配置redis集群链接，如下代码：</p><div class="language-Plaintext line-numbers-mode" data-ext="Plaintext"><pre class="language-Plaintext"><code>  redis:
    cluster:
      nodes:
        - redis-server:6381
        - redis-server:6382
        - redis-server:6383
        - redis-server:6384
        - redis-server:6385
        - redis-server:6386
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>2)配置定时任务</strong></p><p>因为我们需要定时去查询Apache Druid，所以我们可以配置elastic-job来查询热点数据，在seckill-monitor的bootstrap.yml中配置如下：</p><div class="language-Plaintext line-numbers-mode" data-ext="Plaintext"><pre class="language-Plaintext"><code>elaticjob:
  zookeeper:
    server-lists: zk-server:3181
    namespace: monitortask
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>3)热点数据查询</strong></p><p>​ 我们查询最近1小时访问量超过1000的商品，真实环境中时间粒度会更小，每次查询的时候，之前已经被定为热点商品的数据要排除。</p><p>SQL语句如下：</p><div class="language-SQL line-numbers-mode" data-ext="SQL"><pre class="language-SQL"><code>SELECT uri, COUNT(*) viewCount FROM logsitems 
-- Druid时区是UTC，本地时间是+8
WHERE __time &gt;= CURRENT_TIMESTAMP + INTERVAL &#39;7&#39; HOUR
GROUP BY uri HAVING viewCount &gt;2
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>接着我们用代码把上面的语句实现定时查询即可，每次查询出来的热点数据需要存入到Redis中进行隔离，存入到Redis中的数据我们给个固定前缀方便查询，key的规则定为：<code>SKU_id</code>,例如：商品id=S990，key=<code>SKU_S990</code>。</p><p>在bootstrap.yml中配置druid连接池：(需要配置 druid-server 对应的ip)</p><div class="language-YAML line-numbers-mode" data-ext="YAML"><pre class="language-YAML"><code>spring:
  application:
    name: seckill-monitor
  datasource: # Druid
    driver-class-name: org.apache.calcite.avatica.remote.Driver
    url: jdbc:avatica:remote:url=http://druid-server:8082/druid/v2/sql/avatica/
    type: com.alibaba.druid.pool.DruidDataSource
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>需求：</strong></p><p>使用Elastic-Job实现定时查询Druid</p><p><strong>步骤：</strong></p><ol><li>查询redis缓存中已经存在的热点商品ID</li><li>查询1小时内访问1000次的商品,并排除redis中已有的热点商品</li><li>查询结果是uri地址，需要进行字符串处理得到商品 ID</li><li>使用静态任务，每隔5秒查询一次</li></ol><p><strong>实现：</strong></p><p>创建<code>com.seckill.monitor.hot.MonitorItemsAccess</code>,在该类中实现查询：</p><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>@Component
public class MonitorItemsAccess {

    @Autowired
    private RedisTemplate redisTemplate;

    @Autowired
    private DruidDataSource dataSource;

    /**
     * 定义热点数据标准：
     * 1.某一件商品访问量&gt;N
     * 2.最近N小时
     */
    public List&lt;String&gt; loadData() throws Exception {
        //获取连接对象
        Connection connection = dataSource.getConnection();
        //Statement
        Statement statement = connection.createStatement();

        //执行查询
        ResultSet resultSet = statement.executeQuery(druidSQL());

        //解析结果集
        List&lt;String&gt; ids = new ArrayList&lt;&gt;();
        while (resultSet.next()) {
            //获取uri,格式：/web/items/S1235433012716498944.html
            String uri = resultSet.getString(&quot;uri&quot;);
            //处理掉/web/items/和.html
            uri = uri.replace(&quot;/web/items/&quot;, &quot;&quot;).replace(&quot;.html&quot;, &quot;&quot;);
            //记录ID
            ids.add(uri);
        }

        //关闭资源
        resultSet.close();
        statement.close();
        connection.close();
        return ids;
    }


    /**
     * SQL组装
     */
    public String druidSQL() {
        //SQL语句
        String prefix = &quot;SELECT uri, COUNT(*) viewCount FROM logsitems &quot; +
                // Druid模式是UTC时区 所有的时间进行 -8 处理
                &quot;WHERE __time &gt;= CURRENT_TIMESTAMP + INTERVAL &#39;7&#39; HOUR &quot;;
        //后部分
        String suffix = &quot;GROUP BY uri HAVING viewCount &gt;2&quot;;

        //SQL中间部分  AND uri NOT IN (&#39;/web/items/S1235433012716498944.html&#39;)
        //SKU_S1235433012716498944
        String sql = &quot;&quot;;

        //基于Redis中存的热点商品的key来过滤排除要查询的数据
        Set&lt;String&gt; keys = redisTemplate.keys(&quot;SKU_*&quot;);//所有以SKU_开始的key全部查询出来
        if (keys != null &amp;&amp; keys.size() &gt; 0) {
            sql = &quot; AND uri NOT IN (&quot;;
            for (String key : keys) {
                sql += &quot;&#39;/web/items/&quot; + key.substring(4) + &quot;.html&#39;,&quot;;
            }
            sql = sql.substring(0, sql.length() - 1);
            sql += &quot;)&quot;;
        }
        return prefix + sql + suffix;
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>4)定时查询热点数据</strong></p><p>我们这里实现每5秒中查询1次热点数据，采用<code>elastic-job</code>定时操作。</p><p>创建<code>com.seckill.monitor.task.MonitorTask</code>,实现定时调用查询热点数据，代码如下：</p><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>@Component
@ElasticSimpleJob(
        cron = &quot;0/5 * * * * ?&quot;,
        jobName = &quot;monitortask&quot;,
        shardingTotalCount = 1
)
public class MonitorTask implements SimpleJob {

    @Autowired
    private MonitorItemsAccess monitorItemsAccess;

    @Autowired
    private SkuFeign skuFeign;

    /**
     * 执行业务逻辑
     */
    @SneakyThrows
    @Override
    public void execute(ShardingContext shardingContext) {
        // 定时任务，每隔5秒查一次
        List&lt;String&gt; ids = monitorItemsAccess.loadData();
        //热点数据隔离
        if (!ids.isEmpty()) {
            System.out.println(&quot;开始进行热点数据隔离，需要隔离的热点商品id是：&quot; + ids.get(0));
            skuFeign.hotIsolation(ids);
        }
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_2-2-2-实时热点数据隔离" tabindex="-1"><a class="header-anchor" href="#_2-2-2-实时热点数据隔离" aria-hidden="true">#</a> 2.2.2 实时热点数据隔离</h4><p>热点数据隔离，首先要将商品从数据库中进行锁定，然后将商品数据导入到Redis。</p><p><strong>需求：</strong></p><p>实现热点数据隔离方法</p><p><strong>步骤：</strong></p><ol><li>在MySQL中对热点商品进行锁定，就是修改islock状态</li></ol><p>修改条件：id 和 islock为1 修改的值：islock=2</p><ol><li>如果商品锁定失败，则不做任何操作</li><li>如果商品锁定成功(islock修改成功)，则把该商品加入到redis中</li></ol><p>需要把商品的库存数量、主键、价格和名称都放到redis中，<mark>后续对商品数据的操作，都在redis中执行，这样速度会快一点</mark></p><p><strong>实现：</strong></p><p>1.在SkuServicelmpl中添加数据隔离方法 2.在SkuController中编写热点数据隔离接口 3.在SkuFeign中添加Feign接口 4.修改MonitorTask定时任务，调用数据隔离接口</p><p><strong>1)Service</strong></p><p>在<code>seckill-goods</code>的<code>com.seckill.goods.service.SkuService</code>中添加隔离方法，代码如下：</p><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>/**
 * 热点商品隔离
 */
void hotIsolation(String id);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在<code>com.seckill.goods.service.impl.SkuServiceImpl</code>中添加隔离实现方法：</p><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>/**
 * 热点商品隔离
 */
@Override
public void hotIsolation(String id) {
    //1.数据库该商品进行锁定操作
    Sku sku = new Sku();
    sku.setIslock(2);   //锁定

    Example example = new Example(Sku.class);
    Example.Criteria criteria = example.createCriteria();
    criteria.andEqualTo(&quot;islock&quot;, 1);
    criteria.andEqualTo(&quot;id&quot;, id);
    //执行锁定
    int count = skuMapper.updateByExampleSelective(sku, example);

    //2.锁定成功了，则把商品存入到Redis缓存进行隔离
    if (count &gt; 0) {
        String key = &quot;SKU_&quot; + id;
        Sku currentSku = skuMapper.selectByPrimaryKey(id);
        //存储商品数量
        redisTemplate.boundHashOps(key).increment(&quot;num&quot;,currentSku.getSeckillNum());
        //存储商品信息
        Map&lt;String,Object&gt; info = new HashMap&lt;String,Object&gt;();
        info.put(&quot;id&quot;,id);
        info.put(&quot;price&quot;,currentSku.getSeckillPrice());
        info.put(&quot;name&quot;,currentSku.getName());
        redisTemplate.boundHashOps(key).put(&quot;info&quot;,info);
    } 
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>2)Controller</strong></p><p>​ 在<code>seckill-goods</code>的<code>com.seckill.goods.controller.SkuController</code>中添加隔离方法调用，代码如下：</p><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>/***
 * 热点商品隔离
 */
@PostMapping(value = &quot;/hot/isolation&quot;)
public Result hotIsolation(@RequestParam List&lt;String&gt; ids){
    if(ids!=null &amp;&amp; ids.size()&gt;0){
        for (String id : ids) {
            skuService.hotIsolation(id);
        }
    }
    return new Result(true,StatusCode.OK,&quot;热点商品隔离成功！&quot;);
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>3)Feign</strong></p><p>在<code>seckill-goods-api</code>的<code>com.seckill.goods.feign.SkuFeign</code>中添加，代码如下：</p><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>/***
 * 热点商品隔离
 */
@PostMapping(value = &quot;/sku/hot/isolation&quot;)
Result hotIsolation(@RequestParam List&lt;String&gt; ids);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>4)热点数据隔离调用</strong></p><p>第实现的隔离方法，放到定时任务逻辑中</p><p>在<code>seckill-monitor</code>的<code>com.seckill.monitor.task.MonitorTask</code>中添加隔离方法调用，代码如下：</p><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>@Autowired
private MonitorItemsAccess monitorItemsAccess;

@Autowired
private SkuFeign skuFeign;

    /**
     * 执行业务逻辑
     */
    @SneakyThrows
    @Override
    public void execute(ShardingContext shardingContext) {
        List&lt;String&gt; ids = monitorItemsAccess.loadData();

        //热点数据隔离
        if (!ids.isEmpty()) {
            skuFeign.hotIsolation(ids);
        }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>5)测试</strong></p><p>我们启动整个服务进行测试，Redis中的数据如下：</p><p>刚开始redis中是没有数据的</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503031958294.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>然后<code>S1235433013827989504</code>islock也是1，没有锁定</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503032000919.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>我现在一直刷新</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503040001422.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>现在发现数据库已经锁定</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503040005565.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>Redis中也查询到了</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503040008050.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><div class="hint-container tip"><p class="hint-container-title">提示</p><p>这里有几个问题，值得思考！</p><ol><li><p>为什么要用Redis集群？数据如何存储？</p><p>可用性更高，秒杀是要应对高并发大流量，需要更强大的处理能力，而Redis的单机版肯定比不上集群，所以我们要使用集群，提高处理能力，提高性能。</p><p>如果使用集群的话，数据是如何存储的？</p><p>因为集群中有很多的节点，在进行数据存储的时候需要保证它的数据的事务性。需要对热点商品相关的数据进行合并来进行一次的存放，以避免出问题。同时存放的这个数据类型呢是用的Redis的哈希类型。</p></li><li><p>如何进行热点/非热点的数据隔离？<img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503040014424.png" alt="" loading="lazy"></p></li><li><p>隔离逻辑中同时对MySQL和Redis进行操作，如何保证减库存数据一致性<img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503040014164.png" alt="" loading="lazy"></p></li></ol></div><h3 id="_2-3-redis集群事务问题" tabindex="-1"><a class="header-anchor" href="#_2-3-redis集群事务问题" aria-hidden="true">#</a> 2.3 Redis集群事务问题</h3><p>​ Redis集群是不具备事务的，单个节点是具备事务的，所以我们商品信息存储到Redis集群多个节点中是没法实现集群事务控制，上面的代码如下图：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503022326120.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>​ 我们观察上面代码，①和②处其实key相同，既然key相同，那么数据一定不是存储在不同节点上，如果把2次操作Redis合成一次操作Reids，就不会有事务问题了，我们可以把上面代码改造一下即可解决事务问题，改造代码如下图：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503022326134.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p><code>com.seckill.goods.service.impl.SkuServiceImpl</code>的hotIsolation方法最终代码：</p><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>/**
 * 热点商品隔离
 */
@Override
public void hotIsolation(String id) {
    //1.数据库该商品进行锁定操作
    Sku sku = new Sku();
    sku.setIslock(2);   //锁定

    Example example = new Example(Sku.class);
    Example.Criteria criteria = example.createCriteria();
    criteria.andEqualTo(&quot;islock&quot;, 1);
    criteria.andEqualTo(&quot;id&quot;, id);
    //执行锁定
    int count = skuMapper.updateByExampleSelective(sku, example);

    //2.锁定成功了，则把商品存入到Redis缓存进行隔离
    if (count &gt; 0) {
        String key = &quot;SKU_&quot; + id;
        Sku currentSku = skuMapper.selectByPrimaryKey(id);
        
        //2.数据合并,处理多次数据库操作的事务问题
        Map&lt;String, Object&gt; dataMap = new HashMap&lt;String, Object&gt;();
        dataMap.put(&quot;num&quot;, currentSku.getSeckillNum());
        //存储商品信息
        Map&lt;String, Object&gt; info = new HashMap&lt;String, Object&gt;();
        info.put(&quot;id&quot;, id);
        info.put(&quot;price&quot;, currentSku.getSeckillPrice());
        info.put(&quot;name&quot;, currentSku.getName());
        dataMap.put(&quot;info&quot;, info);
        //1.2次操作合并成1次
        redisTemplate.boundHashOps(key).putAll(dataMap);
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_3-用户登录" tabindex="-1"><a class="header-anchor" href="#_3-用户登录" aria-hidden="true">#</a> 3 用户登录</h2><p>​ 用户抢单的时候，必须要先登录，我们先编写一个方法，用于实现用户登录，用户登录成功后，每次抢单的时候，还需要识别用户身份，我们这里采用JWT令牌保存用户身份信息，每次抢单识别JWT令牌即可。</p><h3 id="_3-1-jwt令牌" tabindex="-1"><a class="header-anchor" href="#_3-1-jwt令牌" aria-hidden="true">#</a> 3.1 Jwt令牌</h3><p>​ JWT令牌这里我们将实现管理员令牌生成和普通用户令牌生成，管理员和普通用户他们生成了令牌的秘钥一定是不同的。</p><p>​ 在<code>seckill-common</code>工程中添加JWT令牌生成类<code>com.seckill.util.JwtTokenUtil</code>，在该类中实现令牌生成以及令牌解析，代码如下：</p><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>public class JwtTokenUtil {

    //秘钥
    public static final String SECRETUSER = &quot;5pil6aOO5YaN576O5Lmf5q+U5LiN5LiK5bCP6ZuF55qE56yR&quot;;//用户
    public static final String SECRETADMIN = &quot;ADMIN5pil6aOO5YaN576O5Lmf5q+U5LiN5LiK5bCP6ZuF55qE56yR&quot;;//管理员

    /***
     * 生成令牌-管理员
     * @param uid:唯一标识符
     * @param ttlMillis:有效期
     */
    public static String generateTokenAdmin(String uid, Map&lt;String, Object&gt; payload, long ttlMillis) throws Exception {
        return generateToken(uid, payload, ttlMillis, SECRETADMIN);
    }

    /***
     * 生成令牌-普通用户
     * @param uid:唯一标识符
     * @param ttlMillis:有效期
     */
    public static String generateTokenUser(String uid, Map&lt;String, Object&gt; payload, long ttlMillis) throws Exception {
        return generateToken(uid, payload, ttlMillis, SECRETUSER);
    }

    /***
     * 生成令牌
     * @param uid:唯一标识符
     * @param ttlMillis:有效期
     */
    public static String generateToken(String uid, Map&lt;String, Object&gt; payload, long ttlMillis, String secret) throws Exception {
        SignatureAlgorithm signatureAlgorithm = SignatureAlgorithm.HS256;
        long nowMillis = System.currentTimeMillis();
        Date now = new Date(nowMillis);
        Key signingKey = new SecretKeySpec(secret.getBytes(), signatureAlgorithm.getJcaName());

        Map&lt;String, Object&gt; header = new HashMap&lt;&gt;();
        header.put(&quot;typ&quot;, &quot;JWT&quot;);
        header.put(&quot;alg&quot;, &quot;HS256&quot;);
        JwtBuilder builder = Jwts.builder().setId(uid)
                .setIssuedAt(now)
                .setIssuer(uid)
                .setSubject(uid)
                .setHeader(header)
                .signWith(signatureAlgorithm, signingKey);

        //设置载体
        builder.addClaims(payload);

        if (ttlMillis &gt;= 0) {
            long expMillis = nowMillis + ttlMillis;
            Date exp = new Date(expMillis);
            builder.setExpiration(exp);
        }
        return builder.compact();
    }


    /***
     * 解密JWT令牌
     */
    public static Map&lt;String, Object&gt; parseToken(String token) {
        //以Bearer开头处理
        if (token.startsWith(&quot;Bearer&quot;)) {
            token = token.substring(6).trim();
        }

        //秘钥处理
        SignatureAlgorithm signatureAlgorithm = SignatureAlgorithm.HS256;
        Key signingKey = new SecretKeySpec(SECRETUSER.getBytes(), signatureAlgorithm.getJcaName());

        return Jwts.parser()
                .setSigningKey(signingKey)
                .parseClaimsJws(token)
                .getBody();
    }

    public static void main(String[] args) throws Exception {
        Map&lt;String, Object&gt; payload = new HashMap&lt;&gt;();
        payload.put(&quot;username&quot;, &quot;itheima&quot;);
        payload.put(&quot;aaa&quot;, &quot;ccc&quot;);
        payload.put(&quot;bbb&quot;, &quot;ddd&quot;);
        String token = generateTokenUser(UUID.randomUUID().toString(), payload, 10000000L);
        //String token = generateTokenAdmin(UUID.randomUUID().toString(), payload, 10000000L);
        System.out.println(token);

        System.out.println(parseToken(token));
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9<span class="token punctuation">.</span>eyJqdGkiOiJlZDczMDlmMi02MDdhLTRlMTItOWQwMi01OWVjMDc2NDYxZjUiLCJpYXQiOjE3NDEwMjMxNTEsImlzcyI6ImVkNzMwOWYyLTYwN2EtNGUxMi05ZDAyLTU5ZWMwNzY0NjFmNSIsInN1YiI6ImVkNzMwOWYyLTYwN2EtNGUxMi05ZDAyLTU5ZWMwNzY0NjFmNSIsImFhYSI6ImNjYyIsImJiYiI6ImRkZCIsInVzZXJuYW1lIjoiaXRoZWltYSIsImV4cCI6MTc0MTAzMzE1MX0<span class="token punctuation">.</span>zkMrhWJ1M0oSk<span class="token operator">-</span>qOi3qmK1ihWVyTgISXA1t81o1hWEk

<span class="token punctuation">{</span>jti<span class="token operator">=</span>ed7309f2<span class="token operator">-</span><span class="token number">607</span>a<span class="token operator">-</span><span class="token number">4e12</span><span class="token operator">-</span><span class="token number">9d</span><span class="token number">02</span><span class="token operator">-</span><span class="token number">59</span>ec076461f5<span class="token punctuation">,</span> iat<span class="token operator">=</span><span class="token number">1741023151</span><span class="token punctuation">,</span> iss<span class="token operator">=</span>ed7309f2<span class="token operator">-</span><span class="token number">607</span>a<span class="token operator">-</span><span class="token number">4e12</span><span class="token operator">-</span><span class="token number">9d</span><span class="token number">02</span><span class="token operator">-</span><span class="token number">59</span>ec076461f5<span class="token punctuation">,</span> sub<span class="token operator">=</span>ed7309f2<span class="token operator">-</span><span class="token number">607</span>a<span class="token operator">-</span><span class="token number">4e12</span><span class="token operator">-</span><span class="token number">9d</span><span class="token number">02</span><span class="token operator">-</span><span class="token number">59</span>ec076461f5<span class="token punctuation">,</span> aaa<span class="token operator">=</span>ccc<span class="token punctuation">,</span> bbb<span class="token operator">=</span>ddd<span class="token punctuation">,</span> username<span class="token operator">=</span>itheima<span class="token punctuation">,</span> exp<span class="token operator">=</span><span class="token number">1741033151</span><span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-2-用户登录" tabindex="-1"><a class="header-anchor" href="#_3-2-用户登录" aria-hidden="true">#</a> 3.2 用户登录</h3><p>​ 在<code>seckill-user</code>中实现用户登录，用户登录表机构如下：</p><div class="language-SQL line-numbers-mode" data-ext="SQL"><pre class="language-SQL"><code>CREATE TABLE \`tb_user\` (
  \`username\` varchar(50) NOT NULL COMMENT &#39;用户名&#39;,
  \`password\` varchar(100) NOT NULL COMMENT &#39;密码，加密存储,MD5加密&#39;,
  \`phone\` varchar(20) DEFAULT NULL COMMENT &#39;注册手机号&#39;,
  \`email\` varchar(50) DEFAULT NULL COMMENT &#39;注册邮箱&#39;,
  \`created\` datetime NOT NULL COMMENT &#39;创建时间&#39;,
  \`updated\` datetime NOT NULL COMMENT &#39;修改时间&#39;,
  \`nick_name\` varchar(50) DEFAULT NULL COMMENT &#39;昵称&#39;,
  \`name\` varchar(50) DEFAULT NULL COMMENT &#39;真实姓名&#39;,
  PRIMARY KEY (\`username\`),
  UNIQUE KEY \`username\` (\`username\`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT=&#39;用户表&#39;;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>1)Service</strong></p><p>在<code>com.seckill.user.service.UserService</code>中编写登录方法，代码如下：</p><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>/**
 * 根据ID查询User
 * @return
 */
 User findById(String id);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在<code>com.seckill.user.service.impl.UserServiceImpl</code>中编写登录方法实现，代码如下：</p><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>/**
 * 根据ID查询User
 */
@Override
public User findById(String id){
    return  userMapper.selectByPrimaryKey(id);
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>2)Controller</p><p>在<code>com.seckill.user.controller.UserController</code>中编写登录实现方法，代码如下：</p><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>/**
 * 用户登录
 */
@PostMapping(value = &quot;/login&quot;)
public Result login(@RequestBody User param) throws Exception {
    //1.根据用户名查询用户信息
    User user = userService.findById(param.getUsername());
    //2.用户不存在
    if (user == null) {
        return new Result(false, StatusCode.ERROR, &quot;账号不存在！&quot;);
    }
    //3.密码错误
    if (!user.getPassword().equals(DigestUtils.md5DigestAsHex(param.getPassword().getBytes()))) {
        return new Result(false, StatusCode.ERROR, &quot;密码错误！&quot;);
    }
    //4.登录成功
    Map&lt;String, Object&gt; payload = new HashMap&lt;&gt;();
    payload.put(&quot;username&quot;, user.getUsername());
    payload.put(&quot;name&quot;, user.getName());
    payload.put(&quot;phone&quot;, user.getPhone());
    String token = JwtTokenUtil.generateTokenUser(UUID.randomUUID().toString(), payload, 86400000L);

    return new Result(true, StatusCode.OK, &quot;登录成功！&quot;, token);
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>用Postman测试一下用户登录，生成的令牌如下：</p><div class="language-JSON line-numbers-mode" data-ext="JSON"><pre class="language-JSON"><code>{
    &quot;flag&quot;: true,
    &quot;code&quot;: 20000,
    &quot;message&quot;: &quot;登录成功！&quot;,
    &quot;data&quot;: &quot;eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJlMTNlYmZiNy0yMTY2LTQ4ZDYtYTBhZC1mZTZkNDljZDMxZmQiLCJpYXQiOjE3NDEwMjM4NTcsImlzcyI6ImUxM2ViZmI3LTIxNjYtNDhkNi1hMGFkLWZlNmQ0OWNkMzFmZCIsInN1YiI6ImUxM2ViZmI3LTIxNjYtNDhkNi1hMGFkLWZlNmQ0OWNkMzFmZCIsInBob25lIjoiMTM2MTExMTIyMjIiLCJuYW1lIjpudWxsLCJ1c2VybmFtZSI6Iml0aGVpbWEiLCJleHAiOjE3NDExMTAyNTd9.xDc0dOjGoo7HDS8LgczBkFYeUb06L3HdVjA2DmYfRlQ&quot;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-3-jwt令牌识别" tabindex="-1"><a class="header-anchor" href="#_3-3-jwt令牌识别" aria-hidden="true">#</a> 3.3 Jwt令牌识别</h3><p>​ 识别Jwt令牌主要用于解析用户令牌，判断令牌是否真实有效。</p><h4 id="_3-3-1-流程分析" tabindex="-1"><a class="header-anchor" href="#_3-3-1-流程分析" aria-hidden="true">#</a> 3.3.1 流程分析</h4><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503022326357.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>​ 前面我们编写的Java代码可以解析识别用户令牌，但我们现在要的流程如上图，用户请求Nginx执行抢单的时候，需要识别用户登录状态，如果已登录，则允许用户抢单，未登录是不允许用户抢单的，识别用户是否登录，我们这里采用Lua脚本实现。</p><h4 id="_3-3-2-lua识别jwt令牌" tabindex="-1"><a class="header-anchor" href="#_3-3-2-lua识别jwt令牌" aria-hidden="true">#</a> 3.3.2 Lua识别Jwt令牌</h4>`,188),p=i("code",null,"lua-resty-jwt",-1),g={href:"https://github.com/SkyLothar/lua-resty-jwt",target:"_blank",rel:"noopener noreferrer"},h=n(`<p><strong>1)lua-resty-jwt安装</strong></p><p>我们也可以使用opm直接安装<code>lua-resty-jwt</code>，配置<code>lua-resty-jwt</code>之前，我们需要先安装resty和opm。</p><p>安装仓库管理工具包：</p><div class="language-Plaintext line-numbers-mode" data-ext="Plaintext"><pre class="language-Plaintext"><code>yum install -y yum-utils
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>添加仓库地址：</p><div class="language-Plaintext line-numbers-mode" data-ext="Plaintext"><pre class="language-Plaintext"><code>yum-config-manager --add-repo https://openresty.org/package/centos/openresty.repo
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>安装resty:</p><div class="language-Plaintext line-numbers-mode" data-ext="Plaintext"><pre class="language-Plaintext"><code>yum install -y openresty-resty
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>安装opm：</p><div class="language-Plaintext line-numbers-mode" data-ext="Plaintext"><pre class="language-Plaintext"><code>yum install -y openresty-opm
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>安装Jwt组件：</p><div class="language-Plaintext line-numbers-mode" data-ext="Plaintext"><pre class="language-Plaintext"><code>opm get SkyLothar/lua-resty-jwt
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>此时<code>lua-resty-jwt</code>安装好了，可以直接使用了。</p><p><strong>2)令牌识别</strong></p><p>令牌识别有可能在很多操作都需要用到，所以可以创建一个独立的模块，用于识别令牌，文件名字叫<code>token.lua</code></p><div class="language-Lua line-numbers-mode" data-ext="Lua"><pre class="language-Lua"><code>--依赖jwt库
local jwt = require(&quot;resty.jwt&quot;)
--秘钥
local secret=&quot;5pil6aOO5YaN576O5Lmf5q+U5LiN5LiK5bCP6ZuF55qE56yR&quot;

-- 定义一个名为 jwttoken 的模块
jwttoken = {}

--令牌校验
function jwttoken.check(auth_header)
    --定义响应数据
    local response = {}

    --如果请求头中没有令牌，则直接返回401
    if auth_header == nil then
        response[&quot;code&quot;]=401
        response[&quot;message&quot;]=&quot;没有找到令牌数据&quot;
        return response
    end

    --查找令牌中的Bearer 前缀字符，并进行截取
    local _, _, token = string.find(auth_header, &quot;Bearer%s+(.+)&quot;)

    --如果没有Bearer，则表示令牌无效
    if token == nil then
        response[&quot;code&quot;]=401
        response[&quot;message&quot;]=&quot;令牌格式不正确&quot;
        return response
    end

    --校验令牌
    local jwt_obj = jwt:verify(secret, token)

    --如果校验结果中的verified==false，则表示令牌无效
    if jwt_obj.verified == false then
        response[&quot;code&quot;]=401
        response[&quot;message&quot;]=&quot;令牌无效&quot;
        return response
    end

    --全部校验完成后，说明令牌有效，返回令牌数据
    response[&quot;code&quot;]=200
    response[&quot;message&quot;]=&quot;令牌校验通过&quot;
    response[&quot;body&quot;]=jwt_obj
    return response
end

return jwttoken
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>cd /usr/local/openresty/nginx/lua/</code></p><p>我们创建一个<code>auth_verify.lua</code>用于识别令牌，代码如下：</p><div class="language-Lua line-numbers-mode" data-ext="Lua"><pre class="language-Lua"><code>--测试判断令牌是否有效
--设置编码utf8
ngx.header.content_type=&quot;application/json;charset=utf8&quot;

--引入json库
local cjson = require &quot;cjson&quot;

--引入jwt模块
local jwttoken = require &quot;token&quot;

--获取请求头中的令牌数据
local auth_header = ngx.var.http_Authorization

--调用令牌校验
local result = jwttoken.check(auth_header)

-- 输出结果
ngx.say(cjson.encode(result))
ngx.exit(result.code)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>nginx.conf添加lua插件位置</p><div class="language-Nginx line-numbers-mode" data-ext="Nginx"><pre class="language-Nginx"><code>lua_package_path &quot;/usr/local/openresty/nginx/lua/?.lua;/usr/local/openresty/lua-resty-kafka-master/lib/?.lua;;&quot;;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>nginx.conf配置一个用于校验令牌的地址，代码如下：</p><div class="language-Nginx line-numbers-mode" data-ext="Nginx"><pre class="language-Nginx"><code>        #令牌校验
        location /token {
            content_by_lua_file /usr/local/openresty/nginx/lua/auth_verify.lua;
        }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>3)令牌测试</p><p>我们用上面java生成的令牌进行测试，请求：<code>http://8.141.90.31/token</code>测试令牌结果，如下图：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503041109707.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>令牌错误输入，结果如下：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503041111036.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h2 id="_4-用户下单" tabindex="-1"><a class="header-anchor" href="#_4-用户下单" aria-hidden="true">#</a> 4 用户下单</h2><p>​ 商品分为热点商品抢单和非热点商品抢单，因此此系统中抢单模式并非一种。</p><h3 id="_4-1-抢单分析" tabindex="-1"><a class="header-anchor" href="#_4-1-抢单分析" aria-hidden="true">#</a> 4.1 抢单分析</h3><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503022326759.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>​ 下单的核心业务是，先判断商品是否为热点商品，如果是非热点商品，则直接调用订单系统进行下单操作，如果是热点商品，则向Kafka生产消息进行排队下单，订单系统会订阅排队下单信息，这样可以降低服务器所直接承受的抢单压力，这种操作也叫<mark>队列削峰</mark>。</p><div class="hint-container info"><p class="hint-container-title">相关信息</p><p>但是如果用户下单后在kafka这排队很久才能够下单成功，那么对用户来说体验非常不好，那么有必要使热点商品下单的模块性能更高点，那就加机器，一台1秒钟消费5000条消息，一百台就是50万个。</p><p>实际业务还会对流程进行性能调优！可能会达到每秒5、6万，性能达十倍！</p></div><h3 id="_4-2-非热点商品抢单" tabindex="-1"><a class="header-anchor" href="#_4-2-非热点商品抢单" aria-hidden="true">#</a> 4.2 非热点商品抢单</h3><p>​ 在订单系统中实现非热点商品抢单操作，非热点商品只用在订单系统中实现抢单即可，但抢单的时候要注意这么几个问题：</p><div class="language-Plaintext line-numbers-mode" data-ext="Plaintext"><pre class="language-Plaintext"><code>1.先递减库存，需要保证减库存的原子性操作
2.库存递减成功后，再执行下单
3.因为涉及到商品和订单两个微服务，所以下单时需要实现分布式事务
4.下单成功后，要记录用户抢单信息，指定的时间内不允许再抢该商品(这里指定24小时内只能秒杀一次)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_4-2-1-库存递减" tabindex="-1"><a class="header-anchor" href="#_4-2-1-库存递减" aria-hidden="true">#</a> 4.2.1 库存递减</h4><p>需求：非热点商品在抢单时，修改MySQL的库存数据。</p><p>在seckill-goods微服务中实现接口： PUT/sku/dcount/id}/{count}根据sku的id减库存</p><p>分析： 1.需要确定库存数量足够，才可以进行减库操作，否则会产生超卖问题 2.需要确定不能是热点数据，islock也要进行判断 3.在实现减库存方法时，需要保证其原子性操作，否则会出现数据不一致（其实就是多线程的问题！）</p><p>修改<code>seckill-goods</code>的<code>com.seckill.goods.dao.SkuMapper</code>添加库存递减方法，代码如下：</p><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>/**
 * 库存递减
 * 递减数量
 * 商品ID
 * -------&gt;控制超卖
 */
@Update(&quot;update tb_sku set seckill_num=seckill_num-#{count} where id=#{id} and seckill_num&gt;=#{count} and islock=1&quot;)
int dcount(@Param(&quot;id&quot;) String id, @Param(&quot;count&quot;) Integer count);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里我们需要控制数据的原子性，因此不能在内存中进行操作，需要用SQL语句在数据库中执行。</p><p><strong>1)库存递减</strong></p><p>修改<code>seckill-goods</code>的<code>com.seckill.goods.service.SkuService</code>添加库存递减方法，代码如下：</p><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>/**
 * 库存递减
 */
int dcount(String id, Integer count);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>修改<code>seckill-goods</code>的<code>com.seckill.goods.service.impl.SkuServiceImpl</code>添加库存递减实现方法，代码如下：</p><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>/**
 * 库存递减
 */
@Override
public int dcount(String id, Integer count) {
    //1.调用Dao实现递减
    int dcount = skuMapper.dcount(id, count);
    //2.递减失败
    if (dcount == 0) {
        //查询
        Sku sku = skuMapper.selectByPrimaryKey(id);
        //2.1递减失败原因-&gt;库存不足-&gt;405
        if (sku.getSeckillNum() &lt; count) {
            return StatusCode.DECOUNT_NUM;
        } else if (sku.getIslock() == 2) {
            //2.2递减失败原因-&gt;变成热点-&gt;205
            return StatusCode.DECOUNT_HOT;
        }
        return 0;
    }
    return StatusCode.DECOUNT_OK;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>修改<code>com.seckill.goods.controller.SkuController</code>添加库存递减调用方法，代码如下：</p><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>/**
 * 库存递减
 */
@PutMapping(value = &quot;/dcount/{id}/{count}&quot;)
public Result&lt;Sku&gt; dcount(@PathVariable(value = &quot;id&quot;) String id, @PathVariable(value = &quot;count&quot;) Integer count) {
    //1.调用业务层实现递减
    int code = skuService.dcount(id, count);
    String message = &quot;&quot;;
    Sku sku = null;
    switch (code) {
        case StatusCode.DECOUNT_OK:
            sku = skuService.findById(id);
            message = &quot;库存递减成功！&quot;;
            break;
        case StatusCode.DECOUNT_NUM:
            message = &quot;库存不足！&quot;;
            break;
        case StatusCode.DECOUNT_HOT:
            message = &quot;商品是热点商品！&quot;;
            break;
        default:
    }
    //3.根据状态码，响应不同的提示信息
    return new Result&lt;&gt;(true, code, message, sku);
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>2)SkuFeign配置</strong></p><p>修改<code>com.seckill.goods.feign.SkuFeign</code>,添加库存递减方法，代码如下：</p><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>/**
 * Sku数量递减
 */
@PutMapping(value = &quot;/sku/dcount/{id}/{count}&quot; )
Result&lt;Sku&gt; dcount(@PathVariable(value = &quot;id&quot;)String id, @PathVariable(value = &quot;count&quot;)Integer count);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>S1235433012716432456</code>是热点商品，现在扣减库存试试</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503041329170.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>商品是热点商品</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503041330444.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>然后再试试非热点商品</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503041333527.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>扣减成功</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503041334239.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503041334022.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h4 id="_4-2-2-抢单实现" tabindex="-1"><a class="header-anchor" href="#_4-2-2-抢单实现" aria-hidden="true">#</a> 4.2.2 抢单实现</h4><p>​ 当库存递减成功后，需要给用户直接下单，如果递减不成功，会出现商品变成热卖商品的现象，我们需要向Kafka发送队列数据，所以需要引入Kafka配置。</p><p>需求：非热点商品在下单时，直接在MySQL中创建订单</p><p>在<code>seckill-order</code>微服务中实现接口： <code>POST /order/add/id</code> 根据sku主键id实现订单创建</p><p>分析： 1.对token令牌进行解析，获取下单用户username 2.下单前先进行减库存操作，减库存成功后才能创建订单 3.如果减库存失败，则下单失败，不能创建订单，并且给用户提示库存不足 4.在redis中记录该用户已下单，指定时间内同样的商品不能再次下单 5.如果商品已锁定(islock为2)，表示该商品是热点商品，则不能创建订单，需要发下单消息给kafka</p><p>bootstrap.yml配置kafka：</p><div class="language-YAML line-numbers-mode" data-ext="YAML"><pre class="language-YAML"><code>  kafka:
    producer:
      acks: all #acks:消息的确认机制，默认值是0， acks=0：如果设置为0，生产者不会等待kafka的响应。 acks=1：这个配置意味着kafka会把这条消息写到本地日志文件中，但是不会等待集群中其他机器的成功响应。 acks=all：这个配置意味着leader会等待所有的follower同步完成。这个确保消息不会丢失，除非kafka集群中所有机器挂掉。这是最强的可用性保证。
      retries: 0 #发送失败重试次数，配置为大于0的值的话，客户端会在消息发送失败时重新发送。
      batch-size: 16384 #当多条消息需要发送到同一个分区时，生产者会尝试合并网络请求。这会提高client和生产者的效率。
      buffer-memory: 33554432 #即32MB的批处理缓冲区
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.apache.kafka.common.serialization.StringSerializer
      bootstrap-servers: kafka-server:9092 #如果kafka启动错误，打开debug级别日志，出现Can&#39;t resolve address: flink:9092 的错误，需要在 windows下修改IP映射即可， C:\\Windows\\System32\\drivers\\etc\\hosts, 192.168.234.128 flink。
    consumer:
      group-id: test
      auto-offset-reset: latest #（1）earliest:当各分区下有已提交的offset时，从提交的offset开始消费；无提交的offset时，从头开始消费；（2）latest:当各分区下有已提交的offset时，从提交的offset开始消费；无提交的offset时，消费新产生的该分区下的数据 ；（3）none：topic各分区都存在已提交的offset时，从offset后开始消费；只要有一个分区不存在已提交的offset，则抛出异常
      enable-auto-commit:  true  #如果为true，消费者的偏移量将在后台定期提交。
      auto-commit-interval: 1000 #消费者偏移自动提交给Kafka的频率 （以毫秒为单位），默认值为5000
      max-poll-records: 5 #一次拉起的条数
      key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      value-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      bootstrap-servers: kafka-server:9092
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>添加<code>seckill-order</code>的<code>com.seckill.order.service.impl.OrderServiceImpl</code>的add方法，代码如下：</p><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>/**
 * 添加订单
 */
int add(Order order);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>添加<code>seckill-order</code>的<code>com.seckill.order.service.impl.OrderServiceImpl</code>的add方法，代码如下：</p><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>@Autowired
private RedisTemplate redisTemplate;

@Autowired
private KafkaTemplate kafkaTemplate;

/**
 * 添加订单
 */
@Override
public int add(Order order) {
    String userKey = &quot;USER&quot; + order.getUsername() + &quot;ID&quot; + order.getSkuId();
    //1.递减库存
    Result&lt;Sku&gt; dcount = skuFeign.dcount(order.getSkuId(), order.getTotalNum());
    //2.递减成功-&gt;下单-&gt;记录当前用户抢单的时间点，24小时内不能抢购该商品
    if (dcount.getCode() == StatusCode.DECOUNT_OK) {

        Sku sku = dcount.getData();
        //下单
        order.setOrderStatus(&quot;0&quot;);
        order.setPayStatus(&quot;0&quot;);
        order.setConsignStatus(&quot;0&quot;);
        order.setSkuId(sku.getId());
        order.setName(sku.getName());
        order.setPrice(sku.getSeckillPrice() * order.getTotalNum());
        orderMapper.insertSelective(order);
        //记录当前用户抢单的时间点，24小时内不能抢购该商品
        redisTemplate.boundValueOps(userKey).set(&quot;&quot;);
        redisTemplate.boundValueOps(userKey).expire(1, TimeUnit.MINUTES);
        return StatusCode.ORDER_OK;
    } else {
        //3.递减失败
        //405库存不足
        if (dcount.getCode() == StatusCode.DECOUNT_NUM) {
            return StatusCode.DECOUNT_NUM;
        } else if (dcount.getCode() == StatusCode.DECOUNT_HOT) {
            //205商品热点
            String key = &quot;SKU_&quot; + order.getSkuId();
            Long increment = redisTemplate.boundHashOps(key).increment(userKey, 1);
            /**
                 * 其实就是这种效果
                 * SKU_12345:
                 *     USER_user1_ID12345: 1
                 * 因为 increment == 1，所以触发排队逻辑;
                 * SKU_12345:
                 *     USER_user1_ID12345: 2
                 * 因为 increment &gt; 1，所以不触发排队逻辑。
                 */
            if (increment == 1) { // 判断当前用户是否是第一次抢单
                //执行排队
                Map&lt;String, String&gt; queueMap = new HashMap&lt;&gt;();
                queueMap.put(&quot;username&quot;, order.getUsername());
                queueMap.put(&quot;id&quot;, order.getSkuId());
                kafkaTemplate.send(&quot;neworder&quot;, JSON.toJSONString(queueMap));
            } // 如果 increment &gt; 1，说明用户已经抢过单，不需要重复触发排队。
            return StatusCode.ORDER_QUEUE;
        }

        return dcount.getCode();
    } 
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>key</code> 是前面生成的 <code>SKU_{商品ID}</code>，表示当前商品的抢单记录。</p><p>修改<code>com.seckill.order.controller.OrderController</code>的add方法，代码如下：</p><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>/**
 * 添加订单
 */
@PostMapping(value = &quot;/add/{id}&quot;)
public Result add(@PathVariable(value = &quot;id&quot;) String id, @RequestHeader(value = &quot;Authorization&quot;) String authorization) {
    String username;
    try {
        //解析令牌
        Map&lt;String, Object&gt; tokenMap = JwtTokenUtil.parseToken(authorization);
        username = tokenMap.get(&quot;username&quot;).toString();
    } catch (Exception e) {
        return new Result(false, StatusCode.TOKEN_ERROR, &quot;令牌无效！&quot;);
    }
    //封装Order
    Order order = new Order();
    order.setId(&quot;No&quot; + idWorker.nextId()); //雪花算法
    order.setSkuId(id);
    order.setCreateTime(new Date());
    order.setUpdateTime(order.getCreateTime());
    order.setUsername(username);
    order.setTotalNum(1);
    //添加订单
    int code = orderService.add(order);
    switch (code) {
        case StatusCode.ORDER_OK:
            return new Result(true, StatusCode.ORDER_OK, order.getId());
        case StatusCode.DECOUNT_NUM:
            return new Result(false, StatusCode.DECOUNT_NUM, &quot;库存不足！&quot;);
        case StatusCode.ORDER_QUEUE:
            return new Result(true, StatusCode.ORDER_QUEUE, &quot;排队抢购中！&quot;);
        default:
            return new Result(false, StatusCode.ERROR, &quot;抢单发生异常！&quot;);
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>对热点商品下单</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503041504241.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>对非热点数据下单</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503041505927.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>message就是订单号，扣减也成功</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503041506399.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503041506740.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>查看订单表也创建成功</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503041507997.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h4 id="_4-2-3-使用lua抢单校验-可选" tabindex="-1"><a class="header-anchor" href="#_4-2-3-使用lua抢单校验-可选" aria-hidden="true">#</a> 4.2.3 使用Lua抢单校验(可选)</h4><p>编写lua脚本控制抢单，当用户处于已登录状态，则执行下单,创建脚本<code>seckill-order-add.lua</code>，脚本如下：</p><div class="language-Lua line-numbers-mode" data-ext="Lua"><pre class="language-Lua"><code>ngx.header.content_type=&quot;application/json;charset=utf8&quot;
--引入json库
local cjson = require &quot;cjson&quot;
--引入jwt模块
local jwttoken = require &quot;token&quot;
--获取请求头中的令牌数据
local auth_header = ngx.var.http_Authorization
--调用令牌校验
local result = jwttoken.check(auth_header)


--如果code==200表示令牌校验通过
if result.code==200 then
        --获取id
        local uri_args = ngx.req.get_uri_args()
        local id = uri_args[&quot;id&quot;]

        --拼接url
        local url = &quot;/api/order/add/&quot;..id
        --执行请求
        ngx.exec(url)
else
        -- 输出结果
        ngx.say(cjson.encode(result))
        ngx.exit(result.code)
end
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在nginx.conf中添加api以及抢单请求路径的路由，配置如下：</p><div class="language-Nginx line-numbers-mode" data-ext="Nginx"><pre class="language-Nginx"><code>#抢单
location /lua/order/add {
    content_by_lua_file /usr/local/openresty/nginx/lua/seckill-order-add.lua;
}

#微服务网关
location /api/ {
    proxy_pass http://192.168.200.1:8001;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-3-热点商品抢单" tabindex="-1"><a class="header-anchor" href="#_4-3-热点商品抢单" aria-hidden="true">#</a> 4.3 热点商品抢单</h3><p>​ 上面完成了非热点商品抢单，接着实现以下热点商品抢单。热点商品和非热点商品不一样，热点商品已经隔离出来，在Redis缓存中，并且热点商品抢单要实现高效率操作而且还能抗压，Nginx的并发能力远远超越tomcat，因此热点商品抢单我们可以使用Lua+Nginx。</p><h4 id="_4-3-1-抢单流程分析" tabindex="-1"><a class="header-anchor" href="#_4-3-1-抢单流程分析" aria-hidden="true">#</a> 4.3.1 抢单流程分析</h4><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503022326874.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>​ 用户进入抢单流程，通过Lua脚本判断令牌是否有效，如果有效，则进入抢单环节，抢单环节执行过程这里做一个分析：</p><div class="language-Plaintext line-numbers-mode" data-ext="Plaintext"><pre class="language-Plaintext"><code>1.判断该商品用户是否在24小时内购买过
2.如果购买了，直接提示用户24小时内无法购买
3.如果用户没有购买过该商品，则判断该商品是否属于热点商品
4.如果是非热点商品，则走非热点商品抢单流程
5.如果是热点商品，则走热点商品抢单流程
6.判断该商品用户是否已经排队，如果没有排队，则进入排队，如果已经排队，则提示用户正在排队
7.下单过程交给订单系统，订单系统通过队列订阅读取用户下单信息，并进行下单
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_4-3-2-lua实现redis操作" tabindex="-1"><a class="header-anchor" href="#_4-3-2-lua实现redis操作" aria-hidden="true">#</a> 4.3.2 Lua实现Redis操作</h4><p>​ 判断用户是否在24小时内抢购过该商品，我们可以将用户抢单信息存入到Redis缓存中，定时24小时过期即可，此时需要在Lua里面实现Redis集群操作，需要第三方库的支持<code>lua-resty-redis-cluster</code>。</p>`,99),q=i("code",null,"lua-resty-redis-cluster",-1),f={href:"https://github.com/cuiweixie/lua-resty-redis-cluster%EF%BC%8C%E4%B8%8B%E8%BD%BD%E8%AF%A5%E6%96%87%E4%BB%B6%E9%85%8D%E7%BD%AE%E5%90%8E%E5%8D%B3%E5%8F%AF%E5%AE%9E%E7%8E%B0Redis%E9%9B%86%E7%BE%A4%E6%93%8D%E4%BD%9C%E3%80%82",target:"_blank",rel:"noopener noreferrer"},k=n(`<div class="language-Shell line-numbers-mode" data-ext="Shell"><pre class="language-Shell"><code># 安装环境
yum install -y lua-devel

# 上传lua-resty-redis-cluster-master.zip到服务器的 /root目录下

# 解压
cd /root
unzip lua-resty-redis-cluster-master.zip

# 拷贝redis_slot.c：
cp /root/lua-resty-redis-cluster-master/lib/redis_slot.c /usr/local/openresty/lualib/

# 拷贝rediscluster.lua：
cp /root/lua-resty-redis-cluster-master/lib/resty/rediscluster.lua /usr/local/openresty/lualib/resty/

# 编译
cd /usr/local/openresty/lualib
gcc redis_slot.c -fPIC -shared -o libredis_slot.so
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>​ <code>lua-resty-redis-cluster</code>中有部分redis指令并未开放，我们可以手动修改，开放相关指令,我们这里开放过期指令，因为后面会用到该指令。</p><p>注意：需要修改<code>/usr/local/openresty/lualib/resty/rediscluster.lua</code>文件，添加相关指令，如下图：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503022326925.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>开放设置过期时间的指令，步骤如下：</p><div class="language-Bash line-numbers-mode" data-ext="Bash"><pre class="language-Bash"><code># 修改配置文件
vi /usr/local/openresty/lualib/resty/rediscluster.lua

# 进入指定的行数
:90
# 插入空行
o
# 在空行中添加指令，设置过期时间的指令如下：(注意&quot;&quot;和,都不能少)
&quot;expire&quot;,
# 按 Esc 进入一般模式，保存退出
:wq
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="_4-3-2-2-操作redis集群实现" tabindex="-1"><a class="header-anchor" href="#_4-3-2-2-操作redis集群实现" aria-hidden="true">#</a> 4.3.2.2 操作Redis集群实现</h5><p>​ 以后别的地方也有可能会用到redis，我们可以写个工具类<code>redis-cluster.lua</code>，实现redis的操作，这里主要实现了根据key获取缓存数据、根据key设置缓存过期时间、根据key从hash类型中获取数据、往hash类型中添加数据，代码如下：</p><p><code>cd /usr/local/openresty/nginx/lua/</code></p><div class="language-Lua line-numbers-mode" data-ext="Lua"><pre class="language-Lua"><code>-- redis连接配置
local config = {
    name = &quot;test&quot;,
    serv_list = {
        {ip=&quot;8.141.90.31&quot;, port = 6381},
        {ip=&quot;8.141.90.31&quot;, port = 6382},
        {ip=&quot;8.141.90.31&quot;, port = 6383},
        {ip=&quot;8.141.90.31&quot;, port = 6384},
        {ip=&quot;8.141.90.31&quot;, port = 6385},
        {ip=&quot;8.141.90.31&quot;, port = 6386},
    },
    idle_timeout    = 1000,
    pool_size       = 10000,
}

-- 引入redis集群配置
local redis_cluster = require &quot;resty.rediscluster&quot;

-- 定义一个对象
local lredis = {}

-- 根据key查询
function lredis.get(key)
    -- 创建链接
    local red = redis_cluster:new(config)
    red:init_pipeline()

    -- 根据key获取数据
    red:get(key)
    local rresult = red:commit_pipeline()

    -- 关闭链接
    red:close()

    return rresult
end

-- 添加带过期的数据
function lredis.setexp(key,value,time)
    -- 创建链接
    local red = redis_cluster:new(config)
    red:init_pipeline()

    -- 添加key，同时设置过期时间
    red:set(key,value)
    red:expire(key,time)

    local rresult = red:commit_pipeline()
    
    -- 关闭链接
    red:close()
end

-- 根据key查询hash
function lredis.hget(key1,key2)
    -- 创建链接
    local red = redis_cluster:new(config)
    red:init_pipeline()

    -- 根据key获取数据
    red:hmget(key1,key2)
    local rresult = red:commit_pipeline()

    -- 关闭链接
    red:close()

    return rresult[1]
end

--hash数据添加
function lredis.hset(key1,key2,value)
    -- 创建链接
    local red = redis_cluster:new(config)
    red:init_pipeline()

    -- 添加hash数据
    red:hmset(key1,key2,value)
    local rresult = red:commit_pipeline()

    -- 关闭链接
    red:close()
    return rresult
end

--hash中指定的key自增
function lredis.hincrby(key1,key2,value)
    -- 创建链接
    local red = redis_cluster:new(config)
    red:init_pipeline()

    -- 添加hash数据
    red:hincrby(key1,key2,value)
    local rresult = red:commit_pipeline()

    -- 关闭链接
    red:close()

    return rresult[1]
end

return lredis
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>接着来测试一次集群操作，修改<code>nginx.conf</code>，配置一个<code>location</code>节点，如下：</p><div class="language-Nginx line-numbers-mode" data-ext="Nginx"><pre class="language-Nginx"><code>#redis
location /test/redis {
    content_by_lua &#39;
        ngx.header.content_type=&quot;application/json;charset=utf8&quot;
        --引入redis
        local rredis = require &quot;redis-cluster&quot;
        --从redis中查询hash类型数据
        local sku = rredis.hget(&quot;SKU_S1235433012716498944&quot;,&quot;num&quot;)[1]
        ngx.say(sku)
    &#39;;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>测试效果如下：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503022326895.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h4 id="_4-3-3-lua实现kafka操作" tabindex="-1"><a class="header-anchor" href="#_4-3-3-lua实现kafka操作" aria-hidden="true">#</a> 4.3.3 Lua实现Kafka操作</h4><p>​ 用户抢单的时候，如果是热点商品，这时候需要实现用户排队，用户排队我们需要向kafka发送抢单信息，因此需要使用Lua脚本操作kafka，我们需要依赖<code>lua-restry-kafka</code>库，该库我们也已经配置使用过了，所以这里无需再配置了。</p><p>​ 以后使用kafka的地方也有可能会有很多，所以针对kafka我们也可以单独抽取出一个配置脚本，创建一个脚本名字叫</p><p><code>kafka.lua</code>，用于配置kafka的操作，代码如下：</p><div class="language-Lua line-numbers-mode" data-ext="Lua"><pre class="language-Lua"><code>--kafka依赖库
local producer = require &quot;resty.kafka.producer&quot;

--配置kafka的链接地址
local broker_list = {
      { host = &quot;127.0.0.1&quot;, port = 9092 }
}

--配置模块
local kafka = {}

--发送kafka消息
--content:发送的内容
function kafka.send(queuename,message)
        --创建生产者
        local pro = producer:new(broker_list,{ producer_type=&quot;async&quot;})
        --发送消息
        local offset, err = pro:send(queuename, nil, message)
                
                return offset
end

return kafka
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>vi /usr/local/openresty/nginx/conf</code></p><p>编写一段代码向kafka发送信息，修改<code>nginx.conf</code>,添加如下代码：</p><div class="language-Lua line-numbers-mode" data-ext="Lua"><pre class="language-Lua"><code>        #kafka
        location /test/kafka {
            content_by_lua &#39;
                ngx.header.content_type=&quot;application/json;charset=utf8&quot;
                 --引入kafka
                local kafka = require &quot;kafka&quot;
                --发送消息
                local offset = kafka.send(&quot;demo&quot;,&quot;hello&quot;)
                ngx.say(offset)
            &#39;;
        }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503041553688.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>发送成功，到kafka中查看是否收到！</p><p>消息订阅</p><div class="language-Bash line-numbers-mode" data-ext="Bash"><pre class="language-Bash"><code># 进入容器
docker exec -it kafka /bin/bash

# 进入目录
cd /opt/kafka_2.12-2.4.1/bin

# 订阅消息
./kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic demo --from-beginning
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>测试效果如下：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503041602032.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>再刷新一下，这里也会收到</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503041603231.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h4 id="_4-3-4-抢单实现" tabindex="-1"><a class="header-anchor" href="#_4-3-4-抢单实现" aria-hidden="true">#</a> 4.3.4 抢单实现</h4><p>​ 抢单这里分为2部分，首先需要向Kafka发送抢单信息实现排队，排队后，订单系统订阅抢单信息实现下单操作，所有的数据操作一律在Redis中完成，降低程序对服务器的压力。</p><h5 id="_4-3-4-1-排队" tabindex="-1"><a class="header-anchor" href="#_4-3-4-1-排队" aria-hidden="true">#</a> 4.3.4.1 排队</h5><p>排队抢单需要引入redis和kafka，我们的实现思路如下：</p><div class="language-Plaintext line-numbers-mode" data-ext="Plaintext"><pre class="language-Plaintext"><code>1.校验用户令牌，如果不通过直接结束程序提示用户
2.令牌校验通过，从Redis中获取用户在24小时内是抢购过该商品，如果抢购过直接结束程序并提示用户
3.如果符合购买该商品条件，则校验该商品是否是热点商品，如果不是，直接请求后台下单
4.如果是热点商品，并且库存&gt;0，校验用户是否已经在排队，使用redis的incr自增判断排队次数可以去除重复排队
5.如果没有排队，则向Kafka发送消息实现排队
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>创建<code>seckill-order-add.lua</code>,实现代码如下：</p><div class="language-Lua line-numbers-mode" data-ext="Lua"><pre class="language-Lua"><code>--设置编码
ngx.header.content_type=&quot;application/json;charset=utf8&quot;
--引入json库
local cjson = require &quot;cjson&quot;
--引入jwt模块
local jwttoken = require &quot;token&quot;
--引入redis
local redis = require &quot;redis-cluster&quot;
--引入kafka
local kafka = require &quot;kafka&quot;

--获取请求头中的令牌数据
local auth_header = ngx.var.http_Authorization
--调用令牌校验
local result = jwttoken.check(auth_header)

--如果code==200表示令牌校验通过
if result.code==200 then
        --响应结果
        local response = {}

        --获取id
        local id = string.gsub(ngx.var.uri,&quot;/lua/order/add/&quot;,&quot;&quot;)

        --判断该商品用户是否已经在指定时间内购买过
        local username = result[&quot;body&quot;][&quot;payload&quot;][&quot;username&quot;]
        local userKey= &quot;USER&quot;..username..&quot;ID&quot;..id
        local hasbuy = redis.get(userKey)
        
        --如果没有购买，则判断该商品是否是热点商品
        if hasbuy==nil or hasbuy[1]==nil or hasbuy[1]==ngx.null then
                --从redis中获取该商品信息
                local num = redis.hget(&quot;SKU_&quot;..id,&quot;num&quot;)[1]

                --如果不是热点商品，则走普通抢单流程
                if num==nil or num==ngx.null then
                        --拼接url
                        local url = &quot;/api/order/add/&quot;..id
                        --执行请求
                        ngx.exec(url)
                        return
                else
                        --热点商品
                        num = tonumber(num)
                        
                        --如果有库存，才允许抢单
                        if num&lt;=0 then
                --库存不足，无法排队
                        response[&quot;code&quot;]=405
                response[&quot;message&quot;]=&quot;当前商品库存不足，无法抢购&quot;
                        ngx.say(cjson.encode(response))
                                return
                        else
                                --递增排队
                                local incrresult = redis.hincrby(&quot;SKU_&quot;..id,userKey,1)
                                incrresult=tonumber(incrresult)
                
                                if incrresult==1 then
                    --热点数据，发送MQ排队
                    local userorder = {}
                    userorder[&quot;username&quot;]=username
                    userorder[&quot;id&quot;]=id

                                        --排队抢单
                                        kafka.send(&quot;neworder&quot;,cjson.encode(userorder))

                    response[&quot;code&quot;]=202
                    response[&quot;message&quot;]=&quot;您正在排队抢购该商品&quot;
                                        ngx.say(cjson.encode(response))
                                        return
                                else
                                        --响应用户正在排队抢购该商品
                        response[&quot;code&quot;]=202
                        response[&quot;message&quot;]=&quot;您正在排队抢购该商品&quot;
                        ngx.say(cjson.encode(response))
                                        return
                                end
                        end
                end
        else
                --24小时内购买过该商品
                response[&quot;code&quot;]=415
        response[&quot;message&quot;]=&quot;您24小时内已经抢购了该商品，不能重复抢购&quot;
        ngx.say(cjson.encode(response))
                return
        end
else
        -- 输出结果
        ngx.say(cjson.encode(result))
        ngx.exit(result.code)
end
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="_4-3-4-2-下单实现" tabindex="-1"><a class="header-anchor" href="#_4-3-4-2-下单实现" aria-hidden="true">#</a> 4.3.4.2 下单实现</h5><p>订阅Kafka消息，实现下单 需求：热点商品下单，需要订阅Kafka消息，根据消息进行下单</p><p>步骤： 1.创建KafkaOrderListeneri进行Kafka消息监听 2.在OrderServicelmpl中添加热点商品下单接口</p><ul><li>用户username从消息中获取</li><li>从redis中获取商品库存数量，判断库存是否足够</li><li>库存足够则创建订单，redis中进行减库存操作</li><li>在redis中记录该用户已下单，指定时间内同样的商品不能再次下单</li></ul><p>创建<code>com.seckill.order.config.KafkaOrderListener</code>,用于读取排队信息，并调用下单操作，代码如下：</p><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>@Component
public class KafkaOrderListener {

    @Autowired
    private OrderService orderService;

    /***
     * 监听消息
     * 创建订单
     * @param message
     */
    @KafkaListener(topics = {&quot;neworder&quot;})
    public void receive(String message){
        //将消息转成Map
        Map&lt;String,String&gt; orderMap = JSON.parseObject(message,Map.class);
        //创建订单
        orderService.addHotOrder(orderMap);
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>修改<code>com.seckill.order.service.OrderService</code>添加热点数据下单方法，代码如下：</p><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>/**
 * 热点数据下单
 * @param orderMap
 */
void addHotOrder(Map&lt;String, String&gt; orderMap);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>修改<code>com.seckill.order.service.impl.OrderServiceImpl</code>添加热点数据下单实现方法，代码如下：</p><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>/**
 * 秒杀下单
 * @param orderMap
 */
@Override
public void addHotOrder(Map&lt;String, String&gt; orderMap) {
    String id = orderMap.get(&quot;id&quot;);
    String username = orderMap.get(&quot;username&quot;);
    //key
    String key = &quot;SKU_&quot; + id;
    //用户购买的key
    String userKey = &quot;USER&quot; + username + &quot;ID&quot; + id;

    if (redisTemplate.hasKey(key)) {
        //数量
        Integer num = Integer.parseInt(redisTemplate.boundHashOps(key).get(&quot;num&quot;).toString());

        //拥有库存，执行递减操作
        if (num &gt; 0) {
            //查询商品
            Result&lt;Sku&gt; result = skuFeign.findById(id);
            Sku sku = result.getData();
            Order order = new Order();
            order.setCreateTime(new Date());
            order.setUpdateTime(order.getCreateTime());
            order.setUsername(username);
            order.setSkuId(id);
            order.setName(sku.getName());
            order.setPrice(sku.getSeckillPrice());
            order.setId(&quot;No&quot; + idWorker.nextId());
            order.setTotalNum(1);
            order.setOrderStatus(&quot;0&quot;);
            order.setPayStatus(&quot;0&quot;);
            order.setConsignStatus(&quot;0&quot;);
            orderMapper.insertSelective(order);

            //库存递减
            num--;

            if (num == 0) {
                //同步数据到数据库，秒杀数量归零
                skuFeign.zero(id);
            }

            //更新数据
            Map&lt;String, Object&gt; dataMap = new HashMap&lt;String, Object&gt;();
            dataMap.put(&quot;num&quot;, num);
            dataMap.put(userKey, 0);

            //存数据
            redisTemplate.boundHashOps(key).putAll(dataMap);
        }

        //记录该商品用户24小时内无法再次购买,测试环境，我们只配置成1分钟
        redisTemplate.boundValueOps(userKey).set(&quot;&quot;);
        redisTemplate.expire(userKey, 1, TimeUnit.MINUTES);
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>配置nginx.conf</p><div class="language-Bash line-numbers-mode" data-ext="Bash"><pre class="language-Bash"><code>        location /lua/order/add { #用户下单入口，非热点商品下单转到/api/；热点商品下单发Kafka消息
            content_by_lua_file /usr/local/openresty/nginx/lua/seckill-order-add.lua;
        }
        
        location /api/ { #普通下单，走Gateway网关
            proxy_pass http://192.168.200.1:8001;
        }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>测试一下效果：</p><p>这里非热点商品我应该用热点商品接口测试的，但是上面已经说了，得重定向到我的本机8001端口，可能得做<mark>内网穿透？</mark>，但是我试了ngrok工具，貌似不好使，不过不成问题，等后续部署到云服务这自然会成功！</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503042251764.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>说话的这会，订单已经创建了！</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503042327728.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>然后试一下热点商品，<code>S1235433012716432456</code></p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503042256450.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>根据上面的lua脚本，这里的<code>USER+username+id</code>的value是递增排序，我在24小时内访问了多少次，所以不成功，数据库订单也没有创建，改成 0 试试</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503042327094.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>发现变成了1</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503042327135.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>在查看一下数据库</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503042328648.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>好了，热点隔离+抢单功能完美实现，这一块内容，花费了整整一天时间才搞定，感谢不放弃的自己，做技术的，不能蒙混过关！</p>`,63);function S(y,x){const s=u("ExternalLinkIcon");return l(),r("div",null,[c,i("p",null,[e("启动后，访问："),i("a",v,[e("http://8.141.90.31:8888"),d(s)]),e(" (注意IP为安装Druid服务器的IP)")]),o,i("p",null,[e("参考地址："),i("a",m,[e("https://druid.apache.org/docs/latest/tutorials/tutorial-kafka.html"),d(s)])]),b,i("p",null,[e("​ 如果想使用Lua识别用户令牌，我们需要引入"),p,e("模块，是用于 ngx_lua 和 LuaJIT 的 Lua 实现库，在该模块能实现Jwt令牌生成、Jwt令牌校验，依赖库的地址："),i("a",g,[e("https://github.com/SkyLothar/lua-resty-jwt"),d(s)])]),h,i("p",null,[e("​ 我们需要安装"),q,e("，下载地址："),i("a",f,[e("https://github.com/cuiweixie/lua-resty-redis-cluster，下载该文件配置后即可实现Redis集群操作。"),d(s)])]),k])}const L=a(t,[["render",S],["__file","4.Hotspot isolation _ order grabbing.html.vue"]]);export{L as default};
