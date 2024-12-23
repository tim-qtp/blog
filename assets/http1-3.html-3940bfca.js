import{_ as i,W as a,X as e,a1 as t}from"./framework-4e10303a.js";const l={},o=t('<h3 id="_1、1-0-和1-1-有什么区别" tabindex="-1"><a class="header-anchor" href="#_1、1-0-和1-1-有什么区别" aria-hidden="true">#</a> 1、1.0 和1.1 有什么区别？</h3><ul><li><p>HTTP/1.0 为短连接，每次请求都需要建⽴⼀个<strong>昂贵的</strong>TCP连接。HTTP/1.1 支持长连接。⼀个TCP连接上可以传送多个HTTP请求和响应，默认开启 <code>Connection:Keep-Alive</code></p></li><li><p>增加pipline管道，无需等待前面的请求响应，即可发送第二次请求，但是响应必须按照请求发出的顺序返回，存在队头阻塞问题。所以后面2.0从浏览器中就移除了。<code>所以现在浏览器一般是与服务器建立多个TCP连接</code></p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241219150225816.png" alt="目前浏览器的TCP连接方式" tabindex="0" loading="lazy"><figcaption>目前浏览器的TCP连接方式</figcaption></figure></li><li><p>增加Host字段，可以区分一台服务器的不同端口号web服务</p></li><li><p>状态码也多了</p></li><li><p>请求头中引入了range，允许只传送资源的某个部分</p></li><li><p>除了get，set以外，增加了 PUT、DELETE、OPTIONS、PATCH 等新的⽅法</p></li></ul><h3 id="_2、那2-0呢" tabindex="-1"><a class="header-anchor" href="#_2、那2-0呢" aria-hidden="true">#</a> 2、那2.0呢？</h3><p>每个文件分成多个帧，放在同一个stream流里面，然后三个文件可以进行传输，对方接收到后，按照流ID进行重组，这样就可以一个TCP连接内同时发送多个资源，但还是顺序的！所以有对头阻塞的情况。</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241219170535718.png" alt="image-20241219170535718" tabindex="0" loading="lazy"><figcaption>image-20241219170535718</figcaption></figure><ul><li>使用二进制帧，进行数据传输，1.1 则使用文本格式的报文。二进制帧更加紧凑和高效，减少了传输的数据量和带宽消耗。</li><li>多路复用，移除了pipline，支持一个TCP发起多个请求，但是每个<strong>stream流</strong>彼此独立，不需要按顺序发送或接收。<code>但还是有阻塞问题！</code></li><li>header压缩，之前header内含很多信息，每次连接都要发送，现在压缩了存储，并且双方都缓存，⼀份header字段表。既可以避免重复header传输，⼜减⼩了需要传输的⼤⼩。</li><li>支持服务端主动push推送</li></ul><h3 id="_3、那3-0呢" tabindex="-1"><a class="header-anchor" href="#_3、那3-0呢" aria-hidden="true">#</a> 3、那3.0呢？</h3><p>在目前移动端的普及下的新协议，以前从一个网络切换到另一个网络（Wifi-&gt;4G、5G）很慢，现在QUIC实现了一个称为连接ID的概念</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241219152622123.png" alt="2.0痛点" tabindex="0" loading="lazy"><figcaption>2.0痛点</figcaption></figure><p>这个过程会增加网络延迟和资源消耗。在传输数据阶段，虽然在应用层多个请求可以同时发送，但是TCP协议要求数据必须按照顺序串行传输，一起过独木桥。</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241219153133834.png" alt="image-20241219153133834" tabindex="0" loading="lazy"><figcaption>image-20241219153133834</figcaption></figure><p>如果其中一个数据包丢失，后续的数据包就要等待重传或者等待前面的数据包传输完成后才能发送。队头阻塞的问题并没有彻底解决。</p><p>但是TCP协议僵化，被广泛的内置于操作系统内核，中间件固件以及硬件实现当中，改进的话老旧都要兼容，难以升级。</p><p>所以谷歌在UDP的基础上，研究出了QUIC协议。</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241219154755123.png" alt="建立连接更快" tabindex="0" loading="lazy"><figcaption>建立连接更快</figcaption></figure><p>速度快，低延迟。以前需要3个RTT，现在 0-RTT 或者 1-RTT。</p><p>同样也更安全，HTTP 2可以使用TLS加密（HTTPS）。但加密并非强制要求。HTTP三默认使用QUIC自带的TLS1.3加密。安全性更高，且加密是强制的。</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241219171318249.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>每个Stream就是一个文件，一个Connection就是一个TCP连接。</p><p>但是QUIC一个连接上的多个stram之间相互独立，没有依赖，假如其中一个stram丢包了，也只会影响该stream的处理，这就解决了对头阻塞的问题。</p><ul><li><strong>头部压缩</strong>：HTTP/2.0 使用 <code>HPACK</code> 算法进行头部压缩，而 HTTP/3.0 使用更高效的 <code>QPACK</code> 头压缩算法。</li><li>安全性高</li><li>建立连接快</li><li>无对头阻塞</li><li>连接迁移，5G-WIFI，改为了64位唯一ID</li><li>避免了协议僵化</li></ul>',21),p=[o];function g(n,c){return a(),e("div",null,p)}const s=i(l,[["render",g],["__file","http1-3.html.vue"]]);export{s as default};
