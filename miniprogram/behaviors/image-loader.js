// 图片加载 Behavior：统一提供 fade-in 图片加载状态管理
// 每个引入此 behavior 的页面自动拥有：
//   data.loadedImages  — 已加载图片标记表
//   onImgLoad(e)       — image 的 bindload 处理器
//   onImgError(e)      — image 的 binderror 处理器（失败也让图片可见，避免 opacity:0 卡死）
module.exports = Behavior({
  data: {
    loadedImages: {}
  },
  methods: {
    onImgLoad: function(e) {
      var src = e.currentTarget.dataset.src
      if (!src) return
      var loadedImages = Object.assign({}, this.data.loadedImages)
      loadedImages[src] = true
      this.setData({ loadedImages: loadedImages })
    },
    onImgError: function(e) {
      var src = e.currentTarget.dataset.src
      if (!src) return
      var loadedImages = Object.assign({}, this.data.loadedImages)
      loadedImages[src] = true
      this.setData({ loadedImages: loadedImages })
    }
  }
})
