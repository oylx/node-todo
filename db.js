const homedir = require("os").homedir();
const home = process.env.home || homedir;
const { fstat } = require("fs");
const path = require("path");
const fs = require("fs");
const { resolve } = require("path");
const { stringify } = require("querystring");
const dbPath = path.join(home, ".todo");

module.exports.read = (title, p = dbPath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(p, { flag: "a+" }, (error, data) => {
      if (error) {
        reject(error);
      } else {
        let list
        try {
          list = JSON.parse(data.toString())
        } catch (e) {
          list = []
        }
        resolve(list)
      }
    });
  })
}
module.exports.write = (data, p = dbPath) => {
  return new Promise((resolve, reject) => {
    const string = JSON.stringify(data)
    fs.writeFile(p, string, (error) => {
      if (error) {
        reject(error)
      } else {

      }
    })
  })
}
