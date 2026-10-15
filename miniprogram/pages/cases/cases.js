var dataService = require('../../data/data-service.js')
var imageLoader = require('../../behaviors/image-loader.js')

Page({
  behaviors: [imageLoader],

  data: {
    modules: [],
    activeModule: 'address',
    activeCommunityId: '',
    addressGroups: [],
    products: [],
    videos: []
  },

  onLoad: function() {
    getApp().globalData.currentTab = 3
    var that = this
    dataService.getCases(function(cases) {
      if (!cases) return
      that._allAddressGroups = cases.addressGroups || []
      that._allProducts = cases.products || []
      that._allVideos = cases.videos || []
      var firstGroup = that._allAddressGroups[0]
      that.setData({
        modules: cases.modules || [],
        activeCommunityId: firstGroup ? firstGroup.id : '',
        addressGroups: that._allAddressGroups,
        products: that._allProducts,
        videos: that._allVideos
      })
    })
  },

  onShow: function() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 3 })
    }
  },

  // 切换模块（地址/产品/视频）
  onModuleChange: function(e) {
    var id = e.currentTarget.dataset.id
    if (id === this.data.activeModule) return
    this.setData({
      activeModule: id,
      playingVideoId: ''
    })
  },

  // 切换小区二级分类
  onCommunityChange: function(e) {
    var id = e.currentTarget.dataset.id
    if (id === this.data.activeCommunityId) return
    this.setData({ activeCommunityId: id })
  },

  // 点击小区图片 → 全屏预览当前小区所有图
  onPreviewImage: function(e) {
    var imgIndex = e.currentTarget.dataset.index
    var group = this.data.addressGroups.filter(function(g) { return g.id === this.data.activeCommunityId })[0]
    if (!group) return
    var urls = group.images.map(function(img) { return img.image })
    wx.previewImage({
      current: urls[imgIndex],
      urls: urls
    })
  },

  // 点击视频封面 → 全屏播放（9:16 竖屏视频）
  onPlayVideo: function(e) {
    var id = e.currentTarget.dataset.id
    var video = (this.data.videos || []).filter(function(v) { return v.id === id })[0]
    if (!video) return
    wx.previewMedia({
      sources: [{
        url: video.url,
        type: 'video',
        poster: video.poster
      }],
      current: 0,
      showmenu: true
    })
  },

  onShareAppMessage: function() {
    return {
      title: 'HESEINT赫世 · 实景案例鉴赏',
      path: '/pages/cases/cases'
    }
  },

  onShareTimeline: function() {
    return {
      title: 'HESEINT赫世 · 实景案例鉴赏'
    }
  }
})
