---
order: 9
author: 
title: "git push出现网络问题"
category:
  - Git
---

git push时，显示以下错误，是我正在是用代理服务器-梯子！

而git正好没有配置代理！

```bash
fatal: unable to access 'https://github.com/tim-qtp/kuang-concurrent.git/': Recv failure: Connection was reset
```

**为什么浏览器可以自动翻墙，而 Git 不行？**

浏览器自动翻墙是因为代理工具通常在**系统层面**或**浏览器层面**配置了代理，而浏览器会自动读取这些设置。

Git 不自动翻墙是因为它不会读取系统或浏览器的代理设置，而是需要用户显式指定代理。



最后，设置完成后，可以通过以下命令检验是否设置成功：

```sh
git config --global -l
```

![](https://qtp-1324720525.cos.ap-shanghai.myqcloud.com/blog/image-20250106214518121.png)

