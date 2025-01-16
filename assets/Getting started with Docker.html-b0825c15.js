import{_ as t,W as c,X as n,$ as e,a0 as a,Z as r,a1 as o,C as p}from"./framework-4e10303a.js";const l={},g=o('<h2 id="_1-初识docker" tabindex="-1"><a class="header-anchor" href="#_1-初识docker" aria-hidden="true">#</a> 1.初识Docker</h2><h3 id="_1-1-什么是docker" tabindex="-1"><a class="header-anchor" href="#_1-1-什么是docker" aria-hidden="true">#</a> 1.1.什么是Docker</h3><p>微服务虽然具备各种各样的优势，但服务的拆分通用给部署带来了很大的麻烦。</p><ul><li>分布式系统中，依赖的组件非常多，不同组件之间部署时往往会产生一些冲突。</li><li>在数百上千台服务中重复部署，环境不一定一致，会遇到各种问题</li></ul><h4 id="_1-1-1-应用部署的环境问题" tabindex="-1"><a class="header-anchor" href="#_1-1-1-应用部署的环境问题" aria-hidden="true">#</a> 1.1.1.应用部署的环境问题</h4><p>大型项目组件较多，运行环境也较为复杂，部署时会碰到一些问题：</p><ul><li><p>依赖关系复杂，容易出现兼容性问题</p></li><li><p>开发、测试、生产环境有差异</p></li></ul><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/f27a16e4ca7ea60aadcf6626b62afd4e.png" alt="image-20210731141907366" tabindex="0" loading="lazy"><figcaption>image-20210731141907366</figcaption></figure><p>例如一个项目中，部署时需要依赖于node.js、Redis、RabbitMQ、MySQL等，这些服务部署时所需要的函数库、依赖项各不相同，甚至会有冲突。给部署带来了极大的困难。</p><h4 id="_1-1-2-docker解决依赖兼容问题" tabindex="-1"><a class="header-anchor" href="#_1-1-2-docker解决依赖兼容问题" aria-hidden="true">#</a> 1.1.2.Docker解决依赖兼容问题</h4><p>而Docker确巧妙的解决了这些问题，Docker是如何实现的呢？</p><p>Docker为了解决依赖的兼容问题的，采用了两个手段：</p><ul><li><p>将应用的Libs（函数库）、Deps（依赖）、配置与应用一起打包</p></li><li><p>将每个应用放到一个==隔离<strong>容器</strong>==去运行，避免互相干扰</p></li></ul><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/a0435b9fdd7b7ce100d5070b49981e02.png" alt="image-20210731142219735" tabindex="0" loading="lazy"><figcaption>image-20210731142219735</figcaption></figure><p>这样打包好的应用包中，既包含应用本身，也保护应用所需要的Libs、Deps，无需再操作系统上安装这些，自然就不存在不同应用之间的兼容问题了。</p><p>虽然解决了不同应用的兼容问题，但是开发、测试等环境会存在差异，操作系统版本也会有差异，怎么解决这些问题呢？</p><h4 id="_1-1-3-docker解决操作系统环境差异" tabindex="-1"><a class="header-anchor" href="#_1-1-3-docker解决操作系统环境差异" aria-hidden="true">#</a> 1.1.3.Docker解决操作系统环境差异</h4><p>要解决不同操作系统环境差异问题，必须先了解操作系统结构。以一个Ubuntu操作系统为例，结构如下：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20210731143401460.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>结构包括：</p><ul><li>计算机硬件：例如CPU、内存、磁盘等</li><li>系统内核：所有Linux发行版的内核都是Linux，例如CentOS、Ubuntu、Fedora等。内核可以与计算机硬件交互，对外提供<strong>内核指令</strong>，用于操作计算机硬件。</li><li>系统应用：操作系统本身提供的应用、函数库。这些函数库是对内核指令的封装，使用更加方便。</li></ul><p>应用于计算机交互的流程如下：</p><p>1）应用调用操作系统应用（函数库），实现各种功能</p><p>2）系统函数库是对内核指令集的封装，会调用内核指令</p><p>3）内核指令操作计算机硬件</p><p>Ubuntu和CentOS都是基于Linux内核，无非是系统应用不同，提供的函数库有差异：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20210731144304990.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>此时，如果将一个Ubuntu版本的MySQL应用安装到CentOS系统，MySQL在调用Ubuntu函数库时，会发现找不到或者不匹配，就会报错了：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20210731144458680.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>Docker如何解决不同系统环境的问题？</p><ul><li>Docker将用户程序与所需要调用的系统(比如Ubuntu)函数库一起打包</li><li>Docker运行到不同操作系统时，直接基于打包的函数库，借助于操作系统的Linux内核来运行</li></ul><p>如图：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20210731144820638.png" alt="image-20210731144820638" tabindex="0" loading="lazy"><figcaption>image-20210731144820638</figcaption></figure><h4 id="_1-1-4-小结" tabindex="-1"><a class="header-anchor" href="#_1-1-4-小结" aria-hidden="true">#</a> 1.1.4.小结</h4><p>Docker如何解决大型项目依赖关系复杂，不同组件依赖的兼容性问题？</p><ul><li>Docker允许开发中将应用、依赖、函数库、配置一起<strong>打包</strong>，形成可移植镜像</li><li>Docker应用运行在容器中，使用沙箱机制，相互<strong>隔离</strong></li></ul><p>Docker如何解决开发、测试、生产环境有差异的问题？</p><ul><li>Docker镜像中包含完整运行环境，包括系统函数库，仅依赖系统的Linux内核，因此可以在任意Linux操作系统上运行</li></ul><p>Docker是一个快速交付应用、运行应用的技术，具备下列优势：</p><ul><li>可以将程序及其依赖、运行环境一起打包为一个镜像，可以迁移到<mark>任意Linux</mark>操作系统</li><li>运行时利用沙箱机制形成隔离容器，各个应用互不干扰</li><li>启动、移除都可以通过一行命令完成，方便快捷</li></ul><h3 id="_1-2-docker和虚拟机的区别" tabindex="-1"><a class="header-anchor" href="#_1-2-docker和虚拟机的区别" aria-hidden="true">#</a> 1.2.Docker和虚拟机的区别</h3><p>Docker可以让一个应用在任何操作系统中非常方便的运行。而以前我们接触的虚拟机，也能在一个操作系统中，运行另外一个操作系统，保护系统中的任何应用。</p><p>两者有什么差异呢？</p><p><strong>虚拟机</strong>（virtual machine）是在操作系统中<strong>模拟</strong>硬件设备，然后运行另一个操作系统，比如在 Windows 系统里面运行 Ubuntu 系统，这样就可以运行任意的Ubuntu应用了。</p><p><strong>Docker</strong>仅仅是封装函数库，并没有模拟完整的操作系统，如图：</p><p>虚拟机：相当于在一个大的厨房里，举行厨王争霸赛，分别给每位选手配备小厨房，每个小厨房又有着和大厨房相同的厨具、灶台、以及食材，但是每个选手是做不同的菜啊，一堆没用的东西不就浪费了嘛。</p><p>Docker：相当于<strong>只</strong>给每位选手配备<mark>需要的食材</mark>，锅碗瓢盆啥也没有，共用一个灶台。</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/d7c61127a4da1dcb1e4899825b1a3f22.png" alt="image-20210731145914960" tabindex="0" loading="lazy"><figcaption>image-20210731145914960</figcaption></figure><p>对比来看：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/bf5344df52a1b145085ec7cbc97ae70d.png" alt="image-20210731152243765" tabindex="0" loading="lazy"><figcaption>image-20210731152243765</figcaption></figure><p>小结：</p><p>Docker和虚拟机的差异：</p><ul><li><p>docker是一个系统进程；虚拟机是在操作系统中的操作系统</p></li><li><p>docker体积小、启动速度快、性能好；虚拟机体积大、启动速度慢、性能一般</p></li></ul><h3 id="_1-3-docker架构" tabindex="-1"><a class="header-anchor" href="#_1-3-docker架构" aria-hidden="true">#</a> 1.3.Docker架构</h3><h4 id="_1-3-1-镜像和容器" tabindex="-1"><a class="header-anchor" href="#_1-3-1-镜像和容器" aria-hidden="true">#</a> 1.3.1.镜像和容器</h4><p>Docker中有几个重要的概念：</p><p><strong>镜像（Image）</strong>：Docker将应用程序及其所需的依赖、函数库、环境、配置等文件打包在一起，称为镜像。</p><p><strong>容器（Container）</strong>：镜像中的应用程序运行后形成的进程就是<strong>容器</strong>，只是Docker会给容器进程做隔离，对外不可见。</p><p>一切应用最终都是代码组成，都是硬盘中的一个个的字节形成的<strong>文件</strong>。只有运行时，才会加载到内存，形成进程。</p><p>而<strong>镜像</strong>，就是把一个应用在硬盘上的文件、及其运行环境、部分系统函数库文件一起打包形成的文件包。这个文件包是<mark>只读</mark>的。</p><p><strong>容器</strong>呢，就是将这些文件中编写的程序、函数加载到内存中允许，形成进程，只不过要隔离起来。<mark>因此一个镜像可以启动多次，形成多个容器进程</mark>。</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/2f76f5cb4bacc540fd798c81feb9a941.png" alt="image-20210731153059464" tabindex="0" loading="lazy"><figcaption>image-20210731153059464</figcaption></figure><p>例如你下载了一个QQ，如果我们将QQ在磁盘上的运行<strong>文件</strong>及其运行的操作系统依赖打包，形成QQ镜像。然后你可以启动多次，双开、甚至三开QQ，跟多个妹子聊天。</p><h4 id="_1-3-2-dockerhub" tabindex="-1"><a class="header-anchor" href="#_1-3-2-dockerhub" aria-hidden="true">#</a> 1.3.2.DockerHub</h4><p>开源应用程序非常多，打包这些应用往往是重复的劳动。为了避免这些重复劳动，人们就会将自己打包的应用镜像，例如Redis、MySQL镜像放到网络上，共享使用，就像GitHub的代码共享一样。</p>',65),d=e("li",null,[e("p",null,"DockerHub：DockerHub是一个官方的Docker镜像的托管平台。这样的平台称为Docker Registry。")],-1),s={href:"https://c.163yun.com/hub",target:"_blank",rel:"noopener noreferrer"},h={href:"https://cr.console.aliyun.com/",target:"_blank",rel:"noopener noreferrer"},u=o('<p>我们一方面可以将自己的镜像共享到DockerHub，另一方面也可以从DockerHub拉取镜像：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/96b158b33f75917eb94c8348ab1a9604.png" alt="image-20210731153743354" tabindex="0" loading="lazy"><figcaption>image-20210731153743354</figcaption></figure><h4 id="_1-3-3-docker架构" tabindex="-1"><a class="header-anchor" href="#_1-3-3-docker架构" aria-hidden="true">#</a> 1.3.3.Docker架构</h4><p>我们要使用Docker来操作镜像、容器，就必须要安装Docker。</p><p>Docker是一个CS架构的程序，由两部分组成：</p><ul><li><p>服务端(server)：Docker守护进程，负责处理Docker指令，管理镜像、容器等</p></li><li><p>客户端(client)：通过命令或RestAPI向Docker服务端发送指令。可以在本地或远程向服务端发送指令。</p></li></ul><p>如图：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/f442e5b408ab82154abe2991c8619b31.png" alt="image-20210731154257653" tabindex="0" loading="lazy"><figcaption>image-20210731154257653</figcaption></figure><h4 id="_1-3-4-小结" tabindex="-1"><a class="header-anchor" href="#_1-3-4-小结" aria-hidden="true">#</a> 1.3.4.小结</h4><p>镜像：</p><ul><li>将应用程序及其依赖、环境、配置打包在一起</li></ul><p>容器：</p><ul><li>镜像运行起来就是容器，一个镜像可以运行多个容器</li></ul><p>Docker结构：</p><ul><li><p>服务端：接收命令或远程请求，操作镜像或容器</p></li><li><p>客户端：发送命令或者请求到Docker服务端</p></li></ul><p>DockerHub：</p><ul><li>一个镜像托管的服务器，类似的还有阿里云镜像服务，统称为DockerRegistry</li></ul>',17);function f(b,k){const i=p("ExternalLinkIcon");return c(),n("div",null,[g,e("ul",null,[d,e("li",null,[e("p",null,[a("国内也有类似于DockerHub 的公开服务，比如 "),e("a",s,[a("网易云镜像服务"),r(i)]),a("、"),e("a",h,[a("阿里云镜像库"),r(i)]),a("等。")])])]),u])}const _=t(l,[["render",f],["__file","Getting started with Docker.html.vue"]]);export{_ as default};