const fs = require('fs')

const LOCATION = './data/json/'

let DATA = {
  menus: null,
  plans: null,
  exercise_videos: null,
  workout_levels: null,
  workouts: null,
  food_tips_videos: null,

  admin_roles: null
}

const copyDATA = () => {
  return JSON.parse(JSON.stringify(DATA))
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
    name: 'exercise_videos',
    file: 'exercise_videos.json'
  },
  {
    name: 'workout_levels',
    file: 'workout_levels.json'
  },
  { name: 'workouts', file: 'workouts.json' },
  { name: 'food_tips_videos', file: 'food_tips_videos.json' },
  {
    name: 'admin_roles',
    file: 'admin_roles.json'
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
  DATA,
  copyDATA
}
