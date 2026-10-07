---
order: 14
title: "13. ConfigMap 配置外置"
category:
  - 综合运维
  - 容器与编排
  - k8s
---
# 第十三课：ConfigMap 配置外置

## 一、在全局地图中的位置

已经学过的关系：

```text
Namespace
└── Deployment → Pod → Container

客户端 → DNS → Service → Pod
```

现在补上“配置”：

```text
ConfigMap → 把配置交给 Pod 中的 Container
```

本课只解决一个问题：同一个容器镜像，怎样使用不同环境配置？

## 二、为什么配置不应写死在镜像中

青云商城前台在不同环境中可能需要不同配置：

```text
开发环境：MALL_TITLE=青云商城-开发环境
测试环境：MALL_TITLE=青云商城-测试环境
```

Nginx 镜像本身没有变化。变化的是运行环境提供给它的配置。

理想关系是：

```text
同一个镜像 nginx:1.27
        ↑
开发环境注入开发配置
测试环境注入测试配置
```

如果每改一次标题或接口地址都重新制作镜像，镜像就和环境绑定了。ConfigMap 用来保存普通、非敏感配置，让镜像与配置分开。

## 三、ConfigMap 是什么

ConfigMap 是 Kubernetes 中保存普通配置的对象，内容通常是键值对：

```text
MALL_TITLE = 青云商城-开发环境
API_BASE_URL = http://product-api
```

本课把这些值作为环境变量交给容器：

```text
ConfigMap
    ↓
Pod 中的容器环境变量
    ↓
应用读取配置
```

ConfigMap 不适合保存密码、Token、私钥等敏感内容；这些以后学习 Secret。

## 四、本课 YAML

实验文件：`labs/11-ConfigMap/01-商城前台配置.yaml`

文件包含两个对象：

```text
ConfigMap qingyun-mall-web-config
Deployment qingyun-mall-web
```

在线阅读时，请把下面的完整内容保存为 `labs/11-ConfigMap/01-商城前台配置.yaml`：

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: qingyun-mall-web-config
  labels:
    app: qingyun-mall
    tier: frontend
data:
  MALL_TITLE: 青云商城-开发环境
  API_BASE_URL: http://product-api
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: qingyun-mall-web
  labels:
    app: qingyun-mall
    tier: frontend
spec:
  replicas: 1
  selector:
    matchLabels:
      app: qingyun-mall
      tier: frontend
  template:
    metadata:
      labels:
        app: qingyun-mall
        tier: frontend
    spec:
      containers:
        - name: nginx
          image: nginx:1.27
          envFrom:
            - configMapRef:
                name: qingyun-mall-web-config
          ports:
            - containerPort: 80
```

如果目录不存在，先执行：

```bash
mkdir -p labs/11-ConfigMap
```

其中关键连接点是：

```yaml
envFrom:
  - configMapRef:
      name: qingyun-mall-web-config
```

它表示把这个 ConfigMap 中的键值作为环境变量交给容器。

## 五、最小实验

进入项目并创建资源：

```bash
cd /Users/qintianpeng/2026/code/k8s
kubectl apply -f labs/11-ConfigMap/01-商城前台配置.yaml
```

等待 Deployment 就绪：

```bash
kubectl rollout status deployment/qingyun-mall-web
```

查看 ConfigMap：

```bash
kubectl get configmap qingyun-mall-web-config -o yaml
```

进入 Deployment 管理的 Pod，查看容器收到的配置：

```bash
kubectl exec deployment/qingyun-mall-web -- \
  printenv MALL_TITLE API_BASE_URL
```

应该输出：

```text
青云商城-开发环境
http://product-api
```

这证明配置经过了下面这条链：

```text
ConfigMap → Pod → Container 环境变量
```

## 六、不要混淆镜像和配置

```text
镜像 nginx:1.27
→ 程序本身是什么

ConfigMap qingyun-mall-web-config
→ 程序运行时使用什么普通配置
```

同一个镜像可以在不同环境中配合不同 ConfigMap 使用。

## 七、本课暂时不展开的内容

本课先不讨论：

- 修改 ConfigMap 后，正在运行的容器是否自动变化；
- 把 ConfigMap 挂载成文件；
- Secret；
- 多环境配置管理工具。

先把“镜像与配置分离”理解牢固，后面再逐层补充。

## 八、清理实验

```bash
kubectl delete -f labs/11-ConfigMap/01-商城前台配置.yaml
```

确认：

```bash
kubectl get deployment,configmap -l app=qingyun-mall
```

## 九、问题与直接回答

### ConfigMap 保存什么？

普通、非敏感的应用配置。

### 为什么不把配置直接写进镜像？

把程序和环境配置分开，同一个镜像才能方便地用于不同环境。

### ConfigMap 会自己执行配置吗？

不会。Pod 必须通过 `envFrom` 等方式引用它，应用再读取相应环境变量。

### 密码可以放进 ConfigMap 吗？

不应该。密码等敏感内容以后使用 Secret。

## 本课只记住三句话

1. 镜像保存程序，ConfigMap 保存普通配置。
2. 同一个镜像可以搭配不同环境的 ConfigMap。
3. ConfigMap 必须被 Pod 引用，配置才会进入容器。

## 下一课预告

下一课学习 Secret，只回答一个问题：数据库密码等敏感配置应该放在哪里？
