import { sidebar } from "vuepress-theme-hope";

export const zhSidebar = sidebar({
  "/": [
    {
      icon: "computer",
      text: "一、计算机基础",
      collapsible: true,
      prefix: "fundamental/",
      children: [
        {
          icon: "network",
          text: "计网",
          prefix: "network/",
          children: "structure",
          collapsible: true,
        },
        {
          icon: "os",
          text: "操作系统",
          prefix: "operating_system/",
          children: "structure",
          collapsible: true,
        },
        {
          icon: "pattern",
          text: "设计模式",
          prefix: "design_atterns/",
          children: "structure",
          collapsible: true,
        },
        {
          icon: "linux",
          text: "linux",
          prefix: "linux/",
          children: "structure",
          collapsible: true,
        }
      ]
    },
    {
      icon: "vscode",
      text: "二、前端",
      prefix: "frontend",
      children: "structure",
      collapsible: true,
    },
    {
      icon: "java",
      text: "三、Java",
      collapsible: true,
      prefix: "Java/",
      children: [
        {
          icon: "basis",
          text: "基础",
          prefix: "basic",
          children: "structure",
          collapsible: true,
        },
        {
          icon: "collections",
          text: "集合",
          prefix: "collections",
          children: "structure",
          collapsible: true,
        },
        {
          icon: "concurrent",
          text: "并发",
          prefix: "concurrent",
          children: "structure",
          collapsible: true,
        },
        {
          icon: "jvm",
          text: "JVM",
          prefix: "jvm",
          children: "structure",
          collapsible: true,
        },
        {
          icon: "redis",
          text: "Redis",
          prefix: "redis",
          children: "structure",
          collapsible: true,
        },
        {
          icon: "mysql",
          text: "Mysql",
          prefix: "mysql",
          children: "structure",
          collapsible: true,
        },
        {
          icon: "leetcode",
          text: "LeetCode刷题",
          prefix: "leetcode",
          children: "structure",
          collapsible: true,
        },
        {
          icon: "git",
          text: "Git",
          prefix: "git",
          children: "structure",
          collapsible: true,
        },
      ]
    },
    {
      icon: "rust",
      text: "四、Rust",
      prefix: "rust",
      children: "structure",
      collapsible: true,
    },

    // {
    //   icon: "repair",
    //   text: "项目经验",
    //   prefix: "project",
    //   children: "structure",
    //   collapsible: true,
    // },
    {
      icon: "framework",
      text: "五、框架",
      collapsible: true,
      prefix: "framework/",
      children: [
        {
          icon: "spring",
          text: "Spring",
          prefix: "spring/",
          children: "structure",
          collapsible: true,
        },
        {
          icon: "springboot",
          text: "SpringBoot",
          prefix: "springboot/",
          children: "structure",
          collapsible: true,
        },
        {
          icon: "springcloud",
          text: "SpringCloud",
          prefix: "springcloud/",
          children: "structure",
          collapsible: true,
        },
        {
          icon: "netty",
          text: "Netty",
          prefix: "netty/",
          children: "structure",
          collapsible: true,
        },
        {
          icon: "mybatis",
          text: "MyBatis",
          prefix: "mybatis/",
          children: "structure",
          collapsible: true,
        }
      ]
    },
    {
      icon: "microservices",
      text: "六、微服务中间件",
      collapsible: true,
      prefix: "microservices/",
      children: [
        {
          icon: "docker",
          text: "Docker",
          prefix: "docker/",
          children: "structure", 
          collapsible: true,
        },
        {
          icon: "nacos",
          text: "Nacos",
          prefix: "nacos/",
          children: "structure",
          collapsible: true,
        },
        {
          icon: "rocketmq",
          text: "RocketMQ",
          prefix: "rocketmq/",
          children: "structure",
          collapsible: true,
        },
        {
          icon: "elasticsearch",
          text: "Elasticsearch",
          prefix: "elasticsearch/",
          children: "structure",
          collapsible: true,
        },
        {
          icon: "dubbo",
          text: "Dubbo",
          prefix: "dubbo/",
          children: "structure", 
          collapsible: true,
        },
        {
          icon: "sentinel",
          text: "Sentinel",
          prefix: "sentinel/",
          children: "structure", 
          collapsible: true,
        }
      ]
    },
    {
      icon: "interview",
      text: "七、面试",
      prefix: "interview/",
      children: "structure",
      collapsible: true,
    },
    {
      icon: "essay",
      text: "八、项目随笔",
      prefix: "projectessay/",
      collapsible: true,
      children: [
        {
          icon: "experience",
          text: "技术细节",
          prefix: "technicalDetails",
          children: "structure",
          collapsible: true,
        },
        {
          icon: "project3",
          text: "实战项目",
          prefix: "practicalProjects/",
          collapsible: true,
          children: [
            {
              icon: "shortlink",
              text: "短链接",
              prefix: "shortlink",
              children: "structure",
              collapsible: true,
            },
            {
              icon: "imageLibrary",
              text: "智能图库",
              prefix: "imageLibrary",
              children: "structure",
              collapsible: true,
            },
            {
              icon: "logistics",
              text: "神领物流",
              prefix: "logistics",
              children: "structure",
              collapsible: true,
            },
            {
              icon: "oj",
              text: "刷题OJ平台",
              prefix: "oj",
              children: "structure",
              collapsible: true,
            },
            {
              icon: "onlineEducation",
              text: "学成在线",
              prefix: "onlineEducation",
              children: "structure",
              collapsible: true,
            },
            {
              icon: "flashSale",
              text: "秒杀系统",
              prefix: "flashSale",
              children: "structure",
              collapsible: true,
            } 
          ],
        },        
        {
          icon: "bug",
          text: "bug修复",
          prefix: "concurrent",
          children: "structure",
          collapsible: true,
        },
        {
          icon: "rocket",
          text: "经验教训",
          prefix: "lessonsLearned",
          children: "structure",
          collapsible: true,
        },
        {
          icon: "scaffold",
          text: "脚手架",
          prefix: "scaffold",
          children: "structure",
          collapsible: true,
        }
      ]
    },
    {
      icon: "github",
      text: "九、开源推荐",
      prefix: "opensource/",
      collapsible: true,
      children: "structure"
    },
    {
      icon: "xiayu",
      text: "十、技术琐碎",
      collapsible: true,
      prefix: "rain/",
      children: [
        {
          icon: "clash",
          text: "Clash",
          prefix: "clash",
          collapsible: true,
          children: [
            "1.Openclash",
            "2.IPLeak",
            "3.LAN sharing",
            "4.Clash Verge Rev",
            "5.R2S install openwrt system",
            "6.Self-built nodes",
            "7.Various proxy issues",
            "8.DNS Leak",
            "9.Rule",
          ],
        },
        {
          icon: "encryption",
          text: "加解密",
          prefix: "encryption and decryption",
          collapsible: true,
          children: [
            "1.Symmetric encryption and symmetric encryption",
            "2.RSA"
          ],
        },
        "1.VPN",
        "2.Soft Router Prerequisite Home Network Communication",
        "3.Side Router"
      ]
    },
  ],
  "/life/": [
    {
      icon: "java",
      text: "一、碎嘴",
      prefix: "life",
      children: "structure",
      collapsible: true,
    },
  ],
  "/about/" : [],
});
