var dataService = require('../../data/data-service.js')

Page({
  data: {
    categories: [],
    filteredCases: [],
    activeCategory: 'all',
    searchKeyword: ''
  },

  onLoad: function() {
    getApp().globalData.currentTab = 3
    var that = this
    dataService.getCases(function(cases) {
      if (!cases) return
      that.setData({
        categories: cases.categories,
        filteredCases: cases.list
      })
      that._allCases = cases.list
    })
  },

  onShow: function() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 3 })
    }
  },

  onCategoryChange: function(e) {
    var id = e.currentTarget.dataset.id
    var keyword = this.data.searchKeyword.trim()
    var filtered = this._allCases
    if (id !== 'all') {
      filtered = filtered.filter(function(c) { return c.category === id })
    }
    if (keyword) {
      filtered = filtered.filter(function(c) {
        return c.name.indexOf(keyword) > -1 || c.code.toLowerCase().indexOf(keyword.toLowerCase()) > -1
      })
    }
    this.setData({
      activeCategory: id,
      filteredCases: filtered
    })
  },

  onSearchInput: function(e) {
    var keyword = e.detail.value.trim()
    var activeCategory = this.data.activeCategory
    var filtered = this._allCases
    if (activeCategory !== 'all') {
      filtered = filtered.filter(function(c) { return c.category === activeCategory })
    }
    if (keyword) {
      filtered = filtered.filter(function(c) {
        return c.name.indexOf(keyword) > -1 || c.code.toLowerCase().indexOf(keyword.toLowerCase()) > -1
      })
    }
    this.setData({
      searchKeyword: keyword,
      filteredCases: filtered
    })
  },

  onClearSearch: function() {
    this.setData({
      searchKeyword: '',
      activeCategory: 'all',
      filteredCases: this._allCases
    })
  }
})
