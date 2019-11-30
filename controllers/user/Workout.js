const { db, utils } = require('../../services')

const Recipe = {
  async getOne(req, res) {
    const {id} = req.params
    const query = `SELECT * FROM workouts WHERE id=$1`
    const values = [id]
    try {
        const {rows} = await db.query(query, values)
        if(rows[0])
            return utils.response.success(res, rows[0])
        else return utils.response.error(res, "Тренировка не найдена")
    } catch (error) {
        return utils.response.error(res, "Тренировка не найдена")
    }
  }
}

module.exports = Recipe
