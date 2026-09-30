---
order: 6
title: "第四课：Pod 和容器到底是什么关系"
category:
  - 综合运维
  - 容器与编排
  - k8s
---
# 第四课：Pod 和容器到底是什么关系

## 这节课只解决一个问题

上一课的结构是：

```text
Pod
└── Nginx 容器
```

因为里面只有一个容器，很容易误以为 Pod 只是容器换了一个名字。

这一课创建一个含两个容器的 Pod，亲眼确认：

```text
Pod 是外层运行单元
容器是里面真正运行程序的地方
```

## 一、先用合租房理解

可以暂时把 Pod 想成一套合租房：

```text
Pod：一套房
├── web 容器：住户 A，运行 Nginx
└── helper 容器：住户 B，运行辅助命令
```

两个容器：

- 被 Kubernetes 一起安排到同一台机器；
- 共用 Pod 的网络地址；
- 可以通过 `localhost` 互相访问；
- 但仍是两个独立容器，各自有镜像和启动命令。

这个比喻只帮助入门。Pod 不是虚拟机，也不是一个完整操作系统。

## 二、看懂这次的实验文件

实验文件：`labs/03-Pod与容器/01-双容器Pod.yaml`

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: qingyun-mall-web-with-helper
spec:
  containers:
    - name: web
      image: nginx:1.27
      ports:
        - containerPort: 80
    - name: helper
      image: busybox:1.36
      command: ["sh", "-c", "sleep 3600"]
```

重点看 `containers` 下面有两个短横线：

```text
containers
├── 第 1 项：web 容器，运行 Nginx
└── 第 2 项：helper 容器，持续 sleep
```

`helper` 使用 BusyBox 镜像。BusyBox 是一个很小的 Linux 工具箱，适合运行简单的查看和网络命令。

`sleep 3600` 的作用只是让 helper 容器保持运行一小时，不要刚启动就退出。

## 三、创建双容器 Pod

进入课程目录：

```bash
cd /Users/qintianpeng/2026/code/k8s
```

执行：

```bash
kubectl apply -f labs/03-Pod与容器/01-双容器Pod.yaml
```

持续观察：

```bash
kubectl get pod qingyun-mall-web-with-helper -w
```

最终应看到：

```text
NAME            READY   STATUS    RESTARTS   AGE
qingyun-mall-web-with-helper   2/2     Running   0          ...
```

看到 `2/2 Running` 后，按 `Control + C`。

上一课是 `1/1`，这一课是 `2/2`：

```text
READY 2/2
      │ │
      │ └── Pod 中一共 2 个容器需要就绪
      └──── 目前 2 个容器已经就绪
```

所以 `READY` 不是 Pod 数量，而是这个 Pod 内的容器就绪数量。

## 四、查看 Pod 中有哪些容器

执行：

```bash
kubectl get pod qingyun-mall-web-with-helper -o jsonpath='{.spec.containers[*].name}{"\n"}'
```

输出：

```text
web helper
```

现在不用学习 JSONPath 语法。只把这条命令当成“从 Pod 配置中取出所有容器名称”。

关系已经很清楚：

```text
qingyun-mall-web-with-helper
├── web
└── helper
```

## 五、分别进入两个容器

`kubectl exec` 表示进入正在运行的容器执行一条命令。

先进入 web 容器查看 Nginx 版本：

```bash
kubectl exec qingyun-mall-web-with-helper -c web -- nginx -v
```

拆开理解：

```text
kubectl exec       在容器中执行命令
qingyun-mall-web-with-helper      Pod 名
-c web             选择名为 web 的容器
--                 后面开始是容器内要执行的命令
nginx -v           查看 Nginx 版本
```

再进入 helper 容器执行命令：

```bash
kubectl exec qingyun-mall-web-with-helper -c helper -- uname -a
```

同一个 Pod 中有两个容器，所以需要用 `-c` 明确选择容器。

## 六、证明两个容器共用 Pod 网络

Nginx 在 web 容器中监听 80 端口。现在从 helper 容器访问：

```bash
kubectl exec qingyun-mall-web-with-helper -c helper -- wget -qO- http://127.0.0.1
```

如果输出 Nginx 欢迎页面，说明 helper 容器能够通过 `127.0.0.1` 访问 web 容器中的 Nginx。

`127.0.0.1` 也叫 `localhost`，表示“当前这套网络环境里的本机”。

如果两个普通 Docker 容器各自拥有独立网络，容器 A 的 `127.0.0.1` 通常只指向容器 A 自己。但同一个 Pod 内的容器共享网络，所以：

```text
helper 容器访问 127.0.0.1:80
                 ↓
同一个 Pod 网络中的 Nginx
```

这是 Pod 存在的重要意义之一：把需要紧密协作的容器放在同一个网络单元中。

## 七、查看 Pod IP

执行：

```bash
kubectl get pod qingyun-mall-web-with-helper -o wide
```

输出中只有一个 `IP` 列，而不是为 web 和 helper 各显示一个 IP。

原因是：

```text
Pod 拥有网络身份
└── Pod 内的容器共享这个网络身份
```

它们不能同时监听同一个端口。例如 web 已监听 80，如果 helper 也尝试监听同一 Pod 网络的 80 端口，就会发生端口冲突。

## 八、容器仍然彼此独立

共享网络不代表两个容器合并成了一个容器。

例如，web 容器有 Nginx 命令：

```bash
kubectl exec qingyun-mall-web-with-helper -c web -- nginx -v
```

helper 容器则没有安装 Nginx：

```bash
kubectl exec qingyun-mall-web-with-helper -c helper -- nginx -v
```

第二条预期会提示找不到 `nginx`。这是正常现象，因为 helper 使用 BusyBox 镜像，而不是 Nginx 镜像。

由此得到：

```text
同一个 Pod 内：
网络是共享的
容器镜像和文件环境默认仍各自独立
```

以后学习 Volume 时，再让两个容器有意识地共享某个目录。

## 九、分别查看容器日志

双容器 Pod 中，查看日志也要指定容器。

查看 Nginx 日志：

```bash
kubectl logs qingyun-mall-web-with-helper -c web
```

刚才 helper 访问过 Nginx，日志中通常会出现：

```text
"GET / HTTP/1.1" 200
```

查看 helper 日志：

```bash
kubectl logs qingyun-mall-web-with-helper -c helper
```

通常没有输出，因为 `sleep 3600` 没有打印日志。

这说明日志属于具体容器，而不是把 Pod 内所有日志天然混成一个文件。

## 十、为什么 Kubernetes 调度 Pod，而不是单个容器

“调度”可以先理解为“选择放在哪台机器运行”。

如果两个容器必须通过 localhost 紧密协作，Kubernetes 就应该把它们作为一个整体安排：

```text
错误思路：
分别安排两个容器
→ 可能落到两台不同机器
→ localhost 无法互访

Pod 模型：
把两个容器装进同一个 Pod
→ 一起安排到同一台机器
→ 共享网络
```

因此，Kubernetes 的最小调度单位是 Pod。

但日常业务最常见的仍然是一 Pod 一个主应用容器。只有容器生命周期紧密相关、确实需要共享资源时，才放进同一个 Pod。不要为了“省 Pod”把前端、后端和数据库全部塞进一个 Pod。

## 十一、清理实验

先确认对象：

```bash
kubectl get pod qingyun-mall-web-with-helper
```

删除：

```bash
kubectl delete -f labs/03-Pod与容器/01-双容器Pod.yaml
```

确认：

```bash
kubectl get pod qingyun-mall-web-with-helper
```

看到 `NotFound` 表示清理完成。

## 十二、问题与直接回答

### Pod 就是容器吗？

不是。Pod 是 Kubernetes 管理和调度的外层运行单元，Pod 中可以包含一个或多个容器。

### `READY 2/2` 表示有两个 Pod 吗？

不是。它表示当前这个 Pod 中需要就绪的两个容器都已经就绪。

### 为什么执行 `exec` 和 `logs` 时要加 `-c`？

因为 Pod 中有多个容器，需要告诉 kubectl 具体操作哪个容器。

### 同一个 Pod 内的容器共享什么？

这一课已经验证的是网络：它们共享 Pod IP，并能通过 localhost 互访。存储只有显式配置共享 Volume 时才共享。

### 为什么 helper 找不到 nginx 命令，却能访问 Nginx？

两个容器的镜像和文件环境各自独立，所以 helper 没有 nginx 命令；但它们共享网络，所以 helper 能连接 web 容器监听的 80 端口。

### 是否应该把所有应用都放进一个 Pod？

不应该。一个 Pod 适合放生命周期紧密、需要共享资源的容器。前端、后端、数据库通常需要独立升级和扩缩容，应使用不同 Pod。

## 本课只记住五句话

1. Pod 是 Kubernetes 的最小调度单位，容器是实际运行程序的地方。
2. 一个 Pod 可以有多个容器，`READY 2/2` 指容器就绪数量。
3. 同一个 Pod 内的容器共享 Pod 网络和 IP，可以通过 localhost 互访。
4. 容器镜像和文件环境默认仍然独立。
5. 多容器 Pod 用 `-c 容器名` 指定 exec 或 logs 的目标。

## 下一课预告

下一课观察 Pod 从创建到运行的生命过程，并亲手制造一次镜像错误。你会学会读懂 `Pending`、`ContainerCreating`、`Running` 和 `ImagePullBackOff`，但每个状态只结合实际现象讲。
