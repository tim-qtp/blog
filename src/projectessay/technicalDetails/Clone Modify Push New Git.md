---
order: 1
author: 
title: "IntelliJ IDEA拉取开源项目进行修改后上传到自己的git仓库"
category:
  - IntelliJ IDEA
  - Git

---

## 🍂 IntelliJ IDEA修改git origin

1、进入项目终端或者idea的Terminal查看代码已绑定的git仓库地址

```bash
git remote -v
```

2、删除本地关联的git仓库地址

```bash
git remote rm origin
```

3、本地代码关联新的仓库地址

```bash
git remote add origin 新地址
```

4、再次查看本地代码关联的git仓库地址是否正确

```bash
git remote -v
```

5、确认无误后即可再次提交和推送代码



或者直接用IDEA Git工具：

![Manage Remotes](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20250102123024413.png)



或者还有一个方法，也挺实用：

clone后删除与git有关的所有文件，然后用idea打开项目，左上角点击git，然后share到github仓库，这里会让你登录，浏览器授权即可。

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/202503011321334.png)