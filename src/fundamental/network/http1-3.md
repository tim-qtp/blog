---
order: 1
author: 
title: "Http1.0~3.0分别有什么区别？"
category:
  - HTTP
  - 计网
---

### 1、1.0 和1.1 有什么区别？

- HTTP/1.0 为短连接，每次请求都需要建⽴⼀个**昂贵的**TCP连接。HTTP/1.1 支持长连接。⼀个TCP连接上可以传送多个HTTP请求和响应，默认开启 `Connection:Keep-Alive`

- 增加pipline管道，无需等待前面的请求响应，即可发送第二次请求，但是响应必须按照请求发出的顺序返回，存在队头阻塞问题。所以后面2.0从浏览器中就移除了。`所以现在浏览器一般是与服务器建立多个TCP连接`

  ![目前浏览器的TCP连接方式](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241219150225816.png)

- 增加Host字段，可以区分一台服务器的不同端口号web服务

- 状态码也多了

- 请求头中引入了range，允许只传送资源的某个部分

- 除了get，set以外，增加了 PUT、DELETE、OPTIONS、PATCH 等新的⽅法

### 2、那2.0呢？

每个文件分成多个帧，放在同一个stream流里面，然后三个文件可以进行传输，对方接收到后，按照流ID进行重组，这样就可以一个TCP连接内同时发送多个资源，但还是顺序的！所以有对头阻塞的情况。

![image-20241219170535718](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241219170535718.png)

- 使用二进制帧，进行数据传输，1.1 则使用文本格式的报文。二进制帧更加紧凑和高效，减少了传输的数据量和带宽消耗。
- 多路复用，移除了pipline，支持一个TCP发起多个请求，但是每个**stream流**彼此独立，不需要按顺序发送或接收。`但还是有阻塞问题！`
- header压缩，之前header内含很多信息，每次连接都要发送，现在压缩了存储，并且双方都缓存，⼀份header字段表。既可以避免重复header传输，⼜减⼩了需要传输的⼤⼩。
- 支持服务端主动push推送

### 3、那3.0呢？

在目前移动端的普及下的新协议，以前从一个网络切换到另一个网络（Wifi->4G、5G）很慢，现在QUIC实现了一个称为连接ID的概念

![2.0痛点](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241219152622123.png)

这个过程会增加网络延迟和资源消耗。在传输数据阶段，虽然在应用层多个请求可以同时发送，但是TCP协议要求数据必须按照顺序串行传输，一起过独木桥。

![image-20241219153133834](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241219153133834.png)

如果其中一个数据包丢失，后续的数据包就要等待重传或者等待前面的数据包传输完成后才能发送。队头阻塞的问题并没有彻底解决。

但是TCP协议僵化，被广泛的内置于操作系统内核，中间件固件以及硬件实现当中，改进的话老旧都要兼容，难以升级。

所以谷歌在UDP的基础上，研究出了QUIC协议。

![建立连接更快](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241219154755123.png)

速度快，低延迟。以前需要3个RTT，现在 0-RTT 或者 1-RTT。

同样也更安全，HTTP 2可以使用TLS加密（HTTPS）。但加密并非强制要求。HTTP三默认使用QUIC自带的TLS1.3加密。安全性更高，且加密是强制的。

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20241219171318249.png)

每个Stream就是一个文件，一个Connection就是一个TCP连接。

但是QUIC一个连接上的多个stram之间相互独立，没有依赖，假如其中一个stram丢包了，也只会影响该stream的处理，这就解决了对头阻塞的问题。

- **头部压缩**：HTTP/2.0 使用 `HPACK` 算法进行头部压缩，而 HTTP/3.0 使用更高效的 `QPACK` 头压缩算法。
- 安全性高
- 建立连接快
- 无对头阻塞
- 连接迁移，5G-WIFI，改为了64位唯一ID
- 避免了协议僵化


