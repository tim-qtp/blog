---
order: 1
title: "1. Kubernetes 到底在解决什么"
category:
  - 综合运维
  - 容器与编排
  - k8s
---
# 第一课：Kubernetes 到底在解决什么

1. Docker 已经能启动容器，为什么还需要 Kubernetes？
2. `kubectl` 把请求发给谁？
3. 控制面和 Node 分别负责什么？
4. 什么是期望状态，什么是实际状态？

## 一、先从一个事故开始

假设你用 Docker 启动了 3 个 Web 容器。凌晨一台机器宕机，接下来需要有人做这些事：

- 发现少了一个实例；
- 找一台有资源的机器；
- 拉镜像、启动新容器；
- 把新地址加入流量入口；
- 旧实例恢复时避免多跑；
- 整个过程中留下可查询的状态。

Docker 擅长的是「把一个容器运行起来」。Kubernetes 的核心工作是：**让一组声明持续成立**。

例如你声明：

```text
我希望 Web 始终有 3 个可用副本
```

Kubernetes 不只是按顺序执行一次“启动 3 个容器”。它持续比较：

```text
期望副本数 3  ──比较──  当前可用副本数 2
                           ↓
                        差 1 个
                           ↓
                     创建并运行 1 个
```

这叫 **reconciliation（调谐/持续纠偏）**。它是整门课最重要的词。

## 二、把 Kubernetes 看成一个控制系统

空调不是执行一次“制冷 10 分钟”就结束。你设定 24℃，控制器不断读取当前温度并纠偏。

| 空调 | Kubernetes |
|---|---|
| 设定 24℃ | 对象的 `spec`（期望状态） |
| 当前 27℃ | 对象的 `status`（观察到的状态） |
| 温度传感器 | 各组件持续观察集群 |
| 控制器开/关压缩机 | Controller 创建、更新、删除对象 |

这个类比只用于理解“闭环控制”。Kubernetes 的实际状态并不只来自一个传感器，也不是每个对象都拥有同样的 status 字段结构。

## 三、你提交一个对象后发生什么

先记住最小版本：

```text
你（kubectl / YAML）
        ↓ HTTPS
kube-apiserver ───→ etcd
        │             保存集群状态
        ├── scheduler：给未绑定的 Pod 选 Node
        └── controller：持续发现并修正差距
                            ↓
                      Node 上的 kubelet
                            ↓
                        容器运行时
```

组件职责：

| 组件 | 用一句人话解释 | 它不负责什么 |
|---|---|---|
| kube-apiserver | Kubernetes 的统一 API 入口 | 不亲自启动容器 |
| etcd | 保存 API 对象状态的账本 | 不是业务数据库 |
| kube-scheduler | 为尚未绑定 Node 的 Pod 选位置 | 不在 Node 上启动容器 |
| kube-controller-manager | 运行许多控制循环，持续纠偏 | 不是单一业务控制器 |
| kubelet | 让分配到本 Node 的 Pod 真实运行 | 不负责全局调度 |
| 容器运行时 | 创建和运行容器 | 不理解 Deployment 的副本目标 |
| CoreDNS | 为集群服务提供 DNS 解析 | 不替代 Service 转发 |
| kube-proxy | 在很多集群中实现 Service 网络规则 | 不是所有网络能力的总称 |

注意：上表描述的是职责，不代表这些组件在所有发行版中都以同一种进程或 Pod 形态出现。

## 四、实验：读出你自己的集群

### 0. 运行预检脚本

如果你正在使用本课程仓库，可以在仓库根目录执行：

```bash
bash labs/00-环境预检.sh
```

如果你阅读的是在线笔记，没有本地课程仓库，请新建一个名为 `00-环境预检.sh` 的文件，并复制下面的完整内容：

```bash
#!/usr/bin/env bash

set -u

failures=0

check_command() {
  if command -v "$1" >/dev/null 2>&1; then
    printf '[OK]   找到命令: %s\n' "$1"
  else
    printf '[FAIL] 缺少命令: %s\n' "$1"
    failures=$((failures + 1))
  fi
}

printf 'Kubernetes 课程环境预检（只读）\n\n'

check_command docker
check_command kubectl

if ! command -v kubectl >/dev/null 2>&1; then
  printf '\nFAIL：请先安装并配置 kubectl。\n'
  exit 1
fi

printf '\n当前 context:\n'
if ! kubectl config current-context; then
  failures=$((failures + 1))
fi

printf '\nkubectl 客户端版本:\n'
if ! kubectl version --client; then
  failures=$((failures + 1))
fi

printf '\n集群 Node:\n'
if ! kubectl get nodes -o wide; then
  failures=$((failures + 1))
fi

printf '\n当前权限快速检查:\n'
if kubectl auth can-i get pods --all-namespaces >/dev/null 2>&1; then
  printf '[OK]   API 可访问，能够读取 Pod\n'
else
  printf '[FAIL] 无法读取 Pod，请检查 context、集群状态或权限\n'
  failures=$((failures + 1))
fi

if [ "$failures" -eq 0 ]; then
  printf '\nPASS：Kubernetes 基础实验环境可用。\n'
  exit 0
fi

printf '\nFAIL：预检发现 %s 项问题，请先根据上方输出定位。\n' "$failures"
exit 1
```

保存后，在该文件所在目录执行：

```bash
bash 00-环境预检.sh
```

这个脚本只读取本机命令、当前 Kubernetes context、客户端版本、Node 状态和 Pod 读取权限，不会创建、修改或删除集群资源。最后看到下面的输出，才说明可以继续本课：

```text
PASS：Kubernetes 基础实验环境可用。
```

### 1. 确认 kubectl 正在操作哪个集群

```bash
kubectl config current-context
```

本机检查时输出是 `docker-desktop`。这是现场值，不是标准答案。

再看 kubectl 请求的控制面地址：

```bash
  kubectl cluster-info
```

你看到的 Kubernetes control plane 地址，就是当前 context 中 kube-apiserver 的入口。

### 2. 看 Node

```bash
kubectl get nodes -o wide
```

先只读这些列：

- `STATUS`：Node 是否 Ready；
- `ROLES`：在这个发行版中标注的角色；
- `VERSION`：此 Node 的 kubelet 版本；
- `INTERNAL-IP`：Node 内部地址；
- `CONTAINER-RUNTIME`：kubelet 接入的运行时信息。

不要得出“集群只能有一个 Node”或“control-plane 一定运行普通业务”这样的结论。你现在看到一个 Node，是 Docker Desktop 本地实验环境的形态。

### 3. 看所有 Namespace 里的 Pod

```bash
kubectl get pods -A -o wide
```

这里要建立两个观察：

1. Pod 属于 Namespace，所以定位对象时不能只说名字；应说 `namespace/name`。
2. Pod IP 与 Node IP 通常属于不同网络范围；具体网段由当前集群网络实现决定。

### 4. 识别控制面组件

Docker Desktop 当前把部分控制面组件作为静态 Pod 展示，可以执行：

```bash
kubectl get pods -n kube-system -o wide | grep -E 'kube-apiserver|etcd|kube-scheduler|kube-controller-manager'
```

如果在另一种托管 Kubernetes 中看不到它们，不能据此判定控制面不存在；云厂商可能不向你暴露控制面 Pod。

### 5. 从一个现有 Pod 分离“期望”和“现实”

本机当前已有 `default/web`。先确认它仍存在：

```bash
kubectl get pod web -n default
```

看你最初声明的核心部分：

```bash
kubectl get pod web -n default -o yaml
```

阅读时先找：

- `metadata.name`：对象身份的一部分；
- `metadata.namespace`：对象所在范围；
- `spec.containers`：希望运行哪些容器；
- `status.phase`：集群观察到的阶段；
- `status.podIP`：运行后才获得的现场信息；
- `status.containerStatuses`：每个容器的实际状态。

`spec` 可以先理解为订单，`status` 是履约回执。二者之间的差距，就是控制器和节点组件工作的地方。

### 6. 看事件，恢复时间顺序

```bash
kubectl describe pod web -n default
```

滚到 `Events`，尝试找到：

```text
Scheduled → Pulling/Pulled → Created → Started
```

事件有保留周期，旧事件可能已过期；没有 Events 不等于这个 Pod 从未经历启动过程。

## 五、本课最容易形成的四个误解

### 误解 1：Kubernetes 就是更复杂的 Docker Compose

Compose 主要描述并启动一组容器；Kubernetes 以 API 对象和控制循环持续维持期望状态，还处理跨节点调度、服务发现、滚动更新、权限等问题。二者有相似入口，但控制模型和运行范围不同。

### 误解 2：kubectl 直接命令 Node 启动容器

kubectl 面向 kube-apiserver。调度器、控制器和 kubelet 分别观察 API 状态并完成后续工作。

### 误解 3：Pod 就是容器

Pod 是 Kubernetes 调度的最小部署单元，里面可以有一个或多个共享网络和部分存储的容器。日常最常见的是一 Pod 一主容器，但二者不是同义词。

### 误解 4：显示 Running 就代表业务可用

`Running` 主要说明 Pod 已绑定到 Node，且至少有容器已启动或正在启动。业务能不能正确处理请求，还要结合 `READY`、探针、日志和实际请求验证。

## 六、关键问题与直接回答

### 1. Kubernetes 与一次性脚本最本质的区别是什么？

一次性脚本关心“步骤有没有执行完”；Kubernetes 控制循环关心“期望状态是否持续成立”。现实一旦偏离，控制器还会继续纠偏。

### 2. `kubectl apply` 之后，谁最终在 Node 上让容器运行？

kubelet。它观察分配到本 Node 的 Pod，并通过容器运行时让容器实际运行。kubectl 只把请求交给 kube-apiserver。

### 3. scheduler 与 kubelet 的职责边界是什么？

scheduler 决定 Pod 应该去哪个 Node；目标 Node 上的 kubelet 负责让它真正运行。可以记成“一个选址，一个施工”。

### 4. 为什么 `status.podIP` 通常不写进 YAML？

Pod IP 是集群运行后分配和观察到的现场状态，不是用户应该固定声明的期望。Pod 重建后 IP 也可能变化。

### 5. 在托管集群看不到 kube-apiserver Pod，为什么不能直接说控制面坏了？

组件职责和组件展示方式是两回事。托管 Kubernetes 通常由云厂商维护控制面，租户未必有权限看到控制面 Pod；应以 API 是否可用及厂商暴露的健康信息判断。

## 七、可选动手验证

想用本机输出加强记忆时，执行下面四条命令；不作为进入下一课的前置条件：

```bash
kubectl config current-context
kubectl get nodes -o wide
kubectl get pods -A -o wide
kubectl get pod web -n default -o jsonpath='{.spec.containers[0].image}{"\n"}{.status.phase}{"\n"}{.status.podIP}{"\n"}'
```

如果执行了，可以按需把异常输出记到 `学习记录/`。本课不需要清理资源，因为没有创建或修改对象。

## 下一课预告

下一课会解剖 Kubernetes API 对象：`apiVersion`、`kind`、`metadata`、`spec`、`status` 到底各自决定什么，并用 `kubectl explain` 学会“让集群自己告诉你字段怎么写”。
