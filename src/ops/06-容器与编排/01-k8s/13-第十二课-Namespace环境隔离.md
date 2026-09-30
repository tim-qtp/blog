---
order: 14
title: "第十二课：Namespace 环境隔离"
category:
  - 综合运维
  - 容器与编排
  - k8s
---
# 第十二课：Namespace 环境隔离

## 一、本课只解决一个问题

青云商城现在要同时部署开发环境和测试环境：

```text
青云商城
├── 开发环境：程序员日常联调
└── 测试环境：测试人员验证功能
```

两个环境中都需要名为 `qingyun-mall-web` 的 Deployment 和 Service。

如果全部放在 `default` 中，同一类型的资源不能重名。Namespace 可以把一个集群划分成多个逻辑空间：

```text
qingyun-mall-dev  / qingyun-mall-web
qingyun-mall-test / qingyun-mall-web
```

同名资源因为位于不同 Namespace，所以不会冲突。

## 二、先把 Namespace 理解成园区

可以把 Kubernetes 集群想成一个产业园：

```text
Kubernetes 集群
├── qingyun-mall-dev 园区
│   └── qingyun-mall-web
└── qingyun-mall-test 园区
    └── qingyun-mall-web
```

只说“去找 `qingyun-mall-web`”还不够完整，还要知道它位于哪个园区。

Namespace 是 Kubernetes 中资源名称的一部分：

```text
资源身份 = Namespace + 资源类型 + metadata.name
```

## 三、创建两个环境

先创建两个 Namespace：

```bash
cd /Users/qintianpeng/2026/code/k8s
kubectl apply -f labs/10-Namespace/01-开发与测试环境.yaml
```

再把两个同名的商城前台分别部署进去：

```bash
kubectl apply -f labs/10-Namespace/02-两个环境的商城前台.yaml
```

等待两个 Deployment 就绪：

```bash
kubectl rollout status deployment/qingyun-mall-web \
  -n qingyun-mall-dev

kubectl rollout status deployment/qingyun-mall-web \
  -n qingyun-mall-test
```

这里第一次出现 `-n`：

```text
-n 是 --namespace 的缩写
-n qingyun-mall-dev 表示去开发环境中操作
```

## 四、查看 Namespace

执行：

```bash
kubectl get namespaces
```

`namespaces` 可以简写为 `ns`：

```bash
kubectl get ns
```

你会看到：

```text
qingyun-mall-dev
qingyun-mall-test
```

集群还自带 `default`、`kube-system` 等 Namespace。本课不要修改这些系统空间。

## 五、分别查看两个环境

查看开发环境：

```bash
kubectl get deployment,pod,service -n qingyun-mall-dev
```

查看测试环境：

```bash
kubectl get deployment,pod,service -n qingyun-mall-test
```

两个环境中都会出现：

```text
deployment/qingyun-mall-web
service/qingyun-mall-web
```

它们名称一样，但不是同一个对象。

## 六、为什么不加 `-n` 看不到它们

执行：

```bash
kubectl get deployment qingyun-mall-web
```

通常会提示 `default` 中找不到该资源。

原因是当前 kubectl 默认查询 `default` Namespace，而我们的两个 Deployment 分别在：

```text
qingyun-mall-dev
qingyun-mall-test
```

所以排障时看到 `NotFound`，不要立刻断定资源不存在，先确认是不是查错了 Namespace。

## 七、一次查看所有 Namespace

执行：

```bash
kubectl get pods --all-namespaces
```

也可以简写：

```bash
kubectl get pods -A
```

只筛选青云商城：

```bash
kubectl get pods -A -l app=qingyun-mall
```

输出多出一列 `NAMESPACE`，可以同时看见开发环境和测试环境的 Pod。

## 八、结合上一课理解 DNS

创建位于开发环境的调试客户端：

```bash
kubectl apply -f labs/10-Namespace/03-开发环境客户端.yaml
```

等待它就绪：

```bash
kubectl wait --for=condition=Ready \
  pod/mall-debug-client \
  -n qingyun-mall-dev \
  --timeout=60s
```

客户端和开发环境 Service 位于同一 Namespace，因此可以使用短名称：

```bash
kubectl exec -n qingyun-mall-dev mall-debug-client -- \
  wget -qO- http://qingyun-mall-web
```

这个短名称默认指向同一 Namespace 中的：

```text
qingyun-mall-web.qingyun-mall-dev.svc.cluster.local
```

如果开发环境客户端要访问测试环境，就要明确写出测试 Namespace：

```bash
kubectl exec -n qingyun-mall-dev mall-debug-client -- \
  wget -qO- http://qingyun-mall-web.qingyun-mall-test
```

它的完整域名是：

```text
qingyun-mall-web.qingyun-mall-test.svc.cluster.local
```

## 九、Namespace 隔离了什么

Namespace 首先解决的是资源组织和名称范围问题：

- 不同 Namespace 中可以存在同名 Deployment；
- 不同 Namespace 中可以存在同名 Service；
- kubectl 可以按 Namespace 查询和操作；
- Service DNS 名称包含 Namespace。

## 十、Namespace 没有自动隔离什么

不要把 Namespace 理解成一堵自动生成的绝对防火墙。

仅仅创建 Namespace，并不代表：

- 开发环境一定不能访问测试环境；
- CPU 和内存已经自动限制；
- 用户权限已经自动隔离；
- 两个环境可以安全使用同一个数据库。

这些问题以后分别需要 NetworkPolicy、ResourceQuota、RBAC 和独立数据配置等机制。

本课只建立边界：

> Namespace 是逻辑分组和名称范围，不等于完整安全隔离。

## 十一、切换默认 Namespace

反复输入 `-n qingyun-mall-dev` 比较麻烦，可以修改当前 context 的默认 Namespace：

```bash
kubectl config set-context --current --namespace=qingyun-mall-dev
```

之后执行：

```bash
kubectl get pods
```

默认查询开发环境。

实验后切回 `default`：

```bash
kubectl config set-context --current --namespace=default
```

修改默认 Namespace 只影响 kubectl 默认去哪查询，不会移动任何 Kubernetes 资源。

## 十二、固定排障习惯

看到资源不存在或访问错环境时，按这个顺序检查：

```text
1. 当前操作的是哪个 Namespace？
2. 命令是否遗漏了 -n？
3. 用 -A 查看资源实际位于哪里。
4. Service DNS 中的 Namespace 是否正确？
```

常用命令：

```bash
kubectl config view --minify \
  -o jsonpath='{..namespace}{"\n"}'

kubectl get pods -A -l app=qingyun-mall
```

如果第一条命令输出为空，通常表示使用默认的 `default` Namespace。

## 十三、清理实验

先确保 kubectl 默认 Namespace 回到 `default`：

```bash
kubectl config set-context --current --namespace=default
```

然后删除两个实验 Namespace：

```bash
kubectl delete namespace qingyun-mall-dev qingyun-mall-test
```

删除 Namespace 会删除其中的所有资源。本实验中两个 Namespace 都是专门创建的，可以整体清理；生产环境执行前必须确认范围。

最后检查：

```bash
kubectl get ns | grep qingyun-mall
```

没有输出表示清理完成。

## 十四、问题与直接回答

### 不同 Namespace 可以创建同名 Pod 或 Service 吗？

可以。它们属于不同的名称范围。

### 为什么不加 `-n` 会提示 NotFound？

kubectl 默认只查询当前 Namespace，资源可能位于其他 Namespace。

### `-n` 和 `--namespace` 有区别吗？

没有，`-n` 是简写。

### Namespace 是网络防火墙吗？

不是。默认情况下，跨 Namespace 网络访问通常仍然可行。

### 删除 Namespace 会发生什么？

该 Namespace 中的 Deployment、Pod、Service 等资源会一起删除，所以这是高影响操作，必须确认目标。

## 本课只记住五句话

1. Namespace 是集群中的逻辑分组和名称范围。
2. 不同 Namespace 可以拥有同类型、同名称的资源。
3. kubectl 用 `-n` 指定 Namespace，用 `-A` 查看全部 Namespace。
4. 同 Namespace 访问 Service 可用短名称，跨 Namespace 要带上 Namespace。
5. Namespace 不等于完整的网络、权限和资源隔离。

## 下一课预告

下一课学习 ConfigMap。我们会把青云商城的环境名称和页面配置从容器镜像中拿出来，让开发环境和测试环境使用不同配置。
