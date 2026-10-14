var dataService = require('../../data/data-service.js')
var imageLoader = require('../../behaviors/image-loader.js')

Page({
  behaviors: [imageLoader],

  data: {
    brand: {}
  },

  onLoad: function() {
    getApp().globalData.currentTab = 1
    var that = this
    dataService.getBrand(function(brand) {
      if (!brand) return
      // 给 type: 'section' 的条目注入连续编号（从 1 开始），跳过 hero/quote/text/image 等
      var num = 0
      var sections = brand.sections || []
      for (var i = 0; i < sections.length; i++) {
        if (sections[i].type === 'section') {
          num++
          sections[i].num = num
        }
      }
      that.setData({ brand: brand })
    })
  },

  onShow: function() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1 })
    }
  },

  onShareAppMessage: function() {
    var brand = this.data.brand || {}
    return {
      title: (brand.brandName || '品牌故事') + ' · ' + (brand.slogan || ''),
      path: '/pages/brand/brand',
      imageUrl: brand.brandImage
    }
  },

  onShareTimeline: function() {
    return {
      title: (this.data.brand.brandName || 'HESEINT赫世') + ' · 探索美好秩序'
    }
  }
})
