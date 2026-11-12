var dataService = require('../../data/data-service.js')
var imageLoader = require('../../behaviors/image-loader.js')

Page({
  behaviors: [imageLoader],

  data: {
    product: null,
    activeModule: 'image'
  },

  onLoad: function(options) {
    var that = this
    var id = options.id || ''
    var source = options.source || 'product'
    if (source === 'case') {
      // 案例房间详情：在 cases.communities[].rooms 中查找
      dataService.getCases(function(cases) {
        if (!cases) return
        var found = null
        var communities = cases.communities || []
        for (var i = 0; i < communities.length && !found; i++) {
          var rooms = communities[i].rooms || []
          for (var j = 0; j < rooms.length; j++) {
            if (rooms[j].id === id) {
              found = rooms[j]
              break
            }
          }
        }
        that.showDetail(found, false)
      })
      return
    }
    dataService.getProducts(function(products) {
      if (!products) return
      // 遍历所有分类找到对应产品
      var found = null
      var categories = products.categories || []
      for (var i = 0; i < categories.length && !found; i++) {
        var list = categories[i].products || []
        for (var k = 0; k < list.length; k++) {
          if (list[k].id === id) {
            found = list[k]
            break
          }
        }
      }
      that.showDetail(found)
    })
  },

  showDetail: function(found, showHeader) {
    if (!found) return
    // 防御：数据缺 images/videos 字段时兜底，避免渲染层 wx:for undefined 崩溃
    found.images = Array.isArray(found.images) ? found.images : []
    found.videos = Array.isArray(found.videos) ? found.videos : []
    this.setData({
      product: found,
      showHeader: showHeader !== false
    })
    if (showHeader !== false) {
      wx.setNavigationBarTitle({ title: found.name || '详情' })
    }
  },

  // 切换模块（图片/视频）
  onModuleChange: function(e) {
    var id = e.currentTarget.dataset.id
    if (id === this.data.activeModule) return
    this.setData({ activeModule: id })
  },

  // 点击图片 → 全屏预览全部图片
  onPreviewImage: function(e) {
    var index = e.currentTarget.dataset.index
    var product = this.data.product
    if (!product || !product.images || !product.images.length) return
    wx.previewImage({
      current: product.images[index],
      urls: product.images
    })
  },

  // 点击视频封面 → 全屏播放（9:16 竖屏视频）
  onPlayVideo: function(e) {
    var index = e.currentTarget.dataset.index
    var product = this.data.product
    if (!product || !product.videos) return
    var video = product.videos[index]
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
    var product = this.data.product || {}
    return {
      title: 'HESEINT赫世 · ' + (product.name || '产品详情'),
      path: '/pages/product-detail/product-detail?id=' + (product.id || '')
    }
  },

  onShareTimeline: function() {
    var product = this.data.product || {}
    return {
      title: 'HESEINT赫世 · ' + (product.name || '产品详情')
    }
  }
})
