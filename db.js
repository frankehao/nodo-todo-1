const homedir = require('os').homedir()
const home = process.env.ENV_VARIABLE || homedir
const p = require('path')
const dbPath = p.join(home, '.todo')
const fs = require('fs')
const db = {
  read(path = dbPath) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, { flag: 'a+' }, (error, data) => {
        //data是数据库里的数据
        if (error) {
          console.log(error)
          reject(error)
        } else {
          let list
          try {
            list = JSON.parse(data.toString()) //如果数据库里的数据为空，就赋值为空数组
          } catch (error2) {
            list = []
          }
          resolve(list)
        }
      })
    })
  },
  write(list, path = dbPath) {
    return new Promise((resolve, reject) => {
      const string = JSON.stringify(list)
      fs.writeFile(dbPath, string + '\n', (error) => {
        if (error) return console.log(error)
        resolve()
      })
    })
  },
}

module.exports = db
