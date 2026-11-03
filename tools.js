// 用法：在项目根目录执行  node tools/gen-products.js
// 读取 /Users/hty/Downloads/产品 目录，重建 site-data.json 的 products 段
// OSS 路径：https://cavalryy.oss-cn-hangzhou.aliyuncs.com/boke/2025/04/12/ 产品/<风格>/<系列>/<文件名>
const fs = require('fs')
const path = require('path')

const PRODUCT_ROOT = '/Users/hty/Downloads/产品'
const SITE_DATA = path.join(__dirname, '..','miniProgram', 'miniprogram', 'data', 'site-data.json')
const OSS_BASE = 'https://cavalryy.oss-cn-hangzhou.aliyuncs.com/boke/2025/04/12/产品'

const STYLE_ORDER = ['中古风', '意式风', '极简风', '法式风', '老钱风', '艺术风', '轻奢风']

const SLUGS = {
  '中古风': 'zhonggu', '意式风': 'yishi', '极简风': 'jijian', '法式风': 'fashi',
  '老钱风': 'laoqian', '艺术风': 'yishu', '轻奢风': 'qingshe',
  '云轩系列': 'yunxuan', '伊梵系列': 'yifan', '知屿系列': 'zhiyu', '蒄木系列': 'guanmu',
  '蝶美系列': 'diemei', '诧季系列': 'chaji', '赫维系列': 'hewei', '郡诗系列': 'junshi',
  '意式极简': 'jijian', '星曜系列': 'xingyao', '松影系列': 'songying', '格序系列': 'gexu',
  '爵朵系列': 'jueduo', '疏影系列': 'shuying', '聞世系列': 'wenshi', '迪芬系列': 'difen',
  '遇光系列': 'yuguang',
  '德芙系列': 'defu', '怡恩系列': 'yien', '摩尔系列': 'moer', '朗格系列': 'lange',
  '满月系列': 'manyue', '缇娜系列': 'tina', '至美系列': 'zhimei', '雅梵系列': 'yafan',
  '丽舍系列': 'lishe', '云涧系列': 'yunjian', '宫廷系列': 'gongting', '璐黛系列': 'ludai',
  '若缇系列': 'ruoti', '荟萃系列': 'huicui',
  '润玉系列': 'runyu', '龙鳞系列': 'longlin',
  '半轮系列': 'banlun', '及奢系列': 'jishe', '幻影系列': 'huanying', '星辰系列': 'xingchen',
  '澄光系列': 'chengguang', '谍序系列': 'diexu', '雅尼系列': 'yani', '魔方系列': 'mofang',
  '优诺系列': 'younuo', '墨影系列': 'moying', '宋韵系列': 'songyun', '屿森系列': 'yusen',
  '慕迪系列': 'mudi', '景铄系列': 'jingshuo', '松涧系列': 'songjian', '瑞岚系列': 'ruilan'
}

function slug(name) {
  return SLUGS[name] || 's-' + encodeURIComponent(name)
}

function url(styleName, seriesName, file) {
  return OSS_BASE + '/' + styleName + '/' + seriesName + '/' + file
}

function buildProduct(styleName, seriesName) {
  const dir = path.join(PRODUCT_ROOT, styleName, seriesName)
  const files = fs.readdirSync(dir).filter(function (f) { return !f.startsWith('.') })
  const cover = files.find(function (f) { return f === '首图.jpg' })
  const rest = files
    .filter(function (f) { return /\.(jpe?g|png)$/i.test(f) && f !== cover })
    .sort(function (a, b) { return (parseInt(a) || 0) - (parseInt(b) || 0) })
  const images = (cover ? [cover] : []).concat(rest)
  const videos = files
    .filter(function (f) { return /\.(mp4|mov)$/i.test(f) })
    .map(function (f) {
      return {
        title: seriesName,
        poster: cover ? url(styleName, seriesName, cover) : '',
        url: url(styleName, seriesName, f)
      }
    })
  return {
    id: slug(styleName) + '-' + slug(seriesName),
    name: seriesName,
    images: images.map(function (f) { return url(styleName, seriesName, f) }),
    videos: videos
  }
}

const categories = STYLE_ORDER.map(function (styleName, i) {
  const styleDir = path.join(PRODUCT_ROOT, styleName)
  const seriesNames = fs.readdirSync(styleDir)
    .filter(function (f) { return fs.statSync(path.join(styleDir, f)).isDirectory() })
    .sort(function (a, b) { return a.localeCompare(b, 'zh') })
  const subCategories = seriesNames.map(function (s) {
    const p = buildProduct(styleName, s)
    return { id: p.id, name: s, bannerImage: '', products: [p] }
  })
  return {
    id: slug(styleName),
    name: styleName,
    expanded: i === 0,
    hasSub: true,
    subCategories: subCategories,
    bannerImage: '',
    products: []
  }
})

const data = JSON.parse(fs.readFileSync(SITE_DATA, 'utf8'))
data.products = { categories: categories }
fs.writeFileSync(SITE_DATA, JSON.stringify(data, null, 2) + '\n')

const total = categories.reduce(function (n, c) { return n + c.subCategories.length }, 0)
console.log('products 已重建：' + categories.length + ' 个风格 / ' + total + ' 个系列')
console.log('示例 URL：' + categories[0].subCategories[0].products[0].images[0])