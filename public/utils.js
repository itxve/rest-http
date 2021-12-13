const fs = require("fs");
const { resolve } = require("path");
const cPath = resolve(__dirname, "datasets");

/**
 * 下载文件
 * @param {*} item
 * @returns
 */
function loadDataset(item) {
  var http = require("http");
  if (/^https:\/\//.test(item.url)) {
    http = require("https");
    console.log("https======>");
  }
  var resultPromise = new Promise(function (resolve, reject) {
    const { exist, content } = hasCache([cPath, item.areas].join("/"));
    if (exist) {
      console.log("read cache......");
      resolve(content);
      return;
    }
    http
      .get(item.url, function (res) {
        var html = "";
        res.on("data", function (d) {
          html += String(d).toString();
        });
        res.on("end", function () {
          resolve(html);
          toFileSync([cPath, item.areas].join("/"), html);
        });
      })
      .on("error", function (e) {
        reject(e);
      });
  });
  return resultPromise;
}
exports.loadDataset = loadDataset;

/**
 * 写入文件
 * @param {*} path
 * @param {*} data
 */
function toFileSync(path, data) {
  init();
  fs.writeFileSync(path, data);
}

/**
 * 是否有缓存
 * @param {*} path
 * @returns
 */
function hasCache(path) {
  const hasFile = fs.existsSync(path);
  if (hasFile) {
    return { exist: hasFile, content: fs.readFileSync(path) };
  }
  return { exist: false, content: "" };
}


/**
 * 初始化文件夹
 */
function init() {
  if (!fs.existsSync(cPath)) {
    fs.mkdirSync(cPath);
  }
}
