const t=JSON.parse('{"key":"v-6fbd9fc8","path":"/microservices/rocketmq/2.Availability%20of%20messages.html","title":"如何保证消息的可用性/可靠性/不丢失呢","lang":"zh-CN","frontmatter":{"order":1,"author":null,"title":"如何保证消息的可用性/可靠性/不丢失呢","category":["Rocketmq","框架"],"description":"消息可能在哪些阶段丢失呢？可能会在这三个阶段发生丢失：生产阶段、存储阶段、消费阶段。 所以要从这三个阶段考虑： 消息传递三阶段 生产 在生产阶段，主要通过请求确认机制，来保证消息的可靠传递。 生产者发送消息至 Broker ，需要处理 Broker 的响应，不论是同步还是异步发送消息，同步和异步回调都需要做好 try-catch ，妥善的处理响应，如果...","head":[["meta",{"property":"og:url","content":"https://tim-qtp.github.io/blog/blog/microservices/rocketmq/2.Availability%20of%20messages.html"}],["meta",{"property":"og:site_name","content":"Qtp"}],["meta",{"property":"og:title","content":"如何保证消息的可用性/可靠性/不丢失呢"}],["meta",{"property":"og:description","content":"消息可能在哪些阶段丢失呢？可能会在这三个阶段发生丢失：生产阶段、存储阶段、消费阶段。 所以要从这三个阶段考虑： 消息传递三阶段 生产 在生产阶段，主要通过请求确认机制，来保证消息的可靠传递。 生产者发送消息至 Broker ，需要处理 Broker 的响应，不论是同步还是异步发送消息，同步和异步回调都需要做好 try-catch ，妥善的处理响应，如果..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-03-08T15:51:03.000Z"}],["meta",{"property":"article:author","content":"tim-qtp"}],["meta",{"property":"article:modified_time","content":"2025-03-08T15:51:03.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"如何保证消息的可用性/可靠性/不丢失呢\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-03-08T15:51:03.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"tim-qtp\\",\\"url\\":\\"https://github.com/tim-qtp/\\"}]}"]]},"headers":[],"git":{"createdTime":1741449063000,"updatedTime":1741449063000,"contributors":[{"name":"tim-qtp","email":"2469100031@qq.com","commits":1}]},"readingTime":{"minutes":1.61,"words":483},"filePathRelative":"microservices/rocketmq/2.Availability of messages.md","localizedDate":"2025年3月8日","autoDesc":true,"excerpt":""}');export{t as data};
