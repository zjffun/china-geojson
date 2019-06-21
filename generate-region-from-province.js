const fs = require("fs");

// 省数据
const { provinceMap } = require("./province-map.js");

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

// 通过省 json 数据构造区域数据

(fs.existsSync(regionDir) && fs.lstatSync(regionDir).isDirectory()) || fs.mkdirSync(regionDir);

for (const key in regionInfo) {
  if (regionInfo.hasOwnProperty(key)) {
    const elements = regionInfo[key];
    let data = {
      type: "FeatureCollection",
      features: []
    };
    let features = [];

    // 遍历区域的省
    elements.forEach(d => {
      let provinceFeatures = require(`${provinceDir}/${provinceMap[d]}.json`)
        .features;
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
