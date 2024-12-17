const t=JSON.parse('{"key":"v-897b5816","path":"/Java/jvm/part1/13.StringTable.html","title":"StringTable","lang":"zh-CN","frontmatter":{"order":13,"title":"StringTable","category":["JVM"],"tag":["JVM上篇"],"description":"[TOC] String：字符串，使用一对\\" \\"引起来表示; String声明为final的，不可被继承; String实现了Serializable接口：表示字符串是支持序列化的; String实现了Comparable接口：表示string可以比较大小; String在jdk8及以前内部定义了final char[ ] value用于存储字符串数据...","head":[["meta",{"property":"og:url","content":"https://tim-qtp.github.io/blog/blog/Java/jvm/part1/13.StringTable.html"}],["meta",{"property":"og:site_name","content":"Qtp"}],["meta",{"property":"og:title","content":"StringTable"}],["meta",{"property":"og:description","content":"[TOC] String：字符串，使用一对\\" \\"引起来表示; String声明为final的，不可被继承; String实现了Serializable接口：表示字符串是支持序列化的; String实现了Comparable接口：表示string可以比较大小; String在jdk8及以前内部定义了final char[ ] value用于存储字符串数据..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://tim-qtp.github.io/blog/blog/"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-12-17T19:31:17.000Z"}],["meta",{"name":"twitter:card","content":"summary_large_image"}],["meta",{"name":"twitter:image:alt","content":"StringTable"}],["meta",{"property":"article:author","content":"tim-qtp"}],["meta",{"property":"article:tag","content":"JVM上篇"}],["meta",{"property":"article:modified_time","content":"2024-12-17T19:31:17.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"StringTable\\",\\"image\\":[\\"https://tim-qtp.github.io/blog/blog/\\"],\\"dateModified\\":\\"2024-12-17T19:31:17.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"tim-qtp\\",\\"url\\":\\"https://github.com/tim-qtp/\\"}]}"]]},"headers":[{"level":2,"title":"String在jdk9中存储结构变更","slug":"string在jdk9中存储结构变更","link":"#string在jdk9中存储结构变更","children":[]},{"level":2,"title":"String的基本特性","slug":"string的基本特性-1","link":"#string的基本特性-1","children":[]},{"level":2,"title":"面试题","slug":"面试题","link":"#面试题","children":[]},{"level":2,"title":"intern的使用：JDK6 vs JDK7/8","slug":"intern的使用-jdk6-vs-jdk7-8","link":"#intern的使用-jdk6-vs-jdk7-8","children":[]},{"level":2,"title":"练习","slug":"练习","link":"#练习","children":[]},{"level":2,"title":"intern的效率测试：空间角度","slug":"intern的效率测试-空间角度","link":"#intern的效率测试-空间角度","children":[]}],"git":{"createdTime":1734463877000,"updatedTime":1734463877000,"contributors":[{"name":"tim-qtp","email":"2469100031@qq.com","commits":1}]},"readingTime":{"minutes":28.05,"words":8416},"filePathRelative":"Java/jvm/part1/13.StringTable.md","localizedDate":"2024年12月17日","autoDesc":true,"excerpt":""}');export{t as data};
