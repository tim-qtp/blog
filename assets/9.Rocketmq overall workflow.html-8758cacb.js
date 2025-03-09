const e=JSON.parse('{"key":"v-2a1db6df","path":"/microservices/rocketmq/9.Rocketmq%20overall%20workflow.html","title":"Rocketmq整体工作流程","lang":"zh-CN","frontmatter":{"order":10,"author":null,"title":"Rocketmq整体工作流程","category":["Rocketmq","框架"],"description":"1. Broker 在启动的时候去向所有的 NameServer 注册，并保持长连接，每 30s 发送一次心跳 2. Producer 在发送消息的时候从 NameServer 获取 Broker 服务器地址，根据负载均衡算法选择一台服务器来发送消息 3. Conusmer 消费消息的时候同样从 NameServer 获取 Broker 地址，然后主动...","head":[["meta",{"property":"og:url","content":"https://tim-qtp.github.io/blog/blog/microservices/rocketmq/9.Rocketmq%20overall%20workflow.html"}],["meta",{"property":"og:site_name","content":"Qtp"}],["meta",{"property":"og:title","content":"Rocketmq整体工作流程"}],["meta",{"property":"og:description","content":"1. Broker 在启动的时候去向所有的 NameServer 注册，并保持长连接，每 30s 发送一次心跳 2. Producer 在发送消息的时候从 NameServer 获取 Broker 服务器地址，根据负载均衡算法选择一台服务器来发送消息 3. Conusmer 消费消息的时候同样从 NameServer 获取 Broker 地址，然后主动..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-03-09T10:58:45.000Z"}],["meta",{"property":"article:author","content":"tim-qtp"}],["meta",{"property":"article:modified_time","content":"2025-03-09T10:58:45.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Rocketmq整体工作流程\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-03-09T10:58:45.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"tim-qtp\\",\\"url\\":\\"https://github.com/tim-qtp/\\"}]}"]]},"headers":[],"git":{"createdTime":1741517925000,"updatedTime":1741517925000,"contributors":[{"name":"tim-qtp","email":"2469100031@qq.com","commits":1}]},"readingTime":{"minutes":0.39,"words":118},"filePathRelative":"microservices/rocketmq/9.Rocketmq overall workflow.md","localizedDate":"2025年3月9日","autoDesc":true,"excerpt":""}');export{e as data};
