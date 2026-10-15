var dataService = require('../../data/data-service.js')
var imageLoader = require('../../behaviors/image-loader.js')

Page({
  behaviors: [imageLoader],

  data: {
    product: null
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
        that.setData({ product: found })
        wx.setNavigationBarTitle({ title: found.name || '产品详情' })
      }
    })
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
