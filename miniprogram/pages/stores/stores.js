var dataService = require('../../data/data-service.js')

Page({
  data: {
    filteredStores: [],
    searchKeyword: ''
  },

  onLoad: function() {
    getApp().globalData.currentTab = 4
    var that = this
    dataService.getStores(function(stores) {
      if (!stores) return
      that.setData({
        filteredStores: stores.list
      })
      that._allStores = stores.list
    })
  },

  onShow: function() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 4 })
    }
  },

  onSearchInput: function(e) {
    var keyword = e.detail.value.trim()
    if (!keyword) {
      this.setData({
        searchKeyword: '',
        filteredStores: this._allStores
      })
      return
    }
    var filtered = this._allStores.filter(function(s) {
      return s.city.indexOf(keyword) > -1 ||
             s.cityEn.toLowerCase().indexOf(keyword.toLowerCase()) > -1 ||
             s.address.indexOf(keyword) > -1
    })
    this.setData({
      searchKeyword: keyword,
      filteredStores: filtered
    })
  },

  onClearSearch: function() {
    this.setData({
      searchKeyword: '',
      filteredStores: this._allStores
    })
  },

  onNavigate: function(e) {
    wx.showToast({
      title: '导航功能开发中',
      icon: 'none'
    })
  },

  onCopyAddress: function(e) {
    var address = e.currentTarget.dataset.address
    wx.setClipboardData({
      data: address,
      success: function() {
        wx.showToast({
          title: '地址已复制',
          icon: 'success'
        })
      }
    })
  }
})
