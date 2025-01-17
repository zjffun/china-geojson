const fs = require("fs");
// 省映射表
const { provinceMap, provinceAbbrMap } = require("./province-map.js");
// 全国 geoJSON
const chinaMap = require("./china.json");

// 区域最小单位
const unit = process.argv[2] === "city" ? "city" : "province";
// 文件夹
const regionDir = `${__dirname}/geometryRegion`;
const provinceDir = `${__dirname}/geometryProvince`;
// 区域信息
const regionInfo = {
  // 全国: [
  //   "北京",
  //   "天津",
  //   "河北",
  //   "山西",
  //   "内蒙古",
  //   "辽宁",
  //   "吉林",
  //   "黑龙江",
  //   "上海",
  //   "江苏",
  //   "山东",
  //   "安徽",
  //   "浙江",
  //   "福建",
  //   "江西",
  //   "河南",
  //   "湖北",
  //   "湖南",
  //   "广东",
  //   "广西",
  //   "海南",
  //   "宁夏",
  //   "新疆",
  //   "青海",
  //   "陕西",
  //   "甘肃",
  //   "四川",
  //   "云南",
  //   "贵州",
  //   "西藏",
  //   "重庆",
  //   "台湾",
  //   "香港",
  //   "澳门"
  // ],
  华北: ["北京", "天津", "河北", "山西", "内蒙古"],
  东北: ["辽宁", "吉林", "黑龙江"],
  华东: ["上海", "江苏", "山东", "安徽", "浙江", "福建", "江西"],
  中南: ["河南", "湖北", "湖南", "广东", "广西", "海南"],
  西北: ["宁夏", "新疆", "青海", "陕西", "甘肃"],
  西南: ["四川", "云南", "贵州", "西藏", "重庆"],
  港澳台: ["台湾", "香港", "澳门"]
};
// 区域映射表
const region = {
  // china: "全国",
  north: "华北",
  northeast: "东北",
  east: "华东",
  centralsouth: "中南",
  northwest: "西北",
  sourthwest: "西南",
  hmt: "港澳台"
};
const regionReverse = Object.entries(region).reduce((obj, d) => {
  obj[d[1]] = d[0];
  return obj;
}, {});

// 创建文件夹
(fs.existsSync(regionDir) && fs.lstatSync(regionDir).isDirectory()) ||
  fs.mkdirSync(regionDir);

// 通过省 json 数据构造区域数据
for (const key in regionInfo) {
  if (regionInfo.hasOwnProperty(key)) {
    const elements = regionInfo[key];
    let data = {
      type: "FeatureCollection",
      features: []
    };
    let features = [];

    elements.forEach(element => {
      let provinceFeatures = null;
      if (unit === "province") {
        provinceFeatures = chinaMap.features.filter(
          feature => feature.properties.name === provinceAbbrMap[element]
        );
      } else {
        provinceFeatures = require(`${provinceDir}/${
          provinceMap[element]
        }.json`).features;
      }
      features = features.concat(provinceFeatures);
    });
    data.features = features;

    // 写入
    fs.writeFileSync(
      `${regionDir}/${regionReverse[key]}.json`,
      JSON.stringify(data)
    );
  }
}
