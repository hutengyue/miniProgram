Component({
  data: {
    selected: 0,
    transparent: false,
    list: [
      { pagePath: '/pages/home/home', text: '首页', icon: 'wap-home-o' },
      { pagePath: '/pages/brand/brand', text: '品牌', icon: 'diamond-o' },
      { pagePath: '/pages/products/products', text: '产品', icon: 'apps-o' },
      { pagePath: '/pages/cases/cases', text: '实例', icon: 'photo-o' },
      { pagePath: '/pages/stores/stores', text: '联系', icon: 'chat-o' }
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
