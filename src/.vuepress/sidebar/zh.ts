import { sidebar } from "vuepress-theme-hope";

export const zhSidebar = sidebar({
  "/": [
    {
      icon: "build",
      text: "一、计算机基础",
      collapsible: true,
      prefix: "fundamental/",
      children: [
        {
          icon: "activity",
          text: "计网",
          prefix: "network/",
          children: "structure",
          collapsible: true,
        },
        {
          icon: "branch",
          text: "操作系统",
          prefix: "operating_system/",
          children: "structure",
          collapsible: true,
        },
        {
          icon: "profile",
          text: "设计模式",
          prefix: "design_atterns/",
          children: "structure",
          collapsible: true,
        },
        {
          icon: "leaf",
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
          icon: "activity",
          text: "基础",
          prefix: "basic",
          children: "structure",
          collapsible: true,
        },
        {
          icon: "branch",
          text: "并发",
          prefix: "concurrent",
          children: "structure",
          collapsible: true,
        },
        {
          icon: "profile",
          text: "面试",
          prefix: "interview",
          children: "structure",
          collapsible: true,
        },
        {
          icon: "leaf",
          text: "框架",
          prefix: "framework",
          children: "structure",
          collapsible: true,
        },
        {
          icon: "async",
          text: "Mysql",
          prefix: "mysql",
          children: "structure",
          collapsible: true,
        },
        {
          icon: "launch",
          text: "Spring",
          prefix: "spring",
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
      icon: "light",
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
      icon: "repair",
      text: "五、项目随笔",
      prefix: "projectessay/",
      collapsible: true,
      children: [
        {
          icon: "branch",
          text: "技术细节",
          prefix: "technicalDetails",
          children: "structure",
          collapsible: true,
        },
        {
          icon: "profile",
          text: "bug修复",
          prefix: "concurrent",
          children: "structure",
          collapsible: true,
        },
        {
          icon: "leaf",
          text: "经验教训",
          prefix: "eightpart",
          children: "structure",
          collapsible: true,
        },
        {
          icon: "launch",
          text: "脚手架",
          prefix: "fm",
          children: "structure",
          collapsible: true,
        }
      ]
    },
    {
      icon: "autumn",
      text: "六、好物推荐",
      prefix: "recommend",
      children: "structure",
      collapsible: true,
    },
  ],
});
