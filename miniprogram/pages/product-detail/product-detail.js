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
    dataService.getProducts(function(products) {
      if (!products) return
      // 遍历所有分类（含子分类）找到对应产品
      var found = null
      var categories = products.categories || []
      for (var i = 0; i < categories.length && !found; i++) {
        var cat = categories[i]
        var list = []
        if (cat.hasSub && cat.subCategories && cat.subCategories.length > 0) {
          for (var j = 0; j < cat.subCategories.length; j++) {
            list = list.concat(cat.subCategories[j].products || [])
          }
        } else {
          list = cat.products || []
        }
        for (var k = 0; k < list.length; k++) {
          if (list[k].id === id) {
            found = list[k]
            break
          }
        }
      }
      if (found) {
        // 防御：旧格式数据缺 images/videos 字段时兜底，避免渲染层 wx:for undefined 崩溃
        found.images = Array.isArray(found.images) ? found.images : []
        found.videos = Array.isArray(found.videos) ? found.videos : []
        that.setData({ product: found })
        wx.setNavigationBarTitle({ title: found.name || '产品详情' })
      }
    })
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
