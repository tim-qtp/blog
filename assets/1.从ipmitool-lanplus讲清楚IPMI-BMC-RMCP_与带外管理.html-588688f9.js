import{_ as e,W as i,X as n,a2 as a}from"./framework-6a3aa88c.js";const d={},s=a(`<h1 id="从-ipmitool-i-lanplus-讲清楚-ipmi、bmc、rmcp-与带外管理" tabindex="-1"><a class="header-anchor" href="#从-ipmitool-i-lanplus-讲清楚-ipmi、bmc、rmcp-与带外管理" aria-hidden="true">#</a> 从 <code>ipmitool -I lanplus</code> 讲清楚 IPMI、BMC、RMCP+ 与带外管理</h1><p>在服务器运维中，经常会看到这样的命令：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>ipmitool <span class="token parameter variable">-I</span> lanplus <span class="token parameter variable">-H</span> <span class="token number">192.168</span>.1.100 <span class="token parameter variable">-U</span> admin <span class="token parameter variable">-P</span> password power status
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>对于刚接触服务器带外管理的人来说，这条命令里往往会有几个疑问：</p><ul><li><code>lanplus</code> 到底是什么意思？</li><li>IPMI 2.0、RMCP+ 又是什么？</li><li><code>ipmitool</code> 是装在被管理服务器上的吗？</li><li>为什么连接的是 BMC，而不是服务器本身？</li><li>BMC IP 和服务器操作系统 IP 有什么区别？</li></ul><p>本文从最基础的概念开始，把这条链路完整讲清楚。</p><hr><h2 id="_1-先用一句话理解整个过程" tabindex="-1"><a class="header-anchor" href="#_1-先用一句话理解整个过程" aria-hidden="true">#</a> 1. 先用一句话理解整个过程</h2><p>可以先记住：</p><blockquote><p><code>ipmitool</code> 是“发命令的人”，BMC 是“服务器内部负责接收带外管理命令的小电脑”，<code>lanplus</code> 是两者通过网络通信时使用的一种接口模式。</p></blockquote><p>完整链路可以理解为：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>ipmitool
   ↓
-I lanplus
   ↓
IPMI 2.0
   ↓
RMCP+
   ↓
UDP/IP 网络
   ↓
BMC
   ↓
服务器硬件
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="_2-lanplus-是什么" tabindex="-1"><a class="header-anchor" href="#_2-lanplus-是什么" aria-hidden="true">#</a> 2. <code>lanplus</code> 是什么？</h2><p><code>lanplus</code> 并不是一个严格意义上的英文缩写，而是 <code>ipmitool</code> 对一种网络接口模式的命名。</p><p>可以简单理解为：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>LAN + Plus
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>也就是：</p><blockquote><p>比传统 <code>lan</code> 模式更完整、更安全的 LAN 网络通信方式。</p></blockquote><p>在 <code>ipmitool</code> 中，常见的远程接口主要有：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token parameter variable">-I</span> lan
<span class="token parameter variable">-I</span> lanplus
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>可以做一个简单对比：</p><table><thead><tr><th>接口</th><th>常见对应</th><th>通信方式</th><th>特点</th></tr></thead><tbody><tr><td><code>lan</code></td><td>IPMI 1.5</td><td>RMCP</td><td>较老</td></tr><tr><td><code>lanplus</code></td><td>IPMI 2.0</td><td>RMCP+</td><td>支持更完整的认证、完整性校验和加密能力</td></tr></tbody></table><p>因此，在现代服务器远程带外管理中，通常更常见的是：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token parameter variable">-I</span> lanplus
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><hr><h2 id="_3-ipmi-是什么" tabindex="-1"><a class="header-anchor" href="#_3-ipmi-是什么" aria-hidden="true">#</a> 3. IPMI 是什么？</h2><p>IPMI 全称：</p><p><strong>Intelligent Platform Management Interface</strong></p><p>中文通常翻译为：</p><p><strong>智能平台管理接口</strong></p><p>它是一套服务器硬件管理规范。</p><p>IPMI 关注的不是 Linux、Windows 中的业务应用，而是服务器本身的硬件状态和控制能力，例如：</p><ul><li>电源状态</li><li>开机</li><li>关机</li><li>重启</li><li>CPU 温度</li><li>主板温度</li><li>风扇转速</li><li>电源模块状态</li><li>电压</li><li>硬件传感器</li><li>系统事件日志</li></ul><p>例如：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>ipmitool power status
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>用于查询服务器电源状态。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>ipmitool power on
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>用于开机。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>ipmitool power off
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>用于关机。</p><hr><h2 id="_4-rmcp-是什么" tabindex="-1"><a class="header-anchor" href="#_4-rmcp-是什么" aria-hidden="true">#</a> 4. RMCP 是什么？</h2><p>RMCP 全称：</p><p><strong>Remote Management Control Protocol</strong></p><p>可以理解为：</p><p><strong>远程管理控制协议</strong></p><p>它是一种比较轻量的网络管理协议，用于让管理端通过网络和服务器的管理控制器通信。</p><p>传统 IPMI 1.5 的网络通信可以简单理解为：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>IPMI
 ↓
RMCP
 ↓
UDP
 ↓
IP 网络
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>IPMI 远程管理常见使用：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>UDP 623
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>一个非常简单的通信过程可能是：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>运维服务器
    │
    │ RMCP / IPMI
    ↓
   BMC
    │
    ├── 查询温度
    ├── 查询风扇
    ├── 查询电源
    └── 控制开关机
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="_5-rmcp-又是什么" tabindex="-1"><a class="header-anchor" href="#_5-rmcp-又是什么" aria-hidden="true">#</a> 5. RMCP+ 又是什么？</h2><p>RMCP+ 可以理解为 RMCP 的增强版本。</p><p>其中的 <code>+</code> 就是 “Plus” 的意思。</p><p>通常可以这样记：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>IPMI 1.5  → RMCP

IPMI 2.0  → RMCP+
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>相比早期 RMCP，RMCP+ 增加了更完善的安全机制，包括：</p><ul><li>身份认证</li><li>会话管理</li><li>数据完整性校验</li><li>加密保护</li><li>密钥协商</li></ul><p>因此，当我们执行：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>ipmitool <span class="token parameter variable">-I</span> lanplus <span class="token punctuation">\\</span>
  <span class="token parameter variable">-H</span> <span class="token number">192.168</span>.1.100 <span class="token punctuation">\\</span>
  <span class="token parameter variable">-U</span> admin <span class="token punctuation">\\</span>
  <span class="token parameter variable">-P</span> password <span class="token punctuation">\\</span>
  power status
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>它并不是简单地把用户名、密码和命令直接裸发给 BMC。</p><p>实际过程可以粗略理解为：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>① 找到 BMC
   ↓
② 建立 RMCP+ 会话
   ↓
③ 双方进行身份认证
   ↓
④ 协商会话参数
   ↓
⑤ 建立受保护的 Session
   ↓
⑥ 发送 IPMI 命令
   ↓
⑦ BMC 返回执行结果
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="_6-rakp-是什么" tabindex="-1"><a class="header-anchor" href="#_6-rakp-是什么" aria-hidden="true">#</a> 6. RAKP 是什么？</h2><p>在 IPMI 2.0 的 RMCP+ 会话建立过程中，还会涉及一个重要机制：</p><p><strong>RAKP</strong></p><p>全称：</p><p><strong>Remote Authenticated Key-Exchange Protocol</strong></p><p>简单理解就是：</p><blockquote><p>用于客户端和 BMC 之间完成身份认证和会话密钥协商的一套机制。</p></blockquote><p>对于普通运维人员来说，不需要一开始就深入密码学细节。</p><p>只需要先建立下面这个认识：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>RMCP+
=
网络通信
+
身份认证
+
Session 会话管理
+
完整性保护
+
可选加密
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这也是为什么 <code>lanplus</code> 一般比传统 <code>lan</code> 更适合现代远程服务器管理。</p><hr><h1 id="_7-bmc-到底是什么" tabindex="-1"><a class="header-anchor" href="#_7-bmc-到底是什么" aria-hidden="true">#</a> 7. BMC 到底是什么？</h1><p>BMC 全称：</p><p><strong>Baseboard Management Controller</strong></p><p>中文通常称为：</p><p><strong>基板管理控制器</strong></p><p>它可以理解为：</p><blockquote><p>服务器内部独立存在的一台“小电脑”。</p></blockquote><p>一台服务器实际上可以粗略理解为拥有两套相对独立的系统：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>┌─────────────────────────────┐
│         物理服务器           │
│                             │
│  ┌───────────────────────┐  │
│  │ Linux / Windows       │  │
│  │                       │  │
│  │ 运行业务程序           │  │
│  │ Nginx / Java / DB     │  │
│  └───────────────────────┘  │
│                             │
│  ┌───────────────────────┐  │
│  │ BMC                   │  │
│  │                       │  │
│  │ 独立管理控制器         │  │
│  │ 管理服务器硬件         │  │
│  └───────────────────────┘  │
│                             │
└─────────────────────────────┘
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>BMC 通常拥有自己的：</p><ul><li>处理器</li><li>内存</li><li>固件</li><li>网络接口</li><li>IP 地址</li><li>用户体系</li></ul><p>因此，即使服务器上的 Linux 已经死机，BMC 仍然可能正常工作。</p><hr><h1 id="_8-服务器操作系统-ip-和-bmc-ip-是两回事" tabindex="-1"><a class="header-anchor" href="#_8-服务器操作系统-ip-和-bmc-ip-是两回事" aria-hidden="true">#</a> 8. 服务器操作系统 IP 和 BMC IP 是两回事</h1><p>这是理解带外管理最重要的一点。</p><p>假设有一台服务器。</p><p>操作系统的业务 IP 是：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>10.0.0.20
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>BMC 的管理 IP 是：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>192.168.1.100
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>这两个 IP 可以完全不同。</p><p>例如：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>业务网络

Linux
10.0.0.20
   │
   └── Web / Java / MySQL / Kubernetes
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>而另外一边：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>带外管理网络

BMC
192.168.1.100
   │
   └── IPMI / Redfish / 远程电源控制
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>所以：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token parameter variable">-H</span> <span class="token number">192.168</span>.1.100
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>通常指定的是：</p><blockquote><p><strong>BMC 的 IP 地址</strong></p></blockquote><p>而不是 Linux 或 Windows 的 IP。</p><hr><h1 id="_9-ipmitool-到底装在哪里" tabindex="-1"><a class="header-anchor" href="#_9-ipmitool-到底装在哪里" aria-hidden="true">#</a> 9. <code>ipmitool</code> 到底装在哪里？</h1><p>答案是：</p><blockquote><p>不一定安装在被管理服务器上。</p></blockquote><p>在实际远程带外管理场景中，通常会安装在一台统一的运维服务器或管理节点上。</p><p>例如：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>运维服务器
192.168.1.10
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>安装：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>ipmitool
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>然后管理多台服务器：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>                         ┌── BMC-01
                         │   192.168.1.101
                         │
运维服务器 + ipmitool ───┼── BMC-02
                         │   192.168.1.102
                         │
                         └── BMC-03
                             192.168.1.103
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>也就是说：</p><blockquote><p>不需要在几十台被管理服务器上分别安装 <code>ipmitool</code>。</p></blockquote><p>只需要管理端能够访问这些 BMC IP 即可。</p><hr><h1 id="_10-一条-ipmitool-i-lanplus-命令到底发生了什么" tabindex="-1"><a class="header-anchor" href="#_10-一条-ipmitool-i-lanplus-命令到底发生了什么" aria-hidden="true">#</a> 10. 一条 <code>ipmitool -I lanplus</code> 命令到底发生了什么？</h1><p>例如：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>ipmitool <span class="token parameter variable">-I</span> lanplus <span class="token punctuation">\\</span>
  <span class="token parameter variable">-H</span> <span class="token number">192.168</span>.1.100 <span class="token punctuation">\\</span>
  <span class="token parameter variable">-U</span> admin <span class="token punctuation">\\</span>
  <span class="token parameter variable">-P</span> password <span class="token punctuation">\\</span>
  power status
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以拆成：</p><table><thead><tr><th>参数</th><th>含义</th></tr></thead><tbody><tr><td><code>ipmitool</code></td><td>IPMI 命令行客户端</td></tr><tr><td><code>-I</code></td><td>指定 Interface，也就是通信接口</td></tr><tr><td><code>lanplus</code></td><td>使用 IPMI 2.0 / RMCP+ 网络模式</td></tr><tr><td><code>-H</code></td><td>BMC 的 Host/IP</td></tr><tr><td><code>-U</code></td><td>BMC 用户名</td></tr><tr><td><code>-P</code></td><td>BMC 密码</td></tr><tr><td><code>power status</code></td><td>查询物理服务器电源状态</td></tr></tbody></table><p>整个通信链路是：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>运维服务器
192.168.1.10

    │
    │ ipmitool
    │
    │ IPMI 2.0
    │ RMCP+
    │ UDP/IP
    ↓

BMC
192.168.1.100

    │
    │ 查询主板电源状态
    ↓

服务器硬件
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h1 id="_11-为什么不直接-ssh-到服务器" tabindex="-1"><a class="header-anchor" href="#_11-为什么不直接-ssh-到服务器" aria-hidden="true">#</a> 11. 为什么不直接 SSH 到服务器？</h1><p>因为 SSH 和 IPMI 管理的层级不同。</p><p>SSH 管的是：</p><blockquote><p>操作系统</p></blockquote><p>IPMI / BMC 管的是：</p><blockquote><p>物理服务器硬件</p></blockquote><p>比如 Linux 已经死机：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>Linux
  ↓
SSH ×
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这时候可能已经无法登录：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">ssh</span> root@10.0.0.20
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>但是 BMC 可能仍然正常：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>BMC
192.168.1.100
   ↓
正常
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>于是仍然可以通过：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>ipmitool <span class="token parameter variable">-I</span> lanplus <span class="token punctuation">\\</span>
  <span class="token parameter variable">-H</span> <span class="token number">192.168</span>.1.100 <span class="token punctuation">\\</span>
  <span class="token parameter variable">-U</span> admin <span class="token punctuation">\\</span>
  <span class="token parameter variable">-P</span> password <span class="token punctuation">\\</span>
  power reset
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>直接对物理服务器执行重启。</p><p>所以可以这样记：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>SSH
=
管理操作系统
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>而：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>IPMI / BMC
=
管理服务器硬件
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h1 id="_12-什么叫-带外管理" tabindex="-1"><a class="header-anchor" href="#_12-什么叫-带外管理" aria-hidden="true">#</a> 12. 什么叫“带外管理”？</h1><p>“带外管理”英文通常叫：</p><p><strong>Out-of-Band Management</strong></p><p>它的核心思想是：</p><blockquote><p>使用一条独立于服务器业务系统的管理通道来管理服务器。</p></blockquote><p>正常业务链路可能是：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>用户
 ↓
业务网
 ↓
Linux
 ↓
应用程序
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>带外管理链路则是：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>运维人员
 ↓
管理网
 ↓
BMC
 ↓
服务器硬件
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>即使：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>Linux 崩溃
业务网络异常
应用程序挂掉
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>只要：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>BMC 正常
管理网络正常
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>运维人员通常仍然可以执行：</p><ul><li>查询硬件状态</li><li>开机</li><li>关机</li><li>强制重启</li><li>查看传感器</li><li>查看系统事件日志</li></ul><p>这就是带外管理最大的价值。</p><hr><h1 id="_13-i-open-和-i-lanplus-有什么区别" tabindex="-1"><a class="header-anchor" href="#_13-i-open-和-i-lanplus-有什么区别" aria-hidden="true">#</a> 13. <code>-I open</code> 和 <code>-I lanplus</code> 有什么区别？</h1><p>如果 <code>ipmitool</code> 就安装在被管理服务器自己的 Linux 系统里，还可以通过本机 IPMI 驱动访问 BMC。</p><p>例如：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>ipmitool <span class="token parameter variable">-I</span> <span class="token function">open</span> sensor
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>可以理解为：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>Linux
 │
 │ 本机 IPMI 内核驱动
 ↓
BMC
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这种方式属于：</p><blockquote><p>本地访问 BMC</p></blockquote><p>而：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>ipmitool <span class="token parameter variable">-I</span> lanplus <span class="token punctuation">..</span>.
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>则是：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>远程运维服务器
 │
 │ 网络
 │ IPMI 2.0 / RMCP+
 ↓
BMC
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这种方式属于：</p><blockquote><p>远程网络访问 BMC</p></blockquote><p>简单对比：</p><table><thead><tr><th>模式</th><th>使用场景</th></tr></thead><tbody><tr><td><code>-I open</code></td><td>本机通过 IPMI 驱动访问本机 BMC</td></tr><tr><td><code>-I lanplus</code></td><td>通过网络远程访问另一台服务器的 BMC</td></tr></tbody></table><hr><h1 id="_14-放到真实运维平台里是什么架构" tabindex="-1"><a class="header-anchor" href="#_14-放到真实运维平台里是什么架构" aria-hidden="true">#</a> 14. 放到真实运维平台里是什么架构？</h1><p>如果要开发一个“物理服务器带外纳管平台”，一种比较典型的架构是：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>┌────────────────────────┐
│        Web 前端         │
│                        │
│ 服务器列表 / 电源控制   │
└───────────┬────────────┘
            │
            ↓
┌────────────────────────┐
│       后端服务          │
│                        │
│ Go / Java 等            │
└───────────┬────────────┘
            │
            ↓
┌────────────────────────┐
│      IPMI 管理层        │
│                        │
│ ipmitool / IPMI SDK     │
└───────────┬────────────┘
            │
            │ IPMI 2.0 / RMCP+
            │
      ┌─────┼─────┐
      ↓     ↓     ↓
    BMC01 BMC02 BMC03
      │     │     │
      ↓     ↓     ↓
   服务器1 服务器2 服务器3
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>后端平台可以统一管理：</p><ul><li>BMC IP</li><li>用户名</li><li>凭据</li><li>服务器资产信息</li><li>电源状态</li><li>温度</li><li>风扇</li><li>电源模块</li><li>传感器</li><li>SEL 事件日志</li></ul><p>然后再在 Web 页面中统一展示。</p><hr><h1 id="_15-ipmi-和-redfish-的关系" tabindex="-1"><a class="header-anchor" href="#_15-ipmi-和-redfish-的关系" aria-hidden="true">#</a> 15. IPMI 和 Redfish 的关系</h1><p>现在的服务器带外管理中，经常还会看到：</p><p><strong>Redfish</strong></p><p>可以先简单理解：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>IPMI
= 比较传统的服务器硬件管理标准
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>而：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>Redfish
= 更现代、REST API 化的服务器管理标准
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>例如 IPMI 可能使用：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>ipmitool
RMCP+
UDP 623
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Redfish 则通常使用：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>HTTPS
REST API
JSON
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>因此现代带外管理平台经常会采用：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>优先 Redfish
    ↓
不支持时
    ↓
兼容 IPMI
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这样可以兼顾新旧服务器。</p><hr><h1 id="_16-最后总结" tabindex="-1"><a class="header-anchor" href="#_16-最后总结" aria-hidden="true">#</a> 16. 最后总结</h1><p>理解 <code>ipmitool -I lanplus</code>，最关键的是建立下面几个概念。</p><h3 id="第一-ipmitool" tabindex="-1"><a class="header-anchor" href="#第一-ipmitool" aria-hidden="true">#</a> 第一：<code>ipmitool</code></h3><p>它是一个 IPMI 客户端工具，用来发送服务器硬件管理命令。</p><h3 id="第二-lanplus" tabindex="-1"><a class="header-anchor" href="#第二-lanplus" aria-hidden="true">#</a> 第二：<code>lanplus</code></h3><p>它是 <code>ipmitool</code> 的一种网络接口模式，通常对应：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>IPMI 2.0 + RMCP+
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="第三-bmc" tabindex="-1"><a class="header-anchor" href="#第三-bmc" aria-hidden="true">#</a> 第三：BMC</h3><p>BMC 是服务器内部独立的管理控制器，相当于服务器里的“小电脑”。</p><h3 id="第四-bmc-ip-服务器-os-ip" tabindex="-1"><a class="header-anchor" href="#第四-bmc-ip-服务器-os-ip" aria-hidden="true">#</a> 第四：BMC IP ≠ 服务器 OS IP</h3><p>例如：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>Linux IP：
10.0.0.20

BMC IP：
192.168.1.100
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>它们属于两套不同的管理体系。</p><h3 id="第五-ssh-和-ipmi-管理的不是一层" tabindex="-1"><a class="header-anchor" href="#第五-ssh-和-ipmi-管理的不是一层" aria-hidden="true">#</a> 第五：SSH 和 IPMI 管理的不是一层</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>SSH
→ 管操作系统
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>IPMI / BMC
→ 管服务器硬件
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="第六-为什么带外管理重要" tabindex="-1"><a class="header-anchor" href="#第六-为什么带外管理重要" aria-hidden="true">#</a> 第六：为什么带外管理重要？</h3><p>因为即使：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>Linux 已经死机
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>只要：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>BMC 还正常
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>运维人员仍然有机会远程执行：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>开机
关机
重启
查看硬件状态
查看温度
查看风扇
查看硬件告警
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>因此可以把整个知识体系最后浓缩成一条链路：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>运维平台
   ↓
ipmitool
   ↓
lanplus
   ↓
IPMI 2.0
   ↓
RMCP+
   ↓
BMC
   ↓
物理服务器硬件
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>理解了这条链路，IPMI、BMC、RMCP+、带外管理以及后续的 Redfish 就基本串起来了。</p>`,235),l=[s];function r(t,v){return i(),n("div",null,l)}const u=e(d,[["render",r],["__file","1.从ipmitool-lanplus讲清楚IPMI-BMC-RMCP_与带外管理.html.vue"]]);export{u as default};
