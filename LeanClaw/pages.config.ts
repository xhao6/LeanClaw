import { defineUniPages } from '@uni-helper/vite-plugin-uni-pages'

export default defineUniPages({
  pages: [], // Pages are auto-scanned from src/pages
  globalStyle: {
    navigationBarTextStyle: 'black',
    navigationBarTitleText: 'LeanClaw',
    navigationBarBackgroundColor: '#F8F8F8',
    backgroundColor: '#F8F8F8',
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
        iconPath: 'static/tabbar/home.png',
        selectedIconPath: 'static/tabbar/home-active.png',
      },
      {
        pagePath: 'pages/learn/index',
        text: '学习',
        iconPath: 'static/tabbar/learn.png',
        selectedIconPath: 'static/tabbar/learn-active.png',
      },
      {
        pagePath: 'pages/discover/index',
        text: '发现',
        iconPath: 'static/tabbar/discover.png',
        selectedIconPath: 'static/tabbar/discover-active.png',
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的',
        iconPath: 'static/tabbar/profile.png',
        selectedIconPath: 'static/tabbar/profile-active.png',
      },
    ],
  },
})
