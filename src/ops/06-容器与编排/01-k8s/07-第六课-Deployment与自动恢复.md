---
order: 8
title: "第六课：Deployment 与自动恢复"
category:
  - 综合运维
  - 容器与编排
  - k8s
---
# 第六课：Deployment 与自动恢复

## 这节课只解决一个问题

前几课都是直接创建 Pod。如果 Pod 被误删，它会自己回来吗？

答案是：

```text
直接创建的 Pod：删除后不会自动回来
Deployment 管理的 Pod：少了会自动补回来
```

这一课亲手删除一个 Pod，观察 Deployment 怎样维持两个副本。

## 一、为什么不能只靠 Pod

假设线上应用需要两个 Nginx 实例：

```text
Nginx Pod A
Nginx Pod B
```

如果只手工创建两个 Pod，其中一个被删除后，Kubernetes 不知道你仍然需要两个。

因为单独的 Pod 文件只表达：

```text
创建这个 Pod
```

它没有表达：

```text
无论发生什么，都要维持两个副本
```

Deployment 就是用来表达这种长期要求的对象。

## 二、把 Deployment 理解成管理员

可以这样理解：

```text
Deployment：管理员
目标：始终保持 2 个 Nginx Pod

当前有 2 个 → 不操作
当前有 1 个 → 补 1 个
当前有 3 个 → 减少 1 个
```

这里的“副本”就是同一个应用的多个运行实例。

```text
replicas: 2
```

表示期望运行两个 Pod 副本。

## 三、看懂实验文件中的新增部分

实验文件：`labs/05-Deployment/01-nginx-deployment.yaml`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: qingyun-mall-web
  labels:
    app: qingyun-mall
spec:
  replicas: 2
  selector:
    matchLabels:
      app: qingyun-mall
  template:
    metadata:
      labels:
        app: qingyun-mall
    spec:
      containers:
        - name: nginx
          image: nginx:1.27
          ports:
            - containerPort: 80
```

这一课只理解三个新增部分。

### `kind: Deployment`

```yaml
kind: Deployment
```

这次创建的不是单独 Pod，而是 Deployment 管理对象。

### `replicas: 2`

```yaml
replicas: 2
```

意思是：

```text
期望始终有两个 Pod 副本
```

### `template`：Pod 模板

```yaml
template:
  metadata:
    labels:
      app: qingyun-mall
  spec:
    containers:
      ...
```

`template` 可以理解成“创建 Pod 时使用的模具”。

Deployment 发现 Pod 数量不足时，会按照这份模板创建新 Pod。

## 四、Label：贴在 Pod 上的标签

文件中出现：

```yaml
labels:
  app: qingyun-mall
```

Label 可以理解成贴在对象上的标签：

```text
Pod A [app=qingyun-mall]
Pod B [app=qingyun-mall]
```

Deployment 使用相同标签识别自己要管理的这一组 Pod。

下面的命令表示“只查看带这个标签的 Pod”：

```bash
kubectl get pods -l 'app=qingyun-mall,tier=frontend'
```

其中 `-l` 表示按 Label 筛选。

这一课只把 Label 当作筛选贴纸。后面学习 Service 时再看它怎样把流量连接到一组 Pod。

## 五、创建 Deployment

进入项目目录：

```bash
cd /Users/qintianpeng/2026/code/k8s
```

创建：

```bash
kubectl apply -f labs/05-Deployment/01-nginx-deployment.yaml
```

正常输出：

```text
deployment.apps/qingyun-mall-web created
```

注意：我们只提交了一份 Deployment，却要求它产生两个 Pod。

## 六、查看 Deployment

执行：

```bash
kubectl get deployment qingyun-mall-web
```

最终可能看到：

```text
NAME              READY   UP-TO-DATE   AVAILABLE   AGE
qingyun-mall-web   2/2     2            2           ...
```

现在只看：

```text
READY 2/2
```

它表示 Deployment 期望两个副本，当前两个都已经就绪。

注意，这里的 `2/2` 是 Deployment 管理的 Pod 副本数；上一课 Pod 的 `2/2` 是一个 Pod 内的容器数。必须结合查询的对象类型理解。

## 七、查看它创建的两个 Pod

执行：

```bash
kubectl get pods -l 'app=qingyun-mall,tier=frontend'
```

可能看到：

```text
NAME                               READY   STATUS    RESTARTS   AGE
qingyun-mall-web-xxxxxxxxxx-aaaaa   1/1     Running   0          ...
qingyun-mall-web-xxxxxxxxxx-bbbbb   1/1     Running   0          ...
```

Pod 名称比 Deployment 名长，末尾带有自动生成的字符。

不要依赖完整 Pod 名，因为 Deployment 以后替换 Pod 时，新 Pod 会得到新名称。

目前关系可以简化为：

```text
Deployment qingyun-mall-web
├── Pod ...-aaaaa
└── Pod ...-bbbbb
```

实际上中间还有一个名为 ReplicaSet 的对象。现在看到它不必紧张：

```text
Deployment
   ↓
ReplicaSet
   ↓
Pod
```

这一课只关注最外层 Deployment 的目标和最内层 Pod 的变化，ReplicaSet 下一讲再解释。

## 八、记录删除前的 Pod 名称

再次执行：

```bash
kubectl get pods -l 'app=qingyun-mall,tier=frontend'
```

从结果中复制任意一个完整 Pod 名。例如：

```text
qingyun-mall-web-xxxxxxxxxx-aaaaa
```

下面命令中的 `<复制的Pod名称>` 需要替换成你实际看到的名称，不要连尖括号一起输入。

## 九、开一个窗口持续观察

在第一个终端执行：

```bash
kubectl get pods -l 'app=qingyun-mall,tier=frontend' -w
```

保持它运行。`-w` 表示持续观察变化。

## 十、手动删除一个 Pod

打开第二个终端，仍然进入项目目录，然后执行：

```bash
kubectl delete pod <复制的Pod名称>
```

例如你的 Pod 名是 `qingyun-mall-web-abcde-fghij`，实际命令就是：

```bash
kubectl delete pod qingyun-mall-web-abcde-fghij
```

回到第一个终端观察。通常会看到：

```text
旧 Pod Terminating
新 Pod ContainerCreating
新 Pod Running
```

最终仍然有两个 Running Pod，但其中一个名称变了。

看到恢复完成后按 `Control + C` 停止观察。

删除过程中，旧 Pod 可能短暂显示 `Terminating`，某些环境也可能短暂显示 `Completed`。这表示旧对象正在结束，不是它恢复正常了；等终止完成后旧名称才会消失。

## 十一、刚才是谁“复活”了 Pod

严格来说，原来的 Pod 没有复活。

发生的是：

```text
期望：2 个 Pod
实际：删除后只剩 1 个
差距：少 1 个
          ↓
控制器发现差距
          ↓
按照 template 创建一个新 Pod
          ↓
实际重新达到 2 个
```

旧 Pod 已经消失，新 Pod 有新的名字和身份。

所以更准确的说法是：

```text
Kubernetes 重新创建了替代 Pod
```

而不是：

```text
原 Pod 原地复活
```

这就是第一课的“持续纠偏”第一次真正落地。

## 十二、直接创建的 Pod 为什么不会补回来

上一课创建的是：

```yaml
kind: Pod
```

删除它之后，没有更上层对象声明“我始终需要一个这样的 Pod”，所以它不会回来。

这节课创建的是：

```yaml
kind: Deployment
spec:
  replicas: 2
```

Deployment 一直保留着“两份副本”的期望，所以少了就补。

生产中的无状态应用通常由 Deployment 管理，而不是长期手工维护裸 Pod。

“无状态应用”现在先理解成：应用实例本身不依赖自己容器中必须永久保存的数据。Nginx 静态服务就是适合入门理解的例子。

## 十三、查看完整关系

执行：

```bash
kubectl get deployment,replicaset,pod -l 'app=qingyun-mall,tier=frontend'
```

你会看到：

- 1 个 Deployment；
- 1 个 ReplicaSet；
- 2 个 Pod。

当前只需记住层级：

```text
Deployment 管理发布目标
ReplicaSet 维持某一版本的副本数
Pod 承载实际容器
```

## 十四、清理 Deployment

这一课不要逐个删除 Pod。删除最上层的 Deployment：

```bash
kubectl delete -f labs/05-Deployment/01-nginx-deployment.yaml
```

然后查看：

```bash
kubectl get deployment,replicaset,pod -l 'app=qingyun-mall,tier=frontend'
```

最终应显示没有找到资源。

为什么删除 Deployment 后 Pod 也被删除？因为这些 Pod 属于这条管理关系，删除最上层对象会清理它管理的下层对象。

## 十五、问题与直接回答

### Deployment 是一个正在运行的应用容器吗？

不是。Deployment 是管理对象，它描述副本数量和 Pod 模板；真正运行 Nginx 的是它创建的 Pod 中的容器。

### `replicas: 2` 是创建两次 Deployment 吗？

不是。它创建一个 Deployment，由这个 Deployment 维持两个 Pod 副本。

### 删除一个 Pod 后，原 Pod 会复活吗？

不会。旧 Pod 被删除，Deployment 管理链会创建一个新的替代 Pod，新 Pod 名称和身份会变化。

### 为什么 Deployment 能知道哪些 Pod 是自己的？

它使用 Label Selector 匹配带有指定 Label 的 Pod。本课中标签是 `app=qingyun-mall`。

### 为什么不直接手工创建两个 Pod？

手工 Pod 被删除后不会自动补回，也不方便统一升级和扩缩容。Deployment 把“始终保持几个副本”变成了持续要求。

### 删除 Deployment 时为什么 Pod 也消失？

因为 Pod 是由 Deployment 的管理链创建的下层对象。删除最上层管理对象时，其所属对象也会被清理。

## 本课只记住五句话

1. Deployment 用来长期维持一组 Pod，而不是自己运行应用。
2. `replicas: 2` 表示期望始终有两个 Pod 副本。
3. `template` 是创建新 Pod 时使用的模板。
4. Pod 被删后不是原地复活，而是创建新的替代 Pod。
5. Label 像贴纸，Deployment 使用它识别要管理的一组 Pod。

## 下一课预告

下一课继续使用这个 Deployment，学习把副本从 2 个扩大到 4 个，再缩回 1 个。你会理解扩缩容其实仍然是“修改期望数量，然后由控制器纠偏”。
