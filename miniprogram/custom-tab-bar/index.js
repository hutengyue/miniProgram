Component({
  data: {
    selected: 0,
    list: [
      { pagePath: '/pages/home/home', text: '首页' },
      { pagePath: '/pages/brand/brand', text: '品牌' },
      { pagePath: '/pages/products/products', text: '产品' },
      { pagePath: '/pages/cases/cases', text: '实例' },
      { pagePath: '/pages/stores/stores', text: '门店' }
    ]
  },

  lifetimes: {
    attached: function() {
      var app = getApp()
      this.setData({ selected: app.globalData.currentTab || 0 })
    }
  },

  methods: {
    switchTab: function(e) {
      var index = e.currentTarget.dataset.index
      var app = getApp()
      app.globalData.currentTab = index
      var url = this.data.list[index].pagePath
      wx.switchTab({ url: url })
    }
  }
})
