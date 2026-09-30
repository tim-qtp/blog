---
order: 13
title: "第十一课：Service 名称与集群 DNS"
category:
  - 综合运维
  - 容器与编排
  - k8s
---
# 第十一课：Service 名称与集群 DNS

## 一、本课只解决一个问题

上一课已经让商城前台 Service 找到了两个 Pod：

```text
Service qingyun-mall-web
       ↓
两个商城前台 Pod
```

但如果商品接口要访问商城前台，它应该把请求发到哪里？

直接使用 Pod IP 不可靠，因为 Pod 重建后 IP 可能变化。使用 Service 的 ClusterIP 虽然稳定，但人和程序都不应该到处硬编码一串 IP。

Kubernetes 给每个 Service 提供了一个可以解析的名称。本课要亲手验证：

```text
http://qingyun-mall-web
```

核心目标只有一句话：

> 集群内的应用通常通过 Service 名称互相访问，而不是记住 Pod IP 或 ClusterIP。

## 二、先用生活场景理解 DNS

我们给同事打电话时，通常在通讯录里点名字，而不是背手机号：

```text
人能记住：张三
通讯录保存：张三 → 138...
```

DNS 做的事情很相似：

```text
程序使用：qingyun-mall-web
DNS 解析：qingyun-mall-web → Service ClusterIP
```

DNS 只负责把名称翻译成地址。请求被 Service 转发到哪个 Pod，仍然是 Service 和它的后端地址在负责。

完整链路是：

```text
集群内客户端
    ↓ 访问 http://qingyun-mall-web
集群 DNS 把名称解析成 Service ClusterIP
    ↓
Service
    ↓
某个商城前台 Pod
```

## 三、创建商城前台

进入项目目录：

```bash
cd /Users/qintianpeng/2026/code/k8s
```

创建 Deployment 和 Service：

```bash
kubectl apply -f labs/09-Service与DNS/01-商城前台.yaml
```

这个 YAML 文件里用 `---` 分隔了两个 Kubernetes 对象：

```text
第一个对象：Deployment qingyun-mall-web
第二个对象：Service qingyun-mall-web
```

Deployment 和 Service 可以同名，因为它们的资源类型不同。

等待商城前台可用：

```bash
kubectl rollout status deployment/qingyun-mall-web
```

查看资源：

```bash
kubectl get deployment,pod,service -l app=qingyun-mall -o wide
```

## 四、先观察 Service 的 ClusterIP

执行：

```bash
kubectl get service qingyun-mall-web
```

结果类似：

```text
NAME               TYPE        CLUSTER-IP      PORT(S)
qingyun-mall-web   ClusterIP   10.96.123.45    80/TCP
```

这里的 `10.96.123.45` 只是示例。你的集群很可能是另一个地址。

我们不会记住或复制这个 IP，因为接下来要使用 Service 名称访问。

## 五、为什么不能直接在 Mac 终端测试名称

`qingyun-mall-web` 是 Kubernetes 集群内部的服务名称。Mac 自己使用的普通 DNS 通常不认识它。

所以不要直接在 Mac 终端执行：

```bash
curl http://qingyun-mall-web
```

我们要先创建一个位于集群内部的临时客户端 Pod，再从这个 Pod 发起请求。

这也更接近真实业务：

```text
商品接口 Pod → 商城前台 Service
订单接口 Pod → 商品接口 Service
```

## 六、创建集群内调试客户端

执行：

```bash
kubectl apply -f labs/09-Service与DNS/02-集群内客户端.yaml
```

等待客户端 Pod 就绪：

```bash
kubectl wait --for=condition=Ready pod/mall-debug-client --timeout=60s
```

查看它：

```bash
kubectl get pod mall-debug-client
```

这个 Pod 使用 BusyBox 镜像，并持续休眠。它不是青云商城的正式业务组件，只是我们放进集群里的排障工具箱。

## 七、第一次通过 Service 名称访问

执行：

```bash
kubectl exec mall-debug-client -- wget -qO- http://qingyun-mall-web
```

逐段解释：

```text
kubectl exec mall-debug-client
进入 mall-debug-client 容器执行命令

--
表示后面的内容是容器内要执行的命令

wget -qO-
发送 HTTP 请求，并把响应正文打印到终端

http://qingyun-mall-web
通过 Service 名称访问商城前台
```

如果看到 Nginx 欢迎页的 HTML，说明请求成功：

```text
mall-debug-client
       ↓ 名称解析
qingyun-mall-web Service
       ↓ 转发
商城前台 Pod
       ↓
返回 Nginx 页面
```

注意，我们没有使用：

- Pod IP；
- Service ClusterIP；
- `port-forward`；
- Mac 浏览器。

这是一次真正发生在集群内部的服务间访问。

## 八、单独观察 DNS 解析

刚才短名称 HTTP 请求成功，已经证明 `qingyun-mall-web` 可以在集群内使用。

现在使用 Service 的完整集群域名，只观察“名称变地址”这一步：

```bash
kubectl exec mall-debug-client -- \
  nslookup qingyun-mall-web.default.svc.cluster.local
```

结果通常包含：

```text
Name:      qingyun-mall-web.default.svc.cluster.local
Address:   10.96.x.x
```

这里使用完整名称，是为了让 BusyBox 的 `nslookup` 输出更干净。个别版本用短名称查询时，会在成功解析后继续尝试其他域名后缀并打印额外的 `NXDOMAIN`，容易干扰判断；这不是 Service 不可用。

这个地址应当与下面命令看到的 Service ClusterIP 一致：

```bash
kubectl get service qingyun-mall-web
```

因此可以得到：

```text
qingyun-mall-web.default.svc.cluster.local
       ↓ DNS
Service ClusterIP
```

DNS 并没有直接返回某个 Pod IP。它首先把名称解析到 Service 的稳定地址。

## 九、亲手制造一次名称错误

故意访问一个不存在的 Service：

```bash
kubectl exec mall-debug-client -- \
  nslookup qingyun-mall-api.default.svc.cluster.local
```

这里的 `qingyun-mall-api` 没有被创建，所以会看到找不到名称一类的错误。

再执行正确名称：

```bash
kubectl exec mall-debug-client -- \
  nslookup qingyun-mall-web.default.svc.cluster.local
```

两次结果的区别说明：

```text
Service 名称必须准确
DNS 不会根据相似名称猜测你想访问谁
```

## 十、认识 Service 的完整 DNS 名称

我们目前的资源都位于 `default` Namespace。Service 的完整集群域名通常是：

```text
qingyun-mall-web.default.svc.cluster.local
```

暂时只需把它拆成四段：

```text
qingyun-mall-web   Service 名称
default            Namespace 名称
svc                表示 Service
cluster.local      当前集群的默认域名后缀
```

在同一个 Namespace 中，通常只写短名称即可：

```text
qingyun-mall-web
```

也可以验证完整名称：

```bash
kubectl exec mall-debug-client -- \
  nslookup qingyun-mall-web.default.svc.cluster.local
```

然后访问：

```bash
kubectl exec mall-debug-client -- \
  wget -qO- http://qingyun-mall-web.default.svc.cluster.local
```

Namespace 后续会单独讲。本课先知道：短名称适合同一 Namespace，完整名称明确写出了 Service 所在位置。

## 十一、DNS 成功不等于 HTTP 一定成功

必须分清两件事：

```text
DNS 成功：名称能够找到 Service 地址
HTTP 成功：请求最终到达正常工作的后端 Pod
```

可能出现这种情况：

```text
nslookup qingyun-mall-web.default.svc.cluster.local 成功
但是 wget http://qingyun-mall-web 失败
```

这时 DNS 大概率不是主要问题，应继续检查：

```bash
kubectl describe service qingyun-mall-web
kubectl get pods -l 'app=qingyun-mall,tier=frontend'
```

重点确认：

- Service 有没有后端地址；
- Pod 是否 Ready；
- Service 的 `port` 和 `targetPort` 是否正确；
- 容器是否真的监听目标端口。

## 十二、DNS 排障的最短路径

以后在集群内通过名称访问失败，可以按顺序检查：

```text
1. Service 是否真的存在？
   kubectl get service

2. 名称能否解析？
   nslookup Service名称.Namespace名称.svc.cluster.local

3. Service 是否有后端？
   kubectl describe service Service名称

4. 能否发出真实 HTTP 请求？
   wget -qO- http://Service名称
```

判断方式：

```text
名称解析失败
→ 优先检查 Service 名、Namespace 和集群 DNS

名称解析成功，但 HTTP 失败
→ 优先检查 Service 后端、端口和应用状态
```

## 十三、清理实验

删除调试客户端：

```bash
kubectl delete -f labs/09-Service与DNS/02-集群内客户端.yaml
```

删除商城前台：

```bash
kubectl delete -f labs/09-Service与DNS/01-商城前台.yaml
```

确认清理结果：

```bash
kubectl get deployment,pod,service -l app=qingyun-mall
```

Pod 可能短暂处于 `Terminating`，稍后再次查看即可。

## 十四、问题与直接回答

### 为什么应用不应该直接访问 Pod IP？

Pod 可能因为重建、升级或迁移而更换 IP。Service 名称提供稳定入口。

### Service 名称最终解析成什么？

对于普通 ClusterIP Service，通常解析为 Service 的 ClusterIP。

### 为什么 Mac 浏览器不能直接打开 `http://qingyun-mall-web`？

这个名称由 Kubernetes 集群内部 DNS 管理，Mac 的普通 DNS 通常不知道它。

### 同一个 Namespace 中要写完整域名吗？

通常不用，直接使用 Service 短名称即可。

### `nslookup` 成功，是否代表应用一定能访问成功？

不代表。它只证明名称解析成功，还要继续验证 Service 后端、端口和应用状态。

### Service 重建后 ClusterIP 发生变化怎么办？

只要调用方一直使用 Service 名称，DNS 会解析到当前地址，业务代码不需要跟着修改 IP。

## 本课只记住五句话

1. Pod IP 会变化，集群内应用不要依赖 Pod IP。
2. 应用通常通过 Service 名称互相访问。
3. 集群 DNS 把 Service 名称解析为 Service 地址。
4. 同一 Namespace 内通常可以直接使用 Service 短名称。
5. DNS 成功和 HTTP 成功是两层不同的检查。

## 下一课预告

下一课学习 Namespace。我们会把青云商城的开发环境和测试环境放进不同 Namespace，观察“名称相同但互不冲突”是怎么实现的。
