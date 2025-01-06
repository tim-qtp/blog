const e=JSON.parse('{"key":"v-924a5b06","path":"/Java/concurrent/1.Process%20thread%20parallelism%20and%20concurrency.html","title":"狂神JUC并发","lang":"zh-CN","frontmatter":{"order":2,"author":null,"title":"狂神JUC并发","category":["多线程"],"description":"开始之前：进程和线程的区别？ 进程是操作系统进行资源分配和调度的基本单位，是一个程序的运行实例，拥有独立的内存空间。 一个进程可以包含多个线程，是CPU调度和执行的最小单位，可以共享属于同一进程的资源。简而言之，进程间相互独立，而线程间可以共享内存和资源。 准备工作 新建一个Maven项目，引入一个lombok依赖. 1\\\\. 什么是JUC JUC就是j...","head":[["meta",{"property":"og:url","content":"https://tim-qtp.github.io/blog/blog/Java/concurrent/1.Process%20thread%20parallelism%20and%20concurrency.html"}],["meta",{"property":"og:site_name","content":"Qtp"}],["meta",{"property":"og:title","content":"狂神JUC并发"}],["meta",{"property":"og:description","content":"开始之前：进程和线程的区别？ 进程是操作系统进行资源分配和调度的基本单位，是一个程序的运行实例，拥有独立的内存空间。 一个进程可以包含多个线程，是CPU调度和执行的最小单位，可以共享属于同一进程的资源。简而言之，进程间相互独立，而线程间可以共享内存和资源。 准备工作 新建一个Maven项目，引入一个lombok依赖. 1\\\\. 什么是JUC JUC就是j..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-01-06T15:49:11.000Z"}],["meta",{"property":"article:author","content":"tim-qtp"}],["meta",{"property":"article:modified_time","content":"2025-01-06T15:49:11.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"狂神JUC并发\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-01-06T15:49:11.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"tim-qtp\\",\\"url\\":\\"https://github.com/tim-qtp/\\"}]}"]]},"headers":[{"level":3,"title":"开始之前：进程和线程的区别？","slug":"开始之前-进程和线程的区别","link":"#开始之前-进程和线程的区别","children":[]},{"level":3,"title":"准备工作","slug":"准备工作","link":"#准备工作","children":[]},{"level":3,"title":"1. 什么是JUC","slug":"_1-什么是juc","link":"#_1-什么是juc","children":[]},{"level":3,"title":"3.Lock","slug":"_3-lock","link":"#_3-lock","children":[]},{"level":3,"title":"4. 生产者和消费者的关系","slug":"_4-生产者和消费者的关系","link":"#_4-生产者和消费者的关系","children":[]},{"level":3,"title":"5. 8锁现象","slug":"_5-8锁现象","link":"#_5-8锁现象","children":[]},{"level":3,"title":"6. 集合不安全","slug":"_6-集合不安全","link":"#_6-集合不安全","children":[]},{"level":3,"title":"7. Callable","slug":"_7-callable","link":"#_7-callable","children":[]},{"level":3,"title":"8. 常用的辅助类","slug":"_8-常用的辅助类","link":"#_8-常用的辅助类","children":[]},{"level":3,"title":"9. 读写锁","slug":"_9-读写锁","link":"#_9-读写锁","children":[]},{"level":3,"title":"10. 阻塞队列","slug":"_10-阻塞队列","link":"#_10-阻塞队列","children":[]},{"level":3,"title":"11. 线程池(重要)","slug":"_11-线程池-重要","link":"#_11-线程池-重要","children":[]},{"level":3,"title":"12. 四大函数式接口","slug":"_12-四大函数式接口","link":"#_12-四大函数式接口","children":[]},{"level":3,"title":"13. Stream 流式计算","slug":"_13-stream-流式计算","link":"#_13-stream-流式计算","children":[]},{"level":3,"title":"14. ForkJoin（分支合并）","slug":"_14-forkjoin-分支合并","link":"#_14-forkjoin-分支合并","children":[]},{"level":3,"title":"15. 异步回调","slug":"_15-异步回调","link":"#_15-异步回调","children":[]},{"level":3,"title":"16. JMM","slug":"_16-jmm","link":"#_16-jmm","children":[]},{"level":3,"title":"17. volatile","slug":"_17-volatile","link":"#_17-volatile","children":[]},{"level":3,"title":"18. 玩转单例模式","slug":"_18-玩转单例模式","link":"#_18-玩转单例模式","children":[]},{"level":3,"title":"19. 深入理解CAS","slug":"_19-深入理解cas","link":"#_19-深入理解cas","children":[]},{"level":3,"title":"20.原子引用解决ABA问题","slug":"_20-原子引用解决aba问题","link":"#_20-原子引用解决aba问题","children":[]},{"level":3,"title":"21. 各种锁的理解","slug":"_21-各种锁的理解","link":"#_21-各种锁的理解","children":[]}],"git":{"createdTime":1736178551000,"updatedTime":1736178551000,"contributors":[{"name":"tim-qtp","email":"2469100031@qq.com","commits":1}]},"readingTime":{"minutes":53.31,"words":15993},"filePathRelative":"Java/concurrent/1.Process thread parallelism and concurrency.md","localizedDate":"2025年1月6日","autoDesc":true,"excerpt":""}');export{e as data};
