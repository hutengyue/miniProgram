var dataService = require('../../data/data-service.js')
var imageLoader = require('../../behaviors/image-loader.js')

Page({
  behaviors: [imageLoader],

  data: {
    modules: [],
    activeModule: 'address',
    addressGroups: [],
    products: [],
    videos: [],
    searchKeyword: '',
    playingVideoId: ''
  },

  onLoad: function() {
    getApp().globalData.currentTab = 3
    var that = this
    dataService.getCases(function(cases) {
      if (!cases) return
      that._allAddressGroups = cases.addressGroups || []
      that._allProducts = cases.products || []
      that._allVideos = cases.videos || []
      that.setData({
        modules: cases.modules || [],
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
    this.applySearch(this.data.searchKeyword)
  },

  // 统一的搜索过滤入口
  applySearch: function(keyword) {
    keyword = (keyword || '').trim()
    var module = this.data.activeModule

    if (module === 'address') {
      var groups = this._allAddressGroups || []
      if (keyword) {
        groups = groups.filter(function(g) {
          return g.community.indexOf(keyword) > -1 ||
                 (g.location || '').indexOf(keyword) > -1
        })
      }
      this.setData({ addressGroups: groups })
    } else if (module === 'product') {
      var products = this._allProducts || []
      if (keyword) {
        products = products.filter(function(p) {
          return (p.name || '').toLowerCase().indexOf(keyword.toLowerCase()) > -1
        })
      }
      this.setData({ products: products })
    } else if (module === 'video') {
      var videos = this._allVideos || []
      if (keyword) {
        videos = videos.filter(function(v) {
          return (v.title || '').indexOf(keyword) > -1
        })
      }
      this.setData({ videos: videos })
    }
  },

  onSearchInput: function(e) {
    var keyword = e.detail.value
    this.setData({ searchKeyword: keyword })
    this.applySearch(keyword)
  },

  onClearSearch: function() {
    this.setData({ searchKeyword: '' })
    this.applySearch('')
  },

  // 点击小区图片 → 全屏预览该小区所有图
  onPreviewImage: function(e) {
    var groupIndex = e.currentTarget.dataset.group
    var imgIndex = e.currentTarget.dataset.index
    var group = this.data.addressGroups[groupIndex]
    if (!group) return
    var urls = group.images.map(function(img) { return img.image })
    wx.previewImage({
      current: urls[imgIndex],
      urls: urls
    })
  },

  // 点击视频封面 → 就地播放
  onPlayVideo: function(e) {
    var id = e.currentTarget.dataset.id
    this.setData({ playingVideoId: id })
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
