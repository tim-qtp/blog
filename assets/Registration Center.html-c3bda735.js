const e=JSON.parse('{"key":"v-3a43b61b","path":"/microservices/nacos/Registration%20Center.html","title":"注册中心","lang":"zh-CN","frontmatter":{"order":2,"author":null,"title":"注册中心","category":["Nacos","注册中心","负载均衡"],"description":"1.服务注册到nacos Nacos是SpringCloudAlibaba的组件，而SpringCloudAlibaba也遵循SpringCloud中定义的服务注册、服务发现规范。因此使用Nacos和使用Eureka对于微服务来说，并没有太大区别。 主要差异在于： 依赖不同; 服务地址不同; 1.1.引入依赖 在cloud-demo父工程的pom文件中...","head":[["meta",{"property":"og:url","content":"https://tim-qtp.github.io/blog/blog/microservices/nacos/Registration%20Center.html"}],["meta",{"property":"og:site_name","content":"Qtp"}],["meta",{"property":"og:title","content":"注册中心"}],["meta",{"property":"og:description","content":"1.服务注册到nacos Nacos是SpringCloudAlibaba的组件，而SpringCloudAlibaba也遵循SpringCloud中定义的服务注册、服务发现规范。因此使用Nacos和使用Eureka对于微服务来说，并没有太大区别。 主要差异在于： 依赖不同; 服务地址不同; 1.1.引入依赖 在cloud-demo父工程的pom文件中..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-12-31T20:01:13.000Z"}],["meta",{"property":"article:author","content":"tim-qtp"}],["meta",{"property":"article:modified_time","content":"2024-12-31T20:01:13.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"注册中心\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2024-12-31T20:01:13.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"tim-qtp\\",\\"url\\":\\"https://github.com/tim-qtp/\\"}]}"]]},"headers":[{"level":2,"title":"1.服务注册到nacos","slug":"_1-服务注册到nacos","link":"#_1-服务注册到nacos","children":[{"level":3,"title":"1.1.引入依赖","slug":"_1-1-引入依赖","link":"#_1-1-引入依赖","children":[]},{"level":3,"title":"1.2.配置nacos地址","slug":"_1-2-配置nacos地址","link":"#_1-2-配置nacos地址","children":[]},{"level":3,"title":"1.3.重启","slug":"_1-3-重启","link":"#_1-3-重启","children":[]}]},{"level":2,"title":"2.服务分级存储模型","slug":"_2-服务分级存储模型","link":"#_2-服务分级存储模型","children":[{"level":3,"title":"2.1.给user-service配置集群","slug":"_2-1-给user-service配置集群","link":"#_2-1-给user-service配置集群","children":[]},{"level":3,"title":"2.2.Nacos小结：","slug":"_2-2-nacos小结","link":"#_2-2-nacos小结","children":[]}]},{"level":2,"title":"3.同集群优先的负载均衡","slug":"_3-同集群优先的负载均衡","link":"#_3-同集群优先的负载均衡","children":[{"level":3,"title":"3.1.给order-service配置集群信息","slug":"_3-1-给order-service配置集群信息","link":"#_3-1-给order-service配置集群信息","children":[]},{"level":3,"title":"3.2.修改负载均衡规则","slug":"_3-2-修改负载均衡规则","link":"#_3-2-修改负载均衡规则","children":[]},{"level":3,"title":"3.3.如果配置了优先访问本地集群，那本地的多个集群都崩了会发生什么?","slug":"_3-3-如果配置了优先访问本地集群-那本地的多个集群都崩了会发生什么","link":"#_3-3-如果配置了优先访问本地集群-那本地的多个集群都崩了会发生什么","children":[]},{"level":3,"title":"3.4.总结","slug":"_3-4-总结","link":"#_3-4-总结","children":[]}]},{"level":2,"title":"4.权重配置","slug":"_4-权重配置","link":"#_4-权重配置","children":[]},{"level":2,"title":"5.环境隔离","slug":"_5-环境隔离","link":"#_5-环境隔离","children":[{"level":3,"title":"5.1.创建namespace","slug":"_5-1-创建namespace","link":"#_5-1-创建namespace","children":[]},{"level":3,"title":"5.2.给微服务配置namespace","slug":"_5-2-给微服务配置namespace","link":"#_5-2-给微服务配置namespace","children":[]}]},{"level":2,"title":"6.Nacos与Eureka的区别","slug":"_6-nacos与eureka的区别","link":"#_6-nacos与eureka的区别","children":[]}],"git":{"createdTime":1735675273000,"updatedTime":1735675273000,"contributors":[{"name":"tim-qtp","email":"2469100031@qq.com","commits":1}]},"readingTime":{"minutes":8.74,"words":2623},"filePathRelative":"microservices/nacos/Registration Center.md","localizedDate":"2024年12月31日","autoDesc":true,"excerpt":""}');export{e as data};
