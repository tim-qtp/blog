---
order: 3
title: "3. 看懂第一份 Kubernetes YAML"
category:
  - 综合运维
  - 容器与编排
  - k8s
---
# 第三课：看懂第一份 Kubernetes YAML

## 这节课只解决一个问题

上一课使用下面的命令创建了 Nginx：

```bash
kubectl apply -f labs/02-第一个应用/01-nginx-pod.yaml
```

这一课不增加新应用，只解释 Kubernetes 怎样读懂这个文件。

学完后，再看到一份简单 YAML，你应该能判断：

- 要创建什么；
- 对象叫什么；
- 要运行什么容器；
- 哪些内容是我们写的，哪些是 Kubernetes 后来补充的。

## 一、先理解 YAML 的三个书写规则

YAML 是一种用于表达结构化数据的文本格式。它不属于 Kubernetes，很多其他软件也使用 YAML。

### 规则 1：缩进表示所属关系

```yaml
metadata:
  name: qingyun-mall-web-preview
```

`name` 前面有两个空格，表示它属于 `metadata`。

可以画成：

```text
metadata
└── name
```

缩进层级必须对齐，通常使用空格，不使用 Tab。

### 规则 2：冒号表示“名称对应一个值”

```yaml
kind: Pod
```

可以读作：

```text
kind 的值是 Pod
```

### 规则 3：短横线表示列表中的一项

```yaml
containers:
  - name: nginx
    image: nginx:1.27
```

`containers` 是容器列表，短横线表示列表中的一个容器。

画成：

```text
containers
└── 第 1 个容器
    ├── name: nginx
    └── image: nginx:1.27
```

以后一个 Pod 中有多个容器时，会出现多个短横线。现在只有一个。

## 二、把文件分成四大块

打开 `labs/02-第一个应用/01-nginx-pod.yaml`：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: qingyun-mall-web-preview
spec:
  containers:
    - name: nginx
      image: nginx:1.27
      ports:
        - containerPort: 80
```

在线阅读时，请把这份完整 YAML 保存为：

```text
labs/02-第一个应用/01-nginx-pod.yaml
```

如果目录不存在，先执行：

```bash
mkdir -p labs/02-第一个应用
```

先不看细节，只看最左边没有缩进的内容：

```text
apiVersion
kind
metadata
spec
```

这就是这份文件的四个顶层部分。

## 三、`apiVersion`：按哪一版规则理解

```yaml
apiVersion: v1
```

白话理解：

```text
请按照 v1 这版规则解释这个对象。
```

Kubernetes 的功能会发展，不同对象可能使用不同版本的书写规则。因此 YAML 需要告诉 Kubernetes 应该按哪一版规则解析。

现在只记住：Pod 通常写 `v1`。不要把它理解成 Nginx 版本，也不要因为集群版本是 v1.32.2 就改成 `v1.32.2`。

## 四、`kind`：要创建什么

```yaml
kind: Pod
```

`kind` 表示对象类型。这里是在告诉 Kubernetes：

```text
我要创建一个 Pod。
```

以后还会见到其他类型：

```yaml
kind: Service
```

表示创建 Service；

```yaml
kind: Deployment
```

表示创建 Deployment。

现在不用学习它们的用途，只要知道 `kind` 决定“这是什么”。

## 五、`metadata`：它叫什么

```yaml
metadata:
  name: qingyun-mall-web-preview
```

`metadata` 可以先翻译为“对象的身份信息”。其中：

```yaml
name: qingyun-mall-web-preview
```

给这个 Pod 起名为 `qingyun-mall-web-preview`。

因此上一课才能通过名字查找它：

```bash
kubectl get pod qingyun-mall-web-preview
```

这三部分正好对应：

```text
get              获取、查看
pod              对象类型
qingyun-mall-web-preview  对象名称
```

## 六、`spec`：希望它怎样运行

`spec` 是 specification 的缩写，可以理解为“要求”或者“期望配置”。

```yaml
spec:
  containers:
    - name: nginx
      image: nginx:1.27
      ports:
        - containerPort: 80
```

这段要求 Kubernetes：

1. Pod 中要有一个容器；
2. 容器名叫 `nginx`；
3. 使用 `nginx:1.27` 镜像；
4. 容器使用 80 端口。

关系如下：

```text
Pod: qingyun-mall-web-preview
└── spec：运行要求
    └── containers：容器列表
        └── 容器 nginx
            ├── image: nginx:1.27
            └── containerPort: 80
```

注意这里有两个名字：

```text
metadata.name = qingyun-mall-web-preview  → Pod 名字
containers[].name = nginx        → Pod 内的容器名字
```

它们不是同一个层级。一个 Pod 以后可以包含多个容器，所以每个容器也需要自己的名字。

## 七、实操：重新创建并观察

进入课程目录：

```bash
cd /Users/qintianpeng/2026/code/k8s
```

创建 Pod：

```bash
kubectl apply -f labs/02-第一个应用/01-nginx-pod.yaml
```

等待它运行：

```bash
kubectl get pod qingyun-mall-web-preview -w
```

看到 `1/1 Running` 后按 `Control + C`。

## 八、观察 Kubernetes 补充的 `status`

执行：

```bash
kubectl get pod qingyun-mall-web-preview -o yaml
```

`-o yaml` 表示“以 YAML 格式输出这个 Pod”。

输出会比原文件长很多。现在不要试图全部看懂，只寻找最左侧的五块：

```text
apiVersion:
kind:
metadata:
spec:
status:
```

你最初只写了四块，查询结果多了：

```yaml
status:
```

`status` 表示 Kubernetes 观察到的当前状态。里面通常能看到：

```yaml
phase: Running
podIP: 10.x.x.x
```

现在建立一个重要区别：

```text
spec   = 你希望怎样运行
status = Kubernetes 观察到现在怎样
```

例如：

```text
spec.image = nginx:1.27  → 你要求使用的镜像
status.phase = Running   → Kubernetes 观察到 Pod 正在运行
```

`status` 一般不由我们写进创建文件，因为 Pod 还没创建时，它没有实际运行状态和 Pod IP。

## 九、为什么查询结果比原文件长

除了 `status`，你还会看到很多没有手写的内容，例如创建时间和内部编号。

这不是 Kubernetes 偷偷修改了本地文件。实际发生的是：

```text
本地 YAML 文件
   │ kubectl apply
   ▼
Kubernetes 中的对象
   ├── 保留你的要求
   ├── 补充默认设置
   ├── 补充身份信息
   └── 补充运行状态
```

本地文件依旧是原来的简短内容；`kubectl get ... -o yaml` 展示的是集群中更加完整的对象。

## 十、让 Kubernetes 解释字段

执行：

```bash
kubectl explain pod
```

`explain` 表示解释。输出虽然是英文，但能看到 Pod 的主要字段：

```text
apiVersion
kind
metadata
spec
status
```

想查询 `spec` 是什么：

```bash
kubectl explain pod.spec
```

这条命令暂时不用读完。它的价值是告诉你：以后遇到陌生字段，可以让当前集群解释，不必全靠记忆。

## 十一、清理实验

执行：

```bash
kubectl delete -f labs/02-第一个应用/01-nginx-pod.yaml
```

然后确认：

```bash
kubectl get pod qingyun-mall-web-preview
```

看到 `NotFound` 表示清理完成。

## 十二、问题与直接回答

### YAML 是 Kubernetes 专用语言吗？

不是。YAML 只是一种表达结构化数据的文本格式，Kubernetes 是它的使用者之一。

### 为什么 YAML 的缩进不能随便写？

因为缩进表示所属关系。缩进错误可能改变字段层级，或者让文件无法解析。

### `kind` 与 `name` 有什么区别？

`kind` 是对象类型，例如 Pod；`name` 是这个具体对象的名称，例如 `qingyun-mall-web-preview`。

### `spec` 与 `status` 有什么区别？

`spec` 是你提交的运行要求，`status` 是 Kubernetes 观察到的实际状态。

### 为什么原文件没有 `status`？

因为创建前还没有实际运行状态。status 通常由 Kubernetes 在对象运行过程中填写。

### 为什么 Pod 名和容器名不一样？

因为它们属于不同层级。Pod 是外层运行单元，里面可以有一个或多个容器，每个容器也需要名称。

## 本课只记住五句话

1. YAML 用缩进表达所属关系，用短横线表达列表项。
2. `apiVersion` 表示按哪版规则理解。
3. `kind` 表示对象类型，`metadata.name` 表示对象名字。
4. `spec` 是期望配置，`status` 是实际观察结果。
5. 查询结果更长，是因为 Kubernetes 补充了默认信息和运行状态。

## 下一课预告

下一课只讲 Pod 与容器的区别，并进入容器内部观察进程、文件和网络。等亲眼看到共享关系后，再解释为什么 Kubernetes 不直接调度单个容器。
