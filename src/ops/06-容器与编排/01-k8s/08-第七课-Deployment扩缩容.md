---
order: 7
title: "7. Deployment 扩缩容"
category:
  - 综合运维
  - 容器与编排
  - k8s
---
# 第七课：Deployment 扩缩容

## 这节课只解决一个问题

应用访问量增加时，怎样把两个 Nginx Pod 变成四个？访问量下降后，又怎样缩回一个？

核心答案：

```text
修改 Deployment 的期望副本数
         ↓
Deployment 管理链自动增加或减少 Pod
```

我们不会手工复制或逐个创建 Pod。

## 一、什么是扩容和缩容

先从数量理解：

```text
扩容：2 个 Pod → 4 个 Pod
缩容：4 个 Pod → 1 个 Pod
```

这里讲的是“水平扩缩容”：通过增加或减少相同应用的 Pod 数量来改变承载能力。

“水平”这个术语现在不用背。只需要理解，我们改变的是 Pod 数量，不是给单个 Pod 增加 CPU 或内存。

## 二、先创建两个副本

进入课程目录：

```bash
cd /Users/qintianpeng/2026/code/k8s
```

应用上一课的 Deployment 文件：

```bash
kubectl apply -f labs/05-Deployment/01-nginx-deployment.yaml
```

等待部署完成：

```bash
kubectl rollout status deployment/qingyun-mall-web
```

`rollout status` 可以先理解为“等待并查看这次部署是否完成”。

成功时会看到：

```text
deployment "qingyun-mall-web" successfully rolled out
```

查看初始状态：

```bash
kubectl get deployment qingyun-mall-web
kubectl get pods -l 'app=qingyun-mall,tier=frontend'
```

此时应该是：

```text
Deployment READY 2/2
Pod 数量 2
```

## 三、扩容到四个副本

执行：

```bash
kubectl scale deployment qingyun-mall-web --replicas=4
```

拆开理解：

```text
kubectl scale             调整副本数量
deployment                操作 Deployment
qingyun-mall-web           Deployment 名称
--replicas=4              期望副本数改成 4
```

持续观察 Pod：

```bash
kubectl get pods -l 'app=qingyun-mall,tier=frontend' -w
```

你会看到两个新 Pod 被创建，最终共四个 `Running` Pod。完成后按 `Control + C`。

查看 Deployment：

```bash
kubectl get deployment qingyun-mall-web
```

最终应看到：

```text
READY 4/4
```

刚才并没有执行四次 `kubectl apply`，也没有复制四份 YAML。我们只修改了管理员的目标：

```text
原期望：2
新期望：4
差距：少 2 个
       ↓
自动创建 2 个新 Pod
```

## 四、缩容到一个副本

执行：

```bash
kubectl scale deployment qingyun-mall-web --replicas=1
```

持续观察：

```bash
kubectl get pods -l 'app=qingyun-mall,tier=frontend' -w
```

你会看到三个 Pod 逐渐结束，最终只剩一个 Running Pod。完成后按 `Control + C`。

查看结果：

```bash
kubectl get deployment qingyun-mall-web
kubectl get pods -l 'app=qingyun-mall,tier=frontend'
```

此时应为：

```text
Deployment READY 1/1
Pod 数量 1
```

缩容不是让三个 Pod“休眠”，而是删除多余 Pod，只保留期望数量。

## 五、扩缩容仍然是持续纠偏

上一课手动删除一个 Pod，实际数量低于期望数量，所以系统补回一个。

这一课主动修改期望数量：

```text
扩容：
期望从 2 改成 4
实际仍是 2
→ 补 2 个

缩容：
期望从 4 改成 1
实际仍是 4
→ 删除 3 个
```

底层思想没有变化：

```text
比较期望和实际
      ↓
修正两者的差距
```

## 六、一个必须理解的现象：YAML 仍然写着 2

刚才执行命令把集群中的副本数改成了 1：

```bash
kubectl scale deployment qingyun-mall-web --replicas=1
```

但打开本地文件：

```text
labs/05-Deployment/01-nginx-deployment.yaml
```

里面仍然是：

```yaml
replicas: 2
```

原因是 `kubectl scale` 修改了集群中的 Deployment，没有修改你电脑上的 YAML 文件。

现在再次应用文件：

```bash
kubectl apply -f labs/05-Deployment/01-nginx-deployment.yaml
```

再观察：

```bash
kubectl get deployment qingyun-mall-web
kubectl get pods -l 'app=qingyun-mall,tier=frontend'
```

副本会从 1 回到 2，因为 YAML 重新表达了：

```text
replicas: 2
```

## 七、命令修改和文件修改有什么区别

### 直接运行 scale 命令

```bash
kubectl scale deployment qingyun-mall-web --replicas=4
```

优点：快速，适合学习、临时处理或验证。

问题：本地 YAML 仍保留旧值，以后重新 apply 可能覆盖这次修改。

### 修改 YAML 后重新 apply

把文件改成：

```yaml
replicas: 4
```

然后执行：

```bash
kubectl apply -f labs/05-Deployment/01-nginx-deployment.yaml
```

优点：文件和集群目标保持一致，还能通过 Git 记录为什么修改。

生产环境通常更重视“配置文件就是最终依据”。紧急扩容可以先用命令，但随后要同步配置仓库，避免下一次发布把副本数改回去。

这类“集群实际配置”和“配置文件记录”不一致的情况，可以先叫它“配置漂移”。术语不用背，记住现象即可。

## 八、如何快速确认副本数量

查看 Deployment：

```bash
kubectl get deployment qingyun-mall-web
```

查看具体 Pod：

```bash
kubectl get pods -l 'app=qingyun-mall,tier=frontend'
```

前者告诉你管理员的整体情况，后者告诉你实际有哪些 Pod。

如果刚执行扩容，可能短暂看到：

```text
READY 2/4
```

意思不是扩容失败，而是：

```text
期望 4 个
当前只有 2 个就绪
另外 2 个仍在启动
```

等待一会儿再次查询。如果长时间无法达到 `4/4`，再使用上一课的 `describe` 和 Events 排查新 Pod。

## 九、扩容是否一定提高性能

不一定。

扩容 Pod 能提高能力需要满足一些前提：

- 请求能够分发到多个 Pod；
- 应用可以运行多个副本；
- 集群有足够 CPU 和内存；
- 性能瓶颈不是只有一个的数据库或外部服务。

这一课还没有学习 Service，所以我们只验证 Kubernetes 能维持数量，不声称流量已经自动均匀进入四个 Pod。

## 十、清理实验

删除 Deployment：

```bash
kubectl delete -f labs/05-Deployment/01-nginx-deployment.yaml
```

确认下层对象也被清理：

```bash
kubectl get deployment,replicaset,pod -l 'app=qingyun-mall,tier=frontend'
```

最终应显示没有资源。

删除最上层 Deployment 后，下层 Pod 可能还会短暂显示 `Terminating`，因为级联清理需要一点时间。稍等后重新查询，最终应全部消失。

## 十一、问题与直接回答

### 扩容四个副本，需要准备四份 YAML 吗？

不需要。一个 Deployment 中把 `replicas` 设置为 4，它就会根据同一个 Pod 模板维持四个副本。

### 缩容后，多余 Pod 去哪里了？

它们会被终止并删除，不是暂停或休眠。

### `READY 2/4` 是否一定代表故障？

不一定。扩容过程中，新 Pod 尚未就绪时会短暂出现。如果长时间停留在 2/4，再进一步排查。

### `kubectl scale` 会修改本地 YAML 吗？

不会。它修改集群中的 Deployment，本地文件内容不变。

### 为什么重新 apply 后又回到两个副本？

因为 YAML 中仍写着 `replicas: 2`，重新 apply 会把这份期望提交给集群。

### Pod 变多后，用户请求一定会自动分给它们吗？

这一课还不能保证。Deployment 负责 Pod 数量；稳定入口和流量分发要由后续的 Service 解决。

## 本课只记住五句话

1. 扩缩容就是修改 Deployment 的期望副本数。
2. 扩容会创建 Pod，缩容会终止多余 Pod。
3. `READY 2/4` 表示期望 4 个，目前 2 个就绪。
4. `kubectl scale` 不会修改本地 YAML。
5. 生产配置应尽量让 YAML 记录与集群期望保持一致。

## 下一课预告

下一课学习滚动更新：把 Nginx 从一个版本升级到另一个版本，观察 Kubernetes 如何逐步创建新 Pod、删除旧 Pod，并在发现版本错误时回滚。
