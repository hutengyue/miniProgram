var dataService = require('../../data/data-service.js')
var imageLoader = require('../../behaviors/image-loader.js')

Page({
  behaviors: [imageLoader],

  data: {
    brand: {}
  },

  onLoad: function() {
    getApp().globalData.currentTab = 1
    var that = this
    dataService.getBrand(function(brand) {
      if (!brand) return
      that.setData({ brand: brand })
    })
  },

  onShow: function() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1 })
    }
  },

  onCallPhone: function(e) {
    var phone = e.currentTarget.dataset.phone
    if (!phone) return
    wx.makePhoneCall({ phoneNumber: phone })
  },

  onShareAppMessage: function() {
    var brand = this.data.brand || {}
    return {
      title: (brand.brandName || '品牌故事') + ' · ' + (brand.slogan || ''),
      path: '/pages/brand/brand',
      imageUrl: brand.brandImage
    }
  },

  onShareTimeline: function() {
    return {
      title: (this.data.brand.brandName || 'HESEINT赫世') + ' · 探索美好秩序'
    }
  }
})
