var brandData = require('../../data/brand.js')

Page({
  data: {
    brand: brandData,
    statusBarHeight: 20
  },

  onLoad: function() {
    getApp().globalData.currentTab = 0
    var sysInfo = wx.getSystemInfoSync()
    this.setData({
      statusBarHeight: sysInfo.statusBarHeight || 20
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
