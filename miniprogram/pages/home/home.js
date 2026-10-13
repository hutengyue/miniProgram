var dataService = require('../../data/data-service.js')

Page({
  data: {
    brand: {},
    statusBarHeight: 20,
    swiperIndex: 0,
    slides: []
  },

  onLoad: function() {
    getApp().globalData.currentTab = 0
    var that = this
    var sysInfo = wx.getSystemInfoSync()
    that.setData({ statusBarHeight: sysInfo.statusBarHeight || 20 })
    dataService.getBrand(function(brand) {
      if (brand) {
        that.setData({ brand: brand })
      }
    })
    dataService.getHomeSlides(function(slides) {
      if (slides && slides.length) {
        that.setData({ slides: slides })
      }
    })
  },

  onShow: function() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0,
        transparent: true
      })
    }
  },

  onSwiperChange: function(e) {
    var index = e.detail.current
    this.setData({ swiperIndex: index })
    // 首页全程沉浸式，始终透明
  },

  onExplore: function(e) {
    var url = e.currentTarget.dataset.tab
    if (url) {
      wx.switchTab({ url: url })
    }
  },

  onShareAppMessage: function() {
    return {
      title: 'LORBN劳宾 · 设计师品牌·定制卫浴',
      path: '/pages/home/home'
    }
  },

  onShareTimeline: function() {
    return {
      title: 'LORBN劳宾 · 设计师品牌·定制卫浴'
    }
  }
})
