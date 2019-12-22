const fs = require('fs')

const LOCATION = './data/json/'

let DATA = {
  menus: null,
  plans: null,
  physical_statuses: null
}

const CONFIG = [
  {
    name: 'plans',
    file: 'plans.json'
  },
  {
    name: 'menus',
    file: 'food_menus.json'
  },
  {
    name: 'physical_statuses',
    file: 'physical_statuses.json'
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
