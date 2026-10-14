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
