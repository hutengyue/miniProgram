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
      // 动态计算底部安全区高度，不依赖 CSS env()（部分 iOS 机型/基础库上 env 不可靠）
      var safeBottom = 0
      try {
        var info = wx.getSystemInfoSync()
        if (info.safeArea && info.screenHeight) {
          safeBottom = info.screenHeight - info.safeArea.bottom
        }
      } catch (e) {}
      this.setData({
        selected: app.globalData.currentTab || 0,
        safeBottom: safeBottom
      })
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
