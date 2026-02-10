import{_ as d,W as a,X as r,$ as e,a0 as i,Z as s,a2 as l,D as t}from"./framework-28eb7fba.js";const c={},o=l(`<h2 id="_1-分布式锁" tabindex="-1"><a class="header-anchor" href="#_1-分布式锁" aria-hidden="true">#</a> 1 分布式锁</h2><h3 id="_1-1-问题分析" tabindex="-1"><a class="header-anchor" href="#_1-1-问题分析" aria-hidden="true">#</a> 1.1 问题分析</h3><p>上面抢单过程实现了，但其实还是有问题，会发生超卖问题，如下图：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503050002204.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>​ 在多线程执行的情况下，上面的抢单流程会发生超卖问题，比如只剩下1个商品，多线程同时判断是否有库存的时候，会同时判断有库存，最终导致1个商品多个订单的问题发生。</p><p>因为库存判断和减库存分成了两步去做，这不是原子操作。</p><p>但是我们现在不是使用SQL操作数据库，所以之前的操作步骤放一块行不通了！就得用其他办法了！</p><p>不过，实际处理的时候，mysql和redis会有所不同。</p><h3 id="_1-2-redisson分布式锁" tabindex="-1"><a class="header-anchor" href="#_1-2-redisson分布式锁" aria-hidden="true">#</a> 1.2 redisson分布式锁</h3><h4 id="_1-2-1-分布式锁介绍" tabindex="-1"><a class="header-anchor" href="#_1-2-1-分布式锁介绍" aria-hidden="true">#</a> 1.2.1 分布式锁介绍</h4><p>​ 解决上面超卖问题，我们可以采用分布式锁来控制，分布式锁的原理很简单。</p><p>​ 分布式锁主要是实现在分布式场景下保证数据的最终一致性。在单进程的系统中，存在多个线程可以同时改变某个变量（可变共享变量）时，就需要对变量或代码块做同步(lock—synchronized)，使其在修改这种变量时能够线性执行消除并发修改变量。但分布式系统是多部署、多进程的，开发语言提供的并发处理API在此场景下就无能为力了。</p><p>目前市面上分布式锁常见的实现方式有三种：</p><div class="language-Plaintext line-numbers-mode" data-ext="Plaintext"><pre class="language-Plaintext"><code>1.基于数据库实现分布式锁； 
2.基于缓存（Redis等）实现分布式锁（推荐）； 
3.基于Zookeeper实现分布式锁；
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>但是redis集群有个啥坏处呢，就是主从节点问题（主挂了，从替代），两把锁同时存在，又怎么能实现数据一致性呢！</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503050057602.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h4 id="_1-2-2-redisson介绍" tabindex="-1"><a class="header-anchor" href="#_1-2-2-redisson介绍" aria-hidden="true">#</a> 1.2.2 Redisson介绍</h4><p>​ 大部分网站使用的分布式锁是基于缓存的，有更好的性能，而缓存一般是以集群方式部署，保证了高可用性。而Redis分布式锁官方推荐使用redisson。</p><p>Redisson原理图如下：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503050002254.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p><strong>Redisson锁说明：</strong></p><div class="language-Plaintext line-numbers-mode" data-ext="Plaintext"><pre class="language-Plaintext"><code>1、redission获取锁释放锁的使用和JDK里面的lock很相似，底层的实现采用了类似lock的处理方式
2、redisson 依赖redis，因此使用redisson 锁需要服务端安装redis，而且redisson 支持单机和集群两种模式下的锁的实现
3、redisson 在多线程或者说是分布式环境下实现机制，其实是通过设置key的方式进行实现，也就是说多个线程为了抢占同一个锁，其实就是争抢设置key。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可重入锁：</p><p>任意线程在获取到锁之后，再次获取该锁而不会被该锁所阻塞</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503051032339.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p><code>ReentrantLock</code>、<code>synchronized</code>、<code>Redisson</code>都是可重入锁，使用<code>计数器</code>实现</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503051036998.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p><strong>Redisson原理：</strong></p><p>1)加锁源码：</p><div class="language-Lua line-numbers-mode" data-ext="Lua"><pre class="language-Lua"><code>if (redis.call(&#39;exists&#39;, KEYS[1]) == 0) then --锁不存在
        redis.call(&#39;hset&#39;, KEYS[1], ARGV[2], 1); --设置值进去，key是锁key，ARGV是用户的唯一标识符，表示用户获取了这把锁（例如客户端 ID 或线程 ID）
         redis.call(&#39;pexpire&#39;, KEYS[1], ARGV[1]); 
         return nil;
          end;
if (redis.call(&#39;hexists&#39;, KEYS[1], ARGV[2]) == 1) then --检查哈希表 KEYS[1] 中是否存在字段 ARGV[2]，如果存在（== 1），表示当前客户端已经持有锁，进入下一步
        redis.call(&#39;hincrby&#39;, KEYS[1], ARGV[2], 1); --计数器加1
        redis.call(&#39;pexpire&#39;, KEYS[1], ARGV[1]); --更新键 KEYS[1] 的过期时间
        return nil;
        end;
return redis.call(&#39;pttl&#39;, KEYS[1]);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>将业务封装在lua中发给redis，保障业务执行的原子性。</p><blockquote><p><strong>示例：</strong></p><p>假设有两个客户端 A 和 B，尝试获取同一把锁，锁的键名为 <code>my_lock</code>，过期时间为 5000 毫秒（5 秒），客户端的唯一标识符分别为 <code>client_A</code> 和 <code>client_B</code>。</p><ul><li><strong>客户端 A 第一次获取锁：</strong><ul><li>执行脚本，<code>KEYS[1]</code> 为 <code>my_lock</code>，<code>ARGV[1]</code> 为 <code>5000</code>，<code>ARGV[2]</code> 为 <code>client_A</code>。</li><li>因为锁不存在，客户端 A 成功获取锁，哈希表 <code>my_lock</code> 中字段 <code>client_A</code> 的值被设置为 <code>1</code>，过期时间为 5000 毫秒。</li></ul></li><li><strong>客户端 A 第二次获取锁（重入）：</strong><ul><li>执行脚本，参数同上。</li><li>因为客户端 A 已持有锁，属于重入操作，哈希表 <code>my_lock</code> 中字段 <code>client_A</code> 的值被加 1（变为 2），过期时间重新设置为 5000 毫秒。</li></ul></li><li><strong>客户端 B 尝试获取锁：</strong><ul><li>执行脚本，<code>KEYS[1]</code> 为 <code>my_lock</code>，<code>ARGV[1]</code> 为 <code>5000</code>，<code>ARGV[2]</code> 为 <code>client_B</code>。</li><li>因为锁已被客户端 A 持有，客户端 B 获取锁失败，脚本返回 <code>my_lock</code> 的剩余生存时间，单位为毫秒。</li></ul></li></ul></blockquote><p>2)释放锁：</p><div class="language-Lua line-numbers-mode" data-ext="Lua"><pre class="language-Lua"><code>if (redis.call(&#39;exists&#39;, KEYS[1]) == 0) then
       redis.call(&#39;publish&#39;, KEYS[2], ARGV[1]);
        return 1; 
        end;
if (redis.call(&#39;hexists&#39;, KEYS[1], ARGV[3]) == 0) then 
     return nil;
     end;
local counter = redis.call(&#39;hincrby&#39;, KEYS[1], ARGV[3], -1); 
if (counter &gt; 0) then
     redis.call(&#39;pexpire&#39;, KEYS[1], ARGV[2]); 
     return 0; 
else redis.call(&#39;del&#39;, KEYS[1]); 
     redis.call(&#39;publish&#39;, KEYS[2], ARGV[1]); 
     return 1;
     end;
return nil;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><h3 id="参数说明" tabindex="-1"><a class="header-anchor" href="#参数说明" aria-hidden="true">#</a> 参数说明</h3><ul><li><code>KEYS[1]</code>：锁的名称（Redis 键名）。</li><li><code>KEYS[2]</code>：用于发布通知的频道名称。</li><li><code>ARGV[1]</code>：发布到频道的消息内容（通常是锁的名称或其他标识）。</li><li><code>ARGV[2]</code>：锁的过期时间（以毫秒为单位）。</li><li><code>ARGV[3]</code>：客户端的唯一标识（用于区分锁的持有者）。</li></ul><p>1、<strong><code>exists</code></strong>：检查锁（<code>KEYS[1]</code>）是否存在。</p><ul><li>如果锁不存在（<code>exists</code> 返回 0），说明<mark>锁已经被释放或过期</mark>。</li><li>此时，脚本会通过 <code>publish</code> 向频道 <code>KEYS[2]</code> 发送一条消息（<code>ARGV[1]</code>），通知其他客户端锁已释放。</li><li>返回 <code>1</code>，表示锁不存在，无需进一步操作。</li></ul><p>2、<strong><code>hexists</code></strong>：检查锁是否由当前客户端持有，检查锁（<code>KEYS[1]</code>）的哈希表中是否存在当前客户端的标识（<code>ARGV[3]</code>）。</p><ul><li>如果不存在（<code>hexists</code> 返回 0），说明当前客户端并未持有锁。</li><li>返回 <code>nil</code>，表示无法释放锁（<mark>因为锁不是当前客户端持有的</mark>）。</li></ul><p>3、<strong><code>hincrby</code></strong>：减少锁的持有计数，将锁的持有计数减 1，<mark>到了这一步，说明上一步<code>ARGV[3]</code>是持有锁的</mark>。</p><ul><li>如果锁是可重入的（即同一个客户端可以多次获取锁），每次释放锁时，计数会减少。</li><li><code>counter</code> 是减少后的计数。</li></ul><p>4、判断锁是否需要删除</p><ul><li><strong><code>counter &gt; 0</code></strong>：如果锁的持有计数仍然大于 0，说明锁还未完全释放。 <ul><li>更新锁的过期时间（<code>pexpire</code>），防止锁过早过期。</li><li>返回 <code>0</code>，表示锁未完全释放。</li></ul></li><li><strong><code>counter &lt;= 0</code></strong>：如果锁的持有计数归零，说明锁已经完全释放。 <ul><li>删除锁（<code>del</code>）。</li><li>通过 <code>publish</code> 向频道 <code>KEYS[2]</code> 发送一条消息（<code>ARGV[1]</code>），通知其他客户端锁已释放。</li><li>返回 <code>1</code>，表示锁已完全释放。</li></ul></li></ul></blockquote><p>执行lock.unlock(),每次都对myLock数据结构中的那个加锁次数减1。如果发现加锁次数是0了，说明这个客户端已经不再持有锁了，此时就会用：<code>del myLock</code>命令，从redis里删除这个key,另外的客户端2就可以尝试完成加锁了。</p><p>3)缺点：</p><p>Redisson存在一个问题，就是如果你对某个redis master实例，写入了myLock这种锁key的value，此时会异步复制给对应的master slave实例。但是这个过程中一旦发生redis master宕机，主备切换，redis slave变为了redis master。接着就会导致，客户端2来尝试加锁的时候，在新的redis master上完成了加锁，而客户端1也以为自己成功加了锁。此时就会导致多个客户端对一个分布式锁完成了加锁。这时系统在业务上一定会出现问题，导致脏数据的产生。</p><h4 id="_1-2-3-redisson配置" tabindex="-1"><a class="header-anchor" href="#_1-2-3-redisson配置" aria-hidden="true">#</a> 1.2.3 Redisson配置</h4><p><strong>1)引入依赖</strong></p><p>在<code>seckill-order</code>的pom.xml中引入依赖：</p><div class="language-XML line-numbers-mode" data-ext="XML"><pre class="language-XML"><code>&lt;dependency&gt;
    &lt;groupId&gt;org.redisson&lt;/groupId&gt;
    &lt;artifactId&gt;redisson-spring-boot-starter&lt;/artifactId&gt;
    &lt;version&gt;3.11.0&lt;/version&gt;
&lt;/dependency&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>2)配置Redis链接</strong></p><p>在<code>seckill-order</code>的resources下新建文件<code>redisson.yml</code>，主要用于配置redis集群节点链接配置，代码如下：</p><div class="language-YAML line-numbers-mode" data-ext="YAML"><pre class="language-YAML"><code>clusterServersConfig:
  # 连接空闲超时，单位：毫秒 默认10000
  idleConnectionTimeout: 10000
  pingTimeout: 1000
  # 同任何节点建立连接时的等待超时。时间单位是毫秒 默认10000
  connectTimeout: 10000
  # 等待节点回复命令的时间。该时间从命令发送成功时开始计时。默认3000
  timeout: 3000
  # 命令失败重试次数
  retryAttempts: 3
  # 命令重试发送时间间隔，单位：毫秒
  retryInterval: 1500
  # 重新连接时间间隔，单位：毫秒
  reconnectionTimeout: 3000
  # 执行失败最大次数
  failedAttempts: 3
  # 密码
  #password: test1234
  # 单个连接最大订阅数量
  subscriptionsPerConnection: 5
  clientName: null
  # loadBalancer 负载均衡算法类的选择
  loadBalancer: !&lt;org.redisson.connection.balancer.RoundRobinLoadBalancer&gt; {}
  #从节点发布和订阅连接的最小空闲连接数
  slaveSubscriptionConnectionMinimumIdleSize: 1
  #从节点发布和订阅连接池大小 默认值50
  slaveSubscriptionConnectionPoolSize: 50
  # 从节点最小空闲连接数 默认值32
  slaveConnectionMinimumIdleSize: 32
  # 从节点连接池大小 默认64
  slaveConnectionPoolSize: 64
  # 主节点最小空闲连接数 默认32
  masterConnectionMinimumIdleSize: 32
  # 主节点连接池大小 默认64
  masterConnectionPoolSize: 64
  # 订阅操作的负载均衡模式
  subscriptionMode: SLAVE
  # 只在从服务器读取
  readMode: SLAVE
  # 集群地址
  nodeAddresses:
    - &quot;redis://redis-server:7001&quot;
    - &quot;redis://redis-server:7002&quot;
    - &quot;redis://redis-server:7003&quot;
    - &quot;redis://redis-server:7004&quot;
    - &quot;redis://redis-server:7005&quot;
    - &quot;redis://redis-server:7006&quot;
  # 对Redis集群节点状态扫描的时间间隔。单位是毫秒。默认1000
  scanInterval: 1000
  #这个线程池数量被所有RTopic对象监听器，RRemoteService调用者和RExecutorService任务共同共享。默认2
threads: 0
#这个线程池数量是在一个Redisson实例内，被其创建的所有分布式数据类型和服务，以及底层客户端所一同共享的线程池里保存的线程数量。默认2
nettyThreads: 0
# 编码方式 默认org.redisson.codec.JsonJacksonCodec
codec: !&lt;org.redisson.codec.JsonJacksonCodec&gt; {}
#传输模式
transportMode: NIO
# 分布式锁自动过期时间，防止死锁，默认30000
lockWatchdogTimeout: 30000
# 通过该参数来修改是否按订阅发布消息的接收顺序出来消息，如果选否将对消息实行并行处理，该参数只适用于订阅发布消息的情况, 默认true
keepPubSubOrder: true
# 用来指定高性能引擎的行为。由于该变量值的选用与使用场景息息相关（NORMAL除外）我们建议对每个参数值都进行尝试。
#
#该参数仅限于Redisson PRO版本。
#performanceMode: HIGHER_THROUGHPUT
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>3)创建Redisson管理对象</strong></p><p>​ Redisson管理对象有2个，分别为<code>RedissonClient</code>和<code>RedissonConnectionFactory</code>，我们只用在项目的<code>RedisConfig</code>中配置一下这2个对象即可，在<code>com.seckill.order.config.RedisConfig</code>中添加的代码如下：</p><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>/**
 * Redisson客户端
 */
@Bean
public RedissonClient redisson() throws IOException {
    ClassPathResource resource = new ClassPathResource(&quot;redisson.yml&quot;);
    Config config = Config.fromYAML(resource.getInputStream());
    RedissonClient redisson = Redisson.create(config);
    return redisson;
}

/**
 * Redisson工厂对象
 */
@Bean
public RedissonConnectionFactory redissonConnectionFactory(RedissonClient redisson) {
    return new RedissonConnectionFactory(redisson);
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>4)锁操作方法实现</strong></p><p>要想用到分布式锁，我们就必须要实现获取锁和释放锁，获取锁和释放锁可以编写<code>com.seckill.order.config.DistributedLocker</code>接口，代码如下：</p><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>public interface DistributedLocker {
    /**
     * lock(), 拿不到lock就不罢休，不然线程就一直block
     */
    RLock lock(String lockKey);
    /**
     * timeout为加锁时间，单位为秒
     */
    RLock lock(String lockKey, long timeout);
    /**
     * timeout为加锁时间，时间单位由unit确定
     */
    RLock lock(String lockKey, TimeUnit unit, long timeout);
    /**
     * tryLock()，马上返回，拿到lock就返回true，不然返回false。
     * 带时间限制的tryLock()，拿不到lock，就等一段时间，超时返回false.
     */
    boolean tryLock(String lockKey, TimeUnit unit, long waitTime, long leaseTime);
    /**
     * 解锁
     */
    void unLock(String lockKey);
    /**
     * 解锁
     */
    void unLock(RLock lock);
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>实现上面接口中对应的锁管理方法,编写锁管理类<code>com.seckill.order.config.RedissonDistributedLocker</code>，代码如下：</p><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>@Component
public class RedissonDistributedLocker implements DistributedLocker {

    @Autowired
    private RedissonClient redissonClient;

    /**
     * lock(), 拿不到lock就不罢休，不然线程就一直block
     */
    @Override
    public RLock lock(String lockKey) {
        RLock lock = redissonClient.getLock(lockKey);
        lock.lock();
        return lock;
    }

    /**
     * timeout为加锁时间，单位为秒
     */
    @Override
    public RLock lock(String lockKey, long timeout) {
        RLock lock = redissonClient.getLock(lockKey);
        lock.lock(timeout, TimeUnit.SECONDS);
        return lock;
    }

    /**
     * timeout为加锁时间，时间单位由unit确定
     */
    @Override
    public RLock lock(String lockKey, TimeUnit unit, long timeout) {
        RLock lock = redissonClient.getLock(lockKey);
        lock.lock(timeout, unit);
        return lock;
    }

    /**
     * tryLock()，马上返回，拿到lock就返回true，不然返回false。
     * 带时间限制的tryLock()，拿不到lock，就等一段时间，超时返回false.
     */
    @Override
    public boolean tryLock(String lockKey, TimeUnit unit, long waitTime, long leaseTime) {
        RLock lock = redissonClient.getLock(lockKey);
        try {
            return lock.tryLock(waitTime, leaseTime, unit);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        return false;
    }

    /**
     * 解锁
     */
    @Override
    public void unLock(String lockKey) {
        RLock lock = redissonClient.getLock(lockKey);
        lock.unlock();
    }

    /**
     * 解锁
     */
    @Override
    public void unLock(RLock lock) {
        lock.unlock();
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>5)测试代码</strong></p><p>测试Redisson分布式锁的代码如下：</p><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>@RestController
@RequestMapping(value = &quot;/redisson&quot;)
public class RedissonController {

    @Autowired
    private RedissonDistributedLocker distributedLocker;

    /**
     * 多个用户实现加锁操作，只允许有一个用户可以获取到对应锁
     */
    @GetMapping(value = &quot;/lock/{time}&quot;)
    public String lock(@PathVariable(value = &quot;time&quot;) Long time) throws InterruptedException {
        System.out.println(&quot;当前休眠标识时间：&quot; + time);

        //获取锁
        RLock rlock = distributedLocker.lock(&quot;UUUUU&quot;);
        System.out.println(&quot;执行休眠：&quot; + time);

        TimeUnit.SECONDS.sleep(time);

        System.out.println(&quot;===========休眠完成，准备释放锁：&quot; + time);
        //释放锁
        distributedLocker.unLock(rlock);
        return &quot;OK&quot;;
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503051236807.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503051237195.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="_1-3-redisson分布式锁控制超卖" tabindex="-1"><a class="header-anchor" href="#_1-3-redisson分布式锁控制超卖" aria-hidden="true">#</a> 1.3 Redisson分布式锁控制超卖</h3><p>​ 我们把上面秒杀下单会出现超卖的部分代码用Redisson分布式锁来控制一下，代码如下：</p><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>@Autowired
private RedissonDistributedLocker distributedLocker;

/**
 * 秒杀下单
 *
 * @param orderMap
 */
@Override
public void addHotOrder(Map&lt;String, String&gt; orderMap) {
    String id = orderMap.get(&quot;id&quot;);
    String username = orderMap.get(&quot;username&quot;);
    //key
    String key = &quot;SKU_&quot; + id;
    
    //分布式锁的key
    String lockkey = &quot;LOCKSKU_&quot; + id;

    //用户购买的key
    String userKey = &quot;USER&quot; + username + &quot;ID&quot; + id;

    //尝试获取锁，等待10秒，自己获得锁后一直不解锁则10秒后自动解锁
    boolean bo = distributedLocker.tryLock(lockkey, TimeUnit.SECONDS, 10L, 10L);

    if (bo) {
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
        distributedLocker.unLock(lockkey);
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_2-分布式事务" tabindex="-1"><a class="header-anchor" href="#_2-分布式事务" aria-hidden="true">#</a> 2 分布式事务</h2><h3 id="_2-1-分布式事务介绍" tabindex="-1"><a class="header-anchor" href="#_2-1-分布式事务介绍" aria-hidden="true">#</a> 2.1 分布式事务介绍</h3><p><strong>1)事务</strong></p><p>​ 事务提供一种机制将一个业务涉及的所有操作纳入到一个不可分割的执行单元，组成事务的所有操作只有在所有操作均能正常执行的情况下方能提交，只要其中任一操作执行失败，都将导致整个事务的回滚。简单地说，事务提供一种“要么什么都不做，要么做全套（All or Nothing）”机制。</p><p><strong>2)本地事务4大特性</strong></p><p><strong>CAID：</strong></p><div class="language-Plaintext line-numbers-mode" data-ext="Plaintext"><pre class="language-Plaintext"><code>A：原子性(Atomicity)，一个事务(transaction)中的所有操作，要么全部完成，要么全部不完成，不会结束在中间某个环节。
事务在执行过程中发生错误，会被回滚（Rollback）到事务开始前的状态，就像这个事务从来没有执行过一样。
就像你买东西要么交钱收货一起都执行，要么发不出货，就退钱。

C：一致性(Consistency)，事务的一致性指的是在一个事务执行之前和执行之后数据库都必须处于一致性状态。
如果事务成功地完成，那么系统中所有变化将正确地应用，系统处于有效状态。
如果在事务中出现错误，那么系统中的所有变化将自动地回滚，系统返回到原始状态。

I：隔离性(Isolation)，指的是在并发环境中，当不同的事务同时操纵相同的数据时，每个事务都有各自的完整数据空间。
由并发事务所做的修改必须与任何其他并发事务所做的修改隔离。事务查看数据更新时，数据所处的状态要么是另一事务修改它之前的状态，要么是另一事务修改它之后的状态，事务不会查看到中间状态的数据。
打个比方，你买东西这个事情，是不影响其他人的。

D：持久性(Durability)，指的是只要事务成功结束，它对数据库所做的更新就必须保存下来。
即使发生系统崩溃，重新启动数据库系统后，数据库还能恢复到事务成功结束时的状态。
打个比方，你买东西的时候需要记录在账本上，即使老板忘记了那也有据可查。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>3)分布式事务</strong></p><p>​ 分布式事务指事务的参与者、支持事务的服务器、资源服务器以及事务管理器分别位于不同的分布式系统的不同节点之上。简单的说，就是一次大的操作由不同的小操作组成，这些小的操作分布在不同的服务器上，且属于不同的应用，分布式事务需要保证这些小操作要么全部成功，要么全部失败。本质上来说，分布式事务就是为了保证不同数据库的数据一致性。</p><p>什么时候会产生分布式事务呢？</p><p>1.多个Service</p><p>2.多个Resource</p><p>如下订单支付业务流程：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503050002081.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p><strong>4)CAP定理</strong></p><p>CAP 定理，又被叫作布鲁尔定理。</p><p><strong>C (一致性)</strong>：对于数据分布在不同节点上的数据来说，如果在某个节点更新了数据，那么在其他节点如果都能读取到这个的数据，那么就称为强一致，如果有某个节点没有读取到，那就是分布式不一致。</p><p><strong>A (可用性)</strong>：非故障的节点在合理的时间内返回合理的响应(不是错误和超时的响应)。可用性的两个关键一个是合理的时间，一个是合理的响应。</p><p>合理的时间指的是请求不能被阻塞，应该在合理的时间给出返回。合理的响应指的是系统应该明确返回结果并且结果是正确的，这里的正确指的是比如应该返回 50，而不是返回 40。</p><p><strong>P (分区容错性)</strong>：当出现网络分区后，系统能够继续工作。打个比方，这里集群有多台机器，有台机器网络出现了问题，但是这个集群仍然可以正常工作。</p><p>熟悉 CAP 的人都知道，三者不能共有，如果感兴趣可以搜索 CAP 的证明，在分布式系统中，网络无法 100% 可靠，分区其实是一个必然现象。</p><p>如果我们选择了 CA 而放弃了 P，那么当发生分区现象时，为了保证一致性，这个时候必须拒绝请求，但是 A 又不允许，所以分布式系统理论上不可能选择 CA 架构，只能选择 CP 或者 AP 架构。</p><p>对于 CP 来说，放弃可用性，追求一致性和分区容错性，我们的 ZooKeeper 其实就是追求的强一致。</p><p>对于 AP 来说，放弃一致性(这里说的一致性是强一致性)，追求分区容错性和可用性，这是很多分布式系统设计时的选择，后面的 BASE 也是根据 AP 来扩展。</p><p>顺便一提，CAP 理论中是忽略网络延迟，也就是当事务提交时，从节点 A 复制到节点 B 没有延迟，但是在现实中这个是明显不可能的，所以总会有一定的时间是不一致。</p><p>同时 CAP 中选择两个，比如你选择了 CP，并不是叫你放弃 A。因为 P 出现的概率实在是太小了，大部分的时间你仍然需要保证 CA。</p><p>就算分区出现了你也要为后来的 A 做准备，比如通过一些日志的手段，是其他机器回复至可用。</p><h3 id="_2-2-分布式事务解决方案" tabindex="-1"><a class="header-anchor" href="#_2-2-分布式事务解决方案" aria-hidden="true">#</a> 2.2 分布式事务解决方案</h3><p>​ 有了上面的理论基础后，这里开始介绍几种常见的分布式事务的解决方案。</p><h4 id="_2-2-1-2pc" tabindex="-1"><a class="header-anchor" href="#_2-2-1-2pc" aria-hidden="true">#</a> 2.2.1 2PC</h4><p>两阶段提交协议(Two Phase Commitment Protocol)中，涉及到两种角色</p><p>一个事务协调者（coordinator）：负责协调多个参与者进行事务投票及提交(回滚)</p><p>多个事务参与者（participants）：即本地事务执行者</p><p>总共处理步骤有两个 1）投票阶段（voting phase）：协调者将通知事务参与者准备提交或取消事务，然后进入表决过程。参与者将告知协调者自己的决策：同意（事务参与者本地事务执行成功，但未提交）或取消（本地事务执行故障）；</p><p>2）提交阶段（commit phase）：收到参与者的通知后，协调者再向参与者发出通知，根据反馈情况决定各参与者是否要提交还是回滚；</p><div class="hint-container tip"><p class="hint-container-title">提示</p><p>就好比什么意思呢？</p><p>想象一下，你和你的朋友们计划一起去旅行。旅行计划需要大家共同决定，所有人都同意才能出发。如果有人不同意，那就只能取消计划。这个过程可以分成两个阶段：</p><h4 id="第一阶段-投票阶段-大家表态" tabindex="-1"><a class="header-anchor" href="#第一阶段-投票阶段-大家表态" aria-hidden="true">#</a> <strong>第一阶段：投票阶段（大家表态）</strong></h4><ol><li><strong>协调者（你）</strong>：你作为组织者，给每个朋友打电话，问他们是否准备好出发。</li><li><strong>参与者（朋友们）</strong>：每个朋友检查自己的情况（比如有没有事、钱够不够、心情好不好等）。如果一切顺利，他们就告诉你“我准备好了，可以出发”；如果有问题，就会说“我不行，我有事”。</li></ol><p>在这个阶段，每个朋友只是表态，还没有真正“出发”，只是告诉你会不会去。</p><h4 id="第二阶段-提交阶段-决定是否出发" tabindex="-1"><a class="header-anchor" href="#第二阶段-提交阶段-决定是否出发" aria-hidden="true">#</a> <strong>第二阶段：提交阶段（决定是否出发）</strong></h4><ol><li><strong>协调者（你）</strong>：你收集完所有朋友的反馈后，开始做决定： <ul><li>如果所有朋友都说“可以出发”，你就再给每个人打电话，说“好，我们出发！”。</li><li>如果有一个人说“不行”，你就告诉所有人“取消计划，不去了”。</li></ul></li><li><strong>参与者（朋友们）</strong>：朋友们根据你的最终决定行动： <ul><li>如果你通知“出发”，他们就真的出发。</li><li>如果你通知“取消”，他们就待在家里，不去了。</li></ul></li></ol></div><p>如果所示 1-2为第一阶段，2-3为第二阶段</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503050002033.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503050002909.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p><strong>优点：</strong> 尽量保证了数据的强一致，适合对数据强一致要求很高的关键领域。</p><p><strong>缺点：</strong> 牺牲了可用性，对性能影响较大，<mark>不适合高并发高性能场景</mark>，如果分布式系统跨接口调用，目前 .NET 界还没有实现方案。</p><h4 id="_2-2-2-tcc" tabindex="-1"><a class="header-anchor" href="#_2-2-2-tcc" aria-hidden="true">#</a> 2.2.2 TCC</h4><p>TCC是一种比较成熟的分布式事务解决方案，可用于解决跨库操作的数据一致性问题； TCC是服务化的两阶段编程模型，其Try、Confirm、Cancel 3个方法均由业务编码实现；</p><p>其中Try操作作为一阶段，负责资源的检查和预留，</p><p>Confirm操作作为二阶段提交操作，执行真正的业务，</p><p>Cancel是预留资源的取消；</p><p>如下图所示，业务实现TCC服务之后，该TCC服务将作为分布式事务的其中一个资源，参与到整个分布式事务中；事务管理器分2阶段协调TCC服务，在第一阶段调用所有TCC服务的Try方法，在第二阶段执行所有TCC服务的Confirm或者Cancel方法；</p><div class="hint-container tip"><p class="hint-container-title">提示</p><p>再举个例子：</p><p>假设你在一个电商平台上下单，这个订单涉及到两个服务：<strong>库存服务</strong>和<strong>支付服务</strong>。</p><h4 id="第一步-try阶段-尝试" tabindex="-1"><a class="header-anchor" href="#第一步-try阶段-尝试" aria-hidden="true">#</a> <strong>第一步：Try阶段（尝试）</strong></h4><ol><li><strong>库存服务</strong>： <ul><li>检查商品库存是否足够。</li><li>如果库存足够，就冻结库存（但不真正扣减）。</li><li>如果库存不足，返回失败。</li></ul></li><li><strong>支付服务</strong>： <ul><li>检查你的余额是否足够。</li><li>如果余额足够，就预扣金额（但不真正扣减）。</li><li>如果余额不足，返回失败。</li></ul></li></ol><h4 id="第二步-confirm或cancel阶段" tabindex="-1"><a class="header-anchor" href="#第二步-confirm或cancel阶段" aria-hidden="true">#</a> <strong>第二步：Confirm或Cancel阶段</strong></h4><ul><li>如果库存服务和支付服务的Try阶段都成功了： <ul><li>调用<strong>Confirm操作</strong>： <ul><li>库存服务真正扣减库存。</li><li>支付服务真正扣除余额。</li><li>下单成功！</li></ul></li></ul></li><li>如果任何一个服务的Try阶段失败了： <ul><li>调用<strong>Cancel操作</strong>： <ul><li>库存服务解冻库存。</li><li>支付服务返还预扣的金额。</li><li>下单失败，事务回滚。</li></ul></li></ul></li></ul></div><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503050002263.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><table><thead><tr><th>操作方法</th><th>含义</th></tr></thead><tbody><tr><td>Try</td><td>预留业务资源/数据效验-尝试检查当前操作是否可执行</td></tr><tr><td>Confirm</td><td>确认执行业务操作，实际提交数据，不做任何业务检查，try成功，confirm必定成功，需保证幂等</td></tr><tr><td>Cancel</td><td>取消执行业务操作，实际回滚数据，需保证幂等</td></tr></tbody></table><h4 id="优点" tabindex="-1"><a class="header-anchor" href="#优点" aria-hidden="true">#</a> <strong>优点</strong></h4><ol><li><strong>实现相对简单</strong>：比2PC简单一些，不需要复杂的锁机制。</li><li><strong>性能更好</strong>：因为Try阶段只是预留资源，不会真正修改数据，减少了锁冲突。</li><li><strong>灵活性高</strong>：可以根据业务需求灵活实现Try、Confirm和Cancel逻辑。</li></ol><h4 id="缺点" tabindex="-1"><a class="header-anchor" href="#缺点" aria-hidden="true">#</a> <strong>缺点</strong></h4><ol><li><strong>实现复杂</strong>：需要程序员手动实现Try、Confirm和Cancel逻辑，工作量较大。</li><li><strong>幂等性要求高</strong>：Confirm和Cancel操作必须保证幂等性，否则可能会出现数据不一致的问题。</li><li><strong>部分场景难以定义</strong>：有些复杂的业务逻辑很难拆分成Try、Confirm和Cancel三个阶段。</li><li><strong>可能出现失败</strong>：在Confirm或Cancel阶段可能会失败，导致事务不一致。</li></ol><h2 id="_3-seata分布式事务" tabindex="-1"><a class="header-anchor" href="#_3-seata分布式事务" aria-hidden="true">#</a> 3 Seata分布式事务</h2><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503051656797.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="_3-1-seata介绍" tabindex="-1"><a class="header-anchor" href="#_3-1-seata介绍" aria-hidden="true">#</a> 3.1 Seata介绍</h3><p>​ Seata 是一款开源的分布式事务解决方案，致力于在微服务架构下提供高性能和简单易用的分布式事务服务。在 Seata 开源之前，Seata 对应的内部版本在阿里经济体内部一直扮演着分布式一致性中间件的角色，帮助经济体平稳的度过历年的双11，对各BU业务进行了有力的支撑。经过多年沉淀与积累，商业化产品先后在阿里云、金融云进行售卖。</p>`,119),v={href:"https://seata.apache.org/zh-cn/docs/overview/what-is-seata/",target:"_blank",rel:"noopener noreferrer"},u=l(`<p>Seata特色功能</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503050003120.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="_3-2-seata模式讲解" tabindex="-1"><a class="header-anchor" href="#_3-2-seata模式讲解" aria-hidden="true">#</a> 3.2 Seata模式讲解</h3><p>​ Seata 是一款开源的分布式事务解决方案，致力于提供高性能和简单易用的分布式事务服务。Seata 将为用户提供了 AT、TCC、SAGA 和 XA 事务模式，为用户打造一站式的分布式解决方案。</p><p>相关术语：</p><div class="language-Plaintext line-numbers-mode" data-ext="Plaintext"><pre class="language-Plaintext"><code>TC - 事务协调者
维护全局和分支事务的状态，驱动全局事务提交或回滚。

TM - 事务管理器
定义全局事务的范围：开始全局事务、提交或回滚全局事务。

RM - 资源管理器
管理分支事务处理的资源，与TC交谈以注册分支事务和报告分支事务的状态，并驱动分支事务提交或回滚。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_3-2-1-at模式" tabindex="-1"><a class="header-anchor" href="#_3-2-1-at模式" aria-hidden="true">#</a> 3.2.1 AT模式</h4><p>前提：</p><div class="language-Plaintext line-numbers-mode" data-ext="Plaintext"><pre class="language-Plaintext"><code>1.基于支持本地 ACID 事务的关系型数据库。
2.Java 应用，通过 JDBC 访问数据库。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503051723925.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p><strong>整体机制：</strong></p><p>两阶段提交协议的演变：</p><div class="language-Plaintext line-numbers-mode" data-ext="Plaintext"><pre class="language-Plaintext"><code>一阶段：业务数据和回滚日志记录在同一个本地事务中提交，释放本地锁和连接资源。

二阶段：
        提交异步化，非常快速地完成。
        回滚通过一阶段的回滚日志进行反向补偿。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503050003165.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p><strong>写隔离（<mark>写操作，互相没有干扰</mark>）：</strong></p><div class="language-Plaintext line-numbers-mode" data-ext="Plaintext"><pre class="language-Plaintext"><code>1.一阶段本地事务提交前，需要确保先拿到 全局锁 。
2.拿不到 全局锁 ，不能提交本地事务。
3.拿全局锁的尝试被限制在一定范围内，超出范围将放弃，并回滚本地事务，释放本地锁。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>以一个示例来说明：</p><p>两个全局事务 tx1 和 tx2，分别对 a 表的 m 字段进行更新操作，m 的初始值 1000。</p><p>tx1 先开始，开启本地事务，拿到本地锁，更新操作 m = 1000 - 100 = 900。本地事务提交前，先拿到该记录的<strong>全局锁</strong> ，本地提交释放本地锁。 tx2 后开始，开启本地事务，拿到本地锁，更新操作 m = 900 - 100 = 800。本地事务提交前，尝试拿该记录的 <strong>全局锁</strong> ，tx1 全局提交前，该记录的全局锁被 tx1 持有，tx2 需要重试等待 <strong>全局锁</strong> 。</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503050003322.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>tx1 二阶段全局提交，释放 <strong>全局锁</strong> 。tx2 拿到 <strong>全局锁</strong> 提交本地事务。</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503050003588.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>如果 tx1 的二阶段 全局回滚，则 tx1 需要重新获取该数据的本地锁，进行反向补偿的更新操作，实现分支的回滚。</p><p>此时，如果 tx2 仍在等待该数据的 <strong>全局锁</strong>，同时持有本地锁，则 tx1 的分支回滚会失败。</p><p><mark>两边都需要自己的锁！</mark></p><p>分支的回滚会一直重试，直到 tx2 的 <strong>全局锁</strong> 等锁超时，放弃 <strong>全局锁</strong> 并回滚本地事务<mark>释放本地锁</mark>，tx1的分支回滚最终成功。</p><p>因为整个过程 <strong>全局锁</strong> 在 tx1 结束前一直是被 tx1 持有的，所以不会发生 <strong>脏写</strong> 的问题。</p><p>再次来回顾一下：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503052122863.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p><strong>读隔离：</strong></p><p>在数据库本地事务隔离级别 <strong>读已提交（Read Committed）</strong> 或以上的基础上，Seata（AT 模式）的默认全局隔离级别是 <strong>读未提交（Read Uncommitted）</strong>。</p><p>什么是读已提交，读未提交呢？</p><blockquote><p>这里做个小科普：</p><h3 id="_1-读未提交-read-uncommitted" tabindex="-1"><a class="header-anchor" href="#_1-读未提交-read-uncommitted" aria-hidden="true">#</a> <strong>1. 读未提交（Read Uncommitted）</strong></h3><p><strong>大白话：</strong> 别人写入的数据<strong>还没提交，你就能看到了</strong>，但这些数据可能<strong>会被回滚</strong>，你读到的数据可能是假的，叫做<strong>脏读（Dirty Read）</strong>。</p><p><strong>例子：</strong></p><ol><li>张三打开了一本账本（开始一个事务）。</li><li>李四正在改账本的余额，从 100 改成 200（但还没提交）。</li><li>张三看了一眼，发现余额是 200，记下来了。</li><li>李四突然<strong>后悔了，回滚</strong>（撤销修改）。</li><li>但张三已经把 200 记到自己的本子上了，然而真正的余额还是 100。</li></ol><p><strong>问题：</strong> 张三读到了一个不存在的数据，这就是“脏读”。</p><hr><h3 id="_2-读已提交-read-committed" tabindex="-1"><a class="header-anchor" href="#_2-读已提交-read-committed" aria-hidden="true">#</a> <strong>2. 读已提交（Read Committed）</strong></h3><p><strong>大白话：</strong> 别人修改的数据<strong>必须提交了，你才能看到</strong>，不会出现“脏读”，但是可能会<strong>反复读取到不同的数据</strong>，叫做<strong>不可重复读（Non-repeatable Read）</strong>。</p><p><strong>例子：</strong></p><ol><li>张三打开一本账本（开始一个事务）。</li><li>这时李四修改了余额，从 100 改成 200，并<strong>提交</strong>了。</li><li>张三查了一次余额，看到是 200。</li><li>过了一会，李四又改了一次余额，从 200 改成 300，并<strong>提交</strong>了。</li><li>张三再查一次余额，看到变成 300 了。</li></ol><p><strong>问题：</strong> 同样的查询，在同一个事务里，读到的值<strong>不一样</strong>，数据不稳定，这就是“不可重复读”。</p></blockquote><p>如果应用在特定场景下，必需要求全局的 <strong>读已提交</strong> ，目前 Seata 的方式是通过 SELECT FOR UPDATE 语句的代理。</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503050003659.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>SELECT FOR UPDATE 语句的执行会申请 <strong>全局锁</strong> ，如果 <strong>全局锁</strong> 被其他事务持有，则释放本地锁（回滚 SELECT FOR UPDATE 语句的本地执行）并重试。这个过程中，查询是被 block 住的，直到 <strong>全局锁</strong> 拿到，即读取的相关数据是 <strong>已提交</strong> 的，才返回。</p><p>什么意思呢</p><div class="hint-container tip"><p class="hint-container-title">提示</p><p><strong>大白话解释</strong></p><ol><li><strong>默认是“读未提交”</strong><ul><li>Seata AT 模式默认允许一个事务<strong>读到另一个事务尚未提交的修改</strong>（可能是错误数据）。</li><li>这意味着，你可能会读到一个事务<strong>还没提交</strong>的数据，但这个事务最终可能会<strong>回滚</strong>，导致你读到的数据失效。</li></ul></li><li><strong>如果你想要“读已提交”</strong>（确保只能读到已经提交的数据） <ul><li>你需要在查询时加上 <strong><code>SELECT FOR UPDATE</code></strong>。</li><li>这个语句的作用是：<strong>锁住这条数据，防止其他事务修改</strong>。</li></ul></li><li><strong>全局锁的作用</strong><ul><li><strong>查询的时候申请“全局锁”</strong>，这个锁相当于对数据加了“门闩”，让其他事务<strong>不能修改</strong>这条数据。</li><li><strong>如果别人已经加了锁</strong>，你的查询会<strong>等着</strong>，直到别人释放锁，你才能继续。</li><li><strong>如果加锁失败了</strong>（比如别人一直占着），你的事务会重试。</li></ul></li></ol><p><strong>打个比方</strong></p><p>假设你和朋友去银行取钱：</p><ul><li><strong>默认 Seata AT 读未提交（可能有问题）</strong> 你问银行：“我账户里有多少钱？” <ul><li>这时，银行系统正在更新你的余额，把 1000 元改成 5000 元，但还没提交。</li><li>你查询时，银行告诉你余额是 5000 元。</li><li>但系统又<strong>回滚了</strong>，你的真实余额还是 1000 元。</li><li>你本以为有 5000，可以花钱了，结果钱根本不存在！💥 <strong>脏读！</strong></li></ul></li><li><strong>用 <code>SELECT FOR UPDATE</code> 让它变成“读已提交”</strong> 你去银行问：“我账户里有多少钱？”（但这次你要求银行<strong>锁住这笔查询</strong>） <ul><li>这时，银行发现另一个员工正在更新你的余额，它让你<strong>等一会儿</strong>。</li><li>直到余额修改完成并提交了，银行才告诉你真实余额是多少。</li><li>这样，你就不会读到<strong>错误数据</strong>了。</li></ul></li></ul></div><p>出于总体性能上的考虑，Seata 目前的方案并没有对所有 SELECT 语句都进行代理，仅针对 FOR UPDATE 的 SELECT 语句。</p><h4 id="_3-2-2-tcc模式" tabindex="-1"><a class="header-anchor" href="#_3-2-2-tcc模式" aria-hidden="true">#</a> 3.2.2 TCC模式</h4><p>回顾总览中的描述：一个分布式的全局事务，整体是 <strong>两阶段提交</strong> 的模型。全局事务是由若干分支事务组成的，分支事务要满足 <strong>两阶段提交</strong> 的模型要求，即需要每个分支事务都具备自己的：</p><ul><li>一阶段 prepare 行为</li><li>二阶段 commit 或 rollback 行为</li></ul><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503050003037.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>根据两阶段行为模式的不同，我们将分支事务划分为 <strong>Automatic (Branch) Transaction Mode</strong> 和 <strong>Manual (Branch) Transaction Mode</strong>.</p><p>AT 模式，基于 <mark><strong>支持本地 ACID 事务</strong></mark> 的 <strong>关系型数据库</strong>：</p><ul><li>一阶段 prepare 行为：在本地事务中，一并提交业务数据更新和相应回滚日志记录。</li><li>二阶段 commit 行为：马上成功结束，<mark><strong>自动</strong></mark> 异步批量清理回滚日志。</li><li>二阶段 rollback 行为：通过回滚日志，<mark><strong>自动</strong></mark> 生成补偿操作，完成数据回滚。</li></ul><p>相应的，TCC 模式，不依赖于底层数据资源的事务支持：</p><ul><li>一阶段 prepare 行为：调用 <strong>自定义</strong> 的 prepare 逻辑。</li><li>二阶段 commit 行为：调用 <strong>自定义</strong> 的 commit 逻辑。</li><li>二阶段 rollback 行为：调用 <strong>自定义</strong> 的 rollback 逻辑。</li></ul><p>所谓 TCC 模式，是指支持把 <mark><strong>自定义</strong></mark> 的分支事务纳入到全局事务的管理中。</p><h4 id="_3-2-3-saga模式" tabindex="-1"><a class="header-anchor" href="#_3-2-3-saga模式" aria-hidden="true">#</a> 3.2.3 Saga模式</h4><p>Saga模式是Seata提供的<mark>长事务</mark>解决方案，在Saga模式中，业务流程中每个参与者都提交本地事务，当出现某一个参与者失败则补偿前面已经成功的参与者，一阶段正向服务和二阶段补偿服务都由业务开发实现。</p><div class="hint-container info"><p class="hint-container-title">相关信息</p><p>简单来说，谁做的事，谁会滚的时候就把自己的事搞干净，如果每个人都能将自己事回滚完成，那么数据最终会还原！</p></div><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503050003315.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p><strong>使用场景：</strong></p><ul><li>业务流程长、业务流程多</li><li>参与者包含其它公司或遗留系统服务，无法提供 TCC 模式要求的三个接口</li></ul><p><strong>优势：</strong></p><ul><li>一阶段提交本地事务，无锁，高性能</li><li>事件驱动架构，参与者可异步执行，高吞吐</li><li>补偿服务易于实现（<mark>目前真听不懂，哈哈哈</mark>）</li></ul><p><strong>缺点：</strong></p><ul><li>不保证隔离性</li></ul><h3 id="_3-3-抢单分布式事务实现" tabindex="-1"><a class="header-anchor" href="#_3-3-抢单分布式事务实现" aria-hidden="true">#</a> 3.3 抢单分布式事务实现</h3><p>​ <mark>非热点商品</mark>抢单的时候，这里采用Seata分布式事务控制库存减少，当库存递减成功的时候，执行创建订单，当库存减少失败的时候，不执行创建订单。</p><p>但有可能存在这么一种现象，库存减少成功了，但创建订单失败了，此时需要回滚库存，这时需要跨应用管理事务，因此可以使用Seata实现。</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503050003571.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>没改之前的情况</p><p>程序里故意制造一个错误</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503052331712.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503052326928.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>此时下单出现错误</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503060054297.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>但还是发生了扣减</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503060056052.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>但是订单没有创建成功，还是以前的数据</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503060057765.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>所以得引入分布式事务来修改bug！</p><h4 id="_3-3-1-分布式事务实现" tabindex="-1"><a class="header-anchor" href="#_3-3-1-分布式事务实现" aria-hidden="true">#</a> 3.3.1 分布式事务实现</h4><p>Seata分布式事务实现，分如下几个步骤：</p><div class="language-Plaintext line-numbers-mode" data-ext="Plaintext"><pre class="language-Plaintext"><code>1.在每个需要控制分布式事务的数据库中添加日志表undo_log
2.安装TC
3.配置数据源-代理数据源
4.配置微服务与Seata的TC交互信息以及注册地址
5.使用全局分布式事务的方法上添加注解@GlobalTransactional
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>1)日志表添加</p><p>在<code>seckill-goods</code>和<code>seckill-order</code>数据库中添加日志表，内容如下：</p><div class="language-SQL line-numbers-mode" data-ext="SQL"><pre class="language-SQL"><code>CREATE TABLE \`undo_log\` (
  \`id\` bigint(20) NOT NULL AUTO_INCREMENT,
  \`branch_id\` bigint(20) NOT NULL,
  \`xid\` varchar(100) NOT NULL,
  \`context\` varchar(128) NOT NULL,
  \`rollback_info\` longblob NOT NULL,
  \`log_status\` int(11) NOT NULL,
  \`log_created\` datetime NOT NULL,
  \`log_modified\` datetime NOT NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`ux_undo_log\` (\`xid\`,\`branch_id\`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>2)安装TC</p><p>我们这里采用Docker安装，安装命令如下：</p><div class="language-Plaintext line-numbers-mode" data-ext="Plaintext"><pre class="language-Plaintext"><code>docker run -d --name seata-server -p 8191:8191 -e SEATA_PORT=8191 seataio/seata-server:1.4.1
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>3)配置数据源</p><p>在需要执行分布式事务控制的工程<code>seckill-seata</code>的<code>pom.xml</code>中添加如下依赖：</p><div class="language-XML line-numbers-mode" data-ext="XML"><pre class="language-XML"><code>&lt;!--Seata--&gt;
&lt;dependency&gt;
    &lt;groupId&gt;com.alibaba.cloud&lt;/groupId&gt;
    &lt;artifactId&gt;spring-cloud-starter-alibaba-seata&lt;/artifactId&gt;
&lt;/dependency&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在<code>seckill-seata</code>中添加配置类，代码如下：</p><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>@Configuration
public class DataSourceConfig {

    /**
     * 1.配置DataSource
     */
    @Bean
    @ConfigurationProperties(prefix = &quot;spring.datasource&quot;)
    public DruidDataSource dataSource(){
        return new DruidDataSource();
    }

    /**
     * 2.配置代理数据源
     */
    @Bean
    public DataSourceProxy dataSourceProxy(DruidDataSource dataSource){
        return new DataSourceProxy(dataSource);
    }

    /**
     * 3.持久层用的是MyBatis
     *   SqlSessionFactory需要注入DataSource，将注入的DataSource换成代理数据源
     */
    @Bean
    public SqlSessionFactory sqlSessionFactory(DataSourceProxy dataSourceProxy) throws Exception {
        SqlSessionFactoryBean sqlSessionFactoryBean = new SqlSessionFactoryBean();
        sqlSessionFactoryBean.setDataSource(dataSourceProxy);
        return sqlSessionFactoryBean.getObject();
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>4)配置注册信息</p><p>在<code>seckill-seata</code>中添加文件<code>registry.conf</code>，内容如下：</p><div class="language-Properties line-numbers-mode" data-ext="Properties"><pre class="language-Properties"><code>registry {
  # file 、nacos 、eureka、redis、zk、consul、etcd3、sofa
  type = &quot;file&quot;

  file {
    name = &quot;file.conf&quot;
  }
}

config {
  # file、nacos 、apollo、zk、consul、etcd3
  type = &quot;file&quot;

  file {
    name = &quot;file.conf&quot;
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在<code>seckill-seata</code>中添加文件<code>file.conf</code>，内容如下：</p><div class="language-Properties line-numbers-mode" data-ext="Properties"><pre class="language-Properties"><code>transport {
  # tcp udt unix-domain-socket
  type = &quot;TCP&quot;
  #NIO NATIVE
  server = &quot;NIO&quot;
  #enable heartbeat
  heartbeat = true
  #thread factory for netty
  thread-factory {
    boss-thread-prefix = &quot;NettyBoss&quot;
    worker-thread-prefix = &quot;NettyServerNIOWorker&quot;
    server-executor-thread-prefix = &quot;NettyServerBizHandler&quot;
    share-boss-worker = false
    client-selector-thread-prefix = &quot;NettyClientSelector&quot;
    client-selector-thread-size = 1
    client-worker-thread-prefix = &quot;NettyClientWorkerThread&quot;
    # netty boss thread size,will not be used for UDT
    boss-thread-size = 1
    #auto default pin or 8
    worker-thread-size = 8
  }
  shutdown {
    # when destroy server, wait seconds
    wait = 3
  }
  serialization = &quot;seata&quot;
  compressor = &quot;none&quot;
}
service {
  #vgroup-&gt;rgroup
  vgroup_mapping.seata_seckill_transaction = &quot;default&quot;
  #only support single node
  default.grouplist = &quot;seata-server:8191&quot;
  #degrade current not support
  enableDegrade = false
  #disable
  disable = false
  #unit ms,s,m,h,d represents milliseconds, seconds, minutes, hours, days, default permanent
  max.commit.retry.timeout = &quot;-1&quot;
  max.rollback.retry.timeout = &quot;-1&quot;
}

client {
  async.commit.buffer.limit = 10000
  lock {
    retry.internal = 10
    retry.times = 30
  }
  report.retry.count = 5
}

## transaction log store
store {
  ## store mode: file、db
  mode = &quot;file&quot;

  ## file store
  file {
    dir = &quot;sessionStore&quot;

    # branch session size , if exceeded first try compress lockkey, still exceeded throws exceptions
    max-branch-session-size = 16384
    # globe session size , if exceeded throws exceptions
    max-global-session-size = 512
    # file buffer size , if exceeded allocate new buffer
    file-write-buffer-cache-size = 16384
    # when recover batch read size
    session.reload.read_size = 100
    # async, sync
    flush-disk-mode = async
  }
}
lock {
  ## the lock store mode: local、remote
  mode = &quot;remote&quot;
  remote {
    ## store locks in the seata&#39;s server
  }
}
recovery {
  committing-retry-delay = 30
  asyn-committing-retry-delay = 30
  rollbacking-retry-delay = 30
  timeout-retry-delay = 30
}

transaction {
  undo.data.validation = true
  undo.log.serialization = &quot;jackson&quot;
}

## metrics settings
metrics {
  enabled = false
  registry-type = &quot;compact&quot;
  # multi exporters use comma divided
  exporter-list = &quot;prometheus&quot;
  exporter-prometheus-port = 9898
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>5)配置事务分组信息</p><p>在<code>seckill-goods</code>和<code>seckill-order</code>的pom.xml中添如下依赖：</p><div class="language-XML line-numbers-mode" data-ext="XML"><pre class="language-XML"><code>&lt;dependency&gt;
    &lt;groupId&gt;com.seckill&lt;/groupId&gt;
    &lt;artifactId&gt;seckill-seata&lt;/artifactId&gt;
    &lt;version&gt;0.0.1-SNAPSHOT&lt;/version&gt;
&lt;/dependency&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在<code>seckill-goods</code>和<code>seckill-order</code>的bootstrap.yml中添如下代码：</p><div class="language-YAML line-numbers-mode" data-ext="YAML"><pre class="language-YAML"><code>spring:
  cloud:
    alibaba:
      seata:
        tx-service-group: seata_seckill_transaction
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>6)方法开启全局事务</p><p>在<code>seckill-order</code>的<code>com.seckill.order.service.impl.OrderServiceImpl#add</code>上<code>@GlobalTransactional</code>全局事务注解，代码如下：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503050003324.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h4 id="_3-3-2-全局异常处理" tabindex="-1"><a class="header-anchor" href="#_3-3-2-全局异常处理" aria-hidden="true">#</a> 3.3.2 全局异常处理</h4><p>此时需要创建一个全局异常处理器来处理该问题，创建<code>com.seckill.order.controller.BaseExceptionHandler</code>,代码如下：</p><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>@Slf4j
@ControllerAdvice   //所有请求路径，都将被该类处理-&gt;过滤器/(拦截器)
public class BaseExceptionHandler {

    /**
     * 异常处理
     * 当前请求发生了指定异常，则执行该方法处理异常
     */
    @ExceptionHandler(Exception.class)
    @ResponseBody
    public Result error(Exception ex){
        StringWriter stringWriter = new StringWriter();
        PrintWriter writer = new PrintWriter(stringWriter);
        ex.printStackTrace(writer);
        ex.printStackTrace();
        log.error(stringWriter.toString());
        return new Result(false, StatusCode.ERROR,ex.getMessage(),stringWriter.toString());
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>此时异常信息如下：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503060120157.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>数据库还是1000没有变</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503060146489.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>订单表没有变化，成功！</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503060147840.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h2 id="_4-websocket-通知用户抢单成功" tabindex="-1"><a class="header-anchor" href="#_4-websocket-通知用户抢单成功" aria-hidden="true">#</a> 4 WebSocket（通知用户抢单成功）</h2><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503060151232.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>​ 目前用户抢单操作已经完成，无论是非热点商品还是热点商品抢单，抢单完成后，我们应该要通知用户抢单状态，非热点商品可以直接响应抢单结果，但热点商品目前还没有实现通知响应，通知用户抢单状态用户可以通过页面定时向后台发出请求查询实现，但这种短连接方式效率低，会和服务器进行多次通信，这块我们可以使用长连接websocket实现。</p><h3 id="_4-1-websocket介绍" tabindex="-1"><a class="header-anchor" href="#_4-1-websocket介绍" aria-hidden="true">#</a> 4.1 WebSocket介绍</h3><p>WebSocket 是 HTML5 开始提供的一种在单个 TCP 连接上进行全双向通讯的协议。</p><p>WebSocket 使得客户端和服务器之间的数据交换变得更加简单，允许服务端主动向客户端推送数据。在 WebSocket API 中，浏览器和服务器只需要完成一次握手，两者之间就直接可以创建持久性的连接，并进行双向数据传输。</p><p>现在，很多网站为了实现推送技术，所用的技术都是 Ajax 轮询。轮询是在特定的的时间间隔（如每1秒），由浏览器对服务器发出HTTP请求，然后由服务器返回最新的数据给客户端的浏览器。这种传统的模式带来很明显的缺点，即浏览器需要不断的向服务器发出请求，然而HTTP请求可能包含较长的头部，其中真正有效的数据可能只是很小的一部分，显然这样会浪费很多的带宽等资源。</p><p>HTML5 定义的 WebSocket 协议，能更好的节省服务器资源和带宽，并且能够更实时地进行通讯。</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503060155011.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>浏览器通过 JavaScript 向服务器发出建立 WebSocket 连接的请求，连接建立以后，客户端和服务器端就可以通过 TCP 连接直接交换数据。</p><p>当你获取 WebSocket 连接后，你可以通过 <strong>send()</strong> 方法来向服务器发送数据，并通过 <strong>onmessage</strong> 事件来接收服务器返回的数据。</p><h3 id="_4-2-websocket-api" tabindex="-1"><a class="header-anchor" href="#_4-2-websocket-api" aria-hidden="true">#</a> 4.2 Websocket API</h3><p>创建 WebSocket 对象：</p><div class="language-Plaintext line-numbers-mode" data-ext="Plaintext"><pre class="language-Plaintext"><code>var socket = new WebSocket(url, [protocol] );
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><strong>WebSocket属性：</strong></p><table><thead><tr><th>属性</th><th>描述</th></tr></thead><tbody><tr><td>socket.readyState</td><td>只读属性 <strong>readyState</strong> 表示连接状态，可以是以下值：0 - 表示连接尚未建立。1 - 表示连接已建立，可以进行通信。2 - 表示连接正在进行关闭。3 - 表示连接已经关闭或者连接不能打开。</td></tr><tr><td>socket.bufferedAmount</td><td>只读属性 <strong>bufferedAmount</strong> 已被 send() 放入正在队列中等待传输，但是还没有发出的 UTF-8 文本字节数。</td></tr></tbody></table><p><strong>WebSocket事件：</strong></p><table><thead><tr><th>事件</th><th>事件处理程序</th><th>描述</th></tr></thead><tbody><tr><td>open</td><td>socket.onopen</td><td>连接建立时触发</td></tr><tr><td>message</td><td>socket.onmessage</td><td>客户端接收服务端数据时触发</td></tr><tr><td>error</td><td>socket.onerror</td><td>通信发生错误时触发</td></tr><tr><td>close</td><td>socket.onclose</td><td>连接关闭时触发</td></tr></tbody></table><p><strong>WebSocket方法：</strong></p><table><thead><tr><th>方法</th><th>描述</th></tr></thead><tbody><tr><td>socket.send()</td><td>使用连接发送数据</td></tr><tr><td>socket.close()</td><td>关闭连接</td></tr></tbody></table><h3 id="_4-3-websocket实例" tabindex="-1"><a class="header-anchor" href="#_4-3-websocket实例" aria-hidden="true">#</a> 4.3 WebSocket实例</h3><p>步骤如下：</p><p>1.使用WebSocket的API编写html页面，作为客户端 2.seckill-order中添加依赖 3.在引导类里创建ServerEndpointExporter 4.编写WebSocketServer，作为服务端 5.编写WebSocketController接口，实现消息发送</p><h4 id="_4-3-1-客户端" tabindex="-1"><a class="header-anchor" href="#_4-3-1-客户端" aria-hidden="true">#</a> 4.3.1 客户端</h4><p>​ WebSocket 协议本质上是一个基于 TCP 的协议。为了建立一个 WebSocket 连接，客户端浏览器首先要向服务器发起一个 HTTP 请求，这个请求和通常的 HTTP 请求不同，包含了一些附加头信息，其中附加头信息&quot;Upgrade: WebSocket&quot;表明这是一个申请协议升级的 HTTP 请求，服务器端解析这些附加的头信息然后产生应答信息返回给客户端，客户端和服务器端的 WebSocket 连接就建立起来了，双方就可以通过这个连接通道自由的传递信息，并且这个连接会持续存在直到客户端或者服务器端的某一方主动的关闭连接。</p><p>​ 我们按照上面的API实现客户端代码如下：</p><div class="language-HTML line-numbers-mode" data-ext="HTML"><pre class="language-HTML"><code>&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
    &lt;meta charset=&quot;utf-8&quot;&gt;
    &lt;title&gt;websocket&lt;/title&gt;
    &lt;script src=&quot;js/jquery-3.5.1.min.js&quot;&gt;&lt;/script&gt;
    &lt;script&gt;
        var socket;
        if(typeof(WebSocket) == &quot;undefined&quot;) {
            console.log(&quot;您的浏览器不支持WebSocket&quot;);
        }else{
            console.log(&quot;您的浏览器支持WebSocket&quot;);

            //实现化WebSocket对象，指定要连接的服务器地址与端口  建立连接
            socket = new WebSocket(&quot;ws://localhost:18085/socket/zhangsan&quot;);
            //打开事件
            socket.onopen = function() {
                console.log(&quot;Socket 已打开&quot;);
            };
            //获得消息事件
            socket.onmessage = function(msg) {
                console.log(msg.data);
                //发现消息进入    调后台获取
                //getCallingList();
                $(&quot;#msg&quot;).append(msg.data+&quot;&lt;/br&gt;&quot;);
            };
            //关闭事件
            socket.onclose = function() {
                console.log(&quot;Socket已关闭&quot;);
            };
            //发生了错误事件
            socket.onerror = function() {
                alert(&quot;Socket发生了错误&quot;);
            }

            //关闭连接
            function closeWebSocket() {
                socket.close();
            }

            //发送消息
            function send() {
                var message = document.getElementById(&#39;text&#39;).value;
                socket.send(message);
            }
        }
    &lt;/script&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;div id=&quot;msg&quot;&gt;&lt;/div&gt;
&lt;/body&gt;
&lt;/html&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_4-3-2-服务端" tabindex="-1"><a class="header-anchor" href="#_4-3-2-服务端" aria-hidden="true">#</a> 4.3.2 服务端</h4><p>1)引入依赖包</p><p>在<code>seckill-order</code>引入如下依赖：</p><div class="language-XML line-numbers-mode" data-ext="XML"><pre class="language-XML"><code>&lt;!--websocket--&gt;
&lt;dependency&gt;
    &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
    &lt;artifactId&gt;spring-boot-starter-websocket&lt;/artifactId&gt;
&lt;/dependency&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>2)在引导类里中添加以下代码：</p><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>@Bean
public ServerEndpointExporter serverEndpointExporter() {
    return new ServerEndpointExporter();
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>3)websocket消息处理</p><p>​ 在<code>seckill-order</code>服务端，我们可以创建一个类<code>com.seckill.order.websocket.WebSocketServer</code>，并暴露websocket地址出去，代码如下：</p><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>@Slf4j
@ServerEndpoint(&quot;/socket/{userid}&quot;)
@Component
public class WebSocketServer {

    // 存放每个客户端对应的WebSocketServer，使用现成安全的Set容器
    private static CopyOnWriteArraySet&lt;WebSocketServer&gt; webSocketServerSet = new CopyOnWriteArraySet&lt;&gt;();

    // 存放客户端的连接会话，需要使用会话来发送数据给客户端
    private static Map&lt;String, Session&gt; sessionMap = new HashMap&lt;&gt;();

    //用户唯一标识符
    private String userid;

    //连接建立成功调用的方法
    @OnOpen
    public void onOpen(@PathParam(&quot;userid&quot;) String userid, Session session) {
        this.userid = userid;
        sessionMap.put(userid, session);

        webSocketServerSet.add(this);

        try {
            sendMessage(&quot;连接成功&quot;, userid);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    //连接关闭调用的方法
    @OnClose
    public void onClose() {
        webSocketServerSet.remove(this);
        sessionMap.remove(userid);
    }

    /**
     * 收到客户端消息后调用的方法
     *
     * @param message 接受到的客户端的消息
     */
    @OnMessage
    public void onMessage(String message) {
        log.info(&quot;收到的客户端消息：&quot; + message);
    }

    //发生异常处理方法
    @OnError
    public void onError(Session session, Throwable error) {
        error.printStackTrace();
    }

    //群发消息
    public void sendMessage(String message) throws IOException {
        for (Map.Entry&lt;String, Session&gt; sessionEntry : sessionMap.entrySet()) {
            sessionEntry.getValue().getBasicRemote().sendText(message);
        }
    }

    //给指定用户发消息
    public void sendMessage(String message, String userid) throws IOException {
        sessionMap.get(userid).getBasicRemote().sendText(message);
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>什么意思呢？</p><ol><li><strong><code>@OnOpen</code> 注解的方法 <code>onOpen</code></strong>： <ul><li>当客户端与 WebSocket 服务器建立连接时调用。</li><li>将当前的 WebSocket 服务器实例添加到 <code>webSocketServerSet</code> 集合中。</li><li>将用户标识符和 WebSocket 会话添加到 <code>sessionMap</code> 中。</li><li>向连接的客户端发送一条消息（&quot;连接成功&quot;）。</li></ul></li><li><strong><code>@OnClose</code> 注解的方法 <code>onClose</code></strong>： <ul><li>当客户端与 WebSocket 服务器关闭连接时调用。</li><li>从 <code>webSocketServerSet</code> 集合中移除当前的 WebSocket 服务器实例。</li><li>从 <code>sessionMap</code> 中移除对应的用户标识符和会话。</li></ul></li><li><strong><code>@OnMessage</code> 注解的方法 <code>onMessage</code></strong>： <ul><li>当服务器从客户端接收到消息时调用。</li><li>打印接收到的消息（在日志中记录）。</li></ul></li><li><strong><code>@OnError</code> 注解的方法 <code>onError</code></strong>： <ul><li>当 WebSocket 连接发生错误时调用。</li><li>打印错误堆栈跟踪。</li></ul></li><li><strong><code>sendMessage</code> 方法</strong>： <ul><li>向所有连接的客户端广播消息。</li></ul></li><li><strong><code>sendMessage(String message, String userid)</code> 方法</strong>： <ul><li>向指定用户标识符的客户端发送消息。</li></ul></li></ol><p>我们编写一个测试类<code>com.seckill.order.controller.WebSocketController</code>，用于实现给指定用户发消息，代码如下：</p><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>@RestController
@RequestMapping(value = &quot;/ws&quot;)
public class WebSocketController {

    @Autowired
    private WebSocketServer webSocketServer;

    /***
     * 模拟给指定用户发消息
     */
    @GetMapping(value = &quot;/send/{userid}&quot;)
    public Result sendMessage(@PathVariable(value = &quot;userid&quot;)String userid, String msg) throws IOException {
        webSocketServer.sendMessage(msg,userid);
        return new Result(true, StatusCode.OK,&quot;发送消息成功@&quot;);
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>访问页面：</p>`,151),m={href:"http://127.0.0.1:18085/wsDemo.html",target:"_blank",rel:"noopener noreferrer"},b=e("figure",null,[e("img",{src:"https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503060221948.png",alt:"",tabindex:"0",loading:"lazy"}),e("figcaption")],-1),g=e("p",null,"访问成功后，即可向页面发送消息，请求地址：",-1),p={href:"http://127.0.0.1:18085/ws/send/zhangsan?msg=xxx",target:"_blank",rel:"noopener noreferrer"},h=l(`<figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503060224715.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503060225758.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h2 id="_5-netty" tabindex="-1"><a class="header-anchor" href="#_5-netty" aria-hidden="true">#</a> 5 Netty</h2><p>​ 在开始使用Netty之前，先来了解一下传统的BIO编程和使用NIO编程有什么不一样。</p><h3 id="_5-1-bio编程" tabindex="-1"><a class="header-anchor" href="#_5-1-bio编程" aria-hidden="true">#</a> 5.1 BIO编程</h3><p>每个客户端连接过来后，服务端都会启动一个线程去处理该客户端的请求。阻塞I/O的通信模型示意图如下：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503050003867.jpeg" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>业务场景：客户端每隔两秒发送字符串给服务端，服务端收到之后打印到控制台。</p><p>服务端实现：</p><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>public class IOServer {
    public static void main(String[] args) throws Exception {

        ServerSocket serverSocket = new ServerSocket(8000);

        while (true) {
            // (1) 阻塞方法获取新的连接
            Socket socket = serverSocket.accept();

            new Thread() {
                @Override
                public void run() {
                    String name = Thread.currentThread().getName();

                    try {
                        // (2) 每一个新的连接都创建一个线程，负责读取数据
                        byte[] data = new byte[1024];
                        InputStream inputStream = socket.getInputStream();
                        while (true) {
                            int len;
                            // (3) 按字节流方式读取数据
                            while ((len = inputStream.read(data)) != -1) {
                                System.out.println(&quot;线程&quot; + name + &quot;:&quot; + new String(data, 0, len));
                            }
                        }
                    } catch (Exception e) {
                    }
                }
            }.start();
        }
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>客户端实现：</p><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>public class MyClient {

    public static void main(String[] args) {
        //测试使用不同的线程数进行访问
        for (int i = 0; i &lt; 5; i++) {
            new ClientDemo().start();
        }
    }

    static class ClientDemo extends Thread {
        @Override
        public void run() {
            try {
                Socket socket = new Socket(&quot;127.0.0.1&quot;, 8000);
                while (true) {
                    socket.getOutputStream().write((&quot;测试数据&quot;).getBytes());
                    socket.getOutputStream().flush();
                    Thread.sleep(2000);
                }
            } catch (Exception e) {
            }
        }
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>​ 从服务端代码中我们可以看到，在传统的IO模型中，每个连接创建成功之后都需要一个线程来维护，每个线程包含一个while死循环。</p><p>​ 如果在用户数量较少的情况下运行是没有问题的，但是对于用户数量比较多的业务来说，服务端可能需要支撑成千上万的连接，IO模型可能就不太合适了。</p><p>如果有1万个连接就对应1万个线程，继而1万个while死循环，这种模型存在以下问题：</p><ul><li>当客户端越多，就会创建越多的处理线程。线程是操作系统中非常宝贵的资源，同一时刻有大量的线程处于阻塞状态是非常严重的资源浪费。并且如果务器遭遇洪峰流量冲击，例如双十一活动，线程池会瞬间被耗尽，导致服务器瘫痪。</li><li>因为是阻塞式通信，线程爆炸之后操作系统频繁进行线程切换，应用性能急剧下降。</li><li>IO编程中数据读写是以字节流为单位，效率不高。</li></ul><h3 id="_5-2-nio编程" tabindex="-1"><a class="header-anchor" href="#_5-2-nio编程" aria-hidden="true">#</a> 5.2 NIO编程</h3><p>​ NIO，也叫做new-IO或者non-blocking-IO，可理解为非阻塞IO。NIO编程模型中，新来一个连接不再创建一个新的线程，而是可以把这条连接直接绑定到某个固定的线程，然后这条连接所有的读写都由这个线程来负责，我们用一幅图来对比一下IO与NIO：</p><p>​ 而在NIO模型中，可以把这么多的while死循环变成一个死循环，这个死循环由一个线程控制。这就是NIO模型中选择器（Selector）的作用，一条连接来了之后，现在不创建一个while死循环去监听是否有数据可读了，而是直接把这条连接注册到<strong>选择器</strong>上，通过检查这个<strong>选择器</strong>，就可以批量监测出有数据可读的连接，进而读取数据。</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503060230032.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>举个栗子，在一家餐厅里，客人有点菜的需求，一共有100桌客人，有两种方案可以解决客人点菜的问题：</p><ul><li>方案一：</li><li>每桌客人配一个服务生，每个服务生就在餐桌旁给客人提供服务。如果客人要点菜，服务生就可以立刻提供点菜的服务。那么100桌客人就需要100个服务生提供服务，这就是BIO模型，一个连接对应一个线程。</li><li>方案二：</li><li>一个餐厅只有一个服务生（假设服务生可以忙的过来）。这个服务生隔段时间就询问所有的客人是否需要点菜，然后每一时刻处理所有客人的点菜要求。这就是NIO模型，所有客人都注册到同一个服务生，对应的就是所有的连接都注册到一个线程，然后批量轮询。</li></ul><p>这就是NIO模型解决线程资源受限的方案，实际开发过程中，我们会开多个线程，每个线程都管理着一批连接，相对于BIO模型中一个线程管理一条连接，消耗的线程资源大幅减少。</p><h3 id="_5-3-netty介绍" tabindex="-1"><a class="header-anchor" href="#_5-3-netty介绍" aria-hidden="true">#</a> 5.3 Netty介绍</h3><p>我们已经有了NIO能够提高程序效率了，为什么还要使用Netty？</p><p>简单的说：Netty封装了JDK的NIO，让你用得更爽，你不用再写一大堆复杂的代码了。</p><p>官方术语：Netty是一个异步事件驱动的网络应用框架，用于快速开发可维护的高性能服务器和客户端。</p><p>Netty 是一个广泛使用的 Java 网络编程框架,它提供了一个易于使用的 API 客户端和服务器，它活跃和成长于用户社区，像大型公司 Facebook 以及流行 开源项目如 Infinispan, HornetQ, Vert.x, Apache Cassandra 和 Elasticsearch 等，都利用其强大的对于网络抽象的核心代码。</p><p>​ Netty受到大公司青睐的原因：</p><div class="language-Plaintext line-numbers-mode" data-ext="Plaintext"><pre class="language-Plaintext"><code>1.并发高
2.传输快
3.封装好
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>并发高：</strong></p><p>​ Netty是一款基于NIO（Nonblocking I/O，非阻塞IO）开发的网络通信框架，对比于BIO（Blocking I/O，阻塞IO），他的并发性能得到了很大提高。</p><p><strong>传输快：</strong></p><p>​ Netty的传输快其实也是依赖了NIO的一个特性——<em>零拷贝</em>。我们知道，Java的内存有堆内存、栈内存和字符串常量池等等，其中堆内存是占用内存空间最大的一块，也是Java对象存放的地方，一般我们的数据如果需要从IO读取到堆内存，中间需要经过Socket缓冲区，也就是说一个数据会被拷贝两次才能到达他的的终点，如果数据量大，就会造成不必要的资源浪费。Netty针对这种情况，使用了NIO中的另一大特性——零拷贝，当他需要接收数据的时候，他会在堆内存之外开辟一块内存，数据就直接从IO读到了那块内存中去，在netty里面通过ByteBuf可以直接对这些数据进行直接操作，从而加快了传输速度。</p>`,34),k={href:"https://my.oschina.net/plucury/blog/192577",target:"_blank",rel:"noopener noreferrer"},S=l(`<p><strong>封装好：</strong></p><p>​ Netty对NIO进行了封装，代码简洁，远远优于传统Socket编程。</p><h3 id="_5-2-netty-websocket" tabindex="-1"><a class="header-anchor" href="#_5-2-netty-websocket" aria-hidden="true">#</a> 5.2 Netty+WebSocket</h3><p>​ 我们来实现一个Netty+WebSocket集成案例，由于Netty+WebSocket集成代码比较麻烦，我们可以利用目前开源的项目<code>netty-websocket-spring-boot-starter</code>轻松实现Netty和WebSocket的集成。</p><p>步骤： 1.创建seckill--message 2.添加依赖 3.添加配置文件 4.添加Redisi配置，用于存储WebSocket:会话信息 5.编写NettyWebSocketServer,.作为服务端 6.编写SendMessageController,进行消息发送 7.编写WebSocket页面</p><p>我们有一个项目，项目叫<code>seckill-message</code>，用于处理通知用户抢单状态。</p><p>1)pom.xml需要包含的依赖</p><div class="language-XML line-numbers-mode" data-ext="XML"><pre class="language-XML"><code>&lt;dependencies&gt;
    &lt;!--db依赖--&gt;
    &lt;dependency&gt;
        &lt;groupId&gt;com.seckill&lt;/groupId&gt;
        &lt;artifactId&gt;seckill-db&lt;/artifactId&gt;
        &lt;version&gt;0.0.1-SNAPSHOT&lt;/version&gt;
    &lt;/dependency&gt;

    &lt;!--Netty Websocket--&gt;
    &lt;dependency&gt;
        &lt;groupId&gt;org.yeauty&lt;/groupId&gt;
        &lt;artifactId&gt;netty-websocket-spring-boot-starter&lt;/artifactId&gt;
        &lt;version&gt;0.9.5&lt;/version&gt;
    &lt;/dependency&gt;
&lt;/dependencies&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>2)bootstrap.yml</p><div class="language-YAML line-numbers-mode" data-ext="YAML"><pre class="language-YAML"><code>#websocket配置
ws:
  port: 28082
  host: 0.0.0.0
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>3)Redis配置</p><p>在项目中添加redis配置，这里主要用于存储websocket会话部分信息，代码如下：</p><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>@Configuration
public class RedisConfig {

    /**
     * 模板操作对象序列化设置
     */
    @Bean(&quot;redisTemplate&quot;)
    public RedisTemplate getRedisTemplate(RedisConnectionFactory redissonConnectionFactory) {
        RedisTemplate&lt;Object, Object&gt; redisTemplate = new RedisTemplate();
        redisTemplate.setConnectionFactory(redissonConnectionFactory);
        redisTemplate.setValueSerializer(valueSerializer());
        redisTemplate.setKeySerializer(keySerializer());
        redisTemplate.setHashKeySerializer(keySerializer());
        redisTemplate.setHashValueSerializer(valueSerializer());
        redisTemplate.setEnableTransactionSupport(true);
        return redisTemplate;
    }

    /**
     * 序列化设置
     */
    @Bean
    public StringRedisSerializer keySerializer() {
        return new StringRedisSerializer();
    }

    /**
     * 序列化设置
     */
    @Bean
    public RedisSerializer valueSerializer() {
        Jackson2JsonRedisSerializer jackson2JsonRedisSerializer = new Jackson2JsonRedisSerializer(Object.class);
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
        objectMapper.enableDefaultTyping(ObjectMapper.DefaultTyping.NON_FINAL);
        jackson2JsonRedisSerializer.setObjectMapper(objectMapper);
        return jackson2JsonRedisSerializer;
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>4)WebSocket会话处理</p><p>WebSocket会话处理我们使用了<code>netty-websocket-spring-boot-starter</code>相关的注解。</p><p>编写<code>com.seckill.message.config.NettyWebSocketServer</code>代码如下：</p><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>@Component
@ServerEndpoint(path = &quot;/ws/{userid}&quot;, port = &quot;\${ws.port}&quot;, host = &quot;\${ws.host}&quot;)
public class NettyWebSocketServer {

    @Autowired
    private RedisTemplate redisTemplate;

    /**
     * 定义一个Map存储所有会话
     */
    private static Map&lt;String, Session&gt; sessionMap = new HashMap&lt;String, Session&gt;();

    /**
     * 1.建立连接
     */
    @OnOpen
    public void onOpen(@PathVariable(value = &quot;userid&quot;) String userid, Session session) {
        //获取Session的ID
        String id = session.channel().id().toString();

        //获取用户对应的会话对象
        Session userSession = sessionMap.get(userid);
        if (userSession != null) {
            //清理会话信息
            sessionMap.remove(userid);
            redisTemplate.boundHashOps(&quot;NettyWebSocketUser&quot;).delete(userSession.channel().id().toString());
        }

        //存储用户会话信息
        sessionMap.put(userid, session);
        //存储SessionID和userid的映射关系
        redisTemplate.boundHashOps(&quot;NettyWebSocketUser&quot;).put(id, userid);
    }

    /**
     * 2.关闭关闭
     */
    @OnClose
    public void onClose(Session session) {
        //根据SessionID从Redis中查找userid
        String userid = redisTemplate.boundHashOps(&quot;NettyWebSocketUser&quot;).get(session.channel().id().toString()).toString();

        //根据userid删除SessionMap中的Session
        sessionMap.remove(userid);
        //删除Redis中userid的映射信息
        redisTemplate.boundHashOps(&quot;NettyWebSocketUser&quot;).delete(session.channel().id().toString());
    }

    /**
     * 3.发生异常
     */
    @OnError
    public void onError(Session session, Throwable throwable) {
        Object userid = redisTemplate.boundHashOps(&quot;NettyWebSocketUser&quot;).get(session.channel().id().toString());
        System.out.println(&quot;用户ID&quot; + userid + &quot;,通信发生异常！&quot;);
    }

    /**
     * 4.接收客户端发送的消息
     */
    @OnMessage
    public void onMessage(String message, Session session) {
        Object userid = redisTemplate.boundHashOps(&quot;NettyWebSocketUser&quot;).get(session.channel().id().toString());
        System.out.println(&quot;用户ID&quot; + userid + &quot;发送的消息是：&quot; + message);

        //回复客户端
        session.sendText(&quot;您发送的消息是：&quot; + message);
    }

    /**
     * 5.主动给客户端发消息
     */
    public void sendMessage(String userid, String message) {
        //获取用户会话
        Session session = sessionMap.get(userid);

        //发送消息
        if (session != null) {
            session.sendText(message);
        }
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>并且我们需要在引导类创建<code>ServerEndpointExporter</code>对象，代码如下：</p><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>@SpringBootApplication(exclude = DataSourceAutoConfiguration.class)
public class NettyWebSocketApplication {

    public static void main(String[] args) {
        SpringApplication.run(NettyWebSocketApplication.class,args);
    }

    /**
     * 创建ServerEndpointExport对象
     */
    @Bean
    public ServerEndpointExporter serverEndpointExporter(){
        return new ServerEndpointExporter();
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>主动向客户端发消息：</p><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>@RestController
@CrossOrigin
@RequestMapping(value = &quot;/msg&quot;)
public class SendMessageController {

    @Autowired
    private NettyWebSocketServer nettyWebSocketServer;

    /**
     * 发送消息
     */
    @GetMapping(value = &quot;/{userid}&quot;)
    public String send(@PathVariable(value = &quot;userid&quot;)String userid,@RequestParam(value = &quot;msg&quot;) String msg) {
        nettyWebSocketServer.sendMessage(userid,msg);
        return &quot;OK&quot;;
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们这里编写了2个WebSocket页面：</p><div class="language-HTML line-numbers-mode" data-ext="HTML"><pre class="language-HTML"><code>&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
    &lt;meta charset=&quot;utf-8&quot;&gt;
    &lt;title&gt;websocket&lt;/title&gt;
    &lt;script&gt;
        var socket;
        if(typeof(WebSocket) == &quot;undefined&quot;) {
            console.log(&quot;您的浏览器不支持WebSocket&quot;);
        }else{
            console.log(&quot;您的浏览器支持WebSocket&quot;);

            //实现化WebSocket对象，指定要连接的服务器地址与端口  建立连接
            socket = new WebSocket(&quot;ws://localhost:28082/ws/wangwu&quot;);
            //打开事件
            socket.onopen = function() {
                console.log(&quot;Socket 已打开&quot;);
            };
            //获得消息事件
            socket.onmessage = function(msg) {
                console.log(msg.data+&quot;&lt;/br&gt;&quot;);
                //发现消息进入    调后台获取
                //getCallingList();
                document.getElementById(&#39;msg&#39;).innerHTML+=msg.data;
            };
            //关闭事件
            socket.onclose = function() {
                console.log(&quot;Socket已关闭&quot;);
            };
            //发生了错误事件
            socket.onerror = function() {
                alert(&quot;Socket发生了错误&quot;);
            }

            //关闭连接
            function closeWebSocket() {
                socket.close();
            }

            //发送消息
            function send() {
                var message = document.getElementById(&#39;text&#39;).value;
                socket.send(message);
            }
        }
    &lt;/script&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;div id=&quot;msg&quot;&gt;&lt;/div&gt;

&lt;input id=&quot;text&quot; /&gt;&lt;button type=&quot;button&quot; onclick=&quot;send()&quot;&gt;发送消息&lt;/button&gt;
&lt;/body&gt;
&lt;/html&gt;
&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
    &lt;meta charset=&quot;utf-8&quot;&gt;
    &lt;title&gt;websocket&lt;/title&gt;
    &lt;script&gt;
        var socket;
        if(typeof(WebSocket) == &quot;undefined&quot;) {
            console.log(&quot;您的浏览器不支持WebSocket&quot;);
        }else{
            console.log(&quot;您的浏览器支持WebSocket&quot;);

            //实现化WebSocket对象，指定要连接的服务器地址与端口  建立连接
            socket = new WebSocket(&quot;ws://localhost:28082/ws/itheima&quot;);
            //打开事件
            socket.onopen = function() {
                console.log(&quot;Socket 已打开&quot;);
            };
            //获得消息事件
            socket.onmessage = function(msg) {
                console.log(msg.data+&quot;&lt;/br&gt;&quot;);
                //发现消息进入    调后台获取
                //getCallingList();
                document.getElementById(&#39;msg&#39;).innerHTML+=msg.data+&quot;&lt;br/&gt;&quot;;
            };
            //关闭事件
            socket.onclose = function() {
                console.log(&quot;Socket已关闭&quot;);
            };
            //发生了错误事件
            socket.onerror = function() {
                alert(&quot;Socket发生了错误&quot;);
            }

            //关闭连接
            function closeWebSocket() {
                socket.close();
            }

            //发送消息
            function send() {
                var message = document.getElementById(&#39;text&#39;).value;
                socket.send(message);
            }
        }
    &lt;/script&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;div id=&quot;msg&quot;&gt;&lt;/div&gt;

&lt;input id=&quot;text&quot; /&gt;&lt;button type=&quot;button&quot; onclick=&quot;send()&quot;&gt;发送消息&lt;/button&gt;
&lt;/body&gt;
&lt;/html&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>测试效果如下：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503060402636.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503060402404.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>服务端向客户端发送消息也成功</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503060406278.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="_5-3-订单状态更新通知" tabindex="-1"><a class="header-anchor" href="#_5-3-订单状态更新通知" aria-hidden="true">#</a> 5.3 订单状态更新通知</h3><p>我们为刚才编写的WebSocket编写一个Feign，并在热点抢单成功的地方调用通知用户抢单成功即可。</p><p><strong>1)Feign编写</strong></p><p>我们先把接收消息的方法改一下，接收一个Map消息，代码如下：</p><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>@RestController
@CrossOrigin
@RequestMapping(value = &quot;/msg&quot;)
public class SendMessageController {

    @Autowired
    private NettyWebSocketServer nettyWebSocketServer;

    /**
     * 发送消息
     */
    @GetMapping(value = &quot;/{userid}&quot;)
    public String send(@PathVariable(value = &quot;userid&quot;)String userid,@RequestParam Map&lt;String,Object&gt; dataMap) {
        nettyWebSocketServer.sendMessage(userid,JSON.toJSONString(dataMap));
        return &quot;发送成功&quot;;
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>创建feign，代码如下：</p><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>@FeignClient(value = &quot;seckill-message&quot;)
public interface MessageFeign {

    /**
     * 发送消息
     */
    @GetMapping(value = &quot;/msg/{userid}&quot;)
    String send(@PathVariable(value = &quot;userid&quot;) String userid, @RequestParam Map&lt;String, Object&gt; dataMap);
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>2)抢单消息通知</strong></p><p>修改热点商品下单，在这里根据用户名进行通知，代码如下：</p><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>@Autowired
private MessageFeign messageFeign;

/***
 * 秒杀下单
 * @param orderMap
 */
@Override
public void addHotOrder(Map&lt;String, String&gt; orderMap) {
    String id = orderMap.get(&quot;id&quot;);
    String username = orderMap.get(&quot;username&quot;);
    //key
    String key = &quot;SKU_&quot; + id;
    //分布式锁的key
    String lockkey = &quot;LOCKSKU_&quot; + id;
    //用户购买的key
    String userKey = &quot;USER&quot; + username + &quot;ID&quot; + id;

    //尝试获取锁，等待10秒，自己获得锁后一直不解锁则10秒后自动解锁
    boolean bo = distributedLocker.tryLock(lockkey, TimeUnit.SECONDS, 10L, 10L);
    if(bo){
        if (redisTemplate.hasKey(key)) {
            //...略
        }
        //解锁
        distributedLocker.unlock(lockkey);

        //通知用户抢单成功
        Map&lt;String,Object&gt; dataMap = new HashMap&lt;String,Object&gt;();
        dataMap.put(&quot;code&quot;,200);
        dataMap.put(&quot;message&quot;,&quot;抢单成功！&quot;);
        messageFeign.send(username,dataMap);
    }else{
        Map&lt;String,Object&gt; dataMap = new HashMap&lt;String,Object&gt;();
        dataMap.put(&quot;code&quot;,20001);
        dataMap.put(&quot;message&quot;,&quot;抢单失败！&quot;);
        messageFeign.send(username,dataMap);
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>测试热点商品抢单的时候，返回数据如下：</p><div class="language-Properties line-numbers-mode" data-ext="Properties"><pre class="language-Properties"><code>{&quot;code&quot;:&quot;200&quot;,&quot;message&quot;:&quot;抢单成功&quot;}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>前端页面也收到抢单成功通知！</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503060419956.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>`,42);function q(f,y){const n=t("ExternalLinkIcon");return a(),r("div",null,[o,e("p",null,[i("学习文档："),e("a",v,[i("https://seata.apache.org/zh-cn/docs/overview/what-is-seata/"),s(n)])]),u,e("p",null,[e("a",m,[i("http://127.0.0.1:18085/wsDemo.html"),s(n)])]),b,g,e("p",null,[e("a",p,[i("http://127.0.0.1:18085/ws/send/zhangsan?msg=xxx"),s(n)])]),h,e("p",null,[i("关于零拷贝理解可以参考："),e("a",k,[i("https://my.oschina.net/plucury/blog/192577"),s(n)])]),S])}const C=d(c,[["render",q],["__file","5.Distributed transactions and distributed locks.html.vue"]]);export{C as default};
