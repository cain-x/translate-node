const crypto = require("crypto");
const http = require("http");
const querystring = require("querystring");
// 使用百度翻译接口翻译 / 需要自己的appid和秘钥 / 可以观看我的博客来进行配置
const BaiDuTranslate = (params) => {
  return new Promise((resolve, reject) => {
    var appid = "20231001001834336";
    var key = "TAzFrB4QvXSRgkv_BS8z";
    var salt = new Date().getTime();

    var query = params.query || "";
    let from = params.from || "zh";
    let to = params.to || "en";
    let str1 = appid + query + salt + key;
    //   var sign = MD5(str1);
    // 使用crypto创建md5加密传输
    const md5Hash = crypto.createHash("md5");
    md5Hash.update(str1);
    const md5Hashed = md5Hash.digest("hex");

    const resData = {
      q: query,
      appid: appid,
      salt: salt,
      from: from,
      to: to,
      sign: md5Hashed,
    };
    const queryString = querystring.stringify(resData);
    const res = http.get(
      `http://api.fanyi.baidu.com/api/trans/vip/translate?${queryString}`,
      (respoense) => {
        let data = "";

        respoense.on("data", (chunk) => {
          data += chunk;
        });

        respoense.on("end", () => {
          try {
            const jsonData = JSON.parse(data);
            resolve(jsonData.trans_result);
          } catch (err) {
            console.log(err);
          }
        });
      }
    );
    res.end();
  });
};

module.exports = {
  BaiDuTranslate,
};
