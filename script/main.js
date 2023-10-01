/*
 * @Author: mikey.zhaopeng
 * @Date: 2023-10-01 23:10:32
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2023-10-01 23:48:15
 */
const fs = require("fs");
const path = require("path");
const api = require("./api");
require("dotenv").config();

const Main = async () => {
  const filePath = path.join(__dirname, "../i18n/i18n.json");
  const filePathW = path.join(__dirname, "../translate/en.json");

  let transLateStr = "";

  let toJson = {};

  const translateApi = {
    baidu: api.BaiDuTranslate,
  };

  const apiType = process.env.CAIN_API_TYPE;
  const from = process.env.CAIN_FROM;
  const to = process.env.CAIN_TO;

  try {
    //  转换json文件
    const file = JSON.parse(fs.readFileSync(filePath, "utf8"));

    // 提取key值
    Object.keys(file).forEach((el) => {
      transLateStr += file[el] + "\n";
    });

    const queryData = {
      query: transLateStr,
      from: from,
      to: to,
    };

    // 使用策略模式切换api方法
    const data = await translateApi[apiType](queryData);

    // 转换翻译回来的语言
    Object.keys(file).forEach((el, index) => {
      toJson[el] = data[index].dst;
    });

    // 写入文件
    fs.writeFileSync(filePathW, JSON.stringify(toJson));
  } catch (err) {
    console.log("readFile Error" + err);
  }
};

Main();
