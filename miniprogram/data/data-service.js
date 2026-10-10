// 数据服务：统一入口，从阿里云 OSS 远程加载 JSON
var REMOTE_URL = 'https://cavalryy.oss-cn-hangzhou.aliyuncs.com/boke/2025/04/12/site-data.json'

var _cache = null

function fetchData(callback) {
  if (_cache) {
    callback(_cache)
    return
  }
  wx.request({
    url: REMOTE_URL,
    method: 'GET',
    dataType: 'json',
    success: function (res) {
      _cache = res.data
      callback(_cache)
    },
    fail: function (err) {
      console.error('远程数据加载失败', err)
      callback(null)
    }
  })
}

// 按模块获取
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
