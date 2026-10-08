var brandInfo = require('../../data/brand.js')

Page({
  data: {
    brand: brandInfo
  },

  onLoad: function() {
    getApp().globalData.currentTab = 1
  },

  onShow: function() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1 })
    }
  }
})
