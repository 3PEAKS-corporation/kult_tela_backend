const fs = require('fs')

const LOCATION = './data/json/'

let DATA = {
  menus: null,
  plans: null,
  exercise_videos: null,
  workout_levels: null,
  workouts: null
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
  { name: 'workouts', file: 'workouts.json' }
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
