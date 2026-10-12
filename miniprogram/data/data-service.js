// 数据服务：统一入口，从阿里云 OSS 远程加载 JSON
var REMOTE_URL = 'https://cavalryy.oss-cn-hangzhou.aliyuncs.com/boke/2025/04/12/site-data.json'

function fetchData(callback) {
  // 每次都带时间戳绕过 CDN 缓存，确保拿到最新数据
  wx.request({
    url: REMOTE_URL + '?t=' + Date.now(),
    method: 'GET',
    dataType: 'json',
    success: function (res) {
      callback(res.data)
    },
    fail: function (err) {
      console.error('远程数据加载失败', err)
      callback(null)
    }
  })
}

function getBrand(callback) {
  fetchData(function (data) {
    callback(data ? data.brand : null)
  })
}

function getProducts(callback) {
  fetchData(function (data) {
    callback(data ? data.products : null)
  })
}

function getCases(callback) {
  fetchData(function (data) {
    callback(data ? data.cases : null)
  })
}

function getStores(callback) {
  fetchData(function (data) {
    callback(data ? data.stores : null)
  })
}

module.exports = {
  fetchData: fetchData,
  getBrand: getBrand,
  getProducts: getProducts,
  getCases: getCases,
  getStores: getStores
}
