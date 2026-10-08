var productsData = require('../../data/products.js')

Page({
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
    var categories = productsData.categories
    var sections = this.buildSections(categories)
    var firstSection = sections[0]
    this.setData({
      categories: categories,
      sections: sections,
      activeSectionId: firstSection ? firstSection.id : ''
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
    this.setData({ searchKeyword: e.detail.value })
  },

  onSearch: function() {
    var kw = this.data.searchKeyword.trim()
    if (!kw) {
      wx.showToast({ title: '请输入关键词', icon: 'none' })
      return
    }
    wx.showToast({ title: '搜索: ' + kw, icon: 'none' })
  },

  onProductTap: function(e) {
    wx.showToast({ title: '敬请期待', icon: 'none' })
  }
})
