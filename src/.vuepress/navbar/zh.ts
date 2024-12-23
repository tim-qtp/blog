import { navbar } from 'vuepress-theme-hope'

export const zhNavbar = navbar([
  { text: '主页', icon: 'home', link: '/' },
  { text: '笔记', icon: 'discover', link: '/intro/' },
  { text: '生活', icon: 'life', link: '/life/' },
  { text: '关于我', icon: 'about', link: '/about/' },
  // {
  //   text: '指南',
  //   icon: 'creative',
  //   prefix: '/guide/',
  //   children: [
  //     {
  //       text: 'Bar',
  //       icon: 'creative',
  //       prefix: 'bar/',
  //       children: ['baz', { text: '...', icon: 'more', link: '' }],
  //     },
  //     {
  //       text: 'Foo',
  //       icon: 'config',
  //       prefix: 'foo/',
  //       children: ['ray', { text: '...', icon: 'more', link: '' }],
  //     },
  //   ],
  // },
])
