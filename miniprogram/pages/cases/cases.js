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
    productGroups: [],
    videos: []
  },

  onLoad: function() {
    getApp().globalData.currentTab = 3
    var that = this
    this._caseVideos = []
    this._productVideos = []
    dataService.getCases(function(cases) {
      if (!cases) return
      var communities = cases.communities || []
      that.setData(that.buildActiveState(communities, communities[0] ? communities[0].id : ''))
      that.setData({ modules: cases.modules || [] })
      that._caseVideos = that.collectRoomVideos(communities)
      that.updateVideos()
    })
    // 产品模块：与产品页共用 products 数据（按风格分组）；同时收集产品视频
    dataService.getProducts(function(products) {
      if (!products) return
      var groups = []
      var videos = []
      var categories = products.categories || []
      for (var i = 0; i < categories.length; i++) {
        var list = categories[i].products || []
        if (!list.length) continue
        var group = { id: categories[i].id, name: categories[i].name, products: [] }
        for (var j = 0; j < list.length; j++) {
          var p = list[j]
          group.products.push({ id: p.id, name: p.name, image: (p.images || [])[0] || '' })
          var vids = p.videos || []
          for (var k = 0; k < vids.length; k++) {
            videos.push({ id: p.id + '-v' + k, poster: vids[k].poster, url: vids[k].url })
          }
        }
        groups.push(group)
      }
      that.setData({ productGroups: groups })
      that._productVideos = videos
      that.updateVideos()
    })
  },

  onShow: function() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 3 })
    }
  },

  // 汇总视频：案例房间视频 + 产品视频
  collectRoomVideos: function(communities) {
    var list = []
    for (var i = 0; i < communities.length; i++) {
      var rooms = communities[i].rooms || []
      for (var j = 0; j < rooms.length; j++) {
        var vids = rooms[j].videos || []
        for (var k = 0; k < vids.length; k++) {
          list.push({ id: rooms[j].id + '-v' + k, poster: vids[k].poster, url: vids[k].url })
        }
      }
    }
    return list
  },

  updateVideos: function() {
    this.setData({ videos: this._caseVideos.concat(this._productVideos) })
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
    this.setData({
      activeModule: id,
      activeModuleIndex: e.currentTarget.dataset.index || 0
    })
  },

  // 切换小区
  onCommunityChange: function(e) {
    var id = e.currentTarget.dataset.id
    if (id === this.data.activeCommunityId) return
    this.setData(this.buildActiveState(this.data.communities, id))
  },

  // 点击房间卡片 → 进入详情（案例来源，无标题）
  onRoomTap: function(e) {
    var id = e.currentTarget.dataset.id
    if (!id) return
    wx.navigateTo({
      url: '/pages/product-detail/product-detail?source=case&id=' + id
    })
  },

  // 点击产品卡片 → 进入产品详情（产品来源，显示产品名）
  onProductTap: function(e) {
    var id = e.currentTarget.dataset.id
    if (!id) return
    wx.navigateTo({
      url: '/pages/product-detail/product-detail?id=' + id
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
