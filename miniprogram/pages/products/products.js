var dataService = require('../../data/data-service.js')
var imageLoader = require('../../behaviors/image-loader.js')

Page({
  behaviors: [imageLoader],

  data: {
    categories: [],
    sections: [],
    activeSectionId: '',
    scrollToId: '',
    searchKeyword: '',
    scrollTimer: null
  },

  onLoad: function() {
    getApp().globalData.currentTab = 2
    var that = this
    dataService.getProducts(function(products) {
      if (!products) return
      var categories = products.categories
      var sections = that.buildSections(categories)
      // 保存原始数据用于搜索过滤
      that._allSections = JSON.parse(JSON.stringify(sections))
      var firstSection = sections[0]
      that.setData({
        categories: categories,
        sections: sections,
        activeSectionId: firstSection ? firstSection.id : ''
      })
    })
  },

  buildSections: function(categories) {
    var sections = []
    for (var i = 0; i < categories.length; i++) {
      var cat = categories[i]
      if (cat.hasSub && cat.subCategories && cat.subCategories.length > 0) {
        for (var j = 0; j < cat.subCategories.length; j++) {
          var sub = cat.subCategories[j]
          sections.push({
            id: sub.id,
            name: sub.name,
            bannerImage: sub.bannerImage,
            products: sub.products,
            parentId: cat.id
          })
        }
      } else {
        sections.push({
          id: cat.id,
          name: cat.name,
          bannerImage: cat.bannerImage,
          products: cat.products,
          parentId: cat.id
        })
      }
    }
    return sections
  },

  filterSections: function(keyword) {
    var kw = keyword ? keyword.trim() : ''
    var all = this._allSections
    if (!kw) return all
    var lower = kw.toLowerCase()
    var result = []
    for (var i = 0; i < all.length; i++) {
      var sec = all[i]
      // 分类名命中 → 整个 section 保留
      if (sec.name.toLowerCase().indexOf(lower) > -1) {
        result.push(sec)
        continue
      }
      // 产品名命中 → 只保留命中的产品
      var matchedProducts = []
      for (var j = 0; j < sec.products.length; j++) {
        var p = sec.products[j]
        if (p.name.toLowerCase().indexOf(lower) > -1 || (p.id && p.id.toLowerCase().indexOf(lower) > -1)) {
          matchedProducts.push(p)
        }
      }
      if (matchedProducts.length > 0) {
        var copy = JSON.parse(JSON.stringify(sec))
        copy.products = matchedProducts
        result.push(copy)
      }
    }
    return result
  },

  onShow: function() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2 })
    }
  },

  onToggleCategory: function(e) {
    var id = e.currentTarget.dataset.id
    var categories = this.data.categories
    var target = null
    for (var i = 0; i < categories.length; i++) {
      if (categories[i].id === id) {
        target = categories[i]
        categories[i].expanded = !categories[i].expanded
      } else {
        categories[i].expanded = false
      }
    }

    var updates = { categories: categories }

    if (target.hasSub && target.subCategories && target.subCategories.length > 0) {
      if (target.expanded) {
        var firstSub = target.subCategories[0]
        updates.scrollToId = 'sec-' + firstSub.id
        updates.activeSectionId = firstSub.id
      }
    } else {
      updates.scrollToId = 'sec-' + id
      updates.activeSectionId = id
    }

    this.setData(updates)
  },

  onSelectSub: function(e) {
    var id = e.currentTarget.dataset.id
    this.setData({
      scrollToId: 'sec-' + id,
      activeSectionId: id
    })
  },

  onContentScroll: function(e) {
    if (this.data.scrollTimer) return
    var that = this
    this.data.scrollTimer = setTimeout(function() {
      that.data.scrollTimer = null
      that.updateActiveByScroll()
    }, 60)
  },

  updateActiveByScroll: function() {
    var that = this
    var query = wx.createSelectorQuery().in(this)
    query.select('.content-area').boundingClientRect()
    query.selectAll('.section').boundingClientRect()
    query.exec(function(res) {
      if (!res || !res[0] || !res[1] || res[1].length === 0) return
      var containerTop = res[0].top
      var sectionRects = res[1]
      var threshold = 20
      var activeIndex = 0
      for (var i = 0; i < sectionRects.length; i++) {
        var relativeTop = sectionRects[i].top - containerTop
        if (relativeTop <= threshold) {
          activeIndex = i
        } else {
          break
        }
      }
      var section = that.data.sections[activeIndex]
      if (section && section.id !== that.data.activeSectionId) {
        var categories = that.data.categories
        var changed = false
        for (var j = 0; j < categories.length; j++) {
          if (categories[j].id === section.parentId) {
            if (categories[j].hasSub && !categories[j].expanded) {
              categories[j].expanded = true
              changed = true
            }
          } else if (categories[j].expanded) {
            categories[j].expanded = false
            changed = true
          }
        }
        var updates = { activeSectionId: section.id }
        if (changed) updates.categories = categories
        that.setData(updates)
      }
    })
  },

  onSearchInput: function(e) {
    var keyword = e.detail.value
    var sections = this.filterSections(keyword)
    this.setData({
      searchKeyword: keyword,
      sections: sections
    })
  },

  onClearSearch: function() {
    var sections = this.filterSections('')
    this.setData({
      searchKeyword: '',
      sections: sections
    })
  },

  onSearch: function() {
    // 实时搜索已在 onSearchInput 处理，这里无需额外逻辑
  },

  onProductTap: function(e) {
    wx.showToast({ title: '敬请期待', icon: 'none' })
  },

  onShareAppMessage: function() {
    return {
      title: 'LORBN劳宾 · 定制卫浴产品中心',
      path: '/pages/products/products'
    }
  },

  onShareTimeline: function() {
    return {
      title: 'LORBN劳宾 · 定制卫浴产品中心'
    }
  }
})
