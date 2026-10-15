var dataService = require('../../data/data-service.js')
var imageLoader = require('../../behaviors/image-loader.js')

Page({
  behaviors: [imageLoader],

  data: {
    contact: {}
  },

  onLoad: function() {
    getApp().globalData.currentTab = 4
    var that = this
    dataService.getContact(function(contact) {
      if (!contact) return
      that.setData({ contact: contact })
    })
  },

  onShow: function() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 4 })
    }
  },

  onCallPhone: function(e) {
    var phone = e.currentTarget.dataset.phone
    if (!phone) return
    wx.makePhoneCall({ phoneNumber: phone })
  },

  // 打开地图导航到公司地址
  onOpenMap: function(e) {
    var d = e.currentTarget.dataset
    if (!d.lat || !d.lng) {
      wx.showToast({ title: '暂无坐标信息', icon: 'none' })
      return
    }
    wx.openLocation({
      latitude: Number(d.lat),
      longitude: Number(d.lng),
      name: d.name,
      address: d.detail,
      scale: 17
    })
  },

  onShareAppMessage: function() {
    return {
      title: 'HESEINT赫世 · 联系我们',
      path: '/pages/stores/stores'
    }
  },

  onShareTimeline: function() {
    return {
      title: 'HESEINT赫世 · 联系我们'
    }
  }
})
