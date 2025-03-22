import{_ as o,W as c,X as r,$ as e,a0 as a,Z as t,a2 as s,C as i}from"./framework-6a3aa88c.js";const l={},_=s('<p>为了帮助管理员快速丰富图片库，冷启动项目，需要提供批量从网络抓取并创建图片的功能。</p><p>**但是要注意，不建议将该功能开放给普通用户！**主要是为了防止滥用导致的版权问题、低质量内容的上传、服务器资源消耗和安全问题。因为我们要从网络批量抓取图片（爬虫），如果功能开放给用户，相当于所有用户都在使用我们的服务器作为爬虫源头，容易导致我们的服务器 IP 被封禁。</p><h3 id="方案设计" tabindex="-1"><a class="header-anchor" href="#方案设计" aria-hidden="true">#</a> 方案设计</h3><p>方案设计的重点包括：</p><ul><li>如何抓取图片</li><li>抓取和导入规则</li></ul><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503200107378.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h4 id="_1、如何抓取图片" tabindex="-1"><a class="header-anchor" href="#_1、如何抓取图片" aria-hidden="true">#</a> 1、如何抓取图片？</h4><p>思考 2 个问题：从哪里抓取图片？怎么抓取图片呢？</p><p>绝大多数的图片素材网站，都是有版权保护的，不建议大家操作，容易被封禁 IP 和账号。比较安全的方法是从搜索引擎中抓取图片，仅学习使用、不商用的话基本不会有什么风险。</p>',9),p={href:"https://cn.bing.com/images",target:"_blank",rel:"noopener noreferrer"},h=e("p",null,"有 2 种常见的做法，第一种是请求到完整的页面内容后，对页面的 HTML 结构进行解析，提取到图片的地址，再通过 URL 下载；还有一种是直接调用后端获取图片地址的接口拿到图片数据。",-1),d=e("p",null,"要使用哪种方式，还是要具体情况具体分析，比如在调研过程中，我们会发现直接从 bing 图片的首页抓取数据，可能会出现获取不到图片的情况。所以我们换一种策略，尝试去找图片接口。",-1),m={href:"https://cn.bing.com/images/async?q=%25s&mmasync=1",target:"_blank",rel:"noopener noreferrer"},u=e("blockquote",null,[e("p",null,"注意，URL 地址必须要添加 mmasync=1 参数！否则加载条数不对")],-1);function g(f,b){const n=i("ExternalLinkIcon");return c(),r("div",null,[_,e("p",null,[a("这里我们选择从 bing 搜索获取图片，首先进入 "),e("a",p,[a("bing 图片网站"),t(n)]),a("，可以看到很多图片，但是如何获取这些图片呢？")]),h,d,e("p",null,[a("按 F12 打开网络请求控制台，向下滚动图片时会触发新一波图片的加载，就能看到获取图片数据的接口了："),e("a",m,[a("https://cn.bing.com/images/async?q=%s&mmasync=1"),t(n)])]),u])}const x=o(l,[["render",g],["__file","3.Capture Packet Batch Creation.html.vue"]]);export{x as default};
