const { db, utils } = require('../../services')

const Recipe = {
  async create(req, res) {
    const image_src = req.file
    const { name, description, weight, calories, proteins, carbohydrates, fat, products  } = req.body

    if (!utils.verify([name, description, image_src, weight, calories, proteins, carbohydrates, fat, products]))
      return utils.response.error(res)

    const query = `INSERT INTO recipes(
        name, description, weight, calories, proteins, carbohydrates, fat, image_src, products)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);`

    const values = [name, description, weight, calories, proteins, carbohydrates, fat, image_src, products]

    try {
      const result = await db.query(query, values)
      return utils.response.success(res)
    } catch (error) {
      utils.response.error(res, 'Неправильный формат данных')
      throw error;
    }
  }
}

module.exports = Recipe
