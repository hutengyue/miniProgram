var brandInfo = require('../../data/brand.js')

Page({
  data: {
    brand: brandInfo,
    currentPanorama: brandInfo.panoramas[0],
    currentPanoramaIndex: 0,
    panoramaOffsetX: 0,
    panoramaDragged: false
  },

  _panoramaStartX: 0,
  _panoramaStartOffsetX: 0,

  onLoad: function() {
    getApp().globalData.currentTab = 1
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
      currentPanorama: this.data.brand.panoramas[index],
      panoramaOffsetX: 0,
      panoramaDragged: false
    })
  },

  onPanoramaTouchStart: function(e) {
    this._panoramaStartX = e.touches[0].clientX
    this._panoramaStartOffsetX = this.data.panoramaOffsetX
  },

  onPanoramaTouchMove: function(e) {
    var deltaX = e.touches[0].clientX - this._panoramaStartX
    // rpx 转换: 750rpx = 屏幕宽度, 所以 1px = 750/屏幕宽度 rpx
    // 用 wx.getSystemInfoSync 获取屏幕宽度来换算
    var sysInfo = wx.getSystemInfoSync()
    var pxToRpx = 750 / sysInfo.windowWidth
    var newOffsetX = this._panoramaStartOffsetX + deltaX * pxToRpx

    // 图片宽度 200%, 可偏移范围: [-750, 0] (即 -屏幕宽度rpx 到 0)
    var minOffset = -750
    var maxOffset = 0

    // 循环: 超出范围时跳回，实现无缝旋转
    if (newOffsetX > maxOffset) {
      newOffsetX = newOffsetX + minOffset
    } else if (newOffsetX < minOffset) {
      newOffsetX = newOffsetX - minOffset
    }

    this.setData({
      panoramaOffsetX: newOffsetX,
      panoramaDragged: true
    })
  },

  onPanoramaTouchEnd: function() {
    // 可在此添加惯性动画，目前简化处理
  }
})
