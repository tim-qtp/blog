const l=JSON.parse('{"key":"v-cb8f29de","path":"/Java/concurrent/1.Process-thread-parallelism-and-concurrency.html","title":"狂神JUC并发","lang":"zh-CN","frontmatter":{"order":2,"author":null,"title":"狂神JUC并发","category":["多线程"],"description":"开始之前：进程和线程的区别？ pcskNpkwoG6Epggsw9jByrTr6HZsAXA3Q3LitcGsK7cRSktNdaok5n5JVJfRJ8A1WztpNusK 进程是操作系统进行资源分配和调度的基本单位，是一个程序的运行实例，拥有独立的内存空间。 一个进程可以包含多个线程，是CPU调度和执行的最小单位，可以共享属于同一进程的资源。简而言...","head":[["meta",{"property":"og:url","content":"https://tim-qtp.github.io/blog/blog/Java/concurrent/1.Process-thread-parallelism-and-concurrency.html"}],["meta",{"property":"og:site_name","content":"Qtp"}],["meta",{"property":"og:title","content":"狂神JUC并发"}],["meta",{"property":"og:description","content":"开始之前：进程和线程的区别？ pcskNpkwoG6Epggsw9jByrTr6HZsAXA3Q3LitcGsK7cRSktNdaok5n5JVJfRJ8A1WztpNusK 进程是操作系统进行资源分配和调度的基本单位，是一个程序的运行实例，拥有独立的内存空间。 一个进程可以包含多个线程，是CPU调度和执行的最小单位，可以共享属于同一进程的资源。简而言..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-03-05T23:43:34.000Z"}],["meta",{"property":"article:author","content":"tim-qtp"}],["meta",{"property":"article:modified_time","content":"2025-03-05T23:43:34.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"狂神JUC并发\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-03-05T23:43:34.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"tim-qtp\\",\\"url\\":\\"https://github.com/tim-qtp/\\"}]}"]]},"headers":[{"level":2,"title":"开始之前：进程和线程的区别？","slug":"开始之前-进程和线程的区别","link":"#开始之前-进程和线程的区别","children":[]},{"level":2,"title":"准备工作","slug":"准备工作","link":"#准备工作","children":[]},{"level":2,"title":"1. 什么是JUC","slug":"_1-什么是juc","link":"#_1-什么是juc","children":[{"level":3,"title":"1.1 进程","slug":"_1-1-进程","link":"#_1-1-进程","children":[]},{"level":3,"title":"1.2 线程","slug":"_1-2-线程","link":"#_1-2-线程","children":[]},{"level":3,"title":"1.3 并发","slug":"_1-3-并发","link":"#_1-3-并发","children":[]},{"level":3,"title":"1.4 并行","slug":"_1-4-并行","link":"#_1-4-并行","children":[]},{"level":3,"title":"1.5 线程的状态","slug":"_1-5-线程的状态","link":"#_1-5-线程的状态","children":[]},{"level":3,"title":"1.7 线程run/start的区别","slug":"_1-7-线程run-start的区别","link":"#_1-7-线程run-start的区别","children":[]},{"level":3,"title":"1.7 wait/sleep的区别","slug":"_1-7-wait-sleep的区别","link":"#_1-7-wait-sleep的区别","children":[]}]},{"level":2,"title":"2.Lock","slug":"_2-lock","link":"#_2-lock","children":[{"level":3,"title":"2.1 传统的 synchronized","slug":"_2-1-传统的-synchronized","link":"#_2-1-传统的-synchronized","children":[]},{"level":3,"title":"2.2   Lock","slug":"_2-2-lock","link":"#_2-2-lock","children":[]},{"level":3,"title":"2.3 Synchronized 与Lock 的区别","slug":"_2-3-synchronized-与lock-的区别","link":"#_2-3-synchronized-与lock-的区别","children":[]},{"level":3,"title":"2.4 生产者和消费者的关系","slug":"_2-4-生产者和消费者的关系","link":"#_2-4-生产者和消费者的关系","children":[]},{"level":3,"title":"2.5 8锁现象","slug":"_2-5-8锁现象","link":"#_2-5-8锁现象","children":[]}]},{"level":2,"title":"3. 集合不安全","slug":"_3-集合不安全","link":"#_3-集合不安全","children":[{"level":3,"title":"3.1 List 不安全","slug":"_3-1-list-不安全","link":"#_3-1-list-不安全","children":[]},{"level":3,"title":"3.1 set 不安全","slug":"_3-1-set-不安全","link":"#_3-1-set-不安全","children":[]},{"level":3,"title":"3.3 Map不安全","slug":"_3-3-map不安全","link":"#_3-3-map不安全","children":[]}]},{"level":2,"title":"4. Callable","slug":"_4-callable","link":"#_4-callable","children":[{"level":3,"title":"5. 常用的辅助类","slug":"_5-常用的辅助类","link":"#_5-常用的辅助类","children":[]},{"level":3,"title":"2.9 读写锁","slug":"_2-9-读写锁","link":"#_2-9-读写锁","children":[]},{"level":3,"title":"2.10 阻塞队列","slug":"_2-10-阻塞队列","link":"#_2-10-阻塞队列","children":[]},{"level":3,"title":"11. 线程池(重要)","slug":"_11-线程池-重要","link":"#_11-线程池-重要","children":[]},{"level":3,"title":"12. 四大函数式接口","slug":"_12-四大函数式接口","link":"#_12-四大函数式接口","children":[]},{"level":3,"title":"13. Stream 流式计算","slug":"_13-stream-流式计算","link":"#_13-stream-流式计算","children":[]},{"level":3,"title":"14. ForkJoin（分支合并）","slug":"_14-forkjoin-分支合并","link":"#_14-forkjoin-分支合并","children":[]},{"level":3,"title":"15. 异步回调","slug":"_15-异步回调","link":"#_15-异步回调","children":[]},{"level":3,"title":"16. JMM","slug":"_16-jmm","link":"#_16-jmm","children":[]},{"level":3,"title":"17. volatile","slug":"_17-volatile","link":"#_17-volatile","children":[]},{"level":3,"title":"18. 玩转单例模式","slug":"_18-玩转单例模式","link":"#_18-玩转单例模式","children":[]},{"level":3,"title":"19. 深入理解CAS","slug":"_19-深入理解cas","link":"#_19-深入理解cas","children":[]},{"level":3,"title":"20.原子引用解决ABA问题","slug":"_20-原子引用解决aba问题","link":"#_20-原子引用解决aba问题","children":[]},{"level":3,"title":"21. 各种锁的理解","slug":"_21-各种锁的理解","link":"#_21-各种锁的理解","children":[]}]}],"git":{"createdTime":1741218214000,"updatedTime":1741218214000,"contributors":[{"name":"tim-qtp","email":"2469100031@qq.com","commits":1}]},"readingTime":{"minutes":57.09,"words":17128},"filePathRelative":"Java/concurrent/1.Process-thread-parallelism-and-concurrency.md","localizedDate":"2025年3月5日","autoDesc":true,"excerpt":""}');export{l as data};
