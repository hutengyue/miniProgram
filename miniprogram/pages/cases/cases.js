var dataService = require('../../data/data-service.js')
var imageLoader = require('../../behaviors/image-loader.js')

Page({
  behaviors: [imageLoader],

  data: {
    modules: [],
    activeModule: 'address',
    communities: [],
    activeCommunityId: '',
    activeRooms: [],
    products: [],
    videos: []
  },

  onLoad: function() {
    getApp().globalData.currentTab = 3
    var that = this
    dataService.getCases(function(cases) {
      if (!cases) return
      var communities = cases.communities || []
      that.setData(that.buildActiveState(communities, communities[0] ? communities[0].id : ''))
      that.setData({
        modules: cases.modules || [],
        products: cases.products || [],
        videos: cases.videos || []
      })
    })
  },

  onShow: function() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 3 })
    }
  },

  buildActiveState: function(communities, activeId) {
    var active = null
    for (var i = 0; i < communities.length; i++) {
      if (communities[i].id === activeId) {
        active = communities[i]
        break
      }
    }
    return {
      communities: communities,
      activeCommunityId: activeId,
      activeRooms: active ? (active.rooms || []) : []
    }
  },

  // 切换模块（地址/产品/视频）
  onModuleChange: function(e) {
    var id = e.currentTarget.dataset.id
    if (id === this.data.activeModule) return
    this.setData({ activeModule: id })
  },

  // 切换小区
  onCommunityChange: function(e) {
    var id = e.currentTarget.dataset.id
    if (id === this.data.activeCommunityId) return
    this.setData(this.buildActiveState(this.data.communities, id))
  },

  // 点击房间卡片 → 进入详情（复用产品详情页，展示图片+视频）
  onRoomTap: function(e) {
    var id = e.currentTarget.dataset.id
    if (!id) return
    wx.navigateTo({
      url: '/pages/product-detail/product-detail?source=case&id=' + id
    })
  },

  // 点击视频封面 → 全屏播放
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
