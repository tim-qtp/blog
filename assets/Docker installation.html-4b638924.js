import{_ as t,W as c,X as r,$ as n,a0 as e,Z as a,a2 as i,C as o}from"./framework-6a3aa88c.js";const l={},d=n("p",null,"Docker 分为 CE 和 EE 两大版本。CE 即社区版（免费，支持周期 7 个月），EE 即企业版，强调安全，付费使用，支持周期 24 个月。",-1),p=n("p",null,[e("Docker CE 分为 "),n("code",null,"stable"),e(),n("code",null,"test"),e(" 和 "),n("code",null,"nightly"),e(" 三个更新频道。")],-1),u={href:"https://docs.docker.com/install/",target:"_blank",rel:"noopener noreferrer"},v=i(`<h2 id="_1-centos安装docker" tabindex="-1"><a class="header-anchor" href="#_1-centos安装docker" aria-hidden="true">#</a> 1.CentOS安装Docker</h2><p>Docker CE 支持 64 位版本 CentOS 7，并且要求内核版本不低于 3.10， CentOS 7 满足最低内核的要求，所以我们在CentOS 7安装Docker。</p><h3 id="_1-1-卸载-可选" tabindex="-1"><a class="header-anchor" href="#_1-1-卸载-可选" aria-hidden="true">#</a> 1.1.卸载（可选）</h3><p>如果之前安装过旧版本的Docker，可以使用下面命令卸载：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>yum remove docker \\
                  docker-client \\
                  docker-client-latest \\
                  docker-common \\
                  docker-latest \\
                  docker-latest-logrotate \\
                  docker-logrotate \\
                  docker-selinux \\
                  docker-engine-selinux \\
                  docker-engine \\
                  docker-ce
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-2-安装docker" tabindex="-1"><a class="header-anchor" href="#_1-2-安装docker" aria-hidden="true">#</a> 1.2.安装docker</h3><p>首先需要大家虚拟机联网，安装yum工具</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>yum <span class="token function">install</span> <span class="token parameter variable">-y</span> yum-utils <span class="token punctuation">\\</span>
           device-mapper-persistent-data <span class="token punctuation">\\</span>
           lvm2 --skip-broken
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后更新本地镜像源：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 设置docker镜像源</span>
yum-config-manager <span class="token punctuation">\\</span>
    --add-repo <span class="token punctuation">\\</span>
    https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
    
<span class="token function">sed</span> <span class="token parameter variable">-i</span> <span class="token string">&#39;s/download.docker.com/mirrors.aliyun.com\\/docker-ce/g&#39;</span> /etc/yum.repos.d/docker-ce.repo

yum makecache fast
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后输入命令：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>yum <span class="token function">install</span> <span class="token parameter variable">-y</span> docker-ce
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>docker-ce为社区免费版本。稍等片刻，docker即可安装成功。</p><h3 id="_1-3-启动docker" tabindex="-1"><a class="header-anchor" href="#_1-3-启动docker" aria-hidden="true">#</a> 1.3.启动docker</h3><p>Docker应用需要用到各种端口，逐一去修改防火墙设置。非常麻烦，因此建议大家直接关闭防火墙！</p><p>启动docker前，一定要关闭防火墙后！！</p><p>启动docker前，一定要关闭防火墙后！！</p><p>启动docker前，一定要关闭防火墙后！！</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 关闭</span>
systemctl stop firewalld
<span class="token comment"># 禁止开机启动防火墙</span>
systemctl disable firewalld
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>通过命令启动docker：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>systemctl start <span class="token function">docker</span>  <span class="token comment"># 启动docker服务</span>

systemctl stop <span class="token function">docker</span>  <span class="token comment"># 停止docker服务</span>

systemctl restart <span class="token function">docker</span>  <span class="token comment"># 重启docker服务</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后输入命令，可以查看docker版本：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>docker -v
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>如图：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/a86f7306f4e4f18392d6707dde9bb92a.png" alt="image-20210418154704436" tabindex="0" loading="lazy"><figcaption>image-20210418154704436</figcaption></figure><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>systemstl status docker
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/74f887efd46039a6b5f227fb0208ab18.png" alt="image-20230612113657485" tabindex="0" loading="lazy"><figcaption>image-20230612113657485</figcaption></figure><h3 id="_1-4-配置镜像加速" tabindex="-1"><a class="header-anchor" href="#_1-4-配置镜像加速" aria-hidden="true">#</a> 1.4.配置镜像加速</h3><p>docker官方镜像仓库网速较差，我们需要设置国内镜像服务：</p>`,29),m={href:"https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors",target:"_blank",rel:"noopener noreferrer"},k=i(`<div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">sudo</span> <span class="token function">mkdir</span> <span class="token parameter variable">-p</span> /etc/docker
<span class="token function">sudo</span> <span class="token function">tee</span> /etc/docker/daemon.json <span class="token operator">&lt;&lt;-</span><span class="token string">EOF
{
    &quot;registry-mirrors&quot;: [
        &quot;https://hub.geekery.cn&quot;,
        &quot;https://hub.littlediary.cn&quot;,
        &quot;https://mirrors.sohu.com&quot;, 
        &quot;https://docker.unsee.tech&quot;,
        &quot;https://docker.m.daocloud.io&quot;,
        &quot;https://hub.crdz.gq&quot;,
        &quot;https://docker.nastool.de&quot;,
        &quot;https://hub.firefly.store&quot;,
        &quot;https://registry.dockermirror.com&quot;,
        &quot;https://docker.1panelproxy.com&quot;,
        &quot;https://hub.rat.dev&quot;,
        &quot;https://docker.udayun.com&quot;,
        &quot;https://docker.kejilion.pro&quot;,
        &quot;https://dhub.kubesre.xyz&quot;,
        &quot;https://docker.1panel.live&quot;,
        &quot;https://dockerpull.org&quot;
    ]
}
EOF</span>
<span class="token function">sudo</span> systemctl daemon-reload
<span class="token function">sudo</span> systemctl restart <span class="token function">docker</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_2-centos7安装dockercompose" tabindex="-1"><a class="header-anchor" href="#_2-centos7安装dockercompose" aria-hidden="true">#</a> 2.CentOS7安装DockerCompose</h2><h3 id="_2-1-下载" tabindex="-1"><a class="header-anchor" href="#_2-1-下载" aria-hidden="true">#</a> 2.1.下载</h3><p>Linux下需要通过命令下载：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 安装</span>
<span class="token function">curl</span> <span class="token parameter variable">-L</span> https://github.com/docker/compose/releases/download/1.23.1/docker-compose-<span class="token variable"><span class="token variable">\`</span><span class="token function">uname</span> <span class="token parameter variable">-s</span><span class="token variable">\`</span></span>-<span class="token variable"><span class="token variable">\`</span><span class="token function">uname</span> <span class="token parameter variable">-m</span><span class="token variable">\`</span></span> <span class="token operator">&gt;</span> /usr/local/bin/docker-compose
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>如果下载速度较慢，或者下载失败，可以使用资料的docker-compose文件：</p><figure><img src="https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/3fc8ccb6a2eb5fca9bc3b85fb00c6b8b.png" alt="image-20210417133020614" tabindex="0" loading="lazy"><figcaption>image-20210417133020614</figcaption></figure><p>上传到<code>/usr/local/bin/</code>目录也可以。</p><p>我这里放一个下载链接，是我的腾讯云存储桶：</p>`,9),b={href:"https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog-bigfile/docker-compose",target:"_blank",rel:"noopener noreferrer"},h=i(`<h3 id="_2-2-修改文件权限" tabindex="-1"><a class="header-anchor" href="#_2-2-修改文件权限" aria-hidden="true">#</a> 2.2.修改文件权限</h3><p>修改文件权限：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 修改权限</span>
<span class="token function">chmod</span> +x /usr/local/bin/docker-compose
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-3-base自动补全命令" tabindex="-1"><a class="header-anchor" href="#_2-3-base自动补全命令" aria-hidden="true">#</a> 2.3.Base自动补全命令：</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 补全命令</span>
<span class="token function">curl</span> <span class="token parameter variable">-L</span> https://raw.githubusercontent.com/docker/compose/1.29.1/contrib/completion/bash/docker-compose <span class="token operator">&gt;</span> /etc/bash_completion.d/docker-compose
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>如果这里出现错误，需要修改自己的hosts文件：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token builtin class-name">echo</span> <span class="token string">&quot;199.232.68.133 raw.githubusercontent.com&quot;</span> <span class="token operator">&gt;&gt;</span> /etc/hosts
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="_3-docker镜像仓库" tabindex="-1"><a class="header-anchor" href="#_3-docker镜像仓库" aria-hidden="true">#</a> 3.Docker镜像仓库</h2><p>搭建镜像仓库可以基于Docker官方提供的DockerRegistry来实现。</p>`,9),g={href:"https://hub.docker.com/_/registry",target:"_blank",rel:"noopener noreferrer"},f=i(`<h3 id="_3-1-简化版镜像仓库" tabindex="-1"><a class="header-anchor" href="#_3-1-简化版镜像仓库" aria-hidden="true">#</a> 3.1.简化版镜像仓库</h3><p>Docker官方的Docker Registry是一个基础版本的Docker镜像仓库，具备仓库管理的完整功能，但是没有图形化界面。</p><p>搭建方式比较简单，命令如下：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token punctuation">\\</span>
    <span class="token parameter variable">--restart</span><span class="token operator">=</span>always <span class="token punctuation">\\</span>
    <span class="token parameter variable">--name</span> registry	<span class="token punctuation">\\</span>
    <span class="token parameter variable">-p</span> <span class="token number">5000</span>:5000 <span class="token punctuation">\\</span>
    <span class="token parameter variable">-v</span> registry-data:/var/lib/registry <span class="token punctuation">\\</span>
    registry
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>命令中挂载了一个数据卷registry-data到容器内的/var/lib/registry 目录，这是私有镜像库存放数据的目录。</p>`,5),_={href:"http://YourIp:5000/v2/_catalog",target:"_blank",rel:"noopener noreferrer"},y=i(`<h3 id="_3-2-带有图形化界面版本" tabindex="-1"><a class="header-anchor" href="#_3-2-带有图形化界面版本" aria-hidden="true">#</a> 3.2.带有图形化界面版本</h3><p>使用DockerCompose部署带有图象界面的DockerRegistry，命令如下：</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">version</span><span class="token punctuation">:</span> <span class="token string">&#39;3.0&#39;</span>
<span class="token key atrule">services</span><span class="token punctuation">:</span>
  <span class="token key atrule">registry</span><span class="token punctuation">:</span>
    <span class="token key atrule">image</span><span class="token punctuation">:</span> registry
    <span class="token key atrule">volumes</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> ./registry<span class="token punctuation">-</span>data<span class="token punctuation">:</span>/var/lib/registry
  <span class="token key atrule">ui</span><span class="token punctuation">:</span>
    <span class="token key atrule">image</span><span class="token punctuation">:</span> joxit/docker<span class="token punctuation">-</span>registry<span class="token punctuation">-</span>ui<span class="token punctuation">:</span>static
    <span class="token key atrule">ports</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> 8080<span class="token punctuation">:</span><span class="token number">80</span>
    <span class="token key atrule">environment</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> REGISTRY_TITLE=传智教育私有仓库
      <span class="token punctuation">-</span> REGISTRY_URL=http<span class="token punctuation">:</span>//registry<span class="token punctuation">:</span><span class="token number">5000</span>
    <span class="token key atrule">depends_on</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> registry
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>权限不够的执行一下：chmod +x /usr/local/bin/docker-compose</p><h3 id="_3-3-配置docker信任地址" tabindex="-1"><a class="header-anchor" href="#_3-3-配置docker信任地址" aria-hidden="true">#</a> 3.3.配置Docker信任地址</h3><p>我们的私服采用的是http协议，默认不被Docker信任，所以需要做一个配置：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 打开要修改的文件</span>
<span class="token function">vi</span> /etc/docker/daemon.json
<span class="token comment"># 添加内容：</span>
<span class="token string">&quot;insecure-registries&quot;</span>:<span class="token punctuation">[</span><span class="token string">&quot;http://192.168.150.101:8080&quot;</span><span class="token punctuation">]</span>
<span class="token comment"># 重加载</span>
systemctl daemon-reload
<span class="token comment"># 重启docker</span>
systemctl restart <span class="token function">docker</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_4-docker的卸载" tabindex="-1"><a class="header-anchor" href="#_4-docker的卸载" aria-hidden="true">#</a> 4.Docker的卸载</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>systemctl stop <span class="token function">docker</span>
<span class="token function">sudo</span> yum remove docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin docker-ce-rootless-extras
<span class="token function">sudo</span> <span class="token function">rm</span> <span class="token parameter variable">-rf</span> /var/lib/docker
<span class="token function">sudo</span> <span class="token function">rm</span> <span class="token parameter variable">-rf</span> /var/lib/containerd
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,9);function x(q,D){const s=o("ExternalLinkIcon");return c(),r("div",null,[d,p,n("p",null,[e("官方网站上有各种环境下的 "),n("a",u,[e("安装指南"),a(s)]),e("，这里主要介绍 Docker CE 在 CentOS上的安装。")]),v,n("p",null,[e("参考阿里云的镜像加速文档："),n("a",m,[e("https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors"),a(s)])]),k,n("p",null,[n("a",b,[e("docker-compose"),a(s)])]),h,n("p",null,[e("官网地址："),n("a",g,[e("https://hub.docker.com/_/registry"),a(s)])]),f,n("p",null,[e("访问"),n("a",_,[e("http://YourIp:5000/v2/_catalog"),a(s)]),e(" 可以查看当前私有镜像服务中包含的镜像")]),y])}const C=t(l,[["render",x],["__file","Docker installation.html.vue"]]);export{C as default};
