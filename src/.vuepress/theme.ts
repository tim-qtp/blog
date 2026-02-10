import { hopeTheme } from 'vuepress-theme-hope'
import { zhNavbar } from './navbar/index.js'
import { zhSidebar } from './sidebar/index.js'

export default hopeTheme({
  hostname: 'https://tim-qtp.github.io/blog/',

  author: {
    name: 'tim-qtp',
    url: 'https://github.com/tim-qtp/',
  },

  // 同时支持自定义 iconfont 和 Iconify（用于 AI 模块等）
  iconAssets: [
    '//at.alicdn.com/t/c/font_4791007_okdeb3ol9qj.css',
    'iconify'
  ],
  

  logo: '/logo.svg',

  repo: 'tim-qtp/blog',

  docsDir: 'demo/theme-docs/src',

  locales: {
    '/': {
      // navbar
      navbar: zhNavbar,

      // sidebar
      sidebar: zhSidebar,

      footer: '默认页脚',

      displayFooter: true,

      // page meta
      metaLocales: {
        editLink: '在 GitHub 上编辑此页',
      },
    },
  },
  encrypt: {
    config: {
      '/projectessay/practicalProjects/imageLibrary/10.Team Space.html': ['tim1234'],
      '/projectessay/practicalProjects/imageLibrary/11.Collaborative photo editing.html': ['tim1234'],
      '/projectessay/practicalProjects/flashSale/': ['tim1234'],
    },
  },

  plugins: {
    comment: {
      provider: 'Waline',
    },

    // all features are enabled for demo, only preserve features you need here
    mdEnhance: {
      align: true,
      attrs: true,
      chart: true,
      codetabs: true,
      demo: true,
      echarts: true,
      figure: true,
      flowchart: true,
      gfm: true,
      imgLazyload: true,
      imgSize: true,
      include: true,
      katex: true,
      mark: true,
      mermaid: true,
      playground: {
        presets: ['ts', 'vue'],
      },
      presentation: {
        plugins: ['highlight', 'math', 'search', 'notes', 'zoom'],
      },
      stylize: [
        {
          matcher: 'Recommended',
          replacer: ({ tag }) => {
            if (tag === 'em')
              return {
                tag: 'Badge',
                attrs: { type: 'tip' },
                content: 'Recommended',
              }
          },
        },
      ],
      sub: true,
      sup: true,
      tabs: true,
      vPre: true,
      vuePlayground: true,
    },
    // pwa: {
    //   hintComponent: '检测到新内容，点击刷新',
    // },
    // uncomment these if you want a pwa
    pwa: {
      favicon: "/favicon.ico",
      cacheHTML: true,
      cachePic: true,
      appendBase: true,
      apple: {
        icon: "/assets/icon/apple-icon-152.png",
        statusBarColor: "black",
      },
      msTile: {
        image: "/assets/icon/ms-icon-144.png",
        color: "#ffffff",
      },
      manifest: {
        icons: [
          {
            src: "/assets/icon/chrome-mask-512.png",
            sizes: "512x512",
            purpose: "maskable",
            type: "image/png",
          },
          {
            src: "/assets/icon/chrome-mask-192.png",
            sizes: "192x192",
            purpose: "maskable",
            type: "image/png",
          },
          {
            src: "/assets/icon/chrome-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/assets/icon/chrome-192.png",
            sizes: "192x192",
            type: "image/png",
          },
        ],
        shortcuts: [
          {
            name: "Demo",
            short_name: "Demo",
            url: "/demo/",
            icons: [
              {
                src: "/assets/icon/guide-maskable.png",
                sizes: "192x192",
                purpose: "maskable",
                type: "image/png",
              },
            ],
          },
        ],
      },
    },
  },
})
