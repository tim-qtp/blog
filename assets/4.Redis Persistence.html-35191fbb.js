import{_ as e,W as i,X as a,a2 as s}from"./framework-6a3aa88c.js";const d={},p=s(`<p>有两种持久化方式，RDB和AOF</p><h3 id="aof" tabindex="-1"><a class="header-anchor" href="#aof" aria-hidden="true">#</a> AOF</h3><p>其实就是命令追加，Redis处理的每一个写命令都会记录在AOF文件，恢复时通过重新执行这些命令来重建数据集。</p><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/02ab46331c6570fbeaed52ea8f08c718.png" alt="Redis中的AOF工作流程_redis的aof过程-CSDN博客" style="zoom:33%;"><p>在Redis中AOF持久化功能默认是不开启的，需要修改redis.conf，配置文件中的以下参数：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/0e2d081af084c41802c7b5de8aa41bd4.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>1）当 AOF 持久化机制被启用时，Redis 服务器会将接收到的所有写命令追加到 AOF 缓冲区的末尾。</p><p>2）接着将缓冲区中的命令刷新到磁盘的 AOF 文件中，刷新策略有三种：</p><ul><li>always：每次写命令都会同步到 AOF 文件。</li><li>everysec（默认）：每秒同步一次。如果系统崩溃，可能会丢失最后一秒的数据。</li><li>no：在这种模式下，如果发生宕机，那么丢失的数据量由操作系统内核的缓存冲洗策略决定。</li></ul><p>3）随着 AOF 文件的不断增长，Redis 会启用重写机制来生成一个更小的 AOF 文件：</p><ul><li><p>将内存中每个键值对的当前状态转换为一条最简单的 Redis 命令，写入到一个新的 AOF 文件中。即使某个键被修改了多次，在新的 AOF 文件中也只会保留最终的状态。</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/723d6c580c05400b3841bc69566dd61b.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure></li><li><p>Redis 会 fork 一个子进程，子进程负责重写 AOF 文件，主进程不会被（<strong>重写</strong>）阻塞。</p></li></ul><h3 id="rdb" tabindex="-1"><a class="header-anchor" href="#rdb" aria-hidden="true">#</a> RDB</h3><p>RDB 持久化通过创建数据集的快照来工作，在指定的时间间隔内将 Redis 在某一时刻的数据状态保存到磁盘的一个 RDB 文件中。</p><p>可通过 save 和 bgsave 命令两个命令来手动触发 RDB 持久化操作，他们的区别就在于是否在「主线程」里执行：</p><p>①、执行了sav命令，就会在主线程生成RDB文件，由于和执行操作命令在同一个线程，所以如果写入RDB文件的时间太长，会阻塞主线程；</p><p>②、执行了bgsave命令，会创建一个子进程来生成RDB文件，这样可以避免主线程的阻塞；</p><p>以下场景会自动触发 RDB 持久化：</p><p>①、在 Redis 配置文件（通常是 redis.conf）中，可以通过<code>save &lt;seconds&gt; &lt;changes&gt;</code>指令配置自动触发 RDB 持久化的条件。这个指令可以设置多次，每个设置定义了一个时间间隔（秒）和该时间内发生的变更次数阈值。</p><div class="language-xml line-numbers-mode" data-ext="xml"><pre class="language-xml"><code>save 900 1
save 300 10
save 60 10000 //其实原理就是改的越少，我越慢点持久化
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>别看选项名叫save，实际上执行的是bgsave命令，也就是会创建子进程来生成RDB快照文件。</p><p>这意味着：</p><ul><li>如果至少有 1 个键被修改，900 秒后自动触发一次 RDB 持久化。</li><li>如果至少有 10 个键被修改，300 秒后自动触发一次 RDB 持久化。</li><li>如果至少有 10000 个键被修改，60 秒后自动触发一次 RDB 持久化。</li></ul><p>满足以上任一条件，RDB 持久化就会被自动触发。</p><p>②、当 Redis 服务器通过 SHUTDOWN 命令正常关闭时，如果没有禁用 RDB 持久化，Redis 会自动执行一次 RDB 持久化，以确保数据在下次启动时能够恢复。</p><p>③、在 Redis 复制场景中，当一个 Redis 实例被配置为从节点并且与主节点建立连接时，它可能会根据配置接收主节点的 RDB 文件来初始化数据集。这个过程中，主节点会在后台自动触发 RDB 持久化，然后将生成的 RDB 文件发送给从节点。</p><hr><p>这里提一点，Redis的快照是全量快照，也就是说每次执行快照，都是把内存中的「所有数据」都记录到磁盘中。</p><p>所以可以认为，执行快照是一个比较重的操作，如果频率太频繁，可能会对Redis性能产生影响。如果频率太低，服务器故障时，丢失的数据会更多。</p><p>通常可能设置至少 5 分钟才保存一次快照，这时如果 Redis 出现宕机等情况，则意味着最多可能丢失 5 分钟数据。</p><p>这就是 RDB 快照的缺点，在服务器发生故障时，丢失的数据会比 AOF 持久化的方式更多，因为 RDB 快照是全量快照的方式，因此执行的频率不能太频繁，否则会影响 Redis 性能，而 AOF 日志可以以秒级的方式记录操作命令，所以丢失的数据就相对更少。</p><h3 id="两者区别与优点" tabindex="-1"><a class="header-anchor" href="#两者区别与优点" aria-hidden="true">#</a> 两者区别与优点：</h3><div class="hint-container info"><p class="hint-container-title">相关信息</p><p>持久化方式、数据完整性、文件大小、宕机恢复速度、恢复优先级（混用时，优先使用AOF文件进行数据恢复，因为AOF文件通常包含了更完整的操作记录）、使用场景（可以容忍数分钟的数据丢失，追求更快的启动速度）</p></div><p>RDB 非常适合用于备份数据，比如在夜间进行备份，然后将 RDB 文件复制到远程服务器。但可能会丢失最后一次持久化后的数据。</p><p>AOF 的最大优点是灵活，实时性好，可以设置不同的 fsync 策略，如每秒同步一次，每次写入命令就同步，或者完全由操作系统来决定何时同步。但 AOF 文件往往比较大，恢复速度慢，因为它记录了每个写操作。</p><h3 id="rdb-和-aof-如何选择" tabindex="-1"><a class="header-anchor" href="#rdb-和-aof-如何选择" aria-hidden="true">#</a> RDB 和 AOF 如何选择：</h3><p>如果需要尽可能减少数据丢失，AOF 是更好的选择。尤其是在频繁写入的环境下，设置 AOF 每秒同步可以最大限度减少数据丢失。</p><p>如果性能是首要考虑，RDB 可能更适合。RDB 的快照生成通常对性能影响较小，并且数据恢复速度快。</p><p>如果系统需要经常重启，并且希望系统重启后快速恢复，RDB 可能是更好的选择。虽然 AOF 也提供了良好的恢复能力，但重写 AOF 文件可能会比较慢。</p><p>在许多生产环境中，同时启用 RDB 和 AOF 被认为是最佳实践：</p><ul><li>使用 RDB 进行快照备份。</li><li>使用 AOF 保证崩溃后的最大数据完整性。</li></ul>`,40),l=[p];function n(c,r){return i(),a("div",null,l)}const o=e(d,[["render",n],["__file","4.Redis Persistence.html.vue"]]);export{o as default};
