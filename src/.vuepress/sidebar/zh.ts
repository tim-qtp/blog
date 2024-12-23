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
      text: "四、框架",
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
      text: "五、微服务中间件",
      collapsible: true,
      prefix: "microservices/",
      children: [
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
          icon: "gateway",
          text: "Gateway",
          prefix: "gateway/",
          children: "structure", 
          collapsible: true,
        },
        {
          icon: "hystrix",
          text: "Netflix Hystrix",
          prefix: "hystrix/",
          children: "structure", 
          collapsible: true,
        },
      ]
    },
    {
      icon: "interview",
      text: "五、面试",
      prefix: "interview/",
      children: "structure",
      collapsible: true,
    },
    {
      icon: "essay",
      text: "六、项目随笔",
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
          icon: "bug",
          text: "bug修复",
          prefix: "concurrent",
          children: "structure",
          collapsible: true,
        },
        {
          icon: "rocket",
          text: "经验教训",
          prefix: "eightpart",
          children: "structure",
          collapsible: true,
        },
        {
          icon: "scaffold",
          text: "脚手架",
          prefix: "fm",
          children: "structure",
          collapsible: true,
        }
      ]
    },
    {
      icon: "github",
      text: "七、开源推荐",
      prefix: "opensource/",
      children: "structure",
      collapsible: true,
    },
  ],
  "/life/": [
    {
      icon: "vscode",
      text: "二、神龟",
      prefix: "life",
      children: "structure",
      collapsible: true,
    },
  ],
  "/about/" : [],
});
