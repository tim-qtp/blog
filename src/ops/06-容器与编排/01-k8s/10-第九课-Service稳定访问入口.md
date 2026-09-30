---
order: 11
title: "第九课：Service 稳定访问入口"
category:
  - 综合运维
  - 容器与编排
  - k8s
---
# 第九课：Service 稳定访问入口

## 这节课只解决一个问题

Deployment 管理的 Pod 随时可能被删除和替换，Pod 名称和 IP 都可能变化。调用方应该怎样稳定访问应用？

答案是：在 Pod 前面增加 Service。

```text
调用方
  ↓
Service：稳定入口
  ↓
当前可用的 Pod
```

## 一、为什么不能直接记住 Pod IP

Pod 运行后会获得一个 IP：

```text
Pod A → 10.1.0.31
Pod B → 10.1.0.32
```

但上一课已经看到，更新、扩缩容和故障恢复都会替换 Pod。

例如 Pod A 被删除后，新 Pod 可能变成：

```text
旧 Pod A → 10.1.0.31，已删除
新 Pod C → 10.1.0.35，新建
```

如果其他应用把 `10.1.0.31` 写死，Pod 替换后就找不到 Nginx。

Pod IP 应当被看作运行期间的临时地址，不适合作为长期服务入口。

## 二、把 Service 理解成前台总机

公司员工会更换座位和分机，但客户只需要拨打公司总机。

```text
客户
  ↓
公司总机：稳定号码
  ├── 员工 A：当前分机
  └── 员工 B：当前分机
```

对应到 Kubernetes：

```text
调用方
  ↓
Service：稳定入口
  ├── Pod A：当前 IP
  └── Pod B：当前 IP
```

Pod 被替换后，Service 后面的 Pod 清单会更新，而调用方继续访问同一个 Service。

## 三、准备两个 Nginx Pod

Deployment 文件：`labs/07-Service/01-nginx-deployment.yaml`

它会创建两个带相同 Label 的 Nginx Pod：

```yaml
replicas: 2
```

```yaml
labels:
  app: qingyun-mall
```

进入项目目录：

```bash
cd /Users/qintianpeng/2026/code/k8s
```

创建 Deployment：

```bash
kubectl apply -f labs/07-Service/01-nginx-deployment.yaml
```

等待完成：

```bash
kubectl rollout status deployment/qingyun-mall-web
```

查看 Pod 名称和 IP：

```bash
kubectl get pods -l 'app=qingyun-mall,tier=frontend' -o wide
```

记录当前两个 Pod 的 `NAME` 和 `IP`。实际名称和 IP 以你的输出为准。

## 四、创建 Service

Service 文件：`labs/07-Service/02-nginx-service.yaml`

```yaml
apiVersion: v1
kind: Service
metadata:
  name: qingyun-mall-web
  labels:
    app: qingyun-mall
spec:
  selector:
    app: qingyun-mall
  ports:
    - name: http
      port: 80
      targetPort: 80
```

创建：

```bash
kubectl apply -f labs/07-Service/02-nginx-service.yaml
```

正常输出：

```text
service/qingyun-mall-web created
```

## 五、理解 Service YAML

### `kind: Service`

表示创建一个 Service 对象：

```yaml
kind: Service
```

### `selector`：选择哪些 Pod

```yaml
selector:
  app: qingyun-mall
```

意思是：

```text
寻找带有 app=qingyun-mall 标签的 Pod
```

Deployment 创建的 Pod 恰好带有这个 Label：

```text
Pod A [app=qingyun-mall]
Pod B [app=qingyun-mall]
```

所以它们会成为 Service 后面的目标。

Service 不通过 Pod 名称建立关系，而是通过 Label 选择一组 Pod。

### `port` 和 `targetPort`

```yaml
port: 80
targetPort: 80
```

先这样理解：

```text
访问 Service 的 80 端口
          ↓
转到 Pod 的 80 端口
```

- `port`：Service 对调用方提供的端口；
- `targetPort`：Pod 中应用实际接收请求的端口。

这次两边都使用 80，所以数字相同，但它们代表两个不同位置。

## 六、查看 Service

执行：

```bash
kubectl get service qingyun-mall-web
```

可能看到：

```text
NAME              TYPE        CLUSTER-IP     PORT(S)
qingyun-mall-web         ClusterIP   10.96.x.x      80/TCP
```

现在只看三项：

### `TYPE: ClusterIP`

这是默认 Service 类型，表示它主要提供集群内部访问入口。

你的 Mac 浏览器不能把这个 ClusterIP 当普通公网地址直接访问，所以本课仍使用 `port-forward` 做本地验证。

### `CLUSTER-IP`

这是 Service 在集群内部的稳定虚拟地址。只要 Service 没有被删除重建，它通常保持不变。

### `PORT(S): 80/TCP`

表示 Service 使用 TCP 80 端口。

## 七、查看 Service 当前指向谁

执行：

```bash
kubectl describe service qingyun-mall-web
```

重点看：

```text
Selector:  app=qingyun-mall
Endpoints: 10.1.0.x:80,10.1.0.y:80
```

`Endpoints` 可以先理解成 Service 当前找到的 Pod 地址清单。

它应该对应前面两个 Nginx Pod 的 IP 和 80 端口：

```text
Service qingyun-mall-web:80
├── Pod A IP:80
└── Pod B IP:80
```

如果 `Endpoints` 显示为空，通常要先检查 Service selector 与 Pod Label 是否一致。

## 八、通过 Service 访问 Nginx

执行：

```bash
kubectl port-forward service/qingyun-mall-web 18080:80
```

等待出现：

```text
Forwarding from 127.0.0.1:18080 -> 80
```

再用浏览器访问：

```text
http://127.0.0.1:18080
```

看到 `Welcome to nginx!` 表示：

```text
浏览器
  ↓ Mac 18080
port-forward
  ↓ Service 80
Service 选择的 Nginx Pod
  ↓
Nginx 欢迎页面
```

完成后按 `Control + C` 停止转发。

注意：port-forward 仍然只是本地调试通道。本课要验证的是 Service 能找到 Pod，不把 port-forward 当成生产入口。

## 九、记录 Service IP

执行：

```bash
kubectl get service qingyun-mall-web
```

记录 `CLUSTER-IP`，稍后删除一个 Pod 后再次对比。

## 十、删除一个 Pod

先列出 Pod：

```bash
kubectl get pods -l 'app=qingyun-mall,tier=frontend' -o wide
```

复制任意一个 Pod 的完整名称，然后执行：

```bash
kubectl delete pod <复制的Pod名称>
```

不要把尖括号原样输入。例如：

```bash
kubectl delete pod qingyun-mall-web-xxxxxxxxxx-abcde
```

Deployment 会补充一个新的 Pod。

持续观察：

```bash
kubectl get pods -l 'app=qingyun-mall,tier=frontend' -o wide -w
```

等到重新有两个 `1/1 Running` Pod 后按 `Control + C`。

对比会发现：

- 被删除 Pod 的名称消失；
- 新 Pod 名称不同；
- 新 Pod IP 通常也不同。

## 十一、Service 不需要手工修改

再次查看 Service：

```bash
kubectl get service qingyun-mall-web
```

`CLUSTER-IP` 应与删除 Pod 前相同。

再看详细信息：

```bash
kubectl describe service qingyun-mall-web
```

`Endpoints` 应自动移除旧 Pod IP，并加入新 Pod IP：

```text
替换前：
Service → Pod A IP、Pod B IP

Pod A 被删除，新 Pod C 出现

替换后：
Service → Pod B IP、Pod C IP
```

整个过程中，我们没有手工编辑 Service。

原因是 Service 按 Label 寻找当前 Pod，而不是写死 Pod 名称或 IP。

## 十二、再次通过 Service 访问

执行：

```bash
kubectl port-forward service/qingyun-mall-web 18080:80
```

看到 `Forwarding` 后，再访问：

```text
http://127.0.0.1:18080
```

仍应看到 Nginx 欢迎页面。完成后按 `Control + C`。

注意，我们是等新 Pod 稳定后重新建立 port-forward。这一实验不能用来证明 port-forward 本身具有持续故障切换能力；它只验证替换后 Service 仍有正确后端。

## 十三、Service 和 Deployment 各管什么

```text
Deployment
负责：Pod 要有几个、使用什么模板

Service
负责：为一组 Pod 提供稳定访问入口
```

组合起来：

```text
             Deployment
                 ↓ 创建和替换
调用方 → Service → Pod A
                 → Pod B
```

Deployment 解决“应用实例怎么长期存在”，Service 解决“调用方怎么找到不断变化的实例”。

## 十四、Service 会启动 Nginx 吗

不会。

Service 不运行应用，也不创建 Pod。它只根据 selector 找到已有 Pod，并提供访问入口。

因此如果 Deployment 被删除，只留下 Service：

```text
Service 对象仍可能存在
但 Endpoints 为空
请求没有后端可以处理
```

## 十五、清理顺序

先删除 Service：

```bash
kubectl delete -f labs/07-Service/02-nginx-service.yaml
```

再删除 Deployment：

```bash
kubectl delete -f labs/07-Service/01-nginx-deployment.yaml
```

最后确认：

```bash
kubectl get deployment,service,pod -l 'app=qingyun-mall,tier=frontend'
```

最终没有课程资源，表示清理完成。

## 十六、问题与直接回答

### 为什么不能让其他应用直接记住 Pod IP？

因为 Pod 被更新、扩缩容或故障替换后，名称和 IP 都可能变化。

### Service 自己运行 Nginx 吗？

不运行。Service 只是入口，真正处理请求的是后面的 Pod。

### Service 怎样找到 Pod？

通过 selector 匹配 Pod 的 Label。本课匹配条件是 `app=qingyun-mall`。

### `port` 和 `targetPort` 有什么区别？

`port` 是 Service 对调用方提供的端口，`targetPort` 是 Pod 中应用接收请求的端口。

### `ClusterIP` 能直接从互联网访问吗？

通常不能。它主要用于集群内部访问。浏览器实验通过 port-forward 建立临时通道。

### Pod 替换后为什么不用修改 Service？

因为 Service 不写死 Pod IP，而是持续根据 Label 找到当前符合条件的 Pod。

### Service 存在是否代表一定有应用可以处理请求？

不代表。Service 的 Endpoints 可能为空，所以还要检查它是否真正找到了可用 Pod。

## 本课只记住五句话

1. Pod IP 会随 Pod 替换而变化，不适合作为长期入口。
2. Service 为一组 Pod 提供稳定的集群内访问入口。
3. Service 通过 selector 匹配 Pod Label，而不是记住 Pod 名称。
4. `port` 是 Service 端口，`targetPort` 是 Pod 应用端口。
5. Service 存在不等于后端存在，要用 describe 检查 Endpoints。

## 下一课预告

下一课专门制造一次 Service 无法访问的故障：故意把 selector 写错。你会看到 Pod 全部 Running，但 Service 的 Endpoints 为空，并学会沿“Service → Label → Pod”这条链定位问题。
