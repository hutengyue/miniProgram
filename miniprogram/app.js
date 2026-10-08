App({
  globalData: {
    currentTab: 0
  },

  onLaunch() {
    wx.login({
      success: res => {
        console.log(res.code)
      }
    })
  }
})
