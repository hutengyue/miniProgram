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
        transparent: this.data.swiperIndex === 0
      })
    }
  },

  onSwiperChange: function(e) {
    var index = e.detail.current
    this.setData({ swiperIndex: index })
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ transparent: index === 0 })
    }
  },

  onExplore: function(e) {
    var url = e.currentTarget.dataset.tab
    if (url) {
      wx.switchTab({ url: url })
    }
  }
})
