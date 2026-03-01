import{_ as s,W as a,X as e,Z as t,a2 as p,C as c}from"./framework-6a3aa88c.js";const i={},o=p(`<h2 id="基本配置项" tabindex="-1"><a class="header-anchor" href="#基本配置项" aria-hidden="true">#</a> 基本配置项：</h2><p>我们在电脑上运行<code>Clash for Windows</code>时，其实是调用了<code>Clash</code>的内核，并且加载了<code>yaml</code>配置文件。配置文件可能是机场提供的订阅地址，或者是你通过订阅转换获取的。</p><p>总之，配置文件的内容大概长这样：</p><ul><li>监听端口7890</li><li>配置了两个节点</li><li>以及两个节点组。</li></ul><p>第一个节点组包含两个节点，默认选中了香港节点；第二个节点组包含两个节点，默认选择了美国节点。下面是一些分流规则。此时浏览器访问<code>www.google.com</code>，由于设置了系统代理，访问谷歌的请求会被浏览器转发到系统代理监听的端口7890。</p><p><code>Clash</code>从7890端口收到数据后，会解析数据报的内容，知道浏览器想要访问谷歌。<code>Clash</code>有全局、规则、直连、脚本四种分流模式，大家一般用的都是规则模式。于是进入规则匹配，从上到下一条条匹配规则</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">7890</span>
<span class="token key atrule">proxies</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 香港节点
    <span class="token key atrule">type</span><span class="token punctuation">:</span> ss
  <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 美国节点
    <span class="token key atrule">type</span><span class="token punctuation">:</span> ss

<span class="token key atrule">proxy-groups</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 节点组1
    <span class="token key atrule">type</span><span class="token punctuation">:</span> select
    <span class="token key atrule">proxies</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> 香港节点
      <span class="token punctuation">-</span> 美国节点
  <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> 节点组2
    <span class="token key atrule">type</span><span class="token punctuation">:</span> select
    <span class="token key atrule">proxies</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> 美国节点
      <span class="token punctuation">-</span> 香港节点

<span class="token key atrule">rules</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> DOMAIN<span class="token punctuation">,</span>google.com<span class="token punctuation">,</span>节点组1
  <span class="token punctuation">-</span> DOMAIN<span class="token punctuation">-</span>SUFFIX<span class="token punctuation">,</span>youtube.com<span class="token punctuation">,</span>节点组1
  <span class="token punctuation">-</span> DOMAIN<span class="token punctuation">-</span>KEYWORD<span class="token punctuation">,</span>youtube<span class="token punctuation">,</span>节点组1
  <span class="token punctuation">-</span> DOMAIN<span class="token punctuation">,</span>ad.com<span class="token punctuation">,</span>REJECT
  <span class="token punctuation">-</span> SRC<span class="token punctuation">-</span>IP<span class="token punctuation">-</span>CIDR<span class="token punctuation">,</span>192.168.1.201/32<span class="token punctuation">,</span>DIRECT
  <span class="token punctuation">-</span> IP<span class="token punctuation">-</span>CIDR<span class="token punctuation">,</span>127.0.0.0/8<span class="token punctuation">,</span>DIRECT<span class="token punctuation">,</span>no<span class="token punctuation">-</span>resolve
  <span class="token punctuation">-</span> IP<span class="token punctuation">-</span>CIDR6<span class="token punctuation">,</span>2620<span class="token punctuation">:</span><span class="token punctuation">:</span>7/32<span class="token punctuation">,</span>节点组1<span class="token punctuation">,</span>no<span class="token punctuation">-</span>resolve
  <span class="token punctuation">-</span> GEOIP<span class="token punctuation">,</span>CN<span class="token punctuation">,</span>DIRECT
  <span class="token punctuation">-</span> DST<span class="token punctuation">-</span>PORT<span class="token punctuation">,</span><span class="token number">80</span><span class="token punctuation">,</span>DIRECT
  <span class="token punctuation">-</span> SRC<span class="token punctuation">-</span>PORT<span class="token punctuation">,</span><span class="token number">7777</span><span class="token punctuation">,</span>DIRECT
  <span class="token punctuation">-</span> PROCESS<span class="token punctuation">-</span>NAME<span class="token punctuation">,</span>curl<span class="token punctuation">,</span>节点组2
  <span class="token punctuation">-</span> MATCH<span class="token punctuation">,</span>节点组1
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>GEOIP</code>是一个数据库，里面包含了常见的<code>IP</code>归属地分类，如果是国内的<code>IP</code>，就走直连。</p><p>由于后面没有加<code>no-resolve</code>，所以需要将谷歌的域名解析为<code>IP</code>进行匹配。</p><p>由于<code>Clash</code>没有配置<code>DNS</code>模块，所以会交给电脑配置的本地<code>DNS</code>服务器进行解析。<code>Clash</code>会构建一条查询谷歌域名的<code>DNS</code>请求，发送给电脑配置的本地<code>DNS</code>服务器，也就是路由器。由于<code>DNS</code>请求是明文的，此时就产生了<code>DNS</code>泄露。</p><p>但是请求被墙的域名，大概率你会收到一条被污染的<code>DNS</code>响应。假设谷歌的真实<code>IP</code>是<code>4.4.4.4</code>，但是你收到的谷歌<code>IP</code>却是<code>5.5.5.5</code>，这就是<code>DNS</code>污染。</p><p><code>Clash</code>拿到这个被污染的<code>DNS</code>响应，以为谷歌的<code>IP</code>就是<code>5.5.5.5</code>，于是会用这个<code>IP</code>和<code>GEOIP</code>的规则进行匹配，发现这个<code>IP</code>的归属地不是国内，所以这条规则也是不匹配的。</p><p>最后 <code>Clash</code>还有一个兜底，叫做<code>MATCH</code>，所有没有匹配的规则全都交给<code>MATCH</code>处理，也就是节点组1，所以这条访问谷歌的请求交给了节点组1的香港节点，将会使用香港<code>SS</code>节点的配置信息，对数据进行加密。</p><div class="hint-container tip"><p class="hint-container-title">提示</p><p>刚才DNS获取到的IP只是用来IP规则的分流匹配，你发给香港节点只是域名。</p><p>所以节点收到数据后，会在它的网络环境中再次进行<code>DNS</code>解析，获取了正确的谷歌<code>IP</code>。</p><p>这时我访问百度肯定因为<code>GEOIP,CN,DIRECT</code>走直连，但我为了防止DNS泄露，在CN后加上了<code>no-resolve</code>（以前不是国内的就泄露），单独加上国内的百度域名走直连。</p><p>但是国内的小众网站并不在规则里，还是会存在走代理的情况。</p><p>平时主要访问国外网站的话比较适合。</p></div><p>还有一种是黑名单规则</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20250202115043927.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>在IP规则前，先把国外网站都加上，这样就可以优先匹配到域名规则，直接交给节点处理，不会再往下匹配。</p><p>也就不会触发IP规则的DNS请求了。</p><p>需要注意的是有些机场的Clash订阅，会把<code>no-resolve</code>的IP规则放在前面，导致优先发起了<code>DNS</code>请求，造成<code>DNS</code>泄露。</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20250202115537395.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>下面是雷霆的DNS配置：</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">dns</span><span class="token punctuation">:</span>
  <span class="token key atrule">enable</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
  <span class="token key atrule">ipv6</span><span class="token punctuation">:</span> <span class="token boolean important">false</span>
  <span class="token key atrule">default-nameserver</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> 223.5.5.5
  <span class="token punctuation">-</span> 119.29.29.29
  <span class="token key atrule">fake-ip-range</span><span class="token punctuation">:</span> 198.18.0.1/16
  <span class="token key atrule">use-hosts</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
  <span class="token key atrule">nameserver</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> https<span class="token punctuation">:</span>//doh.pub/dns<span class="token punctuation">-</span>query
  <span class="token punctuation">-</span> https<span class="token punctuation">:</span>//dns.alidns.com/dns<span class="token punctuation">-</span>query
  <span class="token key atrule">fallback</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> https<span class="token punctuation">:</span>//doh.dns.sb/dns<span class="token punctuation">-</span>query
  <span class="token punctuation">-</span> https<span class="token punctuation">:</span>//dns.cloudflare.com/dns<span class="token punctuation">-</span>query
  <span class="token punctuation">-</span> https<span class="token punctuation">:</span>//dns.twnic.tw/dns<span class="token punctuation">-</span>query
  <span class="token punctuation">-</span> tls<span class="token punctuation">:</span>//8.8.4.4<span class="token punctuation">:</span><span class="token number">853</span>
  <span class="token key atrule">fallback-filter</span><span class="token punctuation">:</span>
    <span class="token key atrule">geoip</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
    <span class="token key atrule">ipcidr</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> 240.0.0.0/4
    <span class="token punctuation">-</span> 0.0.0.0/32
  <span class="token key atrule">use-system-hosts</span><span class="token punctuation">:</span> <span class="token boolean important">false</span>
  <span class="token key atrule">enhanced-mode</span><span class="token punctuation">:</span> redir<span class="token punctuation">-</span>host
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>下面是魔戒的DNS配置：</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">dns</span><span class="token punctuation">:</span>
  <span class="token key atrule">enable</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
  <span class="token key atrule">listen</span><span class="token punctuation">:</span> 127.0.0.1<span class="token punctuation">:</span><span class="token number">1053</span>
  <span class="token key atrule">ipv6</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
  <span class="token key atrule">default-nameserver</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> 114.114.114.114
  <span class="token punctuation">-</span> 223.5.5.5
  <span class="token punctuation">-</span> 119.29.29.29
  <span class="token key atrule">enhanced-mode</span><span class="token punctuation">:</span> fake<span class="token punctuation">-</span>ip
  <span class="token key atrule">fake-ip-range</span><span class="token punctuation">:</span> 28.0.0.1/8
  <span class="token key atrule">use-hosts</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
  <span class="token key atrule">fake-ip-filter</span><span class="token punctuation">:</span>  
  <span class="token punctuation">-</span> <span class="token string">&#39;*.lan&#39;</span>
  <span class="token punctuation">-</span> <span class="token string">&#39;*.localdomain&#39;</span>
  <span class="token punctuation">-</span> <span class="token string">&#39;*.example&#39;</span>
  <span class="token punctuation">-</span> <span class="token string">&#39;*.invalid&#39;</span>
  <span class="token punctuation">-</span> <span class="token string">&#39;*.localhost&#39;</span>
  <span class="token punctuation">-</span> <span class="token string">&#39;*.test&#39;</span>
  <span class="token punctuation">-</span> <span class="token string">&#39;*.local&#39;</span>
  <span class="token punctuation">-</span> <span class="token string">&#39;*.home.arpa&#39;</span>
  <span class="token punctuation">-</span> time.<span class="token important">*.com</span>
  <span class="token punctuation">-</span> time.<span class="token important">*.gov</span>
  <span class="token punctuation">-</span> time.<span class="token important">*.edu.cn</span>
  <span class="token punctuation">-</span> time.<span class="token important">*.apple.com</span>
  <span class="token punctuation">-</span> time1.<span class="token important">*.com</span>
  <span class="token punctuation">-</span> time2.<span class="token important">*.com</span>
  <span class="token punctuation">-</span> time3.<span class="token important">*.com</span>
  <span class="token punctuation">-</span> time4.<span class="token important">*.com</span>
  <span class="token punctuation">-</span> time5.<span class="token important">*.com</span>
  <span class="token punctuation">-</span> time6.<span class="token important">*.com</span>
  <span class="token punctuation">-</span> time7.<span class="token important">*.com</span>
  <span class="token punctuation">-</span> ntp.<span class="token important">*.com</span>
  <span class="token punctuation">-</span> ntp1.<span class="token important">*.com</span>
  <span class="token punctuation">-</span> ntp2.<span class="token important">*.com</span>
  <span class="token punctuation">-</span> ntp3.<span class="token important">*.com</span>
  <span class="token punctuation">-</span> ntp4.<span class="token important">*.com</span>
  <span class="token punctuation">-</span> ntp5.<span class="token important">*.com</span>
  <span class="token punctuation">-</span> ntp6.<span class="token important">*.com</span>
  <span class="token punctuation">-</span> ntp7.<span class="token important">*.com</span>
  <span class="token punctuation">-</span> <span class="token string">&#39;*.time.edu.cn&#39;</span>
  <span class="token punctuation">-</span> <span class="token string">&#39;*.ntp.org.cn&#39;</span>
  <span class="token punctuation">-</span> +.pool.ntp.org
  <span class="token punctuation">-</span> time1.cloud.tencent.com
  <span class="token punctuation">-</span> music.163.com
  <span class="token punctuation">-</span> <span class="token string">&#39;*.music.163.com&#39;</span>
  <span class="token punctuation">-</span> <span class="token string">&#39;*.126.net&#39;</span>
  <span class="token punctuation">-</span> musicapi.taihe.com
  <span class="token punctuation">-</span> music.taihe.com
  <span class="token punctuation">-</span> songsearch.kugou.com
  <span class="token punctuation">-</span> trackercdn.kugou.com
  <span class="token punctuation">-</span> <span class="token string">&#39;*.kuwo.cn&#39;</span>
  <span class="token punctuation">-</span> api<span class="token punctuation">-</span>jooxtt.sanook.com
  <span class="token punctuation">-</span> api.joox.com
  <span class="token punctuation">-</span> joox.com
  <span class="token punctuation">-</span> y.qq.com
  <span class="token punctuation">-</span> <span class="token string">&#39;*.y.qq.com&#39;</span>
  <span class="token punctuation">-</span> streamoc.music.tc.qq.com
  <span class="token punctuation">-</span> mobileoc.music.tc.qq.com
  <span class="token punctuation">-</span> isure.stream.qqmusic.qq.com
  <span class="token punctuation">-</span> dl.stream.qqmusic.qq.com
  <span class="token punctuation">-</span> aqqmusic.tc.qq.com
  <span class="token punctuation">-</span> amobile.music.tc.qq.com
  <span class="token punctuation">-</span> <span class="token string">&#39;*.xiami.com&#39;</span>
  <span class="token punctuation">-</span> <span class="token string">&#39;*.music.migu.cn&#39;</span>
  <span class="token punctuation">-</span> music.migu.cn
  <span class="token punctuation">-</span> +.msftconnecttest.com
  <span class="token punctuation">-</span> +.msftncsi.com
  <span class="token punctuation">-</span> msftconnecttest.com
  <span class="token punctuation">-</span> msftncsi.com
  <span class="token punctuation">-</span> localhost.ptlogin2.qq.com
  <span class="token punctuation">-</span> localhost.sec.qq.com
  <span class="token punctuation">-</span> +.srv.nintendo.net
  <span class="token punctuation">-</span> +.stun.playstation.net
  <span class="token punctuation">-</span> xbox.<span class="token important">*.microsoft.com</span>
  <span class="token punctuation">-</span> xnotify.xboxlive.com
  <span class="token punctuation">-</span> +.ipv6.microsoft.com
  <span class="token punctuation">-</span> +.battlenet.com.cn
  <span class="token punctuation">-</span> +.wotgame.cn
  <span class="token punctuation">-</span> +.wggames.cn
  <span class="token punctuation">-</span> +.wowsgame.cn
  <span class="token punctuation">-</span> +.wargaming.net
  <span class="token punctuation">-</span> proxy.golang.org
  <span class="token punctuation">-</span> stun.<span class="token important">*.*</span>
  <span class="token punctuation">-</span> stun.<span class="token important">*.*.*</span>
  <span class="token punctuation">-</span> +.stun.<span class="token important">*.*</span>
  <span class="token punctuation">-</span> +.stun.<span class="token important">*.*.*</span>
  <span class="token punctuation">-</span> +.stun.<span class="token important">*.*.*.*</span>
  <span class="token punctuation">-</span> heartbeat.belkin.com
  <span class="token punctuation">-</span> <span class="token string">&#39;*.linksys.com&#39;</span>
  <span class="token punctuation">-</span> <span class="token string">&#39;*.linksyssmartwifi.com&#39;</span>
  <span class="token punctuation">-</span> <span class="token string">&#39;*.router.asus.com&#39;</span>
  <span class="token punctuation">-</span> mesu.apple.com
  <span class="token punctuation">-</span> swscan.apple.com
  <span class="token punctuation">-</span> swquery.apple.com
  <span class="token punctuation">-</span> swdownload.apple.com
  <span class="token punctuation">-</span> swcdn.apple.com
  <span class="token punctuation">-</span> swdist.apple.com
  <span class="token punctuation">-</span> lens.l.google.com
  <span class="token punctuation">-</span> stun.l.google.com
  <span class="token punctuation">-</span> <span class="token string">&#39;*.square-enix.com&#39;</span>
  <span class="token punctuation">-</span> <span class="token string">&#39;*.finalfantasyxiv.com&#39;</span>
  <span class="token punctuation">-</span> <span class="token string">&#39;*.ffxiv.com&#39;</span>
  <span class="token punctuation">-</span> <span class="token string">&#39;*.ff14.sdo.com&#39;</span>
  <span class="token punctuation">-</span> ff.dorado.sdo.com
  <span class="token punctuation">-</span> <span class="token string">&#39;*.mcdn.bilivideo.cn&#39;</span>
  <span class="token punctuation">-</span> +.media.dssott.com
  <span class="token punctuation">-</span> +.pvp.net
  <span class="token key atrule">nameserver</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> tls<span class="token punctuation">:</span>//223.5.5.5<span class="token punctuation">:</span><span class="token number">853</span>
  <span class="token punctuation">-</span> tls<span class="token punctuation">:</span>//223.6.6.6<span class="token punctuation">:</span><span class="token number">853</span>
  <span class="token punctuation">-</span> https<span class="token punctuation">:</span>//doh.pub/dns<span class="token punctuation">-</span>query
  <span class="token punctuation">-</span> https<span class="token punctuation">:</span>//dns.alidns.com/dns<span class="token punctuation">-</span>query
  <span class="token key atrule">use-system-hosts</span><span class="token punctuation">:</span> <span class="token boolean important">false</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="dns解析流程" tabindex="-1"><a class="header-anchor" href="#dns解析流程" aria-hidden="true">#</a> DNS解析流程</h2><p>以下是两种常见的 DNS 配置：</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">dns</span><span class="token punctuation">:</span>
  <span class="token punctuation">...</span>
  <span class="token key atrule">ipv6</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
  <span class="token key atrule">enhanced-mode</span><span class="token punctuation">:</span> redir<span class="token punctuation">-</span>host / fake<span class="token punctuation">-</span>ip
  <span class="token key atrule">fake-ip-range</span><span class="token punctuation">:</span> 28.0.0.1/8
  <span class="token key atrule">fake-ip-filter</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> <span class="token string">&#39;*&#39;</span>
    <span class="token punctuation">-</span> <span class="token string">&#39;+.lan&#39;</span>
  <span class="token key atrule">nameserver</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> https<span class="token punctuation">:</span>//doh.pub/dns<span class="token punctuation">-</span>query
  <span class="token key atrule">fallback</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> https<span class="token punctuation">:</span>//8.8.8.8/dns<span class="token punctuation">-</span>query
  <span class="token key atrule">nameserver-policy</span><span class="token punctuation">:</span>
    <span class="token key atrule">&quot;geosite:cn,private&quot;</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> https<span class="token punctuation">:</span>//doh.pub/dns<span class="token punctuation">-</span>query
      <span class="token punctuation">-</span> https<span class="token punctuation">:</span>//dns.alidns.com/dns<span class="token punctuation">-</span>query
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>此流程图为了更直观和简单地说明 Clash.Meta 的 DNS 工作流程，忽略了 Clash 内部的 DNS 映射处理。</p>`,28);function l(u,d){const n=c("Mermaid");return a(),e("div",null,[o,t(n,{id:"mermaid-104",code:"eJx9kkEvA0EUx+8+xRxJbPoNXDQVl0Zw2zisNdLG1sp2EckeRIoGpUKCarpBhBBaUqot+mU6s9tv4c281S4Vp915897v/d/7z7xhruoJzbLJdHSAkCkbflX2eMmzNe++zA4O/ZeaX67xp40ZoigjxFo2qMr26p3NnH+TYdmzGagSQXlLomZKSy4GCSxbYW6j3dhnrsvyOa+Q+aNkfOJ3NoRIKBeSkSrTHWR1S7zzqt8qYa4TjU9BNpSLTDionfWC39omo4aWTogA8W+ueCmPDED/z243r7z8VsCepCnTpgERb3gxx3Yu2NltmMrqr6zZ8O53QRbfv5b6RzU9gdMCZi5pKQkzbUdi2gIdn1CiSYvqNuHFO3b40X57cEA3SiCLWoqmqbVCLWXJNJL6GgE6d6/98iURSwxx8TcgjFH75y226vUYxgFQcTCaEAobwkXI/jybZzuuQwCnssoWNhY7L2SkR8e3wluUCueeud8Y/nzRXaZD4jG1N1BkXjOMWU1fECPBM0O43FY8JqtF16Dl5wkAoIVgQxjh3vsReziVrnrNI14q4g7UQfkZCud2H4JQfV4FWyJhH/v8EkxR12cW3PXFglHRFalGCkM1A1/OZKGr"})])}const r=s(i,[["render",l],["__file","9.Rule.html.vue"]]);export{r as default};
