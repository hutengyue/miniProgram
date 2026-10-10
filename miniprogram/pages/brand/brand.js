var dataService = require('../../data/data-service.js')

Page({
  data: {
    brand: {},
    currentPanoramaIndex: 0,
    showHint: true
  },

  _panoramaStartX: 0,
  _panoramaStartOffsetX: 0,

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

  onSwitchPanorama: function(e) {
    var index = e.currentTarget.dataset.index
    if (index === this.data.currentPanoramaIndex) return
    this.setData({
      currentPanoramaIndex: index,
      showHint: true
    })
  },

  onPanoramaTouchStart: function(e) {
    this._panoramaStartX = e.touches[0].clientX
    this._panoramaStartOffsetX = this.data.panoramaOffsetX
    this.setData({ panoramaDragged: true })
  },

  onPanoramaTouchMove: function(e) {
    var deltaX = e.touches[0].clientX - this._panoramaStartX
    var sysInfo = wx.getSystemInfoSync()
    var pxToRpx = 750 / sysInfo.windowWidth
    var newOffsetX = this._panoramaStartOffsetX + deltaX * pxToRpx
    var minOffset = -750
    var maxOffset = 0
    if (newOffsetX > maxOffset) {
      newOffsetX = newOffsetX + minOffset
    } else if (newOffsetX < minOffset) {
      newOffsetX = newOffsetX - minOffset
    }
    this.setData({ panoramaOffsetX: newOffsetX })
  },

  onPanoramaTouchEnd: function() {}
})
