// 用法：在项目根目录执行  node tools/gen-cases.js
// 读取 /Users/hty/Downloads/案例 目录，重建 site-data.json 的 cases 段
// OSS 路径：https://cavalryy.oss-cn-hangzhou.aliyuncs.com/boke/2025/04/12/案例/<小区>/<房间>/图文|视频/<文件名>
const fs = require('fs')
const path = require('path')

const CASE_ROOT = '/Users/hty/Downloads/案例'
const SITE_DATA = path.join(__dirname, '..', 'miniprogram', 'data', 'site-data.json')
const OSS_BASE = 'https://cavalryy.oss-cn-hangzhou.aliyuncs.com/boke/2025/04/12/案例'

function listDir(dir) {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir).filter(function (f) { return !f.startsWith('.') })
}

// 自然排序：1.JPG < 2.JPG < ... < 10.JPG；首图固定排最前
function imgSort(a, b) {
  if (a === '首图.JPG' || a === '首图.jpg') return -1
  if (b === '首图.JPG' || b === '首图.jpg') return 1
  return (parseInt(a, 10) || 0) - (parseInt(b, 10) || 0) || a.localeCompare(b)
}

function url(community, room, sub, file) {
  return OSS_BASE + '/' + community + '/' + room + '/' + sub + '/' + file
}

function buildRoom(community, room) {
  const roomDir = path.join(CASE_ROOT, community, room)
  const imgFiles = listDir(path.join(roomDir, '图文'))
    .filter(function (f) { return /\.(jpe?g|png)$/i.test(f) })
    .sort(imgSort)
  const videoFiles = listDir(path.join(roomDir, '视频'))
    .filter(function (f) { return /\.(mp4|mov)$/i.test(f) })
    .sort(function (a, b) { return a.localeCompare(b, 'zh') })

  const images = imgFiles.map(function (f) { return url(community, room, '图文', f) })
  const cover = images[0] || ''
  const videos = videoFiles.map(function (f) {
    return { poster: cover, url: url(community, room, '视频', f) }
  })
  return { images: images, videos: videos }
}

const communities = listDir(CASE_ROOT)
  .filter(function (f) { return fs.statSync(path.join(CASE_ROOT, f)).isDirectory() })
  .sort(function (a, b) { return a.localeCompare(b, 'zh') })
  .map(function (community, i) {
    const rooms = listDir(path.join(CASE_ROOT, community))
      .filter(function (f) { return fs.statSync(path.join(CASE_ROOT, community, f)).isDirectory() })
      .sort(function (a, b) { return a.localeCompare(b, 'zh') })
      .map(function (room, j) {
        const r = buildRoom(community, room)
        return {
          id: 'case-' + i + '-room-' + j,
          name: room,
          cover: r.images[0] || '',
          images: r.images,
          videos: r.videos
        }
      })
    return { id: 'case-' + i, name: community, rooms: rooms }
  })

const data = JSON.parse(fs.readFileSync(SITE_DATA, 'utf8'))
data.cases = {
  modules: [
    { id: 'address', name: '地址' },
    { id: 'product', name: '产品' },
    { id: 'video', name: '视频' }
  ],
  communities: communities
}
fs.writeFileSync(SITE_DATA, JSON.stringify(data, null, 2) + '\n')

communities.forEach(function (c) {
  console.log(c.name + '：' + c.rooms.length + ' 个房间')
})
console.log('共 ' + communities.length + ' 个小区')
