const { db, utils } = require('../../services')

const Recipe = {
  async getOneById(req, res) {
    const {id} = req.params

    if(!id) 
        return utils.response.error(res)

    const query = `SELECT * FROM recipes WHERE id=$1`
    const values = [id]

    try {
        const {rows} = await db.query(query, values)
        if(rows[0])
            return utils.response.success(res, rows[0])
        else return utils.response.error(res, "Рецепт не найден")
    } catch (error) {
        return utils.response.error(res, "Рецепт не найден")
    }
  },

  async getAllForList(req, res) {
    const query = `SELECT id, name, calories, weight FROM recipes`

    try {
        const {rows} = await db.query(query)
        return utils.response.success(res, rows)
    } catch (error) {
        return utils.response.error(res, "Ошибка соединения")
    }
  }
}

module.exports = Recipe
