import{_ as e,W as a,X as i,$ as o}from"./framework-c8643d23.js";const t={},n=o('<h3 id="_1、为什么要三次握手" tabindex="-1"><a class="header-anchor" href="#_1、为什么要三次握手" aria-hidden="true">#</a> 1、为什么要三次握手?</h3><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241220001941255.png" alt="image-20241220001941255" tabindex="0" loading="lazy"><figcaption>image-20241220001941255</figcaption></figure><p>最主要的目的就是双方确认自己与对方的发送与接收是正常的。</p><p><strong>第一次握手</strong>：<code>Server 确认了对方发送正常，自己接收正常;</code></p><p><strong>第二次握手</strong>：<code>Client 确认了：对方发送、接收正常</code>；</p><p><strong>第三次握手</strong>：<code>Server 确认了：接收正常</code></p><ul><li>发送方通过 SYN 控制消息并携带自己期望的初始序列号 SEQ 给接收方</li><li>接收方收到 SYN 消息之后，通过 ACK 控制消息以及 SEQ+1 来进行确认，并带上自己的 SEQ</li><li>发送方通过 ACK 控制消息以及接收方的 SEQ+1 来进行确认，<strong>并且还能够在第三次握手通信的同时，直接携带数据进行传输</strong></li></ul><h3 id="_2、为什么要四次挥手" tabindex="-1"><a class="header-anchor" href="#_2、为什么要四次挥手" aria-hidden="true">#</a> 2、为什么要四次挥手?</h3><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241219233644469.png" alt="image-20241219233644469" tabindex="0" loading="lazy"><figcaption>image-20241219233644469</figcaption></figure><p>客户端发送完ACK包后，会进入超长等待时间，而服务端收到ACK后会立即关闭连接，这是第四次挥手。</p><p>那为什么客户端需要<code>等待超时时间</code>呢？</p><p>这是为了保证服务端已经收到ACK包，假如客户端在发送完ACK后，就立即关闭连接，而这时ACK包传输时丢失，服务端将一直停留在最后确认状态。</p><p>假如等待一会儿，这时服务端因为没有收到ACK包，会重发FIN包，客户端收到响应后重发ACK包并刷新超时时间。</p><p>这和三次握手一样，是为了在不可靠的网络链路中进行可靠的连接断开确认。</p>',14),r=[n];function c(s,d){return a(),i("div",null,r)}const g=e(t,[["render",c],["__file","three handshakes and four waves.html.vue"]]);export{g as default};
