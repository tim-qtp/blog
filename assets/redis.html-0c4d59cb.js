const e=JSON.parse('{"key":"v-f0ad1f82","path":"/Java/eightpart/redis.html","title":"Redis","lang":"zh-CN","frontmatter":{"order":7,"author":"zhiyu1998","title":"Redis","category":["Redis","八股文"],"description":"♨️ redis 说一下redis 简单来说 Redis 就是一个使用 C 语言开发的数据库，不过与传统数据库不同的是 Redis 的数据是存在内存中的 ，也就是它是内存数据库，所以读写速度非常快，因此 Redis 被广泛应用于缓存方向。 另外，Redis 除了做缓存之外，也经常用来做分布式锁，甚至是消息队列。 Redis 提供了多种数据类型来支持不同...","head":[["meta",{"property":"og:url","content":"https://tim-qtp.github.io/blog/blog/Java/eightpart/redis.html"}],["meta",{"property":"og:site_name","content":"Qtp"}],["meta",{"property":"og:title","content":"Redis"}],["meta",{"property":"og:description","content":"♨️ redis 说一下redis 简单来说 Redis 就是一个使用 C 语言开发的数据库，不过与传统数据库不同的是 Redis 的数据是存在内存中的 ，也就是它是内存数据库，所以读写速度非常快，因此 Redis 被广泛应用于缓存方向。 另外，Redis 除了做缓存之外，也经常用来做分布式锁，甚至是消息队列。 Redis 提供了多种数据类型来支持不同..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://tim-qtp.github.io/blog/blog/"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-12-17T19:31:17.000Z"}],["meta",{"name":"twitter:card","content":"summary_large_image"}],["meta",{"name":"twitter:image:alt","content":"Redis"}],["meta",{"property":"article:author","content":"zhiyu1998"}],["meta",{"property":"article:modified_time","content":"2024-12-17T19:31:17.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Redis\\",\\"image\\":[\\"https://tim-qtp.github.io/blog/blog/\\"],\\"dateModified\\":\\"2024-12-17T19:31:17.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"zhiyu1998\\"}]}"]]},"headers":[{"level":2,"title":"♨️ redis","slug":"♨️-redis","link":"#♨️-redis","children":[{"level":3,"title":"说一下redis","slug":"说一下redis","link":"#说一下redis","children":[]},{"level":3,"title":"Redis为什么这么快？","slug":"redis为什么这么快","link":"#redis为什么这么快","children":[]},{"level":3,"title":"为什么要用 Redis / 为什么要用缓存？/ 为什么用 Redis 作为 MySQL 的缓存？","slug":"为什么要用-redis-为什么要用缓存-为什么用-redis-作为-mysql-的缓存","link":"#为什么要用-redis-为什么要用缓存-为什么用-redis-作为-mysql-的缓存","children":[]},{"level":3,"title":"Redis 如何实现服务高可用？","slug":"redis-如何实现服务高可用","link":"#redis-如何实现服务高可用","children":[]},{"level":3,"title":"Redis 和 Memcached 有什么区别？","slug":"redis-和-memcached-有什么区别","link":"#redis-和-memcached-有什么区别","children":[]},{"level":3,"title":"Redis 除了做缓存，还能做什么？","slug":"redis-除了做缓存-还能做什么","link":"#redis-除了做缓存-还能做什么","children":[]},{"level":3,"title":"⭐基本数据类型、应用场景","slug":"⭐基本数据类型、应用场景","link":"#⭐基本数据类型、应用场景","children":[]},{"level":3,"title":"Redis 单线程模型了解吗？","slug":"redis-单线程模型了解吗","link":"#redis-单线程模型了解吗","children":[]},{"level":3,"title":"Redis6.0 之后为何引入了多线程？","slug":"redis6-0-之后为何引入了多线程","link":"#redis6-0-之后为何引入了多线程","children":[]},{"level":3,"title":"Redis 是如何判断数据是否过期","slug":"redis-是如何判断数据是否过期","link":"#redis-是如何判断数据是否过期","children":[]},{"level":3,"title":"过期的数据的删除策略","slug":"过期的数据的删除策略","link":"#过期的数据的删除策略","children":[]},{"level":3,"title":"Redis 内存淘汰机制","slug":"redis-内存淘汰机制","link":"#redis-内存淘汰机制","children":[]},{"level":3,"title":"如何判定 key 已过期了？","slug":"如何判定-key-已过期了","link":"#如何判定-key-已过期了","children":[]},{"level":3,"title":"跳跃表","slug":"跳跃表","link":"#跳跃表","children":[]},{"level":3,"title":"Redis为什么选择跳表而不选择使用红黑树？","slug":"redis为什么选择跳表而不选择使用红黑树","link":"#redis为什么选择跳表而不选择使用红黑树","children":[]},{"level":3,"title":"⭐ 持久化策略（RDB、AOF） / 怎么保证 Redis 挂掉之后再重启数据可以进行恢复","slug":"⭐-持久化策略-rdb、aof-怎么保证-redis-挂掉之后再重启数据可以进行恢复","link":"#⭐-持久化策略-rdb、aof-怎么保证-redis-挂掉之后再重启数据可以进行恢复","children":[]},{"level":3,"title":"Redis 大 Key 对持久化有什么影响？","slug":"redis-大-key-对持久化有什么影响","link":"#redis-大-key-对持久化有什么影响","children":[]},{"level":3,"title":"🌟 缓存穿透 & 缓存雪崩 & 缓存击穿","slug":"🌟-缓存穿透-缓存雪崩-缓存击穿","link":"#🌟-缓存穿透-缓存雪崩-缓存击穿","children":[]},{"level":3,"title":"Redis 如何实现延迟队列？","slug":"redis-如何实现延迟队列","link":"#redis-如何实现延迟队列","children":[]},{"level":3,"title":"主从复制方案是怎么做的？","slug":"主从复制方案是怎么做的","link":"#主从复制方案是怎么做的","children":[]},{"level":3,"title":"Sentinel（哨兵）","slug":"sentinel-哨兵","link":"#sentinel-哨兵","children":[]},{"level":3,"title":"Cluster（集群）的原理","slug":"cluster-集群-的原理","link":"#cluster-集群-的原理","children":[]},{"level":3,"title":"高并发场景下，到底先更新缓存还是先更新数据库","slug":"高并发场景下-到底先更新缓存还是先更新数据库","link":"#高并发场景下-到底先更新缓存还是先更新数据库","children":[]},{"level":3,"title":"⭐MySQL 和 Redis 怎么保持数据一致?","slug":"⭐mysql-和-redis-怎么保持数据一致","link":"#⭐mysql-和-redis-怎么保持数据一致","children":[]},{"level":3,"title":"⭐️Redis如何实现分布式锁？","slug":"⭐️redis如何实现分布式锁","link":"#⭐️redis如何实现分布式锁","children":[]},{"level":3,"title":"集群脑裂导致数据丢失怎么办？","slug":"集群脑裂导致数据丢失怎么办","link":"#集群脑裂导致数据丢失怎么办","children":[]}]}],"git":{"createdTime":1734463877000,"updatedTime":1734463877000,"contributors":[{"name":"tim-qtp","email":"2469100031@qq.com","commits":1}]},"readingTime":{"minutes":144.62,"words":43385},"filePathRelative":"Java/eightpart/redis.md","localizedDate":"2024年12月17日","autoDesc":true,"excerpt":""}');export{e as data};