var dataService = require('../../data/data-service.js')
var imageLoader = require('../../behaviors/image-loader.js')

Page({
  behaviors: [imageLoader],

  data: {
    modules: [],
    activeModule: 'address',
    activeModuleIndex: 0,
    communities: [],
    activeCommunityId: '',
    activeRooms: [],
    productGroups: [],
    videos: []
  },

  onLoad: function() {
    getApp().globalData.currentTab = 3
    var that = this
    dataService.getCases(function(cases) {
      if (!cases) return
      var communities = cases.communities || []
      // 地址模块：优先使用小区图片画廊（villages），无则回退到案例小区
      var addressList = (cases.villages && cases.villages.length) ? cases.villages : communities
      that.setData(that.buildActiveState(addressList, addressList[0] ? addressList[0].id : ''))
      // 产品模块：与地址同源（小区分组 → 房间卡片，显示房间名）
      var groups = []
      for (var i = 0; i < communities.length; i++) {
        var rooms = communities[i].rooms || []
        var group = {
          id: communities[i].id,
          name: communities[i].name,
          products: rooms.map(function(r) {
            return { id: r.id, name: r.name, image: r.cover }
          })
        }
        if (group.products.length) groups.push(group)
      }
      that.setData({
        modules: cases.modules || [],
        productGroups: groups,
        videos: that.collectRoomVideos(communities)
      })
    })
  },

  onShow: function() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 3 })
    }
  },

  // 视频模块：全部案例房间视频
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

  buildActiveState: function(communities, activeId) {
    var active = null
    for (var i = 0; i < communities.length; i++) {
      if (communities[i].id === activeId) {
        active = communities[i]
        break
      }
    }
    var activeRooms = active ? (active.rooms || []) : []
    // 小区图片画廊：无 rooms 时把 images 映射为网格卡片
    if (!activeRooms.length && active && active.images && active.images.length) {
      activeRooms = []
      for (var k = 0; k < active.images.length; k++) {
        activeRooms.push({ id: active.id + '-img-' + k, cover: active.images[k] })
      }
    }
    return {
      communities: communities,
      activeCommunityId: activeId,
      activeRooms: activeRooms
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

  // 点击房间卡片 → 进入详情（案例来源，无标题）；点击画廊图片 → 全屏预览
  onRoomTap: function(e) {
    var id = e.currentTarget.dataset.id
    if (!id) return
    if (id.indexOf('-img-') > -1) {
      var active = null
      var list = this.data.communities || []
      for (var i = 0; i < list.length; i++) {
        if (list[i].id === this.data.activeCommunityId) {
          active = list[i]
          break
        }
      }
      if (active && active.images && active.images.length) {
        var index = parseInt(id.split('-img-')[1], 10) || 0
        wx.previewImage({ current: active.images[index], urls: active.images })
      }
      return
    }
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
