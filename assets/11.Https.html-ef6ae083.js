import{_ as e,W as l,X as i,a2 as t}from"./framework-48328e23.js";const p={},o=t('<p>HTTP 是明文传输协议，HTTPS 协议是由 SSL+HTTP 协议构建的可进行加密传输、身份认证的网络协议，比 HTTP 协议安全</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503310029479.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><ul><li><p>Client发起一个HTTPS的请求</p></li><li><p>Server把事先配置好的公钥证书返回给客户端。</p></li><li><p>Client验证公钥证书：比如是否在有效期内，证书的用途是不是匹配Client请求的站点，是不是在CRL吊销列表里面，它的上一级证书是否有效，这是一个递归的过程，直到验证到根证书（操作系统内置的Root证书或者Client内置的Root证书），如果验证通过则继续，不通过则显示警告信息。</p></li><li><p>Client使用伪随机数生成器生成加密所使用的对称密钥，然后用证书的公钥加密这个对称密钥，发给Server。</p></li><li><p>Server使用自己的私钥解密这个消息，得到对称密钥。至此，Client和Server双方都持有了相同的对称密钥。</p><blockquote><p>如果客户端不使用私钥，则会发生，服务端拿到的是加密的内容，但是发送给客户端时，就会是明文了</p></blockquote></li><li><p>Server使用对称密钥加密明文内容A，发送给Client。</p></li><li><p>Client使用对称密钥解密响应的密文，得到明文内容A。</p></li><li><p>Client再次发起HTTPS的请求，使用对称密钥加密请求的明文内容B，然后Server使用对称密钥解密密文，得到明文内容B。</p></li></ul><h4 id="数字证书" tabindex="-1"><a class="header-anchor" href="#数字证书" aria-hidden="true">#</a> 数字证书</h4><p>有几个问题：</p><ol><li>怎么能保证收到的公钥是网站还是中间人的？</li><li>我们如何相信&quot;数字证书&quot;就是由信任的CA颁发的呢？</li><li>怎么一会儿公钥加密，一会儿私钥加密呢？</li></ol><blockquote><p>公钥加密---&gt;私钥解密：加密后，只能是拥有私钥的人才能解密，因此用来加密信息就很好</p><p>私钥加密---&gt;公钥解密（<mark>私钥签名，公钥验签</mark>）：只能是拥有私钥的人才能加密，但理论上谁都能解密</p></blockquote><p>用顶层的私钥给下层的证书签名，验证的时候，用顶层的公钥，来验证下层的签名。</p>',8),r=[o];function a(n,c){return l(),i("div",null,r)}const _=e(p,[["render",a],["__file","11.Https.html.vue"]]);export{_ as default};
