const t=JSON.parse('{"key":"v-bd772cc6","path":"/microservices/rocketmq/4.Dealing%20with%20message%20backlog.html","title":"怎么处理消息积压？","lang":"zh-CN","frontmatter":{"order":4,"author":null,"title":"怎么处理消息积压？","category":["Rocketmq","框架"],"description":"发生了消息积压，这时候就得想办法赶紧把积压的消息消费完，就得考虑提高消费能力，一般有两种办法： 消费者扩容：如果当前 Topic 的 Message Queue 的数量大于消费者数量，就可以对消费者进行扩容，增加消费者，来提高消费能力，尽快把积压的消息消费完。或者增加消费者线程数量：提高并发消费能力（然后这里就会出现乱序消费的问题！）。优化消费者逻辑：...","head":[["meta",{"property":"og:url","content":"https://tim-qtp.github.io/blog/blog/microservices/rocketmq/4.Dealing%20with%20message%20backlog.html"}],["meta",{"property":"og:site_name","content":"Qtp"}],["meta",{"property":"og:title","content":"怎么处理消息积压？"}],["meta",{"property":"og:description","content":"发生了消息积压，这时候就得想办法赶紧把积压的消息消费完，就得考虑提高消费能力，一般有两种办法： 消费者扩容：如果当前 Topic 的 Message Queue 的数量大于消费者数量，就可以对消费者进行扩容，增加消费者，来提高消费能力，尽快把积压的消息消费完。或者增加消费者线程数量：提高并发消费能力（然后这里就会出现乱序消费的问题！）。优化消费者逻辑：..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-03-09T10:58:45.000Z"}],["meta",{"property":"article:author","content":"tim-qtp"}],["meta",{"property":"article:modified_time","content":"2025-03-09T10:58:45.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"怎么处理消息积压？\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-03-09T10:58:45.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"tim-qtp\\",\\"url\\":\\"https://github.com/tim-qtp/\\"}]}"]]},"headers":[],"git":{"createdTime":1741517925000,"updatedTime":1741517925000,"contributors":[{"name":"tim-qtp","email":"2469100031@qq.com","commits":1}]},"readingTime":{"minutes":1.14,"words":343},"filePathRelative":"microservices/rocketmq/4.Dealing with message backlog.md","localizedDate":"2025年3月9日","autoDesc":true,"excerpt":""}');export{t as data};
