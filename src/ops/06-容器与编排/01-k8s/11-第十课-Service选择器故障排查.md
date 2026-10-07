---
order: 10
title: "10. Service 选择器故障排查"
category:
  - 综合运维
  - 容器与编排
  - k8s
---
# 第十课：Service 选择器故障排查

## 一、贴近实际的业务场景

我们正在部署一个虚构的在线商城，项目名叫“青云商城”：

```text
qingyun-mall
├── qingyun-mall-web：商城前台
├── product-api：商品接口
└── order-api：订单接口
```

本课只部署商城前台。资源和标签这样设计：

| 配置位置 | 值 | 业务含义 |
|---|---|---|
| Deployment name | `qingyun-mall-web` | 负责运行商城前台 Web Pod |
| Service name | `qingyun-mall-web` | 商城前台的稳定访问入口 |
| Label `app` | `qingyun-mall` | 属于青云商城系统 |
| Label `tier` | `frontend` | 属于前端层 |
| Label `environment` | `development` | 当前属于开发环境 |

这里不会把所有值写成同一个名字：

```text
metadata.name：这个具体资源是谁
app：它属于哪个系统
tier：它属于前端层还是后端层
environment：它属于哪个环境
```

## 二、本课故障

商城前台 Pod 拥有：

```text
app=qingyun-mall
tier=frontend
```

但 `qingyun-mall-web` Service 被误配置为：

```text
app=qingyun-mall
tier=backend
```

Service 本来应该寻找商城前台，却错误地寻找后端层。

最终现象：

```text
Pod：全部 Running
Service：创建成功
访问：失败
```

## 三、创建商城前台

进入项目目录：

```bash
cd /Users/qintianpeng/2026/code/k8s
```

Deployment 文件为 `labs/08-Service排障/01-nginx-deployment.yaml`。在线阅读时，请先保存下面的完整内容：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: qingyun-mall-web
  labels:
    app: qingyun-mall
    tier: frontend
    environment: development
spec:
  replicas: 2
  selector:
    matchLabels:
      app: qingyun-mall
      tier: frontend
  template:
    metadata:
      labels:
        app: qingyun-mall
        tier: frontend
        environment: development
    spec:
      containers:
        - name: nginx
          image: nginx:1.27
          ports:
            - containerPort: 80
```

如果目录不存在，先执行：

```bash
mkdir -p labs/08-Service排障
```

创建 Deployment：

```bash
kubectl apply -f labs/08-Service排障/01-nginx-deployment.yaml
```

等待完成：

```bash
kubectl rollout status deployment/qingyun-mall-web
```

查看商城前台 Pod：

```bash
kubectl get pods -l 'app=qingyun-mall,tier=frontend'
```

应看到两个 `1/1 Running` Pod。这证明商城前台实例本身已经运行。

## 四、查看 Pod 的业务标签

执行：

```bash
kubectl get pods \
  -l 'app=qingyun-mall,tier=frontend' \
  --show-labels
```

可以看到：

```text
app=qingyun-mall,tier=frontend,environment=development
```

逗号表示条件同时成立：

```text
属于 qingyun-mall
并且属于 frontend 层
并且属于 development 环境
```

## 五、创建配置错误的 Service

错误文件：`labs/08-Service排障/02-错误选择器-service.yaml`

完整内容如下，其中错误点是 `tier: backend`：

```yaml
apiVersion: v1
kind: Service
metadata:
  name: qingyun-mall-web
  labels:
    app: qingyun-mall
    tier: frontend
    environment: development
spec:
  selector:
    app: qingyun-mall
    tier: backend
  ports:
    - name: http
      port: 80
      targetPort: 80
```

请把它保存到上面给出的错误文件路径。

创建：

```bash
kubectl apply -f labs/08-Service排障/02-错误选择器-service.yaml
```

仍然会成功：

```text
service/qingyun-mall-web created
```

## 六、为什么 Kubernetes 不阻止这个错误

`tier: backend` 在格式上完全合法。

Kubernetes 不理解商城的业务设计，不知道名为 `qingyun-mall-web` 的 Service 应该连接前端层，而不是后端层。

而且 Service 暂时没有后端也可能是正常的，例如 Service 先部署、Pod 稍后才上线。

所以必须区分：

```text
Kubernetes 接受配置
不等于
配置符合业务意图
```

## 七、确认表面现象

查看 Pod：

```bash
kubectl get pods -l 'app=qingyun-mall,tier=frontend'
```

两个 Pod 都是 Running。

查看 Service：

```bash
kubectl get service qingyun-mall-web
```

Service 也存在并拥有 ClusterIP。

但还没有证明 Service 找到了后端。

## 八、检查 Endpoints

执行：

```bash
kubectl describe service qingyun-mall-web
```

重点看：

```text
Selector:  app=qingyun-mall,tier=backend
Endpoints:
```

某些环境可能显示：

```text
Endpoints: <none>
```

空白和 `<none>` 含义相同：Service 当前没有后端地址。

```text
调用方
  ↓
Service qingyun-mall-web
  ↓
没有匹配的 Pod
  ✕
```

## 九、为什么 Pod Running 也没用

Pod Running 只说明容器运行了。

它不能证明 Service selector 能选中这些 Pod。

需要分两层检查：

```text
第一层：Pod 自己是否正常
第二层：Service 是否与 Pod 建立联系
```

本次第一层正常，第二层失败。

## 十、并排比较 selector 与 Label

Service selector：

```bash
kubectl describe service qingyun-mall-web
```

得到：

```text
app=qingyun-mall,tier=backend
```

Pod Label：

```bash
kubectl get pods -l app=qingyun-mall --show-labels
```

得到：

```text
app=qingyun-mall,tier=frontend,environment=development
```

并排比较：

```text
Service selector：app=qingyun-mall, tier=backend
Pod Label：       app=qingyun-mall, tier=frontend
                                       ↑
                                  层级不一致
```

根因已经确定：商城前台 Service 错选了后端层。

## 十一、直接验证 selector

把 Service selector 原样放进查询：

```bash
kubectl get pods -l 'app=qingyun-mall,tier=backend'
```

应该显示：

```text
No resources found
```

再查询正确层级：

```bash
kubectl get pods -l 'app=qingyun-mall,tier=frontend'
```

可以找到两个 Pod。

这是非常实用的排查方法：

```text
复制 Service selector
       ↓
放进 kubectl get pods -l
       ↓
确认它实际能选中谁
```

## 十二、修正 Service

正确文件：`labs/08-Service排障/03-正确选择器-service.yaml`

完整的正确文件如下：

```yaml
apiVersion: v1
kind: Service
metadata:
  name: qingyun-mall-web
  labels:
    app: qingyun-mall
    tier: frontend
    environment: development
spec:
  selector:
    app: qingyun-mall
    tier: frontend
  ports:
    - name: http
      port: 80
      targetPort: 80
```

请把它保存到上面给出的正确文件路径。

应用修复：

```bash
kubectl apply -f labs/08-Service排障/03-正确选择器-service.yaml
```

同名 Service 已存在，所以通常输出：

```text
service/qingyun-mall-web configured
```

`configured` 表示原对象被更新，不是创建了第二个 Service。

## 十三、确认 Endpoints 恢复

再次执行：

```bash
kubectl describe service qingyun-mall-web
```

现在应该看到：

```text
Selector:  app=qingyun-mall,tier=frontend
Endpoints: 10.1.0.x:80,10.1.0.y:80
```

链路已经恢复：

```text
Service qingyun-mall-web
选择 app=qingyun-mall,tier=frontend
                 ↓
两个商城前台 Web Pod
                 ↓
Endpoints 出现两个地址
```

整个修复过程不需要重启 Pod。

## 十四、实际访问

建立临时通道：

```bash
kubectl port-forward service/qingyun-mall-web 18080:80
```

等待出现：

```text
Forwarding from 127.0.0.1:18080 -> 80
```

浏览器访问：

```text
http://127.0.0.1:18080
```

看到 Nginx 欢迎页，证明请求已经通过 Service 到达商城前台 Web Pod。

完成后按 `Control + C`。

## 十五、分清三个位置

### `metadata.name`

```yaml
metadata:
  name: qingyun-mall-web
```

回答：这个具体 Deployment 叫什么？

### `metadata.labels`

```yaml
metadata:
  labels:
    app: qingyun-mall
    tier: frontend
    environment: development
```

回答：这个对象具有什么业务属性？

### `spec.selector`

```yaml
spec:
  selector:
    app: qingyun-mall
    tier: frontend
```

回答：我要选择具有什么属性的 Pod？

压缩成：

```text
metadata.name：我是谁
metadata.labels：我有哪些属性
spec.selector：我要选择谁
```

## 十六、固定排障顺序

遇到 Service 不通，按顺序检查：

```text
1. Pod 是否 Running / Ready？
   kubectl get pods

2. Service 是否存在？
   kubectl get service

3. Service 是否有 Endpoints？
   kubectl describe service

4. selector 与 Pod Label 是否一致？
   kubectl describe service
   kubectl get pods --show-labels

5. 把 selector 放入 -l 查询验证

6. 修复后执行真实请求
```

不要一上来重启 Pod。重启不会修正错误 selector。

## 十七、清理实验

删除 Service：

```bash
kubectl delete -f labs/08-Service排障/03-正确选择器-service.yaml
```

删除 Deployment：

```bash
kubectl delete -f labs/08-Service排障/01-nginx-deployment.yaml
```

确认：

```bash
kubectl get deployment,replicaset,service,pod \
  -l 'app=qingyun-mall,tier=frontend'
```

Pod 可能短暂显示 `Terminating`。稍等后再次查询，最终没有资源表示清理完成。

## 十八、问题与直接回答

### Service 创建成功为什么仍可能不通？

创建成功只说明格式合法。selector 可能没有匹配任何 Pod。

### Pod 全部 Running 为什么 Service 仍不通？

Pod 自己运行正常，与 Service 是否选中它们是两个不同层次。

### Endpoints 为空表示什么？

表示 Service 当前没有可以接收请求的后端地址。

### 为什么 `tier=backend` 不匹配 `tier=frontend`？

Label selector 是精确匹配，不会根据资源名字猜测业务意图。

### 怎样快速验证 selector？

把 selector 放进查询命令：

```bash
kubectl get pods -l 'app=qingyun-mall,tier=frontend'
```

### 修正 selector 后需要重启 Pod 吗？

通常不需要。Service 会重新匹配已有 Pod，Endpoints 会自动更新。

## 本课只记住五句话

1. 资源名表达具体组件，Label 表达稳定的业务属性。
2. Service 使用 `spec.selector` 精确匹配 Pod Label。
3. Pod Running 不代表 Service 链路正常。
4. Endpoints 为空表示 Service 当前没有后端。
5. 把 selector 放进 `kubectl get pods -l` 可以直接验证选择结果。

## 下一课预告

下一课学习集群 DNS。我们会创建一个临时客户端 Pod，不记 Service 的 ClusterIP，而是直接通过 `http://qingyun-mall-web` 访问商城前台。
