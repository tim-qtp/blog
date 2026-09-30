---
order: 5
title: "5. Pod 生命周期与第一次故障排查"
category:
  - 综合运维
  - 容器与编排
  - k8s
---
# 第五课：Pod 生命周期与第一次故障排查

## 这节课只解决两个问题

1. Pod 从创建到运行，状态为什么会变化？
2. Pod 起不来时，第一步应该查什么？

我们会故意写错 Nginx 镜像版本，让 Kubernetes 无法下载镜像，然后沿证据找到原因。

## 一、先理解“生命周期”

生命周期就是一个 Pod 从被创建，到运行，再到结束所经历的过程。

正常 Pod 的简化过程：

```text
提交创建请求
    ↓
等待安排运行位置
    ↓
准备镜像和容器
    ↓
容器开始运行
    ↓
Pod 结束或被删除
```

使用 `kubectl get pod -w` 时，常见的显示变化是：

```text
Pending → ContainerCreating → Running
```

现在逐个解释。

## 二、`Pending`：已经创建，但还没运行起来

`Pending` 可以翻译为“等待中”。

它表示 Kubernetes 已经接受并创建了 Pod 对象，但 Pod 里的容器还没有全部运行起来。

等待原因可能不同，例如：

- 还在选择运行机器；
- 还在下载镜像；
- 没有足够 CPU 或内存；
- 需要的存储没有准备好。

所以看到 Pending 时，不能只凭这个单词猜原因，还要继续看 Events。

## 三、`ContainerCreating`：正在准备容器

`ContainerCreating` 可以理解为“正在创建容器”。

这个阶段可能正在：

- 下载镜像；
- 准备容器网络；
- 挂载需要的文件或存储；
- 创建容器。

持续几秒通常很正常。如果长时间不变化，再查看 Events 判断卡在哪一步。

## 四、`Running`：容器已经开始运行

`Running` 表示 Pod 已经被安排到一台机器，并且至少有一个容器处于运行或启动过程中。

上一课已经强调：

```text
Running 不等于网页一定正确
```

还要结合 `READY`、日志和实际请求判断应用是否可用。

## 五、先重新观察一次正常启动

进入课程目录：

```bash
cd /Users/qintianpeng/2026/code/k8s
```

创建正常 Nginx Pod：

```bash
kubectl apply -f labs/02-第一个应用/01-nginx-pod.yaml
```

持续观察：

```bash
kubectl get pod qingyun-mall-web-preview -w
```

可能看到：

```text
qingyun-mall-web-preview   0/1   ContainerCreating   0   1s
qingyun-mall-web-preview   1/1   Running             0   3s
```

如果镜像已经在电脑中，启动可能很快，不一定看得到每个中间状态。这不表示 Kubernetes 跳过了准备过程，只是终端没有及时显示瞬间状态。

看到 `Running` 后按 `Control + C`。

查看近期事件：

```bash
kubectl describe pod qingyun-mall-web-preview
```

滚到最下面的 `Events`，通常能看到：

```text
Scheduled → Pulled → Created → Started
```

白话解释：

```text
选择机器 → 准备镜像 → 创建容器 → 启动容器
```

## 六、制造一个错误镜像

本课的故障文件：`labs/04-Pod生命周期/01-错误镜像Pod.yaml`

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: qingyun-mall-web-image-error
spec:
  containers:
    - name: web
      image: nginx:lesson-version-does-not-exist
```

问题在这里：

```yaml
image: nginx:lesson-version-does-not-exist
```

冒号后面是镜像标签，可以先理解为镜像版本。这个标签是我们故意编造的，因此镜像仓库中不存在。

创建故障 Pod：

```bash
kubectl apply -f labs/04-Pod生命周期/01-错误镜像Pod.yaml
```

观察：

```bash
kubectl get pod qingyun-mall-web-image-error -w
```

可能依次看到：

```text
Pending
ErrImagePull
ImagePullBackOff
```

看到 `ImagePullBackOff` 后按 `Control + C`。

## 七、看懂 `ErrImagePull` 和 `ImagePullBackOff`

### ErrImagePull

可以直接理解为：

```text
拉取镜像失败
```

### ImagePullBackOff

它表示镜像拉取失败后，Kubernetes 不会无间隔疯狂重试，而是等待一段时间再试；多次失败后，等待时间会逐步增加。

`BackOff` 可以理解为“退避等待”。

```text
拉取失败
  ↓
稍等后重试
  ↓
仍然失败
  ↓
等待更久后再试
```

重要的是：如果镜像名称或标签本身就是错的，只等待不会解决问题。必须修正配置。

## 八、第一步：用 `get` 确认现象

执行：

```bash
kubectl get pod qingyun-mall-web-image-error
```

可能看到：

```text
NAME                  READY   STATUS             RESTARTS   AGE
qingyun-mall-web-image-error   0/1     ImagePullBackOff   0          ...
```

这一步告诉我们：

- Pod 对象存在；
- 容器没有就绪；
- 问题与拉取镜像有关。

但它还没有告诉我们究竟哪个镜像、为什么拉取失败。

## 九、第二步：用 `describe` 找原因

执行：

```bash
kubectl describe pod qingyun-mall-web-image-error
```

先找 `Containers` 部分，可以看到配置的镜像：

```text
Image: nginx:lesson-version-does-not-exist
```

再看底部 `Events`，通常能看到类似信息：

```text
Failed to pull image
not found
Back-off pulling image
```

至此证据链完整：

```text
现象：READY 0/1，STATUS ImagePullBackOff
    ↓
配置：镜像是 nginx:lesson-version-does-not-exist
    ↓
事件：Failed to pull image / not found
    ↓
结论：镜像标签不存在，容器无法启动
```

这就是排障的基本方式：不是看到错误名后猜测，而是继续查看事件中的具体原因。

## 十、为什么现在 `logs` 看不到应用日志

执行：

```bash
kubectl logs qingyun-mall-web-image-error
```

会得到类似提示：

```text
container ... is waiting to start: trying and failing to pull image
```

原因很简单：

```text
镜像没有下载成功
→ 容器没有创建成功
→ Nginx 程序从未启动
→ 自然没有 Nginx 运行日志
```

这也告诉我们，排障工具有使用顺序：

```text
容器还没启动：重点看 get 和 Events
容器已经启动：logs 才更可能提供应用线索
```

## 十一、一个容易混淆的细节

执行：

```bash
kubectl get pod qingyun-mall-web-image-error -o jsonpath='{.status.phase}{"\n"}'
```

输出很可能仍是：

```text
Pending
```

但普通 `kubectl get pod` 的 `STATUS` 列显示：

```text
ImagePullBackOff
```

这并不矛盾：

- Pod 的大阶段仍是 Pending，也就是容器还没全部启动；
- `STATUS` 列为了方便排障，展示了更具体的当前原因 `ImagePullBackOff`。

初学时可以这样理解：

```text
Pending：大的等待阶段
ImagePullBackOff：此刻为什么还在等待
```

## 十二、正确处理方式

真实工作中应该把镜像标签改成存在的版本，例如：

```yaml
image: nginx:1.27
```

但这一课已有正常 Pod，所以不修改故障文件。我们保留它，后面还可以重复练习故障排查。

## 十三、清理两个实验 Pod

先删除故障 Pod：

```bash
kubectl delete -f labs/04-Pod生命周期/01-错误镜像Pod.yaml
```

再删除正常 Pod：

```bash
kubectl delete -f labs/02-第一个应用/01-nginx-pod.yaml
```

确认它们都不存在：

```bash
kubectl get pod qingyun-mall-web-image-error
kubectl get pod qingyun-mall-web-preview
```

两条命令都返回 `NotFound`，表示清理完成。

## 十四、问题与直接回答

### Pending 表示一定没有机器可用吗？

不是。Pending 只表示 Pod 已创建，但容器还没有全部运行。镜像下载、资源、存储或调度都可能让它处于 Pending。

### ContainerCreating 持续几秒是不是故障？

通常不是。拉取镜像和准备容器需要时间。只有长时间不变化时，才需要结合 Events 判断。

### ImagePullBackOff 是什么？

镜像拉取失败，并且 Kubernetes 正在采用逐渐延长等待时间的方式重试。

### ImagePullBackOff 等久一点一定会好吗？

不一定。临时网络故障可能自行恢复，但镜像名、标签或仓库权限错误必须修正。

### 为什么故障 Pod 没有 Nginx 日志？

因为镜像都没有拉取成功，容器和 Nginx 程序从未真正启动。

### Pod 起不来时最先执行什么？

固定从下面两条开始：

```bash
kubectl get pod Pod名称
kubectl describe pod Pod名称
```

先确定现象，再从 Events 找具体原因。

## 本课只记住五句话

1. Pending 表示 Pod 已创建，但容器尚未全部运行。
2. ContainerCreating 表示正在准备镜像、网络和容器。
3. ImagePullBackOff 表示拉取镜像失败后正在退避重试。
4. Pod 起不来，先看 `get`，再看 `describe` 底部 Events。
5. 容器从未启动时没有应用日志，不能只盯着 `logs`。

## 下一课预告

下一课第一次接触 Deployment。你会亲手删除一个正在运行的 Pod，然后看到 Kubernetes 自动补回一个新的 Pod，从实操中真正理解第一课提到的“持续纠偏”。
