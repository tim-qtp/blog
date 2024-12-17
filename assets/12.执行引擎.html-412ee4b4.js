const t=JSON.parse('{"key":"v-59f7b19e","path":"/Java/jvm/part1/12.%E6%89%A7%E8%A1%8C%E5%BC%95%E6%93%8E.html","title":"执行引擎","lang":"zh-CN","frontmatter":{"order":12,"icon":"java","title":"执行引擎","category":["JVM"],"tag":["JVM上篇"],"description":"[TOC] 执行引擎属于JVM的下层，里面包括解释器、及时编译器、垃圾回收器 Untitled 执行引擎是Java虚拟机核心的组成部分之一; “虚拟机”是一个相对于“物理机”的概念，这两种机器都有代码执行能力，其区别是物理机的执行引擎是直接建立在处理器、缓存、指令集和操作系统层面上的，而虚拟机的执行引擎则是由软件自行实现的。因此可以不受物理条件制约地定...","head":[["meta",{"property":"og:url","content":"https://tim-qtp.github.io/blog/blog/Java/jvm/part1/12.%E6%89%A7%E8%A1%8C%E5%BC%95%E6%93%8E.html"}],["meta",{"property":"og:site_name","content":"Qtp"}],["meta",{"property":"og:title","content":"执行引擎"}],["meta",{"property":"og:description","content":"[TOC] 执行引擎属于JVM的下层，里面包括解释器、及时编译器、垃圾回收器 Untitled 执行引擎是Java虚拟机核心的组成部分之一; “虚拟机”是一个相对于“物理机”的概念，这两种机器都有代码执行能力，其区别是物理机的执行引擎是直接建立在处理器、缓存、指令集和操作系统层面上的，而虚拟机的执行引擎则是由软件自行实现的。因此可以不受物理条件制约地定..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://tim-qtp.github.io/blog/blog/"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-12-17T19:31:17.000Z"}],["meta",{"name":"twitter:card","content":"summary_large_image"}],["meta",{"name":"twitter:image:alt","content":"执行引擎"}],["meta",{"property":"article:author","content":"tim-qtp"}],["meta",{"property":"article:tag","content":"JVM上篇"}],["meta",{"property":"article:modified_time","content":"2024-12-17T19:31:17.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"执行引擎\\",\\"image\\":[\\"https://tim-qtp.github.io/blog/blog/\\"],\\"dateModified\\":\\"2024-12-17T19:31:17.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"tim-qtp\\",\\"url\\":\\"https://github.com/tim-qtp/\\"}]}"]]},"headers":[{"level":2,"title":"执行引擎的工作流程","slug":"执行引擎的工作流程","link":"#执行引擎的工作流程","children":[]},{"level":2,"title":"图解Java代码的执行过程","slug":"图解java代码的执行过程","link":"#图解java代码的执行过程","children":[]},{"level":2,"title":"机器码","slug":"机器码","link":"#机器码","children":[]},{"level":2,"title":"指令","slug":"指令","link":"#指令","children":[]},{"level":2,"title":"指令集","slug":"指令集","link":"#指令集","children":[]},{"level":2,"title":"汇编语言","slug":"汇编语言","link":"#汇编语言","children":[]},{"level":2,"title":"高级语言","slug":"高级语言","link":"#高级语言","children":[]},{"level":2,"title":"字节码","slug":"字节码","link":"#字节码","children":[]},{"level":2,"title":"解释器工作机制","slug":"解释器工作机制","link":"#解释器工作机制","children":[]},{"level":2,"title":"解释器分类","slug":"解释器分类","link":"#解释器分类","children":[]},{"level":2,"title":"现状","slug":"现状","link":"#现状","children":[]},{"level":2,"title":"Java代码的执行分类","slug":"java代码的执行分类","link":"#java代码的执行分类","children":[]},{"level":2,"title":"HotSpot JVM的执行方式","slug":"hotspot-jvm的执行方式","link":"#hotspot-jvm的执行方式","children":[]},{"level":2,"title":"概念解释","slug":"概念解释","link":"#概念解释","children":[]},{"level":2,"title":"热点代码及探测技术","slug":"热点代码及探测技术","link":"#热点代码及探测技术","children":[{"level":3,"title":"方法调用计数器","slug":"方法调用计数器","link":"#方法调用计数器","children":[]},{"level":3,"title":"热度衰减","slug":"热度衰减","link":"#热度衰减","children":[]},{"level":3,"title":"回边计数器","slug":"回边计数器","link":"#回边计数器","children":[]}]},{"level":2,"title":"HotSpotVM 可以设置程序执行方法","slug":"hotspotvm-可以设置程序执行方法","link":"#hotspotvm-可以设置程序执行方法","children":[]},{"level":2,"title":"HotSpotVM中 JIT 分类","slug":"hotspotvm中-jit-分类","link":"#hotspotvm中-jit-分类","children":[{"level":3,"title":"C1 和 C2编译器不同的优化策略","slug":"c1-和-c2编译器不同的优化策略","link":"#c1-和-c2编译器不同的优化策略","children":[]}]}],"git":{"createdTime":1734463877000,"updatedTime":1734463877000,"contributors":[{"name":"tim-qtp","email":"2469100031@qq.com","commits":1}]},"readingTime":{"minutes":21.03,"words":6310},"filePathRelative":"Java/jvm/part1/12.执行引擎.md","localizedDate":"2024年12月17日","autoDesc":true,"excerpt":""}');export{t as data};
