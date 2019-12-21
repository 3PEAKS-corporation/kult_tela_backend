const fs = require('fs')

const LOCATION = './data/json/'

let DATA = {
  menus: null,
  plans: null
}

const CONFIG = [
  {
    name: 'plans',
    file: 'plans.json'
  },
  {
    name: 'menus',
    file: 'food_menus.json'
  }
]

const initData = () => {
  CONFIG.forEach(item => {
    const json = fs.readFileSync(LOCATION + item.file)
    DATA[item.name] = JSON.parse(json)
  })
}

module.exports = {
  initData,
  DATA
}
