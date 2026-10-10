var dataService = require('../../data/data-service.js')

Page({
  data: {
    brand: {},
    statusBarHeight: 20
  },

  onLoad: function() {
    getApp().globalData.currentTab = 0
    var that = this
    var sysInfo = wx.getSystemInfoSync()
    that.setData({ statusBarHeight: sysInfo.statusBarHeight || 20 })
    dataService.getBrand(function(brand) {
      if (brand) that.setData({ brand: brand })
    })
  },

  onShow: function() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 })
    }
  },

  onExplore: function() {
    wx.switchTab({
      url: '/pages/brand/brand'
    })
  }
})
