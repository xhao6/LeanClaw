import { defineUniPages } from '@uni-helper/vite-plugin-uni-pages'

export default defineUniPages({
  globalStyle: {
    navigationBarTextStyle: 'black',
    navigationBarTitleText: 'LeanClaw',
    navigationBarBackgroundColor: '#F8F8F8',
    backgroundColor: '#F8F8F8',
  },
  easycom: {
    autoscan: true,
    custom: {
      '^wd-(.*)': 'wot-design-uni/components/wd-$1/wd-$1.vue',
    },
  },
  tabBar: {
    color: '#999',
    selectedColor: '#1E3A5F',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: 'static/tabbar/home.svg',
        selectedIconPath: 'static/tabbar/home-active.svg',
      },
      {
        pagePath: 'pages/learn/index',
        text: '学习',
        iconPath: 'static/tabbar/learn.svg',
        selectedIconPath: 'static/tabbar/learn-active.svg',
      },
      {
        pagePath: 'pages/discover/index',
        text: '发现',
        iconPath: 'static/tabbar/discover.svg',
        selectedIconPath: 'static/tabbar/discover-active.svg',
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的',
        iconPath: 'static/tabbar/profile.svg',
        selectedIconPath: 'static/tabbar/profile-active.svg',
      },
    ],
  },
})
