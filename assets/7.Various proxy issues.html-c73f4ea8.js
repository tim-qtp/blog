import{_ as o,W as e,X as c,a2 as d}from"./framework-6a3aa88c.js";const t={},s=d('<p>这篇主要讲一下各种代理问题，包括 <strong><code>系统代理</code></strong>、<strong><code>TUN/TAP代理</code></strong>、<strong><code>真VPN代理</code></strong>，以及 <strong><code>Clash</code></strong>/<strong><code>V2Ray</code></strong>/<strong><code>Singbox</code></strong> 虚拟网卡如何接管系统全局流量，以及什么是真正的 <strong><code>VPN</code></strong>。</p><p>你可能有以下问题：</p><ul><li>为什么节点无法使用？</li><li>为什么游戏无法使用？</li><li>为什么有的软件能用而有的却不能用？</li><li>为什么电脑能用而手机不能用？</li><li>为什么能上谷歌而上不了 YouTube？</li><li>为什么添加了直连规则却还是走代理？</li></ul><p>先来创建一个最常见的家庭网络环境。你在运营商拉了一条宽带，他会给你分配一个光猫。一般来讲，你会单独再购买一个路由器连接光猫。路由器通过 <strong><code>PPPoE</code></strong> 拨号获取运营商分配的公网 <strong><code>IP</code></strong>，假设为 <strong><code>2.2.2.2</code></strong>。同时，路由器作为局域网的网关会有自己的内网 <strong><code>IP</code></strong>，假设为 <strong><code>192.168.0.1</code></strong>。家里的所有网络设备都会连接到这台路由器，路由器通过 <strong><code>DHCP</code></strong> 为每一台网络设备分配一个内网 <strong><code>IP</code></strong> 以及默认网关、<strong><code>DNS</code></strong> 等信息。一般情况下，默认网关和 <strong><code>DNS</code></strong> 服务器都是路由器。这是最常见的家庭网络拓扑。</p><hr><h3 id="没有代理的正常情况" tabindex="-1"><a class="header-anchor" href="#没有代理的正常情况" aria-hidden="true">#</a> 没有代理的正常情况</h3><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20250131202650290.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>以 <strong><code>TCP/IP</code></strong> 的四层模型为例，假设浏览器发送了访问百度的请求，数据包会经由操作系统的网络协议栈一层层地进行封装。首先，应用层会将其封装成 <strong><code>HTTP</code></strong> 的数据包，再由传输层以 <strong><code>TCP</code></strong> 的方式封装数据，其中包含了源端口和目标端口。源端口是浏览器开启了一个随机端口，这里就不画了，目标端口是百度服务器的 <strong><code>80</code></strong> 端口。接着，网络层会加上源 <strong><code>IP</code></strong> 和目标 <strong><code>IP</code></strong>，源 <strong><code>IP</code></strong> 是本机电脑的内网 <strong><code>IP</code></strong>，目标 <strong><code>IP</code></strong> 是百度服务器的 <strong><code>IP</code></strong> 地址，假设是 <strong><code>3.3.3.3</code></strong>。本期我们先不关注百度的 <strong><code>IP</code></strong> 是如何获取的。再往下的接口层会封装 <strong><code>MAC</code></strong> 地址，并将数据从物理网口通过网线发送到了默认网关，也就是路由器。路由器会对数据包进行 <strong><code>NAT</code></strong> 处理，将数据包的内网 <strong><code>IP</code></strong> 替换为运营商分配的公网 <strong><code>IP</code></strong>，再将数据包发送到互联网。</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20250131202844863.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20250131202928460.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>经过互联网路由器的路由，最终百度的服务器会从网口收到我们发给他的数据包。发数据的过程是封装，而收数据的过程就是解封装。它会一层层地将我们的数据包解开，最终得到我们的意图是访问百度。于是乎，他会将百度首页的内容通过协议栈一层层地封装，从网口发出，并通过互联网的路由。最终，我们的路由器会收到百度返回的数据包，路由器会进行 <strong><code>NAT</code></strong> 处理，将公网 <strong><code>IP</code></strong> 恢复成内网 <strong><code>IP</code></strong>，并将数据发送给我们的电脑。电脑将数据包一层层解封装后返回给浏览器，百度首页的内容也就呈现在我们的面前。至此，一个简单的网络通信过程就完成了。这是在没有使用代理的正常情况下，收发数据是这么一个流程。</p><hr><h3 id="代理模式" tabindex="-1"><a class="header-anchor" href="#代理模式" aria-hidden="true">#</a> 代理模式</h3><p>接下来我们引入代理。首先，第一种最常见的是通过 <strong><code>SOCKS</code></strong> 或者 <strong><code>HTTP</code></strong> 代理的方式。我们平时使用基于 <strong><code>Clash</code></strong>、<strong><code>V2Ray</code></strong>、<strong><code>Xray</code></strong> 等内核的代理客户端都支持这种方式，也是必须要能支持的。</p><p>当我们这样设置代理之后，由于 <strong><code>Clash</code></strong> 接管了系统代理，浏览器访问谷歌的请求会交给 <strong><code>Clash</code></strong>。<strong><code>Clash</code></strong> 收到数据后，会根据分流规则判断是否需要走代理，<strong><code>Clash</code></strong> 会将数据进行加密封装。具体怎么加密取决于 <strong><code>Clash</code></strong> 当前使用的节点是什么协议。这里假设 <strong><code>Clash</code></strong> 当前选中的节点是服务器 <strong><code>IP</code></strong> 为 <strong><code>5.5.5.5</code></strong> 的 <strong><code>SS</code></strong> 节点，所以会使用 <strong><code>SS</code></strong> 协议进行加密封装</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20250131203428742.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>加密封装后的数据会通过操作系统的网络协议栈一层层地进行封装。传输层会加上节点服务器的端口，网络层会加上节点服务器的 <strong><code>IP</code></strong> 地址，最后交给路由器。路由器进行 <strong><code>NAT</code></strong> 转换后，将数据发送到了节点服务器。节点服务器收到数据后，解封装、解密，然后帮我们访问谷歌，最后将谷歌的数据进行加密封装，再返回给我们。收到节点服务器的数据后，通过网络协议栈一层层地解封装，加密数据会交给 <strong><code>Clash</code></strong>，<strong><code>Clash</code></strong> 对数据进行解密后再转交给浏览器。这样，我们就成功地访问了谷歌。这就是系统代理的执行流程。</p><p>但是存在比较棘手的问题。并不是所有软件都遵循系统代理。除去浏览器，绝大部分软件都不会走系统代理，甚至连设置代理的地方都没有，行为完全取决于软件开发者。</p><p>并且，系统代理一般都是 <strong><code>HTTP</code></strong> 代理而非 <strong><code>SOCKS5</code></strong>，<strong><code>HTTP</code></strong> 代理不支持 <strong><code>UDP</code></strong>，游戏也是没法玩的。并且游戏一般都不会添加代理功能，所以使用系统代理模式一般都是看看网页、聊聊天。如果说系统代理能满足你的需求，那就是最方便省事的模式了。如果无法满足，比如设置好系统代理后，软件还是无法使用，可能是软件并没有走代理。这个时候就可以使用 <strong><code>TUN</code></strong> 或者 <strong><code>TAP</code></strong> 模式。</p><hr><h3 id="tun-tap-模式" tabindex="-1"><a class="header-anchor" href="#tun-tap-模式" aria-hidden="true">#</a> TUN/TAP 模式</h3><p>这种模式的原理是创建一张虚拟网卡，从网络层接管系统所有流量。因为所有发往互联网的流量都必须经过网络层的封装，在这层进行拦截就能够获取所有应用产生的网络数据。这是目前主流的模式，我们的手机默认就是这种模式，所以才能实现所有 <strong><code>APP</code></strong> 翻墙。软路由接管全家的科学上网也是同样的原理。正因为有了 <strong><code>TUN</code></strong>，才能让科学上网达到近乎完美的状态。</p><p>还是以 <strong><code>Clash</code></strong> 为例，假设浏览器无视 <strong><code>Clash</code></strong> 接管的系统代理，数据不会交给 <strong><code>Clash</code></strong> 处理。但是 <strong><code>Clash</code></strong> 开启了 <strong><code>TUN</code></strong> 模式，开启之后会创建一张虚拟网卡。此时，浏览器访问谷歌，数据会直接来到网络协议栈。应用层会封装 <strong><code>HTTP</code></strong> 头部，<strong><code>HTTP</code></strong> 请求会使用 <strong><code>TCP</code></strong> 进行封装，接着来到 <strong><code>网络层</code></strong>。首先，目标 <strong><code>IP</code></strong> 是谷歌的 <strong><code>IP</code></strong>，假设我们已经知道了是 <strong><code>8.8.8.8</code></strong>。那源 <strong><code>IP</code></strong> 是什么？</p><p>由于 <strong><code>Clash</code></strong> 的 <strong><code>TUN</code></strong> 模式开启了一张虚拟网卡，也就是说，数据会有两个出口，要么发给 <strong><code>Clash</code></strong> 的虚拟网卡，要么发给 <strong><code>物理网卡</code></strong>。</p><p>具体发给哪张网卡是通过电脑的 <strong><code>路由表</code></strong> 来决定的。<strong><code>Windows</code></strong> 可以通过 <code>route print</code> 这条命令来查看 <strong><code>路由表</code></strong>。默认路由是这条，通过本机 <strong><code>IP</code></strong> <strong><code>192.168.31.91</code></strong> 发给网关，也就是路由器的 <strong><code>192.168.31.1</code></strong>。只有当下面所有路由条目都不匹配的时候，才会走默认路由。</p><p>这时你会发现我的第一条网关是<code>2.1</code>，不是<code>31.1</code>，这是为什么呢！</p><p>因为我几天前配置过软路由，电脑数据会通过路由器转发到软路由上，即网关是软路由的网关，所以会不一样，但是会记录到电脑的路由表中。这里忽略掉它即可！</p><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20250131231818252.png" style="zoom:50%;"><p><strong><code>Clash</code></strong> 在开启 <strong><code>TUN</code></strong> 模式的时候，会自动帮我们添加路由。可以看到新增一条路由条目，通过 <strong><code>网络号</code></strong> 和 <strong><code>子网掩码</code></strong> 我们可以看出，<strong><code>Clash</code></strong> 添加的这两条路由涵盖了所有 <strong><code>IPv4</code></strong> 的地址。</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20250131235532985.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>也就是说，访问任何 <strong><code>IP</code></strong> 的时候，都会从 <strong><code>172.29.0.1</code></strong> 这个接口，将数据交给 <strong><code>172.29.0.2</code></strong> 这个网关。再说明白一点就是，数据会发给 <strong><code>Clash</code></strong> 开启的虚拟网卡。</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20250201104522054.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>所以源 <strong><code>IP</code></strong> 为 <strong><code>172.29.0.1</code></strong>。如果你使用 <strong><code>TAP</code></strong> 模式，则还会向下封装 <strong><code>MAC</code></strong> 地址，但对我们来说，<strong><code>MAC</code></strong> 并没什么作用，没必要向下封装，所以更推荐使用 <strong><code>TUN</code></strong> 模式。</p><p>此时，数据已经来到了 <strong><code>Clash</code></strong> 的虚拟网卡，<strong><code>Clash</code></strong> 可以监控并直接读取该网卡接口中的数据，并对其进行解析。</p><p>根据分流规则，决定数据是否需要走代理。如果需要走代理，就使用当前选中的节点对数据进行加密，发给相应的节点服务器。封装过程都是一样的。为避免流量<strong>环回</strong>，<strong><code>Clash</code></strong> 会帮我们设置好出口为 <strong><code>物理网卡</code></strong>，从 <strong><code>物理网口</code></strong> 将数据发送出去。</p><p>当收到节点服务器返回的数据时，通过 <strong><code>网络协议栈</code></strong> 一层层地解封装，数据会来到 <strong><code>Clash</code></strong>，<strong><code>Clash</code></strong> 对数据进行解密，然后通过虚拟网卡将数据封装成 <strong><code>网络层</code></strong> 的数据包，再发回给浏览器。这样，我们就成功地访问了谷歌。这就是在网络层进行代理的 <strong><code>TUN</code></strong> 模式。</p><p>而且我使用的内核是Mihomo，所以网络适配器面板会出现其网卡信息</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20250201200437601.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20250201200336342.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><hr><h3 id="tun-模式的优点与局限性" tabindex="-1"><a class="header-anchor" href="#tun-模式的优点与局限性" aria-hidden="true">#</a> TUN 模式的优点与局限性</h3><p>非常严格的程序或者游戏可能会检测电脑开启了虚拟网卡代理。为了让代理过程对电脑完全透明，可以将 <strong><code>Clash</code></strong> 的虚拟网卡转移到路由器里。这样，局域网内的设备无需运行任何代理工具，所有设备上网流量必将经过网关路由器。路由器的 <strong><code>物理网卡</code></strong> 接收到数据后会转交给 <strong><code>Clash</code></strong>，接下来的流程就和电脑上是一样的了，加密封装，然后转发到互联网即可。电脑没开代理，程序和游戏当然也就检测不出来。这种称之为 <strong><code>透明代理</code></strong>，前提是你家的路由器能够安装 <strong><code>Clash</code></strong>。这也是软路由的由来。也可以试试用虚拟机或者闲置的安卓手机充当软路由，也是一样的原理。</p><p>支持 <strong><code>TUN</code></strong> 模式的常用软件有 <strong><code>Clash</code></strong>、<strong><code>SSTap</code></strong>、<strong><code>Netch</code></strong>、<strong><code>Singbox</code></strong> 等。</p><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20250201105746950.png" style="zoom:33%;"><p>很遗憾的是，<strong><code>V2Ray</code></strong> 和 <strong><code>Xray</code></strong> 并不支持。不过，从 <strong><code>V2RayN</code></strong> <strong><code>6.0</code></strong> 以上的版本开始支持了 <strong><code>TUN</code></strong> 模式了，其实就是调用 <strong><code>Singbox</code></strong> 的内核。如果觉得<code>V2Ray</code>黑框很碍事，可以在 <strong><code>TUN</code></strong> 设置中将显示控制台关闭，保存后再来尝试开启，就不会再有那个黑框了。</p><hr><h3 id="真vpn" tabindex="-1"><a class="header-anchor" href="#真vpn" aria-hidden="true">#</a> 真VPN</h3><p>这种虚拟网卡模式和真正的 <strong><code>VPN</code></strong> 已经非常接近了，但是也只能说非常接近，还不是真正的 <code>VPN</code>。</p><p>因为我们用的 <code>SS</code>、<code>VMess</code>、<code>Trojan</code> 等主流的翻墙协议都无法封装网络层的数据包。最直观的感受就是 <code>ping</code> 命令这个网络层的工具。</p><p>当我们使用 <code>Clash</code> 的 <code>TUN</code> 模式 <code>ping</code> 谷歌的话，会返回一个假的延迟。这个一毫秒的延迟是直接从虚拟网卡返回的。</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20250201201038002.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>并且，如果使用 <code>fakeIP</code> 模式的话，还会直接返回一个假的 <code>IP</code>。因为 <code>SS</code>、<code>VMess</code> 等协议无法代理网络层的 <code>ICMP</code> 协议，而 <code>ping</code> 就是 <code>ICMP</code> 协议的工具。</p><p>真正的 <code>VPN</code> 可以代理网络层，所以 <code>WireGuard</code> 是可以 <code>ping</code> 通谷歌的，而且延迟是真实的。</p><p>要了解什么是真正的 <code>VPN</code>，就需要先来了解一下 <code>VPN</code> 的全称：<code>Virtual Private Network</code>，译为虚拟专用网络或者虚拟私有网络。</p><ul><li><p>什么网络是私有网络？你家里的局域网就是你的私有网络。我们无法直接和你没有公网 <code>IP</code> 的电脑进行通信，除非到你家里连上你家的路由器，那我们就能在同一个私有网络里。</p></li><li><p>那什么是虚拟？顾名思义，虚拟的意思就是虚拟，就是物理不存在。比如你的老婆初音未来。虚拟私有网络的意思就是我不需要物理地跑到你家里去，物理地连接上你家的路由器，就可以实现与你没有公网 <code>IP</code> 的电脑进行通信。而要实现这个功能的话，就必须要能够封装网络层的数据包。只有能够封装网络层的数据包，才能实现异地组网，才能实现内网穿透，才能实现虚拟地和你在同一内网里，才能称之为 <code>VPN</code>。</p></li></ul><p><code>VPN</code> 是一种技术，而不是某个具体的协议。<code>VPN</code> 有很多技术实现，<code>PPTP VPN</code>、<code>IPSec VPN</code>、<code>OpenVPN</code>、<code>WireGuard</code> 等等。</p><p>具体实现细节都不太一样，但有一个是必须要支持的，就是封装网络层。</p><p>如果 <code>SS</code> 协议也能够封装网络层，实现异地组网，那也能称之为 <code>VPN</code>。</p><p>当然，我这里并不是说 <code>VPN</code> 就更高级。相反的，对于科学上网来讲，它可是一点都不高级。</p><p>因为 <code>VPN</code> 并不是为翻墙而生的，只是因为它能对数据进行加密，顺便实现了翻墙功能。</p><p>相较于 <code>SS</code> 这种专门为翻墙而生，将流量特征隐藏的协议，<code>VPN</code> 的流量清晰明了的写着它就是 <code>VPN</code> 的流量。而且 <code>VPN</code> 分流很不方便，所以用来科学上网并不合适。</p><p>目前来讲，<code>TUN</code> 模式是比较完美的客户端代理方式，既能实现在网络层接管系统所有流量，又能在此基础上实现分流。美中不足的地方就是使用 <code>ping</code> 命令来测试网络延迟的时候就不太方便了。如果你平时只是用来浏览网页的话，第一种系统代理的方式也是一个不错的选择。至于真 <code>VPN</code> 的话，并不推荐用来科学上网，更适合有内网穿透需求的用户。</p>',62),g=[s];function n(r,a){return e(),c("div",null,g)}const p=o(t,[["render",n],["__file","7.Various proxy issues.html.vue"]]);export{p as default};
