const fs = require("fs");
const path = require("path");
const api = require("./api");

const Main = async () => {
  const filepath = "../i18n/i18n.json";
  const filePath = path.join(__dirname, filepath);
  const filePathW = path.join(__dirname, "../translate/en.json");
  let transLateStr = "";

  let toJson = {};

  try {
    //  转换json文件
    const file = JSON.parse(fs.readFileSync(filePath, "utf8"));

    // 提取key值
    Object.keys(file).forEach((el) => {
      transLateStr += file[el] + "\n";
    });
    const data = await api.BaiDuTranslate({
      query: transLateStr,
      from: "zh",
      to: "en",
    });

    Object.keys(file).forEach((el, index) => {
      toJson[el] = data[index].dst;
    });

    fs.writeFileSync(filePathW, JSON.stringify(toJson));
  } catch (err) {
    console.log("readFile Error" + err);
  }
};

Main();
